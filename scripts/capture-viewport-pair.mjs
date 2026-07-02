// Capture live + react at an arbitrary viewport for the main routes.
// Usage: node scripts/capture-viewport-pair.mjs <outDir> <width> <height> "<route1,route2>" "<y1,y2,...>"
import fs from "node:fs/promises";
import path from "node:path";
import { launchBrowser, preScroll, routeName, skipLoader } from "./_pw.mjs";

const [, , outName, wArg, hArg, routesArg, offsetsArg] = process.argv;
const width = Number(wArg) || 1536;
const height = Number(hArg) || 750;
const routes = (routesArg || "/").split(",");
const offsets = (offsetsArg || "0").split(",").map(Number);

const outDir = path.join(process.cwd(), "audit-screenshots", outName);
await fs.mkdir(outDir, { recursive: true });

const targets = [
  ["live", "https://xuyuan.framer.website"],
  ["react", "http://localhost:3000"],
];

const browser = await launchBrowser();
try {
  for (const [name, base] of targets) {
    const context = await browser.newContext({
      viewport: { width, height },
      deviceScaleFactor: 1,
    });
    await skipLoader(context);
    for (const route of routes) {
      const page = await context.newPage();
      try {
        await page.goto(`${base}${route}`, {
          waitUntil: "networkidle",
          timeout: 60000,
        });
        await page.waitForTimeout(2500);
        // progressive pre-scroll: loads lazy media and settles appear effects
        await preScroll(page, { step: 500, delay: 120 });
        await page.waitForTimeout(800);
        for (const y of offsets) {
          await page.evaluate((top) => window.scrollTo(0, top), y);
          await page.waitForTimeout(1200);
          const file = `${name}__${routeName(route)}__y${y}.png`;
          await page.screenshot({ path: path.join(outDir, file) });
          console.log(`captured ${file}`);
        }
      } catch (e) {
        console.error(`failed ${name} ${route}: ${e.message}`);
      } finally {
        await page.close();
      }
    }
    await context.close();
  }
} finally {
  await browser.close();
}
