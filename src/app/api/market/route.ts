import { getMarketAnalytics } from "@/lib/market/marketAnalytics"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const analytics = await getMarketAnalytics()
    if (!analytics) {
      return NextResponse.json({ error: "No data available" }, { status: 404 })
    }
    return NextResponse.json(analytics)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
