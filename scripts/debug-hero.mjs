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
page.on("console", (msg) => console.log(`[${msg.type()}] ${msg.text().slice(0, 300)}`));
page.on("pageerror", (err) => console.log(`[pageerror] ${err.message.slice(0, 500)}`));
await page.addInitScript(() => {
  try {
    sessionStorage.setItem("loader-shown", "1");
  } catch {}
});
await page.goto("http://127.0.0.1:4000/", { waitUntil: "networkidle", timeout: 60000 });
await page.waitForTimeout(6000);
const state = await page.evaluate(() => {
  const ui = document.querySelector(".hero-ui, [class*=scene]");
  const canvas = document.querySelector("canvas");
  const sceneLoaded = !!document.querySelector(".scene-loaded");
  const gl = (() => {
    try {
      const c = document.createElement("canvas");
      return !!(c.getContext("webgl2") || c.getContext("webgl"));
    } catch {
      return false;
    }
  })();
  return {
    sceneLoaded,
    hasCanvas: !!canvas,
    canvasSize: canvas ? `${canvas.width}x${canvas.height}` : null,
    canvasOpacity: canvas ? getComputedStyle(canvas.parentElement).opacity : null,
    webglAvailable: gl,
    uiClass: ui ? ui.className.slice(0, 200) : null,
    bodyChildren: document.body.children.length,
  };
});
console.log(JSON.stringify(state, null, 2));
await browser.close();
