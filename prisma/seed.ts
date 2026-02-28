import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export async function seedCoreData() {
  console.log("Seeding core database...")
  
  // Use the global prisma instance if possible, or create one if not passed
  // For simplicity here, we'll just use the one imported in this file
  
  // Clear existing
  await prisma.student.deleteMany()
  await prisma.company.deleteMany()

  // Skill bias based on role
  const roles = ["SDE", "ML", "Data", "Embedded"]

  for (let i = 1; i <= 300; i++) {
    const role = roles[randomInt(0, roles.length - 1)]

    await prisma.student.create({
      data: {
        name: `Student_${i}`,
        cgpa: Number((6 + Math.random() * 4).toFixed(2)),
        projects: randomInt(0, 5),
        internships: randomInt(0, 2),
        preferredRole: role,
        preferredCity: ["Bangalore", "Hyderabad", "Remote"][randomInt(0,2)],

        dsa: role === "SDE" ? randomInt(3,5) : randomInt(1,4),
        algorithms: randomInt(2,5),
        systemDesign: randomInt(1,4),
        react: randomInt(1,5),
        node: randomInt(1,5),
        python: role === "ML" ? randomInt(3,5) : randomInt(1,4),
        sql: randomInt(1,5),
        ml: role === "ML" ? randomInt(3,5) : randomInt(1,3),
        dataAnalysis: randomInt(1,5),
        embedded: role === "Embedded" ? randomInt(3,5) : randomInt(1,2),
      }
    })
  }

  for (let i = 1; i <= 30; i++) {
    await prisma.company.create({
      data: {
        name: `Company_${i}`,
        role: roles[randomInt(0, roles.length - 1)],
        tier: ["Startup", "MNC", "TopTier"][randomInt(0,2)],
        location: ["Bangalore", "Hyderabad", "Remote"][randomInt(0,2)],
        seats: randomInt(3, 10),

        requiredDsa: randomInt(2,5),
        requiredReact: randomInt(2,5),
        requiredPython: randomInt(2,5),
        requiredMl: randomInt(1,5),

        competitionIndex: randomInt(50, 90),
      }
    })
  }

  console.log("Core seeding completed.")
}

// Only run if this is the main module
if (require.main === module) {
  seedCoreData()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect())
}
