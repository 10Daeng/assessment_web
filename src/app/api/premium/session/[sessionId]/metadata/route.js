import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req, { params }) {
  try {
    const { sessionId } = await params;
    const { metadata } = await req.json();

    if (!metadata || typeof metadata !== 'object') {
      return NextResponse.json({ message: 'Data formulir tidak valid.' }, { status: 400 });
    }

    const session = await prisma.assessmentSession.update({
      where: { id: sessionId },
      data: {
        participantMetadata: metadata,
        participantName: metadata.nama || undefined,
        participantEmail: metadata.email || undefined,
        participantAge: metadata.usia ? parseInt(metadata.usia) : undefined,
      }
    });

    return NextResponse.json({ success: true, session });

  } catch (error) {
    console.error('Save metadata error:', error);
    return NextResponse.json({ message: 'Terjadi kesalahan saat menyimpan formulir identitas.' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
