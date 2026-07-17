// One-off probe (2026-07-16), round 3: positive paths — a row tap switches
// the accordion, the View Project label navigates (with the ink curtain).
import { launchBrowser, skipLoader } from "../_pw.mjs";

const browser = await launchBrowser();
const ctx = await browser.newContext({
  viewport: { width: 393, height: 852 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
});
await skipLoader(ctx);
const page = await ctx.newPage();
await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
await page.waitForTimeout(2000);
await page.evaluate(() => {
  document.querySelector(".fg-section")?.scrollIntoView();
});
await page.waitForTimeout(600);

const activeName = () =>
  page.evaluate(
    () =>
      document.querySelector(".fg-row.is-active .fg-row-name")?.textContent ??
      null,
  );

console.log("active before:", await activeName());
// tap row 4 (ol child 5 = row index 3, after the fg-tick span)
await page.tap(".fg-row:nth-child(5) .fg-row-name");
await page.waitForTimeout(900);
console.log("active after row tap:", await activeName(), "| url:", page.url());

// now tap that row's View Project label
await page.tap(".fg-row.is-active .fg-row-cta");
await page.waitForTimeout(2200);
console.log("url after View Project tap:", page.url());
await browser.close();
