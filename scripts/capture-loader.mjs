// Capture the session loader animation frames (does NOT skip the loader).
// Usage: node scripts/capture-loader.mjs <url> <outPrefix> [width]
import { launchBrowser } from "./_pw.mjs";

const [, , url, outPrefix, widthArg] = process.argv;
const vpWidth = Number(widthArg) || 1440;

const browser = await launchBrowser();
const page = await browser.newPage({ viewport: { width: vpWidth, height: 1000 } });
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });

const marks = [700, 1500, 2600, 3600, 4200, 5000];
const start = Date.now();
for (const t of marks) {
  const wait = t - (Date.now() - start);
  if (wait > 0) await page.waitForTimeout(wait);
  await page.screenshot({ path: `${outPrefix}__t${t}.png` });
}
await browser.close();
console.log("done");
