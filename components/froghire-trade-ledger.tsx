"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

// The Trade Ledger closes Chapter 2: the four real trade-offs, each row
// reading proposed → pushback → what shipped, closed by a stamped verdict.
// Facts are verbatim from data/projects.ts chapters[1].sections[0–1].
// Stamps settle in once on first scroll into view (IO fires once, then
// disconnects); prefers-reduced-motion renders them static. HELD THE LINE is
// the page's single seal-red moment.

type Trade = {
  name: string;
  shipped: string;
  proposed: string;
  pushback: string;
  verdict: string;
  red?: boolean;
};

const TRADES: Trade[] = [
  {
    name: "Onboarding",
    shipped: "Lightweight tooltips — far from perfect, better than nothing.",
    proposed:
      "Three flows drafted: pop-ups, a walkthrough, an animated demo. The CEO pushed for animation.",
    pushback:
      "“It would slow load times and push release back two weeks.” — engineering",
    verdict: "Shipped",
  },
  {
    name: "Subscription",
    shipped: "Price only.",
    proposed: "A subscription page showing price and timeframes.",
    pushback: "“Too heavy for the backend.” — engineering",
    verdict: "Half-win",
  },
  {
    name: "Resume states",
    shipped: "One highlighted resume — a little control, not flexibility.",
    proposed: "Active / inactive toggles to control recommendations.",
    pushback: "Too complex — engineering said no again.",
    verdict: "Half-win",
  },
  {
    name: "Filters",
    shipped: "Location and salary filters, in full.",
    proposed: "Location and salary — what mattered most to job seekers.",
    pushback: "Pushback again. That time, I didn’t fold.",
    verdict: "Held the line",
    red: true,
  },
];

export function FroghireTradeLedger() {
  const tableRef = useRef<HTMLDivElement>(null);
  const [stamped, setStamped] = useState(false);

  useEffect(() => {
    const el = tableRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setStamped(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        setStamped(true);
        io.disconnect();
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      className="froghire-ledger froghire-shell"
      data-stamped={stamped ? "true" : "false"}
      aria-labelledby="froghire-ledger-title"
    >
      <div className="froghire-grid">
        <p className="froghire-index-label froghire-ledger-label" data-fade>
          Ledger
        </p>
        <h3 id="froghire-ledger-title" className="froghire-ledger-title" data-fade>
          Every fix was a negotiation.
        </h3>
      </div>

      <div className="froghire-ledger-table" ref={tableRef}>
        <div className="froghire-grid froghire-ledger-headrow" aria-hidden="true">
          <span className="froghire-ledger-h froghire-ledger-col-case">
            Case · what shipped
          </span>
          <span className="froghire-ledger-h froghire-ledger-col-proposed">
            Proposed
          </span>
          <span className="froghire-ledger-h froghire-ledger-col-pushback">
            Pushback
          </span>
          <span className="froghire-ledger-h froghire-ledger-col-verdict">
            Verdict
          </span>
        </div>

        {TRADES.map((t, i) => (
          <div
            key={t.name}
            className="froghire-grid froghire-ledger-row"
            tabIndex={0}
            data-fade
          >
            <div className="froghire-ledger-col-case">
              <h4 className="froghire-ledger-case">{t.name}</h4>
              <p className="froghire-ledger-shipped">{t.shipped}</p>
            </div>
            <p className="froghire-ledger-cell froghire-ledger-col-proposed">
              <span className="froghire-ledger-cell-label">Proposed</span>
              {t.proposed}
            </p>
            <p className="froghire-ledger-cell froghire-ledger-col-pushback">
              <span className="froghire-ledger-cell-label">Pushback</span>
              {t.pushback}
            </p>
            <div className="froghire-ledger-col-verdict">
              <span
                className="froghire-stamp"
                data-red={t.red ? "true" : undefined}
                style={{ "--fro-d": `${i * 90}ms` } as CSSProperties}
              >
                {t.verdict}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
