import { calculateDiscScores, calculateHexacoScores } from './scoring';

/**
 * Builds the AI prompt tailored for the AaaS Platform based on the package type.
 * @param {Object} finalReport - The populated FinalReport from the DB containing ModuleResults
 * @param {String} packageType - 'BASIC', 'REGULER', or 'PREMIUM'
 * @returns {String} The configured system prompt for the Generative Model 
 */
export function buildAaasPrompt(finalReport, packageType) {
  const { session } = finalReport;
  const participantName = session?.participantName || 'Klien';
  const intent = session?.package?.intent || 'UMUM';
  
  let participantContext = `- Usia: ${session?.participantAge || 'N/A'}\n- Jalur Asesmen (Konteks): ${intent}`; 
  if (session?.participantMetadata) {
    const meta = session.participantMetadata;
    const infoStrs = [];
    if (meta.instansi || meta.asalSekolah) infoStrs.push(`Instansi/Sekolah: ${meta.instansi || meta.asalSekolah}`);
    if (meta.pendidikan) infoStrs.push(`Pendidikan: ${meta.pendidikan}`);
    if (meta.pengalamanKerja) infoStrs.push(`Pengalaman: ${meta.pengalamanKerja}`);
    if (meta.posisiDilamar) infoStrs.push(`Posisi Dilamar: ${meta.posisiDilamar}`);
    if (meta.citaCita) infoStrs.push(`Cita-cita: ${meta.citaCita}`);
    
    if (infoStrs.length > 0) {
      participantContext += `\n- Latar Belakang Klien: ${infoStrs.join(' | ')}`;
    }
  }

  // 1. Extract Raw JSON scores from ModuleResults
  let discRaw = null;
  let hexacoRaw = null;
  let essayRaw = null;

  finalReport.moduleResults.forEach((mr) => {
    const modType = mr.module.type || '';
    const modName = mr.module.name.toUpperCase();
    
    if (modName.includes('DISC') || modType === 'PERSONALITY_DISC') discRaw = mr.rawScore;
    if (modName.includes('HEXACO') || modType === 'PERSONALITY_HEXACO') hexacoRaw = mr.rawScore;
    if (modName.includes('WAWANCARA') || modType === 'CUSTOM_ESSAY' || modName.includes('ESAI')) essayRaw = mr.rawScore;
  });

  // 2. Compute the psychometric scales using our local standardized engine
  const disc = calculateDiscScores(discRaw || {});
  const hex = calculateHexacoScores(hexacoRaw || {});

  // 3. Format Data Strings for Prompt Info
  const discStr = `
1. DISC (Gaya Kerja Permukaan):
   Pola Utama (Pattern): ${disc?.pattern || '-'}
   Grafik Publik: D=${disc?.discMost?.D||0} I=${disc?.discMost?.I||0} S=${disc?.discMost?.S||0} C=${disc?.discMost?.C||0}
   Grafik Pribadi: D=${disc?.discLeast?.D||0} I=${disc?.discLeast?.I||0} S=${disc?.discLeast?.S||0} C=${disc?.discLeast?.C||0}
   Grafik Aktual: D=${disc?.discComposite?.D||0} I=${disc?.discComposite?.I||0} S=${disc?.discComposite?.S||0} C=${disc?.discComposite?.C||0}`;

  const getMean = (factor) => hex?.factorMeans?.[factor] || 0;
  const hexacoStr = hexacoRaw ? `
2. HEXACO (Akar Karakter Terdalam - Skala 1.0-5.0):
   H (Kejujuran/Kerendahan Hati): ${getMean('H')}
   E (Emosionalitas): ${getMean('E')}
   X (Ekstraversi): ${getMean('X')}
   A (Keramahan): ${getMean('A')}
   C (Kesungguhan/Kehati-hatian): ${getMean('C')}
   O (Keterbukaan pada Pengalaman): ${getMean('O')}` : '';

  let essayStr = '';
  if (essayRaw && Array.isArray(essayRaw)) {
    essayStr = `\n3. WAWANCARA ESAI (Pernyataan Klien Secara Mandiri):\n`;
    essayRaw.forEach((q, idx) => {
      essayStr += `   Tanya ${idx+1}: ${q.questionText}\n   Jawab ${idx+1}: "${q.answerText}"\n\n`;
    });
    essayStr += `\n*PENTING: Gunakan kutipan wawancara di atas untuk memvalidasi/memberi contoh nyata pada karakter yang Anda deskripsikan di narasi JSON. Jika klien mengklaim hal yang bertentangan dengan skor DISC/HEXACO, sebutkan inkonsistensi tersebut!*\n`;
  }

  // 4. Construct Output Schema Requirement
  let outputSchema = '';
  let personaInstruction = '';

  if (packageType === 'PREMIUM') {
    personaInstruction = `Anda adalah Psikolog Klinis Senior, Konsultan Executive HR, dan Terapis berpengalaman 25+ tahun.
Tugas Anda adalah membedah karakter klien bernama ${participantName} secara komprehensif, mendalam, manusiawi, dan holistik. JANGAN hanya memuji, tapi berikan peringatan teguran yang konstruktif untuk titik buta (blind spots) mereka.`;
    outputSchema = `
{
  "arketipe_personal": "Julukan spesifik eksklusif (2-4 kata)",
  "deskripsi_kepribadian_terintegrasi": "3-4 paragraf narasi analitis dan tajam mengenai sisi terang dan sisi gelap perilaku",
  "kekuatan_utama": ["Kekuatan A (1 kalimat penjelasan)", "Kekuatan B", "Kekuatan C"],
  "tantangan_dan_faktor_penghambat": {
    "komunikasi_dan_pola_kerja": "Analisis jujur tentang sikap buruk/hambatan di tempat kerja",
    "hambatan_karakter_internal": "Analisis titik buta / luka emosional / akar kelemahan"
  },
  "analisis_lingkungan_ideal": {
    "ekosistem_kerja": "Budaya kerja yang paling memaksimalkan potensi",
    "kebutuhan_motivasi": "Sumbunya: Apa yang membuat dia bergerak bangkit?"
  },
  "peran_potensial_dalam_tim": [{"peran": "Nama Peran", "alasan": "Kesesuaian profil"}],
  "saran_pengembangan_spesifik": ["Langkah 1", "Langkah 2", "Langkah 3"]
}`;
  } else if (packageType === 'REGULER') {
    personaInstruction = `Anda adalah Konsultan Assessmen HR yang netral dan obyektif. Susun "Laporan Kepribadian" yang menggabungkan DISC dan HEXACO menjadi narasi karakter utuh.`;
    outputSchema = `
{
  "arketipe_personal": "Julukan spesifik (2-4 kata)",
  "deskripsi_kepribadian_terintegrasi": "3 paragraf narasi yang berfokus pada dinamika kerja",
  "kekuatan_utama": ["Kekuatan Kerja A", "Kekuatan Kerja B"],
  "tantangan_dan_faktor_penghambat": {
    "komunikasi_dan_pola_kerja": "Friksi kerja potensial",
    "hambatan_karakter_internal": "Kelemahan manajerial / staf"
  },
  "analisis_lingkungan_ideal": {
    "ekosistem_kerja": "Budaya kerja optimal",
    "kebutuhan_motivasi": "Kompensasi / Motivator pendorong"
  },
  "saran_pengembangan_spesifik": ["Saran 1", "Saran 2"]
}`;
  } else {
    // BASIC - Only DISC Processing usually requested by system
    personaInstruction = `Anda adalah Konsultan HR Dasar. Buat interpretasi profil DISC untuk gaya kerja permukaan.`;
    outputSchema = `
{
  "analisis_gaya_kerja": "2-3 paragraf mengenai gaya komunikasi dan kerja saat ini"
}`;
  }

  // 5. Final Assembly
  const prompt = `
${personaInstruction}

### KONTEKS KLIEN:
Nama: ${participantName}
${participantContext}

### DATA PROFIL:
${discStr}
${hexacoStr}
${essayStr}

### ATURAN KETAT:
1. WAJIB menggunakan format JSON murni. TIDAK ADA teks tambahan di luar JSON.
2. Deskripsikan PERILAKU manusiawi berdasarkan skor tersebut.
3. JANGAN menyebutkan terminologi tes dalam narasi (misal jangan sebut "DISC", "HEXACO", "Dominance", "Honesty-Humility", "Skor tinggi"). Terjemahkan logika skor menjadi observasi naratif ("Klien ini tampak sangat berhati-hati...").
4. Kata Ganti Orang: Gunakan nama klien ("${participantName}") untuk membuat laporan lebih empati.
5. Bahasa: Bahasa Indonesia yang profesional dan berempati.

### MANDATORY JSON OUTPUT STRUCTURE:
${outputSchema}
`;

  return prompt;
}
