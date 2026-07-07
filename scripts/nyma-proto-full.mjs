// Full-page captures of the two AI prototype HTMLs so distinct sections can
// be cropped (the near-identical hero shots read as no-contrast).
import { pathToFileURL } from "node:url";
import { launchBrowser, preScroll } from "./_pw.mjs";

const OUT =
  "C:/Users/Admin/AppData/Local/Temp/claude/s--Xuyuan-Web/185349c9-1740-41f7-ac19-cba4fb902b72/scratchpad";
const SRC = "S:/Smarttwigs/figma/ai prototype";

const browser = await launchBrowser();
for (const [file, out] of [
  [`${SRC}/nyma-njal-style_1.html`, `${OUT}/proto-njal-full.png`],
  [`${SRC}/nyma-platform_1.html`, `${OUT}/proto-platform-full.png`],
]) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  try {
    await page.goto(pathToFileURL(file).href, {
      waitUntil: "networkidle",
      timeout: 45000,
    });
  } catch {}
  await page.waitForTimeout(4000);
  await preScroll(page, { step: 700, delay: 120 });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: out, fullPage: true });
  console.log("OK", out);
  await page.close();
}
await browser.close();
