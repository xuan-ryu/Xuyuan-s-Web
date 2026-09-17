"use client";

import { useState, type FormEvent } from "react";
import { Cta } from "@/components/ui/cta";
import styles from "./travel-unlock.module.css";

// Private travel record — L1 client gate. The itinerary ships only as an
// AES-GCM ciphertext; this component derives the key locally and never stores
// or transmits the passphrase. Locking discards decrypted HTML from state.

type EncryptedRecord = {
  version: 1;
  iterations: number;
  salt: string;
  iv: string;
  data: string;
};

type UnlockState = "idle" | "unlocking" | "error";

const RECORD_URL = "/private/hawaii.enc";

function decodeBase64(value: string) {
  return Uint8Array.from(atob(value), (char) => char.charCodeAt(0));
}

async function decryptRecord(record: EncryptedRecord, password: string) {
  const encodedPassword = new TextEncoder().encode(password);
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encodedPassword,
    "PBKDF2",
    false,
    ["deriveKey"],
  );
  const key = await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      hash: "SHA-256",
      salt: decodeBase64(record.salt),
      iterations: record.iterations,
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["decrypt"],
  );
  const plaintext = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: decodeBase64(record.iv) },
    key,
    decodeBase64(record.data),
  );
  return new TextDecoder().decode(plaintext);
}

export function TravelUnlock() {
  const [password, setPassword] = useState("");
  const [state, setState] = useState<UnlockState>("idle");
  const [html, setHtml] = useState<string | null>(null);

  async function unlock(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("unlocking");

    try {
      const response = await fetch(RECORD_URL, { cache: "no-store" });
      if (!response.ok) throw new Error("Record unavailable");
      const record = (await response.json()) as EncryptedRecord;
      if (record.version !== 1) throw new Error("Unsupported record");
      setHtml(await decryptRecord(record, password));
      setPassword("");
      setState("idle");
    } catch {
      setState("error");
    }
  }

  if (html) {
    return (
      <section className={styles.reader} aria-label="Unlocked travel notes">
        <div className={styles.readerBar}>
          <p className={styles.readerLabel}>Private field notes · unlocked</p>
          <Cta variant="quiet" onClick={() => setHtml(null)}>
            Lock notes
          </Cta>
        </div>
        <iframe
          className={styles.frame}
          srcDoc={html}
          title="Private travel field guide"
          allow="clipboard-write; web-share"
          sandbox="allow-downloads allow-forms allow-modals allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
        />
      </section>
    );
  }

  const unlocking = state === "unlocking";

  return (
    <section className={styles.page}>
      <div className={styles.shell}>
        <div className={styles.grid}>
          <div className={styles.intro}>
            <p className={styles.eyebrow}>Private field notes</p>
            <h1 className={styles.title}>Travel notes</h1>
            <p className={styles.lede}>
              A personal working notebook for routes, reservations, and places
              worth remembering. Its contents stay encrypted until unlocked in
              this browser.
            </p>
          </div>

          <form className={styles.form} onSubmit={unlock}>
            <label className={styles.label} htmlFor="travel-passphrase">
              Passphrase
            </label>
            <input
              className={styles.input}
              id="travel-passphrase"
              name="passphrase"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                if (state === "error") setState("idle");
              }}
              disabled={unlocking}
              required
              aria-invalid={state === "error"}
              aria-describedby="travel-unlock-status"
            />
            <p
              className={`${styles.status} ${state === "error" ? styles.error : ""}`}
              id="travel-unlock-status"
              role={state === "error" ? "alert" : "status"}
            >
              {state === "error"
                ? "That passphrase did not unlock the notebook."
                : unlocking
                  ? "Unlocking locally…"
                  : "The passphrase is never sent or saved."}
            </p>
            <Cta type="submit" variant="solid" full disabled={unlocking}>
              {unlocking ? "Unlocking" : "Unlock notes"}
            </Cta>
            <p className={styles.privacy}>
              AES-256-GCM encrypted · decrypted only in this tab
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
