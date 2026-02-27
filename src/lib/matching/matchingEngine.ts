import { prisma } from "@/lib/prisma"

function calculateSkillOverlap(
  userSkills: string[],
  internshipSkills: string[]
) {
  if (!internshipSkills || internshipSkills.length === 0) return 0

  let matchCount = 0;
  const uSkills = userSkills.map(s => s.toLowerCase());
  const iSkills = internshipSkills.map(s => s.toLowerCase());

  iSkills.forEach(iSkill => {
    // 1. Exact Match
    if (uSkills.includes(iSkill)) {
      matchCount += 1;
    } 
    // 2. Partial/Fuzzy Match (e.g., "React Native" matches "React")
    else if (uSkills.some(uSkill => iSkill.includes(uSkill) || uSkill.includes(iSkill))) {
      matchCount += 0.7; // 70% weight for partial match
    }
    // 3. Related Tech Match (Heuristics)
    else if (iSkill.includes("api") && uSkills.includes("node")) matchCount += 0.5;
    else if (iSkill.includes("database") && uSkills.includes("sql")) matchCount += 0.5;
  });

  return Math.min(matchCount / iSkills.length, 1);
}

export async function getTopMatches(
  userSkills: string[],
  category: string,
  remotePreference?: string
) {
  const internships = await prisma.internship.findMany({
    where: {
      OR: [
        { category },
        { category: "Other" }
      ]
    }
  })

  const scored = internships.map(i => {
    const skillScore = calculateSkillOverlap(userSkills, i.skills)
    const categoryScore = i.category === category ? 0.3 : 0
    const remoteScore =
      remotePreference &&
      i.remoteType.toLowerCase().includes(remotePreference.toLowerCase())
        ? 0.1
        : 0

    // Final Match Score calculation
    const finalScore = (skillScore * 0.6) + categoryScore + remoteScore

    return {
      ...i,
      matchScore: Math.round(finalScore * 100)
    }
  })

  return scored
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 5)
}
