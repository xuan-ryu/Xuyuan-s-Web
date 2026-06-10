// Capture one URL at several scroll offsets.
// Usage: node scripts/capture-one.mjs <url> <outPrefix> <y1,y2,...>
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
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
await page.addInitScript(() => {
  try {
    sessionStorage.setItem("loader-shown", "1");
  } catch {}
});
await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
await page.waitForTimeout(2500);
for (const y of offsets) {
  await page.evaluate((top) => window.scrollTo(0, top), y);
  await page.waitForTimeout(1300);
  const file = `${outPrefix}__y${y}.png`;
  await page.screenshot({ path: file });
  console.log(`captured ${file}`);
}
await browser.close();
