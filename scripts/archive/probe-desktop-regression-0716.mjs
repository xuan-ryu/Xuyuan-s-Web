// One-off probe (2026-07-16): desktop regression after the mobile pacing
// fixes — the measured card doc-top must still resolve to the old 1241
// constant, the reveal window must be unchanged, and a Selected Work row
// click must still navigate (the tap-to-browse guard is ≤900px only).
import { launchBrowser, skipLoader } from "../_pw.mjs";

const browser = await launchBrowser();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
await skipLoader(ctx);
const page = await ctx.newPage();
await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
await page.waitForTimeout(1500);

const geo = await page.evaluate(() => {
  const docTop = (el) => {
    let y = 0;
    while (el) {
      y += el.offsetTop;
      el = el.offsetParent;
    }
    return y;
  };
  return {
    cardTop: docTop(document.querySelector(".profile-sticky")),
    roofTop: docTop(document.querySelector(".home-roof-transition")),
  };
});
console.log("desktop geo", JSON.stringify(geo), "(cardTop must be 1241)");

// reveal window sanity: card opacity at the old tuned positions
for (const y of [1100, 1400, 1700]) {
  await page.evaluate((yy) => window.scrollTo(0, yy), y);
  await page.waitForTimeout(500);
  const o = await page.evaluate(
    () => getComputedStyle(document.querySelector(".profile-sticky")).opacity,
  );
  console.log("y", y, "card opacity", o);
}

// desktop row click must still navigate (through the ink curtain)
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(300);
await page.evaluate(() => {
  document.querySelector(".fg-section")?.scrollIntoView();
});
await page.waitForTimeout(700);
await page.click(".fg-row:nth-child(3) .fg-row-name");
await page.waitForTimeout(2200);
console.log("desktop url after row click:", page.url());
await browser.close();
