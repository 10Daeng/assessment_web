import { DISC_PATTERNS } from './interpretationDict';
import { analyzeDiscThreeGraphs } from './discAnalysis';
import { analyzeHexacoProfile } from './hexacoAnalysis';
import { getDiscPatternName } from '@/utils/scoring';

// =========================================
// LOCAL AI ENGINE - FULL INSIGHT GENERATOR
// =========================================
// Generates output IDENTICAL to Claude/z.ai schema, using 100% local dictionaries.
// Used as fallback when z.ai API is unavailable.

function getLevel(mean) {
  if (mean >= 4.2) return 'very_high';
  if (mean >= 3.5) return 'high';
  if (mean >= 2.8) return 'mid';
  if (mean >= 2.0) return 'low';
  return 'very_low';
}

// =========================================
// TEAM ROLE MAPPING (from DISC + HEXACO)
// =========================================
const TEAM_ROLES = {
  // DISC-based roles
  'DD': [{ tipe_arketipe: 'The Commander', alasan: 'Ketegasan dan orientasi hasil menjadikannya penggerak utama dalam tim yang membutuhkan keputusan cepat dan arah yang jelas.' }],
  'DI': [{ tipe_arketipe: 'The Catalyst', alasan: 'Kombinasi ketegasan dan kemampuan mempengaruhi menjadikannya motor penggerak perubahan yang mampu meyakinkan tim.' }, { tipe_arketipe: 'The Negotiator', alasan: 'Mampu menegosiasikan kesepakatan dengan percaya diri sambil menjaga hubungan baik.' }],
  'ID': [{ tipe_arketipe: 'The Catalyst', alasan: 'Kemampuan mempengaruhi yang kuat dikombinasi dengan ketegasan membuatnya efektif menggerakkan orang menuju tujuan.' }],
  'DS': [{ tipe_arketipe: 'The Strategic Anchor', alasan: 'Menggabungkan visi strategis dengan kemampuan eksekusi yang stabil dan konsisten.' }],
  'SD': [{ tipe_arketipe: 'The Strategic Anchor', alasan: 'Stabilitas natural dikombinasi dengan ketegasan menciptakan fondasi yang kuat bagi tim.' }],
  'DC': [{ tipe_arketipe: 'The Architect', alasan: 'Ketajaman analitis dan keberanian mengambil keputusan menjadikannya perancang solusi yang efektif.' }],
  'CD': [{ tipe_arketipe: 'The Architect', alasan: 'Kemampuan analisis mendalam dengan keberanian eksekusi menghasilkan solusi yang terstruktur dan inovatif.' }],
  'IS': [{ tipe_arketipe: 'The Harmonizer', alasan: 'Kemampuan interpersonal yang hangat dengan kesabaran menciptakan perekat sosial dalam tim.' }, { tipe_arketipe: 'The Mentor', alasan: 'Kombinasi empati dan kestabilan menjadikannya pembimbing yang ideal bagi anggota tim.' }],
  'SI': [{ tipe_arketipe: 'The Harmonizer', alasan: 'Kestabilan emosional dan kehangatan sosialnya menciptakan lingkungan yang aman bagi tim.' }],
  'IC': [{ tipe_arketipe: 'The Persuader', alasan: 'Kemampuan komunikasi yang kuat dengan perhatian pada detail membuatnya mampu meyakinkan melalui argumen yang solid.' }],
  'CI': [{ tipe_arketipe: 'The Persuader', alasan: 'Ketelitian dalam menyiapkan argumen dikombinasi dengan kemampuan presentasi yang menarik.' }],
  'SC': [{ tipe_arketipe: 'The Specialist', alasan: 'Konsistensi dan ketelitian menjadikannya ahli yang bisa diandalkan dalam bidang spesifik.' }, { tipe_arketipe: 'The Quality Guardian', alasan: 'Kombinasi kestabilan dan ketelitian memastikan output berkualitas tinggi secara konsisten.' }],
  'CS': [{ tipe_arketipe: 'The Specialist', alasan: 'Ketelitian analitis dengan kestabilan menghasilkan spesialisasi mendalam yang konsisten.' }],
  'II': [{ tipe_arketipe: 'The Energizer', alasan: 'Energi sosial dan antusiasme yang meluap menjadikannya sumber inspirasi dan motivasi bagi seluruh tim.' }],
  'SS': [{ tipe_arketipe: 'The Stabilizer', alasan: 'Kesabaran dan loyalitas yang tinggi menjadikannya fondasi emosional yang tak tergoyahkan di dalam tim.' }],
  'CC': [{ tipe_arketipe: 'The Analyst', alasan: 'Ketelitian absolut dan pemikiran sistematis menjadikannya penjaga kualitas dan akurasi tertinggi dalam tim.' }],
};

// HEXACO-enhanced roles
function isHigh(level) { return level === 'high' || level === 'very_high'; }
function isLow(level) { return level === 'low' || level === 'very_low'; }

function getHexacoRoles(factorMeans) {
  const fm = factorMeans || {};
  const roles = [];

  if (isHigh(getLevel(fm.H)) && isHigh(getLevel(fm.C))) {
    roles.push({ tipe_arketipe: 'The Integrity Keeper', alasan: 'Kejujuran dan kedisiplinan tinggi menjadikannya penjaga standar etika dan kualitas organisasi.' });
  }
  if (isHigh(getLevel(fm.X)) && isHigh(getLevel(fm.A))) {
    roles.push({ tipe_arketipe: 'The Social Glue', alasan: 'Energi sosial dikombinasi dengan keramahan membuatnya menjadi perekat yang menyatukan berbagai pihak.' });
  }
  if (isLow(getLevel(fm.E)) && isHigh(getLevel(fm.C))) {
    roles.push({ tipe_arketipe: 'The Crisis Handler', alasan: 'Ketangguhan emosional dan kedisiplinan membuatnya mampu mengelola situasi darurat dengan tenang dan terstruktur.' });
  }
  if (isHigh(getLevel(fm.O)) && isHigh(getLevel(fm.C))) {
    roles.push({ tipe_arketipe: 'The Innovation Architect', alasan: 'Kreativitas tinggi yang dilandasi disiplin kuat membuatnya mampu menghasilkan inovasi yang tereksekusi dengan baik.' });
  }
  if (isHigh(getLevel(fm.A)) && isHigh(getLevel(fm.E))) {
    roles.push({ tipe_arketipe: 'The Wellbeing Champion', alasan: 'Sensitivitas emosional dan keramahan menjadikannya advokat alami bagi kesejahteraan tim.' });
  }
  if (isHigh(getLevel(fm.H)) && isLow(getLevel(fm.A))) {
    roles.push({ tipe_arketipe: 'The Truth Advocate', alasan: 'Kejujuran dikombinasi ketegasan membuatnya efektif sebagai pembawa kabar yang sulit namun perlu didengar.' });
  }

  return roles;
}

// =========================================
// MASTER: Generate Local AI Insight
// =========================================
// Output schema IDENTICAL to Claude/z.ai
export function generateLocalAiInsight(discPattern, factorMeans, facetMeans, discScores, userData = {}) {
  const fm = factorMeans || {};
  const fac = facetMeans || {};

  // === 1. DISC Pattern Analysis ===
  let patternKey = 'SC';
  if (discPattern) {
    const parts = discPattern.includes('-') ? discPattern.split('-') : [discPattern[0], discPattern[1]];
    patternKey = (parts[0] || 'S') + (parts[1] || 'C');
  }
  const disc = DISC_PATTERNS[patternKey] || DISC_PATTERNS['SC'];

  // === 2. DISC 3-Graph Analysis ===
  let discAnalysisResult = null;
  if (discScores?.discMost && discScores?.discLeast && discScores?.discComposite) {
    discAnalysisResult = analyzeDiscThreeGraphs(
      discScores.discMost, discScores.discLeast, discScores.discComposite
    );
  }

  // === 3. HEXACO Deep Analysis ===
  const hexAnalysis = analyzeHexacoProfile(fm, fac);

  // === 4. BUILD ARKETIPE ===
  let arketipe = 'Profesional Adaptif';
  if (hexAnalysis.archetype) {
    // Extract name from archetype string like "Penjaga Integritas (The Guardian). ..."
    const match = hexAnalysis.archetype.match(/^([^(]+)\(/);
    arketipe = match ? match[1].trim() : hexAnalysis.archetype.split('.')[0].trim();
  }

  // Enhance with DISC pattern name
  const discName = getDiscPatternName(discPattern);
  if (discName && discName !== 'Unknown') {
    arketipe = `${arketipe} — ${discName}`;
  }

  // === 5. BUILD DESKRIPSI KEPRIBADIAN TERINTEGRASI ===
  let deskripsi = '';

  // First paragraph: DISC personality (paragraph 1 only) + context
  const discFirstPara = disc.gayaKerja.split('\n\n')[0];

  // Add demographic context (organization, job, position)
  const demographicContext = [];
  if (userData?.instansi) demographicContext.push(`di ${userData.instansi}`);
  if (userData?.pekerjaan) demographicContext.push(`sebagai ${userData.pekerjaan}`);
  if (userData?.jabatan) demographicContext.push(`dalam posisi ${userData.jabatan}`);

  deskripsi += discFirstPara;
  if (demographicContext.length > 0) {
    deskripsi += ' Dalam peran ' + demographicContext.join(' ') + ', ';
  } else {
    deskripsi += ' Dalam konteks kerjanya, ';
  }

  // Second paragraph: HEXACO analysis tailored to role
  if (hexAnalysis.dimensiOverview) {
    const hexacoFirstPara = hexAnalysis.dimensiOverview.split('\n\n')[0];
    deskripsi += hexacoFirstPara;
  }

  // === 6. BUILD KEKUATAN UTAMA ===
  const kekuatan_utama = [];

  // From HEXACO analysis
  if (hexAnalysis.kelebihan) {
    kekuatan_utama.push(...hexAnalysis.kelebihan.slice(0, 2));
  }

  // From DISC analysis
  if (discAnalysisResult?.kelebihanDari3Grafik) {
    kekuatan_utama.push(...discAnalysisResult.kelebihanDari3Grafik.slice(0, 1));
  }

  // Ensure at least 3
  if (kekuatan_utama.length < 3) {
    if (disc.gayaKerja.includes('memimpin')) kekuatan_utama.push('Kemampuan leadership alami yang terpancar dari gaya komunikasi dan pengambilan keputusannya.');
    if (disc.gayaKerja.includes('empati')) kekuatan_utama.push('Kepekaan sosial yang mendalam membuatnya mampu memahami dinamika interpersonal dengan baik.');
    if (disc.gayaKerja.includes('detail')) kekuatan_utama.push('Perhatian terhadap detail dan kualitas yang menjamin konsistensi output kerja.');
    if (disc.gayaKerja.includes('stabil')) kekuatan_utama.push('Konsistensi dan keandalan yang menjadikannya fondasi stabilitas dalam tim.');
  }

  // === 7. BUILD TANTANGAN & FAKTOR PENGHAMBAT ===
  let komunikasi_dan_pola_kerja = '';
  let hambatan_karakter_internal = '';

  if (hexAnalysis.tantangan.length > 0) {
    komunikasi_dan_pola_kerja = hexAnalysis.tantangan[0];
  }
  if (hexAnalysis.tantangan.length > 1) {
    hambatan_karakter_internal = hexAnalysis.tantangan[1];
  } else if (discAnalysisResult?.tantanganDari3Grafik?.length > 0) {
    hambatan_karakter_internal = discAnalysisResult.tantanganDari3Grafik[0];
  }

  // Fallback
  if (!komunikasi_dan_pola_kerja) {
    komunikasi_dan_pola_kerja = 'Perlu memastikan gaya komunikasinya dapat diterima oleh beragam tipe kepribadian dalam tim.';
  }
  if (!hambatan_karakter_internal) {
    hambatan_karakter_internal = 'Perlu menjaga keseimbangan antara tuntutan lingkungan dan karakter aslinya agar tidak menimbulkan tekanan internal berkepanjangan.';
  }

  // === 8. BUILD SARAN PENGEMBANGAN ===
  const saran = [];
  if (discAnalysisResult?.pengembangan) {
    saran.push(discAnalysisResult.pengembangan);
  }
  // Add from cross dynamics
  if (hexAnalysis.crossInsights.length > 1) {
    const insight = hexAnalysis.crossInsights[1];
    if (insight.length < 200) {
      saran.push(`Memanfaatkan dinamika unik karakternya: ${insight.toLowerCase()}`);
    }
  }
  // from tantangan → saran
  for (const t of hexAnalysis.tantangan) {
    if (t.startsWith('Perlu ')) {
      saran.push(t);
    }
  }
  // Ensure at least 3
  while (saran.length < 3) {
    const genericSaran = [
      'Melatih kemampuan adaptasi gaya komunikasi sesuai konteks dan audiens yang berbeda.',
      'Mengembangkan kesadaran diri (self-awareness) untuk mengenali kapan karakter asli perlu muncul vs kapan adaptasi dibutuhkan.',
      'Membangun rutinitas refleksi mingguan untuk mengevaluasi interaksi tim dan mengidentifikasi area peningkatan.',
    ];
    saran.push(genericSaran[saran.length] || genericSaran[0]);
  }

  // === 9. BUILD PERAN POTENSIAL ===
  const rolesByDisc = TEAM_ROLES[patternKey] || TEAM_ROLES['SC'];
  const rolesByHexaco = getHexacoRoles(fm);
  const allRoles = [...rolesByDisc];

  // Add HEXACO roles if not duplicate
  for (const r of rolesByHexaco) {
    if (!allRoles.find(ar => ar.tipe_arketipe === r.tipe_arketipe)) {
      allRoles.push(r);
    }
  }

  // === 10. BUILD ANALISIS LINGKUNGAN IDEAL ===
  let ekosistem_kerja = '';
  let kebutuhan_motivasi = '';

  const sorted = hexAnalysis.sortedFactors || [];
  const top1 = sorted[0]?.factor;
  const top2 = sorted[1]?.factor;

  const ecoMap = {
    H: 'organisasi yang menjunjung tinggi transparansi, etika, dan kejujuran',
    E: 'lingkungan kerja yang suportif secara emosional dengan relasi interpersonal yang kuat',
    X: 'budaya kerja yang dinamis, kolaboratif, dan penuh interaksi sosial',
    A: 'tim yang harmonis dengan komunikasi terbuka dan minim konflik',
    C: 'organisasi dengan sistem, prosedur, dan target yang jelas dan terukur',
    O: 'lingkungan yang menghargai inovasi, eksperimen, dan cara-cara baru',
  };

  const motivMap = {
    H: 'merasa bahwa pekerjaannya berdampak positif dan bermoral',
    E: 'mendapatkan dukungan emosional dan merasa dihargai secara personal',
    X: 'berinteraksi dengan banyak orang dan mendapatkan pengakuan sosial',
    A: 'berada di lingkungan yang damai dan saling menghormati',
    C: 'memiliki target yang jelas dan mendapatkan kepuasan dari pencapaian',
    O: 'mendapatkan kebebasan bereksperimen dan mengeksplorasi ide-ide baru',
  };

  ekosistem_kerja = `Individu ini akan berkembang optimal di ${ecoMap[top1] || 'lingkungan profesional yang mendukung'}. Ia juga membutuhkan ${ecoMap[top2] || 'sistem kerja yang terstruktur'}.`;
  kebutuhan_motivasi = `Bahan bakar psikologis utamanya adalah ${motivMap[top1] || 'pencapaian'}. Ia juga termotivasi ketika ${motivMap[top2] || 'mendapat dukungan dari tim'}.`;

  // === BUILD RINGKASAN KEPRIBADIAN (3-5 poin pendek dengan variasi) ===
  const ringkasan_poin = [];

  // Gunakan variasi struktur kalimat berdasarkan DISC pattern
  const patternVariants = {
    'D': [
      '• Menonjol ketegasan dan orientasi hasil',
      '• Pemimpin dengan kecenderungan mengambil keputusan cepat',
      '• Tipe orang yang langsung pada tujuan dan target',
    ],
    'I': [
      '• Memiliki kemampuan mempengaruhi dan meyakinkan orang lain',
      '• Ekstrovert dengan energi sosial yang kuat',
      '• Komunikatif dan pandai membangun hubungan',
    ],
    'S': [
      '• Dikenal stabil, sabar, dan dapat diandalkan',
      '• Pendukung tim yang menjamin keharmonisan',
      '• Cenderung menghindari konflik dan menjaga stabilitas',
    ],
    'C': [
      '• Analitis dengan perhatian tinggi terhadap detail',
      '• Terstruktur dan sistematis dalam bekerja',
      '• Berhati-hati pada kualitas dan akurasi hasil',
    ],
    'default': [
      '• Gaya kerja yang adaptif dan fleksibel',
      '• Mampu menyesuaikan diri dengan berbagai situasi',
      '• Pendekat yang seimbang dalam interaksi',
    ],
  };

  // Ambil 1-2 poin dari variasi DISC
  const discVariant = patternVariants[patternKey] || patternVariants['default'];
  const randomIndices = [0, 1, 2].sort(() => Math.random() - 0.5).slice(0, 2);
  ringkasan_poin.push(...randomIndices.map(i => discVariant[i] || discVariant[0]));

  // Poin tambahan dari HEXACO dengan variasi struktur
  const hexacoStrengths = [];
  if (fm.C >= 3.5) hexacoStrengths.push('Terdisiplin tinggi');
  if (fm.X >= 3.5) hexacoStrengths.push('Energi sosial yang melimpah');
  if (fm.H >= 3.5) hexacoStrengths.push('Jujur dan memiliki integritas');
  if (fm.A >= 3.5) hexacoStrengths.push('Patien dan kooperatif');
  if (fm.O >= 3.5) hexacoStrengths.push('Kreatif dan inovatif');
  if (fm.C >= 3.5 && fm.X >= 2.5) hexacoStrengths.push('Bekerja dengan semangat tim');

  // Variasi struktur untuk HEXACO
  const hexacoVariants = [
    hexacoStrengths.map(s => `• ${s}`),
    hexacoStrengths.map(s => `• Menunjukkan ${s.toLowerCase()}`),
  ];
  const hexacoVariant = hexacoVariants[Math.floor(Math.random() * hexacoVariants.length)];
  ringkasan_poin.push(...hexacoVariant.slice(0, 1));

  // Poin tantangan dengan variasi
  const challengeVariants = [
    '• Perlu berhati pada gaya komunikasi yang lebih fleksibel',
    '• Kadang terlalu fokus pada detail sehingga melihat gambaran luas',
    '• Perlu belajar menyeimbangkan kebutuhan pribadi dan tim',
    '• Cenderung mengambil keputusan terlalu cepat',
    '• Perlu mengelola emosi dalam situasi tertekan',
  ];

  // Pilih tantangan berdasarkan skor HEXACO rendah
  if (fm.E <= 2.5) {
    ringkasan_poin.push('• Perlu dukungan emosional dalam situasi tekan');
  } else if (fm.A <= 2.5) {
    ringkasan_poin.push('• Perlu menumbuhkan empati dan fleksibilitas');
  } else if (fm.O <= 2.5) {
    ringkasan_poin.push('• Perlu lebih terbuka terhadap ide dan cara kerja baru');
  } else {
    // Random dari variants
    ringkasan_poin.push(challengeVariants[Math.floor(Math.random() * challengeVariants.length)]);
  }

  // Batasi 3-5 poin
  const ringkasan_kepribadian = ringkasan_poin.slice(0, 5).join(' ');

  // === RETURN: Same schema as Claude/z.ai ===
  return {
    arketipe_personal: arketipe,
    deskripsi_kepribadian_terintegrasi: deskripsi.trim(),
    ringkasan_kepribadian: ringkasan_kepribadian,
    kekuatan_utama: kekuatan_utama.slice(0, 4),
    tantangan_dan_faktor_penghambat: {
      komunikasi_dan_pola_kerja,
      hambatan_karakter_internal,
    },
    analisis_lingkungan_ideal: {
      ekosistem_kerja,
      kebutuhan_motivasi,
    },
    peran_potensial_dalam_tim: allRoles.slice(0, 4),
    // Map to alternate key used by some pages
    peta_potensi_peran: allRoles.slice(0, 4).map(r => ({
      tipe_arketipe: r.tipe_arketipe,
      alasan: r.alasan,
    })),
    saran_pengembangan_spesifik: saran.slice(0, 4),
    // Keep local analysis data for PDF
    discAnalysis: discAnalysisResult || null,
    hexacoAnalysis: hexAnalysis,
    _source: 'local_engine',
  };
}
