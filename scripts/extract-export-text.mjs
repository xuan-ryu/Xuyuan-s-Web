// Extract readable text from a Framer export HTML page for content comparison.
// Usage: node scripts/extract-export-text.mjs <path-to-index.html> <out.txt>
import fs from "node:fs";

const [, , input, output] = process.argv;
const html = fs.readFileSync(input, "utf8");

let t = html
  .replace(/<script[\s\S]*?<\/script>/gi, " ")
  .replace(/<style[\s\S]*?<\/style>/gi, " ")
  .replace(/<!--[\s\S]*?-->/g, " ")
  .replace(/<(br|\/p|\/h[1-6]|\/div|\/li)[^>]*>/gi, "\n")
  .replace(/<[^>]+>/g, "")
  .replace(/&nbsp;/g, " ")
  .replace(/&amp;/g, "&")
  .replace(/&#39;|&apos;/g, "'")
  .replace(/&quot;/g, '"')
  .replace(/&gt;/g, ">")
  .replace(/&lt;/g, "<");

const lines = t
  .split("\n")
  .map((s) => s.replace(/\s+/g, " ").trim())
  .filter(Boolean);

// drop consecutive duplicates (Framer renders desktop/tablet/mobile variants)
const out = lines.filter((line, i) => line !== lines[i - 1]);

fs.writeFileSync(output, out.join("\n"));
console.log(`${out.length} lines -> ${output}`);
