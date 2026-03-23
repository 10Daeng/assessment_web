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
        description: 'Asesmen kepribadian berdasarkan 4 kuadran DISC',
        type: 'PERSONALITY_DISC'
      }
    });

    const modHexaco = await prisma.module.upsert({
      where: { id: 'mod-hexaco-primary' },
      update: {},
      create: {
        id: 'mod-hexaco-primary',
        name: 'HEXACO Inventory',
        description: 'Asesmen tipe kepribadian komprehensif 6 dimensi',
        type: 'PERSONALITY_HEXACO'
      }
    });

    const modEssay = await prisma.module.upsert({
      where: { id: 'mod-essay' },
      update: {},
      create: {
        id: 'mod-essay',
        name: 'Wawancara Terstruktur (Esai)',
        description: 'Wawancara mendalam untuk eksplorasi lebih detail',
        type: 'CUSTOM_ESSAY'
      }
    });

    const modGraphology = await prisma.module.upsert({
      where: { id: 'mod-graphology' },
      update: {},
      create: {
        id: 'mod-graphology',
        name: 'Analisis Grafologi',
        description: 'Analisis tulisan tangan untuk dimensi kepribadian',
        type: 'GRAPHOLOGY'
      }
    });

    console.log('Modules seeded:', modDisc.name, modHexaco.name, modEssay.name, modGraphology.name);

    // 2. Upsert Packages - PRODUK 1: Metodologi Psikotes (Psikometri/DISC)
    const pkgPsikoBasic = await prisma.package.upsert({
      where: { id: 'pkg-psiko-basic' },
      update: { intent: 'PSYCHOLOGY', price: 150000 },
      create: {
        id: 'pkg-psiko-basic',
        name: 'Gambaran Diri - Basic Profiling',
        description: 'Asesmen DISC fundamental untuk memetakan gaya kerja dasar',
        price: 150000,
        intent: 'PSYCHOLOGY',
      },
    });

    const pkgPsikoComprehensive = await prisma.package.upsert({
      where: { id: 'pkg-psiko-comprehensive' },
      update: { intent: 'PSYCHOLOGY', price: 300000 },
      create: {
        id: 'pkg-psiko-comprehensive',
        name: 'Gambaran Diri - Comprehensive Profile',
        description: 'Profil kepribadian lengkap dengan DISC dan HEXACO plus konseling',
        price: 300000,
        intent: 'PSYCHOLOGY',
      },
    });

    const pkgPsikoExecutive = await prisma.package.upsert({
      where: { id: 'pkg-psiko-executive' },
      update: { intent: 'PSYCHOLOGY', price: 500000 },
      create: {
        id: 'pkg-psiko-executive',
        name: 'Gambaran Diri - Executive Profile',
        description: 'Profil kepribadian eksekutif dengan analisis mendalam dan rekomendasi karier',
        price: 500000,
        intent: 'PSYCHOLOGY',
      },
    });

    // 3. Upsert Packages - PRODUK 2: Metodologi Grafologi
    const pkgGraphologiBrief = await prisma.package.upsert({
      where: { id: 'pkg-grafologi-brief' },
      update: { intent: 'GRAPHOLOGY', price: 200000 },
      create: {
        id: 'pkg-grafologi-brief',
        name: 'Gambaran Diri - Grafologi Brief',
        description: 'Analisis grafologi dasar untuk pemetaan kepribadian singkat',
        price: 200000,
        intent: 'GRAPHOLOGY',
      },
    });

    const pkgGraphologiIndepth = await prisma.package.upsert({
      where: { id: 'pkg-grafologi-indepth' },
      update: { intent: 'GRAPHOLOGY', price: 350000 },
      create: {
        id: 'pkg-grafologi-indepth',
        name: 'Gambaran Diri - In-Depth Graphology',
        description: 'Analisis grafologi mendalam dengan DISC dan HEXACO untuk pemetaan kepribadian komprehensif',
        price: 350000,
        intent: 'GRAPHOLOGY',
      },
    });

    const pkgGraphologiAdvanced = await prisma.package.upsert({
      where: { id: 'pkg-grafologi-advanced' },
      update: { intent: 'GRAPHOLOGY', price: 550000 },
      create: {
        id: 'pkg-grafologi-advanced',
        name: 'Gambaran Diri - Advanced Grapho-Analysis',
        description: 'Analisis grafologi tingkat lanjut dengan DISC, HEXACO, dan Self Report Test',
        price: 550000,
        intent: 'GRAPHOLOGY',
      },
    });

    console.log('Packages seeded:', pkgPsikoBasic.name, pkgPsikoComprehensive.name, pkgPsikoExecutive.name, pkgGraphologiBrief.name, pkgGraphologiIndepth.name, pkgGraphologiAdvanced.name);

    // 4. Link Modules to Packages
    await prisma.$transaction([
      // Psikometri - Basic (DISC)
      prisma.packageModule.upsert({
        where: { packageId_moduleId: { packageId: pkgPsikoBasic.id, moduleId: modDisc.id }},
        update: { order: 1 },
        create: { packageId: pkgPsikoBasic.id, moduleId: modDisc.id, order: 1 }
      }),

      // Psikometri - Comprehensive (DISC, HEXACO)
      prisma.packageModule.upsert({
        where: { packageId_moduleId: { packageId: pkgPsikoComprehensive.id, moduleId: modDisc.id }},
        update: { order: 1 },
        create: { packageId: pkgPsikoComprehensive.id, moduleId: modDisc.id, order: 1 }
      }),
      prisma.packageModule.upsert({
        where: { packageId_moduleId: { packageId: pkgPsikoComprehensive.id, moduleId: modHexaco.id }},
        update: { order: 2 },
        create: { packageId: pkgPsikoComprehensive.id, moduleId: modHexaco.id, order: 2 }
      }),

      // Psikometri - Executive (DISC, HEXACO, Essay)
      prisma.packageModule.upsert({
        where: { packageId_moduleId: { packageId: pkgPsikoExecutive.id, moduleId: modDisc.id }},
        update: { order: 1 },
        create: { packageId: pkgPsikoExecutive.id, moduleId: modDisc.id, order: 1 }
      }),
      prisma.packageModule.upsert({
        where: { packageId_moduleId: { packageId: pkgPsikoExecutive.id, moduleId: modHexaco.id }},
        update: { order: 2 },
        create: { packageId: pkgPsikoExecutive.id, moduleId: modHexaco.id, order: 2 }
      }),
      prisma.packageModule.upsert({
        where: { packageId_moduleId: { packageId: pkgPsikoExecutive.id, moduleId: modEssay.id }},
        update: { order: 3 },
        create: { packageId: pkgPsikoExecutive.id, moduleId: modEssay.id, order: 3 }
      }),

      // Grafologi - Brief (Graphology)
      prisma.packageModule.upsert({
        where: { packageId_moduleId: { packageId: pkgGraphologiBrief.id, moduleId: modGraphology.id }},
        update: { order: 1 },
        create: { packageId: pkgGraphologiBrief.id, moduleId: modGraphology.id, order: 1 }
      }),

      // Grafologi - In-Depth (Graphology, DISC)
      prisma.packageModule.upsert({
        where: { packageId_moduleId: { packageId: pkgGraphologiIndepth.id, moduleId: modGraphology.id }},
        update: { order: 1 },
        create: { packageId: pkgGraphologiIndepth.id, moduleId: modGraphology.id, order: 1 }
      }),

      // Grafologi - Advanced (Graphology, DISC, HEXACO, Self Test)
      prisma.packageModule.upsert({
        where: { packageId_moduleId: { packageId: pkgGraphologiAdvanced.id, moduleId: modGraphology.id }},
        update: { order: 1 },
        create: { packageId: pkgGraphologiAdvanced.id, moduleId: modGraphology.id, order: 1 }
      }),
      prisma.packageModule.upsert({
        where: { packageId_moduleId: { packageId: pkgGraphologiAdvanced.id, moduleId: modDisc.id }},
        update: { order: 2 },
        create: { packageId: pkgGraphologiAdvanced.id, moduleId: modDisc.id, order: 2 }
      }),
      prisma.packageModule.upsert({
        where: { packageId_moduleId: { packageId: pkgGraphologiAdvanced.id, moduleId: modHexaco.id }},
        update: { order: 3 },
        create: { packageId: pkgGraphologiAdvanced.id, moduleId: modHexaco.id, order: 3 }
      }),
    ]);

    // 5. Upsert Vouchers
    await prisma.voucher.upsert({
      where: { code: 'TEST-PSIKO-BASIC' },
      update: {},
      create: { code: 'TEST-PSIKO-BASIC', packageId: pkgPsikoBasic.id, quota: 100, usedCount: 0, isActive: true },
    });

    await prisma.voucher.upsert({
      where: { code: 'TEST-PSIKO-COMP' },
      update: {},
      create: { code: 'TEST-PSIKO-COMP', packageId: pkgPsikoComprehensive.id, quota: 100, usedCount: 0, isActive: true },
    });

    await prisma.voucher.upsert({
      where: { code: 'TEST-PSIKO-EXEC' },
      update: {},
      create: { code: 'TEST-PSIKO-EXEC', packageId: pkgPsikoExecutive.id, quota: 100, usedCount: 0, isActive: true },
    });

    await prisma.voucher.upsert({
      where: { code: 'TEST-GRAFO-BRIEF' },
      update: {},
      create: { code: 'TEST-GRAFO-BRIEF', packageId: pkgGraphologiBrief.id, quota: 100, usedCount: 0, isActive: true },
    });

    await prisma.voucher.upsert({
      where: { code: 'TEST-GRAFO-INDEPTH' },
      update: {},
      create: { code: 'TEST-GRAFO-INDEPTH', packageId: pkgGraphologiIndepth.id, quota: 100, usedCount: 0, isActive: true },
    });

    await prisma.voucher.upsert({
      where: { code: 'TEST-GRAFO-ADVANCED' },
      update: {},
      create: { code: 'TEST-GRAFO-ADVANCED', packageId: pkgGraphologiAdvanced.id, quota: 100, usedCount: 0, isActive: true },
    });

    console.log('Demo Vouchers seeded completely.');

    return NextResponse.json({
      success: true,
      message: 'Seeded Database with 6 Premium Packages (3 Psikometri + 3 Grafologi)'
    });
  } catch (err) {
    console.error('Seed error:', err);
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
