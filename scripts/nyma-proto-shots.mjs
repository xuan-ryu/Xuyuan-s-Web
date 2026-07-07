// One-off: capture the Nyma AI-workflow artifacts (Claude Design standalone
// bundles + AI prototype HTMLs from S:\Smarttwigs\figma) as case-page figures.
import { pathToFileURL } from "node:url";
import { launchBrowser, preScroll } from "./_pw.mjs";

const OUT = "S:/Xuyuan Web/portfolio/public/media/work/nyma";
const SRC = "S:/Smarttwigs/figma";

const shots = [
  {
    file: `${SRC}/claude design/NYMA Design System - Standalone.html`,
    out: `${OUT}/claude-design-system.png`,
    viewport: { width: 1440, height: 2200 },
    wait: 9000,
  },
  {
    file: `${SRC}/claude design/NYMA Mobile App - Standalone (1).html`,
    out: `${OUT}/claude-mobile.png`,
    viewport: { width: 1440, height: 1400 },
    wait: 12000,
  },
  {
    file: `${SRC}/ai prototype/nyma-platform_1.html`,
    out: `${OUT}/ai-proto-platform.png`,
    viewport: { width: 1440, height: 2400 },
    wait: 6000,
  },
  {
    file: `${SRC}/ai prototype/nyma-njal-style_1.html`,
    out: `${OUT}/ai-proto-njal.png`,
    viewport: { width: 1440, height: 2400 },
    wait: 6000,
  },
];

const browser = await launchBrowser();
for (const shot of shots) {
  const page = await browser.newPage({ viewport: shot.viewport });
  try {
    await page.goto(pathToFileURL(shot.file).href, {
      waitUntil: "networkidle",
      timeout: 45000,
    });
  } catch {
    console.warn(`networkidle timeout (continuing): ${shot.file}`);
  }
  await page.waitForTimeout(shot.wait);
  await preScroll(page, { step: 700, delay: 120 });
  await page.waitForTimeout(800);
  await page.screenshot({ path: shot.out, fullPage: false });
  console.log(`OK ${shot.out}`);
  await page.close();
}
await browser.close();
