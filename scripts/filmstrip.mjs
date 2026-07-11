// Viewport filmstrip: scroll a route screen-by-screen, capture each stop,
// tile into one contact-sheet PNG via ffmpeg. Fullpage shots lie on this site
// (pinned/scroll-driven sections render as dead black); this doesn't.
// Usage: node scripts/filmstrip.mjs <route> <name> <outDir> [width height] [cols]
import { launchBrowser } from "./_pw.mjs";
import { mkdirSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { execFileSync } from "node:child_process";

const [route, name, outDir] = process.argv.slice(2);
const width = Number(process.argv[5] ?? 390);
const height = Number(process.argv[6] ?? 844);
const cols = Number(process.argv[7] ?? 4);
if (!route || !name || !outDir) throw new Error("route, name, outDir required");
const tileDir = join(outDir, `${name}-tiles`);
mkdirSync(tileDir, { recursive: true });

const FFMPEG =
  process.env.FFMPEG ??
  "C:\\Users\\Admin\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\\ffmpeg-8.1.2-full_build\\bin\\ffmpeg.exe";

const browser = await launchBrowser();
const ctx = await browser.newContext({
  viewport: { width, height },
  isMobile: width < 800,
  hasTouch: width < 800,
  deviceScaleFactor: 1,
});
await ctx.addInitScript(() => sessionStorage.setItem("skip-loader", "1"));
const page = await ctx.newPage();
await page.goto(`http://localhost:3000${route}`, {
  waitUntil: "networkidle",
  timeout: 45000,
});
await page.waitForTimeout(1500);

const step = Math.round(height * 0.92);
const total = await page.evaluate(() => document.documentElement.scrollHeight);
const stops = Math.min(48, Math.ceil((total - height) / step) + 1);
for (let i = 0; i < stops; i++) {
  await page.evaluate((y) => window.scrollTo(0, y), i * step);
  await page.waitForTimeout(650);
  await page.screenshot({
    path: join(tileDir, `t${String(i).padStart(2, "0")}.png`),
  });
}
await browser.close();

const tiles = readdirSync(tileDir).filter((f) => f.endsWith(".png")).sort();
const rows = Math.ceil(tiles.length / cols);
execFileSync(FFMPEG, [
  "-y",
  "-pattern_type", "sequence",
  "-start_number", "0",
  "-i", join(tileDir, "t%02d.png"),
  "-frames:v", "1",
  "-vf", `scale=iw/2:ih/2,tile=${cols}x${rows}:padding=6:color=orange`,
  join(outDir, `${name}.png`),
]);
console.log(`ok ${name}: ${tiles.length} tiles -> ${cols}x${rows}`);
