const fs = require("fs");
const subsetFont = require("subset-font");
(async () => {
  const buf = fs.readFileSync("public/fonts/liujian-mao-cao.woff2");
  const cjk = fs.readFileSync("scripts/brush-subset-chars.txt", "utf8");
  // basic latin + digits + common punctuation + collected CJK
  let latin = "";
  for (let c = 0x20; c <= 0x7e; c++) latin += String.fromCharCode(c);
  const text = latin + "“”‘’—…·　" + cjk;
  const out = await subsetFont(buf, text, { targetFormat: "woff2" });
  fs.writeFileSync("public/fonts/liujian-mao-cao.woff2", out);
  console.log("subset done:", Math.round(buf.length / 1024) + "KB ->", Math.round(out.length / 1024) + "KB");
})().catch((e) => { console.error(e.message); process.exit(1); });
