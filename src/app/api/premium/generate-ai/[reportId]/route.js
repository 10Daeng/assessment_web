import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { buildAaasPrompt } from '@/utils/aaasPromptBuilder';
import { logger } from '@/utils/logger';


// Helper to extract JSON from messy AI string
function extractJSON(text) {
  let cleaned = text.replace(/```json/gi, '').replace(/```/g, '').trim();
  try { return JSON.parse(cleaned); } catch {}
  const jsonMatch = cleaned.match(/\\{[\\s\\S]*\\}/);
  if (jsonMatch) {
    try { return JSON.parse(jsonMatch[0]); } catch {}
  }
  return null;
}

export async function POST(request, { params }) {
  const { reportId } = params;
  if (!reportId) return NextResponse.json({ error: 'Missing reportId' }, { status: 400 });

  try {
    // 1. Fetch the completely joined FinalReport
    const finalReport = await prisma.finalReport.findUnique({
      where: { id: reportId },
      include: {
        session: {
          include: { package: true }
        },
        moduleResults: {
          include: { module: true }
        }
      }
    });

    if (!finalReport) {
      return NextResponse.json({ error: 'FinalReport not found' }, { status: 404 });
    }

    // Determine package tier (Basic / Reguler / Premium)
    const packageName = (finalReport.session?.package?.name || 'BASIC').toUpperCase();
    let packageType = 'BASIC';
    if (packageName.includes('PREMIUM')) packageType = 'PREMIUM';
    else if (packageName.includes('REGULER') || packageName.includes('REGULAR')) packageType = 'REGULER';

    // 2. Build the Prompt
    const prompt = buildAaasPrompt(finalReport, packageType);
    
    // 3. Setup AI Execution 
    const geminiKey = (process.env.GEMINI_API_KEY || '').trim();
    if (!geminiKey) {
      logger.warn('[AaaS AI] GEMINI_API_KEY is not set. Cannot generate AI insight.');
      return NextResponse.json({ error: 'Gemini API Key missing on server' }, { status: 500 });
    }

    logger.log(`[AaaS AI] Generating ${packageType} insight for FinalReport: ${reportId}`);
    
    // Call Gemini 2.0 Flash
    const reqBody = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.7, maxOutputTokens: 3000, responseMimeType: "application/json" },
      systemInstruction: { parts: [{ text: "Output JSON murni dalam bahasa Indonesia." }] }
    };

    const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': geminiKey },
      body: JSON.stringify(reqBody)
    });

    if (!res.ok) {
        const errorText = await res.text();
        logger.warn('[AaaS AI] Gemini call failed:', errorText);
        throw new Error(`Gemini API Error: ${res.status}`);
    }

    const aiResponseData = await res.json();
    const cleanText = aiResponseData.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    // 4. Extract and validate JSON
    const aiInsightJSON = extractJSON(cleanText);
    
    if (!aiInsightJSON) {
        throw new Error('AI returned invalid JSON format.');
    }

    // 5. Save back to the database
    const updatedReport = await prisma.finalReport.update({
        where: { id: reportId },
        data: {
             aiInsight: aiInsightJSON 
        }
    });

    logger.log(`[AaaS AI] Successfully saved AI Insight to FinalReport ${reportId}`);

    // TODO: (Tahap 2.2) Trigger Email Sending hook here
    // sendReportEmail(updatedReport)

    return NextResponse.json({ 
        success: true, 
        message: 'AI Insight generated and saved successfully',
        reportId: reportId 
    });

  } catch (error) {
    logger.error('[AaaS AI] Error generating AI insight:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
