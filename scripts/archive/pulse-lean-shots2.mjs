// One-off probe: post-gap-fix spot checks — desktop boundary spots at 1440
// plus a phone (390px) sweep. Usage: node pulse-lean-shots2.mjs <outDir>
import fs from "node:fs";
import path from "node:path";
import { launchBrowser, skipLoader, preScroll } from "../_pw.mjs";

const outDir = process.argv[2];
fs.mkdirSync(outDir, { recursive: true });

const browser = await launchBrowser();

// desktop: capture around chapter boundaries
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  await skipLoader(ctx);
  const page = await ctx.newPage();
  await page.goto("http://localhost:3000/work/pulse", { waitUntil: "networkidle" });
  await preScroll(page, { step: 600, delay: 140 });
  const total = await page.evaluate(() => document.body.scrollHeight);
  console.log("desktop height:", total);
  for (const id of ["act-look", "act-bet", "act-base", "act-skills"]) {
    await page.evaluate((anchor) => {
      const el = document.getElementById(anchor);
      if (el) window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 560);
    }, id);
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(outDir, `boundary-${id}.png`) });
  }
  await ctx.close();
}

// phone sweep
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  await skipLoader(ctx);
  const page = await ctx.newPage();
  await page.goto("http://localhost:3000/work/pulse", { waitUntil: "networkidle" });
  await preScroll(page, { step: 500, delay: 120 });
  const total = await page.evaluate(() => document.body.scrollHeight);
  console.log("phone height:", total);
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  console.log("phone horizontal overflow px:", overflow);
  for (let i = 0; i < 6; i++) {
    const y = Math.round((total - 844) * (i / 5));
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(1200);
    await page.screenshot({ path: path.join(outDir, `phone-${i}-y${y}.png`) });
  }
  await ctx.close();
}
await browser.close();
