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
// CROSS-DIMENSION DYNAMICS (Expanded Local AI)
// =========================================
const crossDimDynamics = {
  // H interactions
  'H-high_X-high': 'Kombinasi kejujuran tinggi dan energi sosial (Ekstraversi) menjadikannya sosok yang jujur, terbuka, dan karismatik secara alami. Ia memikat orang lain bukan melalui manipulasi, melainkan dengan ketulusan yang disuguhkan secara energik.',
  'H-high_A-low': 'Integritasnya yang sangat tinggi dipadukan dengan sifat keras kepalanya menciptakan penegak kebenaran yang tak kenal kompromi. Ia akan menyuarakan fakta, meskipun itu memicu konflik atau membuat orang lain merasa tidak nyaman.',
  'H-mid_X-high': 'Dengan kejujuran yang moderat dan ekstraversi yang tinggi, ia sangat cerdas dalam membaca situasi sosial. Ia tahu persis kapan harus berbicara jujur secara gamblang dan kapan harus menahannya demi kelancaran berjejaring.',
  'H-low_X-high': 'Pemahaman sosialnya yang luar biasa dan dorongan material/status membuatnya menjadi "Strategic Networker". Ia sangat terampil memikat orang lain dan memposisikan dirinya di titik yang paling menguntungkan secara personal.',
  'H-high_C-high': 'Pribadi yang sangat bisa diandalkan. Perpaduan antara ketelitian bekerja (Conscientiousness) dan moralitas tangguh (Honesty-Humility) membuatnya tidak pernah mengambil jalan pintas dalam menyelesaikan tanggung jawab.',
  'H-mid_C-low': 'Ia cenderung pragmatis dan fleksibel. Tanpa batasan moral yang kaku dan kelonggaran dalam kedisiplinan, ia akan memilih "cara paling mudah" atau jalan pintas tercepat untuk menyelesaikan masalah.',

  // E interactions
  'E-high_A-high': 'Harmoni adalah segalanya baginya. Kombinasi kepekaan emosional dan keramahan murni menghasilkan sosok yang sangat mudah berempati, menjadikannya tempat curhat paling aman bagi rekan-rekannya.',
  'E-high_C-low': 'Gejolak perasaannya (Emotionality) sering kali mengalahkan struktur kerjanya. Jika ia merasa cemas atau *mood*-nya sedang buruk, fokus kedisiplinannya terhadap jam kerja atau target bisa tiba-tiba runtuh.',
  'E-low_C-high': 'Ketangguhan mental level tinggi. Ia adalah "Eksekutor Berdarah Dingin" yang mampu menyelesaikan tugas paling rumit dan penuh tekanan tanpa terganggu oleh drama emosional sedikit pun.',
  'E-low_A-low': 'Rasionalitasnya mendominasi setiap aspek interaksi. Ia melihat masalah secara objektif dan akan memotong langsung ke inti permasalahan tanpa terlalu mempedulikan apakah keputusannya "menyakiti perasaan" orang lain.',
  'E-mid_O-high': 'Kestabilan emosi yang cukup imbang ditambah keterbukaan pola pikir (Openness) membuatnya menjadi pengamat dunia yang tenang. Ia bisa meresapi keindahan seni atau filosofi tanpa harus menjadi terlalu larut atau emosional.',

  // X interactions
  'X-high_A-low': 'Ekstraversi tinggi tanpa filter keramahan menjadikannya sosok yang dominan, asertif, dan suka berdebat. Ia memimpin percakapan namun sering kali secara tidak sadar mendominasi atau mendikte arah diskusi.',
  'X-low_C-high': 'Introvert sejati yang sangat produktif. Ia menghindari keramaian karena interaksi sosial menguras energinya, dan lebih memilih menghabiskan seluruh fokusnya di dalam "gua kerja" miliknya untuk menciptakan karya berkualitas tinggi.',
  'X-high_O-high': 'Ia adalah seorang eksekutor sosial yang sangat inovatif. Ide-ide briliannya (Openness) tidak hanya bersarang di kepala, melainkan terus-menerus dikomunikasikan dan dibagikan dengan antusias kepada jaringan luasnya.',
  'X-mid_A-mid': 'Sosok yang sepenuhnya situasional secara sosial. Ia bisa menjadi pendengar yang sopan, atau tiba-tiba menjadi pembicara yang cukup aktif, sangat bergantung pada tingkat kenyamanannya terhadap orang-orang di ruangan tersebut.',

  // A interactions
  'A-high_C-low': 'Orang yang menyenangkan untuk diajak *nongkrong* namun mungkin sulit diandalkan dalam tenggat waktu kerja. Ia sangat menghindari konflik dan ingin menyenangkan semua orang, sampai-sampai jadwal kerjanya berantakan.',
  'A-low_C-high': 'Standar kerjanya sangat tinggi dan menuntut. Ia menjalankan kedisiplinan layaknya mesin, dan tidak akan menoleransi kelalaian dari anggota timnya. Evaluasinya seringkali tajam dan menusuk.',
  'A-low_O-low': 'Konservatif, berpendirian teguh, dan tidak mau disetir. Ia sangat meyakini gaya dan nilai-nilai lama (tradisional) dan tidak akan ragu berkonfrontasi dengan siapa pun yang mencoba memaksakan ide radikal/baru kepadanya.',
  
  // C & O interactions
  'C-high_O-high': '"Visioner Terstruktur". Ini adalah kombinasi paling mahal dalam dunia profesional inovatif. Ia mampu melahirkan ide-ide *out-of-the-box* lalu meracik rencana detail dan sabar mengeksekusi ide tersebut dari nol hingga berhasil.',
  'C-low_O-high': 'Kepalanya penuh dengan ratusan ide cemerlang, lukisan abstrak, dan imajinasi masa depan, namun sayangnya ia berisiko tidak pernah menyelesaikan satu pun dari ide tersebut menjadi kenyataan karena kelemahan organisasionalnya.',
  'C-mid_O-mid': 'Individu yang membumi. Ia terbuka pada perubahan asal masuk akal secara praktis, dan memiliki ritme kerja yang tidak terlalu ekstrem (tidak gila kerja, tapi juga bukan pemalas).',
};

// =========================================
// CHARACTER ARCHETYPES (Expanded Local AI)
// Based on dominant HEXACO profile combinations
// =========================================
const archetypes = {
  'H-high_C-high': { name: 'The Honorable Guardian', desc: 'Penjaga moral yang terstruktur. Bisa dipercaya seratus persen dengan tanggung jawab raksasa, karena ia lebih baik rugi finansial daripada mengorbankan kualitas pekerjaannya.' },
  'E-high_A-high': { name: 'The Empathic Healer', desc: 'Sosok dengan radar emosi tak terhingga. Ia menyerap energi dan penderitaan orang lain secara alami, selalu hadir untuk menenangkan meski terkadang mengorbankan kedamaian mentalnya sendiri.' },
  'H-low_X-high': { name: 'The Pragmatic Charm', desc: 'Pemikat sosial yang bergerak demi keuntungan. Memiliki aura karisma luar biasa yang ia gunakan secara taktis sebagai amunisi untuk melesat dalam anak tangga status dan materi.' },
  'C-high_O-high': { name: 'The Master Architect', desc: 'Perancang masa depan. Seseorang yang tidak hanya berani bermimpi hal gila (inovasi/kreativitas tinggi) tapi sungguh-sungguh memiliki disiplin baja untuk mewujudkannya pelan-pelan di dunia nyata.' },
  'X-low_C-high': { name: 'The Silent Specialist', desc: 'Pakar di belakang layar. Tak banyak omong, tak butuh panggung sorak-sorai, namun dedikasi dan akurasi karyanya bernilai jauh melampaui keheningannya.' },
  'E-low_A-low': { name: 'The Cold Analyst', desc: 'Pemikir rasional tanpa bias perasaan. Ia bisa memecat orang atau mengambil keputusan bisnis tersulit sekalipun tanpa setetes keraguan maupun rasa bersalah.' },
  'X-high_O-high': { name: 'The Expressive Explorer', desc: 'Petualang ide yang vokal. Ia memburu wawasan, mencoba konsep radikal baru, dan menginfeksi setiap orang di sekitarnya dengan energi antusiasme pemikiran pemikirannya.' },
  'H-high_A-low': { name: 'The Harsh Truth-Teller', desc: 'Pedang keadilan. Secara alami, ia lebih suka mematahkan hati seseorang dengan kebenaran yang telanjang daripada memberikan ketenangan pasu dari sebuah kebohongan manis yang diplomatis.' },
  'C-low_O-high': { name: 'The Chaotic Dreamer', desc: 'Sang pemimpi lepas. Otaknya meledak-ledak dengan seni dan kemungkinan inovasi yang tiada batas, namun ia nyaris selalu tersandung pada hal administratif atau jadwal harian.' },
  'A-high_C-low': { name: 'The Easy-Going Companion', desc: 'Teman sejati yang santai. Tidak ada tekanan aturan yang ketat ketika bersamanya, ia selalu fleksibel dan memprioritaskan harmoni daripada ego memenangkan perdebatan.' },
  'X-mid_C-mid': { name: 'The Balanced Citizen', desc: 'Individu adaptif yang tidak ekstrem. Berada di "zona penyeimbang"; mampu bersosialisasi dan bekerja cukup baik tanpa menjadi gila kerja atau seorang networker fanatik.' }
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
  const factors = ['H', 'E', 'X', 'A', 'C', 'O'];
  const sortedFactors = factors
    .map(f => ({ factor: f, mean: fm[f] || 3, pct: getPct(fm[f] || 3), name: FACET_MAP[f].name }))
    .sort((a, b) => b.pct - a.pct);

  let dimensiOverview = `Secara mendasar, pendorong utama dari karakter individu ini sangat kuat dipengaruhi oleh aspek ${sortedFactors[0].name} dan ${sortedFactors[1].name}. Hal ini menjadikannya sosok yang memiliki keunggulan dan fokus besar di area tersebut. Sebaliknya, pendekatan hidupnya cenderung lebih fleksibel, rasional, atau pragmatis dalam hal ${sortedFactors[5].name} maupun ${sortedFactors[4].name}, yang menandakan area di mana ia mengambil jarak emosional atau komitmen.`;

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
          `Satu hal menonjol dalam spektrum ${FACET_MAP[dimKey].name} adalah adanya perbedaan cara ia merespons situasi. Di satu sisi, elemen ${FACET_NAMES[highest.key]} tampil sangat dominan sebagai penggerak sikapnya, namun uniknya, elemen ${FACET_NAMES[lowest.key]} justru sangat dikesampingkan. Kontras ini membuat reaksinya tidak bisa disamaratakan; ia menonjol di area tertentu secara intens tanpa harus mencakup seluruh aspek di dimensi tersebut.`
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
      altruismNote = `Sebagai catatan tambahan terkait dinamika interpersonalnya, individu ini memiliki dorongan alami yang sangat kuat untuk membantu sesama (Altruisme tinggi). Ia cenderung mau berkorban meluangkan waktu atau tenaganya demi meringankan beban orang lain, menjadikannya sosok yang sangat bisa diandalkan ketika lingkungannya berada dalam posisi sulit.`;
    } else if (altrPct <= 30) {
      altruismNote = `Terkait dengan interaksinya dalam membantu sesama (Altruisme), individu ini memutuskan untuk bersikap sangat rasional. Ia cenderung fokus membereskan masalah pribadinya terlebih dahulu sebelum terjun membantu masalah orang lain. Pendekatan ini bukan berarti ia tidak peduli, melainkan ia sangat efektif dalam menjaga batasan diri agar tidak kehabisan energi untuk hal yang di luar wewenangnya.`;
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
