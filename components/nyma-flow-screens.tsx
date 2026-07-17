import Image from "next/image";

// Nyma case page — the onboarding flow strip (Pl. 16).
//
// The team canvas's Onboarding row, rebuilt as coded screens in neutral
// shells on a hand-scrolled strip — the same transcription contract as
// nyma-phone.tsx: every interface fact (copy, fields, buttons, casing)
// comes from the shipped mocks (the assembled canvas + the sign-in board);
// the welcome photograph is cropped straight out of the canvas, baked
// wordmark kept. In-screen color is strict monochrome (owner 2026-07-08:
// b/w only) — #111 ink, #8a8a8a grey, hairline fields; only the photograph
// keeps its own color. Deliberately static markup: no state, a server
// component. The desktop walk + grab-drag live in NymaScroll (a scrollLeft
// scrub, never transform, so hand input always works); no-JS and
// reduced-motion readers simply hand-scroll the strip.
//
// Styles: nyma-flow-styles.ts (appended to the layout's scoped <style>).

function Glyph({ d, g }: { d?: string; g?: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" aria-hidden="true">
      {g ? (
        <g fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M14.6 10.4A4.8 4.8 0 1 1 13.3 6" />
          <path d="M10 10.4h4.6" />
        </g>
      ) : (
        <path d={d} fill="currentColor" />
      )}
    </svg>
  );
}

const GLYPH = {
  apple:
    "M13.3 10.9c0-1.8 1.5-2.7 1.6-2.7-.9-1.3-2.2-1.4-2.7-1.5-1.1-.1-2.2.7-2.7.7-.6 0-1.4-.7-2.4-.6-1.2 0-2.4.7-3 1.8-1.3 2.2-.3 5.5.9 7.3.6.9 1.3 1.9 2.3 1.8.9 0 1.3-.6 2.4-.6 1.1 0 1.4.6 2.4.6s1.6-.9 2.2-1.8c.7-1 1-2 1-2.1-.1 0-2-.8-2-2.9Zm-1.8-5.3c.5-.6.9-1.5.8-2.4-.8 0-1.7.5-2.2 1.2-.5.6-.9 1.5-.8 2.3.9.1 1.7-.5 2.2-1.1Z",
  facebook:
    "M11.6 6.4h1.9V4h-2.3c-1.8 0-2.9 1.1-2.9 2.9v1.7H6.5v2.3h1.8V17h2.4v-6.1h2l.3-2.3h-2.3V7.2c0-.5.3-.8.9-.8Z",
};

function Status() {
  return (
    <span className="nyf-status" aria-hidden="true">
      <span>9:41</span>
      <span>100%</span>
    </span>
  );
}

function Head({ title }: { title: string }) {
  return (
    <span className="nyf-head">
      <svg width="16" height="16" viewBox="0 0 20 20" aria-hidden="true">
        <path
          d="M12.5 4 6.5 10l6 6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
        />
      </svg>
      <span className="nyf-head-title">{title}</span>
      <span />
    </span>
  );
}

function Field({ label, show }: { label: string; show?: boolean }) {
  return (
    <span className="nyf-field">
      <span>{label}</span>
      {show && <em>SHOW</em>}
    </span>
  );
}

// ── the four screens, canvas order ───────────────────────────────────────

export function NymaFlowScreens() {
  return (
    <div
      className="nyf"
      role="group"
      aria-label="The onboarding flow rebuilt in code: splash, welcome, register, and sign-in screens"
      tabIndex={0}
    >
      <div className="nyf-track">
        <article className="nyf-item">
          <span className="nyf-label">01 · Splash</span>
          <div className="nyf-shell">
            <div className="nyf-screen is-dark">
              <Status />
              <span className="nyf-splash">
                <strong>NYMA</strong>
                <span>NEW YORK · MILAN · ATELIER</span>
              </span>
              <span className="nyf-est">EST. MMXXIII</span>
            </div>
          </div>
        </article>

        <article className="nyf-item">
          <span className="nyf-label">02 · Welcome</span>
          <div className="nyf-shell">
            <div className="nyf-screen">
              <Status />
              <span className="nyf-photo">
                <Image
                  src="/media/work/nyma/proto/onb-welcome.png"
                  width={360}
                  height={586}
                  alt="The welcome photograph as shipped: a floral Studio bag in a dark vitrine, the NYMA wordmark and resale tagline set on the image."
                  sizes="272px"
                />
              </span>
              <span className="nyf-deck">
                <span className="nyf-btnrow">
                  <span className="nyf-btn-line">REGISTER</span>
                  <span className="nyf-btn-solid">SIGN IN</span>
                </span>
                <span className="nyf-or">
                  <i />
                  OR CONTINUE WITH
                  <i />
                </span>
                <span className="nyf-social" aria-hidden="true">
                  <span>
                    <Glyph d={GLYPH.apple} />
                  </span>
                  <span>
                    <Glyph g />
                  </span>
                  <span>
                    <Glyph d={GLYPH.facebook} />
                  </span>
                </span>
                <span className="nyf-legal">
                  By continuing, you agree to our <u>Terms &amp; Privacy</u>.
                </span>
                <i className="nyf-homebar" aria-hidden="true" />
              </span>
            </div>
          </div>
        </article>

        <article className="nyf-item">
          <span className="nyf-label">03 · Register</span>
          <div className="nyf-shell">
            <div className="nyf-screen">
              <Status />
              <Head title="REGISTER" />
              <span className="nyf-form">
                <Field label="Display name" />
                <Field label="Email" />
                <Field label="Password" show />
                <span className="nyf-checks">
                  <span className="nyf-check">
                    <i />I am 18 or older
                  </span>
                  <span className="nyf-check">
                    <i className="is-on" />I accept Terms &amp; Privacy
                  </span>
                  <span className="nyf-check">
                    <i />
                    Send me drop alerts
                  </span>
                </span>
                <span className="nyf-form-foot">
                  <span className="nyf-btn-solid">SIGN UP</span>
                  <span className="nyf-legal">
                    Already a member? <u>Sign in</u>
                  </span>
                  <i className="nyf-homebar" aria-hidden="true" />
                </span>
              </span>
            </div>
          </div>
        </article>

        <article className="nyf-item">
          <span className="nyf-label">04 · Sign in</span>
          <div className="nyf-shell">
            <div className="nyf-screen">
              <Status />
              <Head title="SIGN IN" />
              <span className="nyf-form">
                <Field label="Email" />
                <Field label="Password" show />
                <span className="nyf-forgot">
                  <u>Forgot password?</u>
                </span>
                <span className="nyf-btn-solid">SIGN IN</span>
                <span className="nyf-or">
                  <i />
                  OR
                  <i />
                </span>
                <span className="nyf-btn-line">
                  <Glyph d={GLYPH.apple} />
                  CONTINUE WITH APPLE
                </span>
                <span className="nyf-btn-line">
                  <Glyph g />
                  CONTINUE WITH GOOGLE
                </span>
                <span className="nyf-form-foot">
                  <span className="nyf-legal">
                    By signing in, you agree to <u>Terms &amp; Privacy</u>.
                  </span>
                  <i className="nyf-homebar" aria-hidden="true" />
                </span>
              </span>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
