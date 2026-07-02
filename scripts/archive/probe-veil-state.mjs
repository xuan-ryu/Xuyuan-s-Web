import path from "node:path"; import os from "node:os"; import { pathToFileURL } from "node:url";
const pw = await import(pathToFileURL(path.join(os.tmpdir(),"xuyuan-pw-tools","node_modules","playwright","index.mjs")).href).catch(()=>import("playwright"));
const b = await pw.chromium.launch();
const p = await b.newPage({ viewport:{width:1536,height:770}, reducedMotion:"no-preference" });
await p.addInitScript(() => { try { sessionStorage.setItem("skip-loader","1"); } catch {} });
const errs = [];
p.on("pageerror", e => errs.push("PAGEERROR: " + e.message.slice(0,200)));
p.on("console", m => { if (m.type()==="error") errs.push("CONSOLE: " + m.text().slice(0,200)); });
await p.goto("http://localhost:4000", {waitUntil:"networkidle"}); await p.waitForTimeout(2500);
const state = () => p.evaluate(() => {
  const veil = [...document.querySelectorAll("body > div, #page-root > div")].find(d => d.style.willChange === "transform" && d.style.zIndex === "9998") || document.querySelector('[aria-hidden="true"][style*="9998"]');
  const main = document.querySelector("main");
  return {
    url: location.pathname,
    veil: veil ? `tf=${getComputedStyle(veil).transform.slice(0,40)} rect.top=${Math.round(veil.getBoundingClientRect().top)}` : "NOT FOUND",
    main: `tf=${getComputedStyle(main).transform.slice(0,30)} op=${getComputedStyle(main).opacity}`,
  };
});
console.log("before:", JSON.stringify(await state()));
await p.locator('nav a[href="/work"]').first().click();
for (const t of [200, 450, 700, 1200, 2000, 3000]) {
  await p.waitForTimeout(t === 200 ? 200 : t - [200,450,700,1200,2000,3000][[200,450,700,1200,2000,3000].indexOf(t)-1]);
  console.log(`t${t}:`, JSON.stringify(await state()));
}
console.log("errors:", errs.length ? errs.join(" | ") : "none");
await b.close();
