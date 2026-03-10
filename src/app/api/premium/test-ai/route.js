import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const report = await prisma.finalReport.findFirst({
        orderBy: { createdAt: 'desc' },
        include: { session: { include: { package: true }}}
    });

    if (!report) {
       return NextResponse.json({ error: 'No FinalReport found in DB to test.' });
    }

    const host = request.headers.get('host');
    const protocol = request.headers.get('x-forwarded-proto') || 'http';
    const baseUrl = `${protocol}://${host}`;

    // Fire the async request
    fetch(`${baseUrl}/api/premium/generate-ai/${report.id}`, { method: 'POST' })
        .then(res => res.json())
        .then(data => console.log('[AaaS Async AI Test] Triggered successfully:', data))
        .catch((err) => console.error('[AaaS Async AI Test] Failed to trigger background AI:', err));

    return NextResponse.json({ 
        message: 'Test triggered in background for report: ' + report.id,
        testingPackage: report.session?.package?.name || 'Unknown'
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
