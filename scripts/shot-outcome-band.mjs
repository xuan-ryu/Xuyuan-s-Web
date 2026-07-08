// Screenshot the new outcome band on selected case pages (1440 + one 390).
// Scrolls the band into view, verifies no horizontal overflow, and captures
// a viewport shot centered on the band plus the hero-to-band seam.
import fs from "node:fs";
import path from "node:path";
import { launchBrowser, skipLoader, DEFAULT_VIEWPORT } from "./_pw.mjs";

const OUT = path.join(process.cwd(), "scripts", "shots-outcome-band");
fs.mkdirSync(OUT, { recursive: true });

const targets = [
  { slug: "nyma", width: 1440 },
  { slug: "pulse", width: 1440 },
  { slug: "froghire-ai", width: 1440 },
  { slug: "hunger1942", width: 1440 },
  { slug: "vicino-ai", width: 1440 },
  { slug: "roper-center", width: 1440 },
  { slug: "cloud-support-futures", width: 1440 },
  { slug: "vr-education", width: 1440 },
  { slug: "nyma", width: 390 },
];

const browser = await launchBrowser();
for (const { slug, width } of targets) {
  const viewport =
    width === 1440 ? DEFAULT_VIEWPORT : { width, height: 844 };
  const context = await browser.newContext({ viewport });
  await skipLoader(context);
  const page = await context.newPage();
  const url = `http://localhost:3000/work/${slug}`;
  await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(1200);

  const info = await page.evaluate(() => {
    const band = document.querySelector(".ob-band");
    if (!band) return { found: false };
    band.scrollIntoView({ block: "center" });
    const r = band.getBoundingClientRect();
    const overflow =
      document.documentElement.scrollWidth -
      document.documentElement.clientWidth;
    return {
      found: true,
      height: Math.round(r.height),
      top: Math.round(r.top + window.scrollY),
      left: Math.round(r.left),
      width: Math.round(r.width),
      overflow,
    };
  });
  await page.waitForTimeout(900); // let data-fade play

  const name = `${slug}-${width}.png`;
  await page.screenshot({ path: path.join(OUT, name) });
  console.log(name, JSON.stringify(info));

  // seam shot: hero bottom + band together (scroll so band top sits ~62% down)
  await page.evaluate(() => {
    const band = document.querySelector(".ob-band");
    if (!band) return;
    const r = band.getBoundingClientRect();
    window.scrollTo(0, window.scrollY + r.top - window.innerHeight * 0.55);
  });
  await page.waitForTimeout(700);
  await page.screenshot({ path: path.join(OUT, `${slug}-${width}-seam.png`) });

  await context.close();
}
await browser.close();
console.log("done ->", OUT);
