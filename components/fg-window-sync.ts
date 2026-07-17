// useFgWindowSync — locks the Selected Work index (.fg-list) to its settled
// height and derives the garden-window size from it (--fg-list-height /
// --fg-window-width on the gate). The settled height is CONSTANT (fixed
// detail well, exactly one row open), but rapid consecutive switching
// interrupts the accordion's grid-rows transitions and the natural height
// jitters ~20px mid-flight — fed back through the window width and the
// section's vertical centring, that moved the whole composition (2026-07-15).
// Frozen, the jitter never reaches layout; re-measures only on real inputs
// (viewport resize, font swap), each with a post-transition settle pass.

import { useEffect, type RefObject } from "react";

export function useFgWindowSync(
  listRef: RefObject<HTMLOListElement | null>,
  gateRef: RefObject<HTMLAnchorElement | null>,
) {
  useEffect(() => {
    const listEl = listRef.current;
    const gateEl = gateRef.current;
    if (!listEl || !gateEl) return;

    let settle = 0;
    // unlock -> measure settled -> re-freeze, then size the window off it
    const syncWindowToList = () => {
      listEl.style.height = "";
      const listHeight =
        Math.ceil(listEl.getBoundingClientRect().height / 2) * 2;
      listEl.style.height = `${listHeight}px`;
      const windowWidth = Math.round((listHeight * 1.5) / 2) * 2;
      gateEl.style.setProperty("--fg-list-height", `${listHeight}px`);
      gateEl.style.setProperty("--fg-window-width", `${windowWidth}px`);
    };
    // a resize/font swap can land mid-transition (0.6s) — measure once now
    // and again after the accordion settles, like the seal-red tick does
    const syncSettled = () => {
      syncWindowToList();
      window.clearTimeout(settle);
      settle = window.setTimeout(syncWindowToList, 700);
    };

    syncSettled();
    document.fonts?.ready.then(() => {
      if (listEl.isConnected) syncSettled();
    });
    window.addEventListener("resize", syncSettled);
    return () => {
      window.clearTimeout(settle);
      window.removeEventListener("resize", syncSettled);
      listEl.style.height = "";
    };
  }, [listRef, gateRef]);
}
