// Encrypts one private HTML document for browser-side AES-GCM unlocking.
// Usage: node scripts/encrypt-private-html.mjs <input.html> <output.enc>
// Omitting a password generates one and prints it once; plaintext is never
// copied into the repository.

import { createCipheriv, pbkdf2Sync, randomBytes } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const [, , inputArg, outputArg, suppliedPassword] = process.argv;

if (!inputArg || !outputArg) {
  console.error(
    "Usage: node scripts/encrypt-private-html.mjs <input.html> <output.enc> [password]",
  );
  process.exit(1);
}

const password =
  suppliedPassword ??
  randomBytes(12)
    .toString("hex")
    .match(/.{1,4}/g)
    .join("-");
const salt = randomBytes(16);
const iv = randomBytes(12);
const iterations = 310_000;
const key = pbkdf2Sync(password, salt, iterations, 32, "sha256");
const cipher = createCipheriv("aes-256-gcm", key, iv);
const plaintext = readFileSync(resolve(inputArg));
const encrypted = Buffer.concat([
  cipher.update(plaintext),
  cipher.final(),
  cipher.getAuthTag(),
]);
const outputPath = resolve(outputArg);
const record = {
  version: 1,
  iterations,
  salt: salt.toString("base64"),
  iv: iv.toString("base64"),
  data: encrypted.toString("base64"),
};

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, `${JSON.stringify(record)}\n`);
console.log(`Encrypted ${plaintext.length} bytes to ${outputPath}`);
if (!suppliedPassword) console.log(`Generated passphrase: ${password}`);
