// One-off probe: natural content height of each Selected Work detail well
// (.fg-row-detail-in scrollHeight) vs the fixed 156px well, at 1536 and 1440.
import { launchBrowser, skipLoader } from "../_pw.mjs";

const browser = await launchBrowser();
for (const width of [1536, 1440]) {
  const page = await browser.newPage({ viewport: { width, height: 960 } });
  await skipLoader(page);
  await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
  await page.evaluate(() => {
    const s = document.querySelector(".fg-section");
    window.scrollTo(0, s.getBoundingClientRect().top + window.scrollY);
  });
  await page.waitForTimeout(800);
  const heights = await page.evaluate(async () => {
    const links = [...document.querySelectorAll(".fg-row-link")];
    const out = [];
    for (let i = 0; i < links.length; i++) {
      links[i].dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
      await new Promise((r) => setTimeout(r, 750));
      const inEl = document.querySelectorAll(".fg-row-detail-in")[i];
      out.push({ i, scrollHeight: inEl.scrollHeight });
    }
    return out;
  });
  console.log(width, JSON.stringify(heights));
  await page.close();
}
await browser.close();
