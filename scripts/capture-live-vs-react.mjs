// Capture live + react desktop screenshots at planned scroll offsets per route.
// Usage: node scripts/capture-live-vs-react.mjs [outDirName]
import fs from "node:fs/promises";
import path from "node:path";
import { launchBrowser, routeName, skipLoader } from "./_pw.mjs";

// route -> scroll offsets (px) to capture
const plan = {
  "/": [0, 900, 1700, 2600, 3600, 4700, 5900, 7200],
  "/about": [0, 1000, 2200, 3400, 4600, 5800, 7000],
  "/work": [0, 900, 1800, 2700],
  "/contact": [0, 900],
  "/work/vicino-ai": [0, 1200, 2400, 3600, 4800],
  "/work/froghire-ai": [0, 1200, 2400, 3600],
};

const targets = [
  ["live", "https://xuyuan.framer.website"],
  ["react", "http://localhost:3000"],
];

const outName = process.argv[2] || "live-vs-react";
const outDir = path.join(process.cwd(), "audit-screenshots", outName);
await fs.mkdir(outDir, { recursive: true });

const browser = await launchBrowser();
try {
  for (const [targetName, baseUrl] of targets) {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 1000 },
      deviceScaleFactor: 1,
    });
    // skip the intro loader on the react build
    await skipLoader(context);

    for (const [route, offsets] of Object.entries(plan)) {
      const page = await context.newPage();
      const url = `${baseUrl}${route}`;
      try {
        await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
        await page.waitForTimeout(2500);
        // dismiss any click-to-skip loader still up on the live site
        await page.mouse.click(720, 500).catch(() => {});
        await page.waitForTimeout(1500);

        for (const y of offsets) {
          await page.evaluate((top) => window.scrollTo(0, top), y);
          await page.waitForTimeout(1400);
          const fileName = `${targetName}__${routeName(route)}__y${y}.png`;
          await page.screenshot({ path: path.join(outDir, fileName) });
          console.log(`captured ${fileName}`);
        }
      } catch (error) {
        console.error(`failed ${targetName} ${route}: ${error.message}`);
      } finally {
        await page.close();
      }
    }
    await context.close();
  }
} finally {
  await browser.close();
}
console.log(`done -> ${outDir}`);
