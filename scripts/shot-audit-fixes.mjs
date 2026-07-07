// One-off QA capture for the hunger1942 / vr-education audit fixes.
// Usage: node scripts/shot-audit-fixes.mjs <outDir>
import path from "node:path";
import fs from "node:fs";
import { launchBrowser, skipLoader, DEFAULT_VIEWPORT, preScroll } from "./_pw.mjs";

const out = process.argv[2];
fs.mkdirSync(out, { recursive: true });
const BASE = "http://localhost:3000";

const browser = await launchBrowser();
const ctx = await browser.newContext({ viewport: DEFAULT_VIEWPORT });
await skipLoader(ctx);
const page = await ctx.newPage();

// ---- VR page ----
await page.goto(`${BASE}/work/vr-education`, { waitUntil: "networkidle" });
await page.waitForTimeout(800);
await preScroll(page);
await page.waitForTimeout(600);
await page.screenshot({ path: path.join(out, "vr-hero.png") });

await page.locator(".vrmb-flightwrap").scrollIntoViewIfNeeded();
await page.waitForTimeout(2600);
await page.screenshot({ path: path.join(out, "vr-flightline.png") });

await page.locator(".vrmb-plate2 figcaption").scrollIntoViewIfNeeded();
await page.waitForTimeout(1600);
await page.screenshot({ path: path.join(out, "vr-plate2.png") });

// ---- VR flight line with JS disabled (final-state contract) ----
const noJsCtx = await browser.newContext({
  viewport: DEFAULT_VIEWPORT,
  javaScriptEnabled: false,
});
const noJsPage = await noJsCtx.newPage();
await noJsPage.goto(`${BASE}/work/vr-education`, { waitUntil: "load" });
await noJsPage.locator(".vrmb-flightwrap").scrollIntoViewIfNeeded();
await noJsPage.waitForTimeout(800);
await noJsPage.screenshot({ path: path.join(out, "vr-flightline-nojs.png") });
await noJsCtx.close();

// ---- Hunger page ----
await page.goto(`${BASE}/work/hunger1942`, { waitUntil: "networkidle" });
await page.waitForTimeout(800);
await preScroll(page);
await page.waitForTimeout(600);

await page.locator(".hunger-sheet-caption").scrollIntoViewIfNeeded();
await page.waitForTimeout(1200);
await page.screenshot({ path: path.join(out, "hunger-sheet-cue.png") });

await page.locator(".hunger-pull").scrollIntoViewIfNeeded();
await page.waitForTimeout(1800);
await page.screenshot({ path: path.join(out, "hunger-pullquote.png") });

await page.locator(".hunger-plate").first().scrollIntoViewIfNeeded();
await page.waitForTimeout(1400);
await page.screenshot({ path: path.join(out, "hunger-plate1.png") });

await browser.close();
console.log("done ->", out);
