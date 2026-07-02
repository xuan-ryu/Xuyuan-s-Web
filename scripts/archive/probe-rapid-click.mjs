import path from "node:path"; import os from "node:os"; import { pathToFileURL } from "node:url";
const pw = await import(pathToFileURL(path.join(os.tmpdir(),"xuyuan-pw-tools","node_modules","playwright","index.mjs")).href).catch(()=>import("playwright"));
const b = await pw.chromium.launch();
const p = await b.newPage({ viewport:{width:1536,height:770}, reducedMotion:"no-preference" });
await p.addInitScript(() => { try { sessionStorage.setItem("skip-loader","1"); } catch {} });
await p.goto("http://localhost:4000", {waitUntil:"networkidle"}); await p.waitForTimeout(2000);
// rapid double-nav: second click lands mid-cover and must be swallowed
await p.locator('nav a[href="/work"]').first().click();
await p.waitForTimeout(150);
await p.locator('nav a[href="/about"]').first().click().catch(()=>{});
await p.waitForTimeout(2500);
const s1 = await p.evaluate(() => ({ url: location.pathname, veilTop: Math.round(document.querySelector('[aria-hidden="true"][style*="9998"]').getBoundingClientRect().top) }));
console.log("after rapid double-click:", JSON.stringify(s1));
// state must have recovered: a third navigation should transition normally
await p.locator('nav a[href="/about"]').first().click();
await p.waitForTimeout(2500);
const s2 = await p.evaluate(() => ({ url: location.pathname, veilTop: Math.round(document.querySelector('[aria-hidden="true"][style*="9998"]').getBoundingClientRect().top) }));
console.log("after third click:", JSON.stringify(s2));
await b.close();
