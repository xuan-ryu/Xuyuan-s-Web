"use client";

import { useEffect, useRef, useState } from "react";
import type { ComponentProps } from "react";

type OffscreenVideoProps = {
  src: string;
  poster?: string;
  className?: string;
  /** visible share of the element that starts playback */
  threshold?: number;
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
  ...rest
}: OffscreenVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const [reduced, setReduced] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(mq.matches);
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
      preload="metadata"
      controls={reduced}
      {...rest}
    />
  );
}
