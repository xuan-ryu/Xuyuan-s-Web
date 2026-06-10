import fs from "node:fs/promises";
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

const routes = [
  "/",
  "/about",
  "/work",
  "/contact",
  "/work/vicino-ai",
  "/work/froghire-ai",
  "/work/roper-center",
  "/work/hunger1942",
  "/work/vr-education",
];

const targets = [
  ["source", "http://127.0.0.1:4101"],
  ["react", "http://127.0.0.1:4000"],
];

const viewports = [
  ["desktop", { width: 1440, height: 1000 }],
  ["mobile", { width: 390, height: 844 }],
];

const outDir = path.join(process.cwd(), "audit-screenshots", "matrix");

function routeName(route) {
  return route === "/" ? "home" : route.slice(1).replaceAll("/", "__");
}

await fs.mkdir(outDir, { recursive: true });

const browser = await chromium.launch();
try {
  for (const [targetName, baseUrl] of targets) {
    for (const [viewportName, viewport] of viewports) {
      for (const route of routes) {
        const page = await browser.newPage({
          viewport,
          deviceScaleFactor: 1,
        });

        const url = `${baseUrl}${route}`;
        const fileName = `${targetName}__${viewportName}__${routeName(route)}.png`;

        try {
          await page.goto(url, {
            waitUntil: "networkidle",
            timeout: 45000,
          });
          await page.waitForTimeout(1200);
          await page.screenshot({
            path: path.join(outDir, fileName),
            fullPage: false,
          });
          console.log(`captured ${fileName}`);
        } catch (error) {
          console.error(`failed ${fileName}: ${error.message}`);
        } finally {
          await page.close();
        }
      }
    }
  }
} finally {
  await browser.close();
}
