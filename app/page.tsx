"use client";

import { useEffect, useMemo, useState } from "react";
import { IPIP_FACETS, IPIP_NEO_120, IPIP_REVERSE_KEYED } from "../data/ipip-neo-120";
import { facetItemIds, factorItemIds, scoreItemIds } from "../lib/scoring.mjs";

type Locale = "en" | "zh";
type Answer = 1 | 2 | 3 | 4 | 5;
type Dimension = "openness" | "conscientiousness" | "extraversion" | "agreeableness" | "emotionalBalance";
type Question = { id: number; dimension: Dimension; reverse?: boolean; zh: string; en: string };
const STORAGE_KEY = "persona-ipip-neo-120-v1";
const PUBLIC_APPS_SCRIPT_ENDPOINT = "https://script.google.com/macros/s/AKfycbx3pfNcWNE5ocr2jrMi-ttthLjW16B-ujscREoTwogT8Mpkn7TT-kAJ7xa2gXDDQDBq9Q/exec";

const questions: Question[] = IPIP_NEO_120.map((item) => {
  const dimension = (["emotionalBalance", "extraversion", "openness", "agreeableness", "conscientiousness"] as const)[(item.id - 1) % 5];
  const originalReverse = IPIP_REVERSE_KEYED.has(item.id);
  // The inventory's Neuroticism items are inverted for the app's Emotional Stability factor.
  return { id: item.id, dimension, reverse: dimension === "emotionalBalance" ? !originalReverse : originalReverse, zh: item.zh, en: item.en };
});

const dimensions: { key: Dimension; zh: string; en: string; zhLow: string; enLow: string; zhHigh: string; enHigh: string; zhPrompt: string; enPrompt: string }[] = [
  { key: "openness", zh: "开放性", en: "Openness to experience", zhLow: "偏好熟悉、具体的方式", enLow: "May prefer familiar, concrete approaches", zhHigh: "乐于探索新想法与体验", enHigh: "May enjoy exploring new ideas and experiences", zhPrompt: "最近有什么新想法，值得你花一点时间去探索？", enPrompt: "What new idea might be worth exploring a little further?" },
  { key: "conscientiousness", zh: "尽责性", en: "Conscientiousness", zhLow: "更偏向灵活、随性地推进", enLow: "May prefer a flexible, spontaneous approach", zhHigh: "更重视计划、组织与落实", enHigh: "May value planning, organisation, and follow-through", zhPrompt: "哪一件小事，如果提前安排，会让你这一周更轻松？", enPrompt: "What small task could you plan ahead to make this week easier?" },
  { key: "extraversion", zh: "外向性", en: "Extraversion", zhLow: "可能更需要独处或小范围交流", enLow: "May prefer solitude or smaller conversations", zhHigh: "可能从更多社交互动中获得能量", enHigh: "May draw energy from more social interaction", zhPrompt: "什么样的交流方式最能让你感到自在、有连接感？", enPrompt: "What kind of interaction helps you feel comfortable and connected?" },
  { key: "agreeableness", zh: "宜人性", en: "Agreeableness", zhLow: "可能更直接地坚持自己的判断", enLow: "May express independent views more directly", zhHigh: "可能更重视协调与理解他人", enHigh: "May place greater emphasis on harmony and understanding", zhPrompt: "当意见不同时，你怎样既表达自己，也理解对方？", enPrompt: "When views differ, how can you express yourself and understand the other person?" },
  { key: "emotionalBalance", zh: "情绪稳定性", en: "Emotional stability", zhLow: "近期自我报告显示，你可能更容易受到负面情绪影响", enLow: "Your responses suggest negative emotions may affect you more readily", zhHigh: "近期自我报告显示，你可能更容易恢复情绪平衡", enHigh: "Your responses suggest you may recover emotional balance more readily", zhPrompt: "面对压力时，什么能帮助你恢复平衡？", enPrompt: "When under stress, what helps you regain balance?" },
];

const copy = {
  zh: {
    navAbout: "产品理念", navScience: "科学原则", navPrivacy: "隐私保护", eyebrow: "人格探索 · 更有深度",
    title: "理解自己，\n不被标签定义。", subtitle: "以有研究依据的人格量表为核心，查看五大人格维度与细分侧面，并把结果转化为具体的自我反思。",
    start: "开始人格测评", learn: "了解科学原则", note: "基于公开研究的人格量表 · 结果用于自我理解；新加坡双语常模与本地验证仍需进一步研究。",
    trust1: "以证据为基础", trust2: "隐私优先设计", trust3: "洞察而非诊断", sectionLabel: "更审慎的人格测评体验",
    sectionTitle: "不急着给你贴标签，\n而是帮助你理解自己。", card1Title: "看见更完整的自己", card1Text: "探索不同人格维度及其可能呈现的倾向，而不是用一个结果定义你是谁。",
    card2Title: "方法有据可查", card2Text: "正式上线前，题目、评分规则和解释方式都将经过相应审核。", card3Title: "让洞察走进生活", card3Text: "把自我反思转化为工作、人际关系和日常选择中的小行动。",
    processLabel: "测评体验", processTitle: "每一步，都认真对待", step1: "按自己的节奏作答", step1Text: "为手机和电脑设计的清晰双语体验。",
    step2: "了解人格画像", step2Text: "查看五大人格维度与 30 个细分侧面的作答结果。", step3: "深入理解与实践", step3Text: "未来的深度报告将基于已核实的结果，提供审慎而实用的解释。",
    disclaimer: "本体验采用 IPIP-NEO-120 公开人格量表的普通话题目与英文原题。结果用于个人反思，不是诊断；新加坡本地双语常模与独立验证尚未建立。",
    footer: "PERSONA · 人格洞察实验室", footerText: "认真构建，帮助你看见更多可能。",
    assessmentLabel: "IPIP-NEO-120 · 约 15–20 分钟", qOf: "第", of: "/", question: "题", scale: ["非常不准确", "比较不准确", "中等 / 不确定", "比较准确", "非常准确"],
    back: "上一题", next: "下一题", finish: "查看测评结果", resume: "继续上次进度", restart: "重新开始", exit: "返回首页",
    required: "请选择一个选项后继续。", resultLabel: "你的五大人格画像", resultTitle: "理解倾向，而不是给自己定型", resultIntro: "分数按量表评分规则计算，并将 1–5 的平均反应换算为 0–100 方便阅读；这不是百分位，也不代表你相对于新加坡人群的位置。",
    lower: "相对较低", higher: "相对较高", middle: "中间范围", resultDisclaimer: "本报告不是临床诊断，也不应用于招聘、升学筛选或其他重大决策。量表虽有公开研究及普通话版本资料，但本网站尚未完成新加坡样本的独立验证；分数会受作答情境、语言理解和当下状态影响。",
    localSave: "答题进度保存在当前浏览器的本地存储中，未加密；共享设备请在完成后清除。", progress: "完成进度", agree: "我了解结果仅供个人反思，不是诊断或本地常模排名", startAgain: "再体验一次", reportSave: "打印 / 保存为 PDF", reflection: "自我反思", clearLocal: "清除本机保存的数据",
  },
  en: {
    navAbout: "Our approach", navScience: "Scientific principles", navPrivacy: "Privacy", eyebrow: "PERSONALITY · WITH PERSPECTIVE",
    title: "Understand yourself.\nBeyond a label.", subtitle: "A research-based personality inventory with five broad factors, 30 facets, transparent limitations, and practical reflection.",
    start: "Start personality assessment", learn: "Our scientific approach", note: "Research-based personality inventory · For self-understanding; local Singapore bilingual norms and validation remain to be established.",
    trust1: "Evidence-informed", trust2: "Private by design", trust3: "Insight, not diagnosis", sectionLabel: "A more thoughtful kind of assessment",
    sectionTitle: "Not a personality box.\nA starting point for insight.", card1Title: "A clearer picture", card1Text: "Explore broad personality dimensions and the patterns they may describe—not a fixed definition of who you are.",
    card2Title: "Grounded in method", card2Text: "Assessment items, scoring rules, and interpretations will be reviewed before release.", card3Title: "Made for real life", card3Text: "Turn reflection into small, practical experiments for work, relationships, and everyday choices.",
    processLabel: "THE EXPERIENCE", processTitle: "Considered at every step", step1: "Answer at your own pace", step1Text: "A clear, bilingual experience designed for mobile and desktop.",
    step2: "See your profile", step2Text: "Review your five broad factors and 30 personality facets.", step3: "Go deeper, thoughtfully", step3Text: "Future in-depth reports will connect verified results to careful, practical explanations.",
    disclaimer: "This experience uses the public-domain IPIP-NEO-120 items in English and Mandarin. Results are for reflection, not diagnosis; independent Singapore bilingual norms and validation have not been established.",
    footer: "PERSONA · PERSONALITY INSIGHT LAB", footerText: "Built with care. Designed for perspective.",
    assessmentLabel: "IPIP-NEO-120 · ABOUT 15–20 MIN", qOf: "Question", of: "of", question: "", scale: ["Very inaccurate", "Somewhat inaccurate", "Neither / unsure", "Somewhat accurate", "Very accurate"],
    back: "Previous", next: "Next", finish: "View results", resume: "Resume previous progress", restart: "Start over", exit: "Home",
    required: "Choose an option to continue.", resultLabel: "YOUR FIVE-FACTOR PROFILE", resultTitle: "Understand tendencies, not labels", resultIntro: "Scores follow the inventory scoring key. Mean responses on the 1–5 scale are displayed as 0–100 for readability; these are not percentiles and do not rank you against a Singapore population norm.",
    lower: "Relatively lower", higher: "Relatively higher", middle: "Middle range", resultDisclaimer: "This is not a clinical diagnosis and should not be used for hiring, admissions screening, or other consequential decisions. Although the inventory has published research and Mandarin-version evidence, this site has not independently validated it in a Singapore sample; responses can vary with context, language, and current state.",
    localSave: "Progress is stored in this browser’s local storage and is not encrypted; clear it after use on shared devices.", progress: "Progress", agree: "I understand results are for reflection, not diagnosis or local norm ranking", startAgain: "Try again", reportSave: "Print / Save as PDF", reflection: "Reflection prompt", clearLocal: "Clear data on this device",
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
  const [visualAnswers, setVisualAnswers] = useState<Record<number, number>>({});
  const [visualFeedback, setVisualFeedback] = useState(false);
  const [visualMeaning, setVisualMeaning] = useState<string | null>(null);
  const [sensoryAnswers, setSensoryAnswers] = useState<Record<string, string>>({});
  const [sensorySummary, setSensorySummary] = useState(false);
  const [soundStarted, setSoundStarted] = useState(false);
  const [soundTrials, setSoundTrials] = useState<boolean[]>([]);
  const [soundAnswers, setSoundAnswers] = useState<(boolean | null)[]>([]);
  const [soundIndex, setSoundIndex] = useState(0);
  const [soundPlayed, setSoundPlayed] = useState(false);
  const [soundPlaying, setSoundPlaying] = useState(false);
  const [soundComplete, setSoundComplete] = useState(false);
  const [soundError, setSoundError] = useState(false);
  const t = copy[locale];

  function startSoundActivity() {
    const trials = [false, false, false, true, true, true];
    for (let i = trials.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [trials[i], trials[j]] = [trials[j], trials[i]];
    }
    setSoundTrials(trials);
    setSoundAnswers(Array(6).fill(null));
    setSoundIndex(0);
    setSoundPlayed(false);
    setSoundPlaying(false);
    setSoundComplete(false);
    setSoundError(false);
    setSoundStarted(true);
  }

  async function playSoundPair() {
    if (soundPlaying || soundComplete || soundTrials.length !== 6) return;
    setSoundPlaying(true);
    setSoundError(false);
    let context: AudioContext | undefined;
    try {
      const AudioContextConstructor = window.AudioContext;
      if (!AudioContextConstructor) throw new Error("Web Audio is unavailable");
      context = new AudioContextConstructor();
      await context.resume();
      const firstStart = context.currentTime + 0.08;
      const duration = 0.24;
      const gap = 0.18;
      const frequencies = soundTrials[soundIndex] ? [523.25, 440] : [440, 523.25];
      frequencies.forEach((frequency, i) => {
        const startAt = firstStart + i * (duration + gap);
        const oscillator = context!.createOscillator();
        const gain = context!.createGain();
        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(frequency, startAt);
        gain.gain.setValueAtTime(0.0001, startAt);
        gain.gain.exponentialRampToValueAtTime(0.055, startAt + 0.025);
        gain.gain.setValueAtTime(0.055, startAt + duration - 0.035);
        gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);
        oscillator.connect(gain);
        gain.connect(context!.destination);
        oscillator.start(startAt);
        oscillator.stop(startAt + duration + 0.01);
      });
      await new Promise<void>((resolve) => window.setTimeout(resolve, 850));
      await context.close();
      setSoundPlayed(true);
    } catch {
      if (context && context.state !== "closed") {
        try { await context.close(); } catch { /* Audio context may already be closed. */ }
      }
      setSoundError(true);
    } finally {
      setSoundPlaying(false);
    }
  }

  function answerSoundPair(different: boolean) {
    if (!soundPlayed || soundComplete || soundTrials.length !== 6) return;
    const nextAnswers = soundAnswers.slice();
    nextAnswers[soundIndex] = different;
    setSoundAnswers(nextAnswers);
    setSoundPlayed(false);
    if (soundIndex === soundTrials.length - 1) {
      setSoundComplete(true);
    } else {
      setSoundIndex((current) => current + 1);
    }
  }

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
    let timeoutId: number | undefined;
    let script: HTMLScriptElement | undefined;
    const cleanup = () => {
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
      if (script) script.remove();
      delete globalWindow[callbackName];
    };
    const callback = (result: { ok?: boolean; locale?: Locale; scores?: Record<Dimension, number> }) => {
      cleanup();
      const keys: Dimension[] = ["openness", "conscientiousness", "extraversion", "agreeableness", "emotionalBalance"];
      const validScores = result?.scores && keys.every((key) => { const value = result.scores?.[key]; return typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= 100; });
      if (!result?.ok || !validScores) { setLookupStatus("error"); return; }
      setRetrievedScores(result.scores as Record<Dimension, number>);
      if (result.locale === "zh" || result.locale === "en") setLocale(result.locale);
      setLookupStatus("idle");
      setView("results");
    };
    globalWindow[callbackName] = callback;
    script = document.createElement("script");
    script.src = `${PUBLIC_APPS_SCRIPT_ENDPOINT}?action=retrieve&code=${encodeURIComponent(formattedCode)}&callback=${callbackName}`;
    script.onerror = () => { cleanup(); setLookupStatus("error"); };
    timeoutId = window.setTimeout(() => { cleanup(); setLookupStatus("error"); }, 12000);
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
    const ids = factorItemIds(dimension.key);
    const value = Object.keys(answers).length === 120
      ? scoreItemIds(ids, answers as Record<number, number>, IPIP_REVERSE_KEYED, dimension.key === "emotionalBalance")
      : 50;
    return { ...dimension, value };
  }), [answers, retrievedScores]);

  const facetScores = useMemo(() => IPIP_FACETS.map((facet, facetPosition) => {
    const ids = facetItemIds(facetPosition % 6, facet.trait);
    const value = Object.keys(answers).length === 120
      ? scoreItemIds(ids, answers as Record<number, number>, IPIP_REVERSE_KEYED)
      : 50;
    return { ...facet, value };
  }), [answers]);

  function startAssessment(resume = false) {
    if (!resume && Object.keys(answers).length > 0) {
      const message = locale === "zh"
        ? "当前浏览器已有答题进度。重新开始会清除这份未完成进度，是否继续？"
        : "There is saved assessment progress in this browser. Starting over will clear it. Continue?";
      if (!window.confirm(message)) return;
    }
    setRetrievedScores(null);
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
  function clearLocalData() {
    const message = locale === "zh"
      ? "确定清除此设备浏览器中的答题进度和反思笔记吗？此操作不会删除已保存到 Google Sheets 的记录。"
      : "Clear assessment progress and reflection notes from this browser? This will not delete records already saved to Google Sheets.";
    if (!window.confirm(message)) return;
    setAnswers({});
    setIndex(0);
    setHasSaved(false);
    setReflectionNote("");
    setRetrievedScores(null);
    setAccessCode("");
    setCloudConsent(false);
    setCloudSaveStatus("idle");
    try {
      window.localStorage.removeItem(STORAGE_KEY);
      window.localStorage.removeItem("persona-reflection-note-v1");
    } catch { /* The in-memory state is still cleared. */ }
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
        <div className="results-grid">{scores.map((score) => <article className="result-card" key={score.key}><div className="result-title-row"><h2>{locale === "zh" ? score.zh : score.en}</h2><span>{score.value}/100</span></div><div className="result-track"><span style={{ width: `${score.value}%` }} /></div><div className="result-range"><span>{locale === "zh" ? "较低的反应刻度" : "Lower response index"}</span><span>{locale === "zh" ? "较高的反应刻度" : "Higher response index"}</span></div><p>{locale === "zh" ? "这是你在本次量表上的反应刻度，不是人群排名，也不能单独判断某项特质“高”或“低”。请结合下面的具体描述与生活情境理解。" : "This is your response-scale index for this inventory—not a population rank, and not by itself a basis for classifying a trait as high or low. Interpret it alongside the description and your real-life context."}</p><div className="reflection-prompt"><span>{t.reflection}</span><p>{locale === "zh" ? score.zhPrompt : score.enPrompt}</p></div></article>)}</div>
         {!retrievedScores && <section className="facet-results" aria-labelledby="facet-results-title">
           <div className="eyebrow"><span className="eyebrow-line" />{locale === "zh" ? "30 个细分侧面" : "30 PERSONALITY FACETS"}</div>
           <h2 id="facet-results-title">{locale === "zh" ? "更细致地看见人格倾向" : "A more detailed view of your tendencies"}</h2>
           <p className="facet-intro">{locale === "zh" ? "每个侧面由 4 道相关题目汇总。分数是根据 1–5 平均作答换算的显示值，不是百分位、诊断或与他人比较的排名。情绪相关侧面按原量表的神经质方向计分（越高代表该倾向自述越明显）；上方总维度显示的是反向的情绪稳定性。" : "Each facet summarises four related items. Scores convert average 1–5 responses for display; they are not percentiles, diagnoses, or rankings against other people. Emotion-related facets follow the original Neuroticism direction (higher means more of that self-reported tendency); the broad factor above is shown as reverse-keyed Emotional Stability."}</p>
           <div className="facet-grid">{facetScores.map((facet) => <article className="facet-card" key={facet.id}><div className="facet-title-row"><span>{locale === "zh" ? facet.zh : facet.en}</span><strong>{facet.value}</strong></div><div className="facet-track"><span style={{ width: `${facet.value}%` }} /></div><small>{locale === "zh" ? "原始作答换算分" : "Response-scale index"}</small></article>)}</div>
         </section>}
        <section className="insight-summary" aria-labelledby="insight-summary-title">
          <div className="eyebrow"><span className="eyebrow-line" />{locale === "zh" ? "把分数转化为行动" : "FROM SCORES TO ACTION"}</div>
          <h2 id="insight-summary-title">{locale === "zh" ? "你的本次观察重点" : "Your reflection highlights"}</h2>
          <p className="insight-summary-intro">{locale === "zh" ? "以下反思提示根据本次量表分数生成，用来帮助你提出问题，而不是给你定型。" : "These prompts use your inventory scores to help you ask better questions—not to define you."}</p>
          {(() => {
            const ordered = [...scores].sort((a, b) => b.value - a.value);
            const top = ordered[0];
            const bottom = ordered[ordered.length - 1];
            const spread = top.value - bottom.value;
            const hasMeaningfulSeparation = spread >= 10;
            return <div className="insight-highlight-grid">
              <article className="insight-highlight">
                <span className="insight-kicker">{locale === "zh" ? "本次画像中的相对高点" : "RELATIVE HIGH POINT IN THIS PROFILE"}</span>
                <h3>{hasMeaningfulSeparation ? (locale === "zh" ? top.zh : top.en) : (locale === "zh" ? "暂不突出" : "No clear standout")}</h3>
                <p>{hasMeaningfulSeparation
                  ? (locale === "zh" ? `${top.value}/100 · 只表示它在你本次五个维度中相对较高，不代表绝对高水平或优点。` : `${top.value}/100 · Relatively higher within your own five-factor profile; not an absolute high score or a virtue.`)
                  : (locale === "zh" ? "五个维度的分数彼此接近，因此不强行排出高低。可结合具体情境理解各维度。" : "Your five factor scores are close, so this report avoids forcing a rank. Interpret them in context.")}</p>
              </article>
              <article className="insight-highlight">
                <span className="insight-kicker">{locale === "zh" ? "可探索的相对低点" : "RELATIVE LOW POINT TO EXPLORE"}</span>
                <h3>{hasMeaningfulSeparation ? (locale === "zh" ? bottom.zh : bottom.en) : (locale === "zh" ? "暂不突出" : "No clear standout")}</h3>
                <p>{hasMeaningfulSeparation
                  ? (locale === "zh" ? `${bottom.value}/100 · 只表示它在你本次画像中相对较低，不代表缺点、能力不足或需要改变。` : `${bottom.value}/100 · Relatively lower within your own profile; not a weakness, deficit, or a requirement to change.`)
                  : (locale === "zh" ? "分数接近时，差异可能没有实际意义。请选择一个你自己最想理解的情境，而不是追逐排名。" : "When scores are close, differences may not be meaningful. Choose a situation you want to understand rather than chasing a rank.")}</p>
              </article>
            </div>;
          })()}
          <div className="insight-practice">
            <div><span>01</span><p>{locale === "zh" ? "找一个真实例子：最近何时这项倾向帮助了你？" : "Find one real example: when did this tendency help you recently?"}</p></div>
            <div><span>02</span><p>{locale === "zh" ? "换个情境思考：如果对象、压力或目标改变，结果会不同吗？" : "Change the context: would things differ with another person, level of pressure, or goal?"}</p></div>
            <div><span>03</span><p>{locale === "zh" ? "选一个微行动：未来七天尝试一次，并记录实际感受。" : "Choose one small experiment for the next seven days and note what you actually experience."}</p></div>
          </div>
          <p className="insight-footnote">{locale === "zh" ? "提示：分数相近时，不必强行区分高低。人格表现会随情境、角色与时间变化；分数不是百分位，且本网站尚未完成新加坡本地独立验证。" : "When scores are close, there may be no meaningful distinction. Behaviour varies by context, role, and time; the site has not completed independent validation in Singapore."}</p>
        </section>
        <section className="cloud-save-panel" aria-labelledby="cloud-save-title">
          <div className="reflection-heading">
            <div className="eyebrow"><span className="eyebrow-line" />{locale === "zh" ? "可选 · Google Sheets" : "OPTIONAL · GOOGLE SHEETS"}</div>
            <h2 id="cloud-save-title">{locale === "zh" ? "保存这份测评结果。" : "Save this assessment result."}</h2>
            <p>{locale === "zh" ? "只有你勾选同意并主动点击保存后，本网站才会尝试把五大维度分数、语言、提交时间及随机提取码相关记录发送到网站运营者管理的 Google 表格。不会发送逐题答案、姓名、邮箱或个人反思笔记。该流程不是经过独立审计的匿名系统。" : "Only after you check consent and click save will this site attempt to send five factor scores, language, submission time, and random retrieval-code metadata to a Google Sheet managed by the site operator. Individual item answers, names, email addresses, and reflection notes are not sent. This is not an independently audited anonymity system."}</p>
          </div>
          <p className="cloud-save-hint">{locale === "zh" ? "数据接收端由网站统一配置，访客无需输入 Google 链接。只有勾选同意并主动点击保存后才会发送。" : "The endpoint is configured by the site operator. Visitors do not need to enter a Google URL. Data is sent only after consent and an explicit save click."}</p>
          <label className="cloud-consent-row"><input type="checkbox" checked={cloudConsent} onChange={(event) => { setCloudConsent(event.target.checked); setCloudSaveStatus("idle"); }} /><span>{locale === "zh" ? "我同意将本次测评的五大维度分数、语言、提交时间及随机提取码相关记录发送到本网站运营者管理的 Google Sheets。" : "I agree to send my five factor scores, language, submission time, and random retrieval-code metadata to a Google Sheet managed by this website operator."}</span></label>
          <div className="cloud-save-actions"><button className="button-primary" onClick={saveResultToGoogleSheets} disabled={cloudSaveStatus === "sending"}>{cloudSaveStatus === "sending" ? (locale === "zh" ? "正在发送…" : "Sending…") : (locale === "zh" ? "保存到 Google Sheets" : "Save to Google Sheets")} <span>↗</span></button><span className="cloud-save-hint">{locale === "zh" ? "需先勾选同意，再主动点击保存。" : "Consent and an explicit save click are required."}</span></div>
          {cloudSaveStatus !== "idle" && <p className={cloudSaveStatus === "error" || cloudSaveStatus === "invalid" || cloudSaveStatus === "consent" ? "cloud-save-status error" : "cloud-save-status"} role="status">{cloudSaveStatus === "invalid" ? (locale === "zh" ? "保存配置无效。" : "Save configuration is invalid.") : cloudSaveStatus === "consent" ? (locale === "zh" ? "请先勾选同意项，再提交。" : "Please check the consent box before submitting.") : cloudSaveStatus === "sending" ? (locale === "zh" ? "正在发送请求…" : "Sending request…") : cloudSaveStatus === "sent" ? (locale === "zh" ? "保存请求已发送，但网页暂时无法确认后台是否写入。请妥善保存提取码，并先测试能否找回结果。" : "Save request sent, but the page cannot confirm storage. Keep the code and test that retrieval works.") : (locale === "zh" ? "发送失败，请检查网络。" : "Could not send. Check your connection.")}</p>}
          {cloudSaveStatus === "sent" && accessCode && <div className="access-code-card"><strong>{locale === "zh" ? "你的报告提取码" : "Your report retrieval code"}</strong><code>{accessCode}</code><p>{locale === "zh" ? "请立即复制保存。以后打开首页的「找回我的报告」，输入此码即可尝试取回本次结果。" : "Copy and keep this code. Later, use “Retrieve my report” on the home page to look up this result."}</p><button className="button-secondary" onClick={() => navigator.clipboard.writeText(accessCode)}>{locale === "zh" ? "复制提取码" : "Copy code"} ↗</button></div>}
          <p className="cloud-security-note">{locale === "zh" ? "重要：Apps Script 的公开 Web App 接口不是私密 API。Google 表格的访问、保留和删除由网站运营者管理；当前没有云端记录删除功能，也未完成独立安全审计。仅适合低风险演示数据；不要提交真实心理健康信息或可识别个人身份的数据。" : "Important: a public Apps Script web app is not a private API. The site operator manages Google Sheet access, retention, and deletion; this demo has no cloud-record deletion control and has not undergone an independent security audit. Low-risk demo data only: do not submit real mental-health information or identifying data."}</p>
        </section>
        <section className="personal-reflection" aria-labelledby="personal-reflection-title">
          <div className="reflection-heading">
            <div className="eyebrow"><span className="eyebrow-line" />{locale === "zh" ? "给未来的自己" : "A NOTE TO YOURSELF"}</div>
            <h2 id="personal-reflection-title">{locale === "zh" ? "把洞察写下来。" : "Make space to reflect."}</h2>
            <p>{locale === "zh" ? "写下一件你想留意的事，或一个准备尝试的小行动。内容保存在当前浏览器的本地存储中，不会上传；本地存储未加密，共享设备请清除。" : "Capture something you want to notice or one small action to try. This note stays in this browser’s local storage and is not uploaded. Local storage is not encrypted; clear it on shared devices."}</p>
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
          <div className="hero-actions"><button className="button-primary" onClick={() => startAssessment()}>{t.start}<span>↗</span></button><a className="button-text" href="#science">{t.learn}<span>↓</span></a></div><div className="hero-extra-links"><a className="button-text discover-entry-link" href={`${process.env.NODE_ENV === "production" ? "/psycho" : ""}/discover/`}>{locale === "zh" ? "先用 60 秒探索自己" : "Try a 60-second self-discovery"} <span>↗</span></a><a className="button-text" href={`${process.env.NODE_ENV === "production" ? "/psycho" : ""}/practice/`}>{locale === "zh" ? "进入心理建设练习" : "Explore guided self-help"} <span>↗</span></a></div>
          {hasSaved && <button className="resume-button" onClick={() => startAssessment(true)}>{t.resume} · {answeredCount}/{questions.length}</button>}
          {(hasSaved || reflectionNote) && <button className="clear-local-button" onClick={clearLocalData}>{t.clearLocal}</button>}
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
          <details className="faq-item"><summary>{locale === "zh" ? "这是一份正式、经过科学验证的心理测评吗？" : "Is this a validated psychological assessment?"}<span>＋</span></summary><p>{locale === "zh" ? "当前版本已改用 IPIP-NEO-120 的公开题目与固定评分规则；原始研究及普通话翻译资料提供了心理测量证据。但本网站尚未在新加坡双语人群中独立验证，也没有在此网站建立本地常模，因此结果用于个人反思，而非诊断或重大决策。" : "The current version uses the public IPIP-NEO-120 items and a fixed scoring key, supported by published research and Mandarin translation evidence. However, this site has not independently validated the inventory in a Singapore bilingual sample or established local norms. Results are for reflection, not diagnosis or consequential decisions."}</p></details>
          <details className="faq-item"><summary>{locale === "zh" ? "我的回答会被上传或分享吗？" : "Are my answers uploaded or shared?"}<span>＋</span></summary><p>{locale === "zh" ? "答题进度与反思笔记保存在当前浏览器的本地存储中，该存储未加密；共享设备请清除。只有当你在结果页勾选同意并点击保存时，系统才会尝试把五大维度分数、语言、提交时间和随机提取码相关记录发送到网站运营者管理的 Google Sheets；不会发送逐题答案、反思笔记、姓名、邮箱或电话。云端记录的访问、保留和删除由运营者管理，当前没有云端删除功能。由于浏览器跨域限制，页面提示发送后仍需确认是否成功写入。" : "Assessment progress and reflection notes are stored in this browser’s local storage, which is not encrypted; clear it on shared devices. Only after you give consent and click save will the app attempt to send factor scores, language, submission time, and random retrieval-code metadata to a Google Sheet managed by the site operator. It does not send individual item answers, reflection notes, your name, email, or phone number. The operator manages cloud access, retention, and deletion; this demo has no cloud-record deletion control. Because of browser cross-origin limits, verify whether the record was written even if the page says the request was sent."}</p></details>
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
      <section className="visual-lab section-wrap" id="visual-lab" aria-labelledby="visual-lab-title">
        <div className="eyebrow"><span className="eyebrow-line" />{locale === "zh" ? "图形心理探索 · 可选体验" : "VISUAL SELF-EXPLORATION · OPTIONAL"}</div>
        <h2 id="visual-lab-title">{locale === "zh" ? "哪一种画面，更让你产生感觉？" : "Which visual scene resonates with you?"}</h2>
        <p className="visual-intro">{locale === "zh" ? "这不是找不同，也没有正确答案。请根据每道题描述的情境，选择第一眼最吸引你、或最让你感到自在的画面。我们会回顾你在不同情境中的选择倾向，而不是用某个图形直接判断你是什么样的人。" : "This is not a spot-the-difference test, and there are no right answers. For each situation, choose the scene that first attracts you or feels most comfortable. We will reflect on patterns across your choices—not treat a single shape as proof of who you are."}</p>
        <div className="method-debrief"><h4>{locale === "zh" ? "设计原则" : "Design principle"}</h4><p>{locale === "zh" ? "图形是引发选择的视觉媒介，不是有固定含义的心理密码。任务借鉴心理需求研究中的自主感、关系联结，以及对结构与探索的情境偏好；这些选项与主题的对应是本产品的探索性设计，尚未经过心理测量验证。" : "Shapes are visual prompts, not symbols with fixed psychological meanings. The activity draws on research about autonomy and relatedness, alongside contextual preferences for structure and exploration. The mapping used here is exploratory product design, not a validated psychological measure."}</p></div>
        <div className="visual-task-grid">
          {[
            { titleZh: "第 1 幕 · 属于自己的空间", titleEn: "Scene 1 · A space of your own", promptZh: "忙碌的一天结束后，你更想走进哪一种空间？", promptEn: "After a busy day, which space would you rather enter?", options: [{ glyph: "○     ○", theme: "space", labelZh: "宽松、彼此独立", labelEn: "Open, with room to yourself" }, { glyph: "○—○", theme: "connection", labelZh: "有联系、能靠近", labelEn: "Connected and close" }, { glyph: "□ □ □", theme: "structure", labelZh: "清楚、有秩序", labelEn: "Clear and orderly" }, { glyph: "◇  ○  △", theme: "explore", labelZh: "新鲜、可以探索", labelEn: "Novel and exploratory" }] },
            { titleZh: "第 2 幕 · 面对新计划", titleEn: "Scene 2 · A new plan", promptZh: "面对一个还没有定下来的周末计划，你更偏向哪种安排？", promptEn: "When weekend plans are still undecided, which arrangement appeals more?", options: [{ glyph: "△ → ○", theme: "explore", labelZh: "边走边发现", labelEn: "Discover as you go" }, { glyph: "□ □", theme: "structure", labelZh: "先有清晰安排", labelEn: "Have a clear plan" }, { glyph: "○     ○", theme: "space", labelZh: "保留个人空间", labelEn: "Keep personal space" }, { glyph: "○—○—○", theme: "connection", labelZh: "和重要的人一起", labelEn: "Share it with close people" }] },
            { titleZh: "第 3 幕 · 遇到压力时", titleEn: "Scene 3 · Under pressure", promptZh: "事情很多、头绪有些乱时，哪一种画面更让你安心？", promptEn: "When many things compete for your attention, which scene feels more reassuring?", options: [{ glyph: "○—○", theme: "connection", labelZh: "有人可以商量", labelEn: "Someone to talk it through with" }, { glyph: "□ □ □", theme: "structure", labelZh: "一步一步理清", labelEn: "Sort it out step by step" }, { glyph: "◇  △  ○", theme: "explore", labelZh: "换个角度试试看", labelEn: "Try a different perspective" }, { glyph: "○     ○", theme: "space", labelZh: "先独处一会儿", labelEn: "Have some time alone first" }] },
            { titleZh: "第 4 幕 · 做重要决定", titleEn: "Scene 4 · An important decision", promptZh: "做一个对你很重要的决定时，你最希望保留什么？", promptEn: "When making an important decision, what would you most like to preserve?", options: [{ glyph: "□ → □", theme: "structure", labelZh: "清楚的步骤与依据", labelEn: "Clear steps and reasons" }, { glyph: "○     ○", theme: "space", labelZh: "自己选择的余地", labelEn: "Room to choose for myself" }, { glyph: "○—○", theme: "connection", labelZh: "与重要的人保持沟通", labelEn: "Communication with people who matter" }, { glyph: "◇ → △", theme: "explore", labelZh: "尝试不同的可能", labelEn: "The chance to explore alternatives" }] },
            { titleZh: "第 5 幕 · 理想的合作", titleEn: "Scene 5 · Working with others", promptZh: "在一段合作关系里，什么氛围更适合你？", promptEn: "In a collaboration, which atmosphere suits you better?", options: [{ glyph: "○—○—○", theme: "connection", labelZh: "彼此支持、共同推进", labelEn: "Supportive and connected" }, { glyph: "◇  ○  △", theme: "explore", labelZh: "想法开放、不断尝试", labelEn: "Open to ideas and experiments" }, { glyph: "□  □  □", theme: "structure", labelZh: "分工明确、预期清楚", labelEn: "Clear roles and expectations" }, { glyph: "○     ○", theme: "space", labelZh: "互相信任、各有空间", labelEn: "Trust with individual space" }] },
            { titleZh: "第 6 幕 · 进入陌生环境", titleEn: "Scene 6 · Entering an unfamiliar place", promptZh: "来到一个陌生环境，你通常更希望先有什么？", promptEn: "When entering an unfamiliar setting, what would you prefer first?", options: [{ glyph: "□ → □", theme: "structure", labelZh: "知道规则和边界", labelEn: "Know the rules and boundaries" }, { glyph: "△  ◇  ○", theme: "explore", labelZh: "自由看看有什么新鲜事", labelEn: "Freely explore what is new" }, { glyph: "○—○", theme: "connection", labelZh: "找到可以交流的人", labelEn: "Find someone to connect with" }, { glyph: "○     ○", theme: "space", labelZh: "先观察，按自己的节奏来", labelEn: "Observe and move at my own pace" }] },
            { titleZh: "第 7 幕 · 恢复能量", titleEn: "Scene 7 · Restoring your energy", promptZh: "你想恢复状态时，哪一种安排更吸引你？", promptEn: "When you want to recharge, which arrangement appeals to you?", options: [{ glyph: "◇ → ○ → △", theme: "explore", labelZh: "做点没做过的事", labelEn: "Try something unfamiliar" }, { glyph: "○—○", theme: "connection", labelZh: "和让你舒服的人相处", labelEn: "Spend time with people you feel good with" }, { glyph: "○     ○", theme: "space", labelZh: "独自安静一会儿", labelEn: "Enjoy quiet time alone" }, { glyph: "□ □", theme: "structure", labelZh: "回到熟悉的节奏", labelEn: "Return to a familiar routine" }] },
            { titleZh: "第 8 幕 · 下一阶段", titleEn: "Scene 8 · The next chapter", promptZh: "想象接下来的生活阶段，你更想为自己增加哪一种体验？", promptEn: "Thinking about your next chapter, which experience would you like more of?", options: [{ glyph: "○—○—○", theme: "connection", labelZh: "更深的关系与归属", labelEn: "Deeper connection and belonging" }, { glyph: "◇  △  ○", theme: "explore", labelZh: "成长、变化与新可能", labelEn: "Growth, change, and new possibilities" }, { glyph: "□ □ □", theme: "structure", labelZh: "稳定、清晰和掌控感", labelEn: "Stability, clarity, and a sense of control" }, { glyph: "○     ○", theme: "space", labelZh: "更多自主选择的空间", labelEn: "More room for independent choice" }] }
          ].map((scene, sceneIndex) => (
            <article className="visual-task" key={sceneIndex}>
              <span className="insight-kicker">{locale === "zh" ? scene.titleZh : scene.titleEn}</span>
              <p>{locale === "zh" ? scene.promptZh : scene.promptEn}</p>
              <div className="visual-options" role="group" aria-label={locale === "zh" ? scene.titleZh : scene.titleEn}>
                {scene.options.map((option, optionIndex) => (
                  <button key={optionIndex} className={visualAnswers[sceneIndex] === optionIndex ? "visual-option chosen" : "visual-option"} onClick={() => { setVisualAnswers((old) => ({ ...old, [sceneIndex]: optionIndex })); setVisualFeedback(false); }} aria-pressed={visualAnswers[sceneIndex] === optionIndex} aria-label={locale === "zh" ? `选择第 ${optionIndex + 1} 个画面` : `Choose scene ${optionIndex + 1}`}>
                    <span>{option.glyph}</span><small>{optionIndex + 1}</small>
                  </button>
                ))}
              </div>
              {visualFeedback && <div className="method-debrief"><p><strong>{locale === "zh" ? "你选择的画面：" : "Your selected scene: "}</strong>{locale === "zh" ? scene.options[visualAnswers[sceneIndex]].labelZh : scene.options[visualAnswers[sceneIndex]].labelEn}</p></div>}
            </article>
          ))}
        </div>
        <div className="visual-actions">
          <span>{locale === "zh" ? `已完成 ${Object.keys(visualAnswers).length}/8 幕` : `${Object.keys(visualAnswers).length}/8 scenes completed`}</span>
          <button className="button-primary" onClick={() => setVisualFeedback(true)} disabled={Object.keys(visualAnswers).length < 8}>{locale === "zh" ? "查看心理探索结果" : "Explore my patterns"} ↗</button>
          <button className="button-secondary" onClick={() => { setVisualAnswers({}); setVisualFeedback(false); setVisualMeaning(null); }}>{locale === "zh" ? "重新体验" : "Start again"}</button>
        </div>
        {visualFeedback && Object.keys(visualAnswers).length === 8 && <div className="visual-result" aria-live="polite">
          <strong>{locale === "zh" ? "你的情境选择倾向" : "Your contextual choice patterns"}</strong>
          <p>{locale === "zh" ? "以下是你在这 8 个情境中选择的主题分布，不是人格分数，也不代表潜意识真相。" : "This is a distribution of themes you chose across eight situations—not a personality score or a reading of your subconscious."}</p>
          <div className="method-debrief">
            {[
              { key: "space", zh: "自主空间", en: "Autonomy and personal space", explainZh: "你选择了保留个人空间、独立决定或按自己的节奏行动的画面。可以反思：哪些生活领域里，你最需要自主权？", explainEn: "You chose scenes emphasizing personal space, independent choice, or your own pace. Reflect: in which parts of life does having agency matter most to you?" },
              { key: "connection", zh: "关系联结", en: "Connection and belonging", explainZh: "你选择了交流、支持或共同参与的画面。可以反思：什么样的关系会让你感到被理解，同时又能做自己？", explainEn: "You chose scenes emphasizing communication, support, or shared experience. Reflect: what helps you feel understood while still being yourself?" },
              { key: "structure", zh: "清晰与秩序", en: "Structure and clarity", explainZh: "你选择了步骤、规则、稳定节奏或明确预期的画面。可以反思：在什么情况下，清晰的结构能帮助你安心行动？", explainEn: "You chose scenes emphasizing steps, rules, routine, or clear expectations. Reflect: when does structure help you feel ready to act?" },
              { key: "explore", zh: "探索与变化", en: "Exploration and novelty", explainZh: "你选择了新鲜体验、开放可能或尝试不同路径的画面。可以反思：你希望在哪个领域给自己更多尝试空间？", explainEn: "You chose scenes emphasizing novelty, open possibilities, or trying another path. Reflect: where would you like to give yourself more room to experiment?" }
            ].map((theme) => {
              const selectedCount = [
                { theme: "space", options: [["space", "connection", "structure", "explore"], ["explore", "structure", "space", "connection"], ["connection", "structure", "explore", "space"], ["structure", "space", "connection", "explore"], ["connection", "explore", "structure", "space"], ["structure", "explore", "connection", "space"], ["explore", "connection", "space", "structure"], ["connection", "explore", "structure", "space"]] } 
              ][0].options.reduce((total, themes, index) => total + (themes[visualAnswers[index]] === theme.key ? 1 : 0), 0);
              return <p key={theme.key}><strong>{locale === "zh" ? theme.zh : theme.en} · {selectedCount}/8</strong><br />{locale === "zh" ? theme.explainZh : theme.explainEn}</p>;
            })}
          </div>

          <div className="method-debrief">
            <h4>{locale === "zh" ? "把观察结果交还给你" : "You make the meaning"}</h4>
            <p>{locale === "zh" ? "从上面的主题中，哪一种最贴近你最近真正重视的事情？可以与选择次数最多的主题相同，也可以完全不同。" : "Which theme best reflects what truly matters to you right now? It may match your most-selected theme, or be completely different."}</p>
            <div className="visual-options" role="group" aria-label={locale === "zh" ? "选择当前最重要的主题" : "Choose the theme that matters most right now"}>
              {[
                { key: "space", zh: "自主空间", en: "Autonomy" },
                { key: "connection", zh: "关系联结", en: "Connection" },
                { key: "structure", zh: "清晰秩序", en: "Structure" },
                { key: "explore", zh: "探索变化", en: "Exploration" },
                { key: "context", zh: "视情境而定", en: "It depends" }
              ].map((item) => <button type="button" key={item.key} className={visualMeaning === item.key ? "visual-option chosen" : "visual-option"} onClick={() => setVisualMeaning(item.key)} aria-pressed={visualMeaning === item.key}><span>{locale === "zh" ? item.zh : item.en}</span></button>)}
            </div>
            {visualMeaning && <p>{locale === "zh" ? ({
              space: "你的自我判断更重视自主与选择空间。可以继续问自己：我在哪个领域需要更多决定权？",
              connection: "你的自我判断更重视关系与支持。可以继续问自己：我希望谁怎样理解或支持我？",
              structure: "你的自我判断更重视清晰与稳定。可以继续问自己：哪一件事只要更明确一点，就会更容易推进？",
              explore: "你的自我判断更重视新可能与变化。可以继续问自己：有什么小尝试值得在安全范围内开始？",
              context: "你认为需求会随情境变化。可以继续问自己：什么条件改变时，我的优先次序也会改变？"
            } as Record<string, string>)[visualMeaning] : ({
              space: "Your own interpretation gives more weight to autonomy and choice. Ask yourself: where would more agency matter to me?",
              connection: "Your own interpretation gives more weight to connection and support. Ask yourself: who could understand or support me, and how?",
              structure: "Your own interpretation gives more weight to clarity and stability. Ask yourself: what would become easier if one thing were clearer?",
              explore: "Your own interpretation gives more weight to possibility and change. Ask yourself: what small, safe experiment could I try?",
              context: "You see your needs as context-dependent. Ask yourself: what changing condition would shift my priorities?"
            } as Record<string, string>)[visualMeaning]}</p>}
            <p>{locale === "zh" ? "这一步是自我确认，不会被当作正确答案，也不会改写人格分数。反思内容不会上传或保存。" : "This is self-interpretation, not a correct answer. It does not change personality scores; reflection is not uploaded or stored."}</p>
          </div>
          <p>{locale === "zh" ? "心理学边界：自主与关系联结是重要的心理需求研究主题；但本活动的图形选择与主题归类是探索性设计，尚未验证信度或效度。结果只适合自我反思。图形本身没有固定含义，选择也可能受当下心情、题目措辞、文化经验和视觉偏好影响。" : "Psychological boundary: autonomy and relatedness are established topics in motivation research, but this activity's visual choices and theme mapping are exploratory and have not been validated for reliability or validity. Use the results for reflection only. Shapes have no fixed meaning; choices may also reflect mood, wording, culture, or visual taste."}</p>
          <p>{locale === "zh" ? "本模块只在当前页面记录选择，不上传、不写入本地存储，也不会改变 IPIP 人格分数。" : "Choices stay in the current page only; they are not uploaded or stored locally and do not affect IPIP personality scores."}</p>
        </div>}
      </section>
      <section className="sensory-lab section-wrap" id="sensory-lab" aria-labelledby="sensory-lab-title">
        <div className="eyebrow"><span className="eyebrow-line" />{locale === "zh" ? "多感官自我观察 · 可选模块" : "MULTI-SENSORY SELF-OBSERVATION · OPTIONAL"}</div>
        <h2 id="sensory-lab-title">{locale === "zh" ? "从颜色、画面与感受，探索自己的反应。" : "Explore your responses to colour, images, and sensations."}</h2>
        <p className="sensory-intro">{locale === "zh" ? "这里记录的是你当下的主观偏好与联想，不是潜意识解读，也不能据此诊断人格、情绪或健康状况。没有标准答案。" : "This records your current preferences and associations—not a reading of your subconscious, and not a diagnosis of personality, mood, or health. There are no right answers."}</p>
        <div className="sensory-card">
          <span className="insight-kicker">{locale === "zh" ? "01 · 颜色联想" : "01 · COLOUR ASSOCIATION"}</span>
          <h3>{locale === "zh" ? "哪一种颜色最吸引你？" : "Which colour draws you in most?"}</h3>
          <p>{locale === "zh" ? "选一项，并用自己的感受理解它；颜色偏好会受文化、经历、环境与当下心情影响。" : "Choose one and reflect on your own response. Colour preferences can be shaped by culture, experience, context, and current mood."}</p><div className="method-debrief"><h4>{locale === "zh" ? "心理学依据与目的" : "Psychological basis & purpose"}</h4><p>{locale === "zh" ? "依据：情境化偏好自述与自我反思。指标：你在此刻主动选择的颜色。目的：练习描述个人联想，而非解码人格。限制：没有可靠证据可由单一颜色选择推断人格、情绪或潜意识。" : "Basis: contextual preference self-report and reflective practice. Measure: the colour you choose now. Purpose: describe your own associations, not decode personality. Limit: a single colour choice does not reliably reveal personality, mood, or the subconscious."}</p></div>
          <div className="colour-options" role="group" aria-label={locale === "zh" ? "选择喜欢的颜色" : "Choose a colour"}>
            {[
              { nameZh: "宁静蓝", nameEn: "Calm blue", color: "#7fabc2", key: "blue" },
              { nameZh: "自然绿", nameEn: "Nature green", color: "#8ca887", key: "green" },
              { nameZh: "暖阳黄", nameEn: "Warm yellow", color: "#e8c66e", key: "yellow" },
              { nameZh: "活力橙", nameEn: "Vibrant orange", color: "#d98a61", key: "orange" },
              { nameZh: "沉静紫", nameEn: "Quiet violet", color: "#a69ac5", key: "violet" },
              { nameZh: "经典灰", nameEn: "Classic grey", color: "#a5aaa6", key: "grey" },
            ].map((colour) => (
              <button type="button" key={colour.key} className={sensoryAnswers.colour === colour.key ? "colour-choice selected" : "colour-choice"} onClick={() => setSensoryAnswers((old) => ({ ...old, colour: colour.key }))} aria-pressed={sensoryAnswers.colour === colour.key}>
                <span className="colour-swatch" style={{ backgroundColor: colour.color }} /><span>{locale === "zh" ? colour.nameZh : colour.nameEn}</span>
              </button>
            ))}
          </div>
        {sensoryAnswers.colour && <div className="method-debrief"><h4>{locale === "zh" ? "完成后的说明 · 颜色选择" : "After-task debrief · Colour choice"}</h4><p>{locale === "zh" ? "你记录的是本次情境下主动选择的颜色。它可以成为个人联想的起点，但没有经验证的评分规则能从这个选择判断你的性格、情绪或潜意识。" : "You recorded the colour you chose in this context. It can prompt personal reflection, but no validated scoring rule lets this choice determine your personality, mood, or subconscious."}</p></div>}
        </div>
        <div className="sensory-card">
          <span className="insight-kicker">{locale === "zh" ? "02 · 图片联想" : "02 · IMAGE ASSOCIATION"}</span>
          <h3>{locale === "zh" ? "看到这幅场景，你最先注意到什么？" : "What do you notice first in this scene?"}</h3>
          <div className="scene-illustration" role="img" aria-label={locale === "zh" ? "简约插画：窗边有一把椅子、一株植物、一本书和一扇明亮的窗" : "Minimal illustration of a chair, a plant, a book, and a bright window"}>
            <div className="scene-window"><span /><span /><span /><span /></div><div className="scene-sun" /><div className="scene-plant"><i /><i /><i /><b /></div><div className="scene-chair"><i /><b /></div><div className="scene-book" />
          </div>
          <p>{locale === "zh" ? "这是一幅自制的示意插画，不是投射测验。选择最接近你第一眼注意到的内容。" : "This is an original illustrative scene, not a projective test. Select what most closely matches your first observation."}</p><div className="method-debrief"><h4>{locale === "zh" ? "心理学依据与目的" : "Psychological basis & purpose"}</h4><p>{locale === "zh" ? "依据：视觉注意与自我报告的第一印象。指标：你选择的场景元素及可选文字说明。目的：帮助你回顾注意焦点和个人联想。限制：这是非标准化、自制插画；不能按选项推断性格，也不是投射测验。" : "Basis: visual attention and self-reported first impressions. Measure: the scene element you select and any optional explanation. Purpose: reflect on your focus of attention and personal associations. Limit: this custom, non-standardized illustration cannot reveal personality and is not a projective test."}</p></div>
          <div className="scene-choices" role="group" aria-label={locale === "zh" ? "图片第一印象" : "First impression of the scene"}>
            {[{key:"light",zh:"光线与窗户",en:"Light and window"},{key:"nature",zh:"植物与自然",en:"Plant and nature"},{key:"comfort",zh:"椅子与舒适感",en:"Chair and comfort"},{key:"details",zh:"书本与细节",en:"Book and details"}].map((item) => <button type="button" key={item.key} className={sensoryAnswers.scene === item.key ? "scene-choice selected" : "scene-choice"} onClick={() => setSensoryAnswers((old) => ({ ...old, scene: item.key }))} aria-pressed={sensoryAnswers.scene === item.key}>{locale === "zh" ? item.zh : item.en}</button>)}
          </div>
          <label className="sensory-label" htmlFor="scene-reflection">{locale === "zh" ? "你为什么先注意到它？（可选）" : "Why did it catch your attention? (optional)"}</label>
          <textarea id="scene-reflection" className="reflection-textarea" maxLength={500} value={sensoryAnswers.sceneNote || ""} onChange={(event) => setSensoryAnswers((old) => ({ ...old, sceneNote: event.target.value }))} placeholder={locale === "zh" ? "例如：它让我想到一个熟悉的地方……" : "For example: it reminds me of a familiar place…"} />
        {sensoryAnswers.scene && <div className="method-debrief"><h4>{locale === "zh" ? "完成后的说明 · 场景第一印象" : "After-task debrief · First impression"}</h4><p>{locale === "zh" ? "你报告的是自己对这幅自制插画的第一印象，文字说明可帮助你表达个人联想。选中某个元素不代表特定人格，也不能据此进行投射测验式解释。" : "You reported your first impression of this custom illustration; your optional note can describe your own associations. Selecting an element does not indicate a specific personality and cannot be interpreted as a projective test."}</p></div>}
        </div>
        <div className="sensory-card">
          <span className="insight-kicker">{locale === "zh" ? "03 · 味觉偏好自述" : "03 · TASTE PREFERENCE SELF-REPORT"}</span>
          <h3>{locale === "zh" ? "哪一种味道通常更合你口味？" : "Which taste do you usually prefer?"}</h3>
          <p>{locale === "zh" ? "这是对日常偏好的自述，不需要真的品尝食物，也不代表性格特征。味觉还会受到文化、饮食、嗅觉与健康因素影响。" : "This is a self-report of everyday preference; you do not need to taste anything. It does not indicate a personality trait. Taste is also influenced by culture, diet, smell, and health factors."}</p><div className="method-debrief"><h4>{locale === "zh" ? "心理学依据与目的" : "Psychological basis & purpose"}</h4><p>{locale === "zh" ? "依据：日常偏好自述。指标：你报告的常见味觉偏好。目的：把个人偏好说清楚，观察它是否随情境变化。限制：偏好受文化、饮食经历、嗅觉与身体状态影响，不能用于人格或健康推断。" : "Basis: everyday preference self-report. Measure: the taste preference you report. Purpose: articulate a preference and consider whether it changes by context. Limit: culture, diet, smell, and physical state affect taste; it cannot support personality or health inferences."}</p></div>
          <div className="taste-options" role="group" aria-label={locale === "zh" ? "味觉偏好" : "Taste preference"}>
            {[{key:"sweet",symbol:"✳",zh:"甜",en:"Sweet"},{key:"sour",symbol:"◌",zh:"酸",en:"Sour"},{key:"salty",symbol:"⁙",zh:"咸",en:"Salty"},{key:"bitter",symbol:"⌁",zh:"苦",en:"Bitter"},{key:"umami",symbol:"❋",zh:"鲜",en:"Umami"},{key:"varies",symbol:"↔",zh:"看情境",en:"It varies"}].map((item) => <button type="button" key={item.key} className={sensoryAnswers.taste === item.key ? "taste-choice selected" : "taste-choice"} onClick={() => setSensoryAnswers((old) => ({ ...old, taste: item.key }))} aria-pressed={sensoryAnswers.taste === item.key}><span>{item.symbol}</span>{locale === "zh" ? item.zh : item.en}</button>)}
          </div>
        {sensoryAnswers.taste && <div className="method-debrief"><h4>{locale === "zh" ? "完成后的说明 · 味觉偏好" : "After-task debrief · Taste preference"}</h4><p>{locale === "zh" ? "这是一项日常偏好自述，不是味觉能力测试。它适合帮助你描述个人口味及其情境变化，不适合推断人格或健康状态。" : "This is an everyday preference report, not a taste-ability test. It can help you describe your preferences and how they vary by context, but not infer personality or health."}</p></div>}
        </div>
        <div className="sensory-card">
          <span className="insight-kicker">{locale === "zh" ? "04 · 身体感受觉察" : "04 · BODY-SENSATION CHECK-IN"}</span>
          <h3>{locale === "zh" ? "回想最近忙碌的一天，你通常先觉察到什么？" : "After a busy day, what do you tend to notice first?"}</h3>
          <p>{locale === "zh" ? "只需选择最贴近你近期体验的一项。身体感受不是心理诊断；若有持续或令人担忧的症状，应向合适的医疗专业人士咨询。" : "Choose what best matches your recent experience. Bodily sensations are not a psychological diagnosis; persistent or concerning symptoms should be discussed with an appropriate healthcare professional."}</p><div className="method-debrief"><h4>{locale === "zh" ? "心理学依据与目的" : "Psychological basis & purpose"}</h4><p>{locale === "zh" ? "依据：自我监测与内感受觉察是心理教育和情绪识别中常见的反思方向。指标：你回顾近期后主动报告的一项身体体验。目的：练习留意身体线索，并把它与具体情境联系起来。限制：这不是生理测量或临床量表；单项回答不能证明压力、焦虑、创伤或疾病。" : "Basis: self-monitoring and interoceptive awareness are common reflective themes in psychoeducation and emotion identification. Measure: one bodily experience you report after reflecting on recent days. Purpose: practise noticing bodily cues in context. Limit: this is not a physiological measurement or clinical scale; one answer cannot establish stress, anxiety, trauma, or illness."}</p></div>
          <div className="sensation-options" role="group" aria-label={locale === "zh" ? "身体感受" : "Body sensation"}>
            {[{key:"tension",zh:"肩颈紧绷",en:"Muscle tension"},{key:"energy",zh:"精力变化",en:"Energy changes"},{key:"breathing",zh:"呼吸节奏",en:"Breathing rhythm"},{key:"stomach",zh:"胃口或胃部感觉",en:"Appetite or stomach"},{key:"rest",zh:"想休息或安静一下",en:"Need for rest or quiet"},{key:"none",zh:"没有特别注意到",en:"Nothing in particular"}].map((item) => <button type="button" key={item.key} className={sensoryAnswers.body === item.key ? "sensation-choice selected" : "sensation-choice"} onClick={() => setSensoryAnswers((old) => ({ ...old, body: item.key }))} aria-pressed={sensoryAnswers.body === item.key}>{locale === "zh" ? item.zh : item.en}</button>)}
          </div>
        {sensoryAnswers.body && <div className="method-debrief"><h4>{locale === "zh" ? "完成后的说明 · 身体感受" : "After-task debrief · Body awareness"}</h4><p>{locale === "zh" ? "你回顾并报告了一项近期身体体验。这可用于自我观察，但不是生理测量或诊断工具；如果症状持续或令人担忧，请咨询合适的医疗专业人士。" : "You reported a bodily experience from recent days. This can support self-observation, but it is not a physiological measure or diagnostic tool. Consult an appropriate healthcare professional about persistent or concerning symptoms."}</p></div>}
        </div>
        <div className="sensory-actions">
          <span>{locale === "zh" ? `已完成 ${["colour","scene","taste","body"].filter((key) => sensoryAnswers[key]).length}/4 个选择` : `${["colour","scene","taste","body"].filter((key) => sensoryAnswers[key]).length}/4 selections complete`}</span>
          <button className="button-primary" type="button" onClick={() => setSensorySummary(true)} disabled={!sensoryAnswers.colour || !sensoryAnswers.scene || !sensoryAnswers.taste || !sensoryAnswers.body}>{locale === "zh" ? "整理我的观察记录" : "Review my observations"} ↗</button>
          <button className="button-secondary" type="button" onClick={() => { setSensoryAnswers({}); setSensorySummary(false); }}>{locale === "zh" ? "清空重选" : "Reset choices"}</button>
        </div>
        {sensorySummary && <div className="sensory-result" aria-live="polite"><strong>{locale === "zh" ? "你的当下观察记录已整理" : "Your observation notes are ready"}</strong><p>{locale === "zh" ? "你选择了颜色、图片第一印象、味觉偏好和身体感受。它们是不同类别的自我报告，不应合并成单一人格分数。可以回顾：这些选择是长期偏好，还是受今天的情境影响？" : "You recorded a colour, a first impression of an image, a taste preference, and a body sensation. These are different kinds of self-report and should not be combined into one personality score. Consider whether they reflect long-term preferences or today's context."}</p><div className="method-debrief"><h4>{locale === "zh" ? "心理学依据与测量目的" : "Psychological basis & purpose"}</h4><p><strong>{locale === "zh" ? "依据：" : "Basis: "}</strong>{locale === "zh" ? "自我监测与经验反思鼓励人描述当下体验，并留意情境如何影响感受。颜色、场景联想、口味和身体感觉本身不是经过验证的人格指标。" : "Self-monitoring and experience-focused reflection encourage people to describe current experiences and notice context. Colour, scene associations, taste, and body sensations are not validated personality indicators in themselves."}</p><p><strong>{locale === "zh" ? "观察指标：" : "Observable measure: "}</strong>{locale === "zh" ? "记录用户主动选择的选项及自愿填写的联想；不把选项转换为人格分数。" : "The user's selected options and any voluntarily entered association; choices are not converted into personality scores."}</p><p><strong>{locale === "zh" ? "专业解释边界：" : "Interpretation boundary: "}</strong>{locale === "zh" ? "没有标准答案，也不做投射测验式解读、潜意识判断、情绪诊断或健康推断。反思问题用于探索个人意义，不是心理师对个体作出的结论。" : "There are no right answers. This does not use projective-test interpretation or infer subconscious content, diagnose mood, or assess health. Reflection prompts explore personal meaning; they are not a psychologist's conclusions."}</p></div><button className="button-secondary" type="button" onClick={() => { const notes = (locale === "zh" ? "Persona 多感官观察记录\n" : "Persona multi-sensory observation notes\n") + JSON.stringify({colour:sensoryAnswers.colour,scene:sensoryAnswers.scene,sceneNote:sensoryAnswers.sceneNote || "",taste:sensoryAnswers.taste,body:sensoryAnswers.body},null,2); if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) { void navigator.clipboard.writeText(notes).catch(() => window.prompt(locale === "zh" ? "复制以下观察记录：" : "Copy these observation notes:", notes)); } else { window.prompt(locale === "zh" ? "复制以下观察记录：" : "Copy these observation notes:", notes); } }}>{locale === "zh" ? "复制观察记录" : "Copy observation notes"} ↗</button></div>}
      </section>
      <section className="sound-lab section-wrap" id="sound-exploration" aria-labelledby="sound-lab-title">
        <div className="eyebrow"><span className="eyebrow-line" />{locale === "zh" ? "声音探索 · 可选体验" : "SOUND EXPLORATION · OPTIONAL"}</div>
        <h2 id="sound-lab-title">{locale === "zh" ? "听一听，看看自己偏好哪一种声音。" : "Listen and notice which sound you prefer."}</h2>
        <p className="sound-intro">{locale === "zh" ? "这是一个简短的声音互动。请在安静、舒适的音量下体验；不需要麦克风，不会录音或上传声音。你可以随时跳过，结束后会说明这项活动观察的内容。" : "A short listening activity. Use a comfortable volume in a quiet setting. No microphone is needed, and no audio is recorded or uploaded. You can skip it at any time; the activity's purpose will be explained afterward."}</p>
        <div className="sound-card">
          {!soundStarted && <div className="sound-start">
            <div className="sound-art" aria-hidden="true"><span /><span /><span /><span /><span /></div>
            <h3>{locale === "zh" ? "准备好探索声音了吗？" : "Ready to explore sound?"}</h3>
            <p>{locale === "zh" ? "你会听到 6 组短音。每组听完后，选择自己更喜欢第一声还是第二声，也可以重播。不需要赶时间，没有正确答案。" : "You will hear six short pairs of tones. After each pair, choose which tone you prefer—the first or the second. You can replay each pair; there is no need to rush, and there is no correct answer."}</p>
            <button type="button" className="button-primary" onClick={startSoundActivity}>{locale === "zh" ? "开始声音体验" : "Begin sound activity"} ↗</button>
          </div>}
          {soundStarted && !soundComplete && <div className="sound-task">
            <div className="sound-progress"><span>{locale === "zh" ? `声音片段 ${soundIndex + 1} / ${soundTrials.length}` : `Sound pair ${soundIndex + 1} of ${soundTrials.length}`}</span><span className="sound-progress-track"><i style={{ width: `${((soundIndex + 1) / soundTrials.length) * 100}%` }} /></span></div>
            <div className="sound-wave" aria-hidden="true"><span /><span /><span /><span /><span /><span /><span /><span /><span /></div>
            <p>{locale === "zh" ? "点击播放，然后选择哪一种声音更符合你当下的偏好。" : "Play the pair, then choose based on your current preference."}</p>
            <div className="sound-controls">
              <button type="button" className="button-primary" onClick={playSoundPair} disabled={soundPlaying}>{soundPlaying ? (locale === "zh" ? "播放中…" : "Playing…") : (soundPlayed ? (locale === "zh" ? "重新播放" : "Play again") : (locale === "zh" ? "播放声音" : "Play tones"))} <span>♪</span></button>
              <button type="button" className="sound-choice" onClick={() => answerSoundPair(false)} disabled={!soundPlayed}>{locale === "zh" ? "更喜欢第一声" : "Prefer first"}</button>
              <button type="button" className="sound-choice" onClick={() => answerSoundPair(true)} disabled={!soundPlayed}>{locale === "zh" ? "更喜欢第二声" : "Prefer second"}</button>
            </div>
            {soundError && <p className="sound-error" role="alert">{locale === "zh" ? "当前浏览器无法播放声音。请检查浏览器设置，或跳过此体验。" : "This browser could not play the tones. Check browser settings or skip this activity."}</p>}
            <button type="button" className="sound-skip" onClick={() => { setSoundStarted(false); setSoundComplete(false); setSoundTrials([]); setSoundAnswers([]); setSoundPlayed(false); setSoundError(false); }}>{locale === "zh" ? "退出这项体验" : "Exit this activity"}</button>
          </div>}
          {soundStarted && soundComplete && <div className="sound-result" aria-live="polite">
            <span className="insight-kicker">{locale === "zh" ? "体验完成 · 结果说明" : "ACTIVITY COMPLETE · WHAT IT MEANS"}</span>
            <h3>{locale === "zh" ? "你的声音偏好记录" : "Your sound preference reflection"}</h3>
            <div className="sound-score"><strong>{soundAnswers.filter((answer) => answer === false).length}</strong><span>{locale === "zh" ? "次偏好第一声" : " preferred the first tone"}</span></div>
            <p>{locale === "zh" ? "这项活动记录你在六组声音中偏好第一声还是第二声，只用于观察当下的主观选择。它没有正确答案，也不能单凭声音偏好推断人格、情绪或潜意识。选择可能受到音调、音量、环境、设备和当下心情影响。" : "This activity records whether you preferred the first or second tone across six pairs. There are no correct answers; the choices reflect current subjective preference only. Tone, volume, environment, device, and current mood may influence your selections. Sound preference alone cannot establish personality, emotion, or subconscious motives."}</p><div className="method-debrief"><h4>{locale === "zh" ? "心理学依据与测量目的" : "Psychological basis & purpose"}</h4><p><strong>{locale === "zh" ? "依据：" : "Basis: "}</strong>{locale === "zh" ? "听觉感知会影响人对声音的主观体验；本模块把简单音调作为自我观察的提示，而不是能力测试。音调偏好与人格之间没有在本产品中得到验证的对应关系。" : "Auditory perception shapes subjective experience of sound. This activity uses simple tones as prompts for noticing preferences, not as a test of ability. No validated link between these tone preferences and personality has been established in this product."}</p><p><strong>{locale === "zh" ? "观察指标：" : "Observable measure: "}</strong>{locale === "zh" ? "六组选择中偏好第一声与第二声的次数；不收集麦克风录音，不测反应时间。" : "Counts of first-tone versus second-tone preferences across six pairs; no microphone recording or reaction-time measure."}</p><p><strong>{locale === "zh" ? "专业解释边界：" : "Interpretation boundary: "}</strong>{locale === "zh" ? "这是探索性偏好记录，没有常模或个体解释效度。结果不进入人格画像，也不用于判断听力、智力或心理状态。" : "This is an exploratory preference record with no norms or validated individual-level interpretation. It does not enter the personality profile and cannot assess hearing, intelligence, or psychological state."}</p></div>
            <div className="sound-result-actions">
              <button type="button" className="button-secondary" onClick={() => { setSoundStarted(false); setSoundComplete(false); setSoundTrials([]); setSoundAnswers([]); setSoundPlayed(false); }}>{locale === "zh" ? "结束并返回" : "Finish"}</button>
              <button type="button" className="button-secondary" onClick={startSoundActivity}>{locale === "zh" ? "再体验一次" : "Try again"}</button>
            </div>
          </div>}
        </div>
      </section>
      <section className="closing-cta">
        <div className="eyebrow light"><span className="eyebrow-line" />{locale === "zh" ? "留一点空间给自己" : "MAKE ROOM FOR REFLECTION"}</div>
        <h2>{locale === "zh" ? "不必急着定义自己。\n先从一个好问题开始。" : "You don't need a label.\nStart with a better question."}</h2>
        <p>{locale === "zh" ? "约 15–20 分钟完成 120 道题，带着更具体的自我观察问题回到日常生活。" : "Allow about 15–20 minutes for 120 items, then take a more specific self-reflection question into everyday life."}</p>
        <button className="button-primary" onClick={() => startAssessment()}>{t.start}<span>↗</span></button>
      </section>
            <footer><a className="brand footer-brand" href="#"><span className="brand-mark">P</span><span>persona<span className="brand-dot">.</span></span></a><span>{t.footer}</span><span>{t.footerText}</span><a href="/psycho/privacy/">{locale === "zh" ? "隐私说明" : "Privacy notice"}</a><span>© 2026</span></footer>
    </main>
  );
}
