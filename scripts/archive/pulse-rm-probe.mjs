// One-off probe: reduced-motion renders the finished page (no hidden states).
import { launchBrowser, skipLoader } from "../_pw.mjs";
const browser = await launchBrowser();
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  reducedMotion: "reduce",
});
await skipLoader(ctx);
const page = await ctx.newPage();
await page.goto("http://localhost:3000/work/pulse", { waitUntil: "networkidle" });
for (const sel of [".pflow-node", ".pulse-melee-cell", ".pulse-spine-node", ".pulse-monolith-chip"]) {
  const hidden = await page.$$eval(sel, (els) =>
    els.filter((el) => Number(getComputedStyle(el).opacity) < 0.99).length,
  );
  console.log(sel, "hidden:", hidden, "/", await page.locator(sel).count());
}
await browser.close();
