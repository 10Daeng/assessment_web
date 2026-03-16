import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';


export async function POST(req) {
  try {
    const { code, packageId, userInfo } = await req.json();

    if (!code || !packageId || !userInfo?.name || !userInfo?.email) {
      return NextResponse.json({ message: 'Data tidak lengkap.' }, { status: 400 });
    }

    // 1. Verify Voucher
    const voucher = await prisma.voucher.findUnique({
      where: { code: code.toUpperCase() },
      include: { package: true }
    });

    if (!voucher) {
      return NextResponse.json({ message: 'Kode voucher tidak ditemukan.' }, { status: 404 });
    }

    if (!voucher.isActive) {
      return NextResponse.json({ message: 'Kode voucher sudah tidak aktif.' }, { status: 403 });
    }

    if (voucher.expiresAt && new Date() > voucher.expiresAt) {
      return NextResponse.json({ message: 'Kode voucher sudah kedaluwarsa.' }, { status: 403 });
    }

    if (voucher.usedCount >= voucher.quota) {
      return NextResponse.json({ message: 'Kuota penggunaan voucher ini sudah habis.' }, { status: 403 });
    }

    // Check if voucher package matches requested package (optional security check)
    if (voucher.packageId !== packageId) {
      return NextResponse.json({ message: 'Kode voucher ini tidak berlaku untuk paket yang dipilih.' }, { status: 403 });
    }

    // 2. Transaksi Database (Increment usage AND create Session)
    // Using transaction to ensure atomic operation
    const result = await prisma.$transaction(async (tx) => {
      // Increment voucher usage
      await tx.voucher.update({
        where: { id: voucher.id },
        data: { usedCount: { increment: 1 } }
      });

      // Create Assessment Session
      const session = await tx.assessmentSession.create({
        data: {
          participantName: userInfo.name,
          participantEmail: userInfo.email,
          participantAge: userInfo.age ? parseInt(userInfo.age) : null,
          packageId: voucher.packageId,
          voucherId: voucher.id,
          status: 'ONGOING',
          paymentStatus: 'PAID_VOUCHER'
        }
      });

      return session;
    });

    // 3. Return success and the Session ID to start the runner
    return NextResponse.json({
      success: true,
      sessionId: result.id,
      package: voucher.package.name
    });

  } catch (error) {
    console.error('Voucher verification error:', error);
    return NextResponse.json({ message: 'Terjadi kesalahan sistem.' }, { status: 500 });
  } finally {
    /* await prisma.$disconnect(); */
  }
}
