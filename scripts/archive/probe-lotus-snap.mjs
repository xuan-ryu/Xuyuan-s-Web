// One-off QA probe: verify the moon-gate crossing's directional Lenis snap
// still completes the (now 270%) crossing in one glide, both directions.
import { launchBrowser, skipLoader } from "../_pw.mjs";

const VIEWPORT = { width: 1536, height: 830 };
const PIN = 2.7;

const browser = await launchBrowser();
const context = await browser.newContext({ viewport: VIEWPORT });
await skipLoader(context);
const page = await context.newPage();
const errors = [];
page.on("console", (m) => {
  if (m.type() === "error") errors.push(`[console] ${m.text()}`);
});
page.on("pageerror", (e) => errors.push(`[pageerror] ${e.message}`));

await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
await page.waitForSelector(".fg-section");
await page.waitForTimeout(2500);

const sectionTop = await page.evaluate(() => {
  const el = document.querySelector(".fg-section");
  return el.getBoundingClientRect().top + window.scrollY;
});
const pinLen = VIEWPORT.height * PIN;
const end = Math.round(sectionTop + pinLen);

// down-flick from p=0.3 → should glide to pin end (the pond)
await page.evaluate((y) => window.scrollTo(0, y), Math.round(sectionTop + 0.3 * pinLen));
await page.waitForTimeout(3500);
const afterDown = await page.evaluate(() => window.scrollY);
console.log(
  `down: landed ${afterDown}, expected ~${end} → ${Math.abs(afterDown - end) < 4 ? "OK" : "FAIL"}`,
);

// up-flick from the pond edge → should glide back to the wall (pin start)
await page.evaluate((y) => window.scrollTo(0, y), Math.round(sectionTop + 0.9 * pinLen));
await page.waitForTimeout(3500);
const afterUp = await page.evaluate(() => window.scrollY);
console.log(
  `up:   landed ${afterUp}, expected ~${Math.round(sectionTop)} → ${Math.abs(afterUp - sectionTop) < 4 ? "OK" : "FAIL"}`,
);

console.log(errors.length ? "CONSOLE ERRORS:\n" + errors.join("\n") : "no console errors");
await browser.close();
