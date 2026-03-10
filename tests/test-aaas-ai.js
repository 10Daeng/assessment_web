// tests/test-aaas-ai.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function runTest() {
  try {
    console.log('[Test Start] Fetching a recently completed AaaS FinalReport...');
    const report = await prisma.finalReport.findFirst({
        orderBy: { createdAt: 'desc' }
    });

    if (!report) {
        console.log('No FinalReport found in development database. Taking a test takes 3 minutes. Run the app and complete a test fast first.');
        process.exit(0);
    }

    console.log(`Found Report ID: ${report.id}`);
    console.log(`Sending Mock Request to Local API...`);

    const res = await fetch(`http://localhost:3000/api/premium/generate-ai/${report.id}`, {
        method: 'POST',
    });

    const data = await res.json();
    console.log('Response Status:', res.status);
    console.log('Response Data:', JSON.stringify(data, null, 2));

    if (data.success) {
        const checkDb = await prisma.finalReport.findUnique({ where: { id: report.id }});
        console.log('\\n[DB Verification] AI Insight saved?');
        if (checkDb.aiInsight) {
            console.log('✅ YES! Structure extracted:');
            console.log(Object.keys(checkDb.aiInsight));
            console.log('\\nPreview of Arketipe:', checkDb.aiInsight.arketipe_personal);
        } else {
            console.log('❌ NO! aiInsight is still null in DB.');
        }
    }

  } catch (error) {
    console.error('Test Error:', error);
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
}

runTest();
