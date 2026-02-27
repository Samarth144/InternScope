import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calculateReadiness } from "@/lib/calculations/readiness";
import { getCompetitionIndex } from "@/lib/market/competitionEngine";
import { getTopMatches } from "@/lib/matching/matchingEngine";
import { getSkillDemandMap } from "@/lib/market/skillDemandEngine";
import { logEvent } from "@/lib/analytics/logEvent";

export const dynamic = "force-dynamic"

// Helper to categorize role
function categorize(role: string) {
  const r = role.toLowerCase();
  
  // Mobile
  if (r.includes("mobile") || r.includes("android") || r.includes("flutter") || r.includes("ios")) return "Mobile Development";
  
  // Backend
  if (r.includes("backend") || r.includes("python") || r.includes("node") || r.includes("cloud") || r.includes("devops") || r.includes("cyber")) return "Backend Development";
  
  // Data & AI
  if (r.includes("data") || r.includes("ml") || r.includes("machine") || r.includes("ai") || r.includes("scientist")) return "Data & AI";
  
  // Frontend
  if (r.includes("frontend") || r.includes("react") || r.includes("ui") || r.includes("ux") || r.includes("design")) return "Frontend & UI/UX";
  
  // Full Stack / SDE
  if (r.includes("full stack") || r.includes("mern") || r.includes("software engineer") || r.includes("sde")) return "Full Stack";
  
  // Blockchain
  if (r.includes("blockchain") || r.includes("web3")) return "Blockchain";
  
  // Product
  if (r.includes("product") || r.includes("management")) return "Product";
  
  // QA
  if (r.includes("qa") || r.includes("test")) return "Other";

  return "Other";
}

// Helper to extract named skills where user is proficient (> 5 on 1-10 scale)
function getUserSkills(body: any) {
  const allSkills = [
    "DSA", "Algorithms", "System Design", "React",
    "Node", "Python", "SQL", "ML",
    "Data Analysis", "Embedded"
  ];
  const keys = ["dsa", "algorithms", "systemDesign", "react", "node", "python", "sql", "ml", "dataAnalysis", "embedded"];
  
  const userSkills: string[] = [];
  keys.forEach((key, index) => {
    if (body[key] >= 6) {
      userSkills.push(allSkills[index]);
    }
  });
  return userSkills;
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    if (!body) {
      return NextResponse.json({ error: "Missing request body" }, { status: 400 });
    }

    const {
      skillAvg,
      projects,
      internships,
      cgpa,
      role,
      tier
    } = body;

    // Comprehensive Validation
    if (skillAvg === undefined) {
      return NextResponse.json({ error: "Skill data is required" }, { status: 400 });
    }

    if (!role || typeof role !== "string") {
      return NextResponse.json({ error: "Valid target role is required" }, { status: 400 });
    }

    if (!tier || typeof tier !== "string") {
      return NextResponse.json({ error: "Valid company tier is required" }, { status: 400 });
    }

    if (cgpa !== undefined && (cgpa < 0 || cgpa > 10)) {
      return NextResponse.json({ error: "CGPA must be between 0 and 10" }, { status: 400 });
    }

    if (projects !== undefined && projects < 0) {
      return NextResponse.json({ error: "Projects count cannot be negative" }, { status: 400 });
    }

    if (internships !== undefined && internships < 0) {
      return NextResponse.json({ error: "Internships count cannot be negative" }, { status: 400 });
    }

    // 1. Get REAL Competition from Database Engine
    const category = categorize(role);
    const competitionIndex = await getCompetitionIndex(category);

    // 2. Compute Base Readiness (Internal Algorithm)
    const baseReadiness = calculateReadiness({
      skillAvg,
      projects: projects || 0,
      internships: internships || 0,
      cgpa: cgpa || 0,
      roleMatch: 80,
    });

    // 3. Apply Market Weight (Skill Demand Boost)
    const userSkills = getUserSkills(body);
    const skillDemandMap = await getSkillDemandMap();
    
    let demandScore = 0;
    userSkills.forEach(skill => {
      const demand = skillDemandMap[skill.toLowerCase()] || 0;
      demandScore += demand;
    });

    const demandBoost = Math.min(demandScore / 50, 15);
    let finalReadiness = Math.min(Math.round(baseReadiness + demandBoost), 95);
    if (isNaN(finalReadiness)) finalReadiness = 50;

    // 4. Calculate Final Probability (Real-world Formula)
    let acceptanceProbability = Math.max(
      5,
      Math.min(
        Math.round(finalReadiness - (competitionIndex * 0.6) + 5),
        95
      )
    );

    if (isNaN(acceptanceProbability)) {
      acceptanceProbability = 5;
    }

    // 5. Get Real Internship Matches
    const topMatches = await getTopMatches(
      userSkills,
      category,
      body.remoteType || "Remote"
    );

    // 6. Apply Match-Strength Cap & Confidence Level
    const bestMatchScore = topMatches.length > 0 ? topMatches[0].matchScore : 0;
    if (bestMatchScore < 30) {
      acceptanceProbability = Math.max(5, acceptanceProbability - 10);
    }

    // Confidence based on Data Volume
    const categoryCount = await prisma.internship.count({ where: { category } });
    let confidenceLevel = "Low";
    if (categoryCount > 50) confidenceLevel = "High";
    else if (categoryCount > 15) confidenceLevel = "Moderate";

    // 7. Calculate Market Position Percentile
    // Psychological framing: Lower competition index means easier market, 
    // so a user's readiness places them in a higher percentile.
    // Base percentile formula: readiness normalized against market difficulty.
    let marketPercentile = Math.min(Math.round((finalReadiness / (competitionIndex || 50)) * 40), 99);
    // Ensure logical minimum for high readiness
    if (finalReadiness > 80 && marketPercentile < 70) marketPercentile = 85;
    if (finalReadiness > 90) marketPercentile = 95;

    const userId = (session.user as any).id;
    if (!userId) {
      return NextResponse.json({ error: "User ID missing from session" }, { status: 400 });
    }

    // Save to History
    try {
      await prisma.simulation.create({
        data: {
          userId: userId,
          readiness: finalReadiness,
          competitionIndex: Math.round(competitionIndex),
          acceptanceProbability: Math.round(acceptanceProbability),
          role,
          tier
        }
      });

      // Log Analytics Event
      await logEvent("SIMULATION_RUN", userId, {
        baseReadiness,
        finalReadiness,
        demandBoost,
        competitionIndex: Math.round(competitionIndex),
        acceptanceProbability: Math.round(acceptanceProbability),
        confidenceLevel,
        marketPercentile, // Log percentile
        role,
        tier,
        matchesCount: topMatches.length
      });
    } catch (dbError: any) {
      console.error("Database error saving simulation:", dbError);
    }

    return NextResponse.json({
      readiness: finalReadiness,
      competitionIndex,
      acceptanceProbability,
      confidenceLevel,
      marketPercentile, // New field
      topMatches
    });
  } catch (error: any) {
    console.error("Simulation API Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 400 });
  }
}
