import path from "node:path"; import os from "node:os"; import { pathToFileURL } from "node:url";
const pw = await import(pathToFileURL(path.join(os.tmpdir(),"xuyuan-pw-tools","node_modules","playwright","index.mjs")).href).catch(()=>import("playwright"));
const b = await pw.chromium.launch();
const p = await b.newPage({ viewport:{width:1536,height:770}, reducedMotion:"no-preference" });
await p.addInitScript(() => { try { sessionStorage.setItem("skip-loader","1"); } catch {} });
await p.goto("http://localhost:3000", {waitUntil:"networkidle"}); await p.waitForTimeout(2500);
await p.locator('nav a[href="/work"]').first().click(); await p.waitForTimeout(1800);
await p.locator('nav a[href="/"]').first().click(); await p.waitForTimeout(3000);
const info = await p.evaluate(() => {
  const canvases = [...document.querySelectorAll("canvas")].map(c => `${c.width}x${c.height} connected=${c.isConnected}`);
  const mount = document.querySelector("main canvas")?.parentElement;
  const cs = mount ? getComputedStyle(mount) : null;
  return { canvases, mask: cs ? cs.maskImage.slice(0, 80) : null, wmask: cs ? (cs.webkitMaskImage||"").slice(0,80) : null };
});
console.log(JSON.stringify(info, null, 1));
await p.evaluate(() => {
  const mount = document.querySelector("main canvas")?.parentElement;
  if (mount) { mount.style.maskImage = "none"; mount.style.webkitMaskImage = "none"; }
});
await p.waitForTimeout(500);
await p.screenshot({ path: "audit-screenshots/wake-D-nomask.png" });
await b.close(); console.log("done");
