"use client";

// The catalogue "plate" — the print pulled from the portfolio sleeve on row
// hover/focus. Visibility is pure CSS (.wki-row-link:hover/:focus-visible in
// app/work/page.tsx's style block); this helper only manages the muted
// preview clip: it mounts the <video> lazily on the first pointerenter /
// focusin of the enclosing row link, plays while the row is hovered/focused,
// and pauses on leave — so it is inherently paused offscreen. Under
// prefers-reduced-motion (or hoverless pointers, where the plate is hidden
// and the row is a plain link) the video never mounts.
// Visibility-driven reels elsewhere use components/ui/offscreen-video.tsx;
// this one is pointer/focus-driven by design.

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type WorkIndexPlateProps = {
  title: string;
  cover?: string;
  previewVideo?: string;
};

export function WorkIndexPlate({ title, cover, previewVideo }: WorkIndexPlateProps) {
  const rootRef = useRef<HTMLSpanElement>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const engagedRef = useRef(false);
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    if (!previewVideo) return;
    const link = rootRef.current?.closest("a");
    if (!link) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const hoverless = window.matchMedia("(hover: none)");

    const enter = () => {
      if (reduced.matches || hoverless.matches) return;
      engagedRef.current = true;
      setArmed(true);
      videoRef.current?.play().catch(() => {});
    };
    const leave = () => {
      engagedRef.current = false;
      videoRef.current?.pause();
    };

    link.addEventListener("pointerenter", enter);
    link.addEventListener("pointerleave", leave);
    link.addEventListener("focusin", enter);
    link.addEventListener("focusout", leave);
    return () => {
      link.removeEventListener("pointerenter", enter);
      link.removeEventListener("pointerleave", leave);
      link.removeEventListener("focusin", enter);
      link.removeEventListener("focusout", leave);
      videoRef.current?.pause();
    };
  }, [previewVideo]);

  // the video mounts after the first enter — start it if the row is still hot
  const attachVideo = (el: HTMLVideoElement | null) => {
    videoRef.current = el;
    if (el && engagedRef.current) el.play().catch(() => {});
  };

  return (
    <span className="wki-plate" ref={rootRef} aria-hidden="true">
      {cover ? (
        <>
          <Image
            className="wki-plate-img"
            src={cover}
            alt=""
            fill
            sizes="(min-width: 1080px) 30vw, (min-width: 810px) 46vw, 34vw"
          />
          {armed && previewVideo ? (
            // decorative muted preview loop; the row text carries the information
            <video
              ref={attachVideo}
              className="wki-plate-video"
              src={previewVideo}
              poster={cover}
              muted
              loop
              playsInline
              preload="none"
            />
          ) : null}
        </>
      ) : (
        // typographic fallback plate for any project without a cover asset:
        // ink panel, condensed title, gold baseline rule — gold is the
        // static-detail accent (amber stays interactive-only).
        <span className="wki-plate-fallback">
          <span className="wki-plate-fallback-title">{title}</span>
        </span>
      )}
    </span>
  );
}
