import Image from "next/image";

// Pulse case page — labeled before/after evidence pair (L1, server).
// Two product shots with verdict labels and per-column build-fact notes;
// the figure element and its numbered caption stay in the layout, so all
// Fig numbering lives in one file. Default frame is the standard 1440×1000
// window capture; pass w/h when a pair was cropped (e.g. sidebar cut).

type Shot = {
  src: string;
  alt: string;
  label: string;
  note: string;
  w?: number;
  h?: number;
};

function Labeled({ shot, tone }: { shot: Shot; tone: "is-before" | "is-after" }) {
  return (
    <div className="pulse-shot-labeled">
      <span className={`pulse-shot-label ${tone}`}>{shot.label}</span>
      <div className="pulse-shot">
        <Image
          src={shot.src}
          alt={shot.alt}
          width={shot.w ?? 1440}
          height={shot.h ?? 1000}
          sizes="(max-width: 809px) 100vw, (max-width: 1080px) 50vw, 560px"
          style={{ width: "100%", height: "auto" }}
        />
      </div>
      <p className="pulse-shot-note">{shot.note}</p>
    </div>
  );
}

export function PulseShotPair({ before, after }: { before: Shot; after: Shot }) {
  return (
    <div className="pulse-shot-pair">
      <Labeled shot={before} tone="is-before" />
      <Labeled shot={after} tone="is-after" />
    </div>
  );
}
