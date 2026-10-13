"use client";

import { useEffect, useMemo, useState } from "react";

type Locale = "en" | "zh";
type Answer = 1 | 2 | 3 | 4 | 5;
type Dimension = "openness" | "conscientiousness" | "extraversion" | "agreeableness" | "emotionalBalance";
type Question = { id: number; dimension: Dimension; reverse?: boolean; zh: string; en: string };
const STORAGE_KEY = "persona-demo-assessment-v1";
const PUBLIC_APPS_SCRIPT_ENDPOINT = "https://script.google.com/macros/s/AKfycbx3pfNcWNE5ocr2jrMi-ttthLjW16B-ujscREoTwogT8Mpkn7TT-kAJ7xa2gXDDQDBq9Q/exec";

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
  const [reflectionNote, setReflectionNote] = useState("");
  const [cloudConsent, setCloudConsent] = useState(false);
  const [cloudSaveStatus, setCloudSaveStatus] = useState<"idle" | "invalid" | "consent" | "sending" | "sent" | "error">("idle");
  const [accessCode, setAccessCode] = useState("");
  const [lookupCode, setLookupCode] = useState("");
  const [lookupStatus, setLookupStatus] = useState<"idle" | "loading" | "error">("idle");
  const [retrievedScores, setRetrievedScores] = useState<Record<Dimension, number> | null>(null);
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

  useEffect(() => {
    try {
      setReflectionNote(window.localStorage.getItem("persona-reflection-note-v1") || "");
    } catch { /* Reflection notes remain optional when storage is unavailable. */ }
  }, []);

  async function saveResultToGoogleSheets() {
    if (!cloudConsent) { setCloudSaveStatus("consent"); return; }
    const endpoint = PUBLIC_APPS_SCRIPT_ENDPOINT;
    setCloudSaveStatus("sending");
    const recordId = `psn_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
    const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    const randomBytes = new Uint8Array(12);
    window.crypto.getRandomValues(randomBytes);
    const rawCode = Array.from(randomBytes, (byte) => alphabet[byte % alphabet.length]).join("");
    const generatedCode = `${rawCode.slice(0,4)}-${rawCode.slice(4,8)}-${rawCode.slice(8,12)}`;
    setAccessCode(generatedCode);
    const payload = {
      action: "save_demo_result",
      schemaVersion: 1,
      recordId,
      accessCode: generatedCode,
      locale,
      createdAt: new Date().toISOString(),
      scores: Object.fromEntries(scores.map((score) => [score.key, score.value])),
      consent: true,
    };
    try {
      // Apps Script web apps often return an opaque cross-origin response.
      // Do not send raw answers, names, email addresses, or reflection notes.
      await fetch(endpoint, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload),
      });
      setCloudSaveStatus("sent");
    } catch {
      setCloudSaveStatus("error");
    }
  }

  function retrieveResultByCode() {
    const code = lookupCode.toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (code.length !== 12) { setLookupStatus("error"); return; }
    setLookupStatus("loading");
    const formattedCode = `${code.slice(0,4)}-${code.slice(4,8)}-${code.slice(8,12)}`;
    const callbackName = `personaCallback_${Date.now()}_${Math.random().toString(36).slice(2,8)}`;
    const globalWindow = window as unknown as Record<string, unknown>;
    const callback = (result: { ok?: boolean; locale?: Locale; scores?: Record<Dimension, number> }) => {
      delete globalWindow[callbackName];
      if (!result?.ok || !result.scores) { setLookupStatus("error"); return; }
      setRetrievedScores(result.scores);
      if (result.locale === "zh" || result.locale === "en") setLocale(result.locale);
      setLookupStatus("idle");
      setView("results");
    };
    globalWindow[callbackName] = callback;
    const script = document.createElement("script");
    script.src = `${PUBLIC_APPS_SCRIPT_ENDPOINT}?action=retrieve&code=${encodeURIComponent(formattedCode)}&callback=${callbackName}`;
    script.onerror = () => { delete globalWindow[callbackName]; setLookupStatus("error"); };
    document.body.appendChild(script);
  }

  function saveReflectionNote(value: string) {
    setReflectionNote(value);
    try {
      if (value.trim()) window.localStorage.setItem("persona-reflection-note-v1", value);
      else window.localStorage.removeItem("persona-reflection-note-v1");
    } catch { /* Keep the current note in memory if local storage is unavailable. */ }
  }

  function downloadReflectionNote() {
    if (!reflectionNote.trim()) return;
    const title = locale === "zh" ? "Persona 个人反思记录" : "Persona Reflection Note";
    const content = `${title}\n${new Date().toLocaleString(locale === "zh" ? "zh-SG" : "en-SG")}\n\n${reflectionNote}\n\n${locale === "zh" ? "仅供个人反思；不构成心理诊断。" : "For personal reflection only; not a psychological diagnosis."}\n`;
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = locale === "zh" ? "persona-个人反思.txt" : "persona-reflection-note.txt";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  const answeredCount = Object.keys(answers).length;
  const current = questions[index];
  const scores = useMemo(() => retrievedScores ? dimensions.map((dimension) => ({ ...dimension, value: retrievedScores[dimension.key] })) : dimensions.map((dimension) => {
    const related = questions.filter((q) => q.dimension === dimension.key);
    const values = related.filter((q) => answers[q.id] !== undefined).map((q) => { const answer = answers[q.id] as Answer; return q.reverse ? 6 - answer : answer; });
    const average = values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 3;
    return { ...dimension, value: Math.round(((average - 1) / 4) * 100) };
  }), [answers, retrievedScores]);

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
    setRetrievedScores(null); setAccessCode(""); setAnswers({}); setIndex(0); setHasSaved(false); setView("assessment"); setShowValidation(false);
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
        <section className="cloud-save-panel" aria-labelledby="cloud-save-title">
          <div className="reflection-heading">
            <div className="eyebrow"><span className="eyebrow-line" />{locale === "zh" ? "可选 · Google Sheets" : "OPTIONAL · GOOGLE SHEETS"}</div>
            <h2 id="cloud-save-title">{locale === "zh" ? "保存这份演示结果。" : "Save this demo result."}</h2>
            <p>{locale === "zh" ? "经你同意后，本网站会尝试把匿名维度分数保存到网站运营者管理的 Google 表格，而不是访客自己的表格。不会上传逐题答案、姓名、邮箱或个人反思笔记。" : "With your consent, this site will attempt to save anonymous dimension scores to a Google Sheet managed by the site operator, not your own sheet. Individual answers, names, email addresses, and reflection notes are not sent."}</p>
          </div>
          <p className="cloud-save-hint">{locale === "zh" ? "数据接收端由网站统一配置，访客无需输入 Google 链接。只有勾选同意并主动点击保存后才会发送。" : "The endpoint is configured by the site operator. Visitors do not need to enter a Google URL. Data is sent only after consent and an explicit save click."}</p>
          <label className="cloud-consent-row"><input type="checkbox" checked={cloudConsent} onChange={(event) => { setCloudConsent(event.target.checked); setCloudSaveStatus("idle"); }} /><span>{locale === "zh" ? "我同意将本次演示的匿名维度分数、语言和提交时间保存到本网站运营者管理的 Google Sheets。" : "I agree to save my anonymous demo dimension scores, language, and submission time to a Google Sheet managed by this website operator."}</span></label>
          <div className="cloud-save-actions"><button className="button-primary" onClick={saveResultToGoogleSheets} disabled={cloudSaveStatus === "sending"}>{cloudSaveStatus === "sending" ? (locale === "zh" ? "正在发送…" : "Sending…") : (locale === "zh" ? "保存到 Google Sheets" : "Save to Google Sheets")} <span>↗</span></button><span className="cloud-save-hint">{locale === "zh" ? "需先勾选同意，再主动点击保存。" : "Consent and an explicit save click are required."}</span></div>
          {cloudSaveStatus !== "idle" && <p className={cloudSaveStatus === "error" || cloudSaveStatus === "invalid" || cloudSaveStatus === "consent" ? "cloud-save-status error" : "cloud-save-status"} role="status">{cloudSaveStatus === "invalid" ? (locale === "zh" ? "保存配置无效。" : "Save configuration is invalid.") : cloudSaveStatus === "consent" ? (locale === "zh" ? "请先勾选同意项，再提交。" : "Please check the consent box before submitting.") : cloudSaveStatus === "sending" ? (locale === "zh" ? "正在发送请求…" : "Sending request…") : cloudSaveStatus === "sent" ? (locale === "zh" ? "保存请求已发送。请妥善保存下面的提取码；首次上线测试时，请确认后台确实新增了记录。" : "Save request sent. Keep the extraction code below. During launch testing, verify the record was actually stored.") : (locale === "zh" ? "发送失败，请检查网络。" : "Could not send. Check your connection.")}</p>}
          {cloudSaveStatus === "sent" && accessCode && <div className="access-code-card"><strong>{locale === "zh" ? "你的报告提取码" : "Your report retrieval code"}</strong><code>{accessCode}</code><p>{locale === "zh" ? "请立即复制保存。以后打开首页的「找回我的报告」，输入此码即可尝试取回本次结果。" : "Copy and keep this code. Later, use “Retrieve my report” on the home page to look up this result."}</p><button className="button-secondary" onClick={() => navigator.clipboard.writeText(accessCode)}>{locale === "zh" ? "复制提取码" : "Copy code"} ↗</button></div>}
          <p className="cloud-security-note">{locale === "zh" ? "重要：Apps Script 的公开 Web App 接口不是私密 API。当前仅适合低风险演示数据；不要提交真实心理健康信息或可识别个人身份的数据。正式公开运营前应增加服务端滥用防护和隐私评估。" : "Important: a public Apps Script web app is not a private API. This is for low-risk demo data only; do not submit real mental-health information or identifying data. Add server-side abuse controls and a privacy review before public production use."}</p>
        </section>
        <section className="personal-reflection" aria-labelledby="personal-reflection-title">
          <div className="reflection-heading">
            <div className="eyebrow"><span className="eyebrow-line" />{locale === "zh" ? "给未来的自己" : "A NOTE TO YOURSELF"}</div>
            <h2 id="personal-reflection-title">{locale === "zh" ? "把洞察写下来。" : "Make space to reflect."}</h2>
            <p>{locale === "zh" ? "写下一件你想留意的事，或一个准备尝试的小行动。内容只保存在当前浏览器，不会上传。" : "Capture something you want to notice or one small action to try. This note stays in this browser and is not uploaded."}</p>
          </div>
          <label className="reflection-label" htmlFor="personal-reflection-note">{locale === "zh" ? "我的反思记录" : "MY REFLECTION NOTE"}</label>
          <textarea id="personal-reflection-note" className="reflection-textarea" value={reflectionNote} onChange={(event) => saveReflectionNote(event.target.value)} maxLength={3000} placeholder={locale === "zh" ? "例如：当我更早安排重要任务时，我会感到……" : "For example: When I plan an important task earlier, I notice…"} />
          <div className="reflection-note-footer"><span>{locale === "zh" ? "仅本地保存 · 最多 3,000 字符" : "Saved locally · Up to 3,000 characters"}</span><span>{reflectionNote.length}/3000</span></div>
          <div className="reflection-note-actions"><div className="reflection-note-buttons"><button className="button-secondary" onClick={() => saveReflectionNote("")}>{locale === "zh" ? "清空记录" : "Clear note"}</button><button className="button-secondary" onClick={downloadReflectionNote} disabled={!reflectionNote.trim()}>{locale === "zh" ? "下载 TXT" : "Download TXT"} ↗</button></div><span>{locale === "zh" ? "重新打开此浏览器时，记录通常仍会保留。" : "Your note should remain when you return in this browser."}</span></div>
        </section>
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
      <section className="faq-section section-wrap" id="faq">
        <div className="faq-heading">
          <div className="eyebrow"><span className="eyebrow-line" />{locale === "zh" ? "清晰 · 诚实 · 有边界" : "CLARITY · HONESTY · CONTEXT"}</div>
          <h2>{locale === "zh" ? "开始之前，先了解这些。" : "A few things worth knowing."}</h2>
          <p>{locale === "zh" ? "好的测评不仅要提供结果，也要解释结果能说明什么、不能说明什么。" : "A thoughtful assessment explains not only what a result says, but also what it cannot tell you."}</p>
        </div>
        <div className="faq-list">
          <details className="faq-item"><summary>{locale === "zh" ? "这是一份正式、经过科学验证的心理测评吗？" : "Is this a validated psychological assessment?"}<span>＋</span></summary><p>{locale === "zh" ? "不是。当前版本是用于体验产品流程的自编演示问卷，题目与分数尚未经过正式信效度研究，也没有人群常模。正式测评需要先核实量表、授权、翻译与评分方法。" : "No. This is an original demo questionnaire for testing the product experience. Its items and scores have not undergone formal reliability or validity studies and have no population norms. A formal assessment requires a reviewed instrument, appropriate licensing, translation review, and scoring methodology."}</p></details>
          <details className="faq-item"><summary>{locale === "zh" ? "我的回答会被上传或分享吗？" : "Are my answers uploaded or shared?"}<span>＋</span></summary><p>{locale === "zh" ? "答题进度与反思笔记保存在当前浏览器本地。只有当你在结果页主动填写 Apps Script 接口、勾选同意并点击保存时，系统才会尝试把演示分数与基本记录写入你配置的 Google Sheets；不会发送原始答案、反思笔记、姓名、邮箱或电话。由于浏览器跨域限制，页面提示发送后仍需到表格确认是否新增记录。" : "Assessment progress and reflection notes are stored locally in your current browser. Only if you enter an Apps Script endpoint on the results page, give consent, and click save will the app attempt to send demo scores and a basic record to the Google Sheet you configured. It does not send raw answers, reflection notes, your name, email, or phone number. Because of browser cross-origin limits, verify the new row in the sheet even if the page says the request was sent."}</p></details>
          <details className="faq-item"><summary>{locale === "zh" ? "结果可以用来判断我适合什么工作或关系吗？" : "Can the results tell me which job or relationship suits me?"}<span>＋</span></summary><p>{locale === "zh" ? "不可以。这里的结果不是经过验证的测量，不能作为招聘、诊断、升学、关系或其他重大决定的依据。你可以把反思问题当作自我观察的起点，再结合真实经历与具体情境。" : "No. These results are not validated measurements and should not guide hiring, diagnosis, education, relationship, or other consequential decisions. Use the reflection prompts only as a starting point for self-observation alongside real experiences and context."}</p></details>
          <details className="faq-item"><summary>{locale === "zh" ? "为什么提供中英文切换？" : "Why offer both Chinese and English?"}<span>＋</span></summary><p>{locale === "zh" ? "为了让不同语言背景的使用者更容易体验产品。不过，同一题目的翻译并不自动代表两种语言版本具有相同的测量效果；正式发布前仍需进行语言审校与相应验证。" : "To make the experience accessible across language preferences. However, translating an item does not automatically make both language versions equivalent measures; language review and appropriate validation are still needed before formal release."}</p></details>
        </div>
      </section>
      <section className="retrieve-report section-wrap" aria-labelledby="retrieve-report-title">
        <div className="eyebrow"><span className="eyebrow-line" />{locale === "zh" ? "无需注册" : "NO ACCOUNT REQUIRED"}</div>
        <h2 id="retrieve-report-title">{locale === "zh" ? "找回我的报告" : "Retrieve my report"}</h2>
        <p>{locale === "zh" ? "输入保存结果时获得的提取码，即可尝试在其他设备找回原来的维度分数。" : "Enter the code you received when saving to retrieve your original dimension scores, even on another device."}</p>
        <div className="retrieve-form"><input aria-label={locale === "zh" ? "报告提取码" : "Report retrieval code"} value={lookupCode} onChange={(event) => { setLookupCode(event.target.value.toUpperCase()); setLookupStatus("idle"); }} placeholder="XXXX-XXXX-XXXX" maxLength={14} /><button className="button-primary" onClick={retrieveResultByCode} disabled={lookupStatus === "loading"}>{lookupStatus === "loading" ? (locale === "zh" ? "正在查询…" : "Looking up…") : (locale === "zh" ? "找回结果" : "Retrieve result")} ↗</button></div>
        {lookupStatus === "error" && <p className="cloud-save-status error">{locale === "zh" ? "未找到记录，或服务暂时不可用。请检查提取码，并确认后台部署已更新。" : "Record not found or service unavailable. Check the code and confirm the backend deployment is updated."}</p>}
      </section>
      <section className="closing-cta">
        <div className="eyebrow light"><span className="eyebrow-line" />{locale === "zh" ? "留一点空间给自己" : "MAKE ROOM FOR REFLECTION"}</div>
        <h2>{locale === "zh" ? "不必急着定义自己。\n先从一个好问题开始。" : "You don't need a label.\nStart with a better question."}</h2>
        <p>{locale === "zh" ? "用几分钟完成演示体验，带着一个值得思考的问题回到日常生活。" : "Spend a few minutes with the demo, and take one useful question back into everyday life."}</p>
        <button className="button-primary" onClick={() => startAssessment()}>{t.start}<span>↗</span></button>
      </section>
            <footer><a className="brand footer-brand" href="#"><span className="brand-mark">P</span><span>persona<span className="brand-dot">.</span></span></a><span>{t.footer}</span><span>{t.footerText}</span><a href="/psycho/privacy/">{locale === "zh" ? "隐私说明" : "Privacy notice"}</a><span>© 2026</span></footer>
    </main>
  );
}
