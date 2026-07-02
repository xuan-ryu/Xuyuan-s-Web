// Screenshot the home How-I-Work section at a given viewport width.
// Usage: node scripts/capture-how.mjs <url> <outPrefix> [width]
import { launchBrowser, skipLoader } from "./_pw.mjs";

const [, , url, outPrefix, widthArg] = process.argv;
const vpWidth = Number(widthArg) || 1440;

const browser = await launchBrowser();
const page = await browser.newPage({ viewport: { width: vpWidth, height: 1000 } });
await skipLoader(page);
await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
await page.waitForTimeout(2500);

const top = await page.evaluate(() => {
  const el = document.querySelector(".home-how");
  if (!el) return null;
  return el.getBoundingClientRect().top + window.scrollY;
});
if (top == null) {
  console.error("no .home-how found");
  await browser.close();
  process.exit(1);
}
console.log(`.home-how top = ${Math.round(top)}`);
for (const [label, y] of [
  ["top", top],
  ["mid", top + 600],
  ["bottom", top + 1200],
]) {
  await page.evaluate((t) => window.scrollTo(0, t), y);
  await page.waitForTimeout(1300);
  const file = `${outPrefix}__${label}.png`;
  await page.screenshot({ path: file });
  console.log(`captured ${file}`);
}
await browser.close();
