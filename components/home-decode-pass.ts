// Home stage — L1 decode compositor: blends the photo pass into the room pass.
//
// A fullscreen quad samples both render targets. Left of the decode edge is
// the room, right of it the photo; inside the band, screen cells flip from
// photo to room on a hashed threshold (blocky "decoding"), with a thin scan
// line and slight RGB split at the edge. The photo side also gets the
// photographic grade (warmth, vignette, grain) that sells the placeholder as
// a still. uProgress 0 = all photo, 1 = all room.
import type * as Three from "three";
import { DECODE } from "./home-stage-tokens";

type ThreeNS = typeof Three;

const vertex = /* glsl */ `
varying vec2 vUv;
void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`;

const fragment = /* glsl */ `
uniform sampler2D tPhoto;
uniform sampler2D tRoom;
uniform float uProgress;
uniform float uTime;
uniform float uBand;
uniform vec2 uCells;
varying vec2 vUv;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

vec3 grade(vec3 c, vec2 uv) {
  c = pow(c, vec3(0.96, 1.0, 1.06)) * vec3(1.04, 1.0, 0.94);
  float v = smoothstep(0.95, 0.25, distance(uv, vec2(0.52, 0.48)));
  c *= mix(0.55, 1.0, v);
  c += (hash(uv * 900.0 + fract(uTime)) - 0.5) * 0.035;
  return c;
}

void main() {
  vec2 cell = floor(vUv * uCells);
  vec2 cellUv = (cell + 0.5) / uCells;
  // edge travels from just left of the screen to just past the right edge
  float edge = mix(-uBand, 1.0 + uBand, uProgress);
  float d = (vUv.x - edge) / uBand;           // <-1 room, >1 photo
  float rowJitter = (hash(vec2(cell.y, 3.0)) - 0.5) * 0.6;
  float th = clamp(0.5 + 0.5 * (d + rowJitter), 0.0, 1.0);
  float flip = step(hash(cell), th); // 1 = photo

  vec3 photo = grade(texture2D(tPhoto, vUv).rgb, vUv);
  vec3 room = texture2D(tRoom, vUv).rgb;
  bool inBand = abs(d) < 1.0;
  if (inBand) {
    // mid-decode cells show a quantised grey of the photo, like a half-resolved frame
    vec3 q = texture2D(tPhoto, cellUv).rgb;
    float g = dot(q, vec3(0.299, 0.587, 0.114));
    vec3 grey = vec3(floor(g * 6.0) / 6.0) * 0.4 + room * 0.6;
    float mid = step(0.35, abs(th - 0.5) * 2.0);
    photo = mix(grey, photo, mid);
  }
  vec3 col = mix(room, photo, inBand ? flip : step(0.0, d));

  // scan line + chromatic split right at the edge
  float scan = exp(-pow((vUv.x - edge) * 220.0, 2.0));
  col += vec3(0.55, 0.62, 0.7) * scan * step(0.001, uProgress) * step(uProgress, 0.999);
  gl_FragColor = vec4(col, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`;

export function buildDecodePass(THREE: ThreeNS, tPhoto: Three.Texture, tRoom: Three.Texture) {
  const material = new THREE.ShaderMaterial({
    vertexShader: vertex,
    fragmentShader: fragment,
    uniforms: {
      tPhoto: { value: tPhoto },
      tRoom: { value: tRoom },
      uProgress: { value: 0 },
      uTime: { value: 0 },
      uBand: { value: DECODE.band },
      uCells: { value: new THREE.Vector2(...DECODE.cells) },
    },
    depthTest: false,
    depthWrite: false,
  });
  const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
  quad.frustumCulled = false;
  const scene = new THREE.Scene();
  scene.add(quad);
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  const dispose = () => {
    quad.geometry.dispose();
    material.dispose();
  };
  return { scene, camera, material, dispose };
}
