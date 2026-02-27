import { calculateReadiness, calculateAcceptanceProbability } from '../src/lib/utils/calculations';

describe('InternScope Calculations', () => {
  test('calculateReadiness returns a score between 0 and 100', () => {
    const profile = {
      dsa: 8, algorithms: 8, systemDesign: 7, react: 9, node: 8,
      python: 6, sql: 7, ml: 5, dataAnalysis: 6, embedded: 4,
      projectsCount: 3, internshipsCount: 1, cgpa: 9.0, preferredRole: 'Software Engineer'
    };
    const score = calculateReadiness(profile);
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });

  test('calculateAcceptanceProbability clamps value between 0 and 100', () => {
    const readiness = 80;
    const competitionIndex = 50;
    const internshipsCount = 2;
    
    const probability = calculateAcceptanceProbability(readiness, competitionIndex, internshipsCount);
    expect(probability).toBeGreaterThanOrEqual(0);
    expect(probability).toBeLessThanOrEqual(100);
  });

  test('High readiness increases acceptance probability', () => {
    const low = calculateAcceptanceProbability(50, 50, 0);
    const high = calculateAcceptanceProbability(90, 50, 2);
    expect(high).toBeGreaterThan(low);
  });
});
