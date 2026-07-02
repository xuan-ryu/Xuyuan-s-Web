// Screenshot matrix: live Framer baseline vs local React build, desktop +
// mobile, across all routes. Wired to `npm run audit:screenshots`.
// Output: audit-screenshots/matrix/<target>__<viewport>__<route>.png
import fs from "node:fs/promises";
import path from "node:path";
import { launchBrowser, routeName } from "./_pw.mjs";

const routes = [
  "/",
  "/about",
  "/work",
  "/contact",
  "/work/vicino-ai",
  "/work/froghire-ai",
  "/work/roper-center",
  "/work/hunger1942",
  "/work/vr-education",
];

const targets = [
  ["live", "https://xuyuan.framer.website"],
  ["react", "http://localhost:3000"],
];

const viewports = [
  ["desktop", { width: 1440, height: 1000 }],
  ["mobile", { width: 390, height: 844 }],
];

const outDir = path.join(process.cwd(), "audit-screenshots", "matrix");

await fs.mkdir(outDir, { recursive: true });

const browser = await launchBrowser();
try {
  for (const [targetName, baseUrl] of targets) {
    for (const [viewportName, viewport] of viewports) {
      for (const route of routes) {
        const page = await browser.newPage({
          viewport,
          deviceScaleFactor: 1,
        });

        const url = `${baseUrl}${route}`;
        const fileName = `${targetName}__${viewportName}__${routeName(route)}.png`;

        try {
          await page.goto(url, {
            waitUntil: "networkidle",
            timeout: 45000,
          });
          await page.waitForTimeout(1200);
          await page.screenshot({
            path: path.join(outDir, fileName),
            fullPage: false,
          });
          console.log(`captured ${fileName}`);
        } catch (error) {
          console.error(`failed ${fileName}: ${error.message}`);
        } finally {
          await page.close();
        }
      }
    }
  }
} finally {
  await browser.close();
}
