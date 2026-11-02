// Home stage — L0 tokens for the ikebana scene (pure data, no logic).
//
// One fixed WebGL stage sits behind the whole homepage. It renders the same
// arrangement twice: a warm "photo" pass (the opening still) and a bright
// visionOS-style clay room. The hero scroll decodes photo → room left to
// right; every later section is a camera shot of the same arrangement.

export const STAGE_PHOTO_BG = "#1b1712";
export const STAGE_ROOM_TOP = "#f6f6f8";
export const STAGE_ROOM_FLOOR = "#e7e7ea";

/** World units: the vase stands on the floor at y = 0. */
export type Shot = {
  pos: readonly [number, number, number];
  target: readonly [number, number, number];
  fov: number;
};

/** Shot names match the `data-shot` attributes on the homepage sections. */
export const STAGE_SHOTS = {
  hero: { pos: [0.9, 1.35, 6.6], target: [-0.85, 1.25, 0], fov: 34 },
  intro: { pos: [3.4, 1.9, 3.9], target: [0.9, 1.35, 0], fov: 34 },
  work: { pos: [-1.5, 2.55, 2.3], target: [0.55, 2.05, 0], fov: 30 },
  method: { pos: [1.2, 0.35, 2.9], target: [-0.6, 1.75, 0], fov: 36 },
} as const satisfies Record<string, Shot>;

export type ShotName = keyof typeof STAGE_SHOTS;

/** Phone shots keep the arrangement centred under stacked copy. */
export const STAGE_SHOTS_COMPACT: Record<ShotName, Shot> = {
  hero: { pos: [0, 1.5, 7.6], target: [0, 1.55, 0], fov: 38 },
  intro: { pos: [3.2, 2.2, 5.2], target: [0, 1.9, 0], fov: 38 },
  work: { pos: [-1.6, 2.8, 3.2], target: [0, 2.4, 0], fov: 36 },
  method: { pos: [1.2, 0.4, 3.8], target: [0, 1.9, 0], fov: 40 },
};

/** Clay palette for the room pass — soft greys, never pure white. */
export const CLAY = {
  vase: "#f1f1f3",
  stem: "#d9d9dc",
  leaf: "#e4e4e7",
  petal: "#fbfbfc",
  heart: "#d2d2d6",
} as const;

/** Colour palette for the photo pass (placeholder for a real photograph). */
export const PHOTO = {
  vase: "#2c3a3c",
  stem: "#4a3a26",
  leaf: "#3f5a2e",
  petal: "#f2e6dc",
  petalAlt: "#c8211b",
  heart: "#e2b64a",
} as const;

/** Decode band — fraction of screen width the pixel band spans. */
export const DECODE = {
  band: 0.14,
  cells: [96, 54] as const,
  /** hero scroll fraction where the decode starts / finishes */
  start: 0.45,
  end: 0.92,
} as const;

export const STAGE_BUDGET = {
  maxDpr: 1.75,
  compactDpr: 1.25,
  shadowMap: 1024,
} as const;
