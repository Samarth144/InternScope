import { calculateReadiness } from '../src/lib/calculations/readiness';
import { calculateAcceptanceProbability } from '../src/lib/calculations/probability';
import { getMarketCompetition } from '../src/lib/calculations/market';
import { calculateGrowthIndex } from '../src/lib/calculations/growth';

describe('Modular Calculation Engine', () => {
  describe('Readiness Engine', () => {
    test('calculateReadiness returns correct score', () => {
      const score = calculateReadiness({
        skillAvg: 70,
        projects: 3,
        internships: 1,
        cgpa: 8.5,
        roleMatch: 80,
      });
      // projectStrength = 100
      // experienceFactor = 50
      // cgpaNormalized = 85
      // 70 * 0.40 + 100 * 0.20 + 50 * 0.20 + 85 * 0.10 + 80 * 0.10
      // 28 + 20 + 10 + 8.5 + 8 = 74.5 -> Round to 75
      expect(score).toBe(75);
    });
  });

  describe('Market Intelligence Engine', () => {
    test('getMarketCompetition returns correct values', () => {
      expect(getMarketCompetition('SDE', 'TopTier')).toBe(85); // 75 + 10
      expect(getMarketCompetition('ML', 'Startup')).toBe(75);  // 85 - 10
      expect(getMarketCompetition('Unknown', 'MNC')).toBe(70); // 70 + 0
    });
  });

  describe('Acceptance Probability Engine', () => {
    test('calculateAcceptanceProbability returns correct chance', () => {
      const chance = calculateAcceptanceProbability({
        readiness: 75,
        competitionIndex: 85,
        experienceFactor: 50,
        roleMatch: 80,
      });
      // 75 * 0.50 - 85 * 0.30 + 50 * 0.10 + 80 * 0.10
      // 37.5 - 25.5 + 5 + 8 = 25
      expect(chance).toBe(25);
    });

    test('probability is clamped between 0 and 100', () => {
       const low = calculateAcceptanceProbability({
         readiness: 0,
         competitionIndex: 100,
         experienceFactor: 0,
         roleMatch: 0
       });
       expect(low).toBe(0);

       const high = calculateAcceptanceProbability({
         readiness: 100,
         competitionIndex: 0,
         experienceFactor: 100,
         roleMatch: 100
       });
       expect(high).toBe(70);
    });
  });

  describe('Growth Index Engine', () => {
    test('calculateGrowthIndex returns correct percentage', () => {
      const growth = calculateGrowthIndex({
        learningScore: 5,
        brandScore: 4,
        techStackValue: 3,
        networkScore: 5
      });
      // 5*0.4 + 4*0.3 + 3*0.2 + 5*0.1 = 2 + 1.2 + 0.6 + 0.5 = 4.3
      // (4.3 / 5) * 100 = 86
      expect(growth).toBe(86);
    });
  });
});
