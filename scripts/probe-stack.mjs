// Print the element stack (elementsFromPoint) at given doc coordinates.
// Usage: node scripts/probe-stack.mjs <url> <docX> <docY> [width]
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
const [, , url, xArg, yArg, widthArg] = process.argv;
const docX = Number(xArg);
const docY = Number(yArg);
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
await page.evaluate((y) => window.scrollTo(0, y - 500), docY);
await page.waitForTimeout(1200);

const rows = await page.evaluate(
  ([x, y]) => {
    const els = document.elementsFromPoint(x, y - scrollY);
    return els.slice(0, 14).map((el) => {
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      const img = el.tagName === "IMG" ? ` src=${el.src.split("/").pop().slice(0, 30)}` : "";
      return `${el.tagName}.${(el.className.baseVal ?? el.className).toString().slice(0, 40)} z=${cs.zIndex} bg=${cs.backgroundColor} ovf=${cs.overflow} rect=${Math.round(r.x)},${Math.round(r.y + scrollY)} ${Math.round(r.width)}x${Math.round(r.height)}${img}`;
    });
  },
  [docX, docY],
);
console.log(rows.join("\n"));
await browser.close();
