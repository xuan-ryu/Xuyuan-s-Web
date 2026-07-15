// One-off probe: tile-screenshot /work/pulse after the 2026-07-14 lean pass,
// at 1440 and 1536 (owner viewport). Usage: node pulse-lean-shots.mjs <outDir>
import fs from "node:fs";
import path from "node:path";
import { launchBrowser, skipLoader, preScroll } from "../_pw.mjs";

const outDir = process.argv[2];
fs.mkdirSync(outDir, { recursive: true });

const browser = await launchBrowser();
for (const width of [1440, 1536]) {
  const ctx = await browser.newContext({ viewport: { width, height: 1000 } });
  await skipLoader(ctx);
  const page = await ctx.newPage();
  await page.goto("http://localhost:3000/work/pulse", { waitUntil: "networkidle" });
  await preScroll(page, { step: 600, delay: 140 });
  await page.waitForTimeout(800);
  const total = await page.evaluate(() => document.body.scrollHeight);
  console.log(`w${width} page height: ${total}`);
  for (let y = 0, i = 0; y < total; y += 1000, i++) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(1300);
    await page.screenshot({
      path: path.join(outDir, `w${width}-${String(i).padStart(2, "0")}.png`),
    });
  }
  await ctx.close();
}
await browser.close();
