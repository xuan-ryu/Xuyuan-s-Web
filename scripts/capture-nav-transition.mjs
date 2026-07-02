// Click a nav link and capture frames of the page transition.
// Usage: node scripts/capture-nav-transition.mjs <url> <linkText> <outPrefix>
import { launchBrowser, skipLoader } from "./_pw.mjs";

const [, , url, linkText, outPrefix] = process.argv;
const browser = await launchBrowser();
const page = await browser.newPage({
  viewport: { width: 1536, height: 770 },
  reducedMotion: "no-preference",
});
await skipLoader(page, ["loader-shown"]);
page.on('console', m => console.log('[browser]', m.text().slice(0,120)));
await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
await page.waitForTimeout(2000);

const link = page.locator(`a:has-text("${linkText}")`).first();
await link.click({ noWaitAfter: true });
const marks = [300, 600, 900, 1300, 1900];
const t0 = Date.now();
for (const t of marks) {
  const wait = t - (Date.now() - t0);
  if (wait > 0) await page.waitForTimeout(wait);
  await page.screenshot({ path: `${outPrefix}__t${t}.png` });
}
console.log("done");
await browser.close();
