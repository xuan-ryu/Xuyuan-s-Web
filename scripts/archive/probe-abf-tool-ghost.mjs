// One-off probe: reproduce the residual black line above .abf-tool icons on
// /about after hover (owner report 2026-07-14). Hovers each icon, moves off,
// then screenshots the wall and inspects the DOM above each icon.
import { launchBrowser, DEFAULT_VIEWPORT } from "../_pw.mjs";

const OUT = process.env.OUT_DIR ?? "audit-screenshots";
const browser = await launchBrowser();
const page = await browser.newPage();
await page.setViewportSize({ width: 1536, height: 864 });
await page.goto("http://localhost:3000/about", { waitUntil: "networkidle" });

// progressive wheel scroll so FadeReveal observers fire like a real user
const wallY = await page.evaluate(() => {
  const el = document.querySelector(".abf-tools-wall");
  return el ? el.getBoundingClientRect().top + window.scrollY : 0;
});
for (let y = 0; y < wallY - 400; y += 300) {
  await page.mouse.wheel(0, 300);
  await page.waitForTimeout(60);
}
await page.waitForTimeout(1400); // entrance animation settles

const tools = await page.$$(".abf-tool");
console.log("tools found:", tools.length);

// hover each icon briefly, then park the mouse away
for (const t of tools) {
  await t.hover();
  await page.waitForTimeout(120);
}
await page.mouse.move(10, 10);
await page.waitForTimeout(900);

const wall = await page.$(".abf-tools-wall");
await wall.screenshot({ path: `${OUT}/abf-wall-after-hover.png` });

// DOM probe: what sits 6-12px above each icon's top edge?
const report = await page.evaluate(() => {
  const rows = [];
  for (const tool of document.querySelectorAll(".abf-tool")) {
    const icon = tool.querySelector(".abf-tool-icon");
    const r = icon.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    for (const dy of [4, 8, 12]) {
      const el = document.elementFromPoint(cx, r.top - dy);
      if (el && !el.closest(".abf-tools-wall")) continue;
      if (el && el !== tool && !el.classList.contains("abf-tools-wall"))
        rows.push({
          name: tool.getAttribute("aria-label"),
          dy,
          hit: el.className || el.tagName,
        });
    }
  }
  return rows;
});
console.log(JSON.stringify(report, null, 1));
await browser.close();
