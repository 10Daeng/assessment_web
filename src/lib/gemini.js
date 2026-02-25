import { generateLocalInterpretation } from './interpretationDict';

/**
 * Generate personality description.
 * PRIMARY: Local dictionary (offline, instant, free) — includes 3-graph DISC + facet HEXACO
 * FALLBACK: Gemini API (optional enhancement)
 */
export async function generatePersonalityDescription(discPattern, hexacoMeanH, hexacoMeanE, hexacoMeanX, hexacoMeanA, hexacoMeanC, hexacoMeanO, hexacoFacetMeans, discScores) {
  // Always generate local interpretation first (instant, free, comprehensive)
  const local = generateLocalInterpretation(
    discPattern,
    { H: hexacoMeanH, E: hexacoMeanE, X: hexacoMeanX, A: hexacoMeanA, C: hexacoMeanC, O: hexacoMeanO },
    hexacoFacetMeans || {},
    discScores || null
  );

  // Optionally try Gemini for richer narrative
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.log("[AI] No GEMINI_API_KEY, using local dictionary.");
    return local;
  }

  try {
    console.log("[AI] Attempting Gemini enhancement...");
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const prompt = `Anda adalah ahli psikologi. Berikut data tes kepribadian klien:
- Pola Gaya Kerja: ${discPattern}
- Kejujuran/Kerendahhatian: ${hexacoMeanH}/5
- Emosionalitas: ${hexacoMeanE}/5
- Ekstraversi: ${hexacoMeanX}/5
- Keramahan: ${hexacoMeanA}/5
- Kehati-hatian: ${hexacoMeanC}/5
- Keterbukaan: ${hexacoMeanO}/5

Buat interpretasi JSON (tanpa markdown):
{"gayaKerja":"[2 paragraf natural]","karakterInti":"[2-3 paragraf natural]","rekomendasi1":"[1-2 baris]","rekomendasi2":"[1-2 baris]","rekomendasi3":"[1-2 baris]"}

PENTING: TANPA jargon teknis (DISC/HEXACO/High D/Low C/skor). Bahasa natural, profesional, empatik.`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 2000, responseMimeType: "application/json" },
        systemInstruction: { parts: [{ text: "Output JSON murni tanpa markdown. Dilarang menyebut nama alat tes atau skor." }] }
      })
    });

    clearTimeout(timeout);
    if (!response.ok) throw new Error(`Gemini ${response.status}`);

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const clean = text.replace(/```json/gi, '').replace(/```/g, '').trim();
    const geminiResult = JSON.parse(clean);
    console.log("[AI] Gemini enhancement succeeded.");
    // Merge: use Gemini narrative but keep local discAnalysis data
    return { ...geminiResult, discAnalysis: local.discAnalysis };
  } catch (err) {
    console.warn("[AI] Gemini failed, using local dictionary:", err.message);
    return local;
  }
}
