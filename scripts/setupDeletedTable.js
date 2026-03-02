require('dotenv').config({ path: '.env.local' });
const { neon } = require('@neondatabase/serverless');

async function setup() {
  const sql = neon(process.env.DATABASE_URL);
  try {
    console.log("Creating DeletedSubmission table if not exists...");
    await sql`
      CREATE TABLE IF NOT EXISTS "DeletedSubmission" (LIKE "Submission" INCLUDING ALL);
    `;
    console.log("Table created successfully!");
  } catch (e) {
    console.error("Failed:", e);
  }
}

setup();
