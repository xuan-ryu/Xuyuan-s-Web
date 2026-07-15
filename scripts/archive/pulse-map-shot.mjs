// One-off probe: the ch01 operating-loop map, desktop + phone.
import { launchBrowser, skipLoader } from "../_pw.mjs";
const outDir = process.argv[2];
const browser = await launchBrowser();
for (const [name, vp] of [["desktop", { width: 1440, height: 1000 }], ["phone", { width: 390, height: 844 }]]) {
  const ctx = await browser.newContext({ viewport: vp });
  await skipLoader(ctx);
  const page = await ctx.newPage();
  await page.goto("http://localhost:3000/work/pulse", { waitUntil: "networkidle" });
  const el = page.locator(".pulse-map").first();
  await el.scrollIntoViewIfNeeded();
  await page.waitForTimeout(2500);
  await page.evaluate(() => window.scrollBy(0, -160));
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${outDir}/map-${name}.png` });
  await ctx.close();
}
await browser.close();
