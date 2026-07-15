// One-off probe: the ch01 agents figure after the narrative fix.
import { launchBrowser, skipLoader } from "../_pw.mjs";
const outDir = process.argv[2];
const browser = await launchBrowser();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
await skipLoader(ctx);
const page = await ctx.newPage();
await page.goto("http://localhost:3000/work/pulse", { waitUntil: "networkidle" });
const el = page.locator(".pulse-agents").first();
await el.scrollIntoViewIfNeeded();
await page.waitForTimeout(2500);
await page.evaluate(() => window.scrollBy(0, -200));
await page.waitForTimeout(1500);
await page.screenshot({ path: `${outDir}/agents-fig.png` });
await browser.close();
