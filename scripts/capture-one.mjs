// Capture one URL at several scroll offsets.
// Usage: node scripts/capture-one.mjs <url> <outPrefix> <y1,y2,...> [width] [height]
import { launchBrowser, skipLoader } from "./_pw.mjs";

const [, , url, outPrefix, offsetsArg, widthArg, heightArg] = process.argv;
const offsets = (offsetsArg || "0").split(",").map(Number);
const vpWidth = Number(widthArg) || 1440;
const vpHeight = Number(heightArg) || 1000;

const browser = await launchBrowser();
const page = await browser.newPage({ viewport: { width: vpWidth, height: vpHeight } });
await skipLoader(page);
await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
await page.waitForTimeout(2500);
for (const y of offsets) {
  await page.evaluate((top) => window.scrollTo(0, top), y);
  await page.waitForTimeout(1300);
  const file = `${outPrefix}__y${y}.png`;
  await page.screenshot({ path: file });
  console.log(`captured ${file}`);
}
await browser.close();
