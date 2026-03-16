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
    const pkgBasic = await prisma.package.upsert({
      where: { id: 'pkg-basic' },
      update: { intent: 'GENERAL', price: 50000 },
      create: {
        id: 'pkg-basic',
        name: 'Paket Basic',
        description: 'Gaya Kerja (DISC)',
        price: 50000,
        intent: 'GENERAL',
      },
    });

    const pkgReguler = await prisma.package.upsert({
      where: { id: 'pkg-reguler' },
      update: { intent: 'GENERAL', price: 150000 },
      create: {
        id: 'pkg-reguler',
        name: 'Paket Reguler',
        description: 'Kepribadian Eksekutif (DISC + HEXACO)',
        price: 150000,
        intent: 'GENERAL',
      },
    });

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

    // 3. Link Modules to Packages
    await prisma.$transaction([
      // Basic (DISC)
      prisma.packageModule.upsert({
        where: { packageId_moduleId: { packageId: pkgBasic.id, moduleId: modDisc.id }},
        update: { order: 1 },
        create: { packageId: pkgBasic.id, moduleId: modDisc.id, order: 1 }
      }),
      // Reguler (DISC, HEXACO)
      prisma.packageModule.upsert({
        where: { packageId_moduleId: { packageId: pkgReguler.id, moduleId: modDisc.id }},
        update: { order: 1 },
        create: { packageId: pkgReguler.id, moduleId: modDisc.id, order: 1 }
      }),
      prisma.packageModule.upsert({
        where: { packageId_moduleId: { packageId: pkgReguler.id, moduleId: modHexaco.id }},
        update: { order: 2 },
        create: { packageId: pkgReguler.id, moduleId: modHexaco.id, order: 2 }
      }),
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
