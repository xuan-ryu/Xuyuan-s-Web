"use client";

import { useCallback, useRef, useState } from "react";
import type { CSSProperties, KeyboardEvent } from "react";
import { Cta } from "./ui/cta";
import { roperSamplePoll } from "./roper-poll-data";

// The product's predict-then-reveal loop rebuilt in portfolio ink
// (spec-roper.json "GuessVsAmerica"): commit to a guess with the slider
// (pointer/touch) or the Reveal <Cta variant="line"> (keyboard — Tab + Enter),
// then three hairline bars draw in once. The reader's guess lands as an ink
// tick; the prototype's 1984 figure is the page's single seal-red moment.
// Styling lives in roper-case-layout.tsx's .roper- critical CSS; reduced
// motion renders the revealed state instantly (no stagger, CSS side). The
// reveal runs once — controls disable afterwards, nothing loops.
export function RoperGuessVsAmerica() {
  const poll = roperSamplePoll;
  const lead = poll.options[poll.leadIndex];
  const [guess, setGuess] = useState(50);
  const [revealed, setRevealed] = useState(false);
  const touched = useRef(false);

  const reveal = useCallback(() => setRevealed(true), []);

  const onSliderRelease = useCallback(() => {
    if (touched.current) setRevealed(true);
  }, []);

  const onSliderKey = useCallback((event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") setRevealed(true);
  }, []);

  const delta = Math.abs(lead.pct - guess);

  return (
    <div className={`roper-guess${revealed ? " is-revealed" : ""}`}>
      <p className="roper-guess-q">“{poll.question}”</p>

      <div className="roper-guess-controls">
        <div className="roper-guess-sliderbox">
          <label className="roper-guess-sliderlabel" htmlFor="roper-guess-range">
            Your guess — share who said “{lead.label}”
          </label>
          <div className="roper-guess-sliderrow">
            <input
              className="roper-guess-range"
              id="roper-guess-range"
              type="range"
              min={0}
              max={100}
              step={1}
              value={guess}
              disabled={revealed}
              aria-valuetext={`${guess} percent`}
              onChange={(event) => {
                touched.current = true;
                setGuess(Number(event.target.value));
              }}
              onPointerUp={onSliderRelease}
              onKeyDown={onSliderKey}
            />
            <output className="roper-guess-out" htmlFor="roper-guess-range">
              {guess}%
            </output>
          </div>
        </div>
        <Cta variant="line" onClick={reveal} disabled={revealed}>
          {revealed ? "Revealed" : "Reveal the 1984 answer"}
        </Cta>
      </div>

      <div className="roper-guess-bars">
        {poll.options.map((option, index) => {
          const isLead = index === poll.leadIndex;
          return (
            <div
              className={`roper-guess-bar${isLead ? " is-lead" : ""}`}
              key={option.label}
              style={{ "--pct": option.pct, "--i": index } as CSSProperties}
            >
              <span className="roper-guess-bar-label">{option.label}</span>
              <span className="roper-guess-track">
                <span className="roper-guess-fill" />
                {isLead && (
                  <span
                    className="roper-guess-tick"
                    style={{ left: `${guess}%` }}
                    aria-hidden="true"
                  />
                )}
                {isLead && (
                  <span
                    className="roper-guess-actual"
                    style={{ left: `${option.pct}%` }}
                    aria-hidden="true"
                  />
                )}
              </span>
              <span className="roper-guess-num">{option.pct}%</span>
            </div>
          );
        })}
      </div>

      <p className="roper-guess-verdict">
        Your guess {guess}% · actual {lead.pct}% · off by {delta}{" "}
        {delta === 1 ? "pt" : "pts"}
      </p>

      <p className="roper-sr" aria-live="polite">
        {revealed
          ? `Revealed — America in 1984: ${poll.options
              .map((option) => `${option.label} ${option.pct} percent`)
              .join(", ")}. Your guess was ${guess} percent ${lead.label}.`
          : ""}
      </p>
    </div>
  );
}
