import { NextResponse } from 'next/server';
import { addSubmission, updateSubmissionAiInsight } from '@/lib/dataStore';
import { generatePersonalityDescription } from '@/lib/gemini';

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
      }).catch(err => console.error("Webhook Error:", err));
    }

    // Auto-generate AI interpretation synchronously right away
    try {
      const fm = data.hexacoScores?.factorMeans || {};
      const insight = await generatePersonalityDescription(
        data.discScores?.pattern || 'Uncategorized',
        fm.H || 3, fm.E || 3, fm.X || 3, fm.A || 3, fm.C || 3, fm.O || 3
      );
      await updateSubmissionAiInsight(record.id, insight);
    } catch (aiErr) {
      console.error("Auto AI Generation failed:", aiErr);
      // We don't block the request if AI fails, user can manually retry on admin panel
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Assessment data saved successfully',
      data: { id: record.id }
    });
  } catch (error) {
    console.error("Error saving assessment result:", error);
    return NextResponse.json(
      { success: false, error: 'Failed to process assessment data' },
      { status: 500 }
    );
  }
}
