export function toResponseIndex(values: number[]): number;
export function scoreItemIds(ids: number[], answers: Record<number, number>, reverseKeyed: Set<number>, invertDirection?: boolean): number;
export function factorItemIds(dimension: string): number[];
export function facetItemIds(position: number, trait: string): number[];
