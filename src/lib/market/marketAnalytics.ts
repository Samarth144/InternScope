import { prisma } from "@/lib/prisma"

export async function getMarketAnalytics() {
  const internships = await prisma.internship.findMany()

  const totalInternships = internships.length
  if (totalInternships === 0) return null

  const skillCount: Record<string, number> = {}
  const categoryCount: Record<string, number> = {}
  const stipendByCategory: Record<string, { total: number; count: number }> = {}

  let remoteCount = 0
  let onsiteCount = 0

  internships.forEach((i) => {
    // Skill Frequency
    i.skills.forEach((skill) => {
      const s = skill.trim();
      if (s) {
        skillCount[s] = (skillCount[s] || 0) + 1
      }
    })

    // Category Frequency
    categoryCount[i.category] = (categoryCount[i.category] || 0) + 1

    // Avg stipend per category
    const avgStipend = (i.stipendMin + i.stipendMax) / 2

    if (!stipendByCategory[i.category]) {
      stipendByCategory[i.category] = { total: 0, count: 0 }
    }

    stipendByCategory[i.category].total += avgStipend
    stipendByCategory[i.category].count += 1

    // Remote vs Onsite
    const type = i.remoteType.toLowerCase();
    if (type.includes("remote") || i.location.toLowerCase().includes("home")) {
      remoteCount++
    } else {
      onsiteCount++
    }
  })

  const topSkills = Object.entries(skillCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([skill, count]) => ({ skill, count }));

  const topCategories = Object.entries(categoryCount)
    .sort((a, b) => b[1] - a[1])
    .map(([category, count]) => ({ category, count }));

  const avgStipendCategory = Object.entries(stipendByCategory).map(
    ([category, data]) => ({
      category,
      avgStipend: Math.round(data.total / data.count),
    })
  ).sort((a, b) => b.avgStipend - a.avgStipend);

  return {
    totalInternships,
    topSkills,
    topCategories,
    avgStipendCategory,
    remoteRatio: Math.round((remoteCount / totalInternships) * 100),
    onsiteRatio: Math.round((onsiteCount / totalInternships) * 100),
  }
}
