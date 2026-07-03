// The prototype's own sample question — the ONE shared constant that feeds
// both the hero PollRule strip and the GuessVsAmerica module, so the figures
// can never drift apart (spec-roper.json binding adjustment).
//
// VERIFICATION: figures read off the project's source video
// public/media/work/roper/preview.mp4 —
// the reveal screen at ~20s shows "Actual Poll Response in 1984":
// Favor 80% / Oppose 16% / Don't know 4%, "Who: National adult; Registerd
// voters (77%)", "When: 9/7/1984 - 9/11/1984". The 45/52/4 school-day figures
// the spec assumed appear only blurred behind a score overlay (unverifiable —
// the "No" tag reads 51% or 52% depending on the frame), so per the binding
// adjustment we use the question the prototype itself shows legibly.
//
// Everywhere on the page these numbers are captioned as the prototype's
// sample question — NEVER as a fresh Roper Center citation.
export const roperSamplePoll = {
  question:
    "On the whole, do you favor or oppose most of the efforts to strengthen and change the status of women in society today?",
  options: [
    { label: "Favor", pct: 80 },
    { label: "Oppose", pct: 16 },
    { label: "Don’t know", pct: 4 },
  ],
  /** index of the option the reader guesses against (the lead bar) */
  leadIndex: 0,
  /** source line as read off the prototype's own poll-information block */
  source:
    "The prototype’s sample question · National adult · registered voters (77%) · fielded 9/7 – 9/11/1984",
} as const;

export type RoperSamplePoll = typeof roperSamplePoll;
