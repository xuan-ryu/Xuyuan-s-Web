// One-off probe: part-switch behavior + per-page videos.
import { launchBrowser, skipLoader } from "../_pw.mjs";
const outDir = process.argv[2];
const browser = await launchBrowser();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
await skipLoader(ctx);
const page = await ctx.newPage();
await page.goto("http://localhost:3000/work/pulse", { waitUntil: "networkidle" });
await page.waitForTimeout(1500);

const state1 = await page.evaluate(() => ({
  view: document.querySelector(".pulse-case-page")?.getAttribute("data-view"),
  p1visible: !!document.querySelector('#pulse-view-product')?.offsetParent,
  p2visible: !!document.querySelector('#pulse-view-system')?.offsetParent,
  railP1: !!document.querySelector('[data-rail] [data-view-panel="product"]')?.offsetParent,
  railP2: !!document.querySelector('[data-rail] [data-view-panel="system"]')?.offsetParent,
  videos: Array.from(document.querySelectorAll(".pulse-view video")).map((v) => v.getAttribute("src")),
  height: document.body.scrollHeight,
}));
console.log("default:", JSON.stringify(state1, null, 1));
await page.screenshot({ path: `${outDir}/sw-hero.png` });

await page.click('.pulse-switch-tab:nth-of-type(2)');
await page.waitForTimeout(900);
const state2 = await page.evaluate(() => ({
  view: document.querySelector(".pulse-case-page")?.getAttribute("data-view"),
  p1visible: !!document.querySelector('#pulse-view-product')?.offsetParent,
  p2visible: !!document.querySelector('#pulse-view-system')?.offsetParent,
  height: document.body.scrollHeight,
}));
console.log("after switch:", JSON.stringify(state2, null, 1));
await page.screenshot({ path: `${outDir}/sw-part2.png` });
await browser.close();
