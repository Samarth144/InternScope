import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');
    
    const where = role ? { preferredRole: { contains: role } } : {};
    
    const students = await prisma.student.findMany({
      where,
      take: 50, // Limit for performance
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(students);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
