import path from "node:path"; import os from "node:os"; import { pathToFileURL } from "node:url";
const pw = await import(pathToFileURL(path.join(os.tmpdir(),"xuyuan-pw-tools","node_modules","playwright","index.mjs")).href).catch(()=>import("playwright"));
const b = await pw.chromium.launch();
for (const vp of [{width:1536,height:770},{width:1536,height:1000},{width:2560,height:1300}]) {
  const p = await b.newPage({ viewport: vp });
  await p.addInitScript(() => { try { sessionStorage.setItem("skip-loader","1"); } catch {} });
  const logs = [];
  p.on("console", m => { if (m.text().includes("[hero] points")) logs.push(m.text()); });
  await p.goto("http://localhost:4000", {waitUntil:"networkidle"}); await p.waitForTimeout(3500);
  console.log(`${vp.width}x${vp.height}:`, logs.join(" | ") || "no log");
  await p.close();
}
await b.close();
