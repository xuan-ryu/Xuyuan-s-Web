// One-off probe: what a REAL browser shows post-hydration on /work/pulse.
import { launchBrowser, skipLoader } from "../_pw.mjs";
const browser = await launchBrowser();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
await skipLoader(ctx);
const page = await ctx.newPage();
await page.goto("http://localhost:3000/work/pulse", { waitUntil: "networkidle" });
await page.waitForTimeout(2500);
const probe = await page.evaluate(() => ({
  lede: document.querySelector(".case-hero-lede")?.textContent?.slice(0, 90),
  ch01: document.querySelector("#act-product h2")?.textContent,
  s1heading: document.querySelector("#act-product .pulse-section-copy h3")?.textContent,
  mapNodes: document.querySelectorAll(".pulse-map .pflow-node").length,
  turn: document.querySelector(".pulse-turn-claim")?.textContent?.slice(0, 80),
}));
console.log(JSON.stringify(probe, null, 2));
await page.screenshot({ path: process.argv[2] + "/hydrated-hero.png" });
await browser.close();
