// Capture one URL at mobile width at several scroll offsets.
// Usage: node scripts/capture-mobile-one.mjs <url> <outPrefix> <y1,y2,...>
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
const [, , url, outPrefix, offsetsArg] = process.argv;
const offsets = (offsetsArg || "0").split(",").map(Number);

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
});
await context.addInitScript(() => {
  try {
    sessionStorage.setItem("skip-loader", "1");
  } catch {}
});
const page = await context.newPage();
await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
await page.waitForTimeout(2500);
for (const y of offsets) {
  await page.evaluate((top) => window.scrollTo(0, top), y);
  await page.waitForTimeout(1100);
  const file = `${outPrefix}__y${y}.png`;
  await page.screenshot({ path: file });
  console.log(`captured ${file}`);
}
await browser.close();
