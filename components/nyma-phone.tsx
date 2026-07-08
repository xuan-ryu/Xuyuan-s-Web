"use client";

import { useState } from "react";
import Image from "next/image";

// Nyma case page — the mobile commerce prototype (Pl. 16).
//
// A code-level recreation of the three shipped mobile screens (Auctions /
// Bag / Saved — the "04 / 05 / 06" boards on the team's canvas), placed in
// a neutral CSS phone shell. Every interface fact — copy, lots, prices,
// countdowns, tabs, the bottom nav — is transcribed from the shipped mock;
// the product photos are cropped straight out of it (proto/*.png). Nothing
// the screenshots don't show has been invented; the only additions are the
// live behaviors the brand manual promises: Activation Blue on genuinely
// interactive things (watch a lot, opt authentication in or out, remove a
// bag object) while Ceramic trace stays static.
//
// Contract: server markup is the finished Auctions screen (no-JS reads one
// complete in-phone UI); screen switches are instant DOM swaps, so reduced
// motion needs no special path; every live control is a real <button> with
// the site focus ring. Colors inside the screen are the mock's own pixels
// (#020817 ink, #cfb82e gold trace, #a7a6a1 annotation grey) — the depicted
// artifact keeps its exact values, like every other plate on this page.
//
// Styles: the `.nyp-*` rules live in nyma-case-layout.tsx's scoped <style>
// (NOT here — a string exported from a "use client" module can't cross the
// server boundary into the layout's dangerouslySetInnerHTML).

// ── icons — 20px stroke glyphs, no library ───────────────────────────────

function I({ d, cx }: { d?: string; cx?: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      aria-hidden="true"
    >
      {cx ? (
        <>
          <circle cx="9" cy="9" r="5.4" />
          <path d="M13.2 13.2 17 17" />
        </>
      ) : (
        <path d={d} />
      )}
    </svg>
  );
}

const IC = {
  menu: "M3 7.5h9M3 12.5h14",
  back: "M12.5 4 6.5 10l6 6",
  dots: "M5 10h.01M10 10h.01M15 10h.01",
  home: "M4 9.5 10 4l6 5.5V16h-4.4v-4h-3.2v4H4Z",
  box: "M10 3.2 16 6.4v7.2l-6 3.2-6-3.2V6.4Zm-6 3.2L10 9.8l6-3.4M10 9.8V16.6",
  sell: "M10 6.8v6.4M6.8 10h6.4M10 3a7 7 0 1 1 0 14 7 7 0 0 1 0-14Z",
  inbox: "M3.5 5.5h13v9h-13Zm0 .5L10 11l6.5-5",
  profile:
    "M10 10.2a3.1 3.1 0 1 0 0-6.2 3.1 3.1 0 0 0 0 6.2Zm-5.6 6.3a5.6 5.6 0 0 1 11.2 0",
};

// ── facts, transcribed from the shipped screens ──────────────────────────

const LOTS = [
  {
    id: "024",
    maison: "HERMÈS",
    title: "Birkin 30 — Togo Noir, palladium hardware",
    price: "US $9,400",
    bidline: "CURRENT BID · 12 BIDS",
    ends: "02:14:08",
    hot: true,
    img: { src: "/media/work/nyma/proto/lot-birkin.png", w: 168, h: 138 },
  },
  {
    id: "025",
    maison: "THE ROW",
    title: "Margaux 15 in chocolate calfskin",
    price: "US $2,800",
    bidline: "CURRENT BID · 5 BIDS",
    ends: "14:08:22",
    hot: false,
    img: { src: "/media/work/nyma/proto/lot-backpack.png", w: 166, h: 184 },
  },
  {
    id: "026",
    maison: "PRADA",
    title: "Archive nylon pouch · 1998",
    price: "US $480",
    bidline: "CURRENT BID · 18 BIDS",
    ends: "1d 04:11",
    hot: false,
    img: { src: "/media/work/nyma/proto/lot-pouch.png", w: 110, h: 110 },
  },
  {
    id: "027",
    maison: "LOEWE",
    title: "Puzzle small in tan calfskin",
    price: "US $1,650",
    bidline: "OPENING · NO BIDS",
    ends: "3d 09:42",
    hot: false,
    img: null,
  },
] as const;

const BAG = [
  {
    key: "birkin",
    maison: "HERMÈS",
    title: "Birkin 30 — Togo Noir",
    line: "BUY NOW · LOT 024",
    price: 14200,
    img: { src: "/media/work/nyma/proto/bag-birkin-red.png", w: 88, h: 110 },
  },
  {
    key: "tabi",
    maison: "MAISON MARGIELA",
    title: "Tabi canvas sneaker",
    line: "BUY NOW · EU 42",
    price: 285,
    img: null,
  },
] as const;

const CARDS = [
  {
    maison: "HERMÈS",
    title: "Birkin 30 · Togo Noir",
    price: "US $9,400",
    side: "12 bids",
    badge: "AUCTION · ENDS 2H",
    clock: "02:14:08",
    img: { src: "/media/work/nyma/proto/lot-birkin.png", w: 168, h: 138 },
  },
  {
    maison: "THE ROW",
    title: "Margaux 15",
    price: "US $4,380",
    side: "2022",
    badge: null,
    clock: null,
    img: { src: "/media/work/nyma/proto/lot-backpack.png", w: 166, h: 184 },
  },
  {
    maison: null,
    title: null,
    price: null,
    side: null,
    badge: null,
    clock: null,
    img: null,
  },
  {
    maison: null,
    title: null,
    price: null,
    side: null,
    badge: "AUCTION · 3 DAYS",
    clock: "3d 09:42",
    img: { src: "/media/work/nyma/proto/lot-pouch.png", w: 110, h: 110 },
  },
] as const;

const SCREENS = [
  ["auctions", "04 / Auctions"],
  ["bag", "05 / Bag"],
  ["saved", "06 / Saved"],
] as const;

type Screen = (typeof SCREENS)[number][0];

const usd = (n: number) => `US $${n.toLocaleString("en-US")}`;

// ── the prototype ────────────────────────────────────────────────────────

export function NymaPhone() {
  const [screen, setScreen] = useState<Screen>("auctions");
  const [watching, setWatching] = useState<Record<string, boolean>>({});
  const [inBag, setInBag] = useState<Record<string, boolean>>({
    birkin: true,
    tabi: true,
  });
  const [auth, setAuth] = useState(true);

  const bagItems = BAG.filter((b) => inBag[b.key]);
  const subtotal = bagItems.reduce((s, b) => s + b.price, 0);
  const authFee = auth ? 35 : 0;
  const total = subtotal + authFee;

  const nav = (
    <nav className="nyp-nav" aria-label="Prototype bottom navigation">
      <span>
        <I d={IC.home} />
        HOME
        <i />
      </span>
      <button
        type="button"
        className={screen === "auctions" ? "is-here" : undefined}
        onClick={() => setScreen("auctions")}
      >
        <I d={IC.box} />
        AUCTIONS
        <i />
      </button>
      <span>
        <I d={IC.sell} />
        SELL
        <i />
      </span>
      {/* the shipped Saved board marks this slot — kept as depicted */}
      <span className={screen === "saved" ? "is-here" : undefined}>
        <I d={IC.inbox} />
        INBOX
        <i />
      </span>
      <span>
        <I d={IC.profile} />
        PROFILE
        <i />
      </span>
    </nav>
  );

  return (
    <div
      className="nyp"
      role="group"
      aria-label="Interactive recreation of the shipped Nyma mobile commerce screens"
    >
      <div className="nyp-tabs" role="group" aria-label="Prototype screens">
        {SCREENS.map(([key, label]) => (
          <button
            key={key}
            type="button"
            aria-pressed={screen === key}
            className={`ny-dir-tab${screen === key ? " is-on" : ""}`}
            onClick={() => setScreen(key)}
          >
            {label}
          </button>
        ))}
        <span className="nyp-tabs-note">390 × 844 · as shipped</span>
      </div>

      <div className="nyp-shell">
        <div className="nyp-screen">
          <div className="nyp-status" aria-hidden="true">
            <span>9:41</span>
            <span>100%</span>
          </div>

          {screen === "bag" ? (
            <div className="nyp-head">
              <button
                type="button"
                className="nyp-head-btn"
                aria-label="Back to auctions"
                onClick={() => setScreen("auctions")}
              >
                <I d={IC.back} />
              </button>
              <span className="nyp-brand">NYMA</span>
              <span className="nyp-head-btn" aria-hidden="true">
                <I d={IC.dots} />
              </span>
            </div>
          ) : (
            <div className="nyp-head">
              <span className="nyp-head-btn" aria-hidden="true">
                <I d={IC.menu} />
              </span>
              <span className="nyp-brand">NYMA</span>
              <span className="nyp-head-btn" aria-hidden="true">
                <I cx />
              </span>
            </div>
          )}

          {screen === "auctions" && (
            <div className="nyp-body">
              <div className="nyp-pagehead">
                <h4 className="nyp-title">AUCTIONS</h4>
                <span className="nyp-live">
                  <i aria-hidden="true" /> 42 LIVE
                </span>
              </div>
              <div className="nyp-filters" aria-hidden="true">
                <span className="is-on">CLOSING SOON</span>
                <span>TODAY</span>
                <span>7 DAYS</span>
                <span>NO RESERVE</span>
              </div>
              <div className="nyp-lots">
                {LOTS.map((lot) => (
                  <button
                    key={lot.id}
                    type="button"
                    className="nyp-lot"
                    aria-pressed={!!watching[lot.id]}
                    aria-label={`Watch lot ${lot.id}, ${lot.title}`}
                    onClick={() =>
                      setWatching((w) => ({ ...w, [lot.id]: !w[lot.id] }))
                    }
                  >
                    <span className="nyp-thumb">
                      {lot.img && (
                        <Image
                          src={lot.img.src}
                          width={lot.img.w}
                          height={lot.img.h}
                          alt=""
                          sizes="84px"
                        />
                      )}
                    </span>
                    <span className="nyp-lot-info">
                      <span className="nyp-lot-line">
                        <span>
                          LOT {lot.id} · {lot.maison}
                        </span>
                        {watching[lot.id] && (
                          <span className="nyp-watch-tag">WATCHING</span>
                        )}
                      </span>
                      <span className="nyp-lot-title">{lot.title}</span>
                      <span className="nyp-lot-row">
                        {lot.price}
                        <em className={lot.hot ? "is-hot" : undefined}>
                          {lot.ends}
                        </em>
                      </span>
                      <span className="nyp-lot-line">
                        <span>{lot.bidline}</span>
                        <span>ENDS IN</span>
                      </span>
                    </span>
                  </button>
                ))}
              </div>
              {nav}
            </div>
          )}

          {screen === "bag" && (
            <div className="nyp-body">
              <div className="nyp-pagehead">
                <div>
                  <h4 className="nyp-title">BAG</h4>
                  <p className="nyp-subline">
                    {bagItems.length} OBJECT{bagItems.length === 1 ? "" : "S"} ·
                    RESERVED 15 MIN
                  </p>
                </div>
              </div>
              {bagItems.map((b) => (
                <div className="nyp-bagitem" key={b.key}>
                  <span className="nyp-thumb">
                    {b.img && (
                      <Image
                        src={b.img.src}
                        width={b.img.w}
                        height={b.img.h}
                        alt=""
                        sizes="92px"
                      />
                    )}
                  </span>
                  <span className="nyp-lot-info">
                    <span className="nyp-lot-line">{b.maison}</span>
                    <span className="nyp-lot-title">{b.title}</span>
                    <span className="nyp-lot-line">{b.line}</span>
                    <span className="nyp-lot-row">{usd(b.price)}</span>
                  </span>
                  <button
                    type="button"
                    className="nyp-bag-x"
                    aria-label={`Remove ${b.title} from bag`}
                    onClick={() => setInBag((s) => ({ ...s, [b.key]: false }))}
                  >
                    ×
                  </button>
                </div>
              ))}
              {bagItems.length === 0 && (
                <p className="nyp-bag-empty">
                  BAG EMPTY
                  <button
                    type="button"
                    className="nyp-bag-restore"
                    onClick={() => setInBag({ birkin: true, tabi: true })}
                  >
                    RESTORE OBJECTS
                  </button>
                </p>
              )}
              <div className="nyp-summary">
                <div className="nyp-summary-head">
                  <span>—</span>
                  <span>SUMMARY</span>
                </div>
                <div className="nyp-summary-row">
                  <span>Subtotal</span>
                  <em>{usd(subtotal)}</em>
                </div>
                <div className="nyp-summary-row">
                  <span>Insured shipping</span>
                  <em>Free</em>
                </div>
                <button
                  type="button"
                  className="nyp-summary-row"
                  aria-pressed={auth}
                  aria-label="Authentication opt-in, adds 35 dollars"
                  onClick={() => setAuth((a) => !a)}
                >
                  <span>
                    Authentication · <em>opt-in</em>
                  </span>
                  <em>{auth ? "+ $35" : "+ $0"}</em>
                </button>
                <div className="nyp-summary-row is-faint">
                  <span>Buyer fee</span>
                  <em>0%</em>
                </div>
                <div className="nyp-total">
                  <span>TOTAL</span>
                  <strong>{usd(total)}</strong>
                </div>
              </div>
              <div className="nyp-checkout" aria-hidden="true">
                CHECKOUT →
              </div>
            </div>
          )}

          {screen === "saved" && (
            <div className="nyp-body">
              <div className="nyp-pagehead">
                <div>
                  <p className="nyp-eyebrow">YOUR COLLECTION</p>
                  <h4 className="nyp-title">SAVED</h4>
                  <p className="nyp-subline">
                    <b>14</b> OBJECTS · <b>5</b> WATCHING
                  </p>
                </div>
                <span className="nyp-sort" aria-hidden="true">
                  SORT ↓
                </span>
              </div>
              <div className="nyp-filters" aria-hidden="true">
                <span className="is-on">
                  ALL <b>14</b>
                </span>
                <span>
                  BUY NOW <b>9</b>
                </span>
                <span>
                  WATCHING <b>5</b>
                </span>
              </div>
              <div className="nyp-grid">
                {CARDS.map((c, i) => (
                  <div className="nyp-card" key={i}>
                    <div className="nyp-card-img">
                      {c.img && (
                        <Image
                          src={c.img.src}
                          width={c.img.w}
                          height={c.img.h}
                          alt=""
                          sizes="170px"
                        />
                      )}
                      {c.badge && <span className="nyp-badge">{c.badge}</span>}
                      {c.clock && <span className="nyp-clock">{c.clock}</span>}
                    </div>
                    {c.title && (
                      <div className="nyp-card-body">
                        <span className="nyp-card-maison">{c.maison}</span>
                        <p className="nyp-card-title">{c.title}</p>
                        <span className="nyp-card-row">
                          {c.price}
                          <em>{c.side}</em>
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {nav}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
