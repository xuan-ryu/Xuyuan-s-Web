// One-off QA probe for the cloud-support-futures review fixes.
// Usage: node scripts/cf-review-qa.mjs <outDir>
import { launchBrowser, skipLoader } from "./_pw.mjs";

const out = process.argv[2] || "scripts/shots-cf-review";
const URL = "http://localhost:3000/work/cloud-support-futures";
const browser = await launchBrowser();

// ── 1536 desktop pass ────────────────────────────────────────────────────
const page = await browser.newPage({ viewport: { width: 1536, height: 960 } });
await skipLoader(page);

// network probe: collect media requests from page top
const mediaReqs = [];
page.on("request", (r) => {
  if (/\.(mp4|webm)/.test(r.url())) mediaReqs.push(r.url());
});
await page.goto(URL, { waitUntil: "networkidle", timeout: 60000 });
await page.waitForTimeout(2500);
console.log("[probe] video requests at page top:", mediaReqs.length ? mediaReqs : "none");

// rail geometry: label must stay inside the 72px gutter unless hovered
const railInfo = await page.evaluate(() => {
  const btn = document.querySelector(".cf-rail-nav button.is-on");
  if (!btn) return null;
  const label = btn.querySelector(".cf-rail-label");
  const rect = btn.getBoundingClientRect();
  const style = label ? getComputedStyle(label) : null;
  const shell = document.querySelector(".cf-shell");
  return {
    railRight: rect.right,
    labelOpacity: style?.opacity,
    shellLeft: shell?.getBoundingClientRect().left,
  };
});
console.log("[rail]", railInfo);

// scroll milestones
const yFor = async (sel) =>
  page.evaluate((s) => {
    const el = document.querySelector(s);
    return el ? el.getBoundingClientRect().top + window.scrollY - 90 : null;
  }, sel);

const shots = [
  ["hero-rail", 900],
  ["tensions", await yFor(".cf-tensions")],
  ["ai-motion", await yFor(".cf-ai-motion-board")],
  ["ai-gallery", await yFor(".cf-ai-gallery")],
  ["seats", await yFor(".cf-seats")],
];
for (const [name, y] of shots) {
  if (y == null) {
    console.log(`[skip] ${name}`);
    continue;
  }
  await page.evaluate((top) => window.scrollTo(0, top), y);
  await page.waitForTimeout(1400);
  await page.screenshot({ path: `${out}/1536-${name}.png` });
  console.log(`captured 1536-${name}`);
}

// futures stage: scroll into the pinned region, then open the lightbox
const fu = await page.evaluate(() => {
  const el = document.querySelector(".cf-futures");
  return el ? el.getBoundingClientRect().top + window.scrollY : null;
});
if (fu != null) {
  await page.evaluate((top) => window.scrollTo(0, top + 300), fu);
  await page.waitForTimeout(1600);
  await page.screenshot({ path: `${out}/1536-futures-stage.png` });
  const btn = await page.$(".cf-futures-flow-btn");
  if (btn) {
    await btn.click();
    await page.waitForTimeout(900);
    await page.screenshot({ path: `${out}/1536-lightbox-open.png` });
    const focused = await page.evaluate(() => document.activeElement?.className);
    console.log("[lightbox] focus on:", focused);
    await page.keyboard.press("Escape");
    await page.waitForTimeout(700);
    const stillOpen = await page.$(".cf-lightbox");
    console.log("[lightbox] closed by Esc:", !stillOpen);
    await page.screenshot({ path: `${out}/1536-lightbox-closed.png` });
  } else {
    console.log("[lightbox] trigger not found");
  }
}

// rail jump ghost check: jump from top to "decide", count unrevealed fades
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(800);
await page.evaluate(() => {
  const btns = document.querySelectorAll(".cf-rail-nav button");
  btns[btns.length - 1]?.click();
});
await page.waitForTimeout(1600);
const ghost = await page.evaluate(() => {
  const sec = document.querySelector('[data-cf-stage="decide"]');
  if (!sec) return null;
  const fades = sec.querySelectorAll("[data-fade]");
  return {
    fades: fades.length,
    hidden: [...fades].filter((f) => !f.classList.contains("is-visible")).length,
  };
});
console.log("[rail-jump ghost]", ghost);
await page.screenshot({ path: `${out}/1536-rail-jump-decide.png` });
await page.close();

// ── 1280 pass: rail hidden below 1280? (media query hides at <=1280) ────
const mid = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await skipLoader(mid);
await mid.goto(URL, { waitUntil: "networkidle", timeout: 60000 });
await mid.waitForTimeout(2000);
await mid.evaluate(() => window.scrollTo(0, 900));
await mid.waitForTimeout(1200);
await mid.screenshot({ path: `${out}/1280-rail.png` });
const railVisible = await mid.evaluate(() => {
  const nav = document.querySelector(".cf-rail-nav");
  return nav ? getComputedStyle(nav).display : "absent";
});
console.log("[1280 rail display]", railVisible);
await mid.close();

// ── 390 mobile pass: swipe hint wording ─────────────────────────────────
const mob = await browser.newPage({ viewport: { width: 390, height: 844 } });
await skipLoader(mob);
await mob.goto(URL, { waitUntil: "networkidle", timeout: 60000 });
await mob.waitForTimeout(2000);
const hintY = await mob.evaluate(() => {
  const el = document.querySelector(".cf-fu-hint");
  return el ? el.getBoundingClientRect().top + window.scrollY - 200 : null;
});
if (hintY != null) {
  await mob.evaluate((top) => window.scrollTo(0, top), hintY);
  await mob.waitForTimeout(1200);
  await mob.screenshot({ path: `${out}/390-swipe-hint.png` });
  const hintText = await mob.evaluate(
    () => document.querySelector(".cf-fu-hint")?.textContent?.trim(),
  );
  const cueText = await mob.evaluate(() =>
    [...document.querySelectorAll(".cf-cue span")]
      .filter((s) => getComputedStyle(s).display !== "none")
      .map((s) => s.textContent.trim().slice(0, 40)),
  );
  console.log("[390 hint]", hintText, "| visible cues:", cueText);
}
await mob.close();
await browser.close();
console.log("done");
