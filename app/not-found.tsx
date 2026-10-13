"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <main className="app-shell not-found-page">
      <header className="topbar">
        <Link className="brand" href="/">
          <span className="brand-mark">P</span>
          <span>persona<span className="brand-dot">.</span></span>
        </Link>
      </header>
      <section className="not-found-content">
        <div className="eyebrow"><span className="eyebrow-line" />404 · PAGE NOT FOUND</div>
        <h1>This page is taking<br />a different path.</h1>
        <p>The page may have moved, or the link may be incomplete. You can return to the Persona home page and continue from there.</p>
        <Link className="button-primary not-found-link" href="/">Back to home <span>↗</span></Link>
      </section>
    </main>
  );
}
