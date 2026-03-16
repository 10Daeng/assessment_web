import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';


export async function GET() {
  try {
    const totalSessions = await prisma.assessmentSession.count();
    const completedSessions = await prisma.assessmentSession.count({ where: { status: 'COMPLETED' } });
    const totalVouchers = await prisma.voucher.count();
    const activeVouchers = await prisma.voucher.count({ where: { isActive: true } });

    // Latest 5 premium sessions
    const recentSessions = await prisma.assessmentSession.findMany({
      take: 5,
      orderBy: { startedAt: 'desc' },
      include: {
        package: { select: { name: true } }
      }
    });

    return NextResponse.json({
      success: true,
      stats: {
        totalSessions,
        completedSessions,
        totalVouchers,
        activeVouchers
      },
      recentSessions
    });

  } catch (error) {
    console.error('Fetch AaaS stats error:', error);
    return NextResponse.json({ message: 'Terjadi kesalahan sistem.' }, { status: 500 });
  } finally {
    /* await prisma.$disconnect(); */
  }
}
