// Home stage — L1 ikebana assembly: vase + three lines (shin / soe / hikae),
// blooms at the tips, leaves along the stems, and two material sets.
//
// Every mesh carries userData.part; `setMode("photo" | "clay")` swaps the
// whole arrangement between the warm photo look and the visionOS clay look
// by reassigning shared materials (no geometry rebuild, safe per frame).
// Caller owns dispose() via the returned function.
import type * as Three from "three";
import { CLAY, PHOTO } from "./home-stage-tokens";
import { along, bladeGeometry, flowerPlacements, stemGeometry, vaseGeometry } from "./home-ikebana-parts";

type ThreeNS = typeof Three;
type Part = "vase" | "stem" | "leaf" | "petal" | "petalAlt" | "heart";

/* ---- composition: the three classical lines ---- */

const LINES = [
  { name: "shin", radius: 0.022, bloom: 1.0, path: [[0, 1.0, 0], [-0.12, 1.6, 0.02], [-0.5, 2.3, -0.08], [-0.78, 2.95, -0.1]] },
  { name: "soe", radius: 0.018, bloom: 0.85, path: [[0.02, 1.0, 0.02], [0.2, 1.5, 0.1], [0.62, 2.0, 0.25], [0.95, 2.3, 0.32]] },
  { name: "hikae", radius: 0.015, bloom: 0.7, path: [[0, 1.0, 0.03], [-0.15, 1.25, 0.2], [-0.42, 1.42, 0.45], [-0.6, 1.4, 0.62]] },
] as const;

function materials(THREE: ThreeNS) {
  const side = THREE.DoubleSide;
  const photo: Record<Part, Three.Material> = {
    vase: new THREE.MeshPhysicalMaterial({ color: PHOTO.vase, roughness: 0.32, clearcoat: 1, clearcoatRoughness: 0.12 }),
    stem: new THREE.MeshStandardMaterial({ color: PHOTO.stem, roughness: 0.8 }),
    leaf: new THREE.MeshStandardMaterial({ color: PHOTO.leaf, roughness: 0.55, side }),
    petal: new THREE.MeshPhysicalMaterial({ color: PHOTO.petal, roughness: 0.6, sheen: 1, sheenColor: new THREE.Color("#fff6ee"), side }),
    petalAlt: new THREE.MeshPhysicalMaterial({ color: PHOTO.petalAlt, roughness: 0.55, sheen: 1, sheenColor: new THREE.Color("#ff8a7a"), side }),
    heart: new THREE.MeshStandardMaterial({ color: PHOTO.heart, roughness: 0.7 }),
  };
  const clayMat = (color: string) => new THREE.MeshStandardMaterial({ color, roughness: 0.88, side });
  const clay: Record<Part, Three.Material> = {
    vase: new THREE.MeshPhysicalMaterial({ color: CLAY.vase, roughness: 0.5, clearcoat: 0.6, clearcoatRoughness: 0.3 }),
    stem: clayMat(CLAY.stem),
    leaf: clayMat(CLAY.leaf),
    petal: clayMat(CLAY.petal),
    petalAlt: clayMat(CLAY.petal),
    heart: clayMat(CLAY.heart),
  };
  return { photo, clay };
}

export function buildIkebana(THREE: ThreeNS, lite: boolean) {
  const group = new THREE.Group();
  const mats = materials(THREE);
  const geos: Three.BufferGeometry[] = [];
  const meshes: Three.Mesh[] = [];

  const add = (geo: Three.BufferGeometry, part: Part, parent: Three.Object3D = group) => {
    const mesh = new THREE.Mesh(geo, mats.clay[part]);
    mesh.userData.part = part;
    mesh.castShadow = true;
    mesh.receiveShadow = part === "vase";
    parent.add(mesh);
    meshes.push(mesh);
    return mesh;
  };

  /* ---- vase ---- */
  const vase = vaseGeometry(THREE, lite);
  geos.push(vase);
  add(vase, "vase");

  /* ---- shared blades ---- */
  const petal = bladeGeometry(THREE, 0.2, 0.26, 0.6, -0.12, lite);
  const leaf = bladeGeometry(THREE, 0.12, 0.42, 0.35, 0.18, lite);
  const heart = new THREE.IcosahedronGeometry(0.045, lite ? 1 : 2);
  geos.push(petal, leaf, heart);

  /* ---- lines, blooms, leaves ---- */
  const up = new THREE.Vector3(0, 1, 0);
  for (const line of LINES) {
    const { geo, curve } = stemGeometry(THREE, line.path, line.radius, lite);
    geos.push(geo);
    add(geo, "stem");

    for (const t of [0.35, 0.55, 0.72]) {
      const { point, tangent } = along(curve, t);
      const l = add(leaf, "leaf");
      l.position.copy(point);
      l.quaternion.setFromUnitVectors(up, tangent);
      l.rotateZ((t * 7 + line.radius * 90) % 2 > 1 ? 0.9 : -0.9);
      l.rotateY(t * 5);
    }

    const { point, tangent } = along(curve, 1);
    const head = new THREE.Group();
    head.position.copy(point);
    head.quaternion.setFromUnitVectors(up, tangent.clone().lerp(up, 0.5).normalize());
    head.scale.setScalar(line.bloom * 1.6);
    group.add(head);
    add(heart, "heart", head).position.y = 0.04;
    for (const p of flowerPlacements(lite ? 2 : 3, 5, line.name === "shin" ? 2 : 0)) {
      const m = add(petal, p.alt ? "petalAlt" : "petal", head);
      m.rotation.set(0, p.yaw, 0);
      m.rotateX(p.tilt);
      m.scale.setScalar(p.scale);
    }
  }

  const setMode = (mode: "photo" | "clay") => {
    const set = mode === "photo" ? mats.photo : mats.clay;
    for (const m of meshes) m.material = set[m.userData.part as Part];
  };

  const dispose = () => {
    geos.forEach((g) => g.dispose());
    [...Object.values(mats.photo), ...Object.values(mats.clay)].forEach((m) => m.dispose());
  };

  return { group, setMode, dispose };
}
