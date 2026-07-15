// One-off companion to probe-fg-switch-jitter.mjs: screenshots of the
// Selected Work section at rest and with row 04 active, to eyeball that the
// list height lock doesn't change the accordion's look.
import { launchBrowser, skipLoader } from "../_pw.mjs";

const OUT =
  "C:/Users/Admin/AppData/Local/Temp/claude/s--Xuyuan-Web/bf60cdb3-87d2-418c-96b4-c2033b0a0b04/scratchpad";

const browser = await launchBrowser();
const page = await browser.newPage({ viewport: { width: 1536, height: 960 } });
await skipLoader(page);
await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
await page.evaluate(() => {
  const s = document.querySelector(".fg-section");
  window.scrollTo(0, s.getBoundingClientRect().top + window.scrollY);
});
await page.waitForTimeout(1000);
await page.screenshot({ path: `${OUT}/fg-rest.png` });

await page.evaluate(() => {
  const link = document.querySelectorAll(".fg-row-link")[3];
  link.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
});
await page.waitForTimeout(900);
await page.screenshot({ path: `${OUT}/fg-row4.png` });
await browser.close();
console.log("done");
