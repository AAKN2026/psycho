"use client";

import { useMemo, useState } from "react";

type Locale = "zh" | "en";
type Choice = { id: string; zh: string; en: string; theme: string };
type Prompt = { titleZh: string; titleEn: string; noteZh: string; noteEn: string; choices: Choice[] };

const prompts: Prompt[] = [
  {
    titleZh: "计划突然改变，你最先做什么？",
    titleEn: "When a plan suddenly changes, what do you do first?",
    noteZh: "想象一个普通的日常情境。选择最接近你通常做法的一项，不必选择“最好”的答案。",
    noteEn: "Picture an everyday situation. Choose what is closest to your usual response, not what sounds best.",
    choices: [
      { id: "map", zh: "先重新整理信息，找出新的安排", en: "Reorganise the information and make a new plan", theme: "structure" },
      { id: "try", zh: "先试一个可行办法，再边做边调整", en: "Try a workable option and adjust as I go", theme: "action" },
      { id: "pause", zh: "先停一下，看看自己和他人的状态", en: "Pause and check how I and others are doing", theme: "context" },
    ],
  },
  {
    titleZh: "面对一个不熟悉的机会，你通常会？",
    titleEn: "When an unfamiliar opportunity appears, you tend to…",
    noteZh: "考虑你真实会采取的第一步，而不是最终是否接受机会。",
    noteEn: "Think about your likely first step, not whether you eventually accept the opportunity.",
    choices: [
      { id: "research", zh: "先搜集资料，弄清楚风险与要求", en: "Gather information about the risks and requirements", theme: "structure" },
      { id: "experiment", zh: "小范围尝试，从经验中学习", en: "Run a small experiment and learn by doing", theme: "action" },
      { id: "discuss", zh: "找信任的人交流，听听不同看法", en: "Talk it through with someone I trust", theme: "context" },
    ],
  },
  {
    titleZh: "和别人意见不同时，你更可能先？",
    titleEn: "When you disagree with someone, you are more likely to first…",
    noteZh: "没有正确或错误的选择。不同场景、关系与压力都可能改变你的做法。",
    noteEn: "There is no right or wrong choice. Context, relationships and pressure can change how you respond.",
    choices: [
      { id: "clarify", zh: "厘清事实与分歧到底在哪里", en: "Clarify the facts and where we differ", theme: "structure" },
      { id: "propose", zh: "提出一个可以继续推进的方案", en: "Suggest an option that helps us move forward", theme: "action" },
      { id: "listen", zh: "先理解对方为什么这样想", en: "Understand why the other person sees it that way", theme: "context" },
    ],
  },
];

const feedback = {
  zh: {
    structure: { title: "你这次更常选择：先厘清与组织", body: "在这几种情境中，你多次选择先整理信息、明确问题或弄清要求。可以继续探索：结构感什么时候帮到你？什么时候可能让你花太久准备？", prompt: "下一步反思：什么信息已经足够，让你可以开始行动？" },
    action: { title: "你这次更常选择：先尝试再调整", body: "在这几种情境中，你多次选择从可行的小步骤开始。可以继续探索：行动如何帮你获得信息？什么时候值得先停下来评估影响？", prompt: "下一步反思：怎样把下一步缩小到一个低风险的尝试？" },
    context: { title: "你这次更常选择：先留意情境与关系", body: "在这几种情境中，你多次选择观察状态、听取看法或理解他人。可以继续探索：这种敏感度什么时候有帮助？什么时候也需要明确表达自己的需要？", prompt: "下一步反思：怎样同时照顾他人的视角和自己的界限？" },
    tie: { title: "你的选择分布在不同方向", body: "你在不同情境里选择了不同的起点。这可能反映情境本身的重要性，也可能只是这些选项没有完全表达你的真实做法。", prompt: "下一步反思：哪些因素会改变你处理问题的第一步？" },
  },
  en: {
    structure: { title: "In this activity, you often chose to clarify and organise first", body: "Across these scenarios, you repeatedly chose to organise information, define the issue or understand the requirements. Explore when structure helps—and when preparation may take longer than needed.", prompt: "Reflect: What information is enough for you to begin?" },
    action: { title: "In this activity, you often chose to try and adjust", body: "Across these scenarios, you repeatedly chose a small workable step. Explore how action helps you learn, and when it may be useful to pause and assess the impact first.", prompt: "Reflect: What is one small, low-risk experiment you could try?" },
    context: { title: "In this activity, you often chose to notice context and relationships first", body: "Across these scenarios, you repeatedly chose to check in, listen or understand others. Explore when this helps—and when you may also need to state your own needs clearly.", prompt: "Reflect: How can you consider others while respecting your own boundaries?" },
    tie: { title: "Your choices moved in different directions", body: "You chose different starting points across scenarios. That may reflect the importance of context, or simply that these options did not fully capture your real response.", prompt: "Reflect: What changes the first step you take when facing a challenge?" },
  },
};

export default function DiscoverPage() {
  const [locale, setLocale] = useState<Locale>("zh");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [shared, setShared] = useState(false);
  const isZh = locale === "zh";
  const result = useMemo(() => {
    if (answers.length !== prompts.length) return null;
    const counts = answers.reduce<Record<string, number>>((acc, id) => {
      const theme = prompts.flatMap((prompt) => prompt.choices).find((choice) => choice.id === id)?.theme;
      if (theme) acc[theme] = (acc[theme] || 0) + 1;
      return acc;
    }, {});
    const max = Math.max(...Object.values(counts));
    const leaders = Object.entries(counts).filter(([, count]) => count === max);
    const key = leaders.length === 1 ? leaders[0][0] as "structure" | "action" | "context" : "tie";
    return { key, ...feedback[locale][key] };
  }, [answers, locale]);

  function choose(id: string) {
    const next = [...answers.slice(0, step), id];
    setAnswers(next);
    setShared(false);
    if (step < prompts.length - 1) setStep(step + 1);
  }

  function restart() {
    setStep(0);
    setAnswers([]);
    setShared(false);
  }

  function createShareCard(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!result) { reject(new Error("No result to share")); return; }
      const canvas = document.createElement("canvas");
      canvas.width = 1200;
      canvas.height = 630;
      const ctx = canvas.getContext("2d");
      if (!ctx) { reject(new Error("Canvas is unavailable")); return; }
      const background = ctx.createLinearGradient(0, 0, 1200, 630);
      background.addColorStop(0, "#f7f5ee");
      background.addColorStop(1, "#e8eee4");
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, 1200, 630);
      ctx.fillStyle = "#526b51";
      ctx.fillRect(72, 72, 5, 48);
      ctx.font = "600 25px Arial, 'Noto Sans SC', sans-serif";
      ctx.fillText("PERSONA · SELF-DISCOVERY", 98, 103);
      ctx.fillStyle = "#25372e";
      ctx.font = "500 46px Arial, 'Noto Sans SC', sans-serif";
      const titleWords = result.title.split(/\\s+/);
      let titleLine = "";
      let titleY = 210;
      for (const word of titleWords) {
        const candidate = titleLine ? titleLine + (isZh ? "" : " ") + word : word;
        if (ctx.measureText(candidate).width > 1000 && titleLine) {
          ctx.fillText(titleLine, 76, titleY);
          titleLine = word;
          titleY += 62;
        } else titleLine = candidate;
      }
      if (titleLine) ctx.fillText(titleLine, 76, titleY);
      ctx.fillStyle = "#58675b";
      ctx.font = "28px Arial, 'Noto Sans SC', sans-serif";
      const bodyWords = result.body.split(/\\s+/);
      let bodyLine = "";
      let bodyY = titleY + 76;
      for (const word of bodyWords) {
        const candidate = bodyLine ? bodyLine + (isZh ? "" : " ") + word : word;
        if (ctx.measureText(candidate).width > 1030 && bodyLine) {
          ctx.fillText(bodyLine, 78, bodyY);
          bodyLine = word;
          bodyY += 43;
        } else bodyLine = candidate;
      }
      if (bodyLine && bodyY < 485) ctx.fillText(bodyLine, 78, bodyY);
      ctx.strokeStyle = "#cbd6c7";
      ctx.beginPath();
      ctx.moveTo(78, 525);
      ctx.lineTo(1122, 525);
      ctx.stroke();
      ctx.fillStyle = "#526b51";
      ctx.font = "600 22px Arial, 'Noto Sans SC', sans-serif";
      ctx.fillText("aakn2026.github.io/psycho/discover", 78, 570);
      ctx.fillStyle = "#758174";
      ctx.font = "18px Arial, 'Noto Sans SC', sans-serif";
      ctx.fillText(isZh ? "自我反思体验 · 非心理诊断" : "Self-reflection · Not a psychological diagnosis", 700, 570);
      canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("Could not render share card")), "image/png");
    });
  }

  async function downloadShareCard() {
    try {
      const blob = await createShareCard();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "persona-self-discovery.png";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch {
      setShared(false);
    }
  }

  async function shareResult() {
    if (!result) return;
    const text = `Persona · ${result.title}\n\n${result.body}\n\n${isZh ? "这是一项自我反思体验，不是心理诊断。你也来试试：" : "A self-reflection activity, not a psychological diagnosis. Try it yourself:"}\nhttps://aakn2026.github.io/psycho/discover/`;
    try {
      const blob = await createShareCard();
      const file = new File([blob], "persona-self-discovery.png", { type: "image/png" });
      if (typeof navigator !== "undefined" && navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ title: "Persona · Self-discovery", text, files: [file] });
      } else if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({ title: "Persona · Self-discovery", text });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        setShared(true);
      } else {
        window.prompt(isZh ? "复制以下内容分享" : "Copy this text to share", text);
      }
    } catch {
      // A cancelled share is not an error for the user.
    }
  }

  const progress = Math.round((answers.length / prompts.length) * 100);

  return (
    <main className="discover-page">
      <header className="discover-nav">
        <a className="brand" href="/psycho/"><span className="brand-mark">P</span><span>persona<span className="brand-dot">.</span></span></a>
        <div className="discover-nav-actions">
          <span>{isZh ? "约 60 秒 · 无需注册" : "About 60 sec · No sign-up"}</span>
          <button className="language-toggle" onClick={() => setLocale(isZh ? "en" : "zh")}>{isZh ? "EN ↗" : "中文 ↗"}</button>
        </div>
      </header>

      <section className="discover-hero">
        <div className="eyebrow"><span className="eyebrow-line" />{isZh ? "PERSONA · 自我探索挑战" : "PERSONA · SELF-DISCOVERY CHALLENGE"}</div>
        <h1>{isZh ? <>你遇到事情时，<br />第一反应是什么？</> : <>When life shifts,<br />what do you do first?</>}</h1>
        <p>{isZh ? "三个日常情境，看看你这次更倾向从哪里开始。不是给你贴标签，而是提供一个值得思考的新问题。" : "Three everyday scenarios to explore where you tend to start. Not a label—just a useful question to consider."}</p>
        <div className="discover-pills"><span>✳ {isZh ? "情境选择" : "Scenario choices"}</span><span>◌ {isZh ? "即时反思" : "Reflection"}</span><span>↗ {isZh ? "主动分享" : "Optional sharing"}</span></div>
      </section>

      {answers.length < prompts.length ? (
        <section className="discover-card" aria-live="polite">
          <div className="discover-card-top"><span>{isZh ? `情境 ${step + 1} / ${prompts.length}` : `SCENARIO ${step + 1} / ${prompts.length}`}</span><span>{progress}%</span></div>
          <div className="discover-progress"><span style={{ width: `${((step) / prompts.length) * 100}%` }} /></div>
          <h2>{isZh ? prompts[step].titleZh : prompts[step].titleEn}</h2>
          <p className="discover-question-note">{isZh ? prompts[step].noteZh : prompts[step].noteEn}</p>
          <div className="discover-choices">{prompts[step].choices.map((choice, i) => (
            <button className="discover-choice" key={choice.id} onClick={() => choose(choice.id)}>
              <span className="discover-choice-index">{String.fromCharCode(65 + i)}</span><span>{isZh ? choice.zh : choice.en}</span><span className="discover-choice-arrow">↗</span>
            </button>
          ))}</div>
          {step > 0 && <button className="discover-back" onClick={() => { setStep(step - 1); setAnswers(answers.slice(0, -1)); }}>{isZh ? "← 上一题" : "← Previous"}</button>}
          <p className="discover-privacy">{isZh ? "你的选择只用于本次页面内生成反馈，不会由此页面保存或上传。" : "Your choices are used only to generate this on-page feedback. This page does not save or upload them."}</p>
        </section>
      ) : result ? (
        <section className="discover-card discover-result" aria-live="polite">
          <div className="eyebrow"><span className="eyebrow-line" />{isZh ? "你的探索反馈" : "YOUR REFLECTION"}</div>
          <h2>{result.title}</h2>
          <p>{result.body}</p>
          <div className="discover-reflection"><span>{isZh ? "带走一个问题" : "A QUESTION TO TAKE WITH YOU"}</span><strong>{result.prompt}</strong></div>
          <p className="discover-boundary">{isZh ? "解释边界：这只是你在三个假设情境中的选择摘要，不是经过验证的人格量表，不用于推断人格类型、心理健康、动机或能力。疲劳、情境理解和选项设计都可能影响选择。" : "Interpretation boundary: this summarises choices in three hypothetical scenarios. It is not a validated personality measure and cannot establish personality type, mental health, motives or ability. Fatigue, interpretation and option design can affect choices."}</p>
          <div className="discover-result-actions"><button className="button-primary" onClick={shareResult}>{isZh ? "分享我的探索卡" : "Share my reflection"} <span>↗</span></button><button className="button-secondary" onClick={downloadShareCard}>{isZh ? "保存图片卡片" : "Save image card"} ↓</button><button className="button-secondary" onClick={restart}>{isZh ? "再试一次" : "Try again"} ↻</button></div>
          {shared && <p className="discover-share-status" role="status">{isZh ? "已复制分享文案，可以粘贴到你选择的平台。" : "Share text copied. Paste it into your preferred app."}</p>}
          <a className="discover-full-test" href="/psycho/">{isZh ? "想了解更完整的人格维度？进入 IPIP-NEO-120 测评 →" : "Want a fuller personality profile? Explore the IPIP-NEO-120 assessment →"}</a>
        </section>
      ) : null}

      <footer className="discover-footer"><a href="/psycho/">{isZh ? "返回 Persona 首页" : "Back to Persona home"}</a><span>© 2026 Persona</span></footer>
    </main>
  );
}
