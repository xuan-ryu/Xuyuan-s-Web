import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";

export const metadata: Metadata = {
  title: "Design System",
  description: "Visual design system for the Xuyuan Liu portfolio rebuild.",
};

const colors = [
  ["ink-950", "#050505", "Deepest text and black sections"],
  ["ink-900", "#0a0a0a", "Nav, buttons, dark panels"],
  ["ink-800", "#1c1c1c", "Secondary dark surfaces"],
  ["ink-700", "#262626", "Hover darks"],
  ["paper", "#ffffff", "Main background"],
  ["paper-warm", "#fafafa", "Soft paper fields"],
  ["mist", "#e5e5e5", "Hairlines"],
  ["stone", "#a3a3a3", "Muted labels"],
  ["accent-amber", "#fe8411", "Active and hover accent"],
  ["accent-gold", "#d4941e", "Dates and formal details"],
] as const;

const typeRows = [
  ["Display 1", "clamp(82px, 12vw, 168px)", "About hero scale"],
  ["Display 2", "clamp(58px, 8.4vw, 120px)", "Page and case titles"],
  ["Display 3", "clamp(52px, 7.8vw, 112px)", "Chapter and CTA scale"],
  ["Heading", "clamp(42px, 5.1vw, 55px)", "Editorial sections"],
  ["Body", "clamp(18px, 1.55vw, 22px)", "Long-form reading"],
] as const;

const pages = [
  ["Home", "Scrolltelling sequence", "Hero, roof, windows, koi, method cards"],
  ["Work", "Project index", "Wide image-led cards with glass overlays"],
  ["Case", "Editorial study", "Title, cover, black summary, chapters"],
  ["Poster", "Artifact page", "Tall poster, details block, gallery"],
  ["About", "Personal essay", "Hongyadong scene, essays, walls, habits"],
  ["Contact", "Conversion page", "Large title, portrait, card, form states"],
] as const;

const states = ["Default", "Hover", "Loading", "Success", "Error", "Disabled"];

export default function DesignSystemPage() {
  return (
    <div className="ds-page">
      <section className="ds-hero" id="header">
        <div className="ds-hero-copy">
          <p className="ds-kicker">Framer reference to Next implementation</p>
          <h1>Design System</h1>
          <p>
            A visual inventory for the portfolio: ink, paper, seal, garden
            imagery, editorial typography, and motion rules translated into
            reusable implementation contracts.
          </p>
          <div className="ds-hero-actions">
            <Link href="#tokens" className="ds-pill-link">
              See tokens
            </Link>
            <Link href="/work" className="ds-text-link">
              See work index
            </Link>
          </div>
        </div>

        <div className="ds-hero-board" aria-label="System summary">
          <div className="ds-seal-card">
            <Image
              src="/assets/framerusercontent.com/images/ntwL7wUkSslvYCLMnzXaIuQu8zU.png"
              alt=""
              width={96}
              height={190}
              priority
            />
            <span>Red seal as recurring mark</span>
          </div>
          <div className="ds-board-line">
            <span>Ink</span>
            <span>Paper</span>
            <span>Motion</span>
          </div>
          <div className="ds-board-window">
            <Image
              src="/assets/framerusercontent.com/images/D6Nz1N21z7DIjWae8R8LFGCY.png"
              alt=""
              fill
              sizes="360px"
            />
          </div>
        </div>
      </section>

      <section className="ds-section ds-comparison" data-fade>
        <div className="ds-section-head">
          <p className="ds-kicker">Comparison</p>
          <h2>What Framer gave us, what Next owns now</h2>
        </div>
        <div className="ds-compare-grid">
          <article>
            <span>01</span>
            <h3>Framer language</h3>
            <p>
              Individually pinned layers, serif display scale, black glass
              overlays, spring reveals, and visual variants for nav, cards,
              links, and form buttons.
            </p>
          </article>
          <article>
            <span>02</span>
            <h3>Next implementation</h3>
            <p>
              Local assets, Tailwind v4 theme tokens, React templates,
              Lenis-aware scroll, and custom Three.js or Canvas scenes with
              measured geometry.
            </p>
          </article>
          <article>
            <span>03</span>
            <h3>System rule</h3>
            <p>
              Keep art-directed sections measured. Turn repeatable UI into
              contracts: tokens, typography, stateful controls, focus behavior,
              and cleanup-safe motion.
            </p>
          </article>
        </div>
      </section>

      <section className="ds-section" id="tokens" data-fade>
        <div className="ds-section-head">
          <p className="ds-kicker">Color</p>
          <h2>Ink, paper, one accent</h2>
        </div>
        <div className="ds-color-grid">
          {colors.map(([name, value, use]) => (
            <article key={name} className="ds-color-card">
              <span
                className="ds-swatch"
                style={{ backgroundColor: value }}
                aria-hidden="true"
              />
              <div>
                <h3>{name}</h3>
                <p>{value}</p>
                <small>{use}</small>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="ds-section ds-type-section" data-fade>
        <div className="ds-section-head">
          <p className="ds-kicker">Typography</p>
          <h2>Editorial scale with compact UI support</h2>
        </div>
        <div className="ds-type-stage">
          <div className="ds-type-display">
            <span>Welcome,</span>
            <span>Design for intuition.</span>
          </div>
          <div className="ds-type-copy">
            <p>
              Cormorant carries display moments. Newsreader carries reading
              texture. Murecho is the compact UI handrail.
            </p>
            <dl>
              {typeRows.map(([name, size, use]) => (
                <div key={name}>
                  <dt>{name}</dt>
                  <dd>{size}</dd>
                  <dd>{use}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className="ds-section" data-fade>
        <div className="ds-section-head">
          <p className="ds-kicker">Components</p>
          <h2>Repeatable pieces, shown as states</h2>
        </div>
        <div className="ds-component-grid">
          <article className="ds-specimen ds-nav-specimen">
            <h3>Navigation</h3>
            <div className="ds-mini-nav" aria-label="Navigation specimen">
              <span>XUYUAN LIU</span>
              <nav>
                <a>HOME</a>
                <a className="is-active">WORK</a>
                <a>ABOUT</a>
              </nav>
            </div>
            <p>Black strip, amber active item, short labels, compact rhythm.</p>
          </article>

          <article className="ds-specimen">
            <h3>Button states</h3>
            <div className="ds-state-grid">
              {states.map((state) => (
                <button
                  key={state}
                  className={`ds-button-state ds-state-${state.toLowerCase()}`}
                  disabled={state === "Disabled"}
                >
                  {state}
                </button>
              ))}
            </div>
          </article>

          <article className="ds-specimen ds-form-specimen">
            <h3>Form pattern</h3>
            <label>
              Name
              <input value="Xuyuan Liu" readOnly />
            </label>
            <label>
              Message
              <textarea value="Prototype the system before polishing pages." readOnly />
            </label>
            <p className="ds-error-text">Error text sits below the control.</p>
          </article>

          <article className="ds-specimen ds-glass-specimen">
            <h3>Glass card</h3>
            <p className="ds-glass-title">Observe</p>
            <p>
              A dark translucent panel with inner edge refraction and serif
              hierarchy, not a generic bright card.
            </p>
          </article>
        </div>
      </section>

      <section className="ds-section ds-card-section" data-fade>
        <div className="ds-section-head">
          <p className="ds-kicker">Project cards</p>
          <h2>The image is the card</h2>
        </div>
        <div className="ds-project-specimen">
          <div className="ds-project-image">
            <Image
              src="/assets/framerusercontent.com/images/SUHc9j4i2q6lWCPn65FHtpIVCqw.jpg"
              alt=""
              fill
              sizes="(max-width: 809px) 100vw, 760px"
            />
          </div>
          <div className="ds-project-title">Vicino AI</div>
          <div className="ds-project-copy">
            Text overlays are dark translucent panels. The project image stays
            cinematic; the action is compact and subordinate.
          </div>
          <Link href="/work" className="ds-project-action">
            View pattern
          </Link>
        </div>
      </section>

      <section className="ds-section" data-fade>
        <div className="ds-section-head">
          <p className="ds-kicker">Motion</p>
          <h2>Curves as visual rhythm</h2>
        </div>
        <div className="ds-motion-grid">
          <article>
            <span className="ds-motion-dot ds-motion-silk" />
            <h3>Silk</h3>
            <p>0.16, 1, 0.3, 1</p>
          </article>
          <article>
            <span className="ds-motion-dot ds-motion-reveal" />
            <h3>Reveal</h3>
            <p>0.22, 1, 0.36, 1</p>
          </article>
          <article>
            <span className="ds-motion-dot ds-motion-spring" />
            <h3>Spring</h3>
            <p>0.34, 1.52, 0.64, 1</p>
          </article>
        </div>
      </section>

      <section className="ds-section ds-map-section" data-fade>
        <div className="ds-section-head">
          <p className="ds-kicker">Templates</p>
          <h2>Page families</h2>
        </div>
        <div className="ds-page-map">
          {pages.map(([name, role, details], index) => (
            <article key={name} style={{ "--i": index } as CSSProperties}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{name}</h3>
              <p>{role}</p>
              <small>{details}</small>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
