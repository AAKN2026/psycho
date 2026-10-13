"use client";

import { useState } from "react";

type Locale = "en" | "zh";
const copy = {
  en: {
    navAbout: "Our approach", navScience: "Scientific principles", navPrivacy: "Privacy",
    eyebrow: "PERSONALITY · WITH PERSPECTIVE",
    title: "Understand yourself.\nBeyond a label.",
    subtitle: "A considered personality insight experience built around established assessment methods, transparent limitations, and practical reflection.",
    start: "Explore the assessment", learn: "Our scientific approach",
    note: "MVP PREVIEW · Assessment scoring and paid reports are not yet enabled.",
    trust1: "Evidence-informed", trust2: "Private by design", trust3: "Insight, not diagnosis",
    sectionLabel: "A more thoughtful kind of assessment",
    sectionTitle: "Not a personality box.\nA starting point for insight.",
    card1Title: "A clearer picture", card1Text: "Explore broad personality dimensions and the patterns they may describe—not a fixed definition of who you are.",
    card2Title: "Grounded in method", card2Text: "Assessment items, scoring rules, and interpretations will be reviewed before the product is released.",
    card3Title: "Made for real life", card3Text: "Turn reflection into small, practical experiments for work, relationships, and everyday choices.",
    processLabel: "THE EXPERIENCE", processTitle: "Considered at every step",
    step1: "Answer at your own pace", step1Text: "A clear, bilingual experience designed for mobile and desktop.",
    step2: "See your profile", step2Text: "Review the dimensions supported by your completed assessment.",
    step3: "Go deeper, thoughtfully", step3Text: "An optional in-depth report will connect verified results to careful, practical explanations.",
    disclaimer: "Personality insights are for personal reflection and are not a mental health diagnosis. Scores and interpretations will only be presented within the evidence available for the selected assessment.",
    footer: "PERSONA · PERSONALITY INSIGHT LAB", footerText: "Built with care. Designed for perspective."
  },
  zh: {
    navAbout: "产品理念", navScience: "科学原则", navPrivacy: "隐私保护",
    eyebrow: "人格探索 · 更有深度",
    title: "理解自己，\n不被标签定义。",
    subtitle: "以成熟测评方法为基础，清晰说明测评局限，并将人格洞察转化为值得实践的自我反思。",
    start: "了解人格测评", learn: "了解科学原则",
    note: "MVP 预览版 · 正式量表评分与付费报告尚未启用。",
    trust1: "以证据为基础", trust2: "隐私优先设计", trust3: "洞察而非诊断",
    sectionLabel: "更审慎的人格测评体验",
    sectionTitle: "不急着给你贴标签，\n而是帮助你理解自己。",
    card1Title: "看见更完整的自己", card1Text: "探索不同人格维度及其可能呈现的倾向，而不是用一个结果定义你是谁。",
    card2Title: "方法有据可查", card2Text: "正式上线前，题目、评分规则和解释方式都将经过相应审核。",
    card3Title: "让洞察走进生活", card3Text: "把自我反思转化为工作、人际关系和日常选择中的小行动。",
    processLabel: "测评体验", processTitle: "每一步，都认真对待",
    step1: "按自己的节奏作答", step1Text: "为手机和电脑设计的清晰双语体验。",
    step2: "了解人格画像", step2Text: "查看本次测评有依据支持的人格维度结果。",
    step3: "深入理解与实践", step3Text: "可选的深度报告将基于已核实的结果，提供审慎而实用的解释。",
    disclaimer: "人格洞察用于个人反思，不构成心理健康诊断。分数与解释仅会在所选测评工具现有证据支持的范围内呈现。",
    footer: "PERSONA · 人格洞察实验室", footerText: "认真构建，帮助你看见更多可能。"
  }
};

export default function Home() {
  const [locale, setLocale] = useState<Locale>("zh");
  const t = copy[locale];
  return (
    <main>
      <header className="topbar">
        <a className="brand" href="#" aria-label="Persona home"><span className="brand-mark">P</span><span>persona<span className="brand-dot">.</span></span></a>
        <nav className="nav-links"><a href="#approach">{t.navAbout}</a><a href="#science">{t.navScience}</a><a href="#privacy">{t.navPrivacy}</a></nav>
        <div className="nav-actions">
          <button className="language-toggle" onClick={() => setLocale(locale === "zh" ? "en" : "zh")} aria-label="Switch language">{locale === "zh" ? "EN" : "中文"} <span>↗</span></button>
          <a className="nav-cta" href="#approach">{t.start} <span>↗</span></a>
        </div>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-line" />{t.eyebrow}</div>
          <h1>{t.title.split("\n").map((line, i) => <span key={i}>{line}{i === 0 && <br />}</span>)}</h1>
          <p className="hero-subtitle">{t.subtitle}</p>
          <div className="hero-actions"><a className="button-primary" href="#approach">{t.start}<span>↗</span></a><a className="button-text" href="#science">{t.learn}<span>↓</span></a></div>
          <p className="preview-note"><span className="status-dot" />{t.note}</p>
        </div>
        <div className="hero-art" aria-label="Abstract layered personality profile illustration">
          <div className="art-orbit orbit-one" /><div className="art-orbit orbit-two" /><div className="art-orbit orbit-three" />
          <div className="art-disc"><div className="disc-inner"><span className="disc-caption">A LITTLE CLOSER</span><span className="disc-title">to<br />yourself.</span><span className="disc-star">✳</span></div></div>
          <div className="floating-card card-top"><span className="mini-label">SELF · AWARENESS</span><span className="mini-line" /><span className="mini-line short" /></div>
          <div className="floating-card card-bottom"><span className="card-spark">✳</span><span><strong>Room to grow</strong><small>Every trait has context.</small></span></div>
          <div className="art-index">01 — 05<br />A PERSONAL JOURNEY</div>
        </div>
        <div className="hero-bottom"><span>01 / 03</span><div className="hero-bottom-line" /><span>THE ART OF SELF-UNDERSTANDING</span></div>
      </section>

      <section className="trust-strip" id="science"><span>{t.trust1}</span><i>✳</i><span>{t.trust2}</span><i>✳</i><span>{t.trust3}</span></section>

      <section className="approach section-wrap" id="approach">
        <div className="section-heading"><div className="eyebrow"><span className="eyebrow-line" />{t.sectionLabel}</div><h2>{t.sectionTitle.split("\n").map((line, i) => <span key={i}>{line}{i === 0 && <br />}</span>)}</h2></div>
        <div className="feature-grid">
          <article className="feature-card"><span className="feature-number">01</span><div className="feature-icon icon-profile">◌</div><h3>{t.card1Title}</h3><p>{t.card1Text}</p><span className="feature-arrow">↗</span></article>
          <article className="feature-card feature-highlight"><span className="feature-number">02</span><div className="feature-icon icon-method">✳</div><h3>{t.card2Title}</h3><p>{t.card2Text}</p><span className="feature-arrow">↗</span></article>
          <article className="feature-card"><span className="feature-number">03</span><div className="feature-icon icon-growth">↗</div><h3>{t.card3Title}</h3><p>{t.card3Text}</p><span className="feature-arrow">↗</span></article>
        </div>
      </section>

      <section className="experience">
        <div className="experience-inner">
          <div className="experience-heading"><div className="eyebrow light"><span className="eyebrow-line" />{t.processLabel}</div><h2>{t.processTitle}</h2><div className="experience-orb">P<span>✳</span></div></div>
          <div className="steps">
            <article className="step"><span>01</span><div><h3>{t.step1}</h3><p>{t.step1Text}</p></div><b>↗</b></article>
            <article className="step"><span>02</span><div><h3>{t.step2}</h3><p>{t.step2Text}</p></div><b>↗</b></article>
            <article className="step"><span>03</span><div><h3>{t.step3}</h3><p>{t.step3Text}</p></div><b>↗</b></article>
          </div>
        </div>
      </section>

      <section className="privacy-note section-wrap" id="privacy"><div className="privacy-symbol">◈</div><div><h3>{locale === "zh" ? "值得信赖，从坦诚开始。" : "Trust begins with transparency."}</h3><p>{t.disclaimer}</p></div><span className="privacy-tag">PRIVACY · CARE · CLARITY</span></section>
      <footer><a className="brand footer-brand" href="#"><span className="brand-mark">P</span><span>persona<span className="brand-dot">.</span></span></a><span>{t.footer}</span><span>{t.footerText}</span><span>© 2026</span></footer>
    </main>
  );
}
