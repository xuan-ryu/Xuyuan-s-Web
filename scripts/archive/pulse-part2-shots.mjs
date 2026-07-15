// One-off probe: tile-screenshot /work/pulse's Part 2 (design engineering)
// reading track at 1536 — click the second fork door, then walk the page.
// Usage: node pulse-part2-shots.mjs <outDir>
import fs from "node:fs";
import path from "node:path";
import { launchBrowser, skipLoader, preScroll } from "../_pw.mjs";

const outDir = process.argv[2];
fs.mkdirSync(outDir, { recursive: true });

const browser = await launchBrowser();
const ctx = await browser.newContext({ viewport: { width: 1536, height: 1000 } });
await skipLoader(ctx);
const page = await ctx.newPage();
await page.goto("http://localhost:3000/work/pulse", { waitUntil: "networkidle" });
await page.waitForTimeout(1200);
await page.click(".pulse-door:nth-of-type(2)");
await page.waitForTimeout(900);
await preScroll(page, { step: 600, delay: 140 });
await page.waitForTimeout(800);
const total = await page.evaluate(() => document.body.scrollHeight);
console.log(`part2 page height: ${total}`);
for (let y = 0, i = 0; y < total; y += 1000, i++) {
  await page.evaluate((yy) => window.scrollTo(0, yy), y);
  await page.waitForTimeout(1300);
  await page.screenshot({
    path: path.join(outDir, `p2-${String(i).padStart(2, "0")}.png`),
  });
}
await ctx.close();
await browser.close();
