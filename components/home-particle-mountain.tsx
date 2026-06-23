"use client";

import { useEffect, useRef } from "react";

type InkParticle = {
  x: number;
  y: number;
  ox: number;
  oy: number;
  size: number;
  alpha: number;
  phase: number;
};

const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.max(0, Math.min(1, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

const rand = (n: number) => {
  const s = Math.sin(n * 12.9898) * 43758.5453123;
  return s - Math.floor(s);
};

export function HomeParticleMountain() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    let raf = 0;
    let width = 1;
    let height = 1;
    let dpr = 1;
    let particles: InkParticle[] = [];
    const mouse = { x: -9999, y: -9999, active: 0 };

    const ridgeY = (x: number, anchorY: number, scale: number, seed: number) => {
      const t = x;
      return (
        anchorY -
        Math.sin(t * Math.PI) * scale -
        Math.sin(t * Math.PI * 3.2 + seed) * scale * 0.24 -
        Math.sin(t * Math.PI * 8.1 + seed * 1.7) * scale * 0.08
      );
    };

    const buildParticles = () => {
      const area = width * height;
      const count = Math.min(26000, Math.max(12000, Math.round(area / 72)));
      particles = [];
      for (let i = 0; i < count; i++) {
        const sideSeed = rand(i + 4.1);
        const left = sideSeed < 0.38;
        const mid = sideSeed >= 0.38 && sideSeed < 0.66;
        const t = rand(i + 9.4);
        const x = left
          ? width * (-0.04 + t * 0.46)
          : mid
            ? width * (0.32 + t * 0.32)
            : width * (0.56 + t * 0.48);
        const anchorY = left ? height * 0.62 : mid ? height * 0.58 : height * 0.68;
        const scale = left ? height * 0.12 : mid ? height * 0.11 : height * 0.21;
        const ridge = ridgeY(t, anchorY, scale, left ? 0.4 : mid ? 1.6 : 2.8);
        const body = Math.pow(rand(i + 19.5), 1.9) * (left ? 92 : mid ? 80 : 170);
        const mist = (rand(i + 29.7) - 0.5) * (left ? 62 : mid ? 84 : 135);
        const y = ridge + body + mist;
        const size = (left ? 0.7 : mid ? 0.85 : 1.05) + rand(i + 33.3) * 1.8;
        const alpha = (left ? 0.055 : mid ? 0.04 : 0.05) + rand(i + 44.8) * 0.16;
        particles.push({
          x,
          y,
          ox: (rand(i + 55.2) - 0.5) * 28,
          oy: (rand(i + 65.6) - 0.5) * 18,
          size,
          alpha,
          phase: rand(i + 77.7) * Math.PI * 2,
        });
      }
    };

    const resize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      buildParticles();
    };

    const draw = () => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) return;
      const scroll = window.scrollY || 0;
      const progress = Math.min(scroll / Math.max(height, 1), 1);
      const opacity = 1 - smoothstep(0.36, 0.58, progress);
      canvas.style.opacity = String(opacity);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      if (opacity > 0.01) {
        const time = performance.now() * 0.001;
        ctx.globalCompositeOperation = "source-over";
        for (const p of particles) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.hypot(dx, dy);
          const hover = mouse.active * (1 - smoothstep(26, 120, dist));
          const push = hover * 18;
          const nx = dist > 0.01 ? dx / dist : 0;
          const ny = dist > 0.01 ? dy / dist : 0;
          const x = p.x + p.ox + Math.sin(time * 0.22 + p.phase) * 3 + nx * push;
          const y = p.y + p.oy + Math.cos(time * 0.18 + p.phase) * 2 + ny * push;
          const a = p.alpha * (0.76 + 0.24 * Math.sin(time * 0.16 + p.phase));
          ctx.fillStyle = `rgba(15, 15, 15, ${a})`;
          ctx.beginPath();
          ctx.arc(x, y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      raf = requestAnimationFrame(draw);
    };

    const onMouseMove = (event: MouseEvent) => {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
      mouse.active = 1;
    };
    const onMouseLeave = () => {
      mouse.active = 0;
    };

    resize();
    draw();
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mouseleave", onMouseLeave, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return <canvas className="home-particle-mountain" ref={canvasRef} aria-hidden="true" />;
}
