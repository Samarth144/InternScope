import { NextResponse } from "next/server";
import { calculateReadiness } from "@/lib/calculations/readiness";
import { calculateAcceptanceProbability } from "@/lib/calculations/probability";
import { getMarketCompetition } from "@/lib/calculations/market";

export async function GET() {
  const readiness = calculateReadiness({
    skillAvg: 70,
    projects: 3,
    internships: 1,
    cgpa: 8.5,
    roleMatch: 80,
  });

  const competition = getMarketCompetition("SDE", "TopTier");

  const probability = calculateAcceptanceProbability({
    readiness,
    competitionIndex: competition,
    experienceFactor: 50,
    roleMatch: 80,
  });

  return NextResponse.json({ readiness, competition, probability });
}
