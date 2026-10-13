import { readFile } from "node:fs/promises";

const data = await readFile(new URL("../data/ipip-neo-120.ts", import.meta.url), "utf8");
const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");

const itemBlock = data.match(/export const IPIP_NEO_120[^=]*= \[(.*?)\n\];/s)?.[1];
if (!itemBlock) throw new Error("Could not locate IPIP_NEO_120 item array.");
const itemCount = (itemBlock.match(/^\s*\[/gm) || []).length;
if (itemCount !== 120) throw new Error(`Expected 120 inventory items; found ${itemCount}.`);

const reverseBlock = data.match(/IPIP_REVERSE_KEYED = new Set\(\[(.*?)\]\);/s)?.[1];
if (!reverseBlock) throw new Error("Could not locate reverse-key set.");
const reverseIds = [...reverseBlock.matchAll(/\d+/g)].map((m) => Number(m[0]));
if (new Set(reverseIds).size !== reverseIds.length || reverseIds.some((id) => id < 1 || id > 120)) {
  throw new Error("Reverse-key set contains duplicate or out-of-range IDs.");
}

const facetBlock = data.match(/export const IPIP_FACETS = \[(.*?)\] as const;/s)?.[1];
if (!facetBlock) throw new Error("Could not locate facet definitions.");
const facets = [...facetBlock.matchAll(/\{ id: "([^"]+)", trait: "([^"]+)"/g)].map((m) => ({ id: m[1], trait: m[2] }));
if (facets.length !== 30) throw new Error(`Expected 30 facets; found ${facets.length}.`);
const offsets = { emotionalBalance: 1, extraversion: 2, openness: 3, agreeableness: 4, conscientiousness: 5 };
const seen = new Map();
for (const [position, facet] of facets.entries()) {
  const offset = offsets[facet.trait];
  if (!offset) throw new Error(`Unknown trait for facet ${facet.id}: ${facet.trait}`);
  const withinTraitFacet = position % 6;
  const ids = [0, 1, 2, 3].map((step) => offset + withinTraitFacet * 5 + step * 30);
  if (new Set(ids).size !== 4) throw new Error(`Facet ${facet.id} repeats an item.`);
  for (const id of ids) {
    if (id < 1 || id > 120) throw new Error(`Facet ${facet.id} has out-of-range item ${id}.`);
    if (seen.has(id)) throw new Error(`Item ${id} is assigned to both ${seen.get(id)} and ${facet.id}.`);
    seen.set(id, facet.id);
  }
}
if (seen.size !== 120) throw new Error(`Expected all 120 items to appear in facets; mapped ${seen.size}.`);

const factorAssignment = (id) => (["emotionalBalance", "extraversion", "openness", "agreeableness", "conscientiousness"][(id - 1) % 5]);
const factorCounts = new Map();
for (let id = 1; id <= 120; id++) factorCounts.set(factorAssignment(id), (factorCounts.get(factorAssignment(id)) || 0) + 1);
if ([...factorCounts.values()].some((count) => count !== 24)) throw new Error("Broad factor mapping must assign exactly 24 items to each factor.");

for (const id of reverseIds) {
  if (!page.includes("IPIP_REVERSE_KEYED.has(id)") && !page.includes("IPIP_REVERSE_KEYED.has(q.id)")) {
    throw new Error("Could not find expected reverse-key scoring use in app/page.tsx.");
  }
}
if (!page.includes("dimension === \"emotionalBalance\" ? !originalReverse : originalReverse")) {
  throw new Error("Could not find explicit Emotional Stability direction inversion.");
}

console.log("PASS: 120 inventory items are present.");
console.log("PASS: reverse-key IDs are unique and within 1–120.");
console.log("PASS: 30 facets each map to four distinct, non-overlapping items covering all 120 IDs.");
console.log("PASS: broad factor assignment maps 24 items to each factor.");
console.log("PASS: app contains explicit Emotional Stability direction inversion.");
console.log("NOTE: This structural audit does not replace comparison with the authoritative IPIP scoring key or psychometric validation.");
