// Print scrollHeight for a URL. Usage: node scripts/measure-page.mjs <url>
import path from "node:path";
import os from "node:os";
import { pathToFileURL } from "node:url";

async function loadPlaywright() {
  try {
    return await import("playwright");
  } catch {
    const fallback = path.join(
      os.tmpdir(),
      "xuyuan-pw-tools",
      "node_modules",
      "playwright",
      "index.mjs",
    );
    return import(pathToFileURL(fallback).href);
  }
}

const { chromium } = await loadPlaywright();
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
await page.goto(process.argv[2], { waitUntil: "networkidle", timeout: 60000 });
await page.waitForTimeout(2000);
console.log("scrollHeight:", await page.evaluate(() => document.body.scrollHeight));
await browser.close();
