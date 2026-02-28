import { NextResponse } from 'next/server';
import { seedCoreData } from '../../../../prisma/seed';
import { seedInternships } from '../../../../scripts/normalizeAndSeed';

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    // Call functions directly
    await seedCoreData();
    await seedInternships();
    
    return NextResponse.json({ message: 'Database seeded successfully via direct function call' });
  } catch (error: any) {
    console.error('Seed error:', error);
    return NextResponse.json({ error: 'Failed to seed database', details: error.message }, { status: 500 });
  }
}
