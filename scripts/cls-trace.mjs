// CLS forensics: record every layout-shift entry (with source elements)
// through a realistic home visit — loader plays, then a full scroll-through.
// Usage: node scripts/cls-trace.mjs [route] [--skip-loader]
import { launchBrowser } from "./_pw.mjs";

const route = process.argv[2] ?? "/";
const skipLoader = process.argv.includes("--skip-loader");
const BASE = process.env.CLS_BASE ?? "http://localhost:3000";

const browser = await launchBrowser();
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
});
if (skipLoader) {
  await ctx.addInitScript(() => sessionStorage.setItem("skip-loader", "1"));
}
await ctx.addInitScript(() => {
  window.__shifts = [];
  const desc = (n) => {
    if (!n || !n.tagName) return String(n);
    const id = n.id ? `#${n.id}` : "";
    const cls =
      typeof n.className === "string" && n.className
        ? "." + n.className.trim().split(/\s+/).slice(0, 3).join(".")
        : "";
    return `${n.tagName.toLowerCase()}${id}${cls}`;
  };
  new PerformanceObserver((list) => {
    for (const e of list.getEntries()) {
      if (e.hadRecentInput || e.value < 0.005) continue;
      const spacer = document.querySelector(".pin-spacer-fg-gate");
      const prepin = document.querySelector(".fg-prepin");
      const fg = document.querySelector(".fg-section");
      window.__shifts.push({
        t: Math.round(e.startTime),
        value: +e.value.toFixed(4),
        scrollY: Math.round(window.scrollY),
        docH: document.documentElement.scrollHeight,
        spacerH: spacer ? Math.round(spacer.getBoundingClientRect().height) : -1,
        prepinConsumed: prepin?.classList.contains("is-consumed") ?? null,
        fgPos: fg ? getComputedStyle(fg).position : "",
        fgTop: fg ? Math.round(fg.getBoundingClientRect().top) : 0,
        sources: (e.sources ?? []).map((s) => ({
          node: desc(s.node),
          from: s.previousRect
            ? `${s.previousRect.x},${s.previousRect.y} ${s.previousRect.width}x${s.previousRect.height}`
            : "",
          to: s.currentRect
            ? `${s.currentRect.x},${s.currentRect.y} ${s.currentRect.width}x${s.currentRect.height}`
            : "",
        })),
      });
    }
  }).observe({ type: "layout-shift", buffered: true });
});

const page = await ctx.newPage();
await page.goto(`${BASE}${route}`, {
  waitUntil: "networkidle",
  timeout: 60000,
});

// let the loader play out fully (doors ~7.5s worst case)
await page.waitForTimeout(skipLoader ? 2500 : 9000);

// scroll through the whole page the way a visitor would
const total = await page.evaluate(() => document.documentElement.scrollHeight);
const step = 450;
for (let y = 0; y <= total; y += step) {
  await page.mouse.wheel(0, step);
  await page.waitForTimeout(120);
}
await page.waitForTimeout(1500);

const shifts = await page.evaluate(() => window.__shifts);
const sum = shifts.reduce((a, s) => a + s.value, 0);
console.log(`route ${route}  skipLoader=${skipLoader}`);
console.log(`total accumulated shift: ${sum.toFixed(3)} over ${shifts.length} entries\n`);
for (const s of shifts.sort((a, b) => b.value - a.value).slice(0, 15)) {
  console.log(
    `[${s.value}] t=${s.t}ms scrollY=${s.scrollY} docH=${s.docH} spacerH=${s.spacerH} prepinConsumed=${s.prepinConsumed} fgPos=${s.fgPos} fgTop=${s.fgTop}`,
  );
  for (const src of s.sources.slice(0, 4)) {
    console.log(`   ${src.node}  ${src.from} -> ${src.to}`);
  }
}
await browser.close();
