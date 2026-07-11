// Full-page screenshot sweep for the button/mobile-UI audit.
// Usage: node scripts/ui-survey.mjs <outDir> [desktop|mobile|both]
import { launchBrowser } from "./_pw.mjs";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const outDir = process.argv[2];
const mode = process.argv[3] ?? "both";
if (!outDir) throw new Error("outDir required");
mkdirSync(outDir, { recursive: true });

const ROUTES = [
  ["home", "/"],
  ["work", "/work"],
  ["about", "/about"],
  ["contact", "/contact"],
  ["nyma", "/work/nyma"],
  ["pulse", "/work/pulse"],
  ["vicino", "/work/vicino-ai"],
  ["froghire", "/work/froghire-ai"],
  ["roper", "/work/roper-center"],
  ["cloud", "/work/cloud-support-futures"],
  ["hunger", "/work/hunger1942"],
];

const VIEWPORTS = {
  desktop: { width: 1440, height: 900, isMobile: false, hasTouch: false },
  mobile: { width: 390, height: 844, isMobile: true, hasTouch: true },
};

const browser = await launchBrowser();
for (const [vpName, vp] of Object.entries(VIEWPORTS)) {
  if (mode !== "both" && mode !== vpName) continue;
  const ctx = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    isMobile: vp.isMobile,
    hasTouch: vp.hasTouch,
    deviceScaleFactor: 1,
  });
  await ctx.addInitScript(() => sessionStorage.setItem("skip-loader", "1"));
  const page = await ctx.newPage();
  for (const [name, path] of ROUTES) {
    try {
      await page.goto(`http://localhost:3000${path}`, {
        waitUntil: "networkidle",
        timeout: 45000,
      });
      await page.waitForTimeout(1200);
      // settle lazy reveals: walk the page once
      await page.evaluate(async () => {
        const h = document.documentElement.scrollHeight;
        for (let y = 0; y < h; y += 600) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 40));
        }
        window.scrollTo(0, 0);
      });
      await page.waitForTimeout(800);
      await page.screenshot({
        path: join(outDir, `${vpName}-${name}.png`),
        fullPage: true,
      });
      console.log(`ok ${vpName}-${name}`);
    } catch (e) {
      console.log(`FAIL ${vpName}-${name}: ${e.message.split("\n")[0]}`);
    }
  }
  await ctx.close();
}
await browser.close();
