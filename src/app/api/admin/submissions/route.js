import { NextResponse } from 'next/server';
import { getAllSubmissions, detectDuplicates } from '@/lib/dataStore';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const search = searchParams.get('search') || '';
    const sortBy = searchParams.get('sortBy') || 'submittedAt';
    const sortDir = searchParams.get('sortDir') || 'desc';

    if (type === 'duplicates') {
      const duplicates = await detectDuplicates();
      return NextResponse.json({ success: true, data: duplicates });
    }

    const submissions = await getAllSubmissions({ search, sortBy, sortDir });

    return NextResponse.json({ 
      success: true, 
      data: submissions,
      total: submissions.length
    });
  } catch (error) {
    console.error("Error fetching submissions:", error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}
