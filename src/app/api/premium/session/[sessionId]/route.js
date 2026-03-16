import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';


export async function GET(req, { params }) {
  try {
    const { sessionId } = await params;

    const session = await prisma.assessmentSession.findUnique({
      where: { id: sessionId },
      include: {
        package: {
          include: {
            modules: {
              include: {
                module: true
              }
            }
          }
        },
        voucher: true
      }
    });

    if (!session) {
      return NextResponse.json({ message: 'Sesi tidak ditemukan.' }, { status: 404 });
    }

    return NextResponse.json({ session });

  } catch (error) {
    console.error('Fetch session error:', error);
    return NextResponse.json({ message: 'Terjadi kesalahan sistem.' }, { status: 500 });
  } finally {
    /* await prisma.$disconnect(); */
  }
}
