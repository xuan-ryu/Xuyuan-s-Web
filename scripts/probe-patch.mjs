// One-off: report the wall patch's computed geometry.
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
const page = await browser.newPage({ viewport: { width: 1536, height: 1000 } });
await page.addInitScript(() => {
  try {
    sessionStorage.setItem("skip-loader", "1");
  } catch {}
});
await page.goto("http://localhost:3000", { waitUntil: "networkidle", timeout: 60000 });
await page.waitForTimeout(2000);
const info = await page.evaluate(() => {
  const el = document.querySelector(".roof-wall-patch");
  if (!el) return "NOT FOUND";
  const cs = getComputedStyle(el);
  const r = el.getBoundingClientRect();
  return `rect=${r.x.toFixed(0)},${(r.y + scrollY).toFixed(0)} ${r.width.toFixed(0)}x${r.height.toFixed(0)} pos=${cs.position} bg=${cs.backgroundColor} display=${cs.display} left=${cs.left} right=${cs.right} top=${cs.top} z=${cs.zIndex} transform=${cs.transform}`;
});
console.log(info);
await browser.close();
