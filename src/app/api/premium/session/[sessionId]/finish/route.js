import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';


export async function POST(req, { params }) {
  try {
    const { sessionId } = await params;

    const session = await prisma.assessmentSession.findUnique({
      where: { id: sessionId },
      include: {
        package: {
          include: {
            modules: {
              include: { module: true }
            }
          }
        },
        moduleResults: {
          include: { module: true }
        }
      }
    });

    if (!session || session.status === 'COMPLETED') {
      return NextResponse.json({ message: 'Sesi tidak valid atau sudah selesai.' }, { status: 400 });
    }

    // 1. Combine all ModuleResults into the "SUPER JSON"
    const combinedData = {
      participant: {
        name: session.participantName,
        age: session.participantAge,
        package: session.package.name
      },
      results: {}
    };

    session.moduleResults.forEach(result => {
      combinedData.results[result.module.name] = {
        scores: result.rawScore,
        aiInstruction: result.module.aiPrompt
      };
    });

    // 2. Wrap it all into FinalReport Table!
    const finalReport = await prisma.finalReport.create({
      data: {
        sessionId: session.id,
        reportData: combinedData, // This is the payload we will send to Gemini/OpenAI!
      }
    });

    // 3. Mark Session as Completed
    await prisma.assessmentSession.update({
      where: { id: session.id },
      data: { 
        status: 'COMPLETED',
        completedAt: new Date()
      }
    });

    // 4. Trigger AI Generation asynchronously
    // Use the request URL to resolve the current host so it works cleanly in prod/dev
    const protocol = req.headers.get('x-forwarded-proto') || 'http';
    const host = req.headers.get('host');
    const baseUrl = `${protocol}://${host}`;
    
    fetch(`${baseUrl}/api/premium/generate-ai/${finalReport.id}`, { method: 'POST' })
      .then(res => res.json())
      .then(data => console.log('[AaaS Async AI] Triggered successfully:', data))
      .catch((err) => console.error('[AaaS Async AI] Failed to trigger background AI:', err));

    return NextResponse.json({ success: true, finalReportId: finalReport.id });

  } catch (error) {
    console.error('Finalize session error:', error);
    return NextResponse.json({ message: 'Terjadi kesalahan sistem.' }, { status: 500 });
  } finally {
    /* await prisma.$disconnect(); */
  }
}
