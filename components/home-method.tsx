// Home stage — L1 method section: three glass panels under the low-angle shot
// looking up the arrangement. Copy is site.workMethods.
import { site } from "@/data/site";

export function HomeMethod() {
  return (
    <section className="home-method home-shot" data-shot="method" aria-labelledby="home-method-title">
      <div className="home-grid home-shot-inner">
        <h2 id="home-method-title" className="home-display home-method-title" data-fade>
          {site.home.methodTitle}
        </h2>
        <ol className="home-method-list">
          {site.workMethods.map((m, i) => (
            <li key={m.title} className="home-method-panel glass-window" data-fade>
              <span className="home-work-index">{String(i + 1).padStart(2, "0")}</span>
              <p className="home-eyebrow">{m.title}</p>
              <h3 className="home-method-heading">{m.heading}</h3>
              <p className="home-method-body">{m.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
