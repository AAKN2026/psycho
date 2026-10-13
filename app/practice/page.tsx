"use client";

import { useMemo, useState } from "react";

type Locale = "zh" | "en";
type Goal = "stress" | "thoughts" | "action" | "values" | "relationship" | "unsure";
type FieldKey = "situation" | "emotion" | "thought" | "support" | "against" | "balanced" | "next" | "activity" | "why" | "barrier" | "request" | "boundary" | "value";
const goals: { id: Goal; zh: string; en: string; practice: "thought" | "action" | "values" | "communication" }[] = [
  { id: "stress", zh: "压力或情绪有点满", en: "Stress or emotions feel intense", practice: "thought" },
  { id: "thoughts", zh: "反复想一件事，停不下来", en: "I keep replaying a situation", practice: "thought" },
  { id: "action", zh: "拖延，或不知道怎样开始", en: "I am stuck or unsure how to start", practice: "action" },
  { id: "values", zh: "想弄清楚自己真正重视什么", en: "I want clarity about what matters", practice: "values" },
  { id: "relationship", zh: "想更清楚地表达需要或界限", en: "I want to express a need or boundary", practice: "communication" },
  { id: "unsure", zh: "还不确定，只想先了解自己", en: "Not sure yet; I want to check in", practice: "thought" },
];
const fields: Record<string, { key: FieldKey; zh: string; en: string; hintZh: string; hintEn: string; placeholderZh: string; placeholderEn: string }[]> = {
  thought: [
    { key:"situation", zh:"1. 发生了什么？", en:"1. What happened?", hintZh:"只写摄像机能记录到的事实，暂时不解释原因。", hintEn:"Write observable facts before interpreting them.", placeholderZh:"例如：会议上我提出建议，没有人马上回应。", placeholderEn:"e.g. I shared an idea in a meeting and nobody responded immediately." },
    { key:"emotion", zh:"2. 我感到什么？", en:"2. What did I feel?", hintZh:"写出情绪；如愿意，可给强度 0–10 一个数字。", hintEn:"Name the emotion; optionally rate its intensity from 0–10.", placeholderZh:"例如：紧张 6/10、失落 4/10。", placeholderEn:"e.g. anxious 6/10, disappointed 4/10." },
    { key:"thought", zh:"3. 当时脑中闪过什么想法？", en:"3. What went through my mind?", hintZh:"把想法当作一个念头，不要急着把它当成事实。", hintEn:"Treat a thought as a thought, not automatically as a fact.", placeholderZh:"例如：他们一定觉得我的建议很差。", placeholderEn:"e.g. They must think my idea was poor." },
    { key:"support", zh:"4. 有哪些事实支持这个想法？", en:"4. What facts seem to support it?", hintZh:"只记录具体证据，不用猜测别人的内心。", hintEn:"Record concrete evidence, not guesses about another person's mind.", placeholderZh:"哪些是我确实观察到的？", placeholderEn:"What did I actually observe?" },
    { key:"against", zh:"5. 有哪些事实或其他解释？", en:"5. What facts or other explanations are there?", hintZh:"考虑遗漏的信息、其他可能原因，以及你会怎样看待朋友的同一处境。", hintEn:"Consider missing information, other explanations, or what you would tell a friend.", placeholderZh:"例如：对方可能在记笔记；之后还没有机会回应。", placeholderEn:"e.g. They may have been taking notes; there may not have been time to respond." },
    { key:"balanced", zh:"6. 更平衡、可信的说法是什么？", en:"6. What is a more balanced, believable view?", hintZh:"不必强迫自己积极，只要比最初想法更完整、更公平。", hintEn:"You do not need forced positivity—aim for a fuller, fairer view.", placeholderZh:"例如：我暂时不知道他们怎么想；可以稍后询问反馈。", placeholderEn:"e.g. I don't know what they thought yet; I can ask for feedback later." },
    { key:"next", zh:"7. 我愿意尝试的一个小步骤", en:"7. One small next step I am willing to try", hintZh:"选择安全、可行、由你决定的一步；也可以暂时不行动。", hintEn:"Choose a safe, feasible step you control—or decide not to act yet.", placeholderZh:"例如：私下向一位同事询问具体反馈。", placeholderEn:"e.g. Ask one colleague for specific feedback privately." },
  ],
  action: [
    { key:"activity", zh:"我想开始的具体小行动", en:"The specific small action I want to start", hintZh:"把任务缩小到 5–15 分钟内可以开始的程度。", hintEn:"Shrink the task to something you can begin in 5–15 minutes.", placeholderZh:"例如：打开文件，先写三个标题。", placeholderEn:"e.g. Open the document and write three headings." },
    { key:"why", zh:"这件事为什么对我有意义？", en:"Why does this matter to me?", hintZh:"联系个人目标、关系、责任、好奇心或照顾自己。", hintEn:"Connect it to a goal, relationship, responsibility, curiosity, or self-care.", placeholderZh:"它能帮助我……", placeholderEn:"It would help me…" },
    { key:"barrier", zh:"什么可能阻碍我？我可以怎样降低门槛？", en:"What might get in the way, and how can I lower the barrier?", hintZh:"不要责备自己；考虑时间、环境、支持和任务大小。", hintEn:"Avoid self-blame; consider time, environment, support, and task size.", placeholderZh:"如果我遇到……我就先……", placeholderEn:"If … gets in the way, I will first…" },
    { key:"next", zh:"何时、何地开始？", en:"When and where will I begin?", hintZh:"具体到一个现实的时间或触发点；计划可以调整。", hintEn:"Choose a realistic time or cue; the plan can change.", placeholderZh:"例如：明天早餐后，先做 10 分钟。", placeholderEn:"e.g. Tomorrow after breakfast, I will try for 10 minutes." },
  ],
  values: [
    { key:"value", zh:"最近什么时刻让我觉得这件事很重要？", en:"When recently did this feel important?", hintZh:"回想一个具体时刻，而不是选择“正确”的价值观。", hintEn:"Recall a concrete moment; there is no correct value to choose.", placeholderZh:"我在意的是……因为……", placeholderEn:"I care about … because…" },
    { key:"why", zh:"这反映了我在乎的什么？", en:"What does this reveal about what I care about?", hintZh:"例如连接、学习、诚实、创造、稳定、自由或照顾。", hintEn:"Possibilities include connection, learning, honesty, creativity, stability, freedom, or care.", placeholderZh:"对我来说，重要的是……", placeholderEn:"What matters to me is…" },
    { key:"next", zh:"未来 7 天，我愿意做的一件小事", en:"One small action I am willing to take in the next 7 days", hintZh:"这是一个尝试，不是考核；不适合时可以改变计划。", hintEn:"This is an experiment, not a test; revise it if circumstances change.", placeholderZh:"一个符合我重视之事的小行动是……", placeholderEn:"One small action aligned with this value is…" },
  ],
  communication: [
    { key:"situation", zh:"我想沟通的具体情境", en:"The specific situation I want to discuss", hintZh:"尽量描述行为和情境，避免给对方贴标签。", hintEn:"Describe behaviour and context rather than labelling the person.", placeholderZh:"当……发生时……", placeholderEn:"When … happened…" },
    { key:"emotion", zh:"这对我有什么影响？", en:"How did this affect me?", hintZh:"描述感受、实际影响或需要。", hintEn:"Describe feelings, practical impact, or a need.", placeholderZh:"我感到……，因为我需要……", placeholderEn:"I felt … because I needed…" },
    { key:"request", zh:"我希望提出什么具体请求？", en:"What specific request would I like to make?", hintZh:"请求尽量具体、可执行，也允许对方回应。", hintEn:"Make the request specific and actionable, while allowing a response.", placeholderZh:"你是否愿意……？", placeholderEn:"Would you be willing to …?" },
    { key:"boundary", zh:"我需要说明什么界限或选择？", en:"What boundary or choice do I need to clarify?", hintZh:"只写你自己能采取的行动，不威胁或控制对方。若沟通可能引发危险，请优先考虑安全并寻求可信支持。", hintEn:"Focus on your own choices, not controlling the other person. If speaking up could put you in danger, prioritise safety and seek trusted support.", placeholderZh:"如果……继续发生，我会……", placeholderEn:"If … continues, I will…" },
  ],
};
const copy = {
  zh: { home:"返回 Persona", kicker:"心理建设 · 自我练习", title:"从理解自己，走向一个小改变。", intro:"先选择你现在想处理的主题。系统会提供结构化的自我反思练习，而不是替你判断或诊断。你可以跳过、暂停或随时结束。", choose:"你现在最想理解什么？", start:"开始练习", science:"为什么这样设计", privacy:"隐私与安全", privacyText:"练习内容只保存在当前页面的内存中，不会上传，也不会自动保存到浏览器。离开或刷新页面可能会清除内容。完成后，你可以自行复制或下载记录。请避免输入姓名、联系方式或可识别他人的细节。", noRight:"没有标准答案。练习结果不计分，不会改变人格测评结果。", step:"步骤", next:"下一步", back:"上一步", finish:"查看我的总结", edit:"返回修改", download:"下载个人记录 TXT", again:"开始另一个练习", stop:"暂停 / 返回选择", summary:"我的练习记录", summaryText:"请看看哪些内容符合你自己的经验，哪些不符合。你可以不同意任何提示。", finishPrompt:"完成后，你可以选择一件安全、可行的小事去尝试；不必一次解决所有问题。", evidence:"理论依据与解释边界", evidenceText:"思维记录参考 CBT 中识别情境、想法、情绪与替代解释的结构；小行动规划借鉴行为激活中将行动拆小并观察经验的原则；价值澄清用于帮助自己识别个人方向；沟通模块采用具体情境、感受、请求与界限的反思结构。此网页是自助教育工具，不是由临床人员提供的治疗，也不能证明某种诊断或疗效。", urgent:"如果练习让你更难受，请随时停止。在新加坡，如有即时危险或需要紧急医疗协助，请拨 995；如有人身安全风险，也可联系 999。若你正经历强烈情绪困扰，可联系 national mindline 1771（WhatsApp：6669 1771）；若涉及自杀念头或危机，可联系 SOS 24 小时热线 1767，或 WhatsApp CareText 9151 1767。其他地区请联系当地紧急服务与危机支持。此网站不进行危机监测，也不会通知任何人。", intensity:"现在的情绪强度（可选）", before:"开始前 0–10", after:"现在 0–10", rateHint:"这只是你此刻的主观记录，不是诊断、疗效指标或可与他人比较的分数。", exportNote:"此文件由你主动下载；网站不会自动发送或上传。", restartConfirm:"离开此练习将清除当前页面中的练习内容。要继续吗？" },
  en: { home:"Back to Persona", kicker:"PSYCHOLOGICAL DEVELOPMENT · SELF-GUIDED PRACTICE", title:"From self-understanding to one small step.", intro:"Choose what you would like to work with today. The app offers structured reflection—not a judgement or diagnosis. Skip, pause, or stop whenever you wish.", choose:"What would you most like to explore right now?", start:"Begin practice", science:"Why this is designed this way", privacy:"Privacy & safety", privacyText:"Your practice content stays in this page's memory only. It is not uploaded or automatically saved in your browser. Leaving or refreshing may clear it. You can copy or download your own record at the end. Avoid names, contact details, or identifying details about others.", noRight:"There are no right answers. This exercise is not scored and will not change your personality assessment.", step:"Step", next:"Next", back:"Previous", finish:"Review my notes", edit:"Edit answers", download:"Download personal record TXT", again:"Choose another practice", stop:"Pause / choose another", summary:"My practice notes", summaryText:"Notice what fits your experience and what does not. You can disagree with any prompt.", finishPrompt:"Choose one safe, feasible action if useful; you do not need to solve everything at once.", evidence:"Rationale & interpretation limits", evidenceText:"The thought record follows a CBT-informed structure for noticing situations, thoughts, emotions, and alternative explanations. Small-action planning borrows from behavioural activation principles of making actions manageable and observing experience. Values clarification supports personal direction; communication reflection structures a situation, feeling, request, and boundary. This is a self-help educational tool, not clinician-delivered therapy, and it cannot establish a diagnosis or treatment effect.", urgent:"Stop at any time if this exercise makes you feel worse. In Singapore, call 995 for an immediate medical emergency; call 999 if there is an immediate safety threat. For mental-health support, contact national mindline 1771 (WhatsApp: 6669 1771). For suicide-related distress or crisis, contact SOS 24-hour Hotline 1767 or WhatsApp CareText 9151 1767. Elsewhere, contact local emergency services and crisis support. This site does not monitor crises or notify anyone.", intensity:"Current emotional intensity (optional)", before:"Before · 0–10", after:"Now · 0–10", rateHint:"This is a subjective check-in, not a diagnosis, treatment-effect measure, or score for comparing people.", exportNote:"This file is downloaded only at your request; the site does not send or upload it.", restartConfirm:"Leaving this practice clears the content on this page. Continue?" }
};

export default function PracticePage() {
  const [locale, setLocale] = useState<Locale>("zh");
  const [goal, setGoal] = useState<Goal | null>(null);
  const [stage, setStage] = useState<"choose" | "work" | "summary">("choose");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<Record<FieldKey, string>>>({});
  const [before, setBefore] = useState("");
  const [after, setAfter] = useState("");
  const t = copy[locale];
  const selected = goals.find((g) => g.id === goal);
  const practice = selected?.practice ?? "thought";
  const prompts = fields[practice];
  const current = prompts[step];
  const label = useMemo(() => selected ? (locale === "zh" ? selected.zh : selected.en) : "", [selected, locale]);
  function start() { if (!goal) return; setAnswers({}); setStep(0); setBefore(""); setAfter(""); setStage("work"); }
  function reset() { setGoal(null); setAnswers({}); setStep(0); setBefore(""); setAfter(""); setStage("choose"); }
  function leave() { if (window.confirm(t.restartConfirm)) reset(); }
  function exportNote() {
    const rows = prompts.map((p) => `${locale === "zh" ? p.zh : p.en}\n${answers[p.key] || "—"}`);
    const content = `Persona · ${t.summary}\n${new Date().toLocaleString(locale === "zh" ? "zh-SG" : "en-SG")}\nTopic: ${label}\n\n${rows.join("\n\n")}\n\n${t.exportNote}\n`;
    const url = URL.createObjectURL(new Blob([content], { type: "text/plain;charset=utf-8" }));
    const link = document.createElement("a"); link.href = url; link.download = locale === "zh" ? "persona-自我练习记录.txt" : "persona-self-reflection.txt";
    document.body.appendChild(link); link.click(); link.remove(); URL.revokeObjectURL(url);
  }
  return <main className="app-shell">
    <header className="topbar"><a className="brand" href="../"><span className="brand-mark">P</span><span>persona<span className="brand-dot">.</span></span></a><div className="nav-actions"><button className="language-toggle" onClick={() => setLocale(locale === "zh" ? "en" : "zh")}>{locale === "zh" ? "EN ↗" : "中文 ↗"}</button><a className="language-toggle" href="../">{t.home} ↗</a></div></header>
    <section className="results-wrap" style={{maxWidth:900}}>
      <div className="eyebrow"><span className="eyebrow-line" />{t.kicker}</div><h1 style={{fontSize:"clamp(2.2rem,5vw,4rem)",lineHeight:1.12,marginTop:24}}>{t.title}</h1><p className="results-intro">{t.intro}</p>
      {stage === "choose" && <section className="practice-panel">
        <h2>{t.choose}</h2><div className="practice-goals">{goals.map((g) => <button key={g.id} className={goal === g.id ? "practice-goal selected" : "practice-goal"} aria-pressed={goal === g.id} onClick={() => setGoal(g.id)}>{locale === "zh" ? g.zh : g.en}<span>{goal === g.id ? "✓" : "＋"}</span></button>)}</div>
        <p className="practice-soft-note">{t.noRight}</p><button className="button-primary" disabled={!goal} onClick={start}>{t.start} <span>→</span></button>
      </section>}
      {stage === "work" && current && <section className="practice-panel">
        <div className="practice-step-head"><span>{t.step} {step + 1} / {prompts.length}</span><span>{label}</span></div><div className="practice-progress"><span style={{width:`${((step+1)/prompts.length)*100}%`}} /></div>
        <h2>{locale === "zh" ? current.zh : current.en}</h2><p>{locale === "zh" ? current.hintZh : current.hintEn}</p>
        <textarea className="practice-textarea" rows={5} maxLength={1500} value={answers[current.key] || ""} onChange={(e) => setAnswers((prev) => ({...prev,[current.key]:e.target.value}))} placeholder={locale === "zh" ? current.placeholderZh : current.placeholderEn} aria-label={locale === "zh" ? current.zh : current.en} />
        {practice === "thought" && step === 1 && <div className="practice-rating"><label>{t.intensity}</label><div className="practice-rating-row"><span>{t.before}</span><select value={before} onChange={(e) => setBefore(e.target.value)}><option value="">—</option>{Array.from({length:11},(_,i)=><option key={i} value={String(i)}>{i}</option>)}</select></div><p>{t.rateHint}</p></div>}
        {practice === "thought" && step === prompts.length - 1 && <div className="practice-rating"><label>{t.intensity}</label><div className="practice-rating-row"><span>{t.after}</span><select value={after} onChange={(e) => setAfter(e.target.value)}><option value="">—</option>{Array.from({length:11},(_,i)=><option key={i} value={String(i)}>{i}</option>)}</select></div><p>{t.rateHint}</p></div>}
        <div className="practice-actions"><button className="button-secondary" onClick={() => step === 0 ? leave() : setStep((s) => s - 1)}>{step === 0 ? t.stop : `← ${t.back}`}</button><button className="button-primary" onClick={() => step === prompts.length - 1 ? setStage("summary") : setStep((s) => s + 1)}>{step === prompts.length - 1 ? t.finish : t.next} <span>→</span></button></div>
        <p className="practice-soft-note">{t.noRight}</p>
      </section>}
      {stage === "summary" && <section className="practice-panel">
        <h2>{t.summary}</h2><p>{t.summaryText}</p><div className="practice-summary-meta"><strong>{label}</strong>{practice === "thought" && (before !== "" || after !== "") && <span>{locale === "zh" ? `情绪自评：${before || "—"} → ${after || "—"} / 10（主观记录）` : `Self-rated intensity: ${before || "—"} → ${after || "—"} / 10 (subjective)`}</span>}</div>
        {prompts.map((p) => <article className="practice-answer" key={p.key}><h3>{locale === "zh" ? p.zh : p.en}</h3><p>{answers[p.key]?.trim() || (locale === "zh" ? "（未填写）" : "(Not entered)")}</p></article>)}
        <p className="practice-soft-note">{t.finishPrompt}</p><div className="practice-actions"><button className="button-secondary" onClick={() => setStage("work")}>{t.edit}</button><button className="button-primary" onClick={exportNote}>{t.download} ↗</button><button className="button-secondary" onClick={reset}>{t.again}</button></div>
      </section>}
      <section className="practice-panel practice-guidance"><h2>{t.evidence}</h2><p>{t.evidenceText}</p><p>{t.privacyText}</p><p className="practice-urgent">{t.urgent}</p><p className="practice-soft-note">{locale === "zh" ? "研究依据参考：NHS Every Mind Matters 的 Thought Record；NICE NG222 对结构化 CBT 自助材料与行为激活的建议。参考资料不等于对本应用的验证。" : "References: NHS Every Mind Matters, Thought Record; NICE NG222 recommendations on structured CBT self-help and behavioural activation. Evidence for an approach is not validation of this app."}</p><div className="practice-source-links"><a href="https://www.nhs.uk/every-mind-matters/mental-wellbeing-tips/self-help-cbt-techniques/thought-record/" target="_blank" rel="noreferrer">NHS · Thought Record ↗</a><a href="https://www.nice.org.uk/guidance/NG222/chapter/recommendations" target="_blank" rel="noreferrer">NICE · NG222 ↗</a><a href="https://www.mindline.sg/" target="_blank" rel="noreferrer">Singapore · national mindline 1771 ↗</a><a href="https://www.sos.org.sg/contact-us/" target="_blank" rel="noreferrer">Singapore · SOS crisis support ↗</a></div></section>
    </section>
    <footer><span>PERSONA · {locale === "zh" ? "人格洞察与心理建设" : "PERSONALITY INSIGHT & DEVELOPMENT"}</span><span>© 2026</span></footer>
    <style jsx>{`
      .practice-panel{background:#fff;border:1px solid #e8e5df;border-radius:22px;padding:clamp(20px,4vw,36px);margin:28px 0;box-shadow:0 14px 40px rgba(25,35,40,.035)}
      .practice-panel h2{font-size:clamp(1.3rem,3vw,1.8rem);margin:0 0 14px;color:#233a3a}
      .practice-panel p{line-height:1.75;color:#596767}
      .practice-goals{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin:24px 0}
      .practice-goal{display:flex;justify-content:space-between;align-items:center;text-align:left;gap:14px;padding:18px;border:1px solid #deded8;border-radius:14px;background:#fbfaf7;color:#273b3b;cursor:pointer;min-height:76px}
      .practice-goal.selected{border-color:#477b73;background:#edf5f1;box-shadow:inset 0 0 0 1px #477b73}
      .practice-goal span{font-size:1.1rem}
      .practice-soft-note{font-size:.92rem;color:#667574}
      .practice-step-head,.practice-rating-row{display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap;color:#5e706d;font-size:.9rem}
      .practice-progress{height:5px;background:#edf0ec;border-radius:9px;margin:16px 0 28px;overflow:hidden}
      .practice-progress span{display:block;height:100%;background:#4c8178;transition:width .2s ease}
      .practice-textarea{display:block;width:100%;resize:vertical;border:1px solid #d8ded9;border-radius:14px;padding:16px;font:inherit;line-height:1.65;background:#fcfcfa;color:#203333;margin:18px 0}
      .practice-textarea:focus,.practice-goal:focus-visible{outline:3px solid #a5c7bf;outline-offset:2px}
      .practice-actions{display:flex;gap:10px;flex-wrap:wrap;justify-content:space-between;margin-top:24px}
      .practice-rating{border-top:1px solid #e8e9e3;padding-top:18px;margin-top:20px}
      .practice-rating label{font-weight:600;color:#2e4744}
      .practice-rating select{border:1px solid #d8ded9;border-radius:10px;padding:8px 12px;background:#fff;color:#203333}
      .practice-rating p{font-size:.86rem}
      .practice-summary-meta{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;padding:14px;background:#f4f6f1;border-radius:12px;color:#36534f}
      .practice-answer{padding:18px 0;border-bottom:1px solid #ecece7}
      .practice-answer h3{font-size:1rem;color:#29413f;margin:0 0 8px}
      .practice-answer p{white-space:pre-wrap;overflow-wrap:anywhere;margin:0;color:#364846}
      .practice-guidance{background:#f8f8f4}
      .practice-urgent{border-left:3px solid #b78a57;padding:12px 16px;background:#f8f0e7;border-radius:0 10px 10px 0}
      .practice-source-links{display:flex;gap:18px;flex-wrap:wrap;margin-top:18px}
      .practice-source-links a{color:#356d64;text-decoration:underline;text-underline-offset:3px}
      @media(max-width:640px){.practice-goals{grid-template-columns:1fr}.practice-actions{flex-direction:column}.practice-actions button{width:100%}}
    `}</style>
  </main>;
}
