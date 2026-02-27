import { prisma } from "@/lib/prisma"

export async function logEvent(
  eventType: string,
  userId?: string,
  metadata?: any
) {
  try {
    await prisma.analyticsEvent.create({
      data: {
        eventType,
        userId,
        metadata,
      },
    })
  } catch (err) {
    console.error("Analytics logging failed:", err)
  }
}
