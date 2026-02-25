/**
 * Engine Analisis HEXACO Komprehensif
 * 
 * Menganalisis:
 * - Pola intra-dimensi (konsistensi facet dalam satu dimensi)
 * - Facet yang menonjol (outlier) dan artinya
 * - Dinamika antar-dimensi (kombinasi unik)
 * - Arketipe karakter dari profil keseluruhan
 * - Kelebihan karakter, tantangan, dan arah pengembangan
 */

// =========================================
// FACET → DIMENSION MAPPING
// =========================================
const FACET_MAP = {
  H: { name: 'Kejujuran-Kerendahhatian', facets: ['sinc', 'fair', 'gree', 'mode'] },
  E: { name: 'Emosionalitas', facets: ['fear', 'anxi', 'depe', 'sent'] },
  X: { name: 'Ekstraversi', facets: ['sses', 'socb', 'soci', 'live'] },
  A: { name: 'Keramahan', facets: ['forg', 'gent', 'flex', 'pati'] },
  C: { name: 'Kehati-hatian', facets: ['orga', 'dili', 'perf', 'prud'] },
  O: { name: 'Keterbukaan', facets: ['aesa', 'inqu', 'crea', 'unco'] },
};

const FACET_NAMES = {
  sinc: 'Ketulusan', fair: 'Keadilan', gree: 'Penghindaran Keserakahan', mode: 'Kerendahhatian',
  fear: 'Kecemasan Fisik', anxi: 'Kecemasan Psikologis', depe: 'Ketergantungan Emosional', sent: 'Sentimentalitas',
  sses: 'Harga Diri Sosial', socb: 'Keberanian Sosial', soci: 'Kebutuhan Sosial', live: 'Vitalitas',
  forg: 'Kemampuan Memaafkan', gent: 'Kelembutan', flex: 'Fleksibilitas', pati: 'Kesabaran',
  orga: 'Organisasi', dili: 'Ketekunan', perf: 'Perfeksionisme', prud: 'Kebijaksanaan',
  aesa: 'Apresiasi Estetik', inqu: 'Rasa Ingin Tahu', crea: 'Kreativitas', unco: 'Ketidakkonvensionalan',
  altr: 'Altruisme',
};

// =========================================
// INTRA-DIMENSION PATTERNS
// When facets within a dimension show interesting patterns
// =========================================
const intraDimPatterns = {
  H: {
    'sinc-high_mode-low': 'Meskipun ia jujur dan tulus dalam berkomunikasi, ia tidak merasa perlu bersikap rendah hati — ia percaya diri dengan keistimewaan yang dimilikinya. Ini menciptakan sosok yang jujur namun asertif tentang nilai dirinya.',
    'fair-high_gree-low': 'Ia menjunjung keadilan dalam berurusan dengan orang lain, namun pada saat yang sama menghargai kemewahan dan status material. Ia bisa jadi adil dalam berbisnis tetapi ambisius dalam mengejar kesuksesan material.',
    'sinc-low_fair-high': 'Ia menjaga keadilan dalam hal-hal formal dan transaksional, namun dalam hubungan interpersonal ia cenderung lebih strategis dan tidak selalu menunjukkan perasaan aslinya.',
    'mode-high_gree-high': 'Ia sangat sederhana dan rendah hati — tidak tertarik pada pamer kekayaan maupun status. Ia hidup dengan prinsip kesederhanaan yang tulus.',
  },
  E: {
    'fear-high_depe-low': 'Menariknya, meskipun ia mudah cemas terhadap bahaya fisik, ia justru mandiri secara emosional. Ia khawatir tentang keselamatan tetapi tidak bergantung pada orang lain untuk dukungan emosional.',
    'anxi-high_sent-low': 'Ia mudah cemas tentang berbagai hal, namun kecemasan ini bersifat kognitif — ia tidak terlalu sentimentil atau terpengaruh emosi orang lain. Kecemasannya lebih bersifat pikiran berputar daripada perasaan mendalam.',
    'sent-high_fear-low': 'Ia memiliki kedalaman emosional yang kuat dalam hubungan interpersonal namun berani menghadapi situasi berbahaya. Ia peka terhadap perasaan orang lain tetapi tangguh secara fisik.',
    'depe-high_anxi-high': 'Ia memiliki kebutuhan emosional yang sangat kuat — mudah cemas dan sangat bergantung pada dukungan orang terdekat. Dalam situasi stres, ia sangat membutuhkan kehadiran orang yang dipercaya.',
  },
  X: {
    'sses-high_socb-low': 'Ia memiliki pandangan positif tentang dirinya sendiri, namun tidak nyaman menjadi pusat perhatian. Ia percaya diri secara internal tetapi tidak suka tampil di depan umum.',
    'socb-high_soci-low': 'Ia berani bicara di depan khalayak dan memimpin diskusi, namun tidak terlalu mencari kegiatan sosial di waktu senggang. Ia mampu bersosialisasi profesional namun menikmati kesendirian.',
    'live-high_soci-low': 'Ia penuh energi dan antusiasme dalam aktivitasnya, namun lebih memilih menyalurkannya dalam kelompok kecil atau kegiatan yang bermakna daripada pesta dan keramaian.',
    'sses-low_socb-high': 'Meskipun ia kurang percaya diri secara internal, ia justru mampu tampil berani di depan publik. Ini bisa mengindikasikan pola "fake it till you make it" yang ia gunakan sebagai mekanisme coping.',
  },
  A: {
    'forg-high_gent-low': 'Ia mudah memaafkan kesalahan orang lain, namun tidak segan memberikan kritik tajam. Ia bisa melupakan kesalahan masa lalu tetapi tetap tegas menyuarakan standar yang ia harapkan.',
    'pati-high_flex-low': 'Ia sangat sabar menghadapi provokasi, namun teguh pada pendiriannya. Ia tidak mudah marah tetapi juga tidak mudah diubah pikirannya — kombinasi yang menciptakan negosiator yang tangguh.',
    'forg-low_pati-low': 'Ia cenderung pendendam dan mudah frustrasi. Ketika merasa diperlakukan tidak adil, ia tidak mudah memaafkan dan emosinya bisa meledak. Ini memerlukan pengelolaan emosi yang sadar.',
    'flex-high_gent-high': 'Ia sangat akomodatif dan lembut — selalu berusaha menyesuaikan diri dengan keinginan orang lain dan menghindari kritik. Meskipun ini membuat ia disukai, terkadang ia perlu lebih tegas.',
  },
  C: {
    'dili-high_orga-low': 'Ia pekerja keras dan tekun namun tidak terlalu peduli kerapian. Ia bisa menghasilkan output yang luar biasa meskipun meja kerjanya berantakan — produktivitas tanpa formalitas.',
    'perf-high_prud-low': 'Ia sangat teliti dan memperhatikan detail, namun impulsif dalam mengambil keputusan. Ia mengejar kesempurnaan dalam eksekusi tetapi kurang memikirkan konsekuensi jangka panjang.',
    'orga-high_dili-low': 'Ia sangat teratur dan rapi secara sistem, namun tidak terlalu ambisius dalam mendorong dirinya melampaui ekspektasi. Ia efisien dalam mengelola tugas namun tidak terdorong untuk lembur.',
    'prud-high_perf-low': 'Ia bijaksana dan berhati-hati dalam mengambil keputusan, namun tidak perfeksionis. Ia memikirkan konsekuensi dengan matang tanpa terjebak dalam detail yang berlebihan.',
  },
  O: {
    'crea-high_unco-low': 'Ia kreatif dan imajinatif namun tetap dalam batas norma sosial. Kreativitasnya terarah dan dapat diterima oleh lingkungan — inovator yang pragmatis.',
    'aesa-high_inqu-low': 'Ia menghargai keindahan dan estetika namun kurang tertarik mendalami pengetahuan abstrak. Ia lebih merespons keindahan visual dan artistik daripada konsep intelektual.',
    'unco-high_crea-low': 'Ia berpikir di luar norma dan menantang konvensi, namun tidak selalu menghasilkan solusi kreatif. Ia lebih sebagai kritikus sistem daripada inovator.',
    'inqu-high_aesa-low': 'Ia haus akan pengetahuan dan eksplorasi intelektual, namun kurang sensitif terhadap keindahan artistik. Rasa ingin tahunya berorientasi akademis dan ilmiah.',
  },
};

// =========================================
// CROSS-DIMENSION DYNAMICS (Extended)
// =========================================
const crossDimDynamics = {
  // H interactions
  'H-high_X-high': 'Kombinasi kejujuran tinggi dengan ekstraversi menghasilkan sosok yang terbuka dan apa adanya — ia berbagi pemikirannya dengan bebas dan tulus, membuat orang lain mudah percaya kepadanya.',
  'H-high_A-low': 'Meskipun sangat jujur, ia tidak segan bersikap kritis dan tegas. Ini menciptakan sosok penegak kebenaran yang berani — ia menyampaikan fakta tanpa peduli apakah itu menyenangkan atau tidak.',
  'H-high_A-high': 'Kejujuran yang dibalut dengan keramahan menciptakan sosok yang dipercaya dan disukai. Ia tulus sekaligus lembut — mampu menyampaikan kebenaran tanpa menyakiti.',
  'H-low_X-high': 'Kecerdasan sosialnya yang tinggi dikombinasikan dengan ambisi material menciptakan networker ulung yang terampil membangun hubungan untuk tujuan strategis.',
  'H-low_C-high': 'Ia strategis dan ambisius namun sangat terorganisir — mampu merencanakan langkah-langkah menuju kesuksesan dengan presisi tinggi.',

  // E interactions
  'E-high_A-high': 'Kepekaan emosional tinggi dipadukan dengan keramahan menghasilkan empat yang mendalam — ia tidak hanya merasakan emosi orang lain, tapi juga meresponsnya dengan kehangatan.',
  'E-high_X-low': 'Ia merasakan emosi secara intens namun dalam diam. Ia adalah pengamat tajam yang memahami dinamika emosional di sekitarnya, meskipun jarang mengekspresikannya secara verbal.',
  'E-high_C-low': 'Sensitivitas emosional dikombinasikan dengan spontanitas dapat menciptakan reaksi yang tidak terduga. Ia mudah tersentuh dan bertindak berdasarkan perasaan sesaat.',
  'E-low_C-high': 'Stabilitas emosional dan disiplin tinggi menghasilkan eksekutor yang sangat efisien — ia mengerjakan tugas kompleks tanpa terpengaruh tekanan atau drama emosional.',
  'E-low_A-low': 'Keteguhan emosional dan ketegasan interpersonal menciptakan sosok yang pragmatis dan tangguh — ia mampu membuat keputusan sulit tanpa ragu.',

  // X interactions
  'X-high_A-low': 'Energi sosial yang dominan namun kritis menciptakan pemimpin percakapan yang menantang — ia memimpin dengan percaya diri dan tidak ragu mempertanyakan ide yang lemah.',
  'X-high_C-high': 'Kombinasi keterampilan sosial dan disiplin kerja menghasilkan profesional yang sangat efektif — mampu membangun relasi sekaligus mengeksekusi rencana dengan teratur.',
  'X-high_O-high': 'Ekstraversi dan keterbukaan yang tinggi menciptakan explorer sosial — ia menikmati bertemu orang baru, mendengar perspektif berbeda, dan berbagi ide-ide kreatif.',
  'X-low_C-high': 'Kecenderungan introspektif dan ketelitian tinggi menghasilkan spesialis yang fokus — mampu menghasilkan karya berkualitas dalam ketenangan.',
  'X-low_O-high': 'Meskipun introvert, ia memiliki dunia batin yang kaya. Waktu menyendiri digunakan untuk eksplorasi intelektual dan kreativitas yang mendalam.',

  // A interactions
  'A-high_C-low': 'Keramahan tinggi namun spontan — ia menyenangkan dan mudah diajak bergaul, tetapi terkadang kesulitan memenuhi komitmen karena mengutamakan hubungan daripada jadwal.',
  'A-low_C-high': 'Ketegasan dan disiplin menghasilkan pengelola yang efektif namun menuntut — ia menjalankan standar tinggi dengan konsisten dan tidak mudah berkompromi.',
  'A-high_O-high': 'Keramahan dan keterbukaan menciptakan sosok yang inklusif dan progresif — ia menerima perbedaan dengan tangan terbuka dan menikmati keragaman perspektif.',
  'A-low_O-low': 'Ketegasan dikombinasikan dengan orientasi tradisional menciptakan sosok konservatif yang tegas — ia mempertahankan nilai-nilai yang diyakini dengan kukuh.',

  // C interactions
  'C-high_O-high': 'Disiplin dan kreativitas menghasilkan inovator terstruktur — ia tidak hanya menghasilkan ide brilliant, tetapi juga mampu mengeksekusinya dengan terencana.',
  'C-high_O-low': 'Disiplin tinggi dengan orientasi praktis membuat ia sangat efisien dalam menjalankan prosedur dan mempertahankan kualitas — ia adalah "keeper of quality".',
  'C-low_O-high': 'Spontanitas dan kreativitas tinggi menghasilkan free spirit yang penuh ide — namun ia mungkin kesulitan mengeksekusi semua ide cemerlangnya menjadi kenyataan.',
};

// =========================================
// CHARACTER ARCHETYPES
// Based on dominant HEXACO profile
// =========================================
const archetypes = {
  'H-high_C-high': { name: 'Penjaga Integritas', desc: 'Sosok yang menggabungkan kejujuran dengan ketelitian — dapat dipercaya sepenuhnya untuk menjalankan tanggung jawab dengan akurat dan jujur.' },
  'H-high_E-high': { name: 'Empat Tulus', desc: 'Sosok yang jujur sekaligus sangat peka terhadap perasaan — ia menyampaikan kebenaran dengan sensitivitas dan kepedulian mendalam.' },
  'X-high_A-high': { name: 'Diplomator Sosial', desc: 'Sosok yang energik dan ramah — mampu membangun hubungan yang luas sambil menjaga harmoni dengan siapa saja.' },
  'X-high_O-high': { name: 'Explorer Kreatif', desc: 'Sosok yang antusias mengeksplorasi ide baru dan berbagi temuan dengan orang lain — inovator yang inspiratif.' },
  'E-low_C-high': { name: 'Eksekutor Andal', desc: 'Sosok yang tenang dan terorganisir — mampu menyelesaikan tugas kompleks dengan efisien tanpa terpengaruh tekanan.' },
  'A-high_E-high': { name: 'Penyembuh Alami', desc: 'Sosok yang sangat empatik dan pemaaf — orang merasa aman curhat dan berbagi masalah dengannya.' },
  'C-high_O-high': { name: 'Inovator Terstruktur', desc: 'Sosok yang kreatif namun disiplin — menghasilkan dan mengeksekusi ide-ide baru dengan terencana.' },
  'H-high_A-high': { name: 'Peacemaker Jujur', desc: 'Sosok yang tulus dan harmonis — menjaga kedamaian tanpa mengorbankan kejujuran.' },
  'X-low_O-high': { name: 'Pemikir Mendalam', desc: 'Sosok yang introvert namun penuh ide — dunia batinnya kaya dengan kreativitas dan refleksi.' },
  'E-low_A-low': { name: 'Pembuat Keputusan Tegas', desc: 'Sosok yang tangguh dan tidak sentimentil — mampu membuat keputusan sulit tanpa ragu.' },
  'H-low_X-high': { name: 'Strategist Sosial', desc: 'Sosok yang cerdas secara sosial dan ambisius — terampil membangun jejaring untuk mencapai tujuan.' },
  'C-low_X-high': { name: 'Inisiator Spontan', desc: 'Sosok yang dinamis dan fleksibel — memulai banyak hal dengan antusias meski tidak selalu menyelesaikannya.' },
};

// =========================================
// HELPERS
// =========================================
function getLevel(mean) {
  if (mean >= 3.8) return 'high';
  if (mean >= 2.5) return 'mid';
  return 'low';
}

function getPct(mean) {
  return Math.round(Math.max(0, Math.min(100, ((mean - 1) / 4) * 100)));
}

// =========================================
// MASTER: Analyze HEXACO Profile
// =========================================
export function analyzeHexacoProfile(factorMeans, facetMeans) {
  const fm = factorMeans || {};
  const fac = facetMeans || {};

  // ====== 1. DIMENSION OVERVIEW ======
  const dimProfiles = [];
  const factors = ['H', 'E', 'X', 'A', 'C', 'O'];
  const sortedFactors = factors
    .map(f => ({ factor: f, mean: fm[f] || 3, pct: getPct(fm[f] || 3), name: FACET_MAP[f].name }))
    .sort((a, b) => b.pct - a.pct);

  let dimensiOverview = `Dimensi karakter yang paling menonjol pada individu ini adalah ${sortedFactors[0].name} (${sortedFactors[0].pct}%), `;
  dimensiOverview += `diikuti ${sortedFactors[1].name} (${sortedFactors[1].pct}%). `;
  dimensiOverview += `Sementara dimensi yang paling rendah adalah ${sortedFactors[5].name} (${sortedFactors[5].pct}%) `;
  dimensiOverview += `dan ${sortedFactors[4].name} (${sortedFactors[4].pct}%).`;

  // ====== 2. INTRA-DIMENSION ANALYSIS ======
  const intraInsights = [];
  for (const dimKey of factors) {
    const dimFacets = FACET_MAP[dimKey].facets;
    const facetLevels = {};
    const facetVals = [];
    for (const fk of dimFacets) {
      const val = fac[fk];
      if (val !== undefined) {
        facetLevels[fk] = getLevel(val);
        facetVals.push({ key: fk, val, level: getLevel(val) });
      }
    }

    // Check for patterns within this dimension
    if (intraDimPatterns[dimKey]) {
      for (const patternKey in intraDimPatterns[dimKey]) {
        const parts = patternKey.split('_');
        let match = true;
        for (const p of parts) {
          const [facetKey, expectedLevel] = p.split('-');
          if (facetLevels[facetKey] !== expectedLevel) { match = false; break; }
        }
        if (match) {
          intraInsights.push(intraDimPatterns[dimKey][patternKey]);
        }
      }
    }

    // Find outlier within dimension (one facet very different from others)
    if (facetVals.length >= 3) {
      const sorted = [...facetVals].sort((a, b) => b.val - a.val);
      const range = sorted[0].val - sorted[sorted.length - 1].val;
      if (range >= 1.5) {
        const highest = sorted[0];
        const lowest = sorted[sorted.length - 1];
        intraInsights.push(
          `Dalam dimensi ${FACET_MAP[dimKey].name}, terdapat kontras menarik: aspek ${FACET_NAMES[highest.key]} sangat menonjol (${getPct(highest.val)}%) sementara ${FACET_NAMES[lowest.key]} justru rendah (${getPct(lowest.val)}%). Perbedaan ini menunjukkan bahwa dimensi ini tidak dialami secara seragam.`
        );
      }
    }
  }

  // ====== 3. CROSS-DIMENSION DYNAMICS ======
  const crossInsights = [];
  for (const key in crossDimDynamics) {
    const [part1, part2] = key.split('_');
    const [d1, l1] = part1.split('-');
    const [d2, l2] = part2.split('-');
    if (getLevel(fm[d1] || 3) === l1 && getLevel(fm[d2] || 3) === l2) {
      crossInsights.push(crossDimDynamics[key]);
    }
  }

  // ====== 4. CHARACTER ARCHETYPE ======
  let archetype = null;
  for (const key in archetypes) {
    const [part1, part2] = key.split('_');
    const [d1, l1] = part1.split('-');
    const [d2, l2] = part2.split('-');
    if (getLevel(fm[d1] || 3) === l1 && getLevel(fm[d2] || 3) === l2) {
      archetype = archetypes[key];
      break; // Take first matching archetype
    }
  }

  // ====== 5. STRENGTHS ======
  const kelebihan = [];
  for (const f of sortedFactors) {
    if (f.pct >= 70) {
      const strengthMap = {
        H: 'Integritas dan kejujuran yang tinggi — dapat dipercaya dalam situasi apapun',
        E: 'Kepekaan emosional mendalam — mampu memahami dan merespons perasaan orang lain',
        X: 'Keterampilan sosial dan energi positif — mampu membangun relasi dan menginspirasi',
        A: 'Karakter yang ramah dan toleran — menciptakan harmoni dalam setiap interaksi',
        C: 'Disiplin dan ketelitian — menghasilkan pekerjaan berkualitas secara konsisten',
        O: 'Kreativitas dan keingintahuan — terbuka terhadap ide baru dan perspektif berbeda',
      };
      kelebihan.push(strengthMap[f.factor]);
    }
    if (f.pct <= 30) {
      const lowStrengthMap = {
        H: 'Pragmatisme dan ambisi — terampil menavigasi situasi sosial yang kompleks',
        E: 'Ketangguhan emosional — stabil dan rasional di bawah tekanan',
        X: 'Kedalaman introspeksi — mampu berpikir mendalam dan reflektif',
        A: 'Ketegasan dan objektivitas — tidak ragu menyuarakan kebenaran',
        C: 'Fleksibilitas dan spontanitas — adaptif dalam lingkungan yang berubah cepat',
        O: 'Orientasi praktis — fokus pada solusi yang terbukti dan terukur',
      };
      kelebihan.push(lowStrengthMap[f.factor]);
    }
  }

  // ====== 6. CHALLENGES ======
  const tantangan = [];
  for (const f of sortedFactors) {
    if (f.pct >= 70) {
      const challengeMap = {
        H: 'Perlu waspada agar kejujuran tidak menjadi kaku — terkadang diplomasi diperlukan',
        E: 'Perlu mengelola sensitivitas emosional agar tidak mengganggu objektivitas dalam bekerja',
        X: 'Perlu memastikan energi sosial terarah — tidak menyebar ke terlalu banyak aktivitas',
        A: 'Perlu melatih ketegasan — keramahan berlebihan dapat dimanfaatkan orang lain',
        C: 'Perlu mengurangi perfeksionisme — kadang "cukup baik" lebih efektif dari "sempurna"',
        O: 'Perlu memastikan kreativitas diimbangi eksekusi — banyak ide harus dikelola secara sistematis',
      };
      tantangan.push(challengeMap[f.factor]);
    }
    if (f.pct <= 30) {
      const lowChallengeMap = {
        H: 'Perlu meningkatkan transparansi — kepercayaan jangka panjang membutuhkan ketulusan',
        E: 'Perlu meningkatkan kesadaran emosional — memahami perasaan orang lain memperkuat hubungan',
        X: 'Perlu melatih kemampuan berbicara di depan umum dan networking profesional',
        A: 'Perlu melatih kesabaran dan toleransi — konflik tidak selalu harus dijawab dengan konfrontasi',
        C: 'Perlu membangun kebiasaan terstruktur — disiplin mendukung pencapaian jangka panjang',
        O: 'Perlu sesekali keluar dari zona nyaman — mencoba perspektif baru memperluas wawasan',
      };
      tantangan.push(lowChallengeMap[f.factor]);
    }
  }

  // ====== 7. FACET HIGHLIGHTS ======
  const facetHighlights = [];
  for (const fk of Object.keys(FACET_NAMES)) {
    if (fk === 'altr') continue;
    const val = fac[fk];
    if (val !== undefined) {
      const pct = getPct(val);
      if (pct >= 80 || pct <= 20) {
        facetHighlights.push({
          key: fk,
          name: FACET_NAMES[fk],
          pct,
          level: pct >= 80 ? 'very_high' : 'very_low',
        });
      }
    }
  }

  // ====== 8. ALTRUISM ======
  let altruismNote = '';
  const altrVal = fac.altr;
  if (altrVal !== undefined) {
    const altrPct = getPct(altrVal);
    if (altrPct >= 70) {
      altruismNote = `Sebagai catatan penting, individu ini memiliki skor Altruisme yang sangat tinggi (${altrPct}%), menunjukkan kepedulian yang luar biasa terhadap kesejahteraan orang lain. Ia secara alami terdorong untuk membantu orang yang membutuhkan, bahkan dengan mengorbankan kepentingan pribadinya.`;
    } else if (altrPct <= 30) {
      altruismNote = `Skor Altruisme individu ini tergolong rendah (${altrPct}%), menunjukkan bahwa ia cenderung memprioritaskan kepentingan pribadi. Ini tidak berarti ia tidak peduli, namun ia lebih selektif dalam memberikan bantuan.`;
    }
  }

  return {
    dimensiOverview,
    sortedFactors,
    intraInsights: intraInsights.slice(0, 4),
    crossInsights: crossInsights.slice(0, 3),
    archetype,
    kelebihan: kelebihan.slice(0, 4),
    tantangan: tantangan.slice(0, 3),
    facetHighlights,
    altruismNote,
  };
}
