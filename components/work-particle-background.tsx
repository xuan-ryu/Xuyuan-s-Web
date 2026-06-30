"use client";

import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  z: number;
  size: number;
  alpha: number;
  phase: number;
};

function hash(n: number) {
  const s = Math.sin(n * 127.1) * 43758.5453123;
  return s - Math.floor(s);
}

export function WorkParticleBackground() {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let disposed = false;
    let frame = 0;
    let renderer: import("three").WebGLRenderer | null = null;
    let geometry: import("three").BufferGeometry | null = null;
    let material: import("three").ShaderMaterial | null = null;
    let removeResize = () => {};

    async function init() {
      const mount = mountRef.current;
      if (!mount) return;
      const THREE = await import("three");
      if (disposed || !mountRef.current) return;

      const width = mount.offsetWidth || window.innerWidth;
      const height = mount.offsetHeight || window.innerHeight;
      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(
        width / -2,
        width / 2,
        height / 2,
        height / -2,
        -1000,
        1000
      );

      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      renderer.setSize(width, height);
      mount.appendChild(renderer.domElement);

      const count = Math.min(15000, Math.round((width * height) / 95));
      const positions = new Float32Array(count * 3);
      const sizes = new Float32Array(count);
      const alphas = new Float32Array(count);
      const phases = new Float32Array(count);

      for (let i = 0; i < count; i++) {
        const t = i / count;
        const side = t < 0.56 ? 0 : 1;
        const local = side === 0 ? t / 0.56 : (t - 0.56) / 0.44;
        const bandY = side === 0 ? height * 0.44 : height * 0.58;
        const x =
          side === 0
            ? width * (0.03 + local * 0.62)
            : width * (0.42 + local * 0.56);
        const ridge =
          Math.sin(local * Math.PI * (side === 0 ? 2.1 : 1.35)) *
            (side === 0 ? height * 0.08 : height * 0.16) +
          Math.sin(local * 17.0) * height * 0.018;
        const spread = (hash(i + 9.7) - 0.5) * (side === 0 ? 70 : 145);
        const y = bandY - ridge + spread;
        positions[i * 3] = x + (hash(i + 19.1) - 0.5) * 42;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = 0;
        sizes[i] = (side === 0 ? 1.2 : 1.7) + hash(i + 3.3) * 2.4;
        alphas[i] = (side === 0 ? 0.035 : 0.055) + hash(i + 4.4) * 0.11;
        phases[i] = hash(i + 8.8) * Math.PI * 2;
      }

      geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
      geometry.setAttribute("aAlpha", new THREE.BufferAttribute(alphas, 1));
      geometry.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));

      material = new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        vertexShader: `
          attribute float aSize;
          attribute float aAlpha;
          attribute float aPhase;
          uniform float uTime;
          varying float vAlpha;
          void main() {
            vec3 pos = position;
            pos.x += sin(uTime * 0.18 + aPhase) * 5.0;
            pos.y += cos(uTime * 0.14 + aPhase) * 3.0;
            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_Position = projectionMatrix * mvPosition;
            gl_PointSize = aSize;
            vAlpha = aAlpha * (0.78 + 0.22 * sin(uTime * 0.22 + aPhase));
          }
        `,
        fragmentShader: `
          precision mediump float;
          varying float vAlpha;
          void main() {
            float d = distance(gl_PointCoord, vec2(0.5));
            float shape = 1.0 - smoothstep(0.18, 0.5, d);
            if (shape * vAlpha < 0.01) discard;
            gl_FragColor = vec4(vec3(0.05), shape * vAlpha);
          }
        `,
        uniforms: {
          uTime: { value: 0 },
        },
      });

      const points = new THREE.Points(geometry, material);
      scene.add(points);

      const prefersReducedMotion =
        typeof window.matchMedia === "function" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const render = () => {
        if (disposed || !renderer || !material) return;
        frame = requestAnimationFrame(render);
        material.uniforms.uTime.value = performance.now() * 0.001;
        renderer.render(scene, camera);
      };

      if (prefersReducedMotion) {
        // Reduced motion: draw a single static frame and skip the rAF loop.
        material.uniforms.uTime.value = 0;
        renderer.render(scene, camera);
      } else {
        render();
      }

      const handleResize = () => {
        const nextW = mountRef.current?.offsetWidth || window.innerWidth;
        const nextH = mountRef.current?.offsetHeight || window.innerHeight;
        camera.left = nextW / -2;
        camera.right = nextW / 2;
        camera.top = nextH / 2;
        camera.bottom = nextH / -2;
        camera.updateProjectionMatrix();
        renderer?.setSize(nextW, nextH);
      };
      window.addEventListener("resize", handleResize, { passive: true });
      removeResize = () => window.removeEventListener("resize", handleResize);
    }

    init();

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      removeResize();
      renderer?.domElement.remove();
      geometry?.dispose();
      material?.dispose();
      renderer?.dispose();
    };
  }, []);

  return <div className="work-particle-background" ref={mountRef} aria-hidden="true" />;
}
