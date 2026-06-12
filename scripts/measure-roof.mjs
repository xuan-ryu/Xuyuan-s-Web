// Measure roof-transition piece boxes at a fixed scroll position.
// Usage: node scripts/measure-roof.mjs <url> <scrollY> [width]
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
const [, , url, scrollArg, widthArg] = process.argv;
const scrollY = Number(scrollArg);
const vpWidth = Number(widthArg) || 1536;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: vpWidth, height: 1000 } });
await page.addInitScript(() => {
  try {
    sessionStorage.setItem("skip-loader", "1");
  } catch {}
});
await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
await page.waitForTimeout(2500);
await page.evaluate((y) => window.scrollTo(0, y), scrollY);
await page.waitForTimeout(1500);

const rows = await page.evaluate((sy) => {
  const out = [];
  for (const id of ["D6Nz1N21z7DIjWae8R8LFGCY", "6abw1vzYpd5VHb7WZncQkASt2ag"]) {
    for (const el of document.querySelectorAll(`img[src*="${id}"]`)) {
      const r = el.getBoundingClientRect();
      out.push(
        `${id.slice(0, 4)}: x=${r.x.toFixed(1)} yDoc=${(r.y + sy).toFixed(1)} w=${r.width.toFixed(0)} h=${r.height.toFixed(0)}`,
      );
    }
  }
  return out;
}, scrollY);
console.log(`scrollY=${scrollY} width=${vpWidth}`);
console.log(rows.join("\n"));
await browser.close();
