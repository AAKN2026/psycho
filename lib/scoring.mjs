export function toResponseIndex(values) {
  if (!Array.isArray(values) || values.length === 0) return 50;
  const average = values.reduce((sum, value) => sum + value, 0) / values.length;
  return Math.round(((average - 1) / 4) * 100);
}

/** Score original IPIP-keyed items; invertDirection reverses the entire scale. */
export function scoreItemIds(ids, answers, reverseKeyed, invertDirection = false) {
  const values = ids.map((id) => {
    const answer = answers[id];
    if (![1, 2, 3, 4, 5].includes(answer)) throw new Error("Missing or invalid answer for item " + id);
    const reverse = reverseKeyed.has(id) !== invertDirection;
    return reverse ? 6 - answer : answer;
  });
  return toResponseIndex(values);
}

export function factorItemIds(dimension) {
  const offsets = { emotionalBalance: 1, extraversion: 2, openness: 3, agreeableness: 4, conscientiousness: 5 };
  const offset = offsets[dimension];
  if (!offset) throw new Error("Unknown dimension: " + dimension);
  return Array.from({ length: 24 }, (_, i) => offset + i * 5);
}

export function facetItemIds(position, trait) {
  const offsets = { emotionalBalance: 1, extraversion: 2, openness: 3, agreeableness: 4, conscientiousness: 5 };
  const offset = offsets[trait];
  if (!offset || !Number.isInteger(position) || position < 0 || position > 5) throw new Error("Invalid facet mapping: " + trait + " / " + position);
  return [0, 1, 2, 3].map((block) => offset + position * 5 + block * 30);
}
