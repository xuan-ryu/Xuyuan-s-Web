// Quick smoke test of the local dev server: load http://localhost:3000 with
// the loader running (NOT skipped), screenshot at three moments, then report
// loader/canvas state and any JS errors.
// Usage: node scripts/selfcheck.mjs   (writes to audit-screenshots/)
import { launchBrowser } from "./_pw.mjs";

const b = await launchBrowser();
const p = await b.newPage({ viewport: { width: 1536, height: 770 } });
const errs = [];
p.on("pageerror", (e) => errs.push("PAGEERROR: " + e.message));
p.on("console", (m) => {
  if (m.type() === "error") errs.push("CONSOLE: " + m.text().slice(0, 200));
});
await p.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
await p.waitForTimeout(1200);
await p.screenshot({ path: "audit-screenshots/selfcheck-1200.png" });
await p.waitForTimeout(1600);
await p.screenshot({ path: "audit-screenshots/selfcheck-2800.png" });
await p.waitForTimeout(2000);
await p.screenshot({ path: "audit-screenshots/selfcheck-4800.png" });
const state = await p.evaluate(() => ({
  bodyOverflow: document.body.style.overflow,
  loaderInDom: !!document.querySelector("[style*='9999']"),
  canvas: !!document.querySelector("canvas"),
}));
console.log(JSON.stringify(state));
console.log(errs.slice(0, 10).join("\n") || "no js errors");
await b.close();
