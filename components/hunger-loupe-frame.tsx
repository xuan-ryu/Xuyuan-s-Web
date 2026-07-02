"use client";

import Image from "next/image";
import { useRef, type PointerEvent } from "react";

type HungerLoupeFrameProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  sizes?: string;
  priority?: boolean;
};

// ReadingLoupe (spec-hunger1942): a circular loupe that follows a fine pointer
// over the broadsheet / archive plates, showing the same asset at ~2.4x so the
// in-fiction newspaper columns become legible. Pure CSS + pointer events — no
// canvas, no RAF loop; position/opacity are the only animated properties. The
// loupe only exists on hover-capable fine pointers (CSS-gated); touch and
// keyboard readers use the adjacent "READ THE FULL SHEET" / "VIEW FULL PLATE"
// quiet CTAs instead. React's synthetic handlers detach on unmount.
export function HungerLoupeFrame({
  src,
  alt,
  width,
  height,
  sizes,
  priority,
}: HungerLoupeFrameProps) {
  const frameRef = useRef<HTMLDivElement>(null);

  const track = (e: PointerEvent<HTMLDivElement>) => {
    const el = frameRef.current;
    if (!el || e.pointerType !== "mouse") return;
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const lx = Math.min(Math.max(x / rect.width, 0), 1);
    const ly = Math.min(Math.max(y / rect.height, 0), 1);
    el.style.setProperty("--px", `${x}px`);
    el.style.setProperty("--py", `${y}px`);
    el.style.setProperty("--lx", `${(lx * 100).toFixed(3)}%`);
    el.style.setProperty("--ly", `${(ly * 100).toFixed(3)}%`);
  };

  const show = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    track(e);
    frameRef.current?.classList.add("hunger-loupe-on");
  };

  const hide = () => {
    frameRef.current?.classList.remove("hunger-loupe-on");
  };

  return (
    <div
      ref={frameRef}
      className="hunger-loupe-frame"
      onPointerEnter={show}
      onPointerMove={track}
      onPointerLeave={hide}
      onPointerCancel={hide}
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        priority={priority}
        style={{ width: "100%", height: "auto" }}
      />
      <div
        className="hunger-loupe"
        aria-hidden="true"
        style={{ backgroundImage: `url("${src}")` }}
      />
    </div>
  );
}
