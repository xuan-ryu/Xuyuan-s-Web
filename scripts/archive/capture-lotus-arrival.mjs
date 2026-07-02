// One-off QA probe: capture the moon-gate lotus arrival at fixed progress
// points of the 270% pin, forward and reverse, at 1536x830.
//
// The crossing's directional snap (featured-gate.tsx) would glide any
// intermediate progress point to 0 or 1 ~140ms after scroll goes idle, so
// this probe blocks exactly that idle-detect (the only 140ms setTimeout in
// the app) via an init script — everything else (Lenis, the 0.6 scrub)
// behaves naturally.
//
// Usage: node scripts/archive/capture-lotus-arrival.mjs <outDir>
import fs from "node:fs";
import path from "node:path";
import { launchBrowser, skipLoader } from "../_pw.mjs";

const outDir = process.argv[2] || "audit-screenshots/lotus-arrival";
fs.mkdirSync(outDir, { recursive: true });

const VIEWPORT = { width: 1536, height: 830 };
const PIN = 2.7; // end: "+=270%"

// [progress, label]
const FORWARD = [
  [0.05, "01-beats"],
  [0.2, "02-zoom"],
  [0.31, "03-ink-full"],
  [0.42, "04-leaves-condense"],
  [0.5, "05-leaves-cover"],
  [0.62, "06-mid-parting"],
  [0.75, "07-lotus-open"],
  [0.85, "08-late-parting"],
  [0.93, "09-dissolve"],
  [1.0, "10-arrival"],
];
const REVERSE = [
  [0.75, "r1-lotus-open"],
  [0.5, "r2-leaves-cover"],
  [0.42, "r3-leaves-condense"],
  [0.2, "r4-zoom"],
];

const browser = await launchBrowser();
const context = await browser.newContext({ viewport: VIEWPORT });
await skipLoader(context);
// kill ONLY the snap idle-detect so intermediate progress holds still
await context.addInitScript(() => {
  const real = window.setTimeout.bind(window);
  window.setTimeout = (fn, d, ...a) => (d === 140 ? 0 : real(fn, d, ...a));
});

const page = await context.newPage();
const errors = [];
page.on("console", (m) => {
  if (m.type() === "error") errors.push(`[console] ${m.text()}`);
});
page.on("pageerror", (e) => errors.push(`[pageerror] ${e.message}`));

await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
await page.waitForSelector(".fg-section");
await page.waitForTimeout(2500); // gsap async import + pin setup

const sectionTop = await page.evaluate(() => {
  const el = document.querySelector(".fg-section");
  return el.getBoundingClientRect().top + window.scrollY;
});
const pinLen = VIEWPORT.height * PIN;
console.log(`section top: ${sectionTop}, pin length: ${pinLen}`);

async function capture(progress, label) {
  const y = Math.round(sectionTop + progress * pinLen);
  await page.evaluate((yy) => window.scrollTo(0, yy), y);
  await page.waitForTimeout(1700); // let the 0.6 scrub fully settle
  await page.screenshot({ path: path.join(outDir, `${label}.png`) });
  console.log(`captured ${label} (p=${progress}, y=${y})`);
}

for (const [p, label] of FORWARD) await capture(p, label);
for (const [p, label] of REVERSE) await capture(p, label);

if (errors.length) {
  console.log("\nCONSOLE ERRORS:");
  for (const e of errors) console.log("  " + e);
} else {
  console.log("\nno console errors");
}

await browser.close();
