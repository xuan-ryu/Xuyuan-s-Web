// QA captures for /work/nyma — full page + keyed sections, desktop & phone.
import { launchBrowser, skipLoader, preScroll } from "./_pw.mjs";

const OUT =
  "C:/Users/Admin/AppData/Local/Temp/claude/s--Xuyuan-Web/185349c9-1740-41f7-ac19-cba4fb902b72/scratchpad/nyma-qa";
const URL = "http://localhost:3000/work/nyma";

const browser = await launchBrowser();

// desktop full page
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await skipLoader(page);
  await page.goto(URL, { waitUntil: "networkidle", timeout: 60000 });
  await preScroll(page, { step: 600, delay: 130 });
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `${OUT}/desktop-full.png`, fullPage: true });
  console.log("OK desktop-full");

  // section captures at viewport height
  for (const [name, sel] of [
    ["hero", "#header"],
    ["ch2-etym", ".ny-etym"],
    ["ch3-roles", ".ny-roles"],
    ["ch4-wall", ".ny-wall"],
    ["ch5-loop", ".ny-loop"],
    ["turn", ".ny-turn"],
  ]) {
    const el = page.locator(sel).first();
    try {
      await el.scrollIntoViewIfNeeded();
      await page.waitForTimeout(900);
      await page.screenshot({ path: `${OUT}/desktop-${name}.png` });
      console.log(`OK desktop-${name}`);
    } catch (e) {
      console.warn(`SKIP ${name}: ${e.message.split("\n")[0]}`);
    }
  }
  await page.close();
}

// phone full page
{
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await skipLoader(page);
  await page.goto(URL, { waitUntil: "networkidle", timeout: 60000 });
  await preScroll(page, { step: 500, delay: 110 });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `${OUT}/phone-full.png`, fullPage: true });
  console.log("OK phone-full");
  await page.close();
}

await browser.close();
