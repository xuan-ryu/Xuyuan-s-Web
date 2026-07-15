// One-off probe: dimensions + mid frames of the three pulse recordings.
import { launchBrowser } from "../_pw.mjs";
const outDir = process.argv[2];
const browser = await launchBrowser();
const page = await (await browser.newContext({ viewport: { width: 1300, height: 800 } })).newPage();
for (const name of ["preview", "gate-flow", "calendar-run"]) {
  await page.goto(`http://localhost:3000/media/work/pulse/${name}.mp4`);
  await page.waitForTimeout(1200);
  const dims = await page.evaluate(async () => {
    const v = document.querySelector("video");
    if (!v) return null;
    if (v.readyState < 1) await new Promise((r) => v.addEventListener("loadedmetadata", r, { once: true }));
    v.pause();
    v.currentTime = Math.min(3, v.duration / 2);
    await new Promise((r) => v.addEventListener("seeked", r, { once: true }));
    return { w: v.videoWidth, h: v.videoHeight, dur: Math.round(v.duration * 10) / 10 };
  });
  console.log(name, JSON.stringify(dims));
  await page.screenshot({ path: `${outDir}/vid-${name}.png` });
}
await browser.close();
