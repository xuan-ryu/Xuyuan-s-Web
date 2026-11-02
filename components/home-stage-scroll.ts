// Home stage — L1 scroll reader: turns section positions into a camera pose
// and the hero's decode progress. Pure DOM reads, no writes, no listeners —
// the scene calls it once per frame.
//
// Shot blending: each later [data-shot] section blends its shot in while its
// top edge travels from the viewport bottom to the viewport top, so a shot is
// fully "held" while its section fills the screen.
import { DECODE, STAGE_SHOTS, STAGE_SHOTS_COMPACT, type Shot, type ShotName } from "./home-stage-tokens";

export type Pose = { pos: [number, number, number]; target: [number, number, number]; fov: number };

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const ease = (t: number) => t * t * (3 - 2 * t);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function toPose(s: Shot): Pose {
  return { pos: [...s.pos], target: [...s.target], fov: s.fov };
}

function blend(into: Pose, s: Shot, t: number) {
  for (let i = 0; i < 3; i++) {
    into.pos[i] = lerp(into.pos[i], s.pos[i], t);
    into.target[i] = lerp(into.target[i], s.target[i], t);
  }
  into.fov = lerp(into.fov, s.fov, t);
}

export function readStage(root: HTMLElement, compact: boolean) {
  const shots = compact ? STAGE_SHOTS_COMPACT : STAGE_SHOTS;
  const sections = root.querySelectorAll<HTMLElement>("[data-shot]");
  const vh = window.innerHeight;
  let pose = null as Pose | null;
  let decode = 0;

  Array.from(sections).forEach((el, i) => {
    const name = el.dataset.shot as ShotName;
    const shot = shots[name];
    if (!shot) return;
    const rect = el.getBoundingClientRect();
    if (i === 0 || !pose) {
      pose = toPose(shot);
      // decode runs inside the first (hero) section's own scroll travel
      const travel = Math.max(1, rect.height - vh);
      const p = clamp01(-rect.top / travel);
      decode = clamp01((p - DECODE.start) / (DECODE.end - DECODE.start));
      return;
    }
    blend(pose, shot, ease(clamp01((vh - rect.top) / vh)));
  });

  const resolved: Pose = pose ?? toPose(shots.hero);
  return { pose: resolved, decode };
}
