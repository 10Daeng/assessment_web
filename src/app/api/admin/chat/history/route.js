import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { logger } from '@/utils/logger';

function getSQL() {
  return neon(process.env.DATABASE_URL);
}

// GET lists all chat histories
export async function GET() {
  try {
    const sql = getSQL();
    const histories = await sql`
      SELECT id, title, "selectedTarget", "updatedAt"
      FROM "ChatHistory"
      ORDER BY "updatedAt" DESC
    `;
    return NextResponse.json({ success: true, data: histories });
  } catch(e) {
    logger.error("Fetch DB ChatHistory Error:", e);
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

// POST creates a new chat history
export async function POST(request) {
  try {
    const { title, selectedTarget, messages } = await request.json();
    const sql = getSQL();

    const result = await sql`
      INSERT INTO "ChatHistory" (title, "selectedTarget", messages)
      VALUES (${title}, ${selectedTarget}, ${messages ? JSON.stringify(messages) : '[]'})
      RETURNING id, title, "selectedTarget", messages, "createdAt", "updatedAt"
    `;

    return NextResponse.json({ success: true, data: result[0] });
  } catch(e) {
    logger.error("Insert DB ChatHistory Error:", e);
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
