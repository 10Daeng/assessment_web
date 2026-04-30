import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { paymentRateLimit } from '@/lib/rateLimit';
import { sanitizeUserData } from '@/lib/sanitize';
import { logger } from '@/utils/logger';


export async function POST(req) {
  try {
    const { code, packageId, userInfo } = await req.json();

    // Apply rate limiting
    const limitCheck = paymentRateLimit(req);
    if (limitCheck) {
      return NextResponse.json(
        { message: limitCheck.error, retryAfter: limitCheck.retryAfter },
        { status: 429, headers: { 'Retry-After': limitCheck.retryAfter.toString() } }
      );
    }

    // Validate and sanitize user input
    const sanitizationResult = sanitizeUserData(userInfo);

    if (!sanitizationResult.isValid) {
      return NextResponse.json(
        { message: 'Data input tidak valid.', errors: sanitizationResult.errors },
        { status: 400 }
      );
    }

    if (!code || !packageId) {
      return NextResponse.json({ message: 'Code dan package ID diperlukan.' }, { status: 400 });
    }

    // 1. Verify Voucher
    const sanitizedUser = sanitizationResult.sanitized;
    const voucher = await prisma.voucher.findUnique({
      where: { code: code.toUpperCase().trim() },
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
          participantName: sanitizedUser.name,
          participantEmail: sanitizedUser.email,
          participantAge: sanitizedUser.age,
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
    logger.error('[Verify Voucher] Error:', error);
    return NextResponse.json({ message: 'Terjadi kesalahan sistem.' }, { status: 500 });
  }
}
