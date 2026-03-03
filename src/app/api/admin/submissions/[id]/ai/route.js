import { NextResponse } from 'next/server';
import { getSubmissionById, updateSubmissionAiInsight } from '@/lib/dataStore';
import { generatePersonalityDescription } from '@/lib/gemini';
import { logger } from '@/utils/logger';

// Vercel serverless function config — extend timeout for AI generation
export const maxDuration = 60;

export async function POST(request, context) {
  try {
    const params = await context.params;
    const { id } = params;
    const sub = await getSubmissionById(id);

    if (!sub) {
      return NextResponse.json({ success: false, error: 'Submission not found' }, { status: 404 });
    }

    // Check if force regeneration requested
    let force = false;
    try {
      const body = await request.json();
      force = body?.force === true;
    } catch { /* no body = normal request */ }

    if (sub.aiInsight && !force) {
      return NextResponse.json({ success: true, aiInsight: sub.aiInsight, cached: true });
    }

    // Call AI / Local Dictionary (with 3-graph DISC analysis)
    const fm = sub.hexacoScores?.factorMeans || {};
    const facetMeans = sub.hexacoScores?.facetMeans || {};
    const insight = await generatePersonalityDescription(
      sub.discScores?.pattern || 'Uncategorized',
      fm.H || 3, fm.E || 3, fm.X || 3, fm.A || 3, fm.C || 3, fm.O || 3,
      facetMeans,
      sub.discScores,
      sub.userData || {}
    );

    // Save to database
    await updateSubmissionAiInsight(id, insight);

    return NextResponse.json({ success: true, aiInsight: insight, cached: false });

  } catch (error) {
    logger.error("AI Generation Error: ", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
