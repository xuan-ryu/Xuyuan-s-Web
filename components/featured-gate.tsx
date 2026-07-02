"use client";

// Moon Gate (月洞门) — an editorial index whose preview fills a round opening
// in the #fff plaster wall beneath the eaves.
//
// Left: a compact index of condensed-uppercase project names (skill's "work
// index list mode", seal-red active mark). Resting on a name unfolds its story;
// a seal-red tick slides along the number gutter to the active row.
// Right: the moon gate holds a vertical film-strip of the covers; selecting
// slides the strip up/down to the chosen frame, clipped inside the circular
// opening. Media FILLS the circle (you look through a garden gate at the
// scene, not at a mounted print) — a soft radial vignette keeps the rim round.
//
// Scroll choreography (desktop, motion-safe): browsing the index is HOVER
// only (owner decision — scroll-driven index switching read as noise). The
// section pins for ~2.7 viewports and scroll owns just the crossing: past a
// short runway the gate scales until the round opening swallows the viewport
// and sinks to ink; lotus leaves then condense over the ink (the ink is now
// the pond's water) until the viewport is covered; continued scroll parts
// the pads outward from the center while a lotus blossom blooms between
// them; at the very end the blossom and the last chrome dissolve and the
// koi section (pulled up -100vh so it waits right behind) has risen into
// place — one flick passes through the moon gate, through the lotus, onto
// the pond; an up-flick folds the leaves shut and restores the wall (the
// whole arrival is scrubbed, nothing is time-driven). Reduced-motion /
// mobile keep the plain stacked layout, where an idle timer walks the index
// instead (touch has no hover) and the lotus layer never mounts.
//
// English copy, Arabic numerals, one seal-red accent. Prefix fg-.

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Project } from "@/data/projects";
import { Cta } from "@/components/ui/cta";
import { FgLotusLayer, FG_LEAVES } from "@/components/fg-lotus-layer";
import { subscribeLenis } from "@/lib/lenis-bus";

const FEATURED = 4;
// the pin + lotus layer run only here; the same query gates the layer mount
const CROSSING_MEDIA =
  "(min-width: 901px) and (prefers-reduced-motion: no-preference)";
// ── crossing fraction map (of the 270% pin) ──
// The pin grew 200% → 270% for the lotus arrival; runway/zoom/ink keep their
// old ABSOLUTE scroll lengths (0.12 of 200% ≈ 0.09 of 270%, etc.) so the
// approach feels identical — the added travel is all arrival.
const PIN_END = "+=270%";
const ZOOM_START = 0.09; // short runway so the pin doesn't feel grabby
const ZOOM_END = 0.37; // gate fully scaled by here (hidden under full ink)
const INK_AT = 0.13; // veil starts…
const INK_DUR = 0.18; // …and the gate is solid ink by 0.31
const LEAF_IN = 0.33; // pads condense over the ink until the water is covered
const LEAF_IN_SPREAD = 0.07; // per-pad start scatter
const LEAF_IN_DUR = 0.08;
const PART_AT = 0.5; // the canopy parts from the center…
const PART_STAGGER = 0.12; // …center pads first, edges last
const PART_DUR = 0.26;
const BLOOM_OUTER = 0.54; // the blossom opens while the pads drift out
const BLOOM_INNER = 0.63;
const FADE_AT = 0.88; // ink + wall dissolve over the (by now) risen pond
const SNAP_FREE = 0.13; // below this progress there is no snap — rest and read

export function FeaturedGate({ projects }: { projects: Project[] }) {
  // only the product / UI-UX / AI work (the first four); the game + VR pieces
  // live on the full Work page, reached via the CTA below the list
  const list = [...projects]
    .sort((a, b) => a.order - b.order)
    .slice(0, FEATURED);
  const firstWithVideo = Math.max(0, list.findIndex((p) => p.previewVideo));
  const [active, setActive] = useState(firstWithVideo);
  const [tickY, setTickY] = useState<number | null>(null);
  // entrance is component-owned state (NOT the global FadeReveal classes):
  // is-visible painted onto re-rendered nodes gets wiped by React, and the
  // global observer only arms once per route — state survives everything
  const [revealed, setRevealed] = useState(false);
  // the lotus layer exists only where the crossing pin runs (desktop,
  // motion-safe) — reduced-motion / mobile / SSR never even mount it
  const [lotusOn, setLotusOn] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLSpanElement>(null);
  const gateRef = useRef<HTMLAnchorElement>(null);
  const veilRef = useRef<HTMLSpanElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const rowRefs = useRef<(HTMLLIElement | null)[]>([]);
  const pinnedRef = useRef(false);
  // auto-advance backoff: each interaction makes the idle timer skip the next
  // two ticks (~9.6s) before it resumes walking the index
  const holdTicksRef = useRef(0);

  const ap = list[active] ?? list[0];
  const num = (i: number) => String(i + 1).padStart(2, "0");
  const pick = (i: number) => {
    holdTicksRef.current = 2;
    setActive(i);
  };

  // ── seal-red tick: slide to the active row's number (re-measure after the
  //    accordion settles — collapsing rows above shift the target) ──
  useEffect(() => {
    const measure = () => {
      const listEl = listRef.current;
      const numEl =
        rowRefs.current[active]?.querySelector<HTMLElement>(".fg-row-num");
      if (!listEl || !numEl) return;
      setTickY(
        numEl.getBoundingClientRect().top -
          listEl.getBoundingClientRect().top +
          2,
      );
    };
    measure();
    const settle = window.setTimeout(measure, 660);
    window.addEventListener("resize", measure);
    return () => {
      window.clearTimeout(settle);
      window.removeEventListener("resize", measure);
    };
  }, [active]);

  // ── mount/unmount the lotus layer with the same media boundary as the pin ──
  useEffect(() => {
    const mq = window.matchMedia(CROSSING_MEDIA);
    const update = () => setLotusOn(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // ── scroll choreography: pin + beats + through-the-gate zoom + lotus
  //    arrival. Re-runs when the lotus layer (un)mounts so the timeline is
  //    always built against the DOM it will actually drive. ──
  useEffect(() => {
    let cancelled = false;
    let mm: ReturnType<typeof import("gsap").default.matchMedia> | null = null;
    let lenisDetach: (() => void) | null = null;
    let unsubLenis: (() => void) | null = null;

    (async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      // keep ScrollTrigger in sync with Lenis's own scroll emission — the DOM
      // scroll event alone is one frame stale under smooth scroll. Also keep
      // a handle on the instance: the snap glides below are driven BY Lenis
      // (lenis.scrollTo), because a ScrollTrigger snap tween writing scrollTop
      // fights Lenis's rAF frame-by-frame and stalls on long distances.
      let currentLenis: Parameters<Parameters<typeof subscribeLenis>[0]>[0] =
        null;
      unsubLenis = subscribeLenis((lenis) => {
        currentLenis = lenis;
        lenisDetach?.();
        lenisDetach = null;
        if (lenis) {
          lenis.on("scroll", ScrollTrigger.update);
          lenisDetach = () => lenis.off("scroll", ScrollTrigger.update);
        }
      });

      mm = gsap.matchMedia();
      mm.add(
        CROSSING_MEDIA,
        () => {
          const section = sectionRef.current;
          const gate = gateRef.current;
          const veil = veilRef.current;
          const bg = bgRef.current;
          if (!section || !gate || !veil || !bg) return;
          pinnedRef.current = true;

          // pull the koi section up one viewport so it waits right behind the
          // pinned gate — the final pin stretch is the pond rising into place
          // while the ink dissolves (gsap.matchMedia reverts this on cleanup).
          // The pinned section paints above it via .fg-section { z-index: 2 }.
          gsap.set(".home-koi-section", { marginTop: "-100vh" });

          // scale that guarantees the circular opening covers the viewport
          // from any layout position (worst case: gate center at a corner)
          const coverScale = () =>
            (Math.hypot(window.innerWidth, window.innerHeight) /
              (gate.offsetWidth / 2)) *
            1.05;

          // ── the crossing snap, executed by Lenis ──
          // Below SNAP_FREE there is no snap at all — the pinned section can
          // be rested on and browsed by hover. Once the zoom is visibly under
          // way, the crossing always completes in the direction of travel
          // (down → the pond, up → back to the wall); executed via
          // lenis.scrollTo because a ScrollTrigger snap tween fights Lenis's
          // rAF and stalls on long glides.
          let snapGliding = false;
          let snapClear = 0;
          let idleTimer = 0;
          const easeInOut = (t: number) =>
            t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

          const trySnap = (self: globalThis.ScrollTrigger) => {
            const lenis = currentLenis;
            if (!lenis || snapGliding) return;
            const p = self.progress;
            if (p <= SNAP_FREE || p >= 0.999) return;
            const target = self.direction >= 0 ? 1 : 0;
            const y = self.start + target * (self.end - self.start);
            const dist = Math.abs(y - window.scrollY);
            if (dist < 2) return;
            // cap raised 1.1 → 1.3 for the longer (270%) crossing distance
            const duration = Math.min(1.3, Math.max(0.35, dist / 1600));
            snapGliding = true;
            // a user flick mid-glide retargets Lenis and onComplete never
            // fires — the fallback timer re-arms snapping either way
            window.clearTimeout(snapClear);
            snapClear = window.setTimeout(
              () => {
                snapGliding = false;
              },
              duration * 1000 + 250,
            );
            lenis.scrollTo(y, {
              duration,
              easing: easeInOut,
              onComplete: () => {
                snapGliding = false;
              },
            });
          };

          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              id: "fg-gate",
              trigger: section,
              start: "top top",
              end: PIN_END,
              pin: true,
              scrub: 0.6,
              invalidateOnRefresh: true,
              onUpdate(self) {
                const p = self.progress;
                // once the ink starts dissolving, the (transparent) fixed
                // section must stop swallowing the pond's pointer events
                section.style.pointerEvents = p > 0.85 ? "none" : "";
                // idle-detect: when scroll emission stops for a beat and no
                // glide is in flight, complete the crossing
                if (!snapGliding) {
                  window.clearTimeout(idleTimer);
                  idleTimer = window.setTimeout(() => trySnap(self), 140);
                }
              },
            },
          });

          tl.to({}, { duration: 1 }, 0) // master span: positions = fractions
            .to(
              [leftRef.current, headRef.current],
              { opacity: 0, duration: 0.06 },
              ZOOM_START,
            )
            .to(
              gate,
              {
                scale: coverScale,
                duration: ZOOM_END - ZOOM_START,
                ease: "power2.in",
                force3D: true,
              },
              ZOOM_START,
            )
            .to(veil, { opacity: 1, duration: INK_DUR }, INK_AT)
            // the handoff: ink (and the white wall) dissolve at the very end,
            // once the koi section has (mostly) risen behind — autoAlpha so
            // the faded layers also stop hit-testing. Until then the ink
            // veil IS the pond surface the lotus pads sit on.
            .to([bg, gate], { autoAlpha: 0, duration: 0.09 }, FADE_AT);

          // ── lotus arrival: pads condense over the ink, part from the
          //    center, and a blossom blooms in the opening — all scrubbed,
          //    geometry from FgLotusLayer, motion params from FG_LEAVES ──
          const layer = section.querySelector<HTMLElement>(".fgl-layer");
          if (layer) {
            const rad = (deg: number) => (deg * Math.PI) / 180;
            const leaves = gsap.utils.toArray<HTMLElement>(".fgl-leaf", layer);
            leaves.forEach((el, i) => {
              const cfg = FG_LEAVES[i];
              if (!cfg) return;
              gsap.set(el, {
                xPercent: -50,
                yPercent: -50,
                rotation: cfg.rot,
                scale: 1.12,
                transformOrigin: "50% 50%",
              });
              // condense onto the water (slight settle, scattered starts)
              tl.to(
                el,
                { opacity: 1, scale: 1, duration: LEAF_IN_DUR },
                LEAF_IN + cfg.inOrder * LEAF_IN_SPREAD,
              );
              // part along its own radial vector — center pads first; the
              // slow-in ease reads as surface tension letting go. x/y are
              // function-based so invalidateOnRefresh re-measures them.
              tl.to(
                el,
                {
                  x: () =>
                    Math.cos(rad(cfg.partAng)) * cfg.travel * window.innerWidth,
                  y: () =>
                    Math.sin(rad(cfg.partAng)) * cfg.travel * window.innerHeight,
                  rotation: cfg.rot + cfg.drot,
                  duration: PART_DUR,
                  ease: "power2.in",
                },
                PART_AT + cfg.order * PART_STAGGER,
              );
            });

            const lotus = layer.querySelector<HTMLElement>(".fgl-lotus");
            if (lotus) {
              gsap.set(lotus, { xPercent: -50, yPercent: -50, autoAlpha: 0 });
              const outer = gsap.utils.toArray<SVGGElement>(
                ".fgl-petal-o",
                lotus,
              );
              const inner = gsap.utils.toArray<SVGGElement>(
                ".fgl-petal-i",
                lotus,
              );
              const heart = lotus.querySelector<SVGGElement>(".fgl-heart");
              // bud: petals furled into a swirl knot at the flower center.
              // Each petal group is drawn unrotated with its base at the
              // center (a static rotate() wrapper fans it), so its bbox
              // bottom-center IS the flower center — scale/rotate about that.
              // (svgOrigin is a trap here: with a negative viewBox min its
              // global-coordinate math displaced the petals.)
              gsap.set([...outer, ...inner], {
                scale: 0.14,
                rotation: -48,
                transformOrigin: "50% 100%",
              });
              if (heart)
                gsap.set(heart, {
                  scale: 0.4,
                  opacity: 0,
                  transformOrigin: "50% 50%",
                });
              // the bud surfaces among the pads…
              tl.to(lotus, { autoAlpha: 1, duration: 0.06 }, LEAF_IN + 0.07);
              // …and blooms while they part: outer ring first, then inner,
              // then the seedpod
              outer.forEach((p, k) =>
                tl.to(
                  p,
                  { scale: 1, rotation: 0, duration: 0.18, ease: "power2.out" },
                  BLOOM_OUTER + k * 0.012,
                ),
              );
              inner.forEach((p, k) =>
                tl.to(
                  p,
                  { scale: 1, rotation: 0, duration: 0.16, ease: "power2.out" },
                  BLOOM_INNER + k * 0.012,
                ),
              );
              if (heart)
                tl.to(heart, { opacity: 1, scale: 1, duration: 0.08 }, 0.72);
            }

            // the blossom (and any straggler pads) dissolve with the chrome —
            // the unpin lands on the live pond alone
            tl.to(layer, { autoAlpha: 0, duration: 0.08 }, 0.9);
          }

          return () => {
            pinnedRef.current = false;
            section.style.pointerEvents = "";
            window.clearTimeout(idleTimer);
            window.clearTimeout(snapClear);
          };
        },
      );
    })();

    return () => {
      cancelled = true;
      mm?.revert();
      unsubLenis?.();
      lenisDetach?.();
    };
    // lotusOn: rebuild once the lotus layer's DOM is mounted (or gone)
  }, [lotusOn]);

  // ── entrance: arm once when the section approaches; state-driven so no
  //    re-render or HMR can un-reveal the rows ──
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setRevealed(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );
    io.observe(section);
    return () => io.disconnect();
  }, []);

  // ── idle auto-advance — only where the pin doesn't run (mobile), so touch
  //    users still see all four projects; pauses after any interaction ──
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const section = sectionRef.current;
    if (!section) return;
    let inView = false;
    const io = new IntersectionObserver(
      (entries) => {
        inView = !!entries[0]?.isIntersecting;
      },
      { threshold: 0.35 },
    );
    io.observe(section);
    const id = window.setInterval(() => {
      if (!inView || pinnedRef.current || document.hidden) return;
      if (holdTicksRef.current > 0) {
        holdTicksRef.current -= 1;
        return;
      }
      setActive((a) => (a + 1) % FEATURED);
    }, 4800);
    return () => {
      io.disconnect();
      window.clearInterval(id);
    };
  }, []);

  return (
    <section
      className={`fg-section${revealed ? " is-revealed" : ""}`}
      aria-labelledby="fg-heading"
      ref={sectionRef}
    >
      {/* the white plaster wall — a child (not the section bg) so the pond
          handoff can dissolve it while the section stays pinned */}
      <span className="fg-bg" ref={bgRef} aria-hidden="true" />
      <div className="fg-shell">
        <header className="fg-head" ref={headRef}>
          <h2 id="fg-heading" className="fg-title">Selected Work</h2>
          <Cta href="/work" variant="quiet" large className="fg-allwork">
            All Work
          </Cta>
        </header>

        <div className="fg-main">
          {/* left: an accordion index of the top four */}
          <div className="fg-left" ref={leftRef}>
          <ol className="fg-list" aria-label="Selected work" ref={listRef}>
            <span
              className="fg-tick"
              aria-hidden="true"
              style={{
                transform: `translateY(${tickY ?? 0}px)`,
                opacity: tickY == null ? 0 : 1,
              }}
            />
            {list.map((p, i) => {
              const isActive = i === active;
              return (
                <li
                  key={p.slug}
                  className={`fg-row${isActive ? " is-active" : ""}`}
                  ref={(el) => {
                    rowRefs.current[i] = el;
                  }}
                >
                  <Link
                    href={`/work/${p.slug}`}
                    className="fg-row-link"
                    style={{ ["--row-i" as string]: i }}
                    onMouseEnter={() => pick(i)}
                    onFocus={() => pick(i)}
                    aria-label={`${p.title} — ${p.tags.join(", ")}`}
                  >
                    <span className="fg-row-head">
                      <span className="fg-row-num">{num(i)}</span>
                      <span className="fg-row-name">{p.title}</span>
                    </span>
                    <span className="fg-row-detail">
                      <span className="fg-row-detail-in">
                        <span className="fg-row-desc">{p.oneliner}</span>
                        <span className="fg-row-meta">
                          <span className="fg-row-tags">{p.tags.join(" · ")}</span>
                          <span className="fg-row-cta cta cta--quiet">View Project</span>
                        </span>
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ol>
          </div>

          {/* right: the moon gate — a vertical film-strip that slides */}
          <div className="fg-right">
            <Link
              href={`/work/${ap.slug}`}
              className="fg-gate"
              aria-label={`View ${ap.title}`}
              tabIndex={-1}
              ref={gateRef}
            >
              <span className="fg-gate-inner">
                <span
                  className="fg-strip"
                  style={{ ["--active" as string]: active }}
                >
                  {list.map((p, i) => {
                    const isActive = i === active;
                    const hasMedia = Boolean(p.cover || p.previewVideo);
                    return (
                      <span className="fg-cell" key={p.slug}>
                        {hasMedia ? (
                          isActive && p.previewVideo ? (
                            <video
                              className="fg-video"
                              src={p.previewVideo}
                              poster={p.cover}
                              autoPlay
                              muted
                              loop
                              playsInline
                              preload="none"
                            />
                          ) : p.cover ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              className="fg-cover"
                              src={p.cover}
                              alt=""
                              loading={i <= 1 ? "eager" : "lazy"}
                              decoding="async"
                            />
                          ) : null
                        ) : (
                          <span className="fg-gate-plate">
                            <span className="fg-gate-plate-title">{p.title}</span>
                            <span className="fg-gate-plate-note">
                              Preview in development
                            </span>
                          </span>
                        )}
                      </span>
                    );
                  })}
                </span>
                <span className="fg-vignette" aria-hidden="true" />
                <span className="fg-dip" key={active} aria-hidden="true" />
                <span className="fg-ink-veil" ref={veilRef} aria-hidden="true" />
              </span>
              <span className="fg-gate-rim" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>

      {/* the lotus arrival — scenery for the scrubbed crossing; mounts only
          where the pin runs (desktop, motion-safe) */}
      {lotusOn ? <FgLotusLayer /> : null}

      <style
        dangerouslySetInnerHTML={{
          __html: `
        /* The ScrollTrigger pin-spacer otherwise swallows pointer events over
           the risen koi section after the crossing (the pond was unfeedable).
           The spacer goes transparent to events; the section re-enables its
           own until the crossing hands off (inline pointer-events past 85%). */
        .pin-spacer-fg-gate { pointer-events: none; }
        .pin-spacer-fg-gate > .fg-section { pointer-events: auto; }
        .fg-section {
          position: relative;
          /* the wall is painted by .fg-bg (a child) so the pond handoff can
             dissolve it; z-index keeps the pinned section above the koi
             section it overlaps during the crossing */
          background: transparent;
          z-index: 2;
          color: #141414;
          /* vh-elastic paddings: the whole composition must FIT one viewport
             while pinned — content below the fold is unreachable during a pin
             (the circle's bottom was getting cropped at short viewports) */
          padding-block: clamp(48px, 7vh, 172px);
          min-height: 100vh;
          display: flex; align-items: center;
          font-family: var(--font-text);
          overflow: hidden;
        }
        .fg-bg {
          position: absolute; inset: 0; z-index: 0;
          background: #ffffff;
        }
        .fg-shell {
          position: relative; z-index: 1;
          /* editorial shell that keeps widening on large / 32in screens so the
             section fills the viewport instead of stranding it in the middle */
          width: min(1800px, 100% - 2 * clamp(24px, 5vw, 140px));
          margin-inline: auto;
        }
        .fg-head {
          display: flex; flex-wrap: wrap; align-items: baseline;
          justify-content: space-between; gap: clamp(16px, 4vw, 60px);
          padding-bottom: clamp(10px, 1.6vh, 18px);
        }
        .fg-title {
          margin: 0;
          font-family: var(--font-condensed);
          font-size: clamp(56px, 8.8vw, 208px);
          font-weight: 300; line-height: 0.9; letter-spacing: var(--track-display);
          text-transform: uppercase; color: #141414;
        }

        .fg-main {
          display: grid;
          grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
          align-items: start;
          gap: clamp(32px, 5vw, 128px);
          padding-top: clamp(20px, 3.5vh, 84px);
        }

        /* ---- accordion index: big condensed names, active unfolds its story ---- */
        .fg-list { list-style: none; margin: 0; padding: 0; position: relative; }
        /* the seal-red tick that slides along the number gutter */
        .fg-tick {
          position: absolute; left: -16px; top: 0;
          width: 2px; height: 1.1em;
          background: var(--seal-red);
          transition: transform 0.6s var(--ease-silk), opacity 0.3s ease;
          pointer-events: none;
        }
        .fg-row { border-top: 1px solid rgba(15,16,20,0.1); }
        .fg-row:first-child { border-top: none; }
        .fg-row-link {
          display: block; text-decoration: none; color: inherit; outline: none;
          padding: clamp(9px, 1.3vh, 16px) 0;
          /* staggered entrance, driven by the section's is-revealed state */
          opacity: 0;
          transform: translateY(26px);
          transition:
            opacity 0.7s var(--ease-silk),
            transform 0.7s var(--ease-silk);
          transition-delay: calc(var(--row-i, 0) * 90ms);
        }
        .fg-section.is-revealed .fg-row-link {
          opacity: 1;
          transform: none;
        }
        .fg-row-head { display: grid; grid-template-columns: 2.4em 1fr; align-items: baseline; gap: 12px; }
        .fg-row-num {
          font-size: var(--text-meta); font-variant-numeric: tabular-nums;
          color: rgba(20,20,22,0.3);
          transition: color 0.35s var(--ease-silk);
        }
        .fg-row-name {
          font-family: var(--font-condensed);
          font-size: clamp(30px, 3.7vw, 78px);
          font-weight: 300; line-height: 1.0; letter-spacing: var(--track-display);
          text-transform: uppercase; color: rgba(20,20,22,0.32);
          transition: color 0.35s var(--ease-silk);
        }
        .fg-row.is-active .fg-row-num { color: var(--seal-red); }
        .fg-row.is-active .fg-row-name { color: #111; }
        .fg-row-link:focus-visible .fg-row-name { color: #111; }

        /* the story unfolds smoothly under the active title (grid 0fr → 1fr) */
        .fg-row-detail {
          display: grid; grid-template-rows: 0fr;
          margin-left: calc(2.4em + 12px);
          opacity: 0;
          transition: grid-template-rows 0.6s var(--ease-silk),
                      opacity 0.5s ease;
        }
        .fg-row.is-active .fg-row-detail { grid-template-rows: 1fr; opacity: 1; }
        .fg-row-detail-in { min-height: 0; overflow: hidden; padding-top: 12px; }
        .fg-row-desc {
          display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;
          max-width: 44ch;
          font-size: var(--text-body); line-height: 1.5; color: rgba(24,24,27,0.66);
        }
        .fg-row-meta {
          display: flex; align-items: baseline; justify-content: space-between; gap: 18px;
          margin-top: 14px; max-width: 44ch;
        }
        .fg-row-tags {
          font-size: var(--text-label); text-transform: uppercase; letter-spacing: 0.12em;
          color: rgba(20,20,22,0.5);
        }
        /* label chrome + seal-red rule come from .cta--quiet (globals.css);
           only the row-level hover trigger is local — the wipe fires when the
           whole row is hovered, not just the label */
        .fg-row-link:hover .fg-row-cta::after,
        .fg-row-link:focus-visible .fg-row-cta::after { transform: scaleX(1); }

        .fg-left { min-width: 0; }
        /* the All Work CTA (global .cta--line) parks in the top-right corner,
           dropped to the big title's baseline */
        .fg-allwork { flex: none; align-self: baseline; }

        /* ---- the moon gate: a vertical film-strip clipped in a circle ---- */
        .fg-right { position: relative; display: flex; justify-content: flex-end; }
        .fg-gate {
          position: relative; display: block;
          /* diameter is capped by the viewport HEIGHT too — while pinned the
             circle must never hang below the fold (it can't be scrolled to) */
          width: min(clamp(380px, 40vw, 720px), calc(100vh - 290px));
          aspect-ratio: 1 / 1;
          margin-right: clamp(-56px, -3vw, 0px);
          border-radius: 50%; text-decoration: none; color: inherit;
          transform-origin: center;
        }
        .fg-gate-inner {
          position: absolute; inset: 0; border-radius: 50%; overflow: hidden; background: #101010;
        }
        .fg-strip {
          position: absolute; inset: 0;
          display: flex; flex-direction: column;
          /* selecting a lower item slides the strip up — follows the list */
          transform: translateY(calc(var(--active, 0) * -100%));
          /* visible up/down slide (follows the list), combined with the dip:
             the strip slides across the whole transition while a brief black
             passes over its midpoint */
          transition: transform 0.66s ease-in-out;
          will-change: transform;
        }
        .fg-cell {
          position: relative; flex: 0 0 100%; overflow: hidden;
          background: #0a0a0a;
        }
        /* the scene FILLS the round opening — you look through the gate, not
           at a mounted print. Slow breathe-in on hover. */
        .fg-cover, .fg-video {
          position: absolute; inset: 0;
          width: 100%; height: 100%;
          object-fit: cover; object-position: center;
          display: block;
          transition: transform 1.4s var(--ease-silk);
        }
        .fg-gate:hover .fg-cover,
        .fg-gate:hover .fg-video { transform: scale(1.035); }
        /* soft radial falloff so the rim always reads as a round opening */
        .fg-vignette {
          position: absolute; inset: 0; z-index: 2; pointer-events: none;
          background: radial-gradient(circle at 50% 50%,
            rgba(5,5,5,0) 56%, rgba(5,5,5,0.05) 72%, rgba(5,5,5,0.34) 100%);
        }
        /* switch = a slow, smooth dip through black, like a page transition */
        .fg-dip {
          position: absolute; inset: 0; z-index: 3; pointer-events: none;
          background: #060606; opacity: 0;
          animation: fgDip 0.7s ease-in-out;
        }
        @keyframes fgDip { 0% { opacity: 0; } 44% { opacity: 1; } 56% { opacity: 1; } 100% { opacity: 0; } }
        /* the ink the gate fills with as you pass through it (scroll zoom) */
        .fg-ink-veil {
          position: absolute; inset: 0; z-index: 4; pointer-events: none;
          background: #050505; opacity: 0;
        }
        /* a clean opening: a soft top recess + a hairline edge. No inner glow. */
        .fg-gate-rim {
          position: absolute; inset: 0; border-radius: 50%; pointer-events: none; z-index: 5;
          box-shadow:
            inset 0 0 0 1px rgba(15,16,20,0.16),
            0 18px 56px rgba(15,16,20,0.12);
        }
        .fg-gate-plate {
          position: absolute; inset: 0;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          gap: 14px;
          background: radial-gradient(circle at 44% 40%, #242424 0%, #151515 62%, #0d0d0d 100%);
        }
        .fg-gate-plate-title {
          font-family: var(--font-condensed);
          font-size: clamp(40px, 4.4vw, 84px);
          font-weight: 300; line-height: 1; letter-spacing: var(--track-display);
          text-transform: uppercase; color: rgba(255,255,255,0.82);
        }
        .fg-gate-plate-note {
          font-size: var(--text-label); text-transform: uppercase; letter-spacing: 0.24em;
          color: rgba(255,255,255,0.42);
        }

        @media (max-width: 900px) {
          .fg-main { grid-template-columns: 1fr; gap: clamp(30px, 6vh, 52px); padding-top: clamp(30px, 5vh, 52px); }
          .fg-right { order: -1; justify-content: center; }
          .fg-gate { width: min(72vw, 400px); margin-right: 0; }
          .fg-tick { display: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          .fg-strip, .fg-row-num, .fg-row-name, .fg-row-detail,
          .fg-row-cta::after, .fg-tick, .fg-cover, .fg-video,
          .fg-row-link { transition: none; animation: none; }
          .fg-dip { animation: none; }
          .fg-gate:hover .fg-cover, .fg-gate:hover .fg-video { transform: none; }
          .fg-row-link { opacity: 1; transform: none; }
        }
      `,
        }}
      />
    </section>
  );
}
