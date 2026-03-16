import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { snap } from '@/lib/midtrans';


export async function POST(req) {
  try {
    const { packageId, userInfo } = await req.json();

    if (!packageId || !userInfo?.name || !userInfo?.email) {
      return NextResponse.json({ message: 'Data tidak lengkap.' }, { status: 400 });
    }

    // 1. Dapatkan info paket
    const pkg = await prisma.package.findUnique({
      where: { id: packageId }
    });

    if (!pkg || !pkg.isActive) {
      return NextResponse.json({ message: 'Paket tidak tersedia.' }, { status: 404 });
    }

    // 2. Buat Assessment Session dengan status "UNPAID_MIDTRANS"
    const session = await prisma.assessmentSession.create({
      data: {
        participantName: userInfo.name,
        participantEmail: userInfo.email,
        participantAge: userInfo.age ? parseInt(userInfo.age) : null,
        packageId: packageId,
        status: 'ONGOING', // or 'PENDING_PAYMENT' if you prefer
        paymentStatus: 'UNPAID_MIDTRANS',
      }
    });

    // 3. Request Token ke Midtrans Snap
    const parameter = {
      transaction_details: {
        order_id: session.id, // we use session ID as order ID!
        gross_amount: pkg.price // IDR integer
      },
      customer_details: {
        first_name: userInfo.name,
        email: userInfo.email,
        phone: userInfo.phone || ''
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
    console.error('Checkout error:', error);
    return NextResponse.json({ message: 'Gagal membuat transaksi', error: String(error) }, { status: 500 });
  } finally {
    /* await prisma.$disconnect(); */
  }
}
