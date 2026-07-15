// One-off probe: the fork after the overview + pulse trace + video chrome.
import { launchBrowser, skipLoader } from "../_pw.mjs";
const outDir = process.argv[2];
const browser = await launchBrowser();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
await skipLoader(ctx);
const page = await ctx.newPage();
await page.goto("http://localhost:3000/work/pulse", { waitUntil: "networkidle" });
await page.waitForTimeout(1500);

// fork below the overview
await page.evaluate(() => {
  const el = document.querySelector(".pulse-fork");
  if (el) window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 480);
});
await page.waitForTimeout(1600);
await page.screenshot({ path: `${outDir}/fk-fork.png` });

// part-1 opener pulse trace
await page.evaluate(() => {
  const el = document.querySelectorAll(".pulse-part")[0];
  if (el) window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 300);
});
await page.waitForTimeout(2200);
await page.screenshot({ path: `${outDir}/fk-opener.png` });

// home video chrome
await page.evaluate(() => {
  const el = document.querySelector('video[src*="preview"]');
  if (el) window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 260);
});
await page.waitForTimeout(1800);
await page.screenshot({ path: `${outDir}/fk-video.png` });

// rail: switch to part 2 via the rail label while deep in part 1
const state = await page.evaluate(() => {
  const btn = document.querySelector('[data-rail-switch="system"]');
  if (btn) btn.click();
  return null;
});
await page.waitForTimeout(1000);
const after = await page.evaluate(() => ({
  view: document.querySelector(".pulse-case-page")?.getAttribute("data-view"),
  y: Math.round(window.scrollY),
  p2: !!document.querySelector("#pulse-view-system")?.offsetParent,
}));
console.log("after rail switch:", JSON.stringify(after));
await page.screenshot({ path: `${outDir}/fk-railswitch.png` });
await browser.close();
