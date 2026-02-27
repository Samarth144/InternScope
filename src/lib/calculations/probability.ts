import { clamp } from "./utils";

export interface ProbabilityInput {
  readiness: number;        // 0–100
  competitionIndex: number; // 0–100
  experienceFactor: number; // 0–100
  roleMatch: number;        // 0–100
}

export function calculateAcceptanceProbability(input: ProbabilityInput): number {
  const probability =
    input.readiness * 0.50 -
    input.competitionIndex * 0.30 +
    input.experienceFactor * 0.10 +
    input.roleMatch * 0.10;

  return clamp(Math.round(probability), 0, 100);
}
