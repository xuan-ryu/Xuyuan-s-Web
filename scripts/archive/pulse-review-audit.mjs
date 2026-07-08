// Pulse review-fix probes: contrast, assembly completion, rail anchors, RM.
import { launchBrowser, skipLoader } from "./_pw.mjs";

const URL = "http://localhost:3000/work/pulse";

function lum([r, g, b]) {
  const f = (c) => {
    c /= 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}
function contrast(fg, bg) {
  const [a, b] = [lum(fg), lum(bg)].sort((x, y) => y - x);
  return (a + 0.05) / (b + 0.05);
}
const parseRgb = (s) => s.match(/[\d.]+/g).slice(0, 3).map(Number);

const browser = await launchBrowser();

// ── pass 1: motion allowed ──
{
  const page = await browser.newPage({ viewport: { width: 1536, height: 900 } });
  await skipLoader(page);
  await page.goto(URL, { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(2000);

  // 1) contrast probe (vs stage #f4f7f7 per review)
  const stage = [244, 247, 247];
  const sels = [
    [".pulse-console-ledger span", "console ledger unit"],
    [".pulse-kv-row span", "kv key"],
    [".pulse-rail-head", "rail head"],
    [".pulse-spec-ruler-label", "ruler label"],
    [".pulse-rail li", "rail pending item"],
    [".pulse-ledger span", "figures ledger unit"],
    [".pulse-spec-head", "spec head"],
  ];
  console.log("── contrast vs #f4f7f7 ──");
  for (const [sel, name] of sels) {
    const col = await page.$eval(sel, (el) => getComputedStyle(el).color).catch(() => null);
    if (!col) { console.log(`  MISSING ${name} (${sel})`); continue; }
    const r = contrast(parseRgb(col), stage);
    console.log(`  ${r >= 4.5 ? "PASS" : "FAIL"} ${name}: ${col} → ${r.toFixed(2)}:1`);
  }

  // 2) assembly completion: each diagram figure fully visible ≤1.2s after scrollIntoView
  const figSel =
    "figure[data-fade]:has(.pflow), figure[data-fade]:has(.pulse-melee), figure[data-fade]:has(.pulse-timeline), figure[data-fade]:has(.pflow-hub), figure[data-fade]:has(.pulse-chain-row)";
  const figCount = await page.$$eval(figSel, (els) => els.length);
  console.log(`── assembly probe (${figCount} diagram figures) ──`);
  for (let i = 0; i < figCount; i++) {
    const res = await page.evaluate(
      async ({ sel, idx }) => {
        const fig = document.querySelectorAll(sel)[idx];
        fig.scrollIntoView({ block: "center", behavior: "instant" });
        const t0 = performance.now();
        await new Promise((r) => setTimeout(r, 1200));
        const parts = fig.querySelectorAll(
          ".pflow-node, .pflow-line, .pflow-loop, .pflow-note, .pulse-melee-cell, .pulse-timeline-row, .pulse-timeline-legend, .pflow-hub-bar, .pflow-hub-chip, .pulse-chain-cell, .pulse-chain-link",
        );
        let bad = 0;
        parts.forEach((p) => {
          if (Number(getComputedStyle(p).opacity) < 0.99) bad++;
        });
        const label = fig.querySelector(".pulse-fig")?.textContent ?? `#${idx}`;
        return { label, total: parts.length, bad, visible: fig.classList.contains("is-visible"), dt: Math.round(performance.now() - t0) };
      },
      { sel: figSel, idx: i },
    );
    console.log(
      `  ${res.bad === 0 ? "PASS" : "FAIL"} ${res.label}: ${res.total - res.bad}/${res.total} parts opaque after ${res.dt}ms (is-visible=${res.visible})`,
    );
    await page.waitForTimeout(120);
  }

  // 3) rail anchors: links exist, focusable, click scrolls to chapter
  console.log("── rail probe ──");
  const railInfo = await page.evaluate(() => {
    const nav = document.querySelector(".pulse-rail nav");
    const links = [...document.querySelectorAll(".pulse-rail li a")];
    return {
      navLabel: nav?.getAttribute("aria-label"),
      ariaHidden: document.querySelector(".pulse-rail")?.getAttribute("aria-hidden"),
      n: links.length,
      hrefs: links.map((a) => a.getAttribute("href")),
      targetsOk: links.every((a) => document.querySelector(a.getAttribute("href"))),
    };
  });
  console.log(`  nav aria-label="${railInfo.navLabel}" aria-hidden=${railInfo.ariaHidden} links=${railInfo.n} targetsOk=${railInfo.targetsOk}`);
  await page.evaluate(() => window.scrollTo(0, 3000));
  await page.waitForTimeout(600);
  await page.click('.pulse-rail li a[href="#act-product"]');
  await page.waitForTimeout(1800);
  const landed = await page.evaluate(() => {
    const r = document.querySelector("#act-product").getBoundingClientRect();
    return Math.round(r.top);
  });
  console.log(`  ${landed > 0 && landed < 200 ? "PASS" : "FAIL"} click #act-product → chapter top at ${landed}px from viewport top`);
  // keyboard focus
  await page.evaluate(() => document.querySelector('.pulse-rail li a')?.focus());
  const focusOutline = await page.$eval(".pulse-rail li a", (el) => {
    el.focus();
    return getComputedStyle(el).outlineWidth;
  });
  console.log(`  focus outline-width=${focusOutline}`);
  await page.close();
}

// ── pass 2: reduced motion — finished state ──
{
  const ctx = await browser.newContext({
    viewport: { width: 1536, height: 900 },
    reducedMotion: "reduce",
  });
  const page = await ctx.newPage();
  await skipLoader(page);
  await page.goto(URL, { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(1500);
  console.log("── reduced-motion finished-state probe ──");
  const rm = await page.evaluate(() => {
    const txt = (s) => document.querySelector(s)?.textContent?.trim();
    const counts = [...document.querySelectorAll("[data-count]")].map((el) => [el.dataset.count, el.textContent.trim()]);
    const monolith = txt(".pulse-monolith-count");
    const ladderOn = document.querySelectorAll(".pulse-ladder-pill.is-on").length;
    const stream = txt(".pulse-stream");
    // scan every diagram part for hidden state
    let hidden = 0;
    document
      .querySelectorAll(".pflow-node, .pflow-line, .pflow-loop, .pflow-note, .pulse-melee-cell, .pulse-timeline-row, .pulse-chain-cell, .pulse-chain-link, .pflow-hub-bar, .pflow-hub-chip, .pulse-inv-cell")
      .forEach((p) => {
        if (Number(getComputedStyle(p).opacity) < 0.99) hidden++;
      });
    return { counts, monolith, ladderOn, stream, hidden };
  });
  console.log(`  counters: ${JSON.stringify(rm.counts)}`);
  console.log(`  monolith=${rm.monolith} ladderOn=${rm.ladderOn} stream="${rm.stream}"`);
  console.log(`  ${rm.hidden === 0 ? "PASS" : "FAIL"} hidden diagram parts: ${rm.hidden}`);
  await ctx.close();
}

await browser.close();
