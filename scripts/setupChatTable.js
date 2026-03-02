const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

async function setupChatTable() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is not set.");
    process.exit(1);
  }

  const sql = neon(process.env.DATABASE_URL);

  try {
    console.log("Creating ChatHistory table...");
    await sql`
      CREATE TABLE IF NOT EXISTS "ChatHistory" (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title TEXT NOT NULL,
        "selectedTarget" TEXT DEFAULT 'all',
        messages JSONB NOT NULL DEFAULT '[]',
        "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `;
    console.log("ChatHistory table created/verified.");
  } catch (error) {
    console.error("Error setting up chat table:", error);
  }
}

setupChatTable();
