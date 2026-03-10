// tests/run-ai-direct.js
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });
const { buildAaasPrompt } = require('../src/utils/aaasPromptBuilder.js');
const { PrismaClient } = require('@prisma/client');

// Mock next/server for testing
global.NextResponse = { json: (data) => data };

async function run() {
  const prisma = new PrismaClient();
  try {
      console.log('Fetching Report from DB...');
      const finalReport = await prisma.finalReport.findFirst({
        orderBy: { createdAt: 'desc' },
        include: {
          session: { include: { package: true } },
          moduleResults: { include: { module: true } }
        }
      });

      if (!finalReport) throw new Error("No reports found to test");

      const packageType = finalReport.session?.package?.name?.toUpperCase()?.includes('PREMIUM') ? 'PREMIUM' : 'REGULER';
      console.log(`Building prompt for package: ${packageType}`);
      
      const prompt = buildAaasPrompt(finalReport, packageType);
      console.log('--- PROMPT BUILT ---');
      console.log(prompt.substring(0, 300) + '...');

      const geminiKey = process.env.GEMINI_API_KEY;
      if (!geminiKey) throw new Error("GEMINI_API_KEY not found in .env");

      console.log(`Sending to Gemini API...`);
      const reqBody = {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 3000, responseMimeType: "application/json" },
        systemInstruction: { parts: [{ text: "Output JSON murni dalam bahasa Indonesia." }] }
      };

      const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': geminiKey.trim() },
        body: JSON.stringify(reqBody)
      });

      if (!res.ok) {
         console.error(await res.text());
         throw new Error(`Gemini Error ${res.status}`);
      }

      const aiResponseData = await res.json();
      const cleanText = aiResponseData.candidates?.[0]?.content?.parts?.[0]?.text || '';
      console.log('\\n--- AI RAW RESPONSE ---');
      console.log(cleanText.substring(0, 200) + '...');

      let aiInsightJSON = null;
      let cleaned = cleanText.replace(/```json/gi, '').replace(/```/g, '').trim();
      try { aiInsightJSON = JSON.parse(cleaned); } catch {}
      if (!aiInsightJSON) {
        const jsonMatch = cleaned.match(/\\{[\\s\\S]*\\}/);
        if (jsonMatch) {
            try { aiInsightJSON = JSON.parse(jsonMatch[0]); } catch {}
        }
      }

      if (aiInsightJSON && documentSaved) {
         console.log('\\n✅ Final Structure Saved:');
         console.log(Object.keys(aiInsightJSON));
      }

  } catch (err) {
      console.error(err);
  } finally {
      await prisma.$disconnect();
  }
}

run();
