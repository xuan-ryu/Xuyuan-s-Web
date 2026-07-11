// Second-round evidence: mobile drawer, phone How-I-Work cards, CTA hovers.
import { launchBrowser } from "./_pw.mjs";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const outDir = process.argv[2];
mkdirSync(outDir, { recursive: true });
const browser = await launchBrowser();

// ---- phone ----
const mctx = await browser.newContext({
  viewport: { width: 390, height: 844 },
  isMobile: true,
  hasTouch: true,
  deviceScaleFactor: 1,
});
await mctx.addInitScript(() => sessionStorage.setItem("skip-loader", "1"));
const mp = await mctx.newPage();
await mp.goto("http://localhost:3000/", { waitUntil: "networkidle", timeout: 45000 });
await mp.waitForTimeout(1200);

// drawer open
await mp.tap(".content-nav-inner button, .content-nav-inner [role=button], .content-nav-inner").catch(async () => {
  // fall back: click whatever the toggle is
  const el = await mp.$("header button, [data-nav-toggle], .nav-toggle");
  if (el) await el.tap();
});
await mp.waitForTimeout(700);
await mp.screenshot({ path: join(outDir, "m-drawer.png") });
console.log("drawer html:", await mp.evaluate(() => document.querySelector("header")?.outerHTML.slice(0, 400)));

// close it (tap again) and scroll to the koi how zone
await mp.keyboard.press("Escape").catch(() => {});
await mp.evaluate(() => location.reload());
await mp.waitForTimeout(1800);
const kh = await mp.evaluate(() => {
  const el = document.querySelector(".koi-how");
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return { top: r.top + window.scrollY, height: r.height };
});
console.log("koi-how:", JSON.stringify(kh));
if (kh) {
  for (const frac of [0.15, 0.45, 0.75]) {
    await mp.evaluate(
      ({ y }) => window.scrollTo(0, y),
      { y: kh.top + kh.height * frac - 300 },
    );
    await mp.waitForTimeout(1000);
    await mp.screenshot({ path: join(outDir, `m-how-${Math.round(frac * 100)}.png`) });
  }
  const cards = await mp.evaluate(() => {
    const els = [...document.querySelectorAll(".koi-how [class*=card], .koi-how article, .value-card, [class*=vcard]")];
    return els.map((e) => {
      const r = e.getBoundingClientRect();
      const cs = getComputedStyle(e);
      return { cls: e.className?.toString().slice(0, 40), w: r.width, h: r.height, display: cs.display, opacity: cs.opacity };
    });
  });
  console.log("cards:", JSON.stringify(cards));
}
await mctx.close();

// ---- desktop hovers ----
const dctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
await dctx.addInitScript(() => sessionStorage.setItem("skip-loader", "1"));
const dp = await dctx.newPage();
await dp.goto("http://localhost:3000/about", { waitUntil: "networkidle", timeout: 45000 });
await dp.waitForTimeout(1000);
const resume = dp.locator(".cta--solid").first();
await resume.scrollIntoViewIfNeeded();
await dp.waitForTimeout(900);
await resume.hover();
await dp.waitForTimeout(500);
await dp.screenshot({ path: join(outDir, "d-resume-hover.png") });

await dp.goto("http://localhost:3000/contact", { waitUntil: "networkidle", timeout: 45000 });
await dp.waitForTimeout(800);
await dp.evaluate(() => document.querySelector(".ctc-form-section")?.scrollIntoView());
await dp.waitForTimeout(600);
await dp.locator(".ctc-submit").hover();
await dp.waitForTimeout(500);
await dp.screenshot({ path: join(outDir, "d-submit-hover.png") });

await browser.close();
console.log("done");
