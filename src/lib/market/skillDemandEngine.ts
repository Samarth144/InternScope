import { prisma } from "@/lib/prisma"

export async function getSkillDemandMap() {
  const internships = await prisma.internship.findMany({
    select: { skills: true }
  })

  const skillCount: Record<string, number> = {}

  internships.forEach(i => {
    i.skills.forEach(skill => {
      const key = skill.toLowerCase().trim();
      if (key) {
        skillCount[key] = (skillCount[key] || 0) + 1
      }
    })
  })

  return skillCount
}
