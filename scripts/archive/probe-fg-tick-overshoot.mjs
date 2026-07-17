// One-off probe: seal-red tick trajectory when hovering from row 01 straight
// to row 04 (featured-gate accordion). Samples the tick's translateY each
// frame; overshoot = how far below its final resting Y it travels mid-switch.
import { launchBrowser, skipLoader } from "../_pw.mjs";

const browser = await launchBrowser();
const page = await browser.newPage({ viewport: { width: 1536, height: 960 } });
await skipLoader(page);
await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
await page.evaluate(() => {
  const s = document.querySelector(".fg-section");
  window.scrollTo(0, s.getBoundingClientRect().top + window.scrollY);
});
await page.waitForTimeout(1200);

const result = await page.evaluate(async () => {
  const tick = document.querySelector(".fg-tick");
  const links = document.querySelectorAll(".fg-row-link");
  const tickTop = () =>
    tick.getBoundingClientRect().top -
    document.querySelector(".fg-list").getBoundingClientRect().top;

  // make sure row 01 is active first
  links[0].dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
  await new Promise((r) => setTimeout(r, 900));

  const ys = [];
  let sampling = true;
  const sample = () => {
    ys.push(tickTop());
    if (sampling) requestAnimationFrame(sample);
  };
  requestAnimationFrame(sample);

  links[3].dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
  await new Promise((r) => setTimeout(r, 1500));
  sampling = false;

  const finalY = ys[ys.length - 1];
  const maxY = Math.max(...ys);
  return {
    frames: ys.length,
    startY: +ys[0].toFixed(1),
    finalY: +finalY.toFixed(1),
    maxY: +maxY.toFixed(1),
    overshootBelowFinal: +(maxY - finalY).toFixed(1),
  };
});

console.log(JSON.stringify(result, null, 2));
await browser.close();
