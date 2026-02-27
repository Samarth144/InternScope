import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { calculateGrowthIndex } from "@/lib/calculations/growth";
import { logEvent } from "@/lib/analytics/logEvent";

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const { offerA, offerB } = await request.json();

    const growthA = calculateGrowthIndex(offerA);
    const growthB = calculateGrowthIndex(offerB);

    // Log Analytics Event
    await logEvent("OFFER_COMPARE", (session?.user as any)?.id, {
      growthA,
      growthB,
    });

    return NextResponse.json({ growthA, growthB });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
