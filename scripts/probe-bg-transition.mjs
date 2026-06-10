// Watch the background color behind a point while scrolling progressively,
// to detect scroll-triggered background variants on the live site.
// Usage: node scripts/probe-bg-transition.mjs <url> <docYstart> <docYend> [width]
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
const [, , url, startArg, endArg, widthArg] = process.argv;
const yStart = Number(startArg);
const yEnd = Number(endArg);
const vpWidth = Number(widthArg) || 1440;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: vpWidth, height: 1000 } });
await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
await page.waitForTimeout(2500);

// progressive scroll like a user
for (let y = 0; y <= yEnd; y += 250) {
  await page.evaluate((t) => window.scrollTo(0, t), y);
  await page.waitForTimeout(120);
  if (y >= yStart) {
    const info = await page.evaluate(() => {
      // effective background behind the viewport center-left point
      const els = document.elementsFromPoint(400, 500);
      for (const el of els) {
        const bg = getComputedStyle(el).backgroundColor;
        if (bg && bg !== "rgba(0, 0, 0, 0)") {
          const r = el.getBoundingClientRect();
          return `bg=${bg} el=${el.tagName} rect=(${Math.round(r.x)},${Math.round(r.y + scrollY)} ${Math.round(r.width)}x${Math.round(r.height)})`;
        }
      }
      return "none";
    });
    console.log(`scroll=${y} ${info}`);
  }
}
await browser.close();
