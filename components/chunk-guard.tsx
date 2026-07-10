"use client";

import { useEffect } from "react";

// Deploy-skew guard. Every deploy invalidates the previous build's hashed
// chunk URLs; a tab opened before the deploy that then client-navigates
// requests chunks that no longer exist and the route half-renders (or not at
// all). When a chunk/module load fails, fall back to a full navigation to the
// URL the user was headed to — the fresh document pins the new build.
// A session timestamp stops reload loops on genuinely broken networks.
const KEY = "chunk-reload-at";
const MIN_GAP_MS = 30_000;

function reloadOnce() {
  let last = 0;
  try {
    last = Number(sessionStorage.getItem(KEY) || 0);
  } catch {
    /* storage denied — still better to reload than strand the visitor */
  }
  if (Date.now() - last < MIN_GAP_MS) return;
  try {
    sessionStorage.setItem(KEY, String(Date.now()));
  } catch {
    /* no-op */
  }
  window.location.reload();
}

const CHUNK_ERROR_RE =
  /ChunkLoadError|Loading chunk|Failed to fetch dynamically imported module|Importing a module script failed|error loading dynamically imported module/i;

export function ChunkGuard() {
  useEffect(() => {
    const onRejection = (e: PromiseRejectionEvent) => {
      const msg = String(
        (e.reason && (e.reason.message || e.reason.name)) || e.reason || ""
      );
      if (CHUNK_ERROR_RE.test(msg)) reloadOnce();
    };
    const onError = (e: ErrorEvent | Event) => {
      // resource load failures surface as plain error Events on the element
      const t = e.target as HTMLElement | null;
      if (
        t &&
        t.tagName === "SCRIPT" &&
        (t as HTMLScriptElement).src.includes("/_next/")
      ) {
        reloadOnce();
        return;
      }
      const msg = (e as ErrorEvent).message || "";
      if (CHUNK_ERROR_RE.test(msg)) reloadOnce();
    };
    window.addEventListener("unhandledrejection", onRejection);
    // capture: resource error events don't bubble
    window.addEventListener("error", onError, true);
    return () => {
      window.removeEventListener("unhandledrejection", onRejection);
      window.removeEventListener("error", onError, true);
    };
  }, []);
  return null;
}
