// Report night-card fade state at a given scroll.
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
const scrollY = Number(process.argv[2]) || 2400;
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1536, height: 1000 } });
await page.addInitScript(() => {
  try {
    sessionStorage.setItem("skip-loader", "1");
  } catch {}
});
await page.goto("http://localhost:3000", { waitUntil: "networkidle", timeout: 60000 });
await page.waitForTimeout(2000);
await page.evaluate((y) => window.scrollTo(0, y), scrollY);
await page.waitForTimeout(1200);
const info = await page.evaluate(() => {
  const card = document.querySelector(".profile-sticky");
  const title = document.querySelector(".page2-title");
  const wrap = title ? title.parentElement.parentElement : null;
  const fmt = (el) => {
    if (!el) return "null";
    const cs = getComputedStyle(el);
    return `opacity=${cs.opacity} transform=${cs.transform} inlineOpacity=${el.style.opacity}`;
  };
  return `card: ${fmt(card)}\nwrap(${wrap ? wrap.className || "(no class)" : "?"}): ${fmt(wrap)}\nscrollY=${scrollY}`;
});
console.log(info);
await browser.close();
