import { access, readFile } from "node:fs/promises";
import { join } from "node:path";

const outDir = join(process.cwd(), "out");
const checks = [
  { path: "index.html", label: "homepage export" },
  { path: "practice/index.html", label: "guided practice route export" },
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
