import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { logger } from '@/utils/logger';

function getSQL() {
  return neon(process.env.DATABASE_URL);
}

export async function POST(request) {
  try {
    const { messages, selectedClientId } = await request.json();

    const sql = getSQL();
    const subs = await sql`SELECT id, nama, email, "instansi", "jabatan", "pekerjaan", "aiInsight", "discPattern" FROM "Submission" ORDER BY "submittedAt" DESC LIMIT 150`;

    let contextData = '';
    
    // Build context depending on if a client is selected
    if (selectedClientId && selectedClientId !== 'all') {
       if (selectedClientId.startsWith('org:')) {
           const orgs = selectedClientId.replace('org:', '').split('|').filter(Boolean);
           const filteredSubs = subs.filter(s => orgs.includes(s.instansi));
           contextData = `Konteks Kelompok Instansi (${orgs.join(', ')}):\nJumlah Total Klien: ${filteredSubs.length}\nDaftar Ringkas:\n`;
           filteredSubs.forEach(s => {
              contextData += `- ${s.nama} (${s.jabatan} di ${s.instansi}). Arketipe AI: ${s.aiInsight?.arketipe_personal || 'Belum dianalisis'}\n`;
           });
           contextData += `\n(Tugas: Jawab pertanyaan admin mengenai kelompok/instansi spesifik di atas)`;
       } else {
           const client = subs.find(s => s.id === selectedClientId);
           if (client) {
             contextData = `Konteks Klien Spesifik:\n- Nama: ${client.nama}\n- Email: ${client.email}\n- Instansi: ${client.instansi}\n- Jabatan: ${client.jabatan}\n- Pola DISC: ${client.discPattern}\n- AI Insight: ${JSON.stringify(client.aiInsight)}\n\n(Tugas: Jawab pertanyaan admin yang berfokus pada klien ini)`;
           }
       }
    } else {
       // Org context
       contextData = `Konteks Seluruh Klien (Profil Organisasi/Kelompok):\nJumlah Total Klien yang Dianalisis: ${subs.length}\nDaftar Ringkas:\n`;
       subs.forEach(s => {
          contextData += `- ${s.nama} (${s.jabatan} di ${s.instansi}). Arketipe AI: ${s.aiInsight?.arketipe_personal || 'Belum dianalisis'}\n`;
       });
       contextData += `\n(Tugas: Jawab pertanyaan admin mengenai tren keseluruhan, pemetaan agregat, atau pola dari daftar klien di atas)`;
    }

    const systemPrompt = `Anda adalah seorang Konsultan Psikologi Organisasi, Pakar SDM, dan Asisten AI khusus untuk Lentera Batin.
Anda bertugas menjadi rekan diskusi (sparring partner) bagi Admin/Manajer untuk membedah data hasil asesmen klien.
    
Gunakan konteks data berikut sebagai acuan utama Anda:
==============
${contextData}
==============

Gaya Bahasa:
- Profesional, analitis, namun bersahabat dan mudah dipahami layaknya seorang Partner Konsultan.
- Jangan pernah menggunakan bahasa teknis metrik asesmen mentah jika tidak diminta.
- Berikan format paragraf yang rapi atau bullet-points agar mudah dibaca.
- JANGAN BERFORMAT JSON. Menjawablah layaknya asisten ngobrol/chat.`;

    const zaiKey = process.env.ZAI_API_KEY;
    const geminiKey = process.env.GEMINI_API_KEY;

    let reply = '';

    if (zaiKey) {
        // Claude Sonnet via Z.AI
        const response = await fetch('https://api.z.ai/api/anthropic/v1/messages', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${zaiKey}`,
                'Content-Type': 'application/json',
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-3-5-sonnet-20241022',
                max_tokens: 2500,
                system: systemPrompt,
                messages: messages
            })
        });
        if (!response.ok) throw new Error("Z.AI API failed");
        const data = await response.json();
        reply = data.content?.[0]?.text || '';
    } else if (geminiKey) {
        // Gemini
        const geminiMessages = messages.map(m => ({
           role: m.role === 'user' ? 'user' : 'model',
           parts: [{ text: m.content }]
        }));

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-goog-api-key': geminiKey },
            body: JSON.stringify({
                systemInstruction: { parts: [{ text: systemPrompt }] },
                contents: geminiMessages,
                generationConfig: { temperature: 0.7, maxOutputTokens: 2500 }
            })
        });
        if (!response.ok) throw new Error("Gemini API failed");
        const data = await response.json();
        reply = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    } else {
        reply = "Sistem gagal menemukan API Key (Z.AI atau Gemini). Mohon konfigurasi pada environment server.";
    }

    return NextResponse.json({ success: true, reply });
  } catch(e) {
    logger.error("Chat API Error:", e);
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
