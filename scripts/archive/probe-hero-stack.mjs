import path from "node:path"; import os from "node:os"; import { pathToFileURL } from "node:url";
const pw = await import(pathToFileURL(path.join(os.tmpdir(),"xuyuan-pw-tools","node_modules","playwright","index.mjs")).href).catch(()=>import("playwright"));
const b = await pw.chromium.launch();
const p = await b.newPage({ viewport:{width:1536,height:770}, reducedMotion:"no-preference" });
await p.addInitScript(() => { try { sessionStorage.setItem("skip-loader","1"); } catch {} });
await p.goto("http://localhost:3000", {waitUntil:"networkidle"}); await p.waitForTimeout(2500);
const stack = () => p.evaluate(() => document.elementsFromPoint(300,500).slice(0,8).map(el => {
  const cs = getComputedStyle(el);
  return `${el.tagName}.${(el.className?.toString?.()||"").slice(0,24)} op=${cs.opacity} bg=${cs.backgroundColor} z=${cs.zIndex}`;
}));
console.log("INITIAL:"); console.log((await stack()).join("\n"));
await p.locator('nav a[href="/work"]').first().click(); await p.waitForTimeout(1800);
await p.locator('nav a[href="/"]').first().click(); await p.waitForTimeout(3000);
console.log("AFTER NAV:"); console.log((await stack()).join("\n"));
await b.close();
