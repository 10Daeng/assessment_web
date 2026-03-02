import { generateLocalInterpretation } from './interpretationDict';
import { generateLocalAiInsight } from './localAiEngine';

/**
 * Generate personality description.
 * PRIMARY: Z.AI (Claude Sonnet) → structured JSON insight
 * FALLBACK: Local AI Engine → same schema, 100% offline
 * LEGACY: Gemini (if ZAI_API_KEY not set but GEMINI_API_KEY exists)
 */
export async function generatePersonalityDescription(discPattern, hexacoMeanH, hexacoMeanE, hexacoMeanX, hexacoMeanA, hexacoMeanC, hexacoMeanO, hexacoFacetMeans, discScores, userData = {}) {
  const factorMeans = { H: hexacoMeanH, E: hexacoMeanE, X: hexacoMeanX, A: hexacoMeanA, C: hexacoMeanC, O: hexacoMeanO };

  // Always prepare local insight (same schema as Claude)
  const localInsight = generateLocalAiInsight(
    discPattern,
    factorMeans,
    hexacoFacetMeans || {},
    discScores || null
  );

  // Also prepare legacy local interpretation (for PDF gayaKerja/karakterInti)
  const localLegacy = generateLocalInterpretation(
    discPattern,
    factorMeans,
    hexacoFacetMeans || {},
    discScores || null
  );

  const zaiKey = process.env.ZAI_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;

  if (!zaiKey && !geminiKey) {
    console.log("[AI] No API Keys found (Z.AI or Gemini), using local AI engine.");
    // Merge: local insight (Claude schema) + legacy fields for PDF
    return {
      ...localInsight,
      gayaKerja: localLegacy.gayaKerja,
      karakterInti: localLegacy.karakterInti,
      rekomendasi1: localLegacy.rekomendasi1,
      rekomendasi2: localLegacy.rekomendasi2,
      rekomendasi3: localLegacy.rekomendasi3,
    };
  }

  try {
    const prompt = `Anda adalah seorang Konsultan Psikologi Organisasi dan Pakar Manajemen SDM dengan pengalaman lebih dari 25 tahun. Anda memiliki pendekatan yang holistik, mendalam, dan mampu memadukan psikologi modern dengan analisis perilaku. Tugas Anda adalah menganalisis data psikometrik seseorang (DISC & HEXACO) untuk memberikan rekomendasi "Capability-Based Placement" (pemetaan potensi peran tanpa terpaku pada jabatan tertentu).

### DATA PROFIL:
- Demografi & Pekerjaan:
  • Usia: ${userData?.usia || 'Tidak disebutkan'} tahun
  • Asal Instansi: ${userData?.instansi || 'Tidak disebutkan'}
  • Pekerjaan: ${userData?.pekerjaan || 'Tidak disebutkan'}
  • Jabatan: ${userData?.jabatan || 'Tidak disebutkan'}
- Gaya Kerja (Pola DISC): ${discPattern}
  • Grafik 1 (Publik/Mask) : D=${discScores?.discMost?.D || 0}, I=${discScores?.discMost?.I || 0}, S=${discScores?.discMost?.S || 0}, C=${discScores?.discMost?.C || 0}
  • Grafik 2 (Pribadi/Core) : D=${discScores?.discLeast?.D || 0}, I=${discScores?.discLeast?.I || 0}, S=${discScores?.discLeast?.S || 0}, C=${discScores?.discLeast?.C || 0}
  • Grafik 3 (Aktual/Composite) : D=${discScores?.discComposite?.D || 0}, I=${discScores?.discComposite?.I || 0}, S=${discScores?.discComposite?.S || 0}, C=${discScores?.discComposite?.C || 0}
- Karakter Inti (HEXACO - Skor 1.0 - 5.0):
  • Integritas (H): ${hexacoMeanH}
  • Stabilitas Emosi (E): ${hexacoMeanE}
  • Energi Sosial (X): ${hexacoMeanX}
  • Kesabaran (A): ${hexacoMeanA}
  • Disiplin (C): ${hexacoMeanC}
  • Kreativitas (O): ${hexacoMeanO}
- Detail Sub-Facet (Analisis):
  ${JSON.stringify(hexacoFacetMeans)}

### ATURAN UTAMA (WAJIB DIIKUTI - ZERO JARGON & ZERO METRIC POLICY):
1. INTEGRASI TOTAL: Gabungkan DISC, HEXACO, serta latar belakang Pekerjaan, Usia, dan Jabatannya menjadi narasi yang relevan. Jangan pisahkan analisisnya.
2. DILARANG KERAS MENGGUNAKAN BLACKLIST KATA BERIKUT: 
   "skor", "angka", "maksimal", "persentase", "tingkat", "level", "dimensi", "aspek", "facet", "grafik", "profil", "Altruisme", "Integritas", "Dominance", "Influence", "Steadiness", "Compliance", "Extraversion", "Agreeableness", "Conscientiousness", "Openness", "Honesty-Humility", "Emotionality".
3. UBAH LABEL MENJADI DESKRIPSI PERILAKU: Jangan sebut nama sifatnya, tapi deskripsikan perilakunya.
   - SALAH: "Tingkat altruismenya maksimal/nyaris sempurna."
   - BENAR: "Ia memiliki dorongan tanpa pamrih yang sangat kuat untuk selalu mendahulukan kesejahteraan orang lain."
   - SALAH: "Integritas dan keadilannya tinggi."
   - BENAR: "Ia adalah sosok yang berpegang teguh pada prinsip moral dan selalu memastikan setiap keputusannya tidak memihak."
4. HINDARI KESAN TES ALAT UKUR: Tuliskan seakan-akan Anda adalah psikolog yang baru saja mengobservasi klien ini selama 1 tahun penuh, BUKAN sedang membaca hasil tes.
5. REALISTIS & KLINIS: Hindari kata mutlak (selalu/tidak pernah). Gunakan "cenderung", "memiliki kecenderungan", "tampak", atau "biasanya".
6. ANALISIS FRIKSI INTERNAL: Jika ada perbedaan tajam antara perilaku publik (Mask) dan karakter asli (Core), jadikan ini sebagai sumber kelelahan emosional atau "Faktor Penghambat".
7. PANJANG NARASI: Bagian \`deskripsi_kepribadian_terintegrasi\` HARUS berupa narasi mengalir (bukan poin-poin/bullet), detail, utuh, minimum berisi 3 paragraf komprehensif, menghubungkan karakternya dengan tuntutan pekerjaannya.
8. PERSPEKTIF HR: Fokuslah pada potensi dan kapabilitas sesuai jabatannya, bukan hanya deskripsi statis.

### OUTPUT JSON (Strict Format):
{
  "arketipe_personal": "Julukan unik 2-4 kata yang mencerminkan esensi kepribadian & peran alaminya",
  "deskripsi_kepribadian_terintegrasi": "Narasi utuh 3 paragraf menggabungkan DISC, HEXACO, jabatan/pekerjaan. Elaborasi dinamika perilaku.",
  "kekuatan_utama": [
    "Kekuatan 1: (Penjelasan singkat 1 kalimat terkait kombinasi karakter & perilakunya)",
    "Kekuatan 2: (Penjelasan)",
    "Kekuatan 3: (Penjelasan)"
  ],
  "tantangan_dan_faktor_penghambat": {
    "komunikasi_dan_pola_kerja": "Analisis gaya komunikasi yang mungkin menimbulkan friksi dengan orang lain, atau kebiasaan kerja yang menahan efisiensinya.",
    "hambatan_karakter_internal": "Faktor dari dalam diri yang menghalangi potensi terbaiknya saat ini (misal benturan tuntutan lingkungan vs karakter asli)."
  },
  "analisis_lingkungan_ideal": {
    "ekosistem_kerja": "Tipe budaya organisasi atau tim yang paling optimal bagi individu ini.",
    "kebutuhan_motivasi": "Apa yang menjadi 'bahan bakar' psikologis utamanya agar ia merasa berdaya."
  },
  "peran_potensial_dalam_tim": [
    {
      "peran": "Nama peran fungsional (contoh: The Strategic Anchor, The Catalyst, The Stabilizer)",
      "alasan": "Mengapa ia sangat cocok di peran ini berdasarkan kekuatan intinya."
    }
  ],
  "saran_pengembangan_spesifik": [
    "Langkah taktis dan konkret 1 untuk mengatasi faktor penghambat atau mematangkan karakternya.",
    "Langkah taktis 2...",
    "Langkah taktis 3..."
  ],
  "rekap_singkat": {
    "kekuatan": "Ringkasan 1 kalimat/peluru tentang kekuatan kuncinya.",
    "tantangan": "Ringkasan 1 kalimat tentang masalah utamanya.",
    "saran": "Ringkasan 1 kalimat taktis sarannya.",
    "peran": "Ringkasan 1 kalimat peran idealnya."
  }
}`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    let cleanText = '';

    if (zaiKey) {
      console.log("[AI] Attempting Z.AI (Claude Sonnet) enhancement...");
      const zaiUrl = 'https://api.z.ai/api/anthropic/v1/messages';
      
      const response = await fetch(zaiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${zaiKey}`,
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01'
        },
        signal: controller.signal,
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 2000,
          system: "Output JSON murni tanpa markdown.",
          messages: [{ role: 'user', content: prompt }]
        })
      });

      clearTimeout(timeout);
      if (!response.ok) throw new Error(`Z.AI Error ${response.status}`);
      
      const data = await response.json();
      const text = data.content?.[0]?.text || '';
      cleanText = text.replace(/```json/gi, '').replace(/```/g, '').trim();

    } else {
      console.log("[AI] Attempting Gemini enhancement...");
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`;
      
      const response = await fetch(geminiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 2000, responseMimeType: "application/json" },
          systemInstruction: { parts: [{ text: "Output JSON murni tanpa markdown." }] }
        })
      });

      clearTimeout(timeout);
      if (!response.ok) throw new Error(`Gemini Error ${response.status}`);
      
      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      cleanText = text.replace(/```json/gi, '').replace(/```/g, '').trim();
    }

    const aiResult = JSON.parse(cleanText);
    console.log("[AI] API enhancement succeeded.");
    
    // Normalize: ensure peta_potensi_peran exists (some prompts return peran_potensial_dalam_tim)
    if (!aiResult.peta_potensi_peran && aiResult.peran_potensial_dalam_tim) {
      aiResult.peta_potensi_peran = aiResult.peran_potensial_dalam_tim.map(r => ({
        tipe_arketipe: r.peran || r.tipe_arketipe,
        alasan: r.alasan,
      }));
    }

    // Merge: AI output + local analysis data + legacy PDF fields
    return {
      ...aiResult,
      discAnalysis: localLegacy.discAnalysis,
      hexacoAnalysis: localLegacy.hexacoAnalysis,
      gayaKerja: localLegacy.gayaKerja,
      karakterInti: localLegacy.karakterInti,
      rekomendasi1: localLegacy.rekomendasi1,
      rekomendasi2: localLegacy.rekomendasi2,
      rekomendasi3: localLegacy.rekomendasi3,
      _source: 'z.ai',
    };
  } catch (err) {
    console.warn("[AI] API failed, using local AI engine:", err.message);
    // Fallback: local AI insight (same Claude schema) + legacy PDF fields
    return {
      ...localInsight,
      gayaKerja: localLegacy.gayaKerja,
      karakterInti: localLegacy.karakterInti,
      rekomendasi1: localLegacy.rekomendasi1,
      rekomendasi2: localLegacy.rekomendasi2,
      rekomendasi3: localLegacy.rekomendasi3,
    };
  }
}
