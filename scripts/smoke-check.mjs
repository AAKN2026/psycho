const baseUrl = (process.env.BASE_URL || "http://localhost:3000").replace(/\/$/, "");
const checks = [
  { path: "/", label: "homepage" },
  { path: "/favicon.svg", label: "favicon" },
  { path: "/robots.txt", label: "robots policy" },
  { path: "/api/health", label: "health endpoint" },
];

let failed = false;
for (const check of checks) {
  try {
    const response = await fetch(new URL(check.path, baseUrl), {
      redirect: "manual",
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) {
      failed = true;
      console.error(`FAIL ${check.label}: HTTP ${response.status}`);
      continue;
    }
    if (check.path === "/api/health") {
      const payload = await response.json();
      if (payload.status !== "ok" || payload.service !== "persona") {
        failed = true;
        console.error("FAIL health endpoint: unexpected response payload");
        continue;
      }
    }
    console.log(`PASS ${check.label}: HTTP ${response.status}`);
  } catch (error) {
    failed = true;
    console.error(`FAIL ${check.label}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

if (failed) {
  console.error(`Smoke checks failed for ${baseUrl}`);
  process.exitCode = 1;
} else {
  console.log(`All smoke checks passed for ${baseUrl}`);
}
