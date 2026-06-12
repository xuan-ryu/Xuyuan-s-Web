// Measure How-I-Work decor boxes at a fixed scroll position.
// Usage: node scripts/measure-how-decor.mjs <url> <scrollY> [width]
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
await page.evaluate((y) => window.scrollTo(0, y), scrollY);
await page.waitForTimeout(1500);

const rows = await page.evaluate(() => {
  const ids = {
    blackScreen: "YLXrjVSbjpbSEr6VDxoQlckuA4E",
    vase: "ZDxCTcmPVVb0cfyh5FFNd4dj1NA",
    bamboo: "lwMaDnjXri23sjZmiuTe7sT1Q",
    lotus: "GuVBPaGjujlgeSpfvNyLP3YczDs",
    gold: "j6sQpno4wHi7mS5QGmU6grlMWI",
    bench: "WpBupAnkoyx461zF3yJoLAf86VQ",
  };
  const out = [];
  for (const [name, id] of Object.entries(ids)) {
    for (const el of document.querySelectorAll(`img[src*="${id}"]`)) {
      const r = el.getBoundingClientRect();
      out.push(
        `${name}: x=${r.x.toFixed(1)} yDoc=${(r.y + scrollY).toFixed(1)} w=${r.width.toFixed(0)} h=${r.height.toFixed(0)}`,
      );
    }
  }
  let i = 0;
  for (const el of document.querySelectorAll(`img[src*="RJnh8cLkwy27PD5vycbXZbYjcQA"]`)) {
    const r = el.getBoundingClientRect();
    out.push(
      `floor-${i++}: x=${r.x.toFixed(1)} yDoc=${(r.y + scrollY).toFixed(1)} w=${r.width.toFixed(0)} h=${r.height.toFixed(0)}`,
    );
  }
  return out;
});
console.log(`scrollY=${scrollY} width=${vpWidth}`);
console.log(rows.join("\n"));
await browser.close();
