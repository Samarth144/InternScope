import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const companies = await prisma.company.findMany({
      orderBy: { tier: 'asc' }
    });
    return NextResponse.json(companies);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
