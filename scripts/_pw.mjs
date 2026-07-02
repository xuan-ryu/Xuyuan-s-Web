// Shared Playwright bootstrap + page helpers for the scripts in this directory.
// Conventions are documented in scripts/README.md.
//
// Why this exists: the locally installed playwright package and the browser
// cache under ms-playwright can drift (playwright expects one chromium
// revision, the cache holds another). launchBrowser() resolves a working
// chromium executable explicitly instead of trusting playwright's registry.
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { pathToFileURL } from "node:url";

// Prefer the project-local playwright; fall back to the throwaway install at
// %TEMP%/xuyuan-pw-tools that the migration tooling used.
export async function loadPlaywright() {
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

// Resolve a chromium executable:
//   1. env PW_EXEC override (absolute path to a chrome.exe)
//   2. highest chromium-<revision> in the ms-playwright cache
//      (chrome-win64/chrome.exe or chrome-win/chrome.exe)
//   3. null -> let playwright use its bundled default
export function resolveChromiumExecutable() {
  const override = process.env.PW_EXEC;
  if (override) {
    if (fs.existsSync(override)) return override;
    console.warn(`PW_EXEC set but not found: ${override}`);
  }

  const cacheRoot =
    process.env.PLAYWRIGHT_BROWSERS_PATH && process.env.PLAYWRIGHT_BROWSERS_PATH !== "0"
      ? process.env.PLAYWRIGHT_BROWSERS_PATH
      : path.join(
          process.env.LOCALAPPDATA || path.join(os.homedir(), "AppData", "Local"),
          "ms-playwright",
        );

  let best = null;
  let entries;
  try {
    entries = fs.readdirSync(cacheRoot);
  } catch {
    return null;
  }
  for (const entry of entries) {
    const m = /^chromium-(\d+)$/.exec(entry);
    if (!m) continue;
    const revision = Number(m[1]);
    if (best && revision <= best.revision) continue;
    for (const sub of ["chrome-win64", "chrome-win"]) {
      const exe = path.join(cacheRoot, entry, sub, "chrome.exe");
      if (fs.existsSync(exe)) {
        best = { revision, exe };
        break;
      }
    }
  }
  return best ? best.exe : null;
}

// chromium.launch() with the resolved executablePath (unless the caller
// already passed one). All other launch options pass through untouched.
export async function launchBrowser(opts = {}) {
  const { chromium } = await loadPlaywright();
  const launchOpts = { ...opts };
  if (!launchOpts.executablePath) {
    const exe = resolveChromiumExecutable();
    if (exe) launchOpts.executablePath = exe;
  }
  return chromium.launch(launchOpts);
}

// The de-facto default desktop viewport used across these scripts.
export const DEFAULT_VIEWPORT = { width: 1440, height: 1000 };

// Set the session flag(s) that make the site skip its intro loader.
// Works on a Page or a BrowserContext (both have addInitScript).
// extraKeys: additional sessionStorage keys to set to "1"
// (e.g. "loader-shown" for nav-transition captures).
export function skipLoader(target, extraKeys = []) {
  return target.addInitScript((keys) => {
    try {
      for (const key of keys) sessionStorage.setItem(key, "1");
    } catch {}
  }, ["skip-loader", ...extraKeys]);
}

// Gentle progressive pre-scroll through the whole page so lazy media loads
// and appear-effects settle before measuring/capturing.
export async function preScroll(page, { step = 500, delay = 150, returnToTop = true } = {}) {
  await page.evaluate(
    async ({ step, delay, returnToTop }) => {
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, delay));
      }
      if (returnToTop) window.scrollTo(0, 0);
    },
    { step, delay, returnToTop },
  );
}

// Slugify a route for use in screenshot file names: "/" -> "home",
// "/work/vicino-ai" -> "work__vicino-ai".
export function routeName(route) {
  return route === "/" ? "home" : route.slice(1).replaceAll("/", "__");
}
