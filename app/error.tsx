"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Keep diagnostic details in the browser console; never expose them in the UI.
    console.error("Persona application error:", error);
  }, [error]);

  return (
    <main className="app-shell not-found-page">
      <header className="topbar">
        <Link className="brand" href="/">
          <span className="brand-mark">P</span>
          <span>persona<span className="brand-dot">.</span></span>
        </Link>
      </header>
      <section className="not-found-content" role="alert">
        <div className="eyebrow"><span className="eyebrow-line" />PERSONA · SOMETHING WENT WRONG</div>
        <h1>Let’s find<br />our way back.</h1>
        <p>Something unexpected interrupted this page. Your browser-saved demo progress may still be available when you return.</p>
        <div className="error-actions">
          <button className="button-primary" onClick={reset}>Try again <span>↻</span></button>
          <Link className="button-secondary error-home-link" href="/">Back to home <span>↗</span></Link>
        </div>
      </section>
    </main>
  );
}
