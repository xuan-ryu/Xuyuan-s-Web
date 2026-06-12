// Screenshot the home How-I-Work section at a given viewport width.
// Usage: node scripts/capture-how.mjs <url> <outPrefix> [width]
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
await page.addInitScript(() => {
  try {
    sessionStorage.setItem("skip-loader", "1");
  } catch {}
});
await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
await page.waitForTimeout(2500);

const top = await page.evaluate(() => {
  const el = document.querySelector(".home-how");
  if (!el) return null;
  return el.getBoundingClientRect().top + window.scrollY;
});
if (top == null) {
  console.error("no .home-how found");
  await browser.close();
  process.exit(1);
}
console.log(`.home-how top = ${Math.round(top)}`);
for (const [label, y] of [
  ["top", top],
  ["mid", top + 600],
  ["bottom", top + 1200],
]) {
  await page.evaluate((t) => window.scrollTo(0, t), y);
  await page.waitForTimeout(1300);
  const file = `${outPrefix}__${label}.png`;
  await page.screenshot({ path: file });
  console.log(`captured ${file}`);
}
await browser.close();
