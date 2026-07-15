// One-off probe: verify the 2026-07-14 numbering + SaaS polish pass.
// Shots: hero, doors (selected ring), rail+chapter both tracks, fig
// captions, the tightened Turn seam. Usage: node pulse-polish-verify.mjs <out>
import fs from "node:fs";
import path from "node:path";
import { launchBrowser, skipLoader, preScroll } from "../_pw.mjs";

const outDir = process.argv[2];
fs.mkdirSync(outDir, { recursive: true });
const browser = await launchBrowser();
const ctx = await browser.newContext({ viewport: { width: 1536, height: 1000 } });
await skipLoader(ctx);
const page = await ctx.newPage();
await page.goto("http://localhost:3000/work/pulse", { waitUntil: "networkidle" });
await page.waitForTimeout(1200);

const shot = async (name) => {
  await page.waitForTimeout(1100);
  await page.screenshot({ path: path.join(outDir, `${name}.png`) });
};
const scrollToSel = async (sel, offset = -140) => {
  await page.evaluate(({ sel, offset }) => {
    const el = document.querySelector(sel);
    if (el) window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY + offset);
  }, { sel, offset });
};

// hero (media shadow + live dot)
await shot("01-hero");
// doors: default selected = product
await scrollToSel(".pulse-doors", -300);
await shot("02-doors-product");
// rail + chapter 1.2 running
await scrollToSel("#act-surfaces", -200);
await shot("03-p1-rail");
// fig 1.7 caption + seam into the Turn
await scrollToSel("#act-turn", -700);
await shot("04-p1-turn-seam");
await scrollToSel("#act-turn", -120);
await shot("05-p1-turn");
// switch to part 2
await scrollToSel(".pulse-doors", -300);
await page.waitForTimeout(600);
await page.click(".pulse-door:nth-of-type(2)");
await page.waitForTimeout(900);
await shot("06-doors-system");
await preScroll(page, { step: 800, delay: 100 });
await scrollToSel("#act-bet", -200);
await shot("07-p2-rail");
await scrollToSel("#act-turn", -700);
await shot("08-p2-turn-seam");
// rail hover state on a row
await scrollToSel("#act-base", -200);
await page.hover('.pulse-rail li a[href="#act-skills"]');
await shot("09-rail-hover");
await browser.close();
