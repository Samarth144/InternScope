export interface MarketModel {
  role: string;
  tier: string;
  location: string;
  competitionIndex: number; // 0–100
}

export function getMarketCompetition(role: string, tier: string): number {
  const baseMap: Record<string, number> = {
    SDE: 75,
    ML: 85,
    Data: 70,
    Embedded: 60,
  };

  const tierModifier: Record<string, number> = {
    Startup: -10,
    MNC: 0,
    TopTier: +10,
  };

  const base = baseMap[role] ?? 70;
  const modifier = tierModifier[tier] ?? 0;

  return Math.min(100, base + modifier);
}

export function getDefaultCompetitionIndex(): number {
  return 75; // Centralized default competition index
}
