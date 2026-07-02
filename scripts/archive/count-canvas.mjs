// Count canvas elements and report video positions on a page.
// Usage: node scripts/count-canvas.mjs <url>
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
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
await page.goto(process.argv[2], { waitUntil: "networkidle", timeout: 60000 });
await page.waitForTimeout(2500);
await page.evaluate(async () => {
  for (let y = 0; y < document.body.scrollHeight; y += 800) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 120));
  }
});
await page.waitForTimeout(800);
const info = await page.evaluate(() => {
  const canvases = [...document.querySelectorAll("canvas")].map((c) => {
    const r = c.getBoundingClientRect();
    return `canvas x=${Math.round(r.x)} y=${Math.round(r.y + scrollY)} w=${Math.round(r.width)} h=${Math.round(r.height)}`;
  });
  const videos = [...document.querySelectorAll("video")].map((v) => {
    const r = v.getBoundingClientRect();
    return `video x=${Math.round(r.x)} y=${Math.round(r.y + scrollY)} w=${Math.round(r.width)} h=${Math.round(r.height)} ${(v.currentSrc || v.src).split("/").pop()}`;
  });
  return [...canvases, ...videos];
});
console.log(info.join("\n") || "none");
await browser.close();
