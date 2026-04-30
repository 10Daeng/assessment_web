import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { coreApi } from '@/lib/midtrans';
import { logger } from '@/utils/logger';

// Midtrans IP addresses for webhook verification
// Production IPs will be added when switching to production
const MIDTRANS_IPS = [
  // Sandbox IPs
  '103.20.27.228',
  '103.20.27.229',
  '103.20.27.230',
  '103.20.27.231',
  '103.20.27.232',
  '103.20.27.233',
  '103.20.27.234',
  '103.20.27.235',
  '103.20.27.236',
  '103.20.27.237',
  '103.20.27.238',
  '103.20.27.239',
  '103.20.27.240',
  '103.20.27.241',
  '103.20.27.242',
  '103.20.27.243',
  '103.20.27.244',
  '103.20.27.245',
  '103.20.27.246',
  '103.20.27.247',
  '103.20.27.248',
  '103.20.27.249',
  '103.20.27.250',
  '103.20.27.251',
  '103.20.27.252',
  '103.20.27.253',
  '103.20.27.254',
  '103.20.27.255',
  // Production IPs (to be added when switching to production)
  // '103.20.29.220-239',
  // '103.20.28.220-239',
  // '43.252.232.200-220',
];

/**
 * Verifies if the request comes from Midtrans servers
 */
function isMidtransIP(ip) {
  return MIDTRANS_IPS.includes(ip);
}

export async function POST(req) {
  try {
    // 1. Verify IP address (basic security layer)
    const forwarded = req.headers.get('x-forwarded-for');
    const realIp = forwarded ? forwarded.split(',')[0] : req.headers.get('x-real-ip');

    if (!isMidtransIP(realIp) && process.env.NODE_ENV === 'production') {
      logger.warn(`[Webhook] Unauthorized IP attempt: ${realIp}`);
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // 2. Get notification data
    const notificationJson = await req.json();

    // 3. Verify using SDK (signature & data validation)
    const statusResponse = await coreApi.transaction.notification(notificationJson);

    // Extracted verified data
    const orderId = statusResponse.order_id;
    const transactionStatus = statusResponse.transaction_status;
    const fraudStatus = statusResponse.fraud_status;

    let paymentStatus = 'UNPAID_MIDTRANS';

    // Status filtering rules provided by Midtrans docs
    if (transactionStatus == 'capture') {
        if (fraudStatus == 'challenge') {
           paymentStatus = 'CHALLENGED';
        } else if (fraudStatus == 'accept') {
           paymentStatus = 'PAID_DIRECT';
        }
    } else if (transactionStatus == 'settlement') {
        // Success (Bank transfers, e-Wallet)
        paymentStatus = 'PAID_DIRECT';
    } else if (transactionStatus == 'cancel' ||
      transactionStatus == 'deny' ||
      transactionStatus == 'expire') {
        paymentStatus = 'CANCELLED';
    } else if (transactionStatus == 'pending') {
        paymentStatus = 'PENDING_PAYMENT';
    }

    // 4. Update Session DB
    await prisma.assessmentSession.update({
        where: { id: orderId },
        data: {
            paymentStatus: paymentStatus,
        }
    });

    logger.info(`[Webhook] Order ${orderId} updated to ${paymentStatus}`);

    return NextResponse.json({ success: true, message: 'Webhook received' }, { status: 200 });
  } catch (error) {
    logger.error('[Webhook] Error:', error);
    return NextResponse.json({ message: 'Error processing webhook' }, { status: 500 });
  }
}
