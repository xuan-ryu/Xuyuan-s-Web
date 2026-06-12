// Capture live + react at an arbitrary viewport for the main routes.
// Usage: node scripts/capture-viewport-pair.mjs <outDir> <width> <height> "<route1,route2>" "<y1,y2,...>"
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
const [, , outName, wArg, hArg, routesArg, offsetsArg] = process.argv;
const width = Number(wArg) || 1536;
const height = Number(hArg) || 750;
const routes = (routesArg || "/").split(",");
const offsets = (offsetsArg || "0").split(",").map(Number);

const outDir = path.join(process.cwd(), "audit-screenshots", outName);
await fs.mkdir(outDir, { recursive: true });

const targets = [
  ["live", "https://xuyuan.framer.website"],
  ["react", "http://127.0.0.1:4000"],
];

function routeName(route) {
  return route === "/" ? "home" : route.slice(1).replaceAll("/", "__");
}

const browser = await chromium.launch();
try {
  for (const [name, base] of targets) {
    const context = await browser.newContext({
      viewport: { width, height },
      deviceScaleFactor: 1,
    });
    await context.addInitScript(() => {
      try {
        sessionStorage.setItem("skip-loader", "1");
      } catch {}
    });
    for (const route of routes) {
      const page = await context.newPage();
      try {
        await page.goto(`${base}${route}`, {
          waitUntil: "networkidle",
          timeout: 60000,
        });
        await page.waitForTimeout(2500);
        // progressive pre-scroll: loads lazy media and settles appear effects
        await page.evaluate(async () => {
          for (let y = 0; y < document.body.scrollHeight; y += 500) {
            window.scrollTo(0, y);
            await new Promise((r) => setTimeout(r, 120));
          }
          window.scrollTo(0, 0);
        });
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
