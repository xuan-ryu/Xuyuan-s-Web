const fs = require("fs"); const path = require("path");
const dirs = ["data", "components", "app"]; const chars = new Set();
const walk = (d) => { for (const f of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, f.name); if (f.isDirectory()) walk(p); else if (/\.(tsx?|css)$/.test(f.name)) { const t = fs.readFileSync(p, "utf8"); for (const ch of t) { if (/[　-鿿＀-￯]/.test(ch)) chars.add(ch); } } } };
dirs.forEach(walk);
const cjk = [...chars].sort().join("");
fs.writeFileSync("scripts/brush-subset-chars.txt", cjk, "utf8");
console.log("CJK chars found:", cjk.length); console.log(cjk);
