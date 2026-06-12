// Capture the session loader animation frames (does NOT skip the loader).
// Usage: node scripts/capture-loader.mjs <url> <outPrefix> [width]
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
const [, , url, outPrefix, widthArg] = process.argv;
const vpWidth = Number(widthArg) || 1440;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: vpWidth, height: 1000 } });
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });

const marks = [400, 950, 1400, 1900, 2500, 3200];
const start = Date.now();
for (const t of marks) {
  const wait = t - (Date.now() - start);
  if (wait > 0) await page.waitForTimeout(wait);
  await page.screenshot({ path: `${outPrefix}__t${t}.png` });
}
await browser.close();
console.log("done");
