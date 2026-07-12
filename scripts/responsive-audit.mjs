// Site-wide responsive audit: for each route × width, walk the page and
// report (a) horizontal document overflow, (b) visible elements that stick
// out past the viewport. Prints a compact report; screenshot separately.
// Usage: node scripts/responsive-audit.mjs [routesCsv]
import { launchBrowser } from "./_pw.mjs";

const ROUTES = (process.argv[2]?.split(",") ?? [
  "/",
  "/work",
  "/about",
  "/contact",
  "/work/nyma",
  "/work/pulse",
  "/work/vicino-ai",
  "/work/froghire-ai",
  "/work/roper-center",
  "/work/cloud-support-futures",
  "/work/hunger1942",
]);
const WIDTHS = [400, 640, 760, 830, 920, 1100, 1280, 1440, 1600];
const HEIGHT = 900;

const browser = await launchBrowser();
const ctx = await browser.newContext({
  viewport: { width: 1440, height: HEIGHT },
  deviceScaleFactor: 1,
});
await ctx.addInitScript(() => sessionStorage.setItem("skip-loader", "1"));
const page = await ctx.newPage();

for (const route of ROUTES) {
  await page.goto(`http://localhost:3000${route}`, {
    waitUntil: "networkidle",
    timeout: 60000,
  });
  await page.waitForTimeout(1200);
  const lines = [];
  for (const w of WIDTHS) {
    await page.setViewportSize({ width: w, height: HEIGHT });
    await page.waitForTimeout(500);
    // walk the page so lazy/reveal content mounts
    await page.evaluate(async () => {
      const h = document.documentElement.scrollHeight;
      for (let y = 0; y < h; y += 800) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 30));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(400);
    const report = await page.evaluate(() => {
      const vw = window.innerWidth;
      const doc = document.documentElement;
      const hscroll = Math.max(doc.scrollWidth - vw, document.body.scrollWidth - vw);
      const offenders = [];
      const seen = new Set();
      for (const el of document.querySelectorAll("body *")) {
        if (offenders.length >= 6) break;
        const cs = getComputedStyle(el);
        if (cs.display === "none" || cs.visibility === "hidden") continue;
        // fixed/absolute decor that's meant to bleed is fine if an ancestor clips
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) continue;
        const overR = Math.round(r.right - vw);
        const overL = Math.round(-r.left);
        if (overR <= 8 && overL <= 8) continue;
        // skip if any ancestor has overflow clipping (the bleed never shows)
        let clipped = false;
        let p = el.parentElement;
        while (p) {
          const pcs = getComputedStyle(p);
          if (/(hidden|clip)/.test(pcs.overflowX + pcs.overflow)) { clipped = true; break; }
          p = p.parentElement;
        }
        if (clipped) continue;
        // dedupe nested offenders: keep outermost only
        let dup = false;
        for (const s of seen) { if (s.contains(el)) { dup = true; break; } }
        if (dup) continue;
        seen.add(el);
        const id = el.id ? `#${el.id}` : "";
        const cls =
          typeof el.className === "string" && el.className
            ? "." + el.className.trim().split(/\s+/).slice(0, 2).join(".")
            : "";
        offenders.push(
          `${el.tagName.toLowerCase()}${id}${cls} [${overL > 8 ? `L+${overL}` : ""}${overR > 8 ? `R+${overR}` : ""}]`,
        );
      }
      return { hscroll, offenders };
    });
    if (report.hscroll > 8 || report.offenders.length) {
      lines.push(
        `  ${w}px: hscroll=${report.hscroll}px ${report.offenders.join("; ")}`,
      );
    }
  }
  console.log(`${route}${lines.length ? "" : "  ✓ clean"}`);
  for (const l of lines) console.log(l);
}
await browser.close();
