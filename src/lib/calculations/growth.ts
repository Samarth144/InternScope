export interface OfferInput {
  learningScore: number;    // 1–5
  brandScore: number;       // 1–5
  techStackValue: number;   // 1–5
  networkScore: number;     // 1–5
}

export function calculateGrowthIndex(input: OfferInput): number {
  const growth =
    input.learningScore * 0.40 +
    input.brandScore * 0.30 +
    input.techStackValue * 0.20 +
    input.networkScore * 0.10;

  return Math.round((growth / 5) * 100);
}
