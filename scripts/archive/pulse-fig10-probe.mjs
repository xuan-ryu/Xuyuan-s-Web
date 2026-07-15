// One-off probe: does the Fig.10 monolith-split scrub END fully visible after
// a progressive wheel-style scroll? Reports low-opacity parts + a screenshot.
import { launchBrowser, skipLoader } from "../_pw.mjs";
const browser = await launchBrowser();
const ctx = await browser.newContext({ viewport: { width: 1536, height: 1000 } });
await skipLoader(ctx);
const page = await ctx.newPage();
await page.goto("http://localhost:3000/work/pulse", { waitUntil: "networkidle" });
await page.waitForTimeout(1000);
await page.click(".pulse-door:nth-of-type(2)");
await page.waitForTimeout(800);
const y = await page.evaluate(() => {
  const card = document.querySelector(".pulse-monolith-fig");
  return card ? card.getBoundingClientRect().top + window.scrollY : null;
});
console.log("fig10 y:", y);
for (let s = 0; s <= y + 600; s += 300) {
  await page.evaluate((yy) => window.scrollTo(0, yy), s);
  await page.waitForTimeout(90);
}
await page.evaluate((yy) => window.scrollTo(0, yy - 320), y);
await page.waitForTimeout(1500);
const state = await page.evaluate(() => {
  const card = document.querySelector(".pulse-monolith-fig");
  const parts = Array.from(card.querySelectorAll("*")).filter((n) => {
    const cs = getComputedStyle(n);
    return Number(cs.opacity) < 0.99 || cs.visibility === "hidden";
  });
  return parts.slice(0, 20).map((n) => ({
    cls: n.className?.toString().slice(0, 60),
    opacity: getComputedStyle(n).opacity,
    transform: getComputedStyle(n).transform.slice(0, 40),
    text: n.textContent?.trim().slice(0, 30),
  }));
});
console.log(JSON.stringify(state, null, 1));
await page.screenshot({ path: process.argv[2] + "/fig10-final.png" });
await browser.close();
