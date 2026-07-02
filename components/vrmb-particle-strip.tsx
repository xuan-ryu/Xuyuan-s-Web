"use client";

import { useEffect, useRef } from "react";

// The coda strip for the VR Monarch Butterfly folio: a quiet canvas where a
// cluster of small monarch glyphs on the left progressively loosens into
// drifting amber dots toward the right — a literal picture of the project's
// stated next step (butterflies dissolving into music-synced particles).
//
// Guard rails (binding, from the art-direction verdict):
// - hard cap of 40 sprites;
// - drift velocity <= 8px/s (oscillation around a fixed home, so the
//   composition never migrates);
// - the rAF loop only runs while the strip intersects the viewport;
// - prefers-reduced-motion renders one static mid-dissolve frame, no loop;
// - every RAF/observer is cleaned up on unmount.
const SPRITE_COUNT = 40;
const STATIC_T = 12.4; // phase used for the static (reduced-motion) frame

type Sprite = {
  u: number; // 0..1 dissolve factor along the strip
  hx: number; // home x (fraction of width)
  hy: number; // home y (fraction of height)
  size: number;
  angle: number;
  p1: number; // motion phases
  p2: number;
  p3: number;
  dots: { dx: number; dy: number; r: number; p: number }[];
};

// Deterministic PRNG so the composition (and the reduced-motion frame) is
// identical on every visit and resize.
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function smoothstep(a: number, b: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

function buildSprites(): Sprite[] {
  const rand = mulberry32(0xb77f1);
  const sprites: Sprite[] = [];
  for (let i = 0; i < SPRITE_COUNT; i++) {
    const u = Math.min(1, (i / (SPRITE_COUNT - 1)) * 0.94 + rand() * 0.08);
    // left cluster sits tight around the vertical center; the band loosens
    // as the swarm dissolves rightward
    const spread = 0.16 + 0.68 * u;
    const dots: Sprite["dots"] = [];
    const n = 2 + Math.round(rand());
    for (let d = 0; d < n; d++) {
      dots.push({
        dx: (rand() - 0.5) * 26,
        dy: (rand() - 0.5) * 22,
        r: 1.1 + rand() * 1.2,
        p: rand() * Math.PI * 2,
      });
    }
    sprites.push({
      u,
      hx: 0.03 + u * 0.94,
      hy: 0.5 + (rand() - 0.5) * spread,
      size: (15 + rand() * 8) * (1 - 0.3 * u),
      angle: (rand() - 0.5) * 0.9,
      p1: rand() * Math.PI * 2,
      p2: rand() * Math.PI * 2,
      p3: rand() * Math.PI * 2,
      dots,
    });
  }
  return sprites;
}

// Pre-rasterize one wing glyph (amber fill, hairline ink edge) at 2x.
function makeGlyph(amber: string, ink: string) {
  const c = document.createElement("canvas");
  const S = 64;
  c.width = S;
  c.height = S;
  const g = c.getContext("2d");
  if (!g) return c;
  g.translate(S / 2, S / 2);
  g.fillStyle = amber;
  g.strokeStyle = ink;
  g.lineWidth = 1.5;
  const wing = (sx: number) => {
    g.beginPath();
    // forewing
    g.moveTo(sx * 2, -2);
    g.quadraticCurveTo(sx * 10, -26, sx * 26, -18);
    g.quadraticCurveTo(sx * 22, -4, sx * 4, 2);
    g.closePath();
    g.fill();
    g.stroke();
    // hindwing
    g.beginPath();
    g.moveTo(sx * 3, 3);
    g.quadraticCurveTo(sx * 22, 4, sx * 18, 18);
    g.quadraticCurveTo(sx * 8, 24, sx * 2, 8);
    g.closePath();
    g.fill();
    g.stroke();
  };
  wing(1);
  wing(-1);
  // body
  g.strokeStyle = ink;
  g.lineWidth = 3;
  g.lineCap = "round";
  g.beginPath();
  g.moveTo(0, -8);
  g.lineTo(0, 12);
  g.stroke();
  return c;
}

export function VrmbParticleStrip() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rootStyle = getComputedStyle(document.documentElement);
    const amber = rootStyle.getPropertyValue("--accent-amber").trim() || "#fe8411";
    const ink = rootStyle.getPropertyValue("--ink-950").trim() || "#050505";
    const glyph = makeGlyph(amber, ink);
    const sprites = buildSprites();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let W = 0;
    let H = 0;
    const layout = () => {
      W = wrap.clientWidth;
      H = wrap.clientHeight;
      canvas.width = Math.max(1, Math.round(W * dpr));
      canvas.height = Math.max(1, Math.round(H * dpr));
    };

    const draw = (t: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      for (const s of sprites) {
        // oscillate around home: amplitude * angular velocity stays <= 8px/s
        const x = s.hx * W + Math.sin(t * 0.7 + s.p1) * 6;
        const y = s.hy * H + Math.sin(t * 0.9 + s.p2) * 5;
        const glyphAlpha = 1 - smoothstep(0.32, 0.74, s.u);
        const dotAlpha = smoothstep(0.4, 0.88, s.u);
        if (glyphAlpha > 0.02) {
          ctx.save();
          ctx.globalAlpha = glyphAlpha;
          ctx.translate(x, y);
          ctx.rotate(s.angle + Math.sin(t * 0.6 + s.p3) * 0.12);
          // slow wingbeat: horizontal squash only (transform, no relayout)
          ctx.scale(0.72 + 0.28 * Math.abs(Math.sin(t * 1.1 + s.p1)), 1);
          ctx.drawImage(glyph, -s.size / 2, -s.size / 2, s.size, s.size);
          ctx.restore();
        }
        if (dotAlpha > 0.02) {
          ctx.globalAlpha = dotAlpha * 0.85;
          ctx.fillStyle = amber;
          for (const d of s.dots) {
            const px = x + d.dx + Math.sin(t * 0.5 + d.p) * 4;
            const py = y + d.dy + Math.cos(t * 0.4 + d.p) * 3;
            ctx.beginPath();
            ctx.arc(px, py, d.r, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.globalAlpha = 1;
        }
      }
    };

    if (reduced) {
      // static mid-dissolve frame; no loop, nothing to pause
      layout();
      draw(STATIC_T);
      const ro = new ResizeObserver(() => {
        layout();
        draw(STATIC_T);
      });
      ro.observe(wrap);
      return () => ro.disconnect();
    }

    let raf = 0;
    let running = false;
    const loop = (now: number) => {
      draw(now / 1000);
      raf = requestAnimationFrame(loop);
    };
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !running) {
            running = true;
            raf = requestAnimationFrame(loop);
          } else if (!entry.isIntersecting && running) {
            running = false;
            cancelAnimationFrame(raf);
          }
        }
      },
      { rootMargin: "60px" },
    );
    io.observe(wrap);

    const ro = new ResizeObserver(() => {
      layout();
      if (!running) draw(STATIC_T);
    });
    ro.observe(wrap);
    layout();
    draw(STATIC_T); // paint a frame immediately so there is no blank flash

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
    };
  }, []);

  return (
    <div ref={wrapRef} className="vrmb-particles" aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  );
}
