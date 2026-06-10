// Full-page screenshot after a progressive pre-scroll (loads lazy content).
// Usage: node scripts/capture-fullpage.mjs <url> <outFile> [width]
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
const [, , url, outFile, widthArg] = process.argv;
const vpWidth = Number(widthArg) || 1440;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: vpWidth, height: 1000 } });
await page.addInitScript(() => {
  try {
    sessionStorage.setItem("loader-shown", "1");
  } catch {}
});
await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
await page.waitForTimeout(2000);
await page.evaluate(async () => {
  for (let y = 0; y < document.body.scrollHeight; y += 500) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 150));
  }
  window.scrollTo(0, 0);
});
await page.waitForTimeout(1500);
await page.screenshot({ path: outFile, fullPage: true });
console.log(`saved ${outFile}`);
await browser.close();
