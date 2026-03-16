import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // 1. Setup Modules
    const modDisc = await prisma.module.upsert({
      where: { id: 'mod-disc-primary' },
      update: {},
      create: {
        id: 'mod-disc-primary',
        name: 'DISC Profiling',
        type: 'PERSONALITY_DISC'
      }
    });

    const modHexaco = await prisma.module.upsert({
      where: { id: 'mod-hexaco-primary' },
      update: {},
      create: {
        id: 'mod-hexaco-primary',
        name: 'HEXACO Inventory',
        type: 'PERSONALITY_HEXACO'
      }
    });

    const modEssay = await prisma.module.upsert({
      where: { id: 'mod-essay' },
      update: {},
      create: {
        id: 'mod-essay',
        name: 'Wawancara Terstruktur (Esai)',
        type: 'CUSTOM_ESSAY'
      }
    });

    // 2. Upsert Packages
    const pkgRekrutmen = await prisma.package.upsert({
      where: { id: 'pkg-rekrutmen' },
      update: { intent: 'RECRUITMENT' },
      create: {
        id: 'pkg-rekrutmen',
        name: 'Paket Rekrutmen & Seleksi',
        description: 'Asesmen komprehensif untuk seleksi calon karyawan baru.',
        price: 250000,
        intent: 'RECRUITMENT',
      },
    });

    const pkgAkademik = await prisma.package.upsert({
      where: { id: 'pkg-akademik' },
      update: { intent: 'ACADEMIC' },
      create: {
        id: 'pkg-akademik',
        name: 'Paket Penjurusan Kampus',
        description: 'Pemetaan minat bakat dan potensi akademik pelajar.',
        price: 100000,
        intent: 'ACADEMIC',
      },
    });

    const pkgGrafologi = await prisma.package.upsert({
      where: { id: 'pkg-grafologi' },
      update: { intent: 'GRAPHOLOGY' },
      create: {
        id: 'pkg-grafologi',
        name: 'Analisa Tulisan Tangan (Grafologi)',
        description: 'Pemetaan psikologis berbasis tulisan tangan asli.',
        price: 350000,
        intent: 'GRAPHOLOGY',
      },
    });

    // 3. Link Modules to Packages
    await prisma.$transaction([
      // Rekrutmen (DISC, HEXACO, ESSAY)
      prisma.packageModule.upsert({
        where: { packageId_moduleId: { packageId: pkgRekrutmen.id, moduleId: modDisc.id }},
        update: { order: 1 },
        create: { packageId: pkgRekrutmen.id, moduleId: modDisc.id, order: 1 }
      }),
      prisma.packageModule.upsert({
        where: { packageId_moduleId: { packageId: pkgRekrutmen.id, moduleId: modHexaco.id }},
        update: { order: 2 },
        create: { packageId: pkgRekrutmen.id, moduleId: modHexaco.id, order: 2 }
      }),
      prisma.packageModule.upsert({
        where: { packageId_moduleId: { packageId: pkgRekrutmen.id, moduleId: modEssay.id }},
        update: { order: 3 },
        create: { packageId: pkgRekrutmen.id, moduleId: modEssay.id, order: 3 }
      }),
      // Akademik (DISC, ESSAY) => For demo, just to vary things up
      prisma.packageModule.upsert({
        where: { packageId_moduleId: { packageId: pkgAkademik.id, moduleId: modDisc.id }},
        update: { order: 1 },
        create: { packageId: pkgAkademik.id, moduleId: modDisc.id, order: 1 }
      }),
      prisma.packageModule.upsert({
        where: { packageId_moduleId: { packageId: pkgAkademik.id, moduleId: modEssay.id }},
        update: { order: 2 },
        create: { packageId: pkgAkademik.id, moduleId: modEssay.id, order: 2 }
      }),
    ]);

    // 4. Upsert Vouchers
    await prisma.voucher.upsert({
      where: { code: 'TEST-REKRUTMEN' },
      update: {},
      create: { code: 'TEST-REKRUTMEN', packageId: pkgRekrutmen.id, quota: 100, usedCount: 0, isActive: true },
    });

    await prisma.voucher.upsert({
      where: { code: 'TEST-AKADEMIK' },
      update: {},
      create: { code: 'TEST-AKADEMIK', packageId: pkgAkademik.id, quota: 100, usedCount: 0, isActive: true },
    });

    await prisma.voucher.upsert({
      where: { code: 'TEST-GRAFOLOGI' },
      update: {},
      create: { code: 'TEST-GRAFOLOGI', packageId: pkgGrafologi.id, quota: 100, usedCount: 0, isActive: true },
    });

    return NextResponse.json({ success: true, message: 'Seeded Phase 3 Database Models with ModEssay' });
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
