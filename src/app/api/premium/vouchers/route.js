import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';


// GET all vouchers (with package info)
export async function GET(req) {
  try {
    const vouchers = await prisma.voucher.findMany({
      include: {
        package: true
      },
      orderBy: { createdAt: 'desc' }
    });
    
    // Also fetch available packages for dropdowns
    const packages = await prisma.package.findMany();

    return NextResponse.json({ success: true, vouchers, packages });
  } catch (error) {
    console.error('Fetch vouchers error:', error);
    return NextResponse.json({ message: 'Terjadi kesalahan mengambil data voucher' }, { status: 500 });
  } finally {
    /* await prisma.$disconnect(); */
  }
}

// CREATE new voucher
export async function POST(req) {
  try {
    const body = await req.json();
    const { code, packageId, quota } = body;

    if (!code || !packageId || !quota) {
      return NextResponse.json({ message: 'Kode, Paket, dan Kuota wajib diisi' }, { status: 400 });
    }

    const exists = await prisma.voucher.findUnique({
      where: { code: code.toUpperCase() }
    });

    if (exists) {
      return NextResponse.json({ message: 'Kode voucher sudah ada, gunakan kode lain' }, { status: 400 });
    }

    const newVoucher = await prisma.voucher.create({
      data: {
        code: code.toUpperCase(),
        packageId,
        quota: parseInt(quota),
        usedCount: 0,
        isActive: true
      },
      include: {
        package: true
      }
    });

    return NextResponse.json({ success: true, voucher: newVoucher });
  } catch (error) {
    console.error('Create voucher error:', error);
    return NextResponse.json({ message: 'Gagal membuat voucher' }, { status: 500 });
  } finally {
    /* await prisma.$disconnect(); */
  }
}

// UPDATE or DELETE a voucher
export async function PUT(req) {
  try {
    const body = await req.json();
    const { id, isActive, action } = body;

    if (action === 'DELETE') {
       await prisma.voucher.delete({
         where: { id }
       });
       return NextResponse.json({ success: true, message: 'Voucher dihapus' });
    } else {
       const updated = await prisma.voucher.update({
         where: { id },
         data: { isActive },
         include: { package: true }
       });
       return NextResponse.json({ success: true, voucher: updated });
    }
  } catch (error) {
    console.error('Update voucher error:', error);
    return NextResponse.json({ message: 'Gagal mengubah voucher' }, { status: 500 });
  } finally {
    /* await prisma.$disconnect(); */
  }
}
