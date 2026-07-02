// Measure roof-transition piece boxes at a fixed scroll position.
// Usage: node scripts/measure-roof.mjs <url> <scrollY> [width]
import { launchBrowser, skipLoader } from "./_pw.mjs";

const [, , url, scrollArg, widthArg] = process.argv;
const scrollY = Number(scrollArg);
const vpWidth = Number(widthArg) || 1536;

const browser = await launchBrowser();
const page = await browser.newPage({ viewport: { width: vpWidth, height: 1000 } });
await skipLoader(page);
await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
await page.waitForTimeout(2500);
await page.evaluate((y) => window.scrollTo(0, y), scrollY);
await page.waitForTimeout(1500);

const rows = await page.evaluate((sy) => {
  const out = [];
  for (const id of ["D6Nz1N21z7DIjWae8R8LFGCY", "6abw1vzYpd5VHb7WZncQkASt2ag"]) {
    for (const el of document.querySelectorAll(`img[src*="${id}"]`)) {
      const r = el.getBoundingClientRect();
      out.push(
        `${id.slice(0, 4)}: x=${r.x.toFixed(1)} yDoc=${(r.y + sy).toFixed(1)} w=${r.width.toFixed(0)} h=${r.height.toFixed(0)}`,
      );
    }
  }
  return out;
}, scrollY);
console.log(`scrollY=${scrollY} width=${vpWidth}`);
console.log(rows.join("\n"));
await browser.close();
