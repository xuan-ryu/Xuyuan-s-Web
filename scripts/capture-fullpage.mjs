// Full-page screenshot after a progressive pre-scroll (loads lazy content).
// Usage: node scripts/capture-fullpage.mjs <url> <outFile> [width]
import { launchBrowser, preScroll, skipLoader } from "./_pw.mjs";

const [, , url, outFile, widthArg] = process.argv;
const vpWidth = Number(widthArg) || 1440;

const browser = await launchBrowser();
const page = await browser.newPage({ viewport: { width: vpWidth, height: 1000 } });
await skipLoader(page);
await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
await page.waitForTimeout(2000);
await preScroll(page, { step: 500, delay: 150 });
await page.waitForTimeout(1500);
await page.screenshot({ path: outFile, fullPage: true });
console.log(`saved ${outFile}`);
await browser.close();
