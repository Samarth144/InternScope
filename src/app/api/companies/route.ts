import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
