"use client";

import { useState } from "react";
import Image from "next/image";

// Nyma case page — the two hands-on specimens. Styles live in the page's
// scoped <style> (nyma-case-layout.tsx); these components only carry state.
// Both render a complete, sensible default without any interaction (the
// chosen direction / the blue role), per the final-state markup contract.

/* ── 1 · The direction board ─────────────────────────────────────────────
   Four brand directions the AI drafted as conversation material (deck slide
   23). Clicking a tab re-voices the same platform surface. "Archival" is the
   default — the direction that (blended with editorial pacing) shipped. */

const DIRECTIONS = [
  {
    key: "editorial",
    label: "Editorial",
    sample: "The season, re-read.",
    voice:
      "Writes like a fashion magazine — opinionated spreads, credited looks, a strong authored voice.",
    traits: ["cover stories", "lookbooks", "voice-led"],
    verdict: "seductive — but the platform starts upstaging the objects",
    chosen: false,
  },
  {
    key: "archival",
    label: "Archival",
    sample: "Lot 024 — Birkin 30, Togo Noir.",
    voice:
      "Reads like a catalogue raisonné — numbered, provenanced, quiet. The system recedes; the objects carry.",
    traits: ["lot numbers", "condition", "provenance"],
    verdict: "closest to the thread — this is the structure that shipped",
    chosen: true,
  },
  {
    key: "transactional",
    label: "Transactional",
    sample: "Up to 70% off — today only.",
    voice:
      "Optimizes like a marketplace — urgency, discount badges, volume over story.",
    traits: ["deals", "badges", "countdowns"],
    verdict: "efficient — and exactly what Nyma must not feel like",
    chosen: false,
  },
  {
    key: "fashion",
    label: "Fashion-forward",
    sample: "Wear the archive.",
    voice:
      "Performs like a brand — campaign-first, style expression over structure.",
    traits: ["campaigns", "drops", "statement type"],
    verdict: "loud — the vintage crowd stops feeling invited",
    chosen: false,
  },
] as const;

export function NymaDirections() {
  const [active, setActive] = useState<(typeof DIRECTIONS)[number]["key"]>(
    "archival",
  );
  const dir = DIRECTIONS.find((d) => d.key === active) ?? DIRECTIONS[1];

  return (
    <div className="ny-dir">
      {/* plain button group, not tabs: there's no arrow-key management here,
          so role="tab" semantics would promise more than they deliver
          (2026-07-08 a11y audit) */}
      <div className="ny-dir-tabs" role="group" aria-label="Brand directions">
        {DIRECTIONS.map((d) => (
          <button
            key={d.key}
            type="button"
            aria-pressed={d.key === active}
            className={`ny-dir-tab${d.key === active ? " is-on" : ""}`}
            onClick={() => setActive(d.key)}
          >
            {d.label}
            {d.chosen && <i aria-hidden="true" />}
          </button>
        ))}
      </div>
      <div className="ny-dir-stage">
        {/* each direction renders as its OWN art direction — the point is
            that the four drafts LOOK like four different platforms */}
        <div className={`ny-dir-mock is-${dir.key}`} aria-hidden="true">
          {dir.key === "editorial" && (
            <div className="dm-ed">
              <header>
                <i />
                <span>NYMA</span>
                <em>the resale review · issue 04</em>
                <i />
              </header>
              <p className="dm-ed-head">The season, re&#8209;read.</p>
              <div className="dm-ed-media">
                <Image
                  src="/media/work/nyma/item-editorial.png"
                  fill
                  sizes="56vw"
                  alt=""
                />
                <em>the red look, re-listed — photographed for nyma</em>
              </div>
            </div>
          )}
          {dir.key === "archival" && (
            <div className="dm-ar">
              <header>
                <span>LOT 024 · HERMÈS</span>
                <span>SQUARE Q · 2013</span>
              </header>
              <div className="dm-ar-obj">
                <Image
                  src="/media/work/nyma/item-luxury.png"
                  width={368}
                  height={490}
                  alt=""
                  sizes="180px"
                />
              </div>
              <p className="dm-ar-title">Birkin 30 — floral, palladium</p>
              <dl>
                <div>
                  <dt>condition</dt>
                  <dd>excellent — corners clean</dd>
                </div>
                <div>
                  <dt>provenance</dt>
                  <dd>single owner · receipts</dd>
                </div>
                <div>
                  <dt>reserve</dt>
                  <dd>met · 12 bids</dd>
                </div>
              </dl>
            </div>
          )}
          {dir.key === "transactional" && (
            <div className="dm-tx">
              <div className="dm-tx-bar">
                UP TO 70% OFF · TODAY ONLY · FREE SHIPPING OVER $50 · NEW
                DROPS DAILY
              </div>
              <div className="dm-tx-grid">
                {[
                  ["-40%", "$2,250", "$1,350", "item-tx1"],
                  ["-55%", "$680", "$306", "item-tx2"],
                  ["-30%", "$1,120", "$784", "item-tx3"],
                  ["-70%", "$430", "$129", "item-tx4"],
                ].map(([off, was, now, img]) => (
                  <div key={off}>
                    <span className="dm-tx-ph">
                      <Image
                        src={`/media/work/nyma/${img}.png`}
                        fill
                        sizes="150px"
                        alt=""
                      />
                    </span>
                    <b>{off}</b>
                    <span>
                      <s>{was}</s> {now}
                    </span>
                  </div>
                ))}
              </div>
              <span className="dm-tx-cta">SHOP ALL DEALS →</span>
            </div>
          )}
          {dir.key === "fashion" && (
            <div className="dm-fw">
              <span className="dm-fw-img">
                <Image
                  src="/media/work/nyma/item-fashion.png"
                  fill
                  sizes="56vw"
                  alt=""
                />
              </span>
              <span className="dm-fw-nav">NYMA — FW26 CAMPAIGN</span>
              <p className="dm-fw-head">
                WEAR
                <br />
                THE
                <br />
                ARCHIVE
              </p>
              <i className="dm-fw-pop" />
            </div>
          )}
        </div>
        <div className="ny-dir-legend">
          <p className="ny-dir-voice">{dir.voice}</p>
          <p className="ny-dir-traits">
            {dir.traits.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </p>
          <p className={`ny-dir-verdict${dir.chosen ? " is-chosen" : ""}`}>
            {dir.verdict}
          </p>
        </div>
      </div>
      {/* the gesture cue lives in the figure's caption row (one furniture
          row per figure — 2026-07-13 hierarchy cleanup); the shipped-blend
          note was cut as redundant with the Archival tab's own ✓ verdict */}
    </div>
  );
}

/* ── 1.5 · Three wardrobes, one shell ────────────────────────────────────
   The inclusivity thesis, made operable (deck slide 24 + owner note): most
   decisions in the system were made so wardrobes that share nothing — a
   couture archive, a designer drop, worn vintage — sit in the SAME card,
   grid, and type without the system re-styling itself. Switching wardrobes
   swaps only the object; the shell never moves. Items are the mocks' own. */

const WARDROBES = [
  {
    key: "luxury",
    label: "Luxury",
    maison: "HERMÈS",
    title: "Birkin 30 — floral, palladium hardware",
    meta: "LOT 024 · SQUARE Q STAMP · 2013",
    price: "US $14,200",
    format: "LIVE AUCTION · 12 BIDS · ENDS 02:14:08",
    badge: "reserve met",
    img: "/media/work/nyma/item-luxury.png",
    imgW: 368,
    imgH: 490,
    note: "the collector gets ceremony — lot number, stamp, reserve — from the same quiet shell",
  },
  {
    key: "designer",
    label: "Designer",
    maison: "MAISON MARGIELA",
    title: "Tabi ankle boots",
    meta: "EU 42 · SPLIT TOE · WHITE",
    price: "US $285",
    format: "BUY NOW · SHIPS IN 3 DAYS",
    badge: null,
    img: "/media/work/nyma/item-designer.png",
    imgW: 262,
    imgH: 322,
    note: "the drop reads plainly — no urgency theater, the object does the talking",
  },
  {
    key: "vintage",
    label: "Vintage",
    maison: "UNLABELED",
    title: "Rider jacket · 1980s",
    meta: "WORN IN · SINGLE OWNER",
    price: "US $180",
    format: "BUY NOW · OFFERS OPEN",
    badge: "worn in",
    img: "/media/work/nyma/item-vintage.png",
    imgW: 280,
    imgH: 310,
    note: "the worn, unlabeled piece is catalogued with the same care — condition is provenance, not apology",
  },
] as const;

export function NymaWardrobes() {
  const [active, setActive] = useState<(typeof WARDROBES)[number]["key"]>(
    "luxury",
  );
  const w = WARDROBES.find((x) => x.key === active) ?? WARDROBES[0];

  return (
    <div className="ny-ward">
      <div className="ny-ward-tabs" role="group" aria-label="Wardrobes">
        {WARDROBES.map((x) => (
          <button
            key={x.key}
            type="button"
            aria-pressed={x.key === active}
            className={`ny-ward-tab${x.key === active ? " is-on" : ""}`}
            onClick={() => setActive(x.key)}
          >
            {x.label}
          </button>
        ))}
      </div>
      <div className="ny-ward-stage">
        <div className="ny-ward-card" aria-hidden="true">
          <header>
            <span>N Y M A</span>
            <span className="ny-ward-maison">{w.maison}</span>
          </header>
          <div className="ny-ward-img">
            <Image
              src={w.img}
              width={w.imgW}
              height={w.imgH}
              alt=""
              sizes="340px"
            />
            {w.badge && <span>{w.badge}</span>}
          </div>
          <div className="ny-ward-body">
            <p className="ny-ward-meta">{w.meta}</p>
            <p className="ny-ward-title">{w.title}</p>
            <div className="ny-ward-row">
              <span className="ny-ward-price">{w.price}</span>
            </div>
            <p className="ny-ward-format">{w.format}</p>
          </div>
        </div>
        <div className="ny-ward-legend">
          <p className="ny-ward-note">{w.note}</p>
          <div className="ny-ward-ledger">
            <div>
              <span>changes</span>
              <em>the object · its price · its sale format · its condition</em>
            </div>
            <div>
              <span>never changes</span>
              <em>the shell · the type · the color roles · the spacing</em>
            </div>
          </div>
        </div>
      </div>
      {/* gesture cue lives in the figure's caption row — see NymaDirections */}
    </div>
  );
}

/* ── 2 · Color roles on a lot card ───────────────────────────────────────
   Nyma's palette is role-based, never decorative (manual, topic 3.1).
   Clicking a swatch spotlights where that color is allowed to appear on a
   live lot card — and nowhere else. Default: Activation Blue. */

const ROLES = [
  {
    key: "black",
    name: "Ceramic Black",
    hex: "#1C1A17",
    role: "Containment — ink text, primary actions, structure.",
  },
  {
    key: "white",
    name: "Archival White",
    hex: "#FFFFFF",
    role: "Surface — the card itself; base for objects.",
  },
  {
    key: "parchment",
    name: "Parchment",
    hex: "#F2EFEA",
    role: "Warm surface — page ground, seller panels.",
  },
  {
    key: "yellow",
    name: "Ceramic Yellow",
    hex: "#CF882E",
    role: "Material trace only — the reserve-met badge, the live tick.",
  },
  {
    key: "blue",
    name: "Activation Blue",
    hex: "#0D5EAF",
    role: "Interactive states exclusively — the bid action, nothing else.",
  },
  {
    key: "grey",
    name: "Structural Grey",
    hex: "#D9D9D9",
    role: "Separation — hairlines, dividers, disabled fills.",
  },
] as const;

export function NymaColorRoles() {
  const [active, setActive] = useState<(typeof ROLES)[number]["key"]>("blue");
  const role = ROLES.find((r) => r.key === active) ?? ROLES[4];

  return (
    <div className="ny-roles" data-role={active}>
      <div className="ny-roles-chips" role="group" aria-label="Color roles">
        {ROLES.map((r) => (
          <button
            key={r.key}
            type="button"
            aria-pressed={r.key === active}
            className={`ny-roles-chip${r.key === active ? " is-on" : ""}`}
            onClick={() => setActive(r.key)}
          >
            <i style={{ background: r.hex }} aria-hidden="true" />
            <span>
              {r.name}
              <em>{r.hex}</em>
            </span>
          </button>
        ))}
      </div>
      <div className="ny-roles-stage">
        <div className="ny-lotcard" aria-hidden="true">
          <header className="ny-lotcard-top">
            <span className="ny-lotcard-brand" data-c="black">
              N Y M A
            </span>
            <span className="ny-lotcard-live" data-c="yellow">
              <i /> 42 live
            </span>
          </header>
          <div className="ny-lotcard-img" data-c="white">
            <span data-c="yellow">reserve met</span>
          </div>
          <div className="ny-lotcard-body">
            <p className="ny-lotcard-lot" data-c="grey">
              LOT 024 · HERMÈS
            </p>
            <p className="ny-lotcard-title" data-c="black">
              Birkin 30 — Togo Noir
            </p>
            <div className="ny-lotcard-row">
              <span className="ny-lotcard-price" data-c="black">
                US $9,400
              </span>
              <span className="ny-lotcard-ends" data-c="yellow">
                02:14:08
              </span>
            </div>
            <p className="ny-lotcard-meta" data-c="grey">
              CURRENT BID · 12 BIDS
            </p>
            <div className="ny-lotcard-actions">
              <span className="ny-lotcard-bid" data-c="blue">
                BID
              </span>
              <span className="ny-lotcard-buy" data-c="black">
                BUY NOW →
              </span>
            </div>
          </div>
          <footer className="ny-lotcard-ground" data-c="parchment">
            seller panel · parchment ground
          </footer>
        </div>
        <div className="ny-roles-legend">
          <p className="ny-roles-name">
            <i style={{ background: role.hex }} aria-hidden="true" />
            {role.name} <em>{role.hex}</em>
          </p>
          <p className="ny-roles-desc">{role.role}</p>
          <p className="ny-roles-law">
            “Any use of color outside its defined role is considered misuse.”
            — brand manual, 3.1
          </p>
        </div>
      </div>
      {/* gesture cue lives in the figure's caption row — see NymaDirections */}
    </div>
  );
}
