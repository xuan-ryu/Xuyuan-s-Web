// One-off probe: tools-wall opacity-crossfade hover — lit copy shows on
// hover, rest copy returns after the pointer moves away.
import { launchBrowser, skipLoader } from "../_pw.mjs"

const outDir = process.argv[2] || "."
const browser = await launchBrowser()
const page = await browser.newPage({ viewport: { width: 1536, height: 1000 } })
await skipLoader(page)
await page.goto("http://localhost:3000/about", {
    waitUntil: "networkidle",
    timeout: 60000,
})
await page.waitForTimeout(2000)

const tool = page.locator('.abf-tool[aria-label="Illustrator"]')
await tool.scrollIntoViewIfNeeded()
await page.waitForTimeout(1800)

await tool.hover()
await page.waitForTimeout(600)
const litOnHover = await tool
    .locator(".abf-tool-img-lit")
    .evaluate((el) => getComputedStyle(el).opacity)
await page.screenshot({ path: `${outDir}/tools-hover.png` })

await page.mouse.move(60, 900)
await page.waitForTimeout(700)
const litAfter = await tool
    .locator(".abf-tool-img-lit")
    .evaluate((el) => getComputedStyle(el).opacity)
await page.screenshot({ path: `${outDir}/tools-rest.png` })

console.log(JSON.stringify({ litOnHover, litAfter }))
await browser.close()
