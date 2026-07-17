// One-off probe (2026-07-16), round 2: the row-tap click IS prevented yet the
// page still navigates ~2s later. Trace every click + the navigation trigger.
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
page.on("console", (m) => {
  const t = m.text();
  if (t.startsWith("PROBE")) console.log(t);
});
page.on("framenavigated", (f) =>
  console.log("NAV EVENT ->", f.url(), "at", Date.now() % 100000),
);
await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
await page.waitForTimeout(2500);

await page.evaluate(() => {
  document.querySelector(".fg-section")?.scrollIntoView();
  const log = (...a) => console.log("PROBE", performance.now().toFixed(0), ...a);
  for (const type of ["click", "pointerup"]) {
    document.addEventListener(
      type,
      (e) => {
        const el = e.target;
        log(
          type,
          el?.tagName,
          (el?.className || "").toString().slice(0, 44),
          "prevented=" + e.defaultPrevented,
          "trusted=" + e.isTrusted,
        );
      },
      true,
    );
  }
  // catch history-based navigations
  for (const fn of ["pushState", "replaceState"]) {
    const orig = history[fn].bind(history);
    history[fn] = (...args) => {
      log("history." + fn, JSON.stringify(args[2] ?? ""));
      return orig(...args);
    };
  }
  window.addEventListener("beforeunload", () => log("beforeunload"));
});
await page.waitForTimeout(400);
await page.tap(".fg-row:nth-child(3) .fg-row-name");
console.log("tapped at", Date.now() % 100000);
for (let i = 0; i < 6; i++) {
  await page.waitForTimeout(700);
  console.log("t+" + (i + 1) * 700 + "ms url:", page.url());
}
await browser.close();
