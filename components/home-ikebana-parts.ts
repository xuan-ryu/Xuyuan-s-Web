// Home stage — L1 geometry builders for the placeholder ikebana.
//
// Pure functions of the three module (passed in so the engine stays lazily
// imported). Every geometry is built once and shared by both material passes.
// Placeholder only: a real scan/photo replaces the look, not the stage API.
import type * as Three from "three";

type ThreeNS = typeof Three;
type V3 = readonly [number, number, number];

/* ---- vase: nageire-style tall ceramic ---- */

export function vaseGeometry(THREE: ThreeNS, lite: boolean) {
  const profile: [number, number][] = [
    [0.0, 0.0], [0.24, 0.0], [0.27, 0.04], [0.34, 0.32], [0.36, 0.55],
    [0.3, 0.82], [0.18, 1.0], [0.14, 1.08], [0.17, 1.14], [0.15, 1.15],
    [0.12, 1.1], [0.11, 0.95],
  ];
  const pts = profile.map(([x, y]) => new THREE.Vector2(x, y));
  return new THREE.LatheGeometry(pts, lite ? 40 : 72);
}

/* ---- stems ---- */

export function stemGeometry(THREE: ThreeNS, path: readonly V3[], radius: number, lite: boolean) {
  const curve = new THREE.CatmullRomCurve3(path.map((p) => new THREE.Vector3(...p)));
  const geo = new THREE.TubeGeometry(curve, lite ? 40 : 90, radius, lite ? 5 : 8, false);
  return { geo, curve };
}

/* ---- petal / leaf blades ---- */

/**
 * A cupped blade with its base at the origin, growing along +Y.
 * `cup` curls the edges forward, `arch` bends the tip back.
 */
export function bladeGeometry(
  THREE: ThreeNS,
  w: number,
  h: number,
  cup: number,
  arch: number,
  lite: boolean,
) {
  const geo = new THREE.PlaneGeometry(w, h, lite ? 6 : 10, lite ? 8 : 14);
  geo.translate(0, h / 2, 0);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const t = y / h;
    // taper: round petal (sin) — narrower base and tip
    const taper = Math.sin(Math.PI * Math.min(1, t * 0.92 + 0.08));
    const nx = x * taper;
    const z = cup * (nx / (w / 2)) ** 2 * 0.5 * w + arch * t * t * h;
    pos.setXYZ(i, nx, y, z);
  }
  geo.computeVertexNormals();
  return geo;
}

/* ---- flower head layout ---- */

export type PetalPlacement = { yaw: number; tilt: number; scale: number; alt: boolean };

/** Rings of petals: inner ring upright and small, outer ring open and large. */
export function flowerPlacements(rings: number, perRing: number, altEvery = 0): PetalPlacement[] {
  const out: PetalPlacement[] = [];
  for (let r = 0; r < rings; r++) {
    const n = perRing + r * 2;
    for (let i = 0; i < n; i++) {
      out.push({
        yaw: (i / n) * Math.PI * 2 + r * 0.5,
        tilt: 0.25 + r * 0.42,
        scale: 0.62 + r * 0.24,
        alt: altEvery > 0 && r === rings - 1 && i % altEvery === 0,
      });
    }
  }
  return out;
}

/** Point + tangent at fraction `t` along a stem, for attaching leaves/flowers. */
export function along(curve: Three.CatmullRomCurve3, t: number) {
  return { point: curve.getPointAt(t), tangent: curve.getTangentAt(t) };
}
