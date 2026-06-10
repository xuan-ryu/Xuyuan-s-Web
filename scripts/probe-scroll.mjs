// Sample the state of key text elements at a series of scroll positions.
// For each tracked snippet, report viewport-Y, opacity, and transform so the
// scroll choreography of the live site can be transcribed.
// Usage: node scripts/probe-scroll.mjs <url> "<text1>|<text2>|..." "<y1,y2,...>" [width]
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
const [, , url, textsArg, stepsArg, widthArg] = process.argv;
const texts = textsArg.split("|");
const steps = stepsArg.split(",").map(Number);
const vpWidth = Number(widthArg) || 1440;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: vpWidth, height: 1000 } });
await page.addInitScript(() => {
  try {
    sessionStorage.setItem("loader-shown", "1");
  } catch {}
});
await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
await page.waitForTimeout(3000);

for (const y of steps) {
  await page.evaluate((top) => window.scrollTo(0, top), y);
  await page.waitForTimeout(900);
  const rows = await page.evaluate((snippets) => {
    const out = [];
    for (const snippet of snippets) {
      // find the deepest visible element containing the snippet
      let best = null;
      for (const el of document.querySelectorAll("h1,h2,h3,p,span,div")) {
        if (el.childElementCount > 0) continue;
        const t = (el.textContent || "").replace(/\s+/g, " ").trim();
        if (!t.includes(snippet)) continue;
        best = el;
        break;
      }
      if (!best) {
        out.push(`  ${snippet}: NOT FOUND`);
        continue;
      }
      const r = best.getBoundingClientRect();
      // effective opacity = product up the ancestor chain
      let eff = 1;
      let node = best;
      while (node && node !== document.body) {
        eff *= parseFloat(getComputedStyle(node).opacity);
        node = node.parentElement;
      }
      const cs = getComputedStyle(best);
      out.push(
        `  ${snippet}: vy=${Math.round(r.y)} x=${Math.round(r.x)} opacity=${eff.toFixed(2)} tf=${cs.transform === "none" ? "none" : cs.transform.replace(/matrix\(1, 0, 0, 1, /, "translate(")}`,
      );
    }
    return out;
  }, texts);
  console.log(`scrollY=${y}`);
  console.log(rows.join("\n"));
}
await browser.close();
