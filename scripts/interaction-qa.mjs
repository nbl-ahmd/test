import { chromium } from "@playwright/test";

const BASE = process.env.QA_URL ?? "http://localhost:3000/";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const VIEWPORTS = [
  { label: "phone-390", w: 390, h: 844, dpr: 3, touch: true },
  { label: "desktop-1440", w: 1440, h: 900, dpr: 1, touch: false },
];

const results = [];

for (const vp of VIEWPORTS) {
  const browser = await chromium.launch();

  // --- reduced motion ---
  {
    const ctx = await browser.newContext({
      viewport: { width: vp.w, height: vp.h },
      deviceScaleFactor: vp.dpr,
      isMobile: vp.touch,
      hasTouch: vp.touch,
      reducedMotion: "reduce",
    });
    const page = await ctx.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto(BASE, { waitUntil: "load" });
    await sleep(3500);
    const rm = await page.evaluate(() => {
      const track = document.querySelector("[data-process-panel]")?.parentElement;
      const lines = document.querySelector("#manifesto [class*='desktop:absolute']");
      const servicesList = document.querySelector("#services ul");
      const pin = servicesList?.closest("div[class*='desktop:h-svh']");
      return {
        overflow: document.documentElement.scrollWidth - window.innerWidth,
        processDisplay: track ? getComputedStyle(track).display : null,
        manifestoLinesPosition: lines ? getComputedStyle(lines).position : "static",
        servicesPinHeight: pin ? Math.round(pin.getBoundingClientRect().height) : null,
        canvas: !!document.querySelector("canvas"),
        viewportH: Math.round(window.innerHeight),
      };
    });
    results.push({ vp: vp.label, kind: "reduced-motion", ...rm, errors: errors.length });
    await ctx.close();
  }

  // --- keyboard only ---
  {
    const ctx = await browser.newContext({
      viewport: { width: vp.w, height: vp.h },
      deviceScaleFactor: vp.dpr,
      isMobile: vp.touch,
      hasTouch: vp.touch,
    });
    const page = await ctx.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto(BASE, { waitUntil: "load" });
    await sleep(3500);

    // Tab until the menu button is focused.
    let reachedMenu = false;
    for (let i = 0; i < 40; i += 1) {
      await page.keyboard.press("Tab");
      const isMenu = await page.evaluate(() => {
        const el = document.activeElement;
        return !!el && el.matches?.('button[aria-controls="site-menu"]');
      });
      if (isMenu) {
        reachedMenu = true;
        break;
      }
    }
    await page.keyboard.press("Enter");
    await sleep(800);
    const menuOpen = await page.evaluate(
      () => getComputedStyle(document.getElementById("site-menu")).visibility === "visible",
    );
    await page.keyboard.press("Escape");
    await sleep(700);
    const menuClosed = await page.evaluate(
      () => getComputedStyle(document.getElementById("site-menu")).visibility === "hidden",
    );

    // FAQ toggle via keyboard.
    const faqBtn = page.locator("#faq button[aria-expanded]").first();
    await faqBtn.focus();
    const faqBefore = await faqBtn.getAttribute("aria-expanded");
    await page.keyboard.press("Enter");
    await sleep(600);
    const faqAfter = await faqBtn.getAttribute("aria-expanded");

    // Form field reachable + typable.
    const nameInput = page.locator("#name");
    await nameInput.focus();
    await page.keyboard.type("Test");
    const nameValue = await nameInput.inputValue();

    results.push({
      vp: vp.label,
      kind: "keyboard",
      reachedMenu,
      menuOpen,
      menuClosed,
      faqBefore,
      faqAfter,
      faqToggled: faqBefore !== faqAfter,
      nameValue,
      errors: errors.length,
    });
    await ctx.close();
  }

  await browser.close();
}

console.log(JSON.stringify(results, null, 2));
