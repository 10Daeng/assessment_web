import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req, { params }) {
  try {
    const { sessionId } = await params;
    const { moduleId, rawScore } = await req.json();

    if (!moduleId || !rawScore) {
      return NextResponse.json({ message: 'Request tidak valid.' }, { status: 400 });
    }

    const session = await prisma.assessmentSession.findUnique({
      where: { id: sessionId }
    });

    if (!session || session.status === 'COMPLETED') {
      return NextResponse.json({ message: 'Sesi tidak valid.' }, { status: 403 });
    }

    // Upsert Module Result
    const moduleResult = await prisma.moduleResult.upsert({
      where: {
        sessionId_moduleId: {
          sessionId,
          moduleId
        }
      },
      update: {
        rawScore,
        completedAt: new Date()
      },
      create: {
        sessionId,
        moduleId,
        rawScore,
        completedAt: new Date()
      }
    });

    return NextResponse.json({ success: true, moduleResult });

  } catch (error) {
    console.error('Submit module error:', error);
    return NextResponse.json({ message: 'Terjadi kesalahan sistem.' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
