// Simulate live window dragging: one page, no reload, viewport shrinks in
// steps; report card boxes + capture the how zone after each step.
import { launchBrowser } from "./_pw.mjs";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const outDir = process.argv[2];
mkdirSync(outDir, { recursive: true });

const STEPS = [
  [1440, 900],
  [1280, 860],
  [1150, 820],
  [1000, 780],
  [900, 740],
  [780, 700],
  [1440, 900], // and back up
];

const browser = await launchBrowser();
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
});
await ctx.addInitScript(() => sessionStorage.setItem("skip-loader", "1"));
const page = await ctx.newPage();
await page.goto("http://localhost:3000/", { waitUntil: "networkidle", timeout: 60000 });
await page.waitForTimeout(1500);
await page.evaluate(() => {
  window.dispatchEvent(new CustomEvent("koi:feed", { detail: { count: 3 } }));
});
await page.waitForTimeout(500);

for (const [w, h] of STEPS) {
  await page.setViewportSize({ width: w, height: h });
  await page.waitForTimeout(900);
  const report = await page.evaluate(() => {
    const sect = document.querySelector(".home-koi-section").getBoundingClientRect();
    const sTop = sect.top + window.scrollY;
    const cards = [...document.querySelectorAll(".koi-how-card")].map((el) => {
      const r = el.getBoundingClientRect();
      return {
        cls: el.className.match(/koi-how-card-\d/)?.[0],
        top: Math.round(r.top + window.scrollY - sTop),
        bottom: Math.round(r.bottom + window.scrollY - sTop),
        left: Math.round(r.left),
        right: Math.round(r.right),
      };
    });
    return { sectH: Math.round(sect.height), cards };
  });
  console.log(`${w}x${h} sectH=${report.sectH}`);
  for (const b of report.cards) console.log(`   ${b.cls}: y ${b.top}-${b.bottom} x ${b.left}-${b.right}`);
  for (let i = 0; i < report.cards.length - 1; i++) {
    const a = report.cards[i], c = report.cards[i + 1];
    if (a.bottom > c.top && a.left < c.right && c.left < a.right)
      console.log(`   !! ${a.cls} overlaps ${c.cls} by ${a.bottom - c.top}px`);
  }
  const last = report.cards[report.cards.length - 1];
  if (last && last.bottom > report.sectH) console.log(`   !! ${last.cls} overflows section by ${last.bottom - report.sectH}px`);
  // jump the how zone into view and capture
  await page.evaluate(() => {
    const el = document.querySelector(".koi-how");
    const r = el.getBoundingClientRect();
    window.scrollTo(0, r.top + window.scrollY - 60);
  });
  await page.waitForTimeout(700);
  await page.screenshot({ path: join(outDir, `live-${w}x${h}.png`) });
}
await browser.close();
