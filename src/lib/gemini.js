const AI_PROMPT = (discPattern, hH, hE, hX, hA, hC, hO) => `Anda adalah seorang ahli psikologi industri dan klinis.
Saya memiliki klien yang baru melakukan tes kepribadian ganda.

Ini adalah hasil tes mereka:
- Pola Utama Gaya Kerja: ${discPattern}
- Skor rata-rata Karakter Inti (Skala 1-5, dimana 1 sangat rendah dan 5 sangat tinggi):
  * Aspek Kejujuran/Kerendahhatian: ${hH}
  * Aspek Emosionalitas/Kerentanan: ${hE}
  * Aspek Ekstraversi/Sosialisasi: ${hX}
  * Aspek Keramahan/Toleransi: ${hA}
  * Aspek Kehati-hatian/Integritas Kerja: ${hC}
  * Aspek Keterbukaan terhadap Pengalaman Baru: ${hO}

Tugas Anda:
Buatlah deskripsi interpretasi natural TANPA MENGGUNAKAN JARGON TEKNIS SEPERTI "High D", "Low C", "Skor Anda 4", "DISC", "HEXACO", dll. Gunakan bahasa yang natural, profesional, dan empatik.
Keluarkan interpretasi dalam format **JSON** dengan field berikut:
{
  "gayaKerja": "[2 paragraf tentang cara kerja, pengambilan keputusan, dan gaya komunikasi. Jangan sebut nama alat tes atau skor secara spesifik, cukup sebutkan kecenderungan dinamis mereka secara natural]",
  "karakterInti": "[2-3 paragraf tentang kualitas karakter mendalam. Jelaskan bagaimana sifat ini tercermin dalam hidup mereka, namun jangan jabarkan poin per poin. Jadikan narasi gabungan yang mulus dan mengalir]",
  "rekomendasi1": "[Kalimat singkat 1-2 baris tentang saran pengembangan spesifik]",
  "rekomendasi2": "[Kalimat singkat 1-2 baris tentang saran pengembangan spesifik]",
  "rekomendasi3": "[Kalimat singkat 1-2 baris tentang saran pengembangan spesifik]"
}

Hanya keluarkan JSON mentah tanpa markdown \`\`\`json atau penjelasan tambahan.`;

const SYSTEM_MSG = "Anda adalah AI pembuat laporan psikologi profesional untuk klien. Berikan output hanya dalam format JSON murni yang sesuai struktur yang diminta, tanpa markdown atau teks pengantar apa pun. Anda dilarang memberikan teks apapun diluar JSON.";

// =============================================
// Provider 1: Z.AI (Anthropic Claude Proxy)
// =============================================
async function callZAI(prompt) {
  const apiKey = process.env.ZAI_API_KEY;
  if (!apiKey) throw new Error("ZAI_API_KEY not set");

  const response = await fetch('https://api.z.ai/api/anthropic/v1/messages', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-3-5-sonnet-20240620',
      max_tokens: 1500,
      temperature: 0.7,
      system: SYSTEM_MSG,
      messages: [{ role: 'user', content: prompt }]
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Z.AI Error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return data.content?.[0]?.text || '';
}

// =============================================
// Provider 2: Google Gemini (Fallback)
// =============================================
async function callGemini(prompt) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY not set");

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2000,
        responseMimeType: "application/json"
      },
      systemInstruction: { parts: [{ text: SYSTEM_MSG }] }
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini Error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

// =============================================
// MASTER: Try Z.AI first → fallback to Gemini
// =============================================
export async function generatePersonalityDescription(discPattern, hexacoMeanH, hexacoMeanE, hexacoMeanX, hexacoMeanA, hexacoMeanC, hexacoMeanO) {
  const prompt = AI_PROMPT(discPattern, hexacoMeanH, hexacoMeanE, hexacoMeanX, hexacoMeanA, hexacoMeanC, hexacoMeanO);

  let rawText = '';

  // Attempt 1: Z.AI (Primary)
  try {
    console.log("[AI] Trying Z.AI (Claude)...");
    rawText = await callZAI(prompt);
    console.log("[AI] Z.AI succeeded.");
  } catch (err1) {
    console.warn("[AI] Z.AI failed:", err1.message);

    // Attempt 2: Gemini (Fallback)
    try {
      console.log("[AI] Falling back to Google Gemini...");
      rawText = await callGemini(prompt);
      console.log("[AI] Gemini succeeded.");
    } catch (err2) {
      console.error("[AI] Gemini also failed:", err2.message);
      throw new Error(`Kedua provider AI gagal. Z.AI: ${err1.message} | Gemini: ${err2.message}`);
    }
  }

  // Parse JSON from raw text
  const cleanJsonStr = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
  return JSON.parse(cleanJsonStr);
}
