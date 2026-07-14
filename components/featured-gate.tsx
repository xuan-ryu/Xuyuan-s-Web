"use client";

// Garden Window — an editorial index whose preview fills a wide opening
// in the #fff plaster wall beneath the eaves.
//
// Left: a compact index of condensed-uppercase project names (skill's "work
// index list mode", seal-red active mark). Resting on a name unfolds its story;
// a seal-red tick slides along the number gutter to the active row.
// Right: the garden window holds a vertical film-strip of the covers; selecting
// slides the strip up/down inside a horizontal octagonal silhouette. Its
// 16:10 field keeps wide product recordings legible without losing the garden
// language of an opening cut through a white plaster wall.
//
// Scroll choreography (desktop, motion-safe): browsing the index is HOVER
// only (owner decision — scroll-driven index switching read as noise). The
// section pins for ~2.7 viewports and scroll owns just the crossing: past a
// short runway the window scales until the opening swallows the viewport
// and sinks to ink; lotus leaves then condense over the ink (the ink is now
// the pond's water) until the viewport is covered; continued scroll parts
// the pads outward from the center; at the very end the crossing layer and
// last chrome dissolve and the
// koi section (pulled up -100vh so it waits right behind) has risen into
// place — one flick passes through the window, through the lotus, onto
// the pond; an up-flick folds the leaves shut and restores the wall (the
// whole arrival is scrubbed, nothing is time-driven). Reduced-motion /
// mobile keep the plain stacked layout, where an idle timer walks the index
// instead (touch has no hover) and the lotus layer never mounts.
//
// English copy, Arabic numerals, one seal-red accent. Prefix fg-.
//
// Does NOT own the koi section or the lotus pad geometry: it only toggles
// classes / a -100vh margin on .home-koi-section, and pad coordinates come
// from fg-lotus-layer's shared LOTUS_PADS. All scoped styling is one template
// literal near the end (comments stripped at injection via stripCssComments)
// — keep section banners outside that literal.

import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { Project } from "@/data/projects";
import { Cta } from "@/components/ui/cta";
import { FgLotusLayer, LOTUS_PADS } from "@/components/fg-lotus-layer";
import { scrollTo, subscribeScrollFrame } from "@/lib/scroll-behavior";
import { stripCssComments } from "@/lib/css-sanitize";

/* ---- window geometry and focal crops ---- */
const FEATURED = 4;
// One path owns both the HTML clip and the drawn frame. The horizontal
// octagon follows the dominant 16:9 preview format without becoming a generic
// screen.
const GARDEN_WINDOW_PATH =
  "M 100 0 H 900 L 1000 100 V 525 L 900 625 H 100 L 0 525 V 100 Z";

// The wide opening already preserves UI context, so focal zoom now only
// removes capture bars or excess margins.
const FOCAL: Record<
  string,
  { scale: number; x: string; y: string; pos?: string }
> = {
  pulse: { scale: 1.04, x: "44%", y: "48%" },
  // The source recording has side capture bars; a slight scale clears them.
  "vicino-ai": { scale: 1.08, x: "50%", y: "58%" },
  // The source has a baked-in top bar; keep a stronger, lower-origin crop.
  "froghire-ai": { scale: 1.28, x: "45%", y: "66%", pos: "left center" },
};
/* ---- crossing timeline constants ---- */
// the pin + lotus layer run only here; the same query gates the layer mount
const CROSSING_MEDIA =
  "(min-width: 901px) and (prefers-reduced-motion: no-preference)";
// ── crossing fraction map (of the 270% pin) ──
// The pin grew 200% → 270% for the lotus arrival; runway/zoom/ink keep their
// old ABSOLUTE scroll lengths (0.12 of 200% → 0.09 of 270%, etc.) so the
// approach feels identical — the added travel is all arrival.
const PIN_END = "+=270%";
// Net document height the crossing adds once GSAP builds it: the pin spacer
// grows the section by PIN_END (% of viewport) while the same setup pulls the
// koi section up 100vh. Reserved up front by the .fg-prepin placeholder so
// slow machines don't shift deep-link / early-scroll visitors when the pin
// lands (270vh − 100vh = 170vh ≈ a 1632px jump at a 960px viewport).
const PIN_NET_VH = parseFloat(PIN_END.replace(/[^\d.]/g, "")) - 100;
const ZOOM_START = 0.09; // short runway so the pin doesn't feel grabby
const ZOOM_END = 0.37; // gate fully scaled by here (hidden under full ink)
const INK_AT = 0.13;
const INK_DUR = 0.18;
// the canopy assembles over the water, holds, then parts to the koi frame.
// A wide LEAF_IN_SPREAD gives the arrival an audible rhythm (diagonal sweep);
// PART is center-out so the middle opens first.
// the phases OVERLAP — water glow rises while the ink is still filling the
// gate, and the first raindrop pads land before the ink is even complete, so
// there is never a stretch of empty black between the gate and the pond
const LEAF_IN = 0.22; // first raindrops, while the gate is still zooming
const LEAF_IN_SPREAD = 0.13; // raindrop scatter window
const LEAF_IN_DUR = 0.13;
// canopy complete ~0.48; a long hold (0.48 → 0.58) lets the covered pond
// register before the part opens it centre-out; the last pad lands by 0.90,
// just before the crossing dissolves at 0.91
const PART_AT = 0.58;
const PART_STAGGER = 0.11;
const PART_DUR = 0.21;
// The koi frame crossfades in at 0.92 while the crossing dissolves at 0.91.
// The two now share identical pad positions, so the overlap is a clean
// crossfade (not the old doubled/offset ghost that forced a hard gap).
const FADE_AT = 0.945; // ink + wall dissolve over the (by now) risen pond
const SNAP_FREE = 0.13; // below this progress there is no snap — rest and read

/* ---- featured gate component ---- */
export function FeaturedGate({
  projects,
  continuationText,
}: {
  projects: readonly Project[];
  continuationText: string;
}) {
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
  // pre-pin height placeholder (sibling AFTER the section, never re-rendered
  // by React state, so the imperative class toggle below can't be wiped)
  const prepinRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLSpanElement>(null);
  const gateRef = useRef<HTMLAnchorElement>(null);
  const veilRef = useRef<HTMLSpanElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
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

  /* ---- seal-red tick effect ---- */
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

  /* ---- window height sync effect ---- */
  // Keep the preview window locked to the full height of the editorial index.
  // The detail well below is fixed-height, so project changes no longer feed
  // a different measurement back into the centred section layout.
  useEffect(() => {
    const listEl = listRef.current;
    const gateEl = gateRef.current;
    if (!listEl || !gateEl) return;

    const syncWindowToList = () => {
      const listHeight = Math.ceil(listEl.getBoundingClientRect().height / 2) * 2;
      const windowWidth = Math.round((listHeight * 1.5) / 2) * 2;
      gateEl.style.setProperty("--fg-list-height", `${listHeight}px`);
      gateEl.style.setProperty("--fg-window-width", `${windowWidth}px`);
    };

    syncWindowToList();
    const observer = new ResizeObserver(syncWindowToList);
    observer.observe(listEl);
    return () => observer.disconnect();
  }, []);

  /* ---- lotus layer mount effect ---- */
  // ── mount/unmount the lotus layer with the same media boundary as the pin ──
  useEffect(() => {
    const mq = window.matchMedia(CROSSING_MEDIA);
    const update = () => setLotusOn(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  /* ---- scroll choreography effect ---- */
  // ── scroll choreography: pin + beats + through-the-gate zoom + lotus
  //    arrival. Re-runs when the lotus layer (un)mounts so the timeline is
  //    always built against the DOM it will actually drive. ──
  useEffect(() => {
    let cancelled = false;
    let mm: ReturnType<typeof import("gsap").default.matchMedia> | null = null;
    let unsubscribeScroll: (() => void) | null = null;

    (async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      // The Scroll Behaviour Interface supplies the post-update frame. Native
      // scroll events are one frame stale while smooth scrolling is active.
      unsubscribeScroll = subscribeScrollFrame(ScrollTrigger.update);

      mm = gsap.matchMedia();
      mm.add(
        CROSSING_MEDIA,
        () => {
          const section = sectionRef.current;
          const gate = gateRef.current;
          const veil = veilRef.current;
          const bg = bgRef.current;
          const koiSection =
            document.querySelector<HTMLElement>(".home-koi-section");
          if (!section || !gate || !veil || !bg) return;
          pinnedRef.current = true;
          koiSection?.classList.remove("koi-lotus-visible");

          // hand the reserved height over to the real pin: the ScrollTrigger
          // below creates its pin spacer in this same synchronous block, so
          // consuming the placeholder here never paints a collapsed state
          prepinRef.current?.classList.add("is-consumed");

          // pull the koi section up one viewport so it waits right behind the
          // pinned gate — the final pin stretch is the pond rising into place
          // while the ink dissolves (gsap.matchMedia reverts this on cleanup).
          // The pinned section paints above it via .fg-section { z-index: 2 }.
          gsap.set(".home-koi-section", { marginTop: "-100vh" });

          // Scale the wide opening until its bounds cover every viewport edge.
          // This works from the window's actual asymmetric grid position.
          const coverScale = () => {
            const rect = gate.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const halfWidth = gate.offsetWidth / 2;
            const halfHeight = gate.offsetHeight / 2;
            const xScale =
              Math.max(centerX, window.innerWidth - centerX) / halfWidth;
            const yScale =
              Math.max(centerY, window.innerHeight - centerY) / halfHeight;
            // Carry the angled sides beyond the viewport before the ink veil
            // starts to dissolve.
            return Math.max(xScale, yScale) * 1.16;
          };

          /* ---- crossing snap glide ---- */
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
            if (snapGliding) return;
            const p = self.progress;
            if (p <= SNAP_FREE || p >= 0.999) return;
            // hysteresis: scrolling down always completes to the pond, but
            // scrolling up only rides back to the wall from a COMMITTED drag
            // (p < 0.9). A casual up-flick right after landing re-settles
            // onto the pond instead of yanking the visitor back through the
            // whole crossing.
            const target = self.direction >= 0 || p > 0.9 ? 1 : 0;
            // land a beat PAST the pin end so the pond is fully seated and
            // the resting position isn't flush against the crossing boundary
            // (12vh — deep enough not to slide back, shallow enough that the
            // pond's first-fold content, e.g. the How-I-Work title, stays in
            // view)
            const y =
              target === 1
                ? self.end + Math.round(window.innerHeight * 0.12)
                : self.start;
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
            const started = scrollTo(y, {
              duration,
              easing: easeInOut,
              fallback: "none",
              onComplete: () => {
                snapGliding = false;
              },
            });
            if (!started) {
              window.clearTimeout(snapClear);
              snapGliding = false;
            }
          };

          /* ---- pin timeline beats ---- */
          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              id: "fg-gate",
              trigger: section,
              start: "top top",
              end: PIN_END,
              pin: true,
              // transform-based pinning: the position:fixed flip at pin
              // start/end registered as two full-viewport layout shifts
              // (CLS 1.0 + 0.89 — the whole "Poor 1.06" Speed Insights
              // score); transforms are exempt from layout-shift accounting
              pinType: "transform",
              scrub: 0.6,
              invalidateOnRefresh: true,
              onUpdate(self) {
                const p = self.progress;
                bg.style.backgroundColor =
                  p >= LEAF_IN - 0.02 ? "#020305" : "#ffffff";
                // once the ink starts dissolving, the (transparent) fixed
                // section must stop swallowing the pond's pointer events
                section.style.pointerEvents = p > 0.85 ? "none" : "";
                // the continuation cue bows out with the index as the zoom
                // starts. Class-driven (NOT a tween): GSAP would record the
                // cue's pre-reveal opacity 0 as the tween start and pin it
                // invisible forever.
                hintRef.current?.classList.toggle(
                  "is-hidden",
                  p >= ZOOM_START,
                );
                // The static koi-lotus frame crossfades in at 0.92 as the
                // crossing dissolves (0.91). They share identical pad
                // positions now, so this overlap is a seamless crossfade.
                koiSection?.classList.toggle("koi-lotus-visible", p >= 0.92);
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
            // the white wall goes to the pond-ink color BEHIND the still-
            // opaque ink veil (invisible now) so that when the wall dissolves
            // the koi emerge from dark-over-dark, never through a fading white
            // sheet (that white sheet was washing the near-black koi to a
            // milky gray). Black #020305 matches the koi section's own ink so
            // the handoff is seamless. Reverts below 0.90 on up-scroll.
            .to(bg, { backgroundColor: "#020305", duration: 0.04 }, LEAF_IN - 0.02)
            // the handoff: ink (and the now-dark wall) dissolve at the very
            // end, after the crossing layer is gone and the koi section has
            // risen behind — autoAlpha so the faded layers also stop
            // hit-testing. Until then the ink veil IS the pond surface the
            // lotus pads sit on.
            .to([bg, gate], { autoAlpha: 0, duration: 0.05 }, FADE_AT);

          /* ---- lotus arrival tweens ---- */
          // Lotus arrival: clusters condense over the ink, the edge blossom
          // opens, then the whole pond field parts from the center.
          const layer = section.querySelector<HTMLElement>(".fgl-layer");
          if (layer) {
            // the pond water rises WITH the ink (not after it) — by the time
            // the gate is fully swallowed the water glow is already there, so
            // the crossing never sits on an empty black frame
            const water = layer.querySelector<HTMLElement>(".fgl-water");
            if (water) {
              gsap.set(water, { opacity: 0 });
              tl.to(water, { opacity: 1, duration: 0.16 }, INK_AT + 0.03);
            }
            const clusters = gsap.utils.toArray<HTMLElement>(
              ".fgl-cluster",
              layer,
            );
            clusters.forEach((el, i) => {
              const pad = LOTUS_PADS[i];
              if (!pad) return;
              // each pad's resting/home position IS its koi-frame slot; the
              // canopy is one transform away. dx/dy = cover offset (px) from
              // that home, coverScale = cover/frame size ratio.
              const dx = () => ((pad.cx - pad.fx) / 100) * window.innerWidth;
              const dy = () => ((pad.cy - pad.fy) / 100) * window.innerHeight;
              // over-size the peak canopy so the seams between pads stay
              // closed — the jittered layout leaves slivers at 1.0
              const coverScale = (pad.csize * 1.16) / pad.fsize;
              // arrival cadence: raindrop scatter — each pad pops in at its
              // own random moment across the pond (pad.rain), like the first
              // cut of this animation. Part cadence stays center-out (pads
              // nearest the pool centre part first, so the middle opens).
              const inOrder = pad.rain;
              const partOrder = Math.hypot(pad.cx - 50, pad.cy - 42) / 72;

              gsap.set(el, {
                xPercent: -50,
                yPercent: -50,
                x: dx,
                y: dy,
                // lands with a slight settling twist (−14° -> crot), so the
                // arrival reads organic rather than stamped in place
                rotation: pad.crot - 14,
                // a raindrop starts small — the pop from ~half size is what
                // sells the landing (the first cut used 0.56)
                scale: coverScale * 0.55,
                opacity: 0,
                transformOrigin: "50% 50%",
              });
              // assemble the canopy: each pad lands like a raindrop — a quick
              // grow-in with a slight overshoot settle, at scattered moments,
              // until the pads blanket the whole viewport
              tl.to(
                el,
                {
                  x: dx,
                  y: dy,
                  rotation: pad.crot,
                  scale: coverScale,
                  opacity: 1,
                  duration: LEAF_IN_DUR,
                  ease: "back.out(1.4)",
                },
                LEAF_IN + inOrder * LEAF_IN_SPREAD,
              );
              // part the canopy center -> both sides, back to the koi-frame
              // home. Landing at scale 1 / rotation frot / opacity fop makes
              // this pad identical to its KoiLotusFrame twin.
              tl.to(
                el,
                {
                  x: 0,
                  y: 0,
                  rotation: pad.frot,
                  scale: 1,
                  opacity: pad.fopacity,
                  duration: PART_DUR,
                  ease: "power2.inOut",
                },
                PART_AT + partOrder * PART_STAGGER,
              );
            });
            // the crossing layer dissolves as the identical KoiLotusFrame
            // crossfades in (0.92) at the very same positions — a seamless
            // handoff, since both are the same pads in the same coordinates.
            tl.to(layer, { autoAlpha: 0, duration: 0.04 }, 0.91);
          }

          return () => {
            pinnedRef.current = false;
            prepinRef.current?.classList.remove("is-consumed");
            section.style.pointerEvents = "";
            bg.style.backgroundColor = "";
            hintRef.current?.classList.remove("is-hidden");
            koiSection?.classList.remove("koi-lotus-visible");
            window.clearTimeout(idleTimer);
            window.clearTimeout(snapClear);
          };
        },
      );
    })();

    return () => {
      cancelled = true;
      mm?.revert();
      unsubscribeScroll?.();
    };
    // lotusOn: rebuild once the lotus layer's DOM is mounted (or gone)
  }, [lotusOn]);

  /* ---- entrance reveal effect ---- */
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

  /* ---- idle auto advance effect ---- */
  // ── idle auto-advance — only where the pin doesn't run (mobile), so touch
  //    users still see all four projects; pauses after any interaction ──
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const section = sectionRef.current;
    const cue = hintRef.current;
    if (!section) return;
    let inView = false;
    const io = new IntersectionObserver(
      (entries) => {
        inView = !!entries[0]?.isIntersecting;
        cue?.classList.toggle("is-section-visible", inView);
      },
      { threshold: 0.35 },
    );
    io.observe(section);
    const id = reduceMotion ? undefined : window.setInterval(() => {
      if (!inView || pinnedRef.current || document.hidden) return;
      if (holdTicksRef.current > 0) {
        holdTicksRef.current -= 1;
        return;
      }
      setActive((a) => (a + 1) % FEATURED);
    }, 4800);
    return () => {
      io.disconnect();
      cue?.classList.remove("is-section-visible");
      if (id !== undefined) window.clearInterval(id);
    };
  }, []);

  /* ---- section markup ---- */
  return (
    <>
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

          {/* right: the garden window — a vertical film-strip that slides */}
          <div className="fg-right">
            <Link
              href={`/work/${ap.slug}`}
              className="fg-gate"
              aria-label={`View ${ap.title}`}
              tabIndex={-1}
              ref={gateRef}
            >
              <svg
                className="fg-window-defs"
                width="0"
                height="0"
                aria-hidden="true"
              >
                <defs>
                  <clipPath
                    id="fg-garden-window-clip"
                    clipPathUnits="objectBoundingBox"
                  >
                    <path
                      d={GARDEN_WINDOW_PATH}
                      transform="scale(0.001 0.0016)"
                    />
                  </clipPath>
                </defs>
              </svg>
              <span className="fg-gate-reveal" aria-hidden="true" />
              <span className="fg-gate-inner">
                <span
                  className="fg-strip"
                  style={{ ["--active" as string]: active }}
                >
                  {list.map((p, i) => {
                    const isActive = i === active;
                    const hasMedia = Boolean(p.cover || p.previewVideo);
                    const focal = FOCAL[p.slug];
                    return (
                      <span
                        className="fg-cell"
                        key={p.slug}
                        style={
                          focal
                            ? ({
                                ["--fg-zoom" as string]: focal.scale,
                                ["--fg-origin" as string]: `${focal.x} ${focal.y}`,
                                ...(focal.pos
                                  ? { ["--fg-pos" as string]: focal.pos }
                                  : null),
                              } as CSSProperties)
                            : undefined
                        }
                      >
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
                <span className="fg-dip" key={active} aria-hidden="true" />
                <span className="fg-ink-veil" ref={veilRef} aria-hidden="true" />
              </span>
              <svg
                className="fg-gate-rim"
                viewBox="0 0 1000 625"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path
                  className="fg-gate-rim-frame"
                  d={GARDEN_WINDOW_PATH}
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* the lotus arrival — scenery for the scrubbed crossing; mounts only
          where the pin runs (desktop, motion-safe) */}
      {lotusOn ? <FgLotusLayer /> : null}

      {/* ---- scoped gate css ---- */}
      <style
        dangerouslySetInnerHTML={{
          __html: stripCssComments(`
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
          font-size: clamp(56px, 7.4vw, 168px);
          font-weight: 300; line-height: 0.9; letter-spacing: var(--track-display);
          text-transform: uppercase; color: #141414;
        }

        .fg-main {
          display: grid;
          grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
          align-items: start;
          gap: clamp(52px, 6vw, 132px);
          padding-top: clamp(34px, 4.5vh, 68px);
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
          padding: clamp(11px, 1.5vh, 18px) 0;
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
        .fg-title, .fg-allwork {
          opacity: 0;
          transform: translateY(26px);
          transition: opacity 0.7s var(--ease-silk), transform 0.7s var(--ease-silk);
        }
        .fg-allwork { transition-delay: 120ms; }
        .fg-section.is-revealed .fg-title,
        .fg-section.is-revealed .fg-allwork {
          opacity: 1;
          transform: none;
        }
        .fg-row-head { display: grid; grid-template-columns: 2.4em 1fr; align-items: baseline; gap: 16px; }
        .fg-row-num {
          font-size: var(--text-meta); font-variant-numeric: tabular-nums;
          color: rgba(20,20,22,0.3);
          transition: color 0.35s var(--ease-silk);
        }
        .fg-row-name {
          font-family: var(--font-condensed);
          font-size: clamp(30px, 3.25vw, 68px);
          font-weight: 300; line-height: 1.0; letter-spacing: var(--track-display);
          text-transform: uppercase; color: rgba(20,20,22,0.32);
          transition: color 0.35s var(--ease-silk);
        }
        .fg-row.is-active .fg-row-num { color: var(--seal-red); }
        .fg-row.is-active .fg-row-name { color: #111; }
        .fg-row-link:focus-visible .fg-row-name { color: #111; }

        /* the story unfolds smoothly under the active title (grid 0fr → 1fr) */
        .fg-row-detail {
          display: grid; grid-template-rows: 0px;
          margin-left: calc(2.4em + 16px);
          opacity: 0;
          transition: grid-template-rows 0.6s var(--ease-silk),
                      opacity 0.5s ease;
        }
        .fg-row.is-active .fg-row-detail { grid-template-rows: 156px; opacity: 1; }
        .fg-row-detail-in { min-height: 0; overflow: hidden; padding-top: 14px; }
        .fg-row-desc {
          display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;
          max-width: 48ch;
          font-size: var(--text-body); line-height: 1.55; color: rgba(24,24,27,0.66);
        }
        .fg-row-meta {
          display: flex; align-items: baseline; justify-content: space-between; gap: 18px;
          margin-top: 16px; max-width: 48ch;
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

        /* ---- the wide garden window: a 3:2 sliding film-strip ---- */
        .fg-right { position: relative; display: flex; justify-content: flex-end; }
        .fg-gate {
          position: relative; display: block;
          /* Width is derived from the measured list height, then capped by
             the 7-column field and the pinned viewport. */
          width: min(var(--fg-window-width, 760px), 840px, calc((100vh - 300px) * 1.5));
          aspect-ratio: 3 / 2;
          margin-right: clamp(-56px, -3vw, 0px);
          text-decoration: none; color: inherit;
          transform-origin: center;
        }
        .fg-window-defs { position: absolute; width: 0; height: 0; overflow: hidden; }
        .fg-gate-reveal {
          position: absolute; inset: 0;
          clip-path: url(#fg-garden-window-clip);
          background: #f7f7f5;
        }
        .fg-gate-inner {
          position: absolute; inset: clamp(7px, 0.65vw, 11px);
          overflow: hidden; background: var(--ink-900);
          clip-path: url(#fg-garden-window-clip);
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
           at a mounted print. Slow breathe-in on hover.
           --fg-zoom / --fg-origin (set per project on .fg-cell) crop the view
           to a legible detail instead of a full unreadable screenshot. */
        .fg-cover, .fg-video {
          position: absolute; inset: 0;
          width: 100%; height: 100%;
          object-fit: cover; object-position: var(--fg-pos, center);
          display: block;
          transform-origin: var(--fg-origin, 50% 50%);
          /* focal zooms are tuned for ~1440 viewports; on wide screens the
             opening itself is huge and the same crop upscales a 1280w clip
             into blur (owner bug, 2560) — cap the zoom there */
          transform: scale(min(var(--fg-zoom, 1), var(--fg-cap, 10)));
          transition: transform 1.4s var(--ease-silk);
        }
        .fg-gate:hover .fg-cover,
        .fg-gate:hover .fg-video { transform: scale(calc(min(var(--fg-zoom, 1), var(--fg-cap, 10)) * 1.035)); }
        @media (min-width: 1920px) {
          .fg-cell { --fg-cap: 1.2; }
        }
        /* switch = a slow, smooth dip through black, like a page transition */
        .fg-dip {
          position: absolute; inset: 0; z-index: 3; pointer-events: none;
          background: #060606; opacity: 0;
          animation: fgDip 0.7s ease-in-out;
        }
        @keyframes fgDip { 0% { opacity: 0; } 44% { opacity: 1; } 56% { opacity: 1; } 100% { opacity: 0; } }
        /* the pond ink the gate fills with as you pass through it (scroll
           zoom) — the same black as the koi section (#020305), so crossing
           the gate lands you in the pond's own night water */
        .fg-ink-veil {
          position: absolute; inset: 0; z-index: 4; pointer-events: none;
          background: #020305; opacity: 0;
        }
        /* The SVG repeats the clip path exactly. The black outer frame alone
           carries the silhouette; the opening stays clean and unembellished. */
        .fg-gate-rim {
          position: absolute; inset: 0; width: 100%; height: 100%;
          pointer-events: none; z-index: 5; overflow: visible;
          fill: none;
          filter: drop-shadow(0 14px 24px rgba(15,16,20,0.12));
        }
        .fg-gate-rim-frame {
          stroke: var(--ink-950); stroke-width: clamp(8px, 0.7vw, 12px);
          stroke-linejoin: miter;
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

        /* ---- continuation cue: mono micro-line + slow ink-drip hairline ---- */
        .fg-continue {
          position: fixed;
          left: 50%;
          bottom: clamp(30px, 4.8vh, 58px);
          transform: translateX(-50%);
          z-index: 3;
          display: flex;
          align-items: center;
          gap: 14px;
          font-family: var(--font-mono);
          font-size: clamp(10px, 0.68vw, 12px);
          line-height: 1;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          white-space: nowrap;
          color: rgba(20, 20, 22, 0.68);
          opacity: 0;
          transition: opacity 0.65s var(--ease-silk) 0.12s;
          pointer-events: none;
        }
        .fg-continue.is-section-visible { opacity: 1; }
        /* crossing under way — get out of the way fast (no reveal delay) */
        .fg-continue.is-hidden {
          opacity: 0;
          transition-duration: 0.3s;
          transition-delay: 0s;
        }
        /* the drip: a quiet hairline down which a seal-red bead slides */
        .fg-continue-drop {
          position: relative;
          width: 1px;
          height: 30px;
          overflow: hidden;
          background: rgba(20, 20, 22, 0.28);
        }
        .fg-continue-drop::after {
          content: "";
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 38%;
          background: var(--seal-red);
          transform: translateY(-110%);
          animation: fgContinueDrip 2.8s cubic-bezier(0.45, 0, 0.3, 1) infinite;
        }
        @keyframes fgContinueDrip {
          0% { transform: translateY(-110%); }
          58% { transform: translateY(230%); }
          100% { transform: translateY(230%); }
        }

        /* pre-pin height placeholder — display gated by the SAME boundary as
           the crossing pin (CROSSING_MEDIA), height derived from PIN_END */
        .fg-prepin { display: none; }
        @media (min-width: 901px) and (prefers-reduced-motion: no-preference) {
          .fg-prepin { display: block; height: ${PIN_NET_VH}vh; background: #020305; }
          .fg-prepin.is-consumed { display: none; }
        }
        /* no JS -> no pin will ever consume it: don't strand 170vh of black */
        @media (scripting: none) {
          .fg-prepin { display: none !important; }
        }

        @media (max-width: 900px) {
          .fg-main { grid-template-columns: 1fr; gap: clamp(30px, 6vh, 52px); padding-top: clamp(30px, 5vh, 52px); }
          .fg-right { order: -1; justify-content: center; }
          .fg-gate { width: min(84vw, 560px); margin-right: 0; }
          .fg-row.is-active .fg-row-detail { grid-template-rows: 208px; }
          .fg-tick { display: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          .fg-strip, .fg-row-num, .fg-row-name, .fg-row-detail,
          .fg-row-cta::after, .fg-tick, .fg-cover, .fg-video,
          .fg-row-link { transition: none; animation: none; }
          .fg-dip { animation: none; }
          /* keep the per-project focal zoom; only the hover breathe stops */
          .fg-gate:hover .fg-cover,
          .fg-gate:hover .fg-video { transform: scale(var(--fg-zoom, 1)); }
          .fg-row-link { opacity: 1; transform: none; }
          .fg-continue { transition: none; }
          .fg-continue.is-section-visible { opacity: 1; }
          .fg-continue-drop::after { animation: none; transform: translateY(0); }
        }
      `),
        }}
      />
    </section>
    {/* viewport-level continuation cue: visible only while Selected Work is
        in view, then dismissed as soon as the garden-window crossing begins */}
    <div className="fg-continue" ref={hintRef} aria-hidden="true">
      <span className="fg-continue-drop" />
      <span className="fg-continue-text">{continuationText}</span>
    </div>
    {/* pre-pin placeholder: reserves the net scroll distance the crossing
        will add, only where the pin actually runs (same media boundary);
        consumed the moment the ScrollTrigger's own pin spacer exists */}
    <div ref={prepinRef} className="fg-prepin" aria-hidden="true" />
    </>
  );
}
