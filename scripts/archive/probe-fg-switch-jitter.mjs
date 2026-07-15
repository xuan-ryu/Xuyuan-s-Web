// One-off probe: rapid consecutive index switching in the Selected Work
// accordion (featured-gate.tsx) — samples the list / gate / section boxes
// every frame while hovering across rows quickly, and reports how much each
// one moves. Run:  node scripts/archive/probe-fg-switch-jitter.mjs
import { launchBrowser, skipLoader, DEFAULT_VIEWPORT } from "../_pw.mjs";

const browser = await launchBrowser();
const page = await browser.newPage({ viewport: { width: 1536, height: 960 } });
await skipLoader(page);
await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });

// bring the section to the top (pin start) so all rows are hoverable
await page.evaluate(() => {
  const s = document.querySelector(".fg-section");
  window.scrollTo(0, s.getBoundingClientRect().top + window.scrollY);
});
await page.waitForTimeout(1200);

const result = await page.evaluate(async () => {
  const list = document.querySelector(".fg-list");
  const gate = document.querySelector(".fg-gate");
  const section = document.querySelector(".fg-section");
  const title = document.querySelector(".fg-title");
  const rows = [...document.querySelectorAll(".fg-row-link")];

  const track = { list: [], gateW: [], gateTop: [], titleTop: [], sectionH: [] };
  let sampling = true;
  const sample = () => {
    track.list.push(list.getBoundingClientRect().height);
    const g = gate.getBoundingClientRect();
    track.gateW.push(g.width);
    track.gateTop.push(g.top);
    track.titleTop.push(title.getBoundingClientRect().top);
    track.sectionH.push(section.getBoundingClientRect().height);
    if (sampling) requestAnimationFrame(sample);
  };
  requestAnimationFrame(sample);

  const hover = (el) => {
    el.dispatchEvent(new MouseEvent("mouseenter", { bubbles: false }));
    el.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
  };
  // rapid sweep: 0→3→0→2→1→3… every 140ms, well inside the 600ms transition
  const order = [1, 2, 3, 0, 3, 1, 2, 0, 2, 3, 1, 0];
  for (const i of order) {
    hover(rows[i].parentElement.querySelector(".fg-row-link") || rows[i]);
    await new Promise((r) => setTimeout(r, 140));
  }
  await new Promise((r) => setTimeout(r, 900));
  sampling = false;

  const span = (a) => +(Math.max(...a) - Math.min(...a)).toFixed(2);
  return {
    frames: track.list.length,
    listHeightSpan: span(track.list),
    gateWidthSpan: span(track.gateW),
    gateTopSpan: span(track.gateTop),
    titleTopSpan: span(track.titleTop),
    sectionHeightSpan: span(track.sectionH),
  };
});

console.log(JSON.stringify(result, null, 2));
await browser.close();
