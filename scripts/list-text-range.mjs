// List visible headings/paragraphs with positions in a document-Y range.
// Usage: node scripts/list-text-range.mjs <url> <yMin> <yMax>
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
const [, , url, yMinArg, yMaxArg] = process.argv;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
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
    const seen = new Set();
    for (const el of document.querySelectorAll("h1,h2,h3,h4,h5,h6,p,a,button,span")) {
      if (el.childElementCount > 0) continue;
      const text = (el.innerText || "").replace(/\s+/g, " ").trim();
      if (!text) continue;
      const r = el.getBoundingClientRect();
      const yDoc = r.y + scrollY;
      if (r.width < 2 || r.height < 2 || yDoc + r.height < lo || yDoc > hi) continue;
      const cs = getComputedStyle(el);
      if (cs.visibility === "hidden" || cs.opacity === "0") continue;
      const key = `${Math.round(yDoc)}|${text.slice(0, 40)}`;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(
        `${el.tagName.toLowerCase()}[${Math.round(parseFloat(cs.fontSize))}px ${cs.color}] x=${Math.round(r.x)} y=${Math.round(yDoc)} w=${Math.round(r.width)} | ${text.slice(0, 90)}`,
      );
    }
    return out.sort((a, b) => Number(a.match(/y=(-?\d+)/)[1]) - Number(b.match(/y=(-?\d+)/)[1]));
  },
  [Number(yMinArg), Number(yMaxArg)],
);
console.log(rows.join("\n"));
await browser.close();
