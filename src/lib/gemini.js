import { generateLocalInterpretation } from './interpretationDict';
import { generateLocalAiInsight } from './localAiEngine';
import { logger } from '../utils/logger';

/**
 * Generate personality description.
 * PRIMARY: Z.AI (Claude Sonnet) → structured JSON insight
 * SECONDARY: Gemini Flash
 * FALLBACK: Local AI Engine → same schema, 100% offline
 */

// Helper: HEXACO score → qualitative category
function categorizeHexaco(mean) {
  if (!mean || mean === 0) return '-';
  if (mean < 2.05) return 'Very Low';
  if (mean < 2.80) return 'Low';
  if (mean < 3.40) return 'Mid';
  if (mean < 4.10) return 'High';
  return 'Very High';
}

// Helper: Extract JSON from messy AI response
function extractJSON(text) {
  let cleaned = text.replace(/```json/gi, '').replace(/```/g, '').trim();
  try { return JSON.parse(cleaned); } catch {}
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try { return JSON.parse(jsonMatch[0]); } catch {}
  }
  return null;
}

export async function generatePersonalityDescription(discPattern, hexacoMeanH, hexacoMeanE, hexacoMeanX, hexacoMeanA, hexacoMeanC, hexacoMeanO, hexacoFacetMeans, discScores, userData = {}) {
  const factorMeans = { H: hexacoMeanH, E: hexacoMeanE, X: hexacoMeanX, A: hexacoMeanA, C: hexacoMeanC, O: hexacoMeanO };

  const localInsight = generateLocalAiInsight(
    discPattern, factorMeans, hexacoFacetMeans || {}, discScores || null, userData || {}
  );

  const localLegacy = generateLocalInterpretation(
    discPattern, factorMeans, hexacoFacetMeans || {}, discScores || null
  );

  const zaiKey = (process.env.ZAI_API_KEY || '').trim();
  const geminiKey = (process.env.GEMINI_API_KEY || '').trim();

  if (!zaiKey && !geminiKey) {
    logger.log("[AI] No API Keys, using local engine.");
    return { ...localInsight, gayaKerja: localLegacy.gayaKerja, karakterInti: localLegacy.karakterInti,
      rekomendasi1: localLegacy.rekomendasi1, rekomendasi2: localLegacy.rekomendasi2, rekomendasi3: localLegacy.rekomendasi3 };
  }

  // ── Build Facet Detail ──
  const facetList = [
    {k:'sinc', n:'Sincerity (H)'}, {k:'fair', n:'Fairness (H)'}, {k:'gree', n:'Greed Avoidance (H)'}, {k:'mode', n:'Modesty (H)'},
    {k:'fear', n:'Fearfulness (E)'}, {k:'anxi', n:'Anxiety (E)'}, {k:'depe', n:'Dependence (E)'}, {k:'sent', n:'Sentimentality (E)'},
    {k:'sses', n:'Social Self-Esteem (X)'}, {k:'socb', n:'Social Boldness (X)'}, {k:'soci', n:'Sociability (X)'}, {k:'live', n:'Liveliness (X)'},
    {k:'forg', n:'Forgivingness (A)'}, {k:'gent', n:'Gentleness (A)'}, {k:'flex', n:'Flexibility (A)'}, {k:'pati', n:'Patience (A)'},
    {k:'orga', n:'Organization (C)'}, {k:'dili', n:'Diligence (C)'}, {k:'perf', n:'Perfectionism (C)'}, {k:'prud', n:'Prudence (C)'},
    {k:'aesa', n:'Aesthetic Appr. (O)'}, {k:'inqu', n:'Inquisitiveness (O)'}, {k:'crea', n:'Creativity (O)'}, {k:'unco', n:'Unconventionality (O)'},
    {k:'altr', n:'Altruism'}
  ];
  const facetStr = facetList.map(f => `  • ${f.n}: ${hexacoFacetMeans?.[f.k] ?? '-'}`).join('\n');

  // ── Prompt ──
  const prompt = `Anda adalah Psikolog Asesor Senior dan Konsultan HR berpengalaman 25+ tahun. Susun "Laporan Integrasi Kepribadian" yang menggabungkan DISC dan HEXACO menjadi narasi karakter utuh dan manusiawi.

### KONTEKS:
- Usia: ${userData?.usia || 'N/A'} tahun | Jabatan: ${userData?.jabatan || userData?.pekerjaan || 'N/A'} | Instansi: ${userData?.instansi || 'N/A'}

### DATA PROFIL:
1. DISC:
   Pola: ${discPattern}
   Publik: D=${discScores?.discMost?.D||0} I=${discScores?.discMost?.I||0} S=${discScores?.discMost?.S||0} C=${discScores?.discMost?.C||0}
   Pribadi: D=${discScores?.discLeast?.D||0} I=${discScores?.discLeast?.I||0} S=${discScores?.discLeast?.S||0} C=${discScores?.discLeast?.C||0}
   Aktual: D=${discScores?.discComposite?.D||0} I=${discScores?.discComposite?.I||0} S=${discScores?.discComposite?.S||0} C=${discScores?.discComposite?.C||0}

2. HEXACO (1.0-5.0):
   H: ${hexacoMeanH} (${categorizeHexaco(hexacoMeanH)}) | E: ${hexacoMeanE} (${categorizeHexaco(hexacoMeanE)}) | X: ${hexacoMeanX} (${categorizeHexaco(hexacoMeanX)})
   A: ${hexacoMeanA} (${categorizeHexaco(hexacoMeanA)}) | C: ${hexacoMeanC} (${categorizeHexaco(hexacoMeanC)}) | O: ${hexacoMeanO} (${categorizeHexaco(hexacoMeanO)})

3. Sub-Facet:
${facetStr}

### ATURAN:
1. INTEGRASI TOTAL — padukan DISC & HEXACO secara implisit, jangan eksplisit.
2. DILARANG menyebut: "skor", "tingkat", "level", "facet", "grafik", "Dominance", "Influence", "Steadiness", "Compliance", "Honesty-Humility", "Emotionality", "Extraversion", "Agreeableness", "Conscientiousness", "Openness", "Altruism", "DISC", "HEXACO".
3. Deskripsikan PERILAKU, bukan label metrik. Tulis seakan psikolog yang mengobservasi klien 1 tahun.
4. deskripsi_kepribadian_terintegrasi HARUS 3-4 paragraf (300-400 kata). WAJIB narasi mengalir, TANPA bullet points.
5. Gunakan "cenderung", "tampak", "berpotensi". Jika ada gap Publik vs Pribadi, analisis sebagai sumber kelelahan emosional.
6. WAJIB menyebut SAAN NAMA KLIEN (${userData?.nama || 'individu ini'}) secara personal minimal 2-3 kali di dalam \`deskripsi_kepribadian_terintegrasi\` (contoh: "${userData?.nama || 'Individu'} adalah sosok yang...").

### OUTPUT WAJIB PERSIS SEPERTI STRUKTUR JSON INI (JANGAN UBAH ATAU TAMBAH KEY APAPUN):
{
  "arketipe_personal": "Julukan unik 2-4 kata",
  "deskripsi_kepribadian_terintegrasi": "3-4 paragraf narasi (300-400 kata)",
  "kekuatan_utama": ["Kekuatan 1 (1-2 kalimat)", "Kekuatan 2", "Kekuatan 3"],
  "tantangan_dan_faktor_penghambat": {
    "komunikasi_dan_pola_kerja": "Analisis friksi komunikasi/kerja",
    "hambatan_karakter_internal": "Faktor internal penghambat"
  },
  "analisis_lingkungan_ideal": {
    "ekosistem_kerja": "Budaya organisasi optimal",
    "kebutuhan_motivasi": "Bahan bakar psikologis utama"
  },
  "peran_potensial_dalam_tim": [{"peran": "Nama peran", "alasan": "Mengapa cocok"}],
  "saran_pengembangan_spesifik": ["Langkah 1", "Langkah 2", "Langkah 3"]
}`;

  // ── AI Call: Gemini PRIMARY → Z.AI FALLBACK → Local FINAL ──
  // Gemini Flash is free, fast (5-15s), no strict rate limits
  // Z.AI actually proxies to GLM models (not real Claude), has Lite plan limits (~80/5hr)
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 45000);
    let cleanText = '';
    let source = '';

    // === PRIMARY: Gemini Flash (free, fast, reliable) ===
    if (geminiKey) {
      logger.log("[AI] PRIMARY: Gemini 2.0 Flash...");
      try {
        const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-goog-api-key': geminiKey },
          signal: controller.signal,
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.7, maxOutputTokens: 3000, responseMimeType: "application/json" },
            systemInstruction: { parts: [{ text: "Output JSON murni dalam bahasa Indonesia." }] }
          })
        });
        if (!res.ok) throw new Error(`Gemini HTTP ${res.status}`);
        const data = await res.json();
        cleanText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        source = 'gemini';
      } catch (geminiErr) {
        logger.warn("[AI] Gemini failed:", geminiErr.message);
        
        // === FALLBACK: Z.AI (GLM proxy) ===
        if (zaiKey) {
          logger.log("[AI] FALLBACK: Z.AI (GLM)...");
          const res = await fetch('https://api.z.ai/api/anthropic/v1/messages', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${zaiKey}`,
              'Content-Type': 'application/json',
              'anthropic-version': '2023-06-01'
            },
            signal: controller.signal,
            body: JSON.stringify({
              model: 'claude-3-5-sonnet-20241022',
              system: 'Output JSON murni dalam bahasa Indonesia. Langsung mulai dengan {',
              messages: [{ role: 'user', content: prompt }],
              max_tokens: 3000,
              temperature: 0.7
            })
          });
          if (!res.ok) throw new Error(`Z.AI HTTP ${res.status}`);
          const data = await res.json();
          cleanText = data.content?.[0]?.text || '';
          source = 'z.ai';
        } else {
          throw geminiErr; // No Z.AI fallback either → go to local
        }
      }
    } else if (zaiKey) {
      // No Gemini, use Z.AI directly
      logger.log("[AI] Z.AI (GLM) direct...");
      const res = await fetch('https://api.z.ai/api/anthropic/v1/messages', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${zaiKey}`,
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01'
        },
        signal: controller.signal,
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          system: 'Output JSON murni dalam bahasa Indonesia. Langsung mulai dengan {',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 3000,
          temperature: 0.7
        })
      });
      if (!res.ok) throw new Error(`Z.AI HTTP ${res.status}`);
      const data = await res.json();
      cleanText = data.content?.[0]?.text || '';
      source = 'z.ai';
    }

    clearTimeout(timeout);

    const aiResult = extractJSON(cleanText);
    if (!aiResult || !aiResult.deskripsi_kepribadian_terintegrasi) {
      throw new Error('AI returned invalid JSON');
    }

    const wordCount = (aiResult.deskripsi_kepribadian_terintegrasi || '').split(/\s+/).length;
    logger.log(`[AI] Success! Words: ${wordCount}, Source: ${source}`);

    if (!aiResult.peta_potensi_peran && aiResult.peran_potensial_dalam_tim) {
      aiResult.peta_potensi_peran = aiResult.peran_potensial_dalam_tim.map(r => ({
        tipe_arketipe: r.peran || r.tipe_arketipe, alasan: r.alasan,
      }));
    }

    return {
      ...aiResult,
      discAnalysis: localLegacy.discAnalysis, hexacoAnalysis: localLegacy.hexacoAnalysis,
      gayaKerja: localLegacy.gayaKerja, karakterInti: localLegacy.karakterInti,
      rekomendasi1: localLegacy.rekomendasi1, rekomendasi2: localLegacy.rekomendasi2, rekomendasi3: localLegacy.rekomendasi3,
      _source: source,
    };
  } catch (err) {
    logger.warn("[AI] All APIs failed:", err.message, "→ local engine.");
    return {
      ...localInsight,
      gayaKerja: localLegacy.gayaKerja, karakterInti: localLegacy.karakterInti,
      rekomendasi1: localLegacy.rekomendasi1, rekomendasi2: localLegacy.rekomendasi2, rekomendasi3: localLegacy.rekomendasi3,
      _source: 'local',
    };
  }
}
