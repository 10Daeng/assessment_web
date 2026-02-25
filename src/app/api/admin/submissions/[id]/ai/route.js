import { NextResponse } from 'next/server';
import { getSubmissionById, updateSubmissionAiInsight } from '@/lib/dataStore';
import { generatePersonalityDescription } from '@/lib/gemini';

export async function POST(request, context) {
  try {
    const params = await context.params;
    const { id } = params;
    const sub = await getSubmissionById(id);
    
    if (!sub) {
      return NextResponse.json({ success: false, error: 'Submission not found' }, { status: 404 });
    }

    if (sub.aiInsight) {
      return NextResponse.json({ success: true, aiInsight: sub.aiInsight, cached: true });
    }

    // Call Gemini
    const fm = sub.hexacoScores?.factorMeans || {};
    const insight = await generatePersonalityDescription(
      sub.discScores?.pattern || 'Uncategorized',
      fm.H || 3, fm.E || 3, fm.X || 3, fm.A || 3, fm.C || 3, fm.O || 3
    );

    // Save to database
    await updateSubmissionAiInsight(id, insight);

    return NextResponse.json({ success: true, aiInsight: insight, cached: false });

  } catch (error) {
    console.error("AI Generation Error: ", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
