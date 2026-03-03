import { NextResponse } from 'next/server';
import { addSubmission } from '@/lib/dataStore';
import { logger } from '@/utils/logger';

export async function POST(request) {
  try {
    const data = await request.json();

    // Input validation
    if (!data || typeof data !== 'object') {
      return NextResponse.json({ success: false, error: 'Invalid request body' }, { status: 400 });
    }
    if (!data.userData || !data.userData.nama || typeof data.userData.nama !== 'string' || !data.userData.nama.trim()) {
      return NextResponse.json({ success: false, error: 'Nama is required' }, { status: 400 });
    }
    if (!data.discScores || !data.hexacoScores) {
      return NextResponse.json({ success: false, error: 'Assessment scores are required' }, { status: 400 });
    }

    const record = await addSubmission(data);

    // Optional: Backup to Google Sheets Webhook
    const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
    if (webhookUrl) {
      // Async fire-and-forget to avoid blocking response
      fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }).catch(err => logger.error("Webhook Error:", err));
    }

    // Auto-generate AI insight in background (fire-and-forget)
    // This avoids client having to manually trigger AI generation later
    try {
      const vercelUrl = process.env.VERCEL_URL;
      const publicUrl = process.env.NEXT_PUBLIC_BASE_URL;
      const baseUrl = publicUrl || (vercelUrl ? `https://${vercelUrl}` : 'http://localhost:3000');
      fetch(`${baseUrl}/api/admin/submissions/${record.id}/ai`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ force: true }),
      }).catch(err => logger.error("[Auto-AI] Background generation error:", err.message));
      logger.log(`[Auto-AI] Triggered background AI generation for ${data.userData.nama} (${record.id})`);
    } catch (autoErr) {
      logger.error("[Auto-AI] Failed to trigger:", autoErr.message);
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Assessment data saved successfully',
      data: { id: record.id }
    });
  } catch (error) {
    logger.error("Error saving assessment result:", error);
    return NextResponse.json(
      { success: false, error: 'Failed to process assessment data' },
      { status: 500 }
    );
  }
}
