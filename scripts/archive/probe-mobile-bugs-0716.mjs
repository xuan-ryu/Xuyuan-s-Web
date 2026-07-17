// One-off probe (2026-07-16): reproduce three reported mobile bugs on the
// home page at a phone viewport — (1) hero night-card reveal timing vs the
// roof, (2) Selected Work row tap = navigation, (3) HOW I WORK title vs the
// feed chip overlap. Prints geometry numbers + drops screenshots into
// audit-screenshots/mobile-bugs/.
import fs from "node:fs";
import { launchBrowser, skipLoader } from "../_pw.mjs";

const OUT = "audit-screenshots/mobile-bugs";
fs.mkdirSync(OUT, { recursive: true });

const browser = await launchBrowser();
const ctx = await browser.newContext({
  viewport: { width: 393, height: 852 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
  userAgent:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
});
await skipLoader(ctx);
const page = await ctx.newPage();
await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
await page.waitForTimeout(1200);

// ---- geometry: doc positions of the key actors ----
const geo = await page.evaluate(() => {
  const docTop = (el) => {
    if (!el) return null;
    let y = 0;
    let node = el;
    while (node) {
      y += node.offsetTop;
      node = node.offsetParent;
    }
    return y;
  };
  const card = document.querySelector(".profile-sticky");
  const roof = document.querySelector(".home-roof-transition");
  const koi = document.querySelector(".home-koi-section");
  const title = document.querySelector(".koi-how-title");
  const heroUi = document.querySelector("#hero-ui");
  const feedUi = document.querySelector("#feed-ui");
  return {
    winH: window.innerHeight,
    docH: document.body.scrollHeight,
    cardTop: docTop(card),
    roofTop: docTop(roof),
    roofH: roof?.offsetHeight,
    koiTop: docTop(koi),
    koiH: koi?.offsetHeight,
    howTitleTop: docTop(title),
    heroUiTop: docTop(heroUi),
    feedUiH: feedUi?.offsetHeight,
  };
});
console.log(JSON.stringify(geo, null, 2));

// ---- bug 1: step through the hero -> card -> roof window ----
const from = Math.max(0, (geo.cardTop ?? 900) - geo.winH * 0.8);
for (let i = 0; i <= 6; i++) {
  const y = Math.round(from + i * geo.winH * 0.35);
  await page.evaluate((yy) => window.scrollTo(0, yy), y);
  await page.waitForTimeout(650);
  const state = await page.evaluate(() => {
    const card = document.querySelector(".profile-sticky");
    const text = card?.querySelector(".page2-name-block")?.parentElement;
    return {
      scrollY: Math.round(window.scrollY),
      cardOpacity: card ? getComputedStyle(card).opacity : null,
      textOpacity: text ? getComputedStyle(text).opacity : null,
    };
  });
  console.log("step", i, JSON.stringify(state));
  await page.screenshot({ path: `${OUT}/hero-y${state.scrollY}.png` });
}

// ---- bug 3: koi band with title + chip ----
await page.evaluate((y) => window.scrollTo(0, y), geo.koiTop);
await page.waitForTimeout(2500); // let the IO reveal + dock settle
const koiShot = await page.evaluate(() => {
  const r = (el) => el?.getBoundingClientRect();
  const title = r(document.querySelector(".koi-how-title"));
  const chip = r(document.querySelector("#feed-ui"));
  return {
    title: title && { top: Math.round(title.top), bottom: Math.round(title.bottom) },
    chip: chip && { top: Math.round(chip.top), bottom: Math.round(chip.bottom) },
  };
});
console.log("koi", JSON.stringify(koiShot));
await page.screenshot({ path: `${OUT}/koi-band.png` });

// ---- bug 2: tap a Selected Work row, see if it navigates ----
await page.evaluate(() => {
  document.querySelector(".fg-section")?.scrollIntoView();
});
await page.waitForTimeout(800);
await page.screenshot({ path: `${OUT}/fg-before-tap.png` });
const before = page.url();
await page.tap(".fg-row:nth-child(3) .fg-row-name").catch((e) => console.log("tap err", e.message));
await page.waitForTimeout(1500);
console.log("bug2: url before", before, "after", page.url());
await page.screenshot({ path: `${OUT}/fg-after-tap.png` });

await browser.close();
