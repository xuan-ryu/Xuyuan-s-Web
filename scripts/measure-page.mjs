// Print scrollHeight for a URL. Usage: node scripts/measure-page.mjs <url>
import { launchBrowser } from "./_pw.mjs";

const browser = await launchBrowser();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
await page.goto(process.argv[2], { waitUntil: "networkidle", timeout: 60000 });
await page.waitForTimeout(2000);
console.log("scrollHeight:", await page.evaluate(() => document.body.scrollHeight));
await browser.close();
