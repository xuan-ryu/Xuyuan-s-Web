// Element-level evidence shots of the Pl.16 prototype after the cascade fix.
import { launchBrowser, skipLoader, preScroll } from "./_pw.mjs";

const OUT =
  "C:/Users/Admin/AppData/Local/Temp/claude/s--Xuyuan-Web/83f69ad4-f0be-4b0e-9cea-6fbb2ca899c1/scratchpad/nyma-fix-qa";
const URL = "http://localhost:3000/work/nyma";

const browser = await launchBrowser();
const page = await browser.newPage({ viewport: { width: 1536, height: 1100 } });
await skipLoader(page);
await page.goto(URL, { waitUntil: "networkidle", timeout: 60000 });
await preScroll(page, { step: 700, delay: 90 });
await page.waitForTimeout(800);

const proto = page.locator(".nyp");
await proto.scrollIntoViewIfNeeded();
await page.waitForTimeout(900);
await proto.screenshot({ path: `${OUT}/el-proto-auctions.png` });

await page.locator(".nyp-lot").first().click();
await page.waitForTimeout(250);
await proto.screenshot({ path: `${OUT}/el-proto-watching.png` });

await page.getByRole("button", { name: "05 / Bag" }).click();
await page.waitForTimeout(300);
await proto.screenshot({ path: `${OUT}/el-proto-bag.png` });

await page.getByRole("button", { name: "06 / Saved" }).click();
await page.waitForTimeout(300);
await proto.screenshot({ path: `${OUT}/el-proto-saved.png` });

// focus state on a screen tab
await page.getByRole("button", { name: "04 / Auctions" }).focus();
await page.waitForTimeout(150);
await proto.screenshot({ path: `${OUT}/el-proto-tabfocus.png` });

// mobile element shot
const m = await browser.newPage({
  viewport: { width: 390, height: 844 },
  isMobile: true,
  hasTouch: true,
  deviceScaleFactor: 2,
});
await skipLoader(m);
await m.goto(URL, { waitUntil: "networkidle", timeout: 60000 });
await preScroll(m, { step: 700, delay: 70 });
await m.waitForTimeout(600);
const mp = m.locator(".nyp");
await mp.scrollIntoViewIfNeeded();
await m.waitForTimeout(700);
await mp.screenshot({ path: `${OUT}/el-m-proto.png` });

await browser.close();
console.log("OK");
