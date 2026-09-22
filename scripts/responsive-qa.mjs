import { chromium, webkit } from "@playwright/test";
import { mkdirSync, writeFileSync } from "node:fs";

const BASE = process.env.QA_URL ?? "http://localhost:3000/";
const OUT = process.env.QA_OUT ?? "qa/responsive";

const VIEWPORTS = [
  { label: "320x568", w: 320, h: 568, touch: true, dpr: 2, engine: "chromium" },
  { label: "360x740", w: 360, h: 740, touch: true, dpr: 2, engine: "chromium" },
  { label: "390x844", w: 390, h: 844, touch: true, dpr: 3, engine: "chromium" },
  { label: "430x932", w: 430, h: 932, touch: true, dpr: 3, engine: "chromium" },
  { label: "600x960", w: 600, h: 960, touch: true, dpr: 2, engine: "chromium" },
  { label: "768x1024", w: 768, h: 1024, touch: true, dpr: 2, engine: "chromium" },
  { label: "820x1180", w: 820, h: 1180, touch: true, dpr: 2, engine: "chromium" },
  { label: "1024x768", w: 1024, h: 768, touch: true, dpr: 2, engine: "chromium" },
  { label: "1180x820", w: 1180, h: 820, touch: false, dpr: 1, engine: "chromium" },
  { label: "1280x720", w: 1280, h: 720, touch: false, dpr: 1, engine: "chromium" },
  { label: "1440x900", w: 1440, h: 900, touch: false, dpr: 1, engine: "chromium" },
  { label: "1920x1080", w: 1920, h: 1080, touch: false, dpr: 1, engine: "chromium" },
  { label: "2560x1440", w: 2560, h: 1440, touch: false, dpr: 1, engine: "chromium" },
  { label: "844x390-landscape", w: 844, h: 390, touch: true, dpr: 3, engine: "chromium" },
  // iOS Safari sanity on WebKit
  { label: "390x844-webkit", w: 390, h: 844, touch: true, dpr: 3, engine: "webkit" },
  { label: "1024x768-webkit", w: 1024, h: 768, touch: true, dpr: 2, engine: "webkit" },
];

const SECTIONS = [
  "hero",
  "manifesto",
  "services",
  "clients",
  "process",
  "work",
  "why",
  "commitments",
  "stack",
  "faq",
  "contact",
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const engines = { chromium, webkit };

async function audit(page, touch) {
  return page.evaluate((isTouch) => {
    const vw = window.innerWidth;
    const out = {
      vw,
      overflow: document.documentElement.scrollWidth - vw,
      wide: [],
      small: [],
      targets: [],
      hoverNone: matchMedia("(hover: none)").matches,
      coarse: matchMedia("(pointer: coarse)").matches,
    };

    const clipped = (el) => {
      let p = el.parentElement;
      while (p && p !== document.body) {
        const cs = getComputedStyle(p);
        if (cs.overflowX === "hidden" || cs.overflowX === "clip") return true;
        p = p.parentElement;
      }
      return false;
    };

    for (const el of document.querySelectorAll("body *")) {
      const cs = getComputedStyle(el);
      if (cs.display === "none" || cs.visibility === "hidden" || Number(cs.opacity) === 0) continue;
      if (cs.position === "fixed") continue;
      const r = el.getBoundingClientRect();
      if (r.width > vw + 1 && !clipped(el)) {
        out.wide.push((el.className?.toString().slice(0, 50) || el.tagName) + ":" + Math.round(r.width));
      }
    }

    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let n;
    let minFont = 999;
    while ((n = walker.nextNode())) {
      if (!n.textContent || !n.textContent.trim()) continue;
      const p = n.parentElement;
      if (!p || p.closest(".sr-only")) continue;
      const cs = getComputedStyle(p);
      if (cs.display === "none" || cs.visibility === "hidden" || Number(cs.opacity) === 0) continue;
      minFont = Math.min(minFont, parseFloat(cs.fontSize));
    }
    out.minFont = Math.round(minFont * 10) / 10;

    if (isTouch) {
      for (const el of document.querySelectorAll('a[href], button, input, textarea, select, [role="button"]')) {
        const cs = getComputedStyle(el);
        if (cs.display === "none" || cs.visibility === "hidden") continue;
        if (el.closest(".sr-only") || el.closest('[aria-hidden="true"]')) continue;
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) continue;
        if (r.height < 44) {
          out.targets.push((el.className?.toString().slice(0, 40) || el.tagName) + ":" + Math.round(r.height));
        }
      }
    }
    return out;
  }, touch);
}

const results = [];

for (const vp of VIEWPORTS) {
  const dir = `${OUT}/${vp.label}`;
  mkdirSync(dir, { recursive: true });

  const browser = await engines[vp.engine].launch();
  const context = await browser.newContext({
    viewport: { width: vp.w, height: vp.h },
    deviceScaleFactor: vp.dpr,
    isMobile: vp.touch,
    hasTouch: vp.touch,
  });
  const page = await context.newPage();
  const errors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  page.on("pageerror", (err) => errors.push("pageerror: " + err.message));

  await page.goto(BASE, { waitUntil: "load" });
  await sleep(4200);

  const a = await audit(page, vp.touch);

  for (let i = 0; i < SECTIONS.length; i += 1) {
    const id = SECTIONS[i];
    await page.evaluate((sid) => {
      const el = document.getElementById(sid);
      if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY, behavior: "instant" });
    }, id);
    await sleep(650);
    await page.screenshot({ path: `${dir}/${String(i + 1).padStart(2, "0")}-${id}.png` });
  }

  const pass =
    a.overflow <= 1 &&
    a.wide.length === 0 &&
    a.minFont >= 12 &&
    a.targets.length === 0 &&
    errors.length === 0;

  results.push({
    label: vp.label,
    engine: vp.engine,
    touch: vp.touch,
    overflow: a.overflow,
    wide: a.wide.slice(0, 5),
    minFont: a.minFont,
    smallTargets: a.targets.slice(0, 5),
    errors: errors.slice(0, 5),
    hoverNone: a.hoverNone,
    coarse: a.coarse,
    pass,
  });

  await browser.close();
  console.log(
    `${pass ? "PASS" : "FAIL"} ${vp.label} overflow=${a.overflow} wide=${a.wide.length} minFont=${a.minFont} smallTargets=${a.targets.length} errors=${errors.length} hoverNone=${a.hoverNone}`,
  );
}

writeFileSync(`${OUT}/results.json`, JSON.stringify(results, null, 2));
const failed = results.filter((r) => !r.pass);
console.log(`\n${results.length - failed.length}/${results.length} viewports pass`);
process.exit(failed.length ? 1 : 0);
