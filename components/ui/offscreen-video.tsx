"use client";

import { useEffect, useRef, useState } from "react";
import type { ComponentProps } from "react";

type OffscreenVideoProps = {
  src: string;
  poster?: string;
  className?: string;
  /** visible share of the element that starts playback */
  threshold?: number;
  /** "none" defers all fetching until playback (deep-page media on long routes) */
  preload?: "metadata" | "none" | "auto";
} & Omit<
  ComponentProps<"video">,
  "autoPlay" | "muted" | "loop" | "playsInline" | "preload" | "src" | "poster" | "className"
>;

// The one muted-reel primitive (coherence plan): plays while in the viewport,
// pauses offscreen, never autoplays under prefers-reduced-motion (native
// controls appear instead so the reel stays reachable). Every case page's
// evidence reel goes through this — don't hand-roll IO/video wrappers.
export function OffscreenVideo({
  src,
  poster,
  className,
  threshold = 0.35,
  preload = "metadata",
  ...rest
}: OffscreenVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);
  // Starts false to match the server render (reading matchMedia in the
  // initializer makes the first client render disagree with SSR markup —
  // React 19 leaves such attribute mismatches unpatched).
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      el.pause();
    };
  }, [reduced, threshold]);

  return (
    <video
      ref={ref}
      className={className}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload={preload}
      controls={reduced}
      {...rest}
    />
  );
}
