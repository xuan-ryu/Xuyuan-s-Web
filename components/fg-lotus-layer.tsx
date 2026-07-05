"use client";

/* eslint-disable @next/next/no-img-element */

import { stripCssComments } from "@/lib/css-sanitize";

type FrameTarget = {
  frameX: number;
  frameY: number;
  frameRot: number;
  frameScale: number;
};

export type FgLeafCfg = FrameTarget & {
  x: number;
  y: number;
  size: number;
  rot: number;
  order: number;
  inOrder: number;
  variant: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
};

export type FgFlowerCfg = FrameTarget & {
  x: number;
  y: number;
  size: number;
  rot: number;
  order: number;
  inOrder: number;
  bloomAt?: number;
  variant: 1 | 2 | 3;
};

export const FG_LEAVES: FgLeafCfg[] = [
  { x: 6, y: 8, size: 26, rot: -24, order: 0.92, inOrder: 0.04, variant: 1, frameX: -5, frameY: 11, frameRot: -30, frameScale: 0.72 },
  { x: 21, y: 8, size: 24, rot: 48, order: 0.62, inOrder: 0.34, variant: 2, frameX: 8, frameY: 18, frameRot: 42, frameScale: 0.72 },
  { x: 37, y: 9, size: 25, rot: -112, order: 0.28, inOrder: 0.18, variant: 3, frameX: 15, frameY: 30, frameRot: -118, frameScale: 0.64 },
  { x: 54, y: 9, size: 26, rot: 16, order: 0.08, inOrder: 0.62, variant: 4, frameX: 85, frameY: 18, frameRot: 20, frameScale: 0.64 },
  { x: 70, y: 8, size: 24, rot: 126, order: 0.42, inOrder: 0.25, variant: 5, frameX: 96, frameY: 14, frameRot: 120, frameScale: 0.72 },
  { x: 88, y: 10, size: 27, rot: -52, order: 0.8, inOrder: 0.5, variant: 6, frameX: 108, frameY: 10, frameRot: -58, frameScale: 0.74 },

  { x: 12, y: 25, size: 25, rot: 74, order: 0.78, inOrder: 0.72, variant: 7, frameX: -3, frameY: 27, frameRot: 80, frameScale: 0.82 },
  { x: 27, y: 25, size: 27, rot: -36, order: 0.5, inOrder: 0.12, variant: 8, frameX: 9, frameY: 38, frameRot: -40, frameScale: 0.8 },
  { x: 44, y: 26, size: 28, rot: 108, order: 0.14, inOrder: 0.44, variant: 5, frameX: 17, frameY: 49, frameRot: 104, frameScale: 0.68 },
  { x: 60, y: 25, size: 26, rot: -86, order: 0.2, inOrder: 0.84, variant: 6, frameX: 84, frameY: 36, frameRot: -82, frameScale: 0.68 },
  { x: 76, y: 26, size: 28, rot: 26, order: 0.54, inOrder: 0.28, variant: 7, frameX: 96, frameY: 28, frameRot: 22, frameScale: 0.84 },
  { x: 92, y: 28, size: 25, rot: 158, order: 0.88, inOrder: 0.66, variant: 8, frameX: 108, frameY: 28, frameRot: 152, frameScale: 0.82 },

  { x: 4, y: 44, size: 27, rot: -66, order: 0.96, inOrder: 0.56, variant: 4, frameX: -7, frameY: 43, frameRot: -72, frameScale: 0.95 },
  { x: 19, y: 43, size: 25, rot: 10, order: 0.64, inOrder: 0.24, variant: 3, frameX: 6, frameY: 52, frameRot: 6, frameScale: 0.9 },
  { x: 35, y: 43, size: 29, rot: -148, order: 0.3, inOrder: 0.76, variant: 8, frameX: 15, frameY: 65, frameRot: -154, frameScale: 0.78 },
  { x: 51, y: 45, size: 30, rot: 42, order: 0.02, inOrder: 0.2, variant: 7, frameX: 85, frameY: 55, frameRot: 46, frameScale: 0.78 },
  { x: 67, y: 44, size: 29, rot: 114, order: 0.34, inOrder: 0.8, variant: 6, frameX: 96, frameY: 45, frameRot: 110, frameScale: 0.9 },
  { x: 83, y: 43, size: 26, rot: -20, order: 0.68, inOrder: 0.08, variant: 5, frameX: 108, frameY: 42, frameRot: -26, frameScale: 0.95 },

  { x: 10, y: 62, size: 26, rot: 142, order: 0.8, inOrder: 0.9, variant: 1, frameX: -5, frameY: 61, frameRot: 148, frameScale: 0.92 },
  { x: 26, y: 62, size: 28, rot: -104, order: 0.5, inOrder: 0.4, variant: 2, frameX: 7, frameY: 72, frameRot: -110, frameScale: 0.9 },
  { x: 42, y: 63, size: 26, rot: 64, order: 0.16, inOrder: 0.04, variant: 3, frameX: 17, frameY: 84, frameRot: 60, frameScale: 0.72 },
  { x: 58, y: 63, size: 27, rot: -8, order: 0.16, inOrder: 0.7, variant: 4, frameX: 83, frameY: 74, frameRot: -4, frameScale: 0.72 },
  { x: 74, y: 62, size: 28, rot: 78, order: 0.48, inOrder: 0.16, variant: 5, frameX: 96, frameY: 63, frameRot: 74, frameScale: 0.9 },
  { x: 90, y: 62, size: 25, rot: -136, order: 0.84, inOrder: 0.52, variant: 6, frameX: 108, frameY: 60, frameRot: -142, frameScale: 0.92 },

  { x: 7, y: 82, size: 25, rot: -18, order: 0.9, inOrder: 0.14, variant: 7, frameX: -6, frameY: 82, frameRot: -24, frameScale: 0.82 },
  { x: 22, y: 82, size: 27, rot: 92, order: 0.56, inOrder: 0.58, variant: 8, frameX: 7, frameY: 92, frameRot: 98, frameScale: 0.78 },
  { x: 38, y: 83, size: 25, rot: -166, order: 0.24, inOrder: 0.36, variant: 1, frameX: 17, frameY: 96, frameRot: -172, frameScale: 0.62 },
  { x: 54, y: 82, size: 28, rot: 20, order: 0.08, inOrder: 0.88, variant: 2, frameX: 84, frameY: 94, frameRot: 24, frameScale: 0.62 },
  { x: 70, y: 83, size: 26, rot: -74, order: 0.4, inOrder: 0.3, variant: 5, frameX: 96, frameY: 84, frameRot: -70, frameScale: 0.78 },
  { x: 86, y: 82, size: 27, rot: 132, order: 0.76, inOrder: 0.68, variant: 6, frameX: 108, frameY: 82, frameRot: 126, frameScale: 0.82 },

  { x: 18, y: 96, size: 22, rot: 34, order: 0.64, inOrder: 0.98, variant: 8, frameX: 3, frameY: 97, frameRot: 28, frameScale: 0.62 },
  { x: 50, y: 96, size: 23, rot: -48, order: 0.04, inOrder: 0.46, variant: 6, frameX: 94, frameY: 97, frameRot: -44, frameScale: 0.58 },
  { x: 82, y: 96, size: 22, rot: 172, order: 0.64, inOrder: 0.82, variant: 7, frameX: 108, frameY: 95, frameRot: 166, frameScale: 0.64 },
  { x: 50, y: 7, size: 22, rot: -12, order: 0.04, inOrder: 0.1, variant: 5, frameX: 94, frameY: 7, frameRot: -8, frameScale: 0.58 },
];

const leafSrc = (variant: FgLeafCfg["variant"]) =>
  `/media/home/lotus/individual/lotus-leaf-${String(variant).padStart(2, "0")}.png`;

export const FG_FLOWERS: FgFlowerCfg[] = [
  { x: 49, y: 45, size: 15, rot: -6, order: 0.02, inOrder: 0.2, variant: 2, frameX: 34, frameY: 8, frameRot: -8, frameScale: 0.6 },
  { x: 51, y: 45, size: 15, rot: 6, order: 0.05, inOrder: 0.35, variant: 3, frameX: 66, frameY: 8, frameRot: 10, frameScale: 0.6 },
  { x: 45, y: 47, size: 16, rot: -14, order: 0.1, inOrder: 0.55, variant: 1, frameX: 9, frameY: 18, frameRot: -18, frameScale: 0.7 },
  { x: 55, y: 47, size: 16, rot: 14, order: 0.13, inOrder: 0.7, variant: 2, frameX: 91, frameY: 18, frameRot: 18, frameScale: 0.7 },
  { x: 46, y: 52, size: 15, rot: 18, order: 0.2, inOrder: 0.85, variant: 3, frameX: 6, frameY: 28, frameRot: 22, frameScale: 0.66 },
  { x: 54, y: 52, size: 15, rot: -18, order: 0.24, inOrder: 0.45, variant: 1, frameX: 94, frameY: 28, frameRot: -22, frameScale: 0.66 },
];

const flowerSrc = (
  variant: FgFlowerCfg["variant"],
  state: "bud" | "half" | "full",
) =>
  `/media/home/lotus/individual/lotus-flower-${String(variant).padStart(2, "0")}-${state}.png`;

export function FgLotusLayer() {
  return <LotusField className="fgl-layer" fixed={false} />;
}

export function KoiLotusFrame() {
  return <LotusField className="koi-lotus-frame" fixed />;
}

function LotusField({
  className,
  fixed,
}: {
  className: string;
  fixed: boolean;
}) {
  return (
    <div className={className} aria-hidden="true">
      {FG_LEAVES.map((c, i) => (
        <div
          key={`leaf-${i}`}
          className="fgl-item fgl-leaf"
          style={{
            left: `${fixed ? c.frameX : c.x}%`,
            top: `${fixed ? c.frameY : c.y}%`,
            width: `${c.size}vmin`,
            height: `${c.size}vmin`,
            transform: fixed
              ? `translate(-50%, -50%) rotate(${c.frameRot}deg) scale(${c.frameScale})`
              : undefined,
          }}
        >
          <img
            className="fgl-asset"
            src={leafSrc(c.variant)}
            alt=""
            draggable={false}
            decoding="async"
            loading={fixed ? "lazy" : undefined}
            fetchPriority={fixed ? "low" : undefined}
          />
        </div>
      ))}

      {FG_FLOWERS.map((c, i) => (
        <div
          key={`flower-${i}`}
          className="fgl-item fgl-flower"
          style={{
            left: `${fixed ? c.frameX : c.x}%`,
            top: `${fixed ? c.frameY : c.y}%`,
            width: `${c.size}vmin`,
            height: `${c.size}vmin`,
            transform: fixed
              ? `translate(-50%, -50%) rotate(${c.frameRot}deg) scale(${c.frameScale})`
              : undefined,
          }}
        >
          {fixed ? (
            <img
              className="fgl-asset fgl-f-full"
              src={flowerSrc(c.variant, "full")}
              alt=""
              draggable={false}
              decoding="async"
              loading="lazy"
              fetchPriority="low"
            />
          ) : (
            <>
              <img
                className="fgl-asset fgl-f-bud"
                src={flowerSrc(c.variant, "bud")}
                alt=""
                draggable={false}
                decoding="async"
              />
              <img
                className="fgl-asset fgl-f-half"
                src={flowerSrc(c.variant, "half")}
                alt=""
                draggable={false}
                decoding="async"
              />
              <img
                className="fgl-asset fgl-f-full"
                src={flowerSrc(c.variant, "full")}
                alt=""
                draggable={false}
                decoding="async"
              />
            </>
          )}
        </div>
      ))}

      <style
        dangerouslySetInnerHTML={{
          __html: stripCssComments(`
        .fgl-layer,
        .koi-lotus-frame {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
        }
        .fgl-layer {
          z-index: 3;
          /* nudged toward the static frame's tone (0.72 alpha / more blur)
             so the crossing canopy doesn't read markedly brighter/crisper
             than what it dissolves into at the handoff */
          --leaf-alpha: 0.78;
          --leaf-filter: saturate(0.7) brightness(0.6) contrast(0.85) blur(0.34px);
        }
        .koi-lotus-frame {
          z-index: 2;
          --leaf-alpha: 0.72;
          --leaf-filter: saturate(0.66) brightness(0.6) contrast(0.82) blur(0.46px);
        }
        .fgl-item {
          position: absolute;
          opacity: 0;
          transform-origin: 50% 50%;
        }
        .fgl-layer .fgl-item {
          will-change: transform, opacity;
        }
        .koi-lotus-frame .fgl-item {
          opacity: 0.78;
        }
        .fgl-flower {
          z-index: 1;
        }
        .fgl-asset {
          position: absolute;
          inset: 0;
          display: block;
          width: 100%;
          height: 100%;
          object-fit: contain;
          user-select: none;
          opacity: var(--leaf-alpha);
          filter: var(--leaf-filter);
        }
        .fgl-layer .fgl-f-half,
        .fgl-layer .fgl-f-full {
          opacity: 0;
        }
        @media (max-width: 740px) {
          .koi-lotus-frame {
            display: none;
          }
        }
      `),
        }}
      />
    </div>
  );
}
