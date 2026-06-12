// Capture live + react at mobile width for the main routes.
// Usage: node scripts/capture-mobile-pair.mjs <outDirName>
import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { pathToFileURL } from "node:url";

async function loadPlaywright() {
  try {
    return await import("playwright");
  } catch {
    const fallback = path.join(
      os.tmpdir(),
      "xuyuan-pw-tools",
      "node_modules",
      "playwright",
      "index.mjs",
    );
    return import(pathToFileURL(fallback).href);
  }
}

const { chromium } = await loadPlaywright();

const plan = {
  "/": [0, 700, 1400, 2100, 2800, 3500, 4500, 5500],
  "/about": [0, 800, 1600, 2600, 3600, 4800],
  "/work": [0, 700, 1400],
  "/contact": [0, 700],
  "/work/vicino-ai": [0, 900, 2000],
  "/work/hunger1942": [0, 1200, 2600],
};

const targets = [
  ["live", "https://xuyuan.framer.website"],
  ["react", "http://127.0.0.1:4000"],
];

const outDir = path.join(
  process.cwd(),
  "audit-screenshots",
  process.argv[2] || "mobile-pair",
);
await fs.mkdir(outDir, { recursive: true });

function routeName(route) {
  return route === "/" ? "home" : route.slice(1).replaceAll("/", "__");
}

const browser = await chromium.launch();
try {
  for (const [targetName, baseUrl] of targets) {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
      userAgent:
        "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
    });
    await context.addInitScript(() => {
      try {
        sessionStorage.setItem("skip-loader", "1");
      } catch {}
    });
    for (const [route, offsets] of Object.entries(plan)) {
      const page = await context.newPage();
      try {
        await page.goto(`${baseUrl}${route}`, {
          waitUntil: "networkidle",
          timeout: 60000,
        });
        await page.waitForTimeout(2500);
        for (const y of offsets) {
          await page.evaluate((top) => window.scrollTo(0, top), y);
          await page.waitForTimeout(1100);
          const file = `${targetName}__${routeName(route)}__y${y}.png`;
          await page.screenshot({ path: path.join(outDir, file) });
          console.log(`captured ${file}`);
        }
      } catch (e) {
        console.error(`failed ${targetName} ${route}: ${e.message}`);
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
