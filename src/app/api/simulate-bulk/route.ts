import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calculateReadiness } from "@/lib/calculations/readiness";
import { calculateAcceptanceProbability } from "@/lib/calculations/probability";
import { getMarketCompetition } from "@/lib/calculations/market";
import { logEvent } from "@/lib/analytics/logEvent";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const students = await prisma.student.findMany();
    if (!students || students.length === 0) {
      return NextResponse.json({ results: [] });
    }

    const results = students.map((student) => {
      const skillValues = [
        student.dsa,
        student.algorithms,
        student.systemDesign,
        student.react,
        student.node,
        student.python,
        student.sql,
        student.ml,
        student.dataAnalysis,
        student.embedded,
      ];

      const skillAvg = (skillValues.reduce((a, b) => a + b, 0) / skillValues.length) * 20;

      const readiness = calculateReadiness({
        skillAvg,
        projects: student.projects,
        internships: student.internships,
        cgpa: student.cgpa,
        roleMatch: 80,
      });

      const competitionIndex = getMarketCompetition(
        student.preferredRole,
        "MNC"
      );

      const experienceFactor = Math.min(1, student.internships / 2) * 100;

      const probability = calculateAcceptanceProbability({
        readiness,
        competitionIndex,
        experienceFactor,
        roleMatch: 80,
      });

      return isNaN(probability) ? 40 : probability;
    });

    // Log Analytics Event
    await logEvent("BULK_SIMULATION", (session?.user as any)?.id, {
      totalStudents: results.length,
    });

    return NextResponse.json({ results });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
