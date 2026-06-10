// Measure bounding boxes of the Featured-section decor on a page.
// Usage: node scripts/measure-featured.mjs <url>
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
await page.addInitScript(() => {
  try {
    sessionStorage.setItem("loader-shown", "1");
  } catch {}
});
await page.goto(process.argv[2], { waitUntil: "networkidle", timeout: 60000 });
await page.waitForTimeout(2500);
// scroll through to force lazy loads
await page.evaluate(async () => {
  for (let y = 0; y < document.body.scrollHeight; y += 800) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 100));
  }
});
await page.waitForTimeout(800);

const data = await page.evaluate(() => {
  const out = [];
  const probe = [
    ["bamboo", 'img[src*="L1vpdZpPpmGxuSapa0YWEYsqI"]'],
    ["roof-strip", 'img[src*="wgP2v6bRLltf0I89tfuRuq6sUhQ"]'],
    ["tree", 'img[src*="gu9zjePdorThhw4JGrGru2eXBY"]'],
    ["rock", 'img[src*="3GdEAzchhqqng8XQl1Obd6fHMUk"]'],
  ];
  for (const [name, sel] of probe) {
    for (const el of document.querySelectorAll(sel)) {
      const r = el.getBoundingClientRect();
      if (r.width < 2) continue;
      out.push(
        `${name}: x=${Math.round(r.x)} yDoc=${Math.round(r.y + scrollY)} w=${Math.round(r.width)} h=${Math.round(r.height)}`,
      );
    }
  }
  // background-image instances of the same assets
  const bgProbe = [
    ["bg-bamboo", "L1vpdZpPpmGxuSapa0YWEYsqI"],
    ["bg-roof-strip", "wgP2v6bRLltf0I89tfuRuq6sUhQ"],
    ["bg-tree", "gu9zjePdorThhw4JGrGru2eXBY"],
    ["bg-rock", "3GdEAzchhqqng8XQl1Obd6fHMUk"],
  ];
  for (const el of document.querySelectorAll("*")) {
    const bg = getComputedStyle(el).backgroundImage;
    if (!bg || bg === "none") continue;
    for (const [name, key] of bgProbe) {
      if (bg.includes(key)) {
        const r = el.getBoundingClientRect();
        out.push(
          `${name}: x=${Math.round(r.x)} yDoc=${Math.round(r.y + scrollY)} w=${Math.round(r.width)} h=${Math.round(r.height)} size=${getComputedStyle(el).backgroundSize}`,
        );
      }
    }
  }
  // window panes: find elements containing the pane numbers
  for (const label of ["01", "02", "03", "04"]) {
    const els = [...document.querySelectorAll("p,span,div")].filter(
      (e) => e.childElementCount === 0 && e.textContent.trim() === label,
    );
    for (const e of els) {
      const r = e.getBoundingClientRect();
      if (r.width < 2) continue;
      out.push(
        `num-${label}: x=${Math.round(r.x)} yDoc=${Math.round(r.y + scrollY)} fs=${getComputedStyle(e).fontSize}`,
      );
    }
  }
  return out;
});
console.log(data.join("\n"));
await browser.close();
