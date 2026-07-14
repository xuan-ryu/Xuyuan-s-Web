// Nyma case page — THE codified design-system page, rendered live (L1
// leaf, static server markup). This is the system's one home on the page:
// a document masthead (the "one page, generated from the repo" fact) over
// component specimens drawn from the coded rules — action slabs, status
// signals, a search field. Color roles and the type ladder live in ch3's
// interactives (Pl. 07/08), so they are NOT repeated here; Activation Blue
// stays with the law card. Styles live in the page's scoped <style>
// (nyma-case-layout.tsx).

export function NymaSystemBoard() {
  return (
    <div className="ny-sysboard">
      <header className="ny-sysboard-mast">
        <b>NYMA</b>
        <span>design system · one page, generated from the repo</span>
      </header>
      <div className="ny-sysboard-group">
        <span className="ny-sysboard-head">actions — ink, three weights</span>
        <div className="ny-sysboard-row">
          <b className="ny-sys-btn is-solid">Start your first listing</b>
          <b className="ny-sys-btn is-line">Follow</b>
          <b className="ny-sys-link">View all</b>
        </div>
      </div>
      <div className="ny-sysboard-group">
        <span className="ny-sysboard-head">signals — state without color</span>
        <div className="ny-sysboard-row">
          <b className="ny-sys-tag">
            <i aria-hidden="true" />
            42 live
          </b>
          <b className="ny-sys-chip">Reserve met</b>
          <b className="ny-sys-label">Lot 024 · Hermès</b>
        </div>
      </div>
      <div className="ny-sysboard-group">
        <span className="ny-sysboard-head">fields — hairline, no chrome</span>
        <div className="ny-sysboard-row">
          <b className="ny-sys-field">Brand, model, color, or seller</b>
        </div>
      </div>
      <footer className="ny-sysboard-foot">
        every piece above renders from the coded tokens — no local styles
      </footer>
    </div>
  );
}
