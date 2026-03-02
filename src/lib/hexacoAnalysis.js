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
// CROSS-DIMENSION DYNAMICS (Pure Behavioral)
// =========================================
const crossDimDynamics = {
  // H interactions
  'H-high_X-high': 'Terdapat perpaduan unik antara keterbukaan sosial dan ketulusan dalam dirinya. Ia memikat orang lain bukan melalui kepura-puraan, melainkan dengan kejujuran yang disuguhkan secara energik dan apa adanya.',
  'H-high_A-low': 'Pendiriannya sangat kokoh jika menyangkut kebenaran. Ia memilih untuk menyuarakan fakta secara gamblang dan apa adanya, meskipun kejujurannya terkadang menembus batas kenyamanan sosial dan memicu perdebatan.',
  'H-mid_X-high': 'Ia memiliki kecerdasan intrapersonal yang sangat baik dalam membaca dinamika ruang sosial. Ia tahu persis kapan harus berbicara lugas, dan kapan harus menahannya dengan diplomasi agar hubungan tetap terjalin baik.',
  'H-low_X-high': 'Dalam pergaulan, langkahnya hampir selalu taktis. Kemampuannya mengartikan situasi sosial menjadikannya sosok yang mahir menempatkan diri di posisi yang paling menguntungkan secara personal dan profesional.',
  'H-high_C-high': 'Ia adalah sosok yang amat sangat bisa diandalkan. Etos kerja yang terstruktur berpadu dengan moral yang kuat membuatnya tidak pernah mengambil jalan pintas, melainkan selalu berupaya memberikan hasil yang sebenar-benarnya.',
  'H-mid_C-low': 'Ia memiliki pandangan yang sangat pragmatis dalam menyelesaikan masalah. Tanpa terlalu terikat pada aturan baku, ia selalu cekatan dalam menemukan trik atau jalan pintas tercepat untuk menuntaskan pekerjaan.',

  // E interactions
  'E-high_A-high': 'Kepedulian terhadap keharmonisan adalah prioritas utamanya. Ia mudah sekali menyerap emosi orang-orang di sekelilingnya, menjadikannya pendengar yang luar biasa dan tempat berlabuh yang aman bagi rekan-rekannya.',
  'E-high_C-low': 'Suasana batinnya berdampak besar pada kinerjanya. Ketika suasana hatinya sedang tidak baik atau ia merasa cemas, fokus kedisiplinannya terhadap rutinitas atau target harian bisa dengan mudah buyar.',
  'E-low_C-high': 'Ketangguhan mentalnya berada di level yang sangat tinggi. Ia mampu memisahkan ego dan perasaannya sepenuhnya, memungkinkannya menyelesaikan krisis terburuk sekalipun dengan sangat terukur bagai seorang eksekutor tanpa celah.',
  'E-low_A-low': 'Cara berpikirnya bertumpu penuh pada rasionalitas murni. Ia membedah masalah secara mekanik, langsung menuju ke inti persoalan, tanpa merasa perlu memperhalus kata demi menjaga perasaan pihak lain.',
  'E-mid_O-high': 'Ia memandang dunia sebagai tempat yang kaya akan filosofi. Ia bisa membedah dan menikmati kedalaman pemikiran, nilai seni, atau ide baru, dengan pikiran tenang yang tetap jernih dan tak larut secara emosional.',

  // X interactions
  'X-high_A-low': 'Ia memiliki aura keberadaan yang sangat kuat namun asertif. Ia gemar mendominasi percakapan dan memimpin jalannya diskusi, seringkali menantang ide orang lain tanpa ragu sedikit pun.',
  'X-low_C-high': 'Waktu yang dihabiskan sendirian justru merupakan bahan bakar utamanya. Ia menyalurkan energinya ke dalam fokus tajam saat bekerja sendiri, menghasilkan output luar biasa tanpa perlu mencari validasi dari publik.',
  'X-high_O-high': 'Ia ibarat corong ide yang tak pernah redup. Gagasan-gagasan di kepalanya tidak hanya disimpan, namun selalu dibagikan dan dikomunikasikan dengan antusiasme tinggi untuk menginspirasi jaringan di sekitarnya.',
  'X-mid_A-mid': 'Kepribadiannya bunglon yang sangat situasional. Ia bisa menjadi pendengar pasif di suatu kelompok, atau tiba-tiba menjadi pembicaraan yang hangat jika ia merasa diterima dan nyaman dengan lawan bicaranya.',

  // A interactions
  'A-high_C-low': 'Ia sangat menyenangkan dan luwes untuk dijadikan teman berdiskusi. Demi menghindari perpecahan, ia sering kali menunda jadwal pribadinya atau mengorbankan keteraturan demi mendahulukan orang lain.',
  'A-low_C-high': 'Standar yang ia terapkan untuk dirinya dan orang lain terasa sangat menuntut. Ia menjalankan rutinitas nyaris tanpa kompromi, di mana kelalaian kecil saja bisa mendapatkan teguran yang lugas darinya.',
  'A-low_O-low': 'Ia bersandar pada nilai-nilai yang telah teruji waktu, memegang teguh tradisi, dan tidak punya masalah jika harus berbeda pendapat demi menolak hal-hal yang ia rasa keluar dari prinsip norma dasarnya.',
  
  // C & O interactions
  'C-high_O-high': 'Pikirannya mampu membayangkan hal-hal visioner yang tak terpikirkan siapapun, sekaligus memiliki kedisiplinan keras untuk menciptakan struktur nyata demi mewujudkan ide gila tersebut secara sistematis.',
  'C-low_O-high': 'Imajinasinya melampaui batasan hari ini, meledak dengan konsep dan estetika. Namun, ide-ide mutakhir itu sering kali berisiko tak terealisasi jika ia tak didampingi karena gaya hidpnya yang terlalu mengalir.',
  'C-mid_O-mid': 'Kakinya membumi dengan pas. Ia merengkuh hal-hal baru yang bermanfaat namun menolaknya jika terlalu muluk-muluk, menjaga ritme hidupnya tanpa menjadi terlalu monoton atau terlalu terlepas dari dunia nyata.',
};

// =========================================
// CHARACTER ARCHETYPES (Pure Behavioral)
// =========================================
const archetypes = {
  'H-high_C-high': 'Penjaga Integritas (The Guardian). Seseorang yang tak ubahnya jangkar moral yang kokoh. Ia memikul tanggung jawab besar bukan karena pujian, melainkan prinsip pribadinya yang tidak mengizinkan pekerjaan setengah matang.',
  'E-high_A-high': 'Pemantik Empati (The Healer). Ia menyerap radar emosi dari ruang mana pun ia berada. Sosok yang selalu hadir menawarkan kehangatannya walau itu berarti menampung kelelahan batin orang di sekitarnya.',
  'H-low_X-high': 'Pemikat Strategis (The Pragmatic Charm). Daya pikat alaminya memancar bukan hanya untuk kesenangan, meainkan diarahkan dengan penuh kalkulasi sebagai aset besar menapaki tangga kesuksesan.',
  'C-high_O-high': 'Arsitek Masa Depan (The Mastermind). Keseimbangan langka dari seorang pendobrak batas yang juga seorang pekerja berdisiplin baja. Ia memikirkan hal spektakuler sekaligus sabar menuntaskannya langkah demi langkah.',
  'X-low_C-high': 'Spesialis di Balik Layar (The Silent Specialist). Di tengah keriuhan dunia, ketenangan adalah studionya. Tanpa sorak-sorai, dedikasi dan akurasi karyanya berbicara jauh lebih vokal melampaui keheningannya.',
  'E-low_A-low': 'Analis Tanpa Bias (The Cold Analyst). Ia mampu mengeksekusi perhitungan terberat meski keputusannya bisa terasa begitu hampa bagi pihak lain, karena kejernihan pikiran adalah dewanya.',
  'X-high_O-high': 'Petualang Vokal (The Expressive Explorer). Pembawa arus inovasi. Ia mendobrak cara-cara lama, menelan pengetahuan baru, lalu menularkan obsesi penemuannya kepada setiap orang yang berinteraksi dengannya.',
  'H-high_A-low': 'Pembawa Fakta Tajam (The Truth-Teller). Ia mengusung kebaikan melalui transparansi, walau akibatnya kata-katanya bisa melumpuhkan rasa nyaman mereka yang terlena oleh senyum diplomatis.',
  'C-low_O-high': 'Pemimpi Bebas (The Dreamer). Pikiran yang senantiasa menari melampaui rutinitas batas administratif, menjadikannya sumber letupan ide meski ia begitu menolak dibelenggu oleh segala urusan penjadwalan kaku.',
  'A-high_C-low': 'Kawan Tanpa Syarat (The Easy-Going Companion). Selalu meredam setiap ketegangan di antara teman-temannya. Tidak peduli betapa kusut tenggat waktu, harmoni akan selalu menang di matanya.',
  'X-mid_C-mid': 'Katalis Seimbang (The Balanced Citizen). Sosok bunglon adaptif yang bergerak leluasa di zona aman. Tidak terhanyut arus maupun melawan arus tanpa sebab, ia menjaga agar kehidupan selalu bersahabat.'
};

// =========================================
// HELPERS
// =========================================
function getLevel(mean) {
  if (mean >= 4.2) return 'very_high';
  if (mean >= 3.5) return 'high';
  if (mean >= 2.8) return 'mid';
  if (mean >= 2.0) return 'low';
  return 'very_low';
}

function getPct(val) {
  return Math.min(Math.max(((val - 1) / 4) * 100, 0), 100);
}

// Normalize 5-level to 3-level for pattern matching against existing dictionaries
function normalizeLevel(level) {
  if (level === 'very_high') return 'high';
  if (level === 'very_low') return 'low';
  return level;
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
    .map(f => ({ factor: f, mean: fm[f] || 3, pct: getPct(fm[f] || 3) }))
    .sort((a, b) => b.pct - a.pct);

  const HIGH_FACTOR_DESC = {
    H: 'memegang teguh prinsip lurus tanpa niat tersembunyi',
    E: 'merasakan empati dan keterikatan yang mendalam terhadap sekitarnya',
    X: 'menyerap energi penuh dari interaksi dan antusias dalam membangun jejaring',
    A: 'memprioritaskan keharmonisan, kesabaran, dan diplomasi dalam berurusan dengan orang lain',
    C: 'mengejar keteraturan, kedisiplinan, dan target kerja yang terencana dengan matang',
    O: 'didorong oleh imajinasi liar dan keterbukaan terhadap segala wawasan baru'
  };

  const LOW_FACTOR_DESC = {
    H: 'realistis melihat celah dan cerdik memposisikan diri demi keuntungan strategis',
    E: 'menjaga jarak emosional agar tetap kebal saat berada di bawah tekanan',
    X: 'menemukan kekuatan murni dalam kesendirian dan kedalaman interaksi pada lingkaran kecil',
    A: 'menyuarakan keraguan atau bantahannya tanpa takut akan pecahnya perdebatan',
    C: 'menikmati spontanitas total dan meliuk beradaptasi ketika keadaan tiba-tiba berantakan',
    O: 'menajamkan fokusnya murni pada hal-hal yang konkret, pasti, dan sudah teruji oleh realita'
  };

  let dimensiOverview = `Secara mendasar, penggerak utama dari kebiasaan dan keputusannya adalah kecenderungannya yang secara alami gemar ${HIGH_FACTOR_DESC[sortedFactors[0].factor]} serta ${HIGH_FACTOR_DESC[sortedFactors[1].factor]}. Pola ini memberikannya fokus dan energi besar dalam keseharian. Di sisi lain penyeimbangnya, ia bersikap lebih luwes dan pragmatis dengan cara ${LOW_FACTOR_DESC[sortedFactors[5].factor]} maupun ${LOW_FACTOR_DESC[sortedFactors[4].factor]}.`;

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
          const actual = facetLevels[facetKey];
          if (actual !== expectedLevel && normalizeLevel(actual) !== expectedLevel) { match = false; break; }
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
    const lv1 = getLevel(fm[d1] || 3);
    const lv2 = getLevel(fm[d2] || 3);
    if ((lv1 === l1 || normalizeLevel(lv1) === l1) && (lv2 === l2 || normalizeLevel(lv2) === l2)) {
      crossInsights.push(crossDimDynamics[key]);
    }
  }

  // ====== 4. CHARACTER ARCHETYPE ======
  let archetype = null;
  for (const key in archetypes) {
    const [part1, part2] = key.split('_');
    const [d1, l1] = part1.split('-');
    const [d2, l2] = part2.split('-');
    const lv1 = getLevel(fm[d1] || 3);
    const lv2 = getLevel(fm[d2] || 3);
    if ((lv1 === l1 || normalizeLevel(lv1) === l1) && (lv2 === l2 || normalizeLevel(lv2) === l2)) {
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
