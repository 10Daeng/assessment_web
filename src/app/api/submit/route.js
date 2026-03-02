import { NextResponse } from 'next/server';
import { addSubmission } from '@/lib/dataStore';
import { logger } from '@/utils/logger';

export async function POST(request) {
  try {
    const data = await request.json();
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

    // We removed synchronous AI generation here to prevent Vercel 10s timeout errors. 
    // The client page.jsx now securely triggers the AI generation in a separate lightweight POST request 
    // immediately after this submit request succeeds.


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
