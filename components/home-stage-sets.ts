// Home stage — L1 sets: the two worlds the ikebana is rendered into.
//
// Layer 0 = the arrangement (always rendered). Layer 1 = the photo set (dark
// warm table, window key light). Layer 2 = the visionOS room (bright floor,
// soft sky light, fog that melts the floor into the backdrop). Lights obey
// camera layers in three.js, so `usePass()` switches lighting with geometry.
import type * as Three from "three";
import { STAGE_BUDGET, STAGE_PHOTO_BG, STAGE_ROOM_FLOOR, STAGE_ROOM_TOP } from "./home-stage-tokens";

type ThreeNS = typeof Three;
export type Pass = "photo" | "room";

const PHOTO_LAYER = 1;
const ROOM_LAYER = 2;

function onLayer<T extends Three.Object3D>(obj: T, layer: number): T {
  obj.layers.set(layer);
  return obj;
}

function keyLight(THREE: ThreeNS, color: string, intensity: number, pos: [number, number, number], lite: boolean) {
  const light = new THREE.DirectionalLight(color, intensity);
  light.position.set(...pos);
  light.target.position.set(0, 1.2, 0);
  light.castShadow = true;
  const size = lite ? STAGE_BUDGET.shadowMap / 2 : STAGE_BUDGET.shadowMap;
  light.shadow.mapSize.set(size, size);
  light.shadow.radius = 6;
  light.shadow.bias = -0.0004;
  const cam = light.shadow.camera;
  cam.left = -3;
  cam.right = 3;
  cam.top = 4;
  cam.bottom = -1;
  cam.near = 0.5;
  cam.far = 20;
  return light;
}

export function buildSets(THREE: ThreeNS, scene: Three.Scene, lite: boolean) {
  const disposables: Array<{ dispose(): void }> = [];

  /* ---- photo set ---- */
  const table = new THREE.Mesh(
    new THREE.PlaneGeometry(30, 30),
    new THREE.MeshStandardMaterial({ color: "#3a2a1c", roughness: 0.45 }),
  );
  table.rotation.x = -Math.PI / 2;
  table.receiveShadow = true;
  disposables.push(table.geometry, table.material);
  const photoKey = keyLight(THREE, "#ffd9a8", 3.2, [-4, 5, 3], lite);
  const photoFill = new THREE.HemisphereLight("#6b5a48", "#120d08", 0.5);
  const photoRim = new THREE.DirectionalLight("#9fb6ff", 0.8);
  photoRim.position.set(3, 3, -4);
  for (const o of [table, photoKey, photoKey.target, photoFill, photoRim]) scene.add(onLayer(o, PHOTO_LAYER));

  /* ---- visionOS room ---- */
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(60, 60),
    new THREE.MeshStandardMaterial({ color: STAGE_ROOM_FLOOR, roughness: 0.95 }),
  );
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  disposables.push(floor.geometry, floor.material);
  const roomKey = keyLight(THREE, "#ffffff", 1.6, [2.5, 7, 4], lite);
  const roomSky = new THREE.HemisphereLight("#ffffff", "#d9d9de", 1.4);
  for (const o of [floor, roomKey, roomKey.target, roomSky]) scene.add(onLayer(o, ROOM_LAYER));

  const photoBg = new THREE.Color(STAGE_PHOTO_BG);
  const roomBg = new THREE.Color(STAGE_ROOM_TOP);
  const photoFog = new THREE.Fog(STAGE_PHOTO_BG, 7, 18);
  const roomFog = new THREE.Fog(STAGE_ROOM_TOP, 6, 16);

  /** Point the scene + camera at one world before rendering it. */
  const usePass = (pass: Pass, camera: Three.Camera) => {
    const photo = pass === "photo";
    scene.background = photo ? photoBg : roomBg;
    scene.fog = photo ? photoFog : roomFog;
    camera.layers.set(0);
    camera.layers.enable(photo ? PHOTO_LAYER : ROOM_LAYER);
  };

  const dispose = () => {
    disposables.forEach((d) => d.dispose());
    photoKey.shadow.map?.dispose();
    roomKey.shadow.map?.dispose();
  };

  return { usePass, dispose };
}
