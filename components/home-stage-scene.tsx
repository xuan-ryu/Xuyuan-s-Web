"use client";
// Home stage — L1 WebGL island: the fixed ikebana stage behind the homepage.
//
// Each frame: read section positions → camera pose + decode progress; render
// the photo pass and/or the room pass into render targets (only the ones the
// decode needs), then composite to screen through the decode quad.
// Lifecycle contract (engineering skill): three is imported inside the effect;
// rAF runs only while the stage is on screen and the tab is visible; reduced
// motion skips the idle sway (scroll still drives the camera, on demand);
// every exit path runs the same teardown and disposes GPU resources.
// Sets data-stage="ready" on the host after the first frame.
import { useEffect, useRef } from "react";
import { STAGE_BUDGET } from "./home-stage-tokens";
import { buildIkebana } from "./home-ikebana";
import { buildSets } from "./home-stage-sets";
import { buildDecodePass } from "./home-decode-pass";
import { readStage } from "./home-stage-scroll";

export function HomeStageScene() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    const root = host?.closest<HTMLElement>(".home-stage");
    const layer = host?.closest<HTMLElement>(".home-stage-layer");
    if (!host || !root || !layer) return;
    let disposed = false;
    const cleanups: Array<() => void> = [];
    const teardown = () => {
      disposed = true;
      while (cleanups.length) cleanups.pop()?.();
    };

    (async () => {
      const THREE = await import("three");
      const { RoomEnvironment } = await import("three/addons/environments/RoomEnvironment.js");
      if (disposed) return;

      /* ---- renderer ---- */
      let renderer: InstanceType<typeof THREE.WebGLRenderer>;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
      } catch {
        return; // no WebGL: the CSS backdrop + section copy stand alone
      }
      const compact = window.matchMedia("(max-width: 760px)").matches;
      const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, compact ? STAGE_BUDGET.compactDpr : STAGE_BUDGET.maxDpr));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.05;
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.domElement.setAttribute("aria-hidden", "true");
      host.appendChild(renderer.domElement);
      cleanups.push(() => {
        renderer.dispose();
        renderer.domElement.remove();
      });

      /* ---- scene ---- */
      const scene = new THREE.Scene();
      const pmrem = new THREE.PMREMGenerator(renderer);
      const env = pmrem.fromScene(new RoomEnvironment(), 0.04);
      scene.environment = env.texture;
      scene.environmentIntensity = 0.45;
      const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 80);
      const ikebana = buildIkebana(THREE, compact);
      scene.add(ikebana.group);
      const sets = buildSets(THREE, scene, compact);

      const rtOpts = { type: THREE.HalfFloatType, samples: compact ? 0 : 4 };
      const rtPhoto = new THREE.WebGLRenderTarget(1, 1, rtOpts);
      const rtRoom = new THREE.WebGLRenderTarget(1, 1, rtOpts);
      const decode = buildDecodePass(THREE, rtPhoto.texture, rtRoom.texture);
      cleanups.push(() => {
        decode.dispose();
        rtPhoto.dispose();
        rtRoom.dispose();
        sets.dispose();
        ikebana.dispose();
        env.dispose();
        pmrem.dispose();
      });

      /* ---- sizing ---- */
      const resize = () => {
        const w = host.clientWidth;
        const h = host.clientHeight;
        const dpr = renderer.getPixelRatio();
        renderer.setSize(w, h, false);
        rtPhoto.setSize(w * dpr, h * dpr);
        rtRoom.setSize(w * dpr, h * dpr);
        camera.aspect = w / h;
        requestFrame();
      };
      const ro = new ResizeObserver(resize);
      ro.observe(host);
      cleanups.push(() => ro.disconnect());

      /* ---- frame ---- */
      const clock = new THREE.Clock();
      let raf = 0;
      let onScreen = true;
      const draw = () => {
        const t = clock.getElapsedTime();
        const { pose, decode: p } = readStage(root, compact);
        camera.position.set(...pose.pos);
        camera.fov = pose.fov;
        camera.updateProjectionMatrix();
        camera.lookAt(...pose.target);
        ikebana.group.rotation.y = still ? 0 : Math.sin(t * 0.25) * 0.04;

        if (p < 1) {
          sets.usePass("photo", camera);
          ikebana.setMode("photo");
          renderer.setRenderTarget(rtPhoto);
          renderer.render(scene, camera);
        }
        if (p > 0) {
          sets.usePass("room", camera);
          ikebana.setMode("clay");
          renderer.setRenderTarget(rtRoom);
          renderer.render(scene, camera);
        }
        renderer.setRenderTarget(null);
        decode.material.uniforms.uProgress.value = p;
        decode.material.uniforms.uTime.value = still ? 0 : t;
        renderer.render(decode.scene, decode.camera);
        host.dataset.stage = "ready";
        // the header samples the layer behind it: report which world shows
        const tone = p > 0.5 ? "room" : "photo";
        if (layer.dataset.tone !== tone) {
          layer.dataset.tone = tone;
          layer.toggleAttribute("data-nav-dark", tone === "photo");
        }
      };
      const loop = () => {
        raf = 0;
        if (disposed || !onScreen || document.hidden) return;
        draw();
        if (!still) raf = requestAnimationFrame(loop);
      };
      function requestFrame() {
        if (!raf && onScreen && !document.hidden && !disposed) raf = requestAnimationFrame(loop);
      }
      cleanups.push(() => cancelAnimationFrame(raf));

      // reduced motion: no idle loop — redraw only when scroll/resize asks
      const onScroll = () => requestFrame();
      window.addEventListener("scroll", onScroll, { passive: true });
      const io = new IntersectionObserver(([entry]) => {
        onScreen = entry.isIntersecting;
        requestFrame();
      });
      io.observe(root);
      const onVis = () => requestFrame();
      document.addEventListener("visibilitychange", onVis);
      cleanups.push(() => {
        window.removeEventListener("scroll", onScroll);
        io.disconnect();
        document.removeEventListener("visibilitychange", onVis);
      });

      resize();
    })().catch(() => teardown());

    return teardown;
  }, []);

  return <div ref={hostRef} className="home-stage-canvas" />;
}
