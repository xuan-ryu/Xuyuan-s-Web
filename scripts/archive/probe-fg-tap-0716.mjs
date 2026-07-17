// One-off probe (2026-07-16): why does a Selected Work row tap still
// navigate on the stacked layout after the onClick guard?
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
page.on("console", (m) => console.log("[page]", m.text()));
await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
await page.waitForTimeout(1000);

await page.evaluate(() => {
  document.querySelector(".fg-section")?.scrollIntoView();
  // capture-phase logger on the document: what does the tap dispatch?
  for (const type of ["pointerdown", "touchstart", "click"]) {
    document.addEventListener(
      type,
      (e) => {
        const t = e.target;
        console.log(
          "evt",
          type,
          t?.className?.toString?.().slice(0, 40),
          "mq900=", window.matchMedia("(max-width: 900px)").matches,
        );
      },
      true,
    );
  }
  document.addEventListener("click", (e) =>
    console.log("click bubbled to doc, defaultPrevented =", e.defaultPrevented),
  );
});
await page.waitForTimeout(600);
const src = await page.evaluate(() => {
  const link = document.querySelectorAll(".fg-row-link")[1];
  return { hasLink: !!link, active: document.querySelectorAll(".fg-row.is-active").length };
});
console.log("state", JSON.stringify(src));
await page.tap(".fg-row:nth-child(3) .fg-row-name");
await page.waitForTimeout(1200);
console.log("url after tap:", page.url());
await browser.close();
