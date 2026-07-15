// One-off probe: two-part structure — openers, rail groups, 1.2 chapter.
import { launchBrowser, skipLoader, preScroll } from "../_pw.mjs";
const outDir = process.argv[2];
const browser = await launchBrowser();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
await skipLoader(ctx);
const page = await ctx.newPage();
await page.goto("http://localhost:3000/work/pulse", { waitUntil: "networkidle" });
await preScroll(page, { step: 700, delay: 120 });
const total = await page.evaluate(() => document.body.scrollHeight);
console.log("height:", total);
let i = 0;
for (const sel of [".pulse-part", "#act-surfaces", "#act-surfaces .pulse-section-full", ".pulse-part + * , .pulse-part"] ) {}
for (const [name, scroll] of [
  ["part1-opener", () => document.querySelectorAll(".pulse-part")[0]],
  ["surfaces-head", () => document.getElementById("act-surfaces")],
  ["part2-opener", () => document.querySelectorAll(".pulse-part")[1]],
]) {
  await page.evaluate((idx) => {
    const targets = {
      "part1-opener": document.querySelectorAll(".pulse-part")[0],
      "surfaces-head": document.getElementById("act-surfaces"),
      "part2-opener": document.querySelectorAll(".pulse-part")[1],
    };
    const el = targets[idx];
    if (el) window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 200);
  }, name);
  await page.waitForTimeout(1600);
  await page.screenshot({ path: `${outDir}/tp-${name}.png` });
}
await browser.close();
