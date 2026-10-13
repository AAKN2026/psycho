import { readFile } from "node:fs/promises";
import { facetItemIds, factorItemIds, scoreItemIds } from "../lib/scoring.mjs";

const data = await readFile(new URL("../data/ipip-neo-120.ts", import.meta.url), "utf8");
const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
const itemPairs = [...data.matchAll(/\["([^"]+)",\s*"([^"]+)"\]/g)].slice(0, 120).map((m) => ({ en: m[1], zh: m[2] }));
if (itemPairs.length !== 120) throw new Error("Expected 120 bilingual item pairs; found " + itemPairs.length);
if (itemPairs.some((item) => !item.en.trim() || !item.zh.trim())) throw new Error("An item has missing English or Chinese text.");
if (new Set(itemPairs.map((item) => item.en)).size !== 120) throw new Error("Duplicate English item text detected.");

const reverseBlock = data.match(/IPIP_REVERSE_KEYED = new Set\(\[(.*?)\]\);/s)?.[1];
if (!reverseBlock) throw new Error("Could not locate reverse-key set.");
const reverseIds = [...reverseBlock.matchAll(/\d+/g)].map((m) => Number(m[0]));
const expectedReverseIds = [9,19,24,30,39,40,48,49,51,53,54,60,62,67,68,69,70,73,74,75,78,79,80,81,83,84,85,88,89,90,92,94,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,113,114,115,116,118,119,120];
const sameNumbers = (a,b) => a.length === b.length && [...a].sort((x,y)=>x-y).every((v,i)=>v === [...b].sort((x,y)=>x-y)[i]);
if (new Set(reverseIds).size !== reverseIds.length || reverseIds.some((id) => id < 1 || id > 120)) throw new Error("Reverse-key set contains duplicate or out-of-range IDs.");
if (!sameNumbers(reverseIds, expectedReverseIds)) throw new Error("Reverse-key IDs differ from the authoritative IPIP-NEO-120 facet key snapshot.");

const facetBlock = data.match(/export const IPIP_FACETS = \[(.*?)\] as const;/s)?.[1];
if (!facetBlock) throw new Error("Could not locate facet definitions.");
const facets = [...facetBlock.matchAll(/\{ id: "([^"]+)", trait: "([^"]+)"/g)].map((m) => ({ id: m[1], trait: m[2] }));
if (facets.length !== 30) throw new Error("Expected 30 facets; found " + facets.length);
const offsets = { emotionalBalance: 1, extraversion: 2, openness: 3, agreeableness: 4, conscientiousness: 5 };
const seen = new Map();
const facetSnapshots = [
 [1,31,61,91],[6,36,66,96],[11,41,71,101],[16,46,76,106],[21,51,81,111],[26,56,86,116],
 [2,32,62,92],[7,37,67,97],[12,42,72,102],[17,47,77,107],[22,52,82,112],[27,57,87,117],
 [3,33,63,93],[8,38,68,98],[13,43,73,103],[18,48,78,108],[23,53,83,113],[28,58,88,118],
 [4,34,64,94],[9,39,69,99],[14,44,74,104],[19,49,79,109],[24,54,84,114],[29,59,89,119],
 [5,35,65,95],[10,40,70,100],[15,45,75,105],[20,50,80,110],[25,55,85,115],[30,60,90,120]
];
for (const [position, facet] of facets.entries()) {
  const expected = facetSnapshots[position];
  const actual = facetItemIds(position % 6, facet.trait);
  if (!sameNumbers(actual, expected)) throw new Error("Facet " + facet.id + " item IDs mismatch: " + actual.join(",") + " vs " + expected.join(","));
  const offset = offsets[facet.trait];
  if (!offset) throw new Error("Unknown trait for facet " + facet.id);
  for (const id of actual) {
    if (seen.has(id)) throw new Error("Item " + id + " is assigned to both " + seen.get(id) + " and " + facet.id);
    seen.set(id, facet.id);
  }
}
if (seen.size !== 120) throw new Error("Expected all 120 items to appear in facets; mapped " + seen.size);

const dimensions = ["emotionalBalance", "extraversion", "openness", "agreeableness", "conscientiousness"];
for (const dimension of dimensions) {
  const ids = factorItemIds(dimension);
  if (ids.length !== 24 || new Set(ids).size !== 24) throw new Error("Dimension " + dimension + " must contain 24 unique items.");
}
if (!page.includes("scoreItemIds(ids, answers as Record<number, number>, IPIP_REVERSE_KEYED, dimension.key === \"emotionalBalance\")")) throw new Error("The report does not use the tested scoring function for broad factors.");
if (!page.includes("scoreItemIds(ids, answers as Record<number, number>, IPIP_REVERSE_KEYED)")) throw new Error("The report does not use the tested scoring function for facets.");

// Known-pattern tests against the same scoring module used by the app.
const allMiddle = Object.fromEntries(Array.from({length:120}, (_,i) => [i+1, 3]));
for (const dimension of dimensions) {
  if (scoreItemIds(factorItemIds(dimension), allMiddle, new Set(expectedReverseIds), dimension === "emotionalBalance") !== 50) throw new Error("All-3 pattern should score 50 for " + dimension);
}
for (let position=0; position<30; position++) {
  const trait = facets[position].trait;
  if (scoreItemIds(facetSnapshots[position], allMiddle, new Set(expectedReverseIds)) !== 50) throw new Error("All-3 pattern should score 50 for facet " + facets[position].id);
}
const keyedHigh = Object.fromEntries(Array.from({length:120}, (_,i) => { const id=i+1; return [id, expectedReverseIds.includes(id) ? 1 : 5]; }));
for (const dimension of dimensions) {
  const expected = dimension === "emotionalBalance" ? 0 : 100;
  const actual = scoreItemIds(factorItemIds(dimension), keyedHigh, new Set(expectedReverseIds), dimension === "emotionalBalance");
  if (actual !== expected) throw new Error("Keyed-high known pattern mismatch for " + dimension + ": " + actual + " vs " + expected);
}
for (let position=0; position<30; position++) {
  const actual = scoreItemIds(facetSnapshots[position], keyedHigh, new Set(expectedReverseIds));
  if (actual !== 100) throw new Error("Keyed-high pattern should score 100 for facet " + facets[position].id + ", got " + actual);
}
const inversePattern = Object.fromEntries(Array.from({length:120}, (_,i) => { const id=i+1; return [id, expectedReverseIds.includes(id) ? 5 : 1]; }));
for (const dimension of dimensions) {
  const expected = dimension === "emotionalBalance" ? 100 : 0;
  const actual = scoreItemIds(factorItemIds(dimension), inversePattern, new Set(expectedReverseIds), dimension === "emotionalBalance");
  if (actual !== expected) throw new Error("Inverse known pattern mismatch for " + dimension + ": " + actual + " vs " + expected);
}
for (let position=0; position<30; position++) {
  const actual = scoreItemIds(facetSnapshots[position], inversePattern, new Set(expectedReverseIds));
  if (actual !== 0) throw new Error("Inverse pattern should score 0 for facet " + facets[position].id + ", got " + actual);
}

console.log("PASS: 120 bilingual items are present with no duplicate English text.");
console.log("PASS: reverse-key IDs exactly match the 55-item source-key snapshot.");
console.log("PASS: all 30 facets map to their explicit four-item ID snapshots with no overlap.");
console.log("PASS: all five factors contain 24 items.");
console.log("PASS: all-3 known pattern returns 50 for every factor and facet.");
console.log("PASS: keyed-high and inverse known patterns return expected 0/100 scores.");
console.log("LIMIT: source text comparison remains a documented human-reviewed comparison against the linked IPIP source; these tests verify local snapshots and scoring mechanics, not psychometric validity.");
