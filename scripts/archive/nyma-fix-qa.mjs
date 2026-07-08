// QA probe for the 2026-07-08 nyma fix wave + phone prototype.
// Captures evidence shots and asserts the RM fallbacks + prototype behavior.
import { launchBrowser, skipLoader, preScroll } from "./_pw.mjs";

const OUT =
  "C:/Users/Admin/AppData/Local/Temp/claude/s--Xuyuan-Web/83f69ad4-f0be-4b0e-9cea-6fbb2ca899c1/scratchpad/nyma-fix-qa";
const URL = "http://localhost:3000/work/nyma";
const fails = [];
const ok = (cond, msg) => {
  console.log(`${cond ? "PASS" : "FAIL"} ${msg}`);
  if (!cond) fails.push(msg);
};

const browser = await launchBrowser();

// ── 1 · desktop 1536: prototype static, switched, focus; page sections ──
{
  const page = await browser.newPage({ viewport: { width: 1536, height: 960 } });
  await skipLoader(page);
  await page.goto(URL, { waitUntil: "networkidle", timeout: 60000 });
  await preScroll(page, { step: 700, delay: 100 });
  await page.waitForTimeout(800);

  // outcome band + ledger (number dedup)
  await page.locator(".ny-ledger").scrollIntoViewIfNeeded();
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${OUT}/d-ledger.png` });

  // ch1 alignment
  await page.locator("#ny-ch1").scrollIntoViewIfNeeded();
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${OUT}/d-ch1.png` });

  // ch4 tally
  await page.locator(".ny-tally").scrollIntoViewIfNeeded();
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${OUT}/d-tally.png` });

  // the prototype — static default
  const proto = page.locator(".nyp");
  await proto.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `${OUT}/d-proto-auctions.png` });
  ok(
    (await page.locator(".nyp-title").textContent()) === "AUCTIONS",
    "prototype default screen is Auctions",
  );

  // interaction: tap lot 024 to watch it
  await page.locator(".nyp-lot").first().click();
  await page.waitForTimeout(300);
  ok(
    (await page.locator(".nyp-watch-tag").count()) === 1,
    "tapping a lot lights its WATCHING tag",
  );
  await page.screenshot({ path: `${OUT}/d-proto-watching.png` });

  // switch to bag via prototype tab
  await page.getByRole("button", { name: "05 / Bag" }).click();
  await page.waitForTimeout(300);
  ok(
    (await page.locator(".nyp-title").textContent()) === "BAG",
    "screen tab switches to Bag",
  );
  ok(
    (await page.locator(".nyp-total strong").textContent())?.includes("14,520"),
    "bag total starts at US $14,520",
  );
  await page.screenshot({ path: `${OUT}/d-proto-bag.png` });

  // auth opt-out recomputes the total
  await page.locator("button.nyp-summary-row").click();
  await page.waitForTimeout(200);
  ok(
    (await page.locator(".nyp-total strong").textContent())?.includes("14,485"),
    "auth opt-out drops the total to US $14,485",
  );

  // remove the tabi — subtotal recounts
  await page.locator(".nyp-bag-x").nth(1).click();
  await page.waitForTimeout(200);
  ok(
    (await page.locator(".nyp-subline").first().textContent())?.includes(
      "1 OBJECT",
    ),
    "removing an object recounts the bag",
  );
  await page.screenshot({ path: `${OUT}/d-proto-bag-edited.png` });

  // saved screen
  await page.getByRole("button", { name: "06 / Saved" }).click();
  await page.waitForTimeout(300);
  ok(
    (await page.locator(".nyp-title").textContent()) === "SAVED",
    "screen tab switches to Saved",
  );
  await page.screenshot({ path: `${OUT}/d-proto-saved.png` });

  // in-phone bottom nav returns to auctions
  await page.locator(".nyp-nav button").click();
  await page.waitForTimeout(300);
  ok(
    (await page.locator(".nyp-title").textContent()) === "AUCTIONS",
    "in-phone AUCTIONS nav returns to the feed",
  );

  // keyboard focus ring on the screen tabs
  await page.getByRole("button", { name: "05 / Bag" }).focus();
  await page.keyboard.press("Shift+Tab");
  await page.keyboard.press("Tab");
  await page.waitForTimeout(200);
  await page.screenshot({ path: `${OUT}/d-proto-focus.png` });

  // ladder cue wording (desktop: hover phrasing visible, tap hidden)
  const hoverCue = await page
    .locator(".ny-ladder-foot .ny-cue-hover")
    .evaluate((el) => getComputedStyle(el).display);
  const tapCue = await page
    .locator(".ny-ladder-foot .ny-cue-tap")
    .evaluate((el) => getComputedStyle(el).display);
  ok(hoverCue !== "none" && tapCue === "none", "desktop shows hover cue only");

  // strip cue: motion on desktop → scrub phrasing
  const scrubCue = await page
    .locator(".ny-strip-foot .ny-cue-scrub")
    .evaluate((el) => getComputedStyle(el).display);
  ok(scrubCue !== "none", "motion desktop shows scrub cue");

  await page.close();
}

// ── 2 · reduced-motion probe: strip/pagescroll reachable, proto final ──
{
  const ctx = await browser.newContext({
    viewport: { width: 1536, height: 960 },
    reducedMotion: "reduce",
  });
  const page = await ctx.newPage();
  await skipLoader(page);
  await page.goto(URL, { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(1200);

  ok(
    !(await page.locator(".nyma-case-page.ny-motion").count()),
    "RM: .ny-motion never set",
  );

  const strip = page.locator(".ny-strip").first();
  await strip.scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  const stripState = await strip.evaluate((el) => ({
    overflowX: getComputedStyle(el).overflowX,
    scrollable: el.scrollWidth > el.clientWidth + 40,
  }));
  ok(
    stripState.overflowX === "auto" && stripState.scrollable,
    `RM: strip hand-scrollable (${JSON.stringify(stripState)})`,
  );
  // actually reach the far end
  await strip.evaluate((el) => (el.scrollLeft = el.scrollWidth));
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${OUT}/rm-strip-end.png` });

  const frame = page.locator(".ny-pagescroll-frame").first();
  await frame.scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  const frameState = await frame.evaluate((el) => ({
    overflowY: getComputedStyle(el).overflowY,
    scrollable: el.scrollHeight > el.clientHeight + 40,
  }));
  ok(
    frameState.overflowY === "auto" && frameState.scrollable,
    `RM: pagescroll frame scrollable (${JSON.stringify(frameState)})`,
  );
  await frame.evaluate((el) => (el.scrollTop = el.scrollHeight));
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${OUT}/rm-frame-end.png` });

  // cue wording flips to the hand phrasing under RM
  const handCue = await page
    .locator(".ny-strip-foot .ny-cue-hand")
    .evaluate((el) => getComputedStyle(el).display);
  const scrubCue = await page
    .locator(".ny-strip-foot .ny-cue-scrub")
    .evaluate((el) => getComputedStyle(el).display);
  ok(handCue !== "none" && scrubCue === "none", "RM: strip cue says scroll-sideways");

  // prototype arrives in its finished default state
  const proto = page.locator(".nyp");
  await proto.scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
  ok(
    (await page.locator(".nyp-title").textContent()) === "AUCTIONS",
    "RM: prototype lands complete (Auctions)",
  );
  await page.screenshot({ path: `${OUT}/rm-proto.png` });
  await ctx.close();
}

// ── 3 · 390 phone ──
{
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    deviceScaleFactor: 2,
  });
  await skipLoader(page);
  await page.goto(URL, { waitUntil: "networkidle", timeout: 60000 });
  await preScroll(page, { step: 700, delay: 80 });
  await page.waitForTimeout(800);

  const proto = page.locator(".nyp");
  await proto.scrollIntoViewIfNeeded();
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${OUT}/m-proto.png` });
  await page.getByRole("button", { name: "06 / Saved" }).click();
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${OUT}/m-proto-saved.png` });

  // ch4 plate placeholder ground (scroll fresh so lazy gap is visible-ish)
  await page.locator(".ny-wall").scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${OUT}/m-ch4-wall.png` });

  // ladder cue: touch → tap phrasing
  const tapCue = await page
    .locator(".ny-ladder-foot .ny-cue-tap")
    .evaluate((el) => getComputedStyle(el).display);
  ok(tapCue !== "none", "touch shows tap cue");
  await page.close();
}

await browser.close();
console.log(fails.length ? `\n${fails.length} FAILURES` : "\nALL PASS");
process.exit(fails.length ? 1 : 0);
