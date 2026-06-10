// Walk the live Framer site's DOM in document order and emit an outline of
// visible headings, paragraphs, and media. Used to reconstruct exact section
// order + embedded media positions for the React rebuild.
// Usage: node scripts/extract-live-outline.mjs /work/vicino-ai out.txt
import fs from "node:fs/promises";
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

const route = process.argv[2] || "/work/vicino-ai";
const outFile = process.argv[3];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
await page.goto(`https://xuyuan.framer.website${route}`, {
  waitUntil: "networkidle",
  timeout: 60000,
});
await page.waitForTimeout(2500);
// force-load lazy content
await page.evaluate(async () => {
  const step = 800;
  for (let y = 0; y < document.body.scrollHeight; y += step) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 120));
  }
  window.scrollTo(0, 0);
});
await page.waitForTimeout(1500);

const outline = await page.evaluate(() => {
  const lines = [];
  const seen = new Set();
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT);
  const isVisible = (el) => {
    const r = el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) return false;
    const cs = getComputedStyle(el);
    return cs.display !== "none" && cs.visibility !== "hidden" && cs.opacity !== "0";
  };
  let node;
  while ((node = walker.nextNode())) {
    const tag = node.tagName.toLowerCase();
    if (/^h[1-6]$/.test(tag) || tag === "p") {
      if (!isVisible(node)) continue;
      const text = node.innerText.replace(/\s+/g, " ").trim();
      if (!text) continue;
      const key = tag + "|" + text;
      if (seen.has(key)) continue;
      seen.add(key);
      const fs = Math.round(parseFloat(getComputedStyle(node).fontSize));
      lines.push(`${tag}[${fs}px] ${text.slice(0, 160)}`);
    } else if (tag === "img") {
      if (!isVisible(node)) continue;
      const src = (node.currentSrc || node.src || "").split("?")[0];
      if (!src || src.startsWith("data:")) continue;
      const r = node.getBoundingClientRect();
      const key = "img|" + src;
      if (seen.has(key)) continue;
      seen.add(key);
      lines.push(`img[${Math.round(r.width)}x${Math.round(r.height)}] ${src}`);
    } else if (tag === "video") {
      const src =
        (node.currentSrc || node.src || node.querySelector("source")?.src || "").split("?")[0];
      const poster = (node.poster || "").split("?")[0];
      const key = "video|" + src;
      if (seen.has(key)) continue;
      seen.add(key);
      const r = node.getBoundingClientRect();
      lines.push(`video[${Math.round(r.width)}x${Math.round(r.height)}] ${src} poster=${poster}`);
    }
  }
  return lines;
});

const text = outline.join("\n");
if (outFile) {
  await fs.writeFile(outFile, text);
  console.log(`${outline.length} entries -> ${outFile}`);
} else {
  console.log(text);
}
await browser.close();
