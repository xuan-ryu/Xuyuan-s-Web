// One-off probe: hongyadong hero fixes — facts-row ink→white sync at lit
// drift, and the <html> mouseleave path for the hover-push reset.
import { launchBrowser, skipLoader } from "../_pw.mjs"

const browser = await launchBrowser()
const page = await browser.newPage({ viewport: { width: 1536, height: 1000 } })
await skipLoader(page)
await page.goto("http://localhost:3000/about", {
    waitUntil: "networkidle",
    timeout: 60000,
})
await page.waitForTimeout(2500)

const factsAtTop = await page.evaluate(
    () => getComputedStyle(document.querySelector(".hyf-facts")).color
)

await page.evaluate(() => window.scrollTo(0, 600))
await page.waitForTimeout(1500)
const factsLit = await page.evaluate(
    () => getComputedStyle(document.querySelector(".hyf-facts")).color
)

// exercise hover enter → leave → re-enter; the handlers must not throw and
// the page must keep rendering (rAF alive) afterwards
await page.mouse.move(760, 500)
await page.waitForTimeout(400)
await page.evaluate(() =>
    document.documentElement.dispatchEvent(new MouseEvent("mouseleave"))
)
await page.waitForTimeout(400)
await page.mouse.move(400, 300)
await page.waitForTimeout(400)

const errors = []
page.on("pageerror", (e) => errors.push(String(e)))
await page.screenshot({ path: process.argv[2] || "probe-hero.png" })
console.log(JSON.stringify({ factsAtTop, factsLit, errors }, null, 2))
await browser.close()
