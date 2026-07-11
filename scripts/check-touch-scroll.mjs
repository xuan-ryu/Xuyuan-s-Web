// Repro probe for "phone can't scroll after loader": load home WITHOUT the
// skip-loader flag, let the loader run its full course, then check whether a
// cancelable touchmove still gets default-prevented by a leaked listener.
import { launchBrowser } from "./_pw.mjs";

const browser = await launchBrowser();
const ctx = await browser.newContext({
  viewport: { width: 390, height: 844 },
  hasTouch: true,
  isMobile: true,
  userAgent:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
});
const page = await ctx.newPage();
await page.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });

// loader: intro ~3.3s + broadcast + doors ~1.3s; fallback exit at 5.2s
await page.waitForSelector("[data-app-loader]", { timeout: 5000 }).catch(() => null);
await page.waitForFunction(() => !document.querySelector("[data-app-loader]"), null, { timeout: 12000 });
await page.waitForTimeout(600);

const probe = await page.evaluate(() => {
  const tm = new Event("touchmove", { bubbles: true, cancelable: true });
  document.body.dispatchEvent(tm);
  const wh = new Event("wheel", { bubbles: true, cancelable: true });
  document.body.dispatchEvent(wh);
  return {
    touchmovePrevented: tm.defaultPrevented,
    wheelPrevented: wh.defaultPrevented,
    htmlOverflow: document.documentElement.style.overflow,
    bodyOverflow: document.body.style.overflow,
    bodyTouchAction: document.body.style.touchAction,
    loaderGone: !document.querySelector("[data-app-loader]"),
  };
});
console.log(JSON.stringify(probe, null, 2));

// real gesture: CDP touch swipe up, then read scrollY
const cdp = await ctx.newCDPSession(page);
const swipe = async () => {
  const x = 195;
  await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x, y: 640 }] });
  for (let y = 640; y >= 300; y -= 34) {
    await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x, y }] });
    await page.waitForTimeout(16);
  }
  await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
};
await swipe();
await page.waitForTimeout(900);
const scrollY = await page.evaluate(() => window.scrollY);
console.log("scrollY after swipe:", scrollY);

await browser.close();
process.exit(probe.touchmovePrevented || scrollY <= 0 ? 1 : 0);
