import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { snap } from '@/lib/midtrans';
import { paymentRateLimit } from '@/lib/rateLimit';
import { sanitizeUserData } from '@/lib/sanitize';
import { logger } from '@/utils/logger';

export async function POST(req) {
  try {
    // Apply rate limiting
    const limitCheck = paymentRateLimit(req);
    if (limitCheck) {
      return NextResponse.json(
        { message: limitCheck.error, retryAfter: limitCheck.retryAfter },
        { status: 429, headers: { 'Retry-After': limitCheck.retryAfter.toString() } }
      );
    }

    const { packageId, userInfo } = await req.json();

    // Validate and sanitize user input
    const sanitizationResult = sanitizeUserData(userInfo);

    if (!sanitizationResult.isValid) {
      return NextResponse.json(
        { message: 'Data input tidak valid.', errors: sanitizationResult.errors },
        { status: 400 }
      );
    }

    if (!packageId) {
      return NextResponse.json({ message: 'Package ID diperlukan.' }, { status: 400 });
    }

    // 1. Dapatkan info paket
    const pkg = await prisma.package.findUnique({
      where: { id: packageId }
    });

    if (!pkg || !pkg.isActive) {
      return NextResponse.json({ message: 'Paket tidak tersedia.' }, { status: 404 });
    }

    // 2. Buat Assessment Session dengan status "UNPAID_MIDTRANS"
    const sanitizedUser = sanitizationResult.sanitized;
    const session = await prisma.assessmentSession.create({
      data: {
        participantName: sanitizedUser.name,
        participantEmail: sanitizedUser.email,
        participantAge: sanitizedUser.age,
        packageId: packageId,
        status: 'ONGOING',
        paymentStatus: 'UNPAID_MIDTRANS',
      }
    });

    // 3. Request Token ke Midtrans Snap
    const parameter = {
      transaction_details: {
        order_id: session.id,
        gross_amount: pkg.price
      },
      customer_details: {
        first_name: sanitizedUser.name,
        email: sanitizedUser.email,
        phone: sanitizedUser.phone || ''
      },
      item_details: [{
        id: pkg.id,
        price: pkg.price,
        quantity: 1,
        name: pkg.name
      }]
    };

    const transaction = await snap.createTransaction(parameter);

    return NextResponse.json({
        success: true,
        token: transaction.token,
        redirect_url: transaction.redirect_url,
        sessionId: session.id
    });

  } catch (error) {
    logger.error('[Checkout] Error:', error);
    return NextResponse.json({ message: 'Gagal membuat transaksi', error: String(error) }, { status: 500 });
  }
}
