// Detect scroll-appear text animations: jump to each offset and immediately
// sample text elements that are mid-transition (opacity < 1 or transformed),
// then confirm they settle to visible.
// Usage: node scripts/scan-text-fx.mjs <url>
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
const [, , url] = process.argv;
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1536, height: 1000 } });
await page.addInitScript(() => {
  try {
    sessionStorage.setItem("skip-loader", "1");
  } catch {}
});
await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
await page.waitForTimeout(2000);

const height = await page.evaluate(() => document.body.scrollHeight);
const found = new Map();

for (let y = 0; y < height - 1000; y += 700) {
  await page.evaluate((top) => window.scrollTo(0, top), y);
  // sample immediately and shortly after -- catches mid-animation states
  for (const delay of [60, 200, 400]) {
    await page.waitForTimeout(delay);
    const rows = await page.evaluate(() => {
      const out = [];
      const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT);
      let el;
      while ((el = walk.nextNode())) {
        if (el.children.length > 3) continue;
        const text = (el.textContent || "").trim().replace(/\s+/g, " ");
        if (!text || text.length < 3) continue;
        const r = el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > 1000 || r.width < 10) continue;
        const cs = getComputedStyle(el);
        const op = parseFloat(cs.opacity);
        const tf = cs.transform;
        const hasMotion =
          (op > 0.02 && op < 0.98) ||
          (tf !== "none" && !tf.startsWith("matrix(1, 0, 0, 1, 0,"));
        if (!hasMotion) continue;
        out.push(
          `${el.tagName}.${(el.className?.toString?.() || "").slice(0, 30)} op=${op.toFixed(2)} tf=${tf.slice(7, 50)} :: ${text.slice(0, 50)}`,
        );
      }
      return out;
    });
    for (const row of rows) {
      const key = row.split("::")[1];
      if (!found.has(key)) found.set(key, `y${y}+${delay}ms ${row}`);
    }
  }
}
console.log([...found.values()].join("\n") || "(nothing mid-animation found)");
await browser.close();
