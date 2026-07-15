// One-off probe: review fixes — 1.1 split, map fork+arrow, handoff doors,
// switch landing.
import { launchBrowser, skipLoader } from "../_pw.mjs";
const outDir = process.argv[2];
const browser = await launchBrowser();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
await skipLoader(ctx);
const page = await ctx.newPage();
await page.goto("http://localhost:3000/work/pulse", { waitUntil: "networkidle" });
await page.waitForTimeout(1500);

// 1.1: definition -> map -> three beats
await page.evaluate(() => {
  const el = document.querySelector(".pulse-map");
  if (el) window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 420);
});
await page.waitForTimeout(2200);
await page.screenshot({ path: `${outDir}/fx-map.png` });

// end of part 1: handoff door
await page.evaluate(() => {
  const el = document.querySelector('[data-rail-switch="system"].pulse-door');
  if (el) window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 480);
});
await page.waitForTimeout(1600);
await page.screenshot({ path: `${outDir}/fx-handoff.png` });

// click it: should land on part 2 opener
await page.click('[data-rail-switch="system"].pulse-door');
await page.waitForTimeout(900);
const landing = await page.evaluate(() => {
  const opener = document.querySelectorAll(".pulse-part")[1];
  return {
    view: document.querySelector(".pulse-case-page")?.getAttribute("data-view"),
    openerTop: Math.round(opener.getBoundingClientRect().top),
  };
});
console.log("handoff landing:", JSON.stringify(landing));
await page.screenshot({ path: `${outDir}/fx-landing.png` });
await browser.close();
