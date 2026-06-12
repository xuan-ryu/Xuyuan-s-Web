// Click a nav link and capture frames of the page transition.
// Usage: node scripts/capture-nav-transition.mjs <url> <linkText> <outPrefix>
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
const [, , url, linkText, outPrefix] = process.argv;
const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1536, height: 770 },
  reducedMotion: "no-preference",
});
await page.addInitScript(() => {
  try {
    sessionStorage.setItem("skip-loader", "1");
    sessionStorage.setItem("loader-shown", "1");
  } catch {}
});
page.on('console', m => console.log('[browser]', m.text().slice(0,120)));
await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
await page.waitForTimeout(2000);

const link = page.locator(`a:has-text("${linkText}")`).first();
await link.click({ noWaitAfter: true });
const marks = [100, 250, 400, 550, 800, 1100, 1700, 2400, 3000];
const t0 = Date.now();
for (const t of marks) {
  const wait = t - (Date.now() - t0);
  if (wait > 0) await page.waitForTimeout(wait);
  await page.screenshot({ path: `${outPrefix}__t${t}.png` });
}
console.log("done");
await browser.close();
