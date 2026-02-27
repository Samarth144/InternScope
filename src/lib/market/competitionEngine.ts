import { prisma } from "@/lib/prisma"

export async function getCompetitionIndex(category: string) {
  const internships = await prisma.internship.findMany({
    where: { category }
  })

  const totalInCategory = internships.length

  if (totalInCategory === 0) return 40 // Baseline for unknown categories

  // Analyze market metrics
  let totalStipend = 0
  let remoteCount = 0

  internships.forEach(i => {
    const avg = (i.stipendMin + i.stipendMax) / 2
    totalStipend += avg

    if (i.remoteType.toLowerCase().includes("remote") || i.location.toLowerCase().includes("home")) {
      remoteCount++
    }
  })

  const avgStipend = totalStipend / totalInCategory

  /**
   * Weights:
   * 40% Volume (More internships = higher discovery, but often higher applicant volume)
   * 30% Stipend (Higher pay = more intense competition)
   * 30% Remote Ratio (Remote roles attract significantly more applicants)
   */
  const volumeFactor = Math.min(totalInCategory * 2, 100)
  const stipendFactor = Math.min(avgStipend / 500, 100) // Scaled relative to market avg
  const remoteFactor = (remoteCount / totalInCategory) * 100

  const competitionIndex = Math.round(
    (volumeFactor * 0.4) +
    (stipendFactor * 0.3) +
    (remoteFactor * 0.3)
  )

  return Math.min(competitionIndex, 95)
}
