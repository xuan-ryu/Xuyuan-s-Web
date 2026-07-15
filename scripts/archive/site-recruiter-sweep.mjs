// One-off probe: recruiter's-eye sweep of the whole site (2026-07-14).
import { launchBrowser, skipLoader, preScroll } from "../_pw.mjs";
const outDir = process.argv[2];
const browser = await launchBrowser();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
await skipLoader(ctx);
const page = await ctx.newPage();

const stops = [
  ["home-0", "/", 0],
  ["home-1", "/", 2000],
  ["home-2", "/", 5200],
  ["work-0", "/work", 0],
  ["work-1", "/work", 1200],
  ["vicino-0", "/work/vicino-ai", 0],
  ["vicino-1", "/work/vicino-ai", 2400],
  ["nyma-0", "/work/nyma", 0],
  ["nyma-1", "/work/nyma", 2400],
  ["cloud-0", "/work/cloud-support-futures", 0],
  ["froghire-0", "/work/froghire-ai", 0],
  ["about-0", "/about", 0],
];
let lastRoute = null;
for (const [name, route, y] of stops) {
  if (route !== lastRoute) {
    await page.goto(`http://localhost:3000${route}`, { waitUntil: "networkidle" });
    await preScroll(page, { step: 800, delay: 100 });
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(600);
    lastRoute = route;
  }
  await page.evaluate((yy) => window.scrollTo(0, yy), y);
  await page.waitForTimeout(1400);
  await page.screenshot({ path: `${outDir}/${name}.png` });
}
await browser.close();
