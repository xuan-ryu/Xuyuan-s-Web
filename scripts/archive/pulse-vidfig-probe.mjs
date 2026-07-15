// One-off probe: the three page-video figures in the product track.
import { launchBrowser, skipLoader } from "../_pw.mjs";
const outDir = process.argv[2];
const browser = await launchBrowser();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
await skipLoader(ctx);
const page = await ctx.newPage();
await page.goto("http://localhost:3000/work/pulse", { waitUntil: "networkidle" });
await page.waitForTimeout(1200);
let i = 0;
for (const src of ["preview", "gate-flow", "calendar-run"]) {
  const fig = page.locator(`video[src*="${src}"]`).first();
  await fig.scrollIntoViewIfNeeded();
  await page.waitForTimeout(2000);
  await page.screenshot({ path: `${outDir}/fig-${i++}-${src}.png` });
}
await browser.close();
