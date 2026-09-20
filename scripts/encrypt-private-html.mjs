// Encrypts one private HTML document for browser-side AES-GCM unlocking.
// Usage: node scripts/encrypt-private-html.mjs <input.html> <output.enc> [passphrase] [--new]
//
// Re-encrypting an existing record keeps its passphrase: the passphrase (the
// argument, or a hidden prompt when omitted) must first open the current file,
// otherwise nothing is written, so a typo can never lock readers out.
// --new (or a missing output) starts a fresh record and, without a passphrase,
// generates one and prints it once. Plaintext is never copied into the repo.

import { createCipheriv, createDecipheriv, pbkdf2Sync, randomBytes } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const args = process.argv.slice(2);
const fresh = args.includes("--new");
const [inputArg, outputArg, suppliedPassword] = args.filter((arg) => arg !== "--new");

if (!inputArg || !outputArg) {
  console.error(
    "Usage: node scripts/encrypt-private-html.mjs <input.html> <output.enc> [passphrase] [--new]",
  );
  process.exit(1);
}

const iterations = 310_000;
const outputPath = resolve(outputArg);
const deriveKey = (password, salt, rounds) => pbkdf2Sync(password, salt, rounds, 32, "sha256");

// Raw mode instead of readline so the passphrase is never echoed on any Node version.
function askHidden(question) {
  process.stdout.write(question);
  process.stdin.setEncoding("utf8");
  if (!process.stdin.isTTY) {
    return new Promise((done) => {
      let piped = "";
      process.stdin.on("data", (chunk) => (piped += chunk));
      process.stdin.on("end", () => done(piped.split(/\r?\n/)[0]));
    });
  }
  return new Promise((done) => {
    let typed = "";
    const onKey = (chunk) => {
      for (const char of chunk) {
        if (char === "") process.exit(130);
        if (char === "\r" || char === "\n") {
          process.stdin.setRawMode(false);
          process.stdin.off("data", onKey);
          process.stdin.pause();
          process.stdout.write("\n");
          return done(typed);
        }
        typed = char === "" || char === "\b" ? typed.slice(0, -1) : typed + char;
      }
    };
    process.stdin.setRawMode(true);
    process.stdin.on("data", onKey);
    process.stdin.resume();
  });
}

function opens(record, password) {
  const data = Buffer.from(record.data, "base64");
  const key = deriveKey(password, Buffer.from(record.salt, "base64"), record.iterations);
  const decipher = createDecipheriv("aes-256-gcm", key, Buffer.from(record.iv, "base64"));
  decipher.setAuthTag(data.subarray(-16));
  try {
    decipher.update(data.subarray(0, -16));
    decipher.final();
    return true;
  } catch {
    return false;
  }
}

const reuse = !fresh && existsSync(outputPath);
let password = suppliedPassword;
if (reuse) {
  password ??= await askHidden("Current passphrase: ");
  if (!password || !opens(JSON.parse(readFileSync(outputPath, "utf8")), password)) {
    console.error("That passphrase does not open the existing file; nothing was written.");
    process.exit(1);
  }
}
password ??= randomBytes(12)
  .toString("hex")
  .match(/.{1,4}/g)
  .join("-");

const salt = randomBytes(16);
const iv = randomBytes(12);
const cipher = createCipheriv("aes-256-gcm", deriveKey(password, salt, iterations), iv);
const plaintext = readFileSync(resolve(inputArg));
const encrypted = Buffer.concat([
  cipher.update(plaintext),
  cipher.final(),
  cipher.getAuthTag(),
]);
const record = {
  version: 1,
  iterations,
  salt: salt.toString("base64"),
  iv: iv.toString("base64"),
  data: encrypted.toString("base64"),
};

// Write beside the target, then swap, so an interrupted run never leaves a torn record.
mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(`${outputPath}.tmp`, `${JSON.stringify(record)}\n`);
renameSync(`${outputPath}.tmp`, outputPath);
console.log(
  `Encrypted ${plaintext.length} bytes to ${outputPath}${reuse ? " with the existing passphrase" : ""}`,
);
if (!suppliedPassword && !reuse) console.log(`Generated passphrase: ${password}`);
