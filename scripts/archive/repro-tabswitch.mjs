// Reproduce: tab hidden -> visible again -- does the hero RAF loop resume?
// Simulates via visibilityState override + events (headless can't truly background).
// Usage: node scripts/repro-tabswitch.mjs <url> [scrollY]
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
const [, , url, scrollArg] = process.argv;
const scrollY = Number(scrollArg) || 0;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1536, height: 770 } });
await page.addInitScript(() => {
  try {
    sessionStorage.setItem("skip-loader", "1");
  } catch {}
});
await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
await page.waitForTimeout(2500);
if (scrollY) {
  await page.evaluate((y) => window.scrollTo(0, y), scrollY);
  await page.waitForTimeout(1000);
}

const isAnimating = async (label) => {
  const moved = await page.evaluate(
    () =>
      new Promise((resolve) => {
        let frames = 0;
        const t0 = performance.now();
        const tick = () => {
          frames++;
          if (performance.now() - t0 > 600) resolve(frames);
          else requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }),
  );
  // RAF always runs for our probe; instead diff canvas pixels via screenshots
  const a = await page.screenshot();
  await page.waitForTimeout(500);
  const b = await page.screenshot();
  let diff = 0;
  const len = Math.min(a.length, b.length);
  for (let i = 0; i < len; i += 997) if (a[i] !== b[i]) diff++;
  console.log(`${label}: rafProbe=${moved} canvasDiffSamples=${diff}`);
  return diff;
};

await isAnimating("before hide");

await page.evaluate(() => {
  Object.defineProperty(document, "visibilityState", {
    value: "hidden",
    configurable: true,
  });
  Object.defineProperty(document, "hidden", {
    value: true,
    configurable: true,
  });
  document.dispatchEvent(new Event("visibilitychange"));
  window.dispatchEvent(new Event("blur"));
});
await page.waitForTimeout(2000);

await page.evaluate(() => {
  Object.defineProperty(document, "visibilityState", {
    value: "visible",
    configurable: true,
  });
  Object.defineProperty(document, "hidden", {
    value: false,
    configurable: true,
  });
  document.dispatchEvent(new Event("visibilitychange"));
  window.dispatchEvent(new Event("focus"));
});
await page.waitForTimeout(800);

await isAnimating("after return");
await page.screenshot({ path: "audit-screenshots/tab-after-return.png" });
await browser.close();
