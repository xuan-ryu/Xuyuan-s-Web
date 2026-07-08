// Review-fix walkthrough shots for /work/pulse (2026-07-08 fixes).
import { launchBrowser, skipLoader } from "./_pw.mjs";

const URL = "http://localhost:3000/work/pulse";
const OUT = process.argv[2] || "scripts/shots-pulse-review";
import fs from "node:fs";
fs.mkdirSync(OUT, { recursive: true });

const browser = await launchBrowser();
const page = await browser.newPage({ viewport: { width: 1536, height: 900 } });
await skipLoader(page);
await page.goto(URL, { waitUntil: "networkidle", timeout: 60000 });
await page.waitForTimeout(2500);

const shots = [
  ["hero-stats", () => window.scrollTo(0, 0)],
  ["outcome-band", (s) => document.querySelector(".ob-band").scrollIntoView({ block: "center" })],
  ["rail-and-melee", () => document.querySelector("#act-melee").scrollIntoView()],
  ["ci-chain", () => document.querySelectorAll(".pulse-chain-row")[0].closest("figure").scrollIntoView({ block: "center" })],
  ["timeline", () => document.querySelector(".pulse-timeline").scrollIntoView({ block: "center" })],
  ["ch09-band", () => document.querySelector(".pulse-band").scrollIntoView({ block: "center" })],
  ["campaign-merged", () => document.querySelector(".pulse-shot-note").scrollIntoView({ block: "center" })],
  ["turn-film", () => document.querySelector(".pulse-turn-film").scrollIntoView({ block: "center" })],
];
for (const [name, fn] of shots) {
  await page.evaluate(fn);
  await page.waitForTimeout(1600);
  await page.screenshot({ path: `${OUT}/${name}.png` });
  console.log(`captured ${OUT}/${name}.png`);
}
await browser.close();
