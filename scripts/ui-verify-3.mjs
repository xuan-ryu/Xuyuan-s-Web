// Post-change verification: new drawer, solid hover, phone how-reveal, chips.
import { launchBrowser } from "./_pw.mjs";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const outDir = process.argv[2];
mkdirSync(outDir, { recursive: true });
const browser = await launchBrowser();

// ---- phone: drawer + how auto-reveal ----
const mctx = await browser.newContext({
  viewport: { width: 390, height: 844 },
  isMobile: true,
  hasTouch: true,
  deviceScaleFactor: 1,
});
await mctx.addInitScript(() => sessionStorage.setItem("skip-loader", "1"));
const mp = await mctx.newPage();
await mp.goto("http://localhost:3000/work", { waitUntil: "networkidle", timeout: 45000 });
await mp.waitForTimeout(1000);
await mp.tap(".nav-toggle");
await mp.waitForTimeout(900);
await mp.screenshot({ path: join(outDir, "v-drawer.png") });

// how auto-reveal on home
await mp.goto("http://localhost:3000/", { waitUntil: "networkidle", timeout: 45000 });
await mp.waitForTimeout(1500);
const kh = await mp.evaluate(() => {
  const el = document.querySelector(".koi-how");
  const r = el?.getBoundingClientRect();
  return r ? { top: r.top + window.scrollY, height: r.height } : null;
});
await mp.evaluate((y) => window.scrollTo(0, y), kh.top - 200);
await mp.waitForTimeout(1600);
const revealed = await mp.evaluate(() =>
  document.querySelector(".koi-how")?.className.includes("is-revealed"),
);
console.log("phone how revealed on scroll:", revealed);
await mp.evaluate((y) => window.scrollTo(0, y), kh.top + 320);
await mp.waitForTimeout(1200);
await mp.screenshot({ path: join(outDir, "v-how-phone.png") });
await mp.evaluate((y) => window.scrollTo(0, y), kh.top + 1000);
await mp.waitForTimeout(900);
await mp.screenshot({ path: join(outDir, "v-how-phone-2.png") });
await mctx.close();

// ---- desktop: solid hover + hero hint hover ----
const dctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
await dctx.addInitScript(() => sessionStorage.setItem("skip-loader", "1"));
const dp = await dctx.newPage();
await dp.goto("http://localhost:3000/about", { waitUntil: "networkidle", timeout: 45000 });
await dp.waitForTimeout(1000);
const resume = dp.locator(".cta--solid").first();
await resume.scrollIntoViewIfNeeded();
await dp.waitForTimeout(900);
await resume.hover();
await dp.waitForTimeout(600);
await dp.screenshot({ path: join(outDir, "v-resume-hover.png") });

await dp.goto("http://localhost:3000/", { waitUntil: "networkidle", timeout: 45000 });
await dp.waitForTimeout(1500);
await dp.locator(".hero-scroll-hint").hover();
await dp.waitForTimeout(600);
await dp.screenshot({ path: join(outDir, "v-hint-hover.png"), clip: { x: 0, y: 600, width: 720, height: 300 } });

// desktop: how must still be feed-gated (not auto-revealed)
const dRevealed = await dp.evaluate(() => {
  const el = document.querySelector(".koi-how");
  return el ? el.className.includes("is-revealed") : "missing";
});
console.log("desktop how revealed before feeding (want false):", dRevealed);

await browser.close();
console.log("done");
