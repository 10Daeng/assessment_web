import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding AaaS data...');

  // 1. Create Core Modules
  const moduleDisc = await prisma.module.upsert({
    where: { id: 'mod-disc-primary' },
    update: {},
    create: {
      id: 'mod-disc-primary',
      name: 'Profil Gaya Kerja (DISC)',
      description: 'Asesmen kepribadian berdasarkan 4 kuadran DISC.',
      aiPrompt: 'Analisislah gaya kerja partisipan di lingkungan profesional, bagaimana pola komunikasi, potensi konflik, dan saran pendekatan manajemen yang tepat berdasarkan skor DISC berikut.',
    },
  });

  const moduleHexaco = await prisma.module.upsert({
    where: { id: 'mod-hexaco-primary' },
    update: {},
    create: {
      id: 'mod-hexaco-primary',
      name: 'Profil Karakter (HEXACO)',
      description: 'Asesmen tipe kepribadian komprehensif 6 dimensi.',
      aiPrompt: 'Berdasarkan dimensi HEXACO ini, berikan penjabaran mendalam tentang integritas moral, emosionalitas, dan keterbukaan intelektual partisipan.',
    },
  });

  console.log('Modules seeded:', moduleDisc.name, moduleHexaco.name);

  // 2. Create Packages
  const pkgBasic = await prisma.package.upsert({
    where: { id: 'pkg-basic' },
    update: { intent: 'GENERAL' },
    create: {
      id: 'pkg-basic',
      name: 'Paket Basic: Gaya Kerja',
      description: 'Pemetaan gaya kerja fundamental menggunakan DISC.',
      price: 50000,
      intent: 'GENERAL',
      modules: {
        create: [
          { moduleId: moduleDisc.id, order: 1 }
        ]
      }
    },
  });

  const pkgReguler = await prisma.package.upsert({
    where: { id: 'pkg-reguler' },
    update: { intent: 'GENERAL' },
    create: {
      id: 'pkg-reguler',
      name: 'Paket Reguler: Kepribadian Eksekutif',
      description: 'Analisa gabungan gaya kerja dan sifat fundamental (DISC + HEXACO).',
      price: 150000,
      intent: 'GENERAL',
      modules: {
        create: [
          { moduleId: moduleDisc.id, order: 1 },
          { moduleId: moduleHexaco.id, order: 2 }
        ]
      }
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
      modules: {
        create: [
          { moduleId: moduleDisc.id, order: 1 },
          { moduleId: moduleHexaco.id, order: 2 }
        ]
      }
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
      modules: {
        create: [
          { moduleId: moduleDisc.id, order: 1 },
          { moduleId: moduleHexaco.id, order: 2 }
        ]
      }
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
      modules: {
        create: [
          { moduleId: moduleDisc.id, order: 1 }
        ]
      }
    },
  });

  console.log('Packages seeded:', pkgBasic.name, pkgReguler.name, pkgRekrutmen.name, pkgAkademik.name, pkgGrafologi.name);

  // 3. Create Demo Vouchers for Testing Intents
  const vcrTest = await prisma.voucher.upsert({
    where: { code: 'DEMO-REGULER-26' },
    update: {},
    create: {
      code: 'DEMO-REGULER-26', packageId: pkgReguler.id, quota: 100, usedCount: 0, isActive: true,
    },
  });

  await prisma.voucher.upsert({
    where: { code: 'TEST-REKRUTMEN' },
    update: {},
    create: {
      code: 'TEST-REKRUTMEN', packageId: pkgRekrutmen.id, quota: 100, usedCount: 0, isActive: true,
    },
  });

  await prisma.voucher.upsert({
    where: { code: 'TEST-AKADEMIK' },
    update: {},
    create: {
      code: 'TEST-AKADEMIK', packageId: pkgAkademik.id, quota: 100, usedCount: 0, isActive: true,
    },
  });

  await prisma.voucher.upsert({
    where: { code: 'TEST-GRAFOLOGI' },
    update: {},
    create: {
      code: 'TEST-GRAFOLOGI', packageId: pkgGrafologi.id, quota: 100, usedCount: 0, isActive: true,
    },
  });

  console.log('Demo Vouchers seeded completely.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
