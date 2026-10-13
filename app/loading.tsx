export default function Loading() {
  return (
    <main className="app-shell loading-page" aria-live="polite" aria-busy="true">
      <div className="loading-brand">
        <span className="brand-mark">P</span>
        <span>persona<span className="brand-dot">.</span></span>
      </div>
      <div className="loading-indicator" aria-hidden="true"><span /><span /><span /></div>
      <p>Making space for a little more self-understanding…</p>
    </main>
  );
}
