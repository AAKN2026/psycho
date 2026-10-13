"use client";

import { useEffect, useMemo, useState } from "react";

type Locale = "en" | "zh";
type Answer = 1 | 2 | 3 | 4 | 5;
type Dimension = "openness" | "conscientiousness" | "extraversion" | "agreeableness" | "emotionalBalance";
type Question = { id: number; dimension: Dimension; reverse?: boolean; zh: string; en: string };
const STORAGE_KEY = "persona-demo-assessment-v1";

const questions: Question[] = [
  { id: 1, dimension: "openness", zh: "我喜欢接触新的想法、观点或体验。", en: "I enjoy exploring new ideas, perspectives, or experiences." },
  { id: 2, dimension: "conscientiousness", zh: "做事时，我通常会提前计划并安排好步骤。", en: "I usually plan ahead and organise the steps before starting a task." },
  { id: 3, dimension: "extraversion", zh: "和一群人交流时，我通常会感到精力充沛。", en: "I generally feel energised when talking with a group of people." },
  { id: 4, dimension: "agreeableness", zh: "即使意见不同，我也会努力理解对方的立场。", en: "Even when I disagree, I try to understand the other person's point of view." },
  { id: 5, dimension: "emotionalBalance", reverse: true, zh: "遇到突发状况时，我很容易陷入焦虑。", en: "Unexpected situations easily leave me feeling anxious." },
  { id: 6, dimension: "openness", zh: "我愿意尝试与自己熟悉方式不同的做法。", en: "I am willing to try approaches that differ from what I am used to." },
  { id: 7, dimension: "conscientiousness", reverse: true, zh: "我经常把事情拖到最后一刻才处理。", en: "I often leave tasks until the last minute." },
  { id: 8, dimension: "extraversion", reverse: true, zh: "在社交场合，我更倾向于先观察而不是主动交谈。", en: "In social settings, I tend to observe before starting conversations." },
  { id: 9, dimension: "agreeableness", zh: "合作时，我愿意在合理范围内作出妥协。", en: "When working with others, I am willing to compromise where reasonable." },
  { id: 10, dimension: "emotionalBalance", zh: "压力过后，我通常能逐渐恢复平静。", en: "After a stressful moment, I can usually regain my calm over time." },
  { id: 11, dimension: "openness", reverse: true, zh: "比起探索未知，我更喜欢一直沿用熟悉的方法。", en: "I prefer familiar methods over exploring the unknown." },
  { id: 12, dimension: "conscientiousness", zh: "即使没有人提醒，我也会尽量完成自己答应的事。", en: "Even without reminders, I try to follow through on my commitments." },
  { id: 13, dimension: "extraversion", zh: "在熟悉的环境里，我通常会主动表达自己的想法。", en: "In a familiar setting, I usually speak up about my ideas." },
  { id: 14, dimension: "agreeableness", reverse: true, zh: "当别人犯错时，我很难不马上批评对方。", en: "When someone makes a mistake, I find it hard not to criticise them immediately." },
  { id: 15, dimension: "emotionalBalance", reverse: true, zh: "事情不顺利时，我会长时间反复想着它。", en: "When things go wrong, I dwell on them for a long time." },
];

const dimensions: { key: Dimension; zh: string; en: string; zhLow: string; enLow: string; zhHigh: string; enHigh: string; zhPrompt: string; enPrompt: string }[] = [
  { key: "openness", zh: "开放探索", en: "Openness", zhLow: "偏好熟悉、具体的方式", enLow: "May prefer familiar, concrete approaches", zhHigh: "乐于探索新想法与体验", enHigh: "May enjoy exploring new ideas and experiences", zhPrompt: "最近有什么新想法，值得你花一点时间去探索？", enPrompt: "What new idea might be worth exploring a little further?" },
  { key: "conscientiousness", zh: "计划与执行", en: "Planning & follow-through", zhLow: "更偏向灵活、随性地推进", enLow: "May prefer a flexible, spontaneous approach", zhHigh: "更重视计划、组织与落实", enHigh: "May value planning, organisation, and follow-through", zhPrompt: "哪一件小事，如果提前安排，会让你这一周更轻松？", enPrompt: "What small task could you plan ahead to make this week easier?" },
  { key: "extraversion", zh: "社交能量", en: "Social energy", zhLow: "可能更需要独处或小范围交流", enLow: "May prefer solitude or smaller conversations", zhHigh: "可能从更多社交互动中获得能量", enHigh: "May draw energy from more social interaction", zhPrompt: "什么样的交流方式最能让你感到自在、有连接感？", enPrompt: "What kind of interaction helps you feel comfortable and connected?" },
  { key: "agreeableness", zh: "合作与体谅", en: "Cooperation & consideration", zhLow: "可能更直接地坚持自己的判断", enLow: "May express independent views more directly", zhHigh: "可能更重视协调与理解他人", enHigh: "May place greater emphasis on harmony and understanding", zhPrompt: "当意见不同时，你怎样既表达自己，也理解对方？", enPrompt: "When views differ, how can you express yourself and understand the other person?" },
  { key: "emotionalBalance", zh: "压力应对", en: "Stress response", zhLow: "近期自我感受可能更容易受压力影响", enLow: "Your current self-view may be more affected by stress", zhHigh: "近期自我感受可能更能保持稳定", enHigh: "Your current self-view may feel relatively steady", zhPrompt: "当压力出现时，哪一种支持或习惯能帮助你恢复？", enPrompt: "When stress appears, what support or habit helps you recover?" },
];

const copy = {
  zh: {
    navAbout: "产品理念", navScience: "科学原则", navPrivacy: "隐私保护", eyebrow: "人格探索 · 更有深度",
    title: "理解自己，\n不被标签定义。", subtitle: "以成熟测评方法为基础，清晰说明测评局限，并将人格洞察转化为值得实践的自我反思。",
    start: "开始体验测评", learn: "了解科学原则", note: "演示体验 · 题目与结果仅用于测试交互，不是经过验证的正式心理测评。",
    trust1: "以证据为基础", trust2: "隐私优先设计", trust3: "洞察而非诊断", sectionLabel: "更审慎的人格测评体验",
    sectionTitle: "不急着给你贴标签，\n而是帮助你理解自己。", card1Title: "看见更完整的自己", card1Text: "探索不同人格维度及其可能呈现的倾向，而不是用一个结果定义你是谁。",
    card2Title: "方法有据可查", card2Text: "正式上线前，题目、评分规则和解释方式都将经过相应审核。", card3Title: "让洞察走进生活", card3Text: "把自我反思转化为工作、人际关系和日常选择中的小行动。",
    processLabel: "测评体验", processTitle: "每一步，都认真对待", step1: "按自己的节奏作答", step1Text: "为手机和电脑设计的清晰双语体验。",
    step2: "了解人格画像", step2Text: "查看本次测评有依据支持的人格维度结果。", step3: "深入理解与实践", step3Text: "未来的深度报告将基于已核实的结果，提供审慎而实用的解释。",
    disclaimer: "人格洞察用于个人反思，不构成心理健康诊断。当前演示题目和分数不具备临床或正式心理测评效力。",
    footer: "PERSONA · 人格洞察实验室", footerText: "认真构建，帮助你看见更多可能。",
    assessmentLabel: "演示测评 · 约 3 分钟", qOf: "第", of: "/", question: "题", scale: ["完全不符合", "比较不符合", "说不清 / 一般", "比较符合", "非常符合"],
    back: "上一题", next: "下一题", finish: "查看演示结果", resume: "继续上次进度", restart: "重新开始", exit: "返回首页",
    required: "请选择一个选项后继续。", resultLabel: "你的演示画像", resultTitle: "一份用于反思的起点", resultIntro: "这些条形图只汇总你在本次演示题目中的选择，不代表经过验证的人格分数，也不与任何人群常模比较。",
    lower: "相对较低", higher: "相对较高", middle: "中间范围", resultDisclaimer: "请注意：这是用于测试产品流程的自编演示题目，不是经验证的心理测量工具。结果不用于诊断、招聘筛选或重大决策。",
    localSave: "答题进度仅保存在当前浏览器中。", progress: "完成进度", agree: "我了解这是演示版本", startAgain: "再体验一次", reportSave: "打印 / 保存为 PDF", reflection: "自我反思",
  },
  en: {
    navAbout: "Our approach", navScience: "Scientific principles", navPrivacy: "Privacy", eyebrow: "PERSONALITY · WITH PERSPECTIVE",
    title: "Understand yourself.\nBeyond a label.", subtitle: "A considered personality insight experience built around established assessment methods, transparent limitations, and practical reflection.",
    start: "Try the demo assessment", learn: "Our scientific approach", note: "Demo experience · Items and results are for interaction testing, not a validated psychological assessment.",
    trust1: "Evidence-informed", trust2: "Private by design", trust3: "Insight, not diagnosis", sectionLabel: "A more thoughtful kind of assessment",
    sectionTitle: "Not a personality box.\nA starting point for insight.", card1Title: "A clearer picture", card1Text: "Explore broad personality dimensions and the patterns they may describe—not a fixed definition of who you are.",
    card2Title: "Grounded in method", card2Text: "Assessment items, scoring rules, and interpretations will be reviewed before release.", card3Title: "Made for real life", card3Text: "Turn reflection into small, practical experiments for work, relationships, and everyday choices.",
    processLabel: "THE EXPERIENCE", processTitle: "Considered at every step", step1: "Answer at your own pace", step1Text: "A clear, bilingual experience designed for mobile and desktop.",
    step2: "See your profile", step2Text: "Review the dimensions shown by this demo experience.", step3: "Go deeper, thoughtfully", step3Text: "Future in-depth reports will connect verified results to careful, practical explanations.",
    disclaimer: "Personality insights are for personal reflection and are not a mental health diagnosis. These demo items and scores have no clinical or formal assessment validity.",
    footer: "PERSONA · PERSONALITY INSIGHT LAB", footerText: "Built with care. Designed for perspective.",
    assessmentLabel: "DEMO ASSESSMENT · ABOUT 3 MIN", qOf: "Question", of: "of", question: "", scale: ["Strongly disagree", "Disagree", "Neither / unsure", "Agree", "Strongly agree"],
    back: "Previous", next: "Next", finish: "View demo results", resume: "Resume previous progress", restart: "Start over", exit: "Home",
    required: "Choose an option to continue.", resultLabel: "YOUR DEMO PROFILE", resultTitle: "A starting point for reflection", resultIntro: "These bars summarise your choices in this demo only. They are not validated personality scores and are not compared with population norms.",
    lower: "Relatively lower", higher: "Relatively higher", middle: "Middle range", resultDisclaimer: "Please note: these original demo items are for testing the product flow, not a validated psychometric instrument. Do not use these results for diagnosis, hiring, or major decisions.",
    localSave: "Your progress is saved only in this browser.", progress: "Progress", agree: "I understand this is a demo", startAgain: "Try again", reportSave: "Print / Save as PDF", reflection: "Reflection prompt",
  },
};

export default function Home() {
  const [locale, setLocale] = useState<Locale>("zh");
  const [view, setView] = useState<"home" | "assessment" | "results">("home");
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, Answer>>({});
  const [hasSaved, setHasSaved] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const t = copy[locale];

  useEffect(() => {
    document.documentElement.lang = locale === "zh" ? "zh-CN" : "en";
  }, [locale]);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === "object" && parsed.answers && typeof parsed.answers === "object") {
          setAnswers(parsed.answers);
          setIndex(Math.min(Math.max(Number(parsed.index) || 0, 0), questions.length - 1));
          setHasSaved(Object.keys(parsed.answers).length > 0);
        }
      }
    } catch { /* Local storage may be unavailable in private browsing. */ }
  }, []);

  useEffect(() => {
    if (Object.keys(answers).length > 0) {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ answers, index }));
        setHasSaved(true);
      } catch { /* The assessment remains usable without local storage. */ }
    }
  }, [answers, index]);

  const answeredCount = Object.keys(answers).length;
  const current = questions[index];
  const scores = useMemo(() => dimensions.map((dimension) => {
    const related = questions.filter((q) => q.dimension === dimension.key);
    const values = related.filter((q) => answers[q.id] !== undefined).map((q) => { const answer = answers[q.id] as Answer; return q.reverse ? 6 - answer : answer; });
    const average = values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 3;
    return { ...dimension, value: Math.round(((average - 1) / 4) * 100) };
  }), [answers]);

  function startAssessment(resume = false) {
    if (!resume) { setAnswers({}); setIndex(0); try { window.localStorage.removeItem(STORAGE_KEY); } catch { /* Ignore unavailable storage. */ } }
    setShowValidation(false);
    setView("assessment");
  }
  function chooseAnswer(value: Answer) {
    setAnswers((previous) => ({ ...previous, [current.id]: value }));
    setShowValidation(false);
  }
  function goNext() {
    if (!answers[current.id]) { setShowValidation(true); return; }
    if (index === questions.length - 1) { setView("results"); return; }
    setIndex((value) => Math.min(value + 1, questions.length - 1));
    setShowValidation(false);
  }
  function goHome() { setView("home"); setShowValidation(false); }
  function restart() {
    setAnswers({}); setIndex(0); setHasSaved(false); setView("assessment"); setShowValidation(false);
    try { window.localStorage.removeItem(STORAGE_KEY); } catch { /* Ignore unavailable storage. */ }
  }

  if (view === "assessment") return (
    <main className="app-shell">
      <header className="topbar"><a className="brand" href="#" onClick={(e) => { e.preventDefault(); goHome(); }}><span className="brand-mark">P</span><span>persona<span className="brand-dot">.</span></span></a><div className="nav-actions"><button className="language-toggle" onClick={() => setLocale(locale === "zh" ? "en" : "zh")}>{locale === "zh" ? "EN" : "中文"} ↗</button><button className="language-toggle" onClick={goHome}>{t.exit} ×</button></div></header>
      <section className="assessment-wrap">
        <div className="assessment-meta"><span className="eyebrow"><span className="eyebrow-line" />{t.assessmentLabel}</span><span className="saved-note">◌ {t.localSave}</span></div>
        <div className="progress-row"><span>{t.progress}</span><strong>{Math.round((answeredCount / questions.length) * 100)}%</strong></div>
        <div className="progress-track"><span style={{ width: `${(answeredCount / questions.length) * 100}%` }} /></div>
        <div className="question-count">{locale === "zh" ? `第 ${index + 1} / ${questions.length} 题` : `QUESTION ${index + 1} OF ${questions.length}`}</div>
        <div className="question-card"><h1>{locale === "zh" ? current.zh : current.en}</h1><p>{locale === "zh" ? "请根据你通常的真实感受作答，没有标准答案。" : "Answer based on how you generally feel. There are no right or wrong answers."}</p>
          <div className="answer-list">{t.scale.map((label, i) => { const value = (i + 1) as Answer; return <button key={value} className={answers[current.id] === value ? "answer-option selected" : "answer-option"} onClick={() => chooseAnswer(value)} aria-pressed={answers[current.id] === value}><span className="answer-number">{value}</span><span>{label}</span><span className="answer-check">{answers[current.id] === value ? "✓" : ""}</span></button>; })}</div>
          {showValidation && <p className="validation-message" role="alert">{t.required}</p>}
        </div>
        <div className="assessment-controls"><button className="button-secondary" onClick={() => { setIndex(0); setShowValidation(false); }} disabled={index === 0}>← {t.back === "Previous" ? "First" : "回到第一题"}</button><div className="control-right"><button className="button-secondary" onClick={() => { setIndex(Math.max(0, index - 1)); setShowValidation(false); }} disabled={index === 0}>{t.back}</button><button className="button-primary" onClick={goNext}>{index === questions.length - 1 ? t.finish : t.next}<span>→</span></button></div></div>
        <p className="assessment-footnote">{t.disclaimer}</p>
      </section>
    </main>
  );

  if (view === "results") return (
    <main className="app-shell">
      <header className="topbar"><a className="brand" href="#" onClick={(e) => { e.preventDefault(); goHome(); }}><span className="brand-mark">P</span><span>persona<span className="brand-dot">.</span></span></a><div className="nav-actions"><button className="language-toggle" onClick={() => setLocale(locale === "zh" ? "en" : "zh")}>{locale === "zh" ? "EN" : "中文"} ↗</button><button className="language-toggle" onClick={goHome}>{t.exit} ×</button></div></header>
      <section className="results-wrap"><div className="eyebrow"><span className="eyebrow-line" />{t.resultLabel}</div><h1>{t.resultTitle}</h1><p className="results-intro">{t.resultIntro}</p>
        <div className="results-grid">{scores.map((score) => <article className="result-card" key={score.key}><div className="result-title-row"><h2>{locale === "zh" ? score.zh : score.en}</h2><span>{score.value}%</span></div><div className="result-track"><span style={{ width: `${score.value}%` }} /></div><div className="result-range"><span>{t.lower}</span><span>{t.higher}</span></div><p>{score.value < 40 ? (locale === "zh" ? score.zhLow : score.enLow) : score.value > 60 ? (locale === "zh" ? score.zhHigh : score.enHigh) : t.middle}</p><div className="reflection-prompt"><span>{t.reflection}</span><p>{locale === "zh" ? score.zhPrompt : score.enPrompt}</p></div></article>)}</div>
        <div className="results-disclaimer"><span>✳</span><p>{t.resultDisclaimer}</p></div><div className="results-actions"><button className="button-primary" onClick={restart}>{t.startAgain}<span>↻</span></button><button className="button-secondary" onClick={() => window.print()}>{t.reportSave} ↗</button><button className="button-secondary" onClick={goHome}>{t.exit}</button></div>
      </section>
      <footer><a className="brand footer-brand" href="#" onClick={(e) => { e.preventDefault(); goHome(); }}><span className="brand-mark">P</span><span>persona<span className="brand-dot">.</span></span></a><span>{t.footer}</span><span>© 2026</span></footer>
    </main>
  );

  return (
    <main>
      <header className="topbar">
        <a className="brand" href="#" aria-label="Persona home"><span className="brand-mark">P</span><span>persona<span className="brand-dot">.</span></span></a>
        <nav className="nav-links"><a href="#approach">{t.navAbout}</a><a href="#science">{t.navScience}</a><a href="#privacy">{t.navPrivacy}</a></nav>
        <div className="nav-actions"><button className="language-toggle" onClick={() => setLocale(locale === "zh" ? "en" : "zh")} aria-label="Switch language">{locale === "zh" ? "EN" : "中文"} <span>↗</span></button><button className="nav-cta" onClick={() => startAssessment()}>{t.start} <span>↗</span></button></div>
      </header>
      <section className="hero">
        <div className="hero-copy"><div className="eyebrow"><span className="eyebrow-line" />{t.eyebrow}</div><h1>{t.title.split("\n").map((line, i) => <span key={i}>{line}{i === 0 && <br />}</span>)}</h1><p className="hero-subtitle">{t.subtitle}</p>
          <div className="hero-actions"><button className="button-primary" onClick={() => startAssessment()}>{t.start}<span>↗</span></button><a className="button-text" href="#science">{t.learn}<span>↓</span></a></div>
          {hasSaved && <button className="resume-button" onClick={() => startAssessment(true)}>{t.resume} · {answeredCount}/{questions.length}</button>}
          <p className="preview-note"><span className="status-dot" />{t.note}</p>
        </div>
        <div className="hero-art" aria-label="Abstract layered personality profile illustration"><div className="art-orbit orbit-one" /><div className="art-orbit orbit-two" /><div className="art-orbit orbit-three" /><div className="art-disc"><div className="disc-inner"><span className="disc-caption">A LITTLE CLOSER</span><span className="disc-title">to<br />yourself.</span><span className="disc-star">✳</span></div></div><div className="floating-card card-top"><span className="mini-label">SELF · AWARENESS</span><span className="mini-line" /><span className="mini-line short" /></div><div className="floating-card card-bottom"><span className="card-spark">✳</span><span><strong>Room to grow</strong><small>Every trait has context.</small></span></div><div className="art-index">01 — 05<br />A PERSONAL JOURNEY</div></div>
        <div className="hero-bottom"><span>01 / 03</span><div className="hero-bottom-line" /><span>THE ART OF SELF-UNDERSTANDING</span></div>
      </section>
      <section className="trust-strip" id="science"><span>{t.trust1}</span><i>✳</i><span>{t.trust2}</span><i>✳</i><span>{t.trust3}</span></section>
      <section className="approach section-wrap" id="approach"><div className="section-heading"><div className="eyebrow"><span className="eyebrow-line" />{t.sectionLabel}</div><h2>{t.sectionTitle.split("\n").map((line, i) => <span key={i}>{line}{i === 0 && <br />}</span>)}</h2></div><div className="feature-grid"><article className="feature-card"><span className="feature-number">01</span><div className="feature-icon icon-profile">◌</div><h3>{t.card1Title}</h3><p>{t.card1Text}</p><span className="feature-arrow">↗</span></article><article className="feature-card feature-highlight"><span className="feature-number">02</span><div className="feature-icon icon-method">✳</div><h3>{t.card2Title}</h3><p>{t.card2Text}</p><span className="feature-arrow">↗</span></article><article className="feature-card"><span className="feature-number">03</span><div className="feature-icon icon-growth">↗</div><h3>{t.card3Title}</h3><p>{t.card3Text}</p><span className="feature-arrow">↗</span></article></div></section>
      <section className="experience"><div className="experience-inner"><div className="experience-heading"><div className="eyebrow light"><span className="eyebrow-line" />{t.processLabel}</div><h2>{t.processTitle}</h2><div className="experience-orb">P<span>✳</span></div></div><div className="steps"><article className="step"><span>01</span><div><h3>{t.step1}</h3><p>{t.step1Text}</p></div><b>↗</b></article><article className="step"><span>02</span><div><h3>{t.step2}</h3><p>{t.step2Text}</p></div><b>↗</b></article><article className="step"><span>03</span><div><h3>{t.step3}</h3><p>{t.step3Text}</p></div><b>↗</b></article></div></div></section>
      <section className="privacy-note section-wrap" id="privacy"><div className="privacy-symbol">◈</div><div><h3>{locale === "zh" ? "值得信赖，从坦诚开始。" : "Trust begins with transparency."}</h3><p>{t.disclaimer}</p></div><span className="privacy-tag">PRIVACY · CARE · CLARITY</span></section>
      <footer><a className="brand footer-brand" href="#"><span className="brand-mark">P</span><span>persona<span className="brand-dot">.</span></span></a><span>{t.footer}</span><span>{t.footerText}</span><span>© 2026</span></footer>
    </main>
  );
}
