import { chromium } from "@playwright/test";

const BASE = process.env.QA_URL ?? "http://localhost:3000/";
const WIDTHS = [320, 768, 1024, 1440, 2560];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await chromium.launch();
const results = [];

for (const w of WIDTHS) {
  const ctx = await browser.newContext({
    viewport: { width: w, height: w < 768 ? 844 : 900 },
    deviceScaleFactor: w < 768 ? 2 : 1,
    isMobile: w < 768,
    hasTouch: w < 768,
  });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: "load" });
  await sleep(3800);

  const r = await page.evaluate(() => {
    const out = { w: window.innerWidth, lefts: [], headingOverflow: [], orphans: [], overlaps: [] };

    // Container content-left alignment.
    const containers = Array.from(document.querySelectorAll('[class*="max-w-[1600px]"]')).filter(
      (c) => getComputedStyle(c).position !== "fixed",
    );
    out.lefts = Array.from(
      new Set(
        containers.map((c) => {
          const cs = getComputedStyle(c);
          return Math.round(c.getBoundingClientRect().left + parseFloat(cs.paddingLeft || "0"));
        }),
      ),
    ).sort((a, b) => a - b);

    // Heading horizontal overflow.
    for (const h of document.querySelectorAll("h1, h2, h3, .display")) {
      if (h.scrollWidth > h.clientWidth + 1 && h.clientWidth > 0) {
        out.headingOverflow.push((h.textContent || "").trim().slice(0, 30) + ":" + h.scrollWidth + ">" + h.clientWidth);
      }
    }

    // Single-word orphans on multi-line headings.
    for (const h of document.querySelectorAll("h1, h2, h3")) {
      const walker = document.createTreeWalker(h, NodeFilter.SHOW_TEXT);
      const words = [];
      let node;
      while ((node = walker.nextNode())) {
        const text = node.textContent || "";
        const parent = node.parentElement;
        if (!parent || parent.closest(".label")) continue;
        let idx = 0;
        for (const part of text.split(/(\s+)/)) {
          if (part.trim()) {
            const range = document.createRange();
            range.setStart(node, idx);
            range.setEnd(node, idx + part.length);
            const rect = range.getBoundingClientRect();
            if (rect.width > 0) {
              words.push({ top: rect.top, lh: parseFloat(getComputedStyle(parent).lineHeight) || 0 });
            }
          }
          idx += part.length;
        }
      }
      if (words.length < 2) continue;
      const lineHeight = Math.max(...words.map((w) => w.lh));
      if (!lineHeight) continue;
      const tops = words.map((w) => w.top);
      const maxTop = Math.max(...tops);
      const minTop = Math.min(...tops);
      const visualLines = Math.round((maxTop - minTop) / lineHeight) + 1;
      // Last visual line = words whose top is within 60% of a line height of
      // the lowest top (tolerates italic/serif metric differences).
      const lastLine = words.filter((w) => w.top >= maxTop - lineHeight * 0.6);
      if (visualLines >= 2 && lastLine.length === 1) {
        out.orphans.push((h.textContent || "").trim().slice(0, 40));
      }
    }

    // Text vs right-stage scene zone (manifesto/services/clients/faq/contact).
    const innerW = window.innerWidth;
    const contentW = Math.min(innerW, 1600);
    const gutter = Math.min(64, Math.max(16, innerW * 0.04));
    const containerW = contentW - 2 * gutter;
    const containerLeft = (innerW - contentW) / 2 + gutter;
    const limitPx = containerLeft + 0.57 * containerW;
    for (const sid of ["manifesto", "services", "clients", "faq", "contact"]) {
      const sec = document.getElementById(sid);
      if (!sec) continue;
      const walker = document.createTreeWalker(sec, NodeFilter.SHOW_TEXT);
      let node;
      let worst = 0;
      let text = "";
      while ((node = walker.nextNode())) {
        if (!node.textContent || !node.textContent.trim()) continue;
        const p = node.parentElement;
        if (!p || p.closest(".sr-only")) continue;
        const cs = getComputedStyle(p);
        if (cs.display === "none" || cs.visibility === "hidden" || cs.position === "fixed") continue;
        const range = document.createRange();
        range.selectNodeContents(node);
        const rect = range.getBoundingClientRect();
        if (rect.right > worst) {
          worst = rect.right;
          text = node.textContent.trim().slice(0, 24);
        }
      }
      if (worst > limitPx + 4) {
        out.overlaps.push({ sid, right: Math.round(worst), limit: Math.round(limitPx), text });
      }
    }

    return out;
  });

  results.push(r);
  await ctx.close();
}

await browser.close();
console.log(JSON.stringify(results, null, 2));
