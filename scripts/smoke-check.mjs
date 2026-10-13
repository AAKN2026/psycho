import { access, readFile } from "node:fs/promises";
import { join } from "node:path";

const outDir = join(process.cwd(), "out");
const checks = [
  { path: "index.html", label: "homepage export" },
  { path: "practice/index.html", label: "guided practice route export" },
  { path: "discover/index.html", label: "60-second discovery route export" },
  { path: "404.html", label: "not-found export" },
  { path: "favicon.svg", label: "favicon export" },
  { path: "robots.txt", label: "robots policy export" },
];

let failed = false;
for (const check of checks) {
  try {
    await access(join(outDir, check.path));
    console.log(`PASS ${check.label}`);
  } catch {
    failed = true;
    console.error(`FAIL ${check.label}: missing out/${check.path}`);
  }
}

try {
  const html = await readFile(join(outDir, "index.html"), "utf8");
  const practiceHtml = await readFile(join(outDir, "practice/index.html"), "utf8");
  const discoverHtml = await readFile(join(outDir, "discover/index.html"), "utf8");
  const discoverSource = await readFile(new URL("../app/discover/page.tsx", import.meta.url), "utf8");
  const practiceSource = await readFile(new URL("../app/practice/page.tsx", import.meta.url), "utf8");
  const appSource = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  const practiceRequired = [
    "练习内容只保存在当前页面的内存中",
    "此网站不进行危机监测",
    "national mindline 1771",
    "Singapore · SOS crisis support",
  ];
  for (const phrase of practiceRequired) {
    if (!practiceHtml.includes(phrase)) {
      failed = true;
      console.error(`FAIL practice safety/privacy content: missing ${phrase}`);
    }
  }
  if (!practiceSource.includes("What would you most like to explore right now?") ||
      !practiceSource.includes("What happened?") ||
      !practiceSource.includes("Stop at any time if this exercise makes you feel worse.")) {
    failed = true;
    console.error("FAIL practice bilingual prompts or stop/safety copy");
  } else {
    console.log("PASS practice bilingual prompts and stop/safety copy");
  }
  if (practiceSource.includes("localStorage") || practiceSource.includes("fetch(")) {
    failed = true;
    console.error("FAIL practice privacy boundary: unexpected browser persistence or network request");
  } else {
    console.log("PASS practice notes are not persisted or uploaded by the practice page");
  }
  for (const phrase of [
    "random retrieval-code metadata",
    "随机提取码相关记录",
    "has no cloud-record deletion control",
    "没有云端记录删除功能",
    "not encrypted",
    "未加密",
  ]) {
    if (!appSource.includes(phrase)) {
      failed = true;
      console.error(`FAIL assessment cloud privacy disclosure: missing ${phrase}`);
    }
  }
  if (!html.includes("/psycho/_next/")) {
    failed = true;
    console.error("FAIL GitHub Pages asset base path: expected /psycho/_next/");
  } else {
    console.log("PASS GitHub Pages asset base path");
  }
  if (!html.includes("/psycho/practice/")) {
    failed = true;
    console.error("FAIL homepage practice entry: expected /psycho/practice/ link");
  } else {
    console.log("PASS homepage links to guided practice");
  }

  for (const phrase of ["你遇到事情时", "自我探索挑战", "你的探索反馈", "解释边界"]) {
    if (!discoverHtml.includes(phrase)) {
      failed = true;
      console.error(`FAIL discovery route content: missing ${phrase}`);
    }
  }
  if (!discoverSource.includes("When an unfamiliar opportunity appears") ||
      !discoverSource.includes("not a validated personality measure") ||
      !discoverSource.includes("does not save or upload") ||
      discoverSource.includes("localStorage") ||
      discoverSource.includes("fetch(") ||
      !discoverSource.includes("function createShareCard()") ||
      !discoverSource.includes("Save image card") ||
      !discoverSource.includes("navigator.canShare")) {
    failed = true;
    console.error("FAIL discovery bilingual, interpretation-boundary, or privacy checks");
  } else {
    console.log("PASS discovery bilingual copy, interpretation boundary, and no persistence/upload");
  }
  if (!html.includes("/psycho/discover/")) {
    failed = true;
    console.error("FAIL homepage discovery entry: expected /psycho/discover/ link");
  } else {
    console.log("PASS homepage links to 60-second discovery");
  }
  if (!html.includes("Persona")) {
    failed = true;
    console.error("FAIL homepage content: expected Persona title text");
  } else {
    console.log("PASS homepage content");
  }
} catch (error) {
  failed = true;
  console.error(`FAIL homepage content: ${error instanceof Error ? error.message : String(error)}`);
}

if (failed) {
  console.error("Static export checks failed.");
  process.exitCode = 1;
} else {
  console.log("All static export checks passed.");
}
