import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { coreApi } from '@/lib/midtrans';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const notificationJson = await req.json();

    // Verify using SDK (to ensure signature & data is valid)
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

    // Update Session DB
    await prisma.assessmentSession.update({
        where: { id: orderId }, // We used sessionId as orderId!
        data: { 
            paymentStatus: paymentStatus,
            // Bisa rekam updateStatus Midtrans kalau perlu (contoh di notes terpisah)
        }
    });

    console.log(`[Webhook] Order ${orderId} updated to ${paymentStatus}`);
    
    return NextResponse.json({ success: true, message: 'Webhook received' }, { status: 200 });
  } catch (error) {
    console.error('Midtrans Webhook Error:', error);
    return NextResponse.json({ message: 'Error processing webhook' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
