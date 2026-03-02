import { NextResponse } from 'next/server';
import { getSubmissionById } from '@/lib/dataStore';
import { logger } from '@/utils/logger';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const submission = await getSubmissionById(id);

    if (!submission) {
      return NextResponse.json(
        { success: false, error: 'Submission not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: submission });
  } catch (error) {
    logger.error("Error fetching submission:", error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch submission' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const { deleteSubmission } = await import('@/lib/dataStore');
    const success = await deleteSubmission(id);

    if (!success) {
      return NextResponse.json({ success: false, error: 'Failed to delete or not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    logger.error("Error deleting submission:", error);
    return NextResponse.json({ success: false, error: 'Failed to delete' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const dataToUpdate = await request.json();
    
    const { getSQL } = await import('@/lib/dataStore');
    const sql = getSQL();

    // Simple explicit updates for general user data
    if (dataToUpdate.mode === 'user_data') {
      await sql`
        UPDATE "Submission" 
        SET 
          nama = ${dataToUpdate.nama}, 
          usia = ${dataToUpdate.usia ? parseInt(dataToUpdate.usia) : null},
          instansi = ${dataToUpdate.instansi},
          pekerjaan = ${dataToUpdate.pekerjaan},
          jabatan = ${dataToUpdate.jabatan}
        WHERE id = ${id}
      `;
    }

    return NextResponse.json({ success: true, message: 'Updated successfully' });
  } catch (error) {
    logger.error("Error updating submission:", error);
    return NextResponse.json({ success: false, error: 'Failed to update' }, { status: 500 });
  }
}
