type ScrollTarget = number | string | HTMLElement;

export type ScrollToOptions = {
  duration?: number;
  easing?: (time: number) => number;
  force?: boolean;
  immediate?: boolean;
  offset?: number;
  onComplete?: () => void;
  /** Skip the native fallback when the motion only works with smooth scroll. */
  fallback?: "auto" | "smooth" | "none";
};

export type ScrollAdapter = {
  scrollTo: (target: ScrollTarget, options: ScrollToOptions) => void;
  pause: () => void;
  resume: () => void;
  subscribeFrame: (listener: () => void) => () => void;
};

let adapter: ScrollAdapter | null = null;
let detachAdapterFrame: (() => void) | null = null;
let lockCount = 0;
const frameListeners = new Set<() => void>();

const emitFrame = () => {
  for (const listener of frameListeners) listener();
};

const onNativeScroll = () => {
  // Smooth-scroll adapters emit after applying their own frame. The earlier
  // native event would otherwise make pinned transforms one frame stale.
  if (!adapter) emitFrame();
};

const bindFrameSource = () => {
  detachAdapterFrame?.();
  detachAdapterFrame = adapter?.subscribeFrame(emitFrame) ?? null;
  emitFrame();
};

/** Install the current smooth-scroll Implementation behind this Interface. */
export function installScrollAdapter(next: ScrollAdapter): () => void {
  adapter = next;
  if (lockCount > 0) next.pause();
  bindFrameSource();

  return () => {
    if (adapter !== next) return;
    detachAdapterFrame?.();
    detachAdapterFrame = null;
    adapter = null;
    emitFrame();
  };
}

/**
 * Navigate through the active adapter, or use the browser when none exists.
 * Returns false only when the caller explicitly disallows native fallback.
 */
export function scrollTo(
  target: ScrollTarget,
  options: ScrollToOptions = {},
): boolean {
  if (adapter) {
    adapter.scrollTo(target, options);
    return true;
  }
  if (options.fallback === "none" || typeof window === "undefined") {
    return false;
  }

  const element =
    typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
  const top =
    typeof target === "number"
      ? target
      : element instanceof HTMLElement
        ? element.getBoundingClientRect().top + window.scrollY
        : null;
  if (top === null) return false;

  window.scrollTo({
    top: top + (options.offset ?? 0),
    behavior:
      options.immediate || options.fallback === "auto" ? "auto" : "smooth",
  });
  options.onComplete?.();
  return true;
}

/**
 * Coordinate nested overlays. The adapter resumes only after the final lock
 * releases, including when the adapter mounts after a lock was acquired.
 */
export function acquireScrollLock(): () => void {
  lockCount += 1;
  if (lockCount === 1) adapter?.pause();

  let released = false;
  return () => {
    if (released) return;
    released = true;
    lockCount = Math.max(0, lockCount - 1);
    if (lockCount === 0) adapter?.resume();
  };
}

/** Subscribe after the active scroll source has applied its current frame. */
export function subscribeScrollFrame(listener: () => void): () => void {
  frameListeners.add(listener);
  if (frameListeners.size === 1 && typeof document !== "undefined") {
    document.addEventListener("scroll", onNativeScroll, {
      capture: true,
      passive: true,
    });
  }
  listener();

  return () => {
    frameListeners.delete(listener);
    if (frameListeners.size === 0 && typeof document !== "undefined") {
      document.removeEventListener("scroll", onNativeScroll, {
        capture: true,
      });
    }
  };
}
