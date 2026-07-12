// How-I-Work responsiveness check: reveal the cards at several window sizes
// and capture the pond band. Reveal is forced via the koi:feed event (count 3).
import { launchBrowser } from "./_pw.mjs";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const outDir = process.argv[2];
mkdirSync(outDir, { recursive: true });

const SIZES = [
  [1440, 900],
  [1300, 700],
  [1150, 800],
  [1000, 900],
  [860, 700],
  [760, 900],
];

const browser = await launchBrowser();
for (const [w, h] of SIZES) {
  const ctx = await browser.newContext({
    viewport: { width: w, height: h },
    deviceScaleFactor: 1,
  });
  await ctx.addInitScript(() => sessionStorage.setItem("skip-loader", "1"));
  const page = await ctx.newPage();
  await page.goto("http://localhost:3000/", { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(1500);
  await page.evaluate(() => {
    window.dispatchEvent(
      new CustomEvent("koi:feed", { detail: { count: 3 } }),
    );
  });
  await page.waitForTimeout(400);
  const zone = await page.evaluate(() => {
    const el = document.querySelector(".koi-how");
    const r = el.getBoundingClientRect();
    return { top: r.top + window.scrollY, height: r.height };
  });
  // capture the band in viewport-sized slices
  const slices = Math.ceil(zone.height / h);
  for (let i = 0; i < slices; i++) {
    await page.evaluate(
      ({ y }) => window.scrollTo(0, y),
      { y: Math.round(zone.top + i * h) },
    );
    await page.waitForTimeout(900);
    await page.screenshot({ path: join(outDir, `how-${w}x${h}-${i}.png`) });
  }
  // overlap report: bounding boxes of the three cards
  const boxes = await page.evaluate(() => {
    return [...document.querySelectorAll(".koi-how-card")].map((el) => {
      const r = el.getBoundingClientRect();
      return {
        cls: el.className.match(/koi-how-card-\d/)?.[0],
        top: Math.round(r.top + window.scrollY),
        bottom: Math.round(r.bottom + window.scrollY),
        left: Math.round(r.left),
        right: Math.round(r.right),
      };
    });
  });
  const sect = await page.evaluate(() => {
    const el = document.querySelector(".home-koi-section");
    const r = el.getBoundingClientRect();
    return { top: Math.round(r.top + window.scrollY), bottom: Math.round(r.bottom + window.scrollY) };
  });
  console.log(`${w}x${h} section ${sect.top}-${sect.bottom}`);
  for (const b of boxes) console.log(`   ${b.cls}: y ${b.top}-${b.bottom}  x ${b.left}-${b.right}${b.bottom > sect.bottom ? "  ⚠ OVERFLOWS SECTION" : ""}`);
  for (let i = 0; i < boxes.length - 1; i++) {
    const a = boxes[i], c = boxes[i + 1];
    const xOverlap = a.left < c.right && c.left < a.right;
    if (a.bottom > c.top && xOverlap) console.log(`   ⚠ ${a.cls} overlaps ${c.cls} by ${a.bottom - c.top}px`);
    else if (a.bottom > c.top) console.log(`   (vertical pass-by ok: ${a.cls}/${c.cls} on different rails)`);
  }
  await ctx.close();
}
await browser.close();
