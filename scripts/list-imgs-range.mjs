// List every visible <img> whose document-Y intersects a range.
// Usage: node scripts/list-imgs-range.mjs <url> <yMin> <yMax>
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
const [, , url, yMinArg, yMaxArg, widthArg] = process.argv;
const yMin = Number(yMinArg);
const yMax = Number(yMaxArg);
const vpWidth = Number(widthArg) || 1440;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: vpWidth, height: 1000 } });
await page.addInitScript(() => {
  try {
    sessionStorage.setItem("loader-shown", "1");
  } catch {}
});
await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
await page.waitForTimeout(2500);
await page.evaluate(async () => {
  for (let y = 0; y < document.body.scrollHeight; y += 800) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 100));
  }
});
await page.waitForTimeout(800);

const rows = await page.evaluate(
  ([lo, hi]) => {
    const out = [];
    for (const el of document.querySelectorAll("img")) {
      const r = el.getBoundingClientRect();
      const yDoc = r.y + scrollY;
      if (r.width < 2 || yDoc + r.height < lo || yDoc > hi) continue;
      const cs = getComputedStyle(el);
      const tail = (el.currentSrc || el.src).split("/").pop().split("?")[0];
      out.push(
        `x=${Math.round(r.x)} y=${Math.round(yDoc)} w=${Math.round(r.width)} h=${Math.round(r.height)} fit=${cs.objectFit} tf=${cs.transform !== "none" ? "yes" : "no"} ${tail}`,
      );
    }
    for (const el of document.querySelectorAll("*")) {
      const bg = getComputedStyle(el).backgroundImage;
      if (!bg || bg === "none" || !bg.includes("url(")) continue;
      const r = el.getBoundingClientRect();
      const yDoc = r.y + scrollY;
      if (r.width < 2 || yDoc + r.height < lo || yDoc > hi) continue;
      const tail = bg.match(/url\("?([^")]+)"?\)/)?.[1].split("/").pop().split("?")[0];
      out.push(
        `BG x=${Math.round(r.x)} y=${Math.round(yDoc)} w=${Math.round(r.width)} h=${Math.round(r.height)} ${tail}`,
      );
    }
    return out.sort((a, b) => Number(a.match(/y=(-?\d+)/)[1]) - Number(b.match(/y=(-?\d+)/)[1]));
  },
  [yMin, yMax],
);
console.log(rows.join("\n"));
await browser.close();
