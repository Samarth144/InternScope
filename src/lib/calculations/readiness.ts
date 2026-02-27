import { normalizeTo100 } from "./utils";

export interface ReadinessInput {
  skillAvg: number;        // 0–100
  projects: number;        // count
  internships: number;     // count
  cgpa: number;            // raw cgpa (assume /10)
  roleMatch: number;       // 0–100
}

export function calculateReadiness(input: ReadinessInput): number {
  const projectStrength = Math.min(1, input.projects / 3) * 100;
  const experienceFactor = Math.min(1, input.internships / 2) * 100;
  const cgpaNormalized = normalizeTo100(input.cgpa, 10);

  const readiness =
    input.skillAvg * 0.40 +
    projectStrength * 0.20 +
    experienceFactor * 0.20 +
    cgpaNormalized * 0.10 +
    input.roleMatch * 0.10;

  return Math.round(readiness);
}
