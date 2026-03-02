import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

function getSQL() {
  return neon(process.env.DATABASE_URL);
}

// Fetch single chat
export async function GET(request, context) {
  try {
    const params = await context.params;
    const { id } = params;
    
    if (!id) return NextResponse.json({ success: false, error: 'Missing ID' }, { status: 400 });

    const sql = getSQL();
    const chat = await sql`
      SELECT id, title, "selectedTarget", messages, "createdAt", "updatedAt"
      FROM "ChatHistory" 
      WHERE id = ${id}
    `;

    if (chat.length === 0) {
       return NextResponse.json({ success: false, error: 'Chat not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: chat[0] });
  } catch(e) {
    console.error("GET DB ChatHistory Error:", e);
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

// Update messages, target, or title
export async function PUT(request, context) {
  try {
    const params = await context.params;
    const { id } = params;
    const body = await request.json();
    const sql = getSQL();

    let result;

    if (body.title !== undefined) {
      if (body.messages !== undefined && body.selectedTarget !== undefined) {
         // Full update
         result = await sql`
           UPDATE "ChatHistory" 
           SET 
             title = ${body.title}, 
             "selectedTarget" = ${body.selectedTarget}, 
             messages = ${JSON.stringify(body.messages)}, 
             "updatedAt" = NOW()
           WHERE id = ${id}
           RETURNING id, title, "selectedTarget", messages, "createdAt", "updatedAt"
         `;
      } else {
         // Title rename only
         result = await sql`
           UPDATE "ChatHistory" 
           SET title = ${body.title}, "updatedAt" = NOW()
           WHERE id = ${id}
           RETURNING id, title, "selectedTarget", messages, "createdAt", "updatedAt"
         `;
      }
    } else if (body.messages !== undefined) {
      // Message update only
      result = await sql`
        UPDATE "ChatHistory" 
        SET messages = ${JSON.stringify(body.messages)}, "updatedAt" = NOW()
        WHERE id = ${id}
        RETURNING id, title, "selectedTarget", messages, "createdAt", "updatedAt"
      `;
    }

    if (!result || result.length === 0) {
       return NextResponse.json({ success: false, error: 'Failed to update / Chat not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: result[0] });
  } catch(e) {
    console.error("PUT DB ChatHistory Error:", e);
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

// Delete chat history
export async function DELETE(request, context) {
  try {
    const params = await context.params;
    const { id } = params;
    
    if (!id) return NextResponse.json({ success: false, error: 'Missing ID' }, { status: 400 });

    const sql = getSQL();
    await sql`DELETE FROM "ChatHistory" WHERE id = ${id}`;

    return NextResponse.json({ success: true });
  } catch(e) {
    console.error("DELETE DB ChatHistory Error:", e);
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
