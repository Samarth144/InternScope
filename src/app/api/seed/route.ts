import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    // In a real production env, you wouldn't run a shell script like this usually,
    // but for the hackathon MVP this triggers the seed script.
    // Alternatively, we can import the seed function directly if we structured it that way.
    // But since seed.ts is a standalone script, running it via npm run seed or ts-node is easier.
    
    // However, calling 'npm run seed' from inside a running server might be slow.
    // Let's try to execute it.
    // Note: This relies on 'ts-node' being available or 'prisma db seed' working.
    
    await execPromise('npx prisma db seed');
    
    return NextResponse.json({ message: 'Database seeded successfully' });
  } catch (error: any) {
    console.error('Seed error:', error);
    return NextResponse.json({ error: 'Failed to seed database', details: error.message }, { status: 500 });
  }
}
