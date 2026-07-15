// One-off probe: phone view of the hero switch + product track.
import { launchBrowser, skipLoader } from "../_pw.mjs";
const outDir = process.argv[2];
const browser = await launchBrowser();
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
await skipLoader(ctx);
const page = await ctx.newPage();
await page.goto("http://localhost:3000/work/pulse", { waitUntil: "networkidle" });
await page.waitForTimeout(1200);
const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
console.log("phone overflow:", overflow, "height:", await page.evaluate(() => document.body.scrollHeight));
await page.evaluate(() => window.scrollTo(0, 900));
await page.waitForTimeout(1000);
await page.screenshot({ path: `${outDir}/phone-switch.png` });
await browser.close();
