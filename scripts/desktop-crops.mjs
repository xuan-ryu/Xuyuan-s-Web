// Targeted desktop viewport captures of interactive zones for the button audit.
import { launchBrowser } from "./_pw.mjs";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const outDir = process.argv[2];
mkdirSync(outDir, { recursive: true });

const browser = await launchBrowser();
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
});
await ctx.addInitScript(() => sessionStorage.setItem("skip-loader", "1"));
const page = await ctx.newPage();

const shoot = (n) => page.screenshot({ path: join(outDir, `${n}.png`) });

// HOME — hero scroll hint
await page.goto("http://localhost:3000/", { waitUntil: "networkidle", timeout: 45000 });
await page.waitForTimeout(1500);
await shoot("d-hero");

// featured gate
await page.evaluate(() => {
  document.getElementById("featured")?.scrollIntoView();
});
await page.waitForTimeout(1200);
await page.evaluate(() => window.scrollBy(0, 200));
await page.waitForTimeout(800);
await shoot("d-featured-1");
await page.evaluate(() => window.scrollBy(0, 900));
await page.waitForTimeout(800);
await shoot("d-featured-2");

// koi pond — scroll to bottom area before footer
const H = await page.evaluate(() => document.documentElement.scrollHeight);
await page.evaluate((y) => window.scrollTo(0, y), H - 2600);
await page.waitForTimeout(1200);
await shoot("d-koi-1");
await page.evaluate((y) => window.scrollTo(0, y), H - 1800);
await page.waitForTimeout(1000);
await shoot("d-koi-2");

// footer
await page.evaluate((y) => window.scrollTo(0, y), H);
await page.waitForTimeout(1000);
await shoot("d-footer");

// WORK — hover a row to show plate + controls
await page.goto("http://localhost:3000/work", { waitUntil: "networkidle", timeout: 45000 });
await page.waitForTimeout(1200);
await shoot("d-work-top");

// ABOUT — resume CTA zone (search for cta elements and shoot each container)
await page.goto("http://localhost:3000/about", { waitUntil: "networkidle", timeout: 45000 });
await page.waitForTimeout(1200);
const ctas = page.locator(".cta");
const n = await ctas.count();
for (let i = 0; i < n; i++) {
  try {
    await ctas.nth(i).scrollIntoViewIfNeeded();
    await page.waitForTimeout(900);
    await shoot(`d-about-cta-${i}`);
  } catch {}
}

// CONTACT — form + submit
await page.goto("http://localhost:3000/contact", { waitUntil: "networkidle", timeout: 45000 });
await page.waitForTimeout(1200);
await page.evaluate(() => {
  document.querySelector(".ctc-form-section")?.scrollIntoView();
});
await page.waitForTimeout(1000);
await shoot("d-contact-form");

await browser.close();
console.log("done");
