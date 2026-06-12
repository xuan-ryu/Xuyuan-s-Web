// Navigate home->page->home repeatedly; check the hero canvas renders each
// return and collect WebGL/Three console errors.
// Usage: node scripts/repro-nav-hero.mjs <url>
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
const page = await browser.newPage({
  viewport: { width: 1536, height: 770 },
  reducedMotion: "no-preference",
});
await page.addInitScript(() => {
  try {
    sessionStorage.setItem("skip-loader", "1");
  } catch {}
});
const errs = [];
page.on("console", (m) => {
  const t = m.text();
  if (/THREE|WebGL|Error|context|\[hero\]/i.test(t) && !/ReadPixels|DevTools/.test(t))
    errs.push(t.slice(0, 160));
});
page.on("pageerror", (e) => errs.push("PAGEERROR " + e.message.slice(0, 160)));

await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
await page.waitForTimeout(2500);

const heroAlive = async () => {
  // sample canvas pixels twice 鈥?the mountain twinkles, so frames differ
  return page.evaluate(
    () =>
      new Promise((resolve) => {
        const canvas = document.querySelector("main canvas");
        if (!canvas) return resolve("NO CANVAS");
        const mount = canvas.parentElement;
        const op = mount ? getComputedStyle(mount).opacity : "?";
        try {
          const gl =
            canvas.getContext("webgl2") || canvas.getContext("webgl");
          const lost = gl ? gl.isContextLost() : "no-gl-handle"; const wrap = mount?.parentElement; const ws = wrap ? getComputedStyle(wrap) : null;
          resolve(`canvas ${canvas.width}x${canvas.height}, mountOp=${op}, wrapOp=${ws?.opacity}/${ws?.visibility}, lost=${lost}`);
        } catch {
          resolve(`canvas ok, mountOpacity=${op}, gl check failed`);
        }
      }),
  );
};

console.log("initial:", await heroAlive());

const pages = ["work", "about", "contact"];
for (let i = 0; i < 3; i++) {
  const dest = pages[i % pages.length];
  await page.locator(`nav a[href="/${dest}"]`).first().click();
  await page.waitForTimeout(1800);
  await page.locator('nav a[href="/"]').first().click();
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `audit-screenshots/navhero-${i + 1}-early.png` });
  await page.waitForTimeout(1800);
  console.log(`cycle ${i + 1} (via /${dest}):`, await heroAlive());
  await page.screenshot({ path: `audit-screenshots/navhero-${i + 1}.png` });
}
console.log("errors:", errs.length ? "\n" + errs.slice(0, 12).join("\n") : "none");
await browser.close();
