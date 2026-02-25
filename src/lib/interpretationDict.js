/**
 * Kamus Interpretasi DISC + HEXACO — 100% Lokal (Tanpa API)
 * Berdasarkan DISC 15 Patterns dan HEXACO Scale Interpretations
 */

// =========================================
// DISC 15 PATTERNS DICTIONARY
// =========================================
export const DISC_PATTERNS = {
  DI: { name: 'Inspirational', gayaKerja: 'Individu ini secara alami memiliki daya penggerak yang kuat terhadap orang-orang di sekelilingnya. Dalam bekerja, ia cenderung mengarahkan dan mempersuasi secara bersamaan — menetapkan tujuan dengan tegas sambil membangun dukungan melalui komunikasi yang menawan. Ia mampu membaca motivasi orang lain dengan cerdik dan menyesuaikan pendekatannya untuk mendapatkan hasil yang diinginkan.\n\nGaya pengambilan keputusannya bersifat strategis namun berorientasi pada aksi. Ia tidak ragu untuk mengambil kendali situasi, tetapi lebih memilih jalur persuasi dibanding dominasi. Dalam komunikasi, ia menggabungkan ketegasan dengan karisma, membuat orang lain merasa terlibat sekaligus terarah.' },
  ID: { name: 'Inspirational', gayaKerja: 'Individu ini secara alami memiliki daya penggerak yang kuat terhadap orang-orang di sekelilingnya. Dalam bekerja, ia cenderung mengarahkan dan mempersuasi secara bersamaan — menetapkan tujuan dengan tegas sambil membangun dukungan melalui komunikasi yang menawan. Ia mampu membaca motivasi orang lain dengan cerdik dan menyesuaikan pendekatannya untuk mendapatkan hasil yang diinginkan.\n\nGaya pengambilan keputusannya bersifat strategis namun berorientasi pada aksi. Ia tidak ragu untuk mengambil kendali situasi, tetapi lebih memilih jalur persuasi dibanding dominasi. Dalam komunikasi, ia menggabungkan ketegasan dengan karisma, membuat orang lain merasa terlibat sekaligus terarah.' },
  DS: { name: 'Developer', gayaKerja: 'Individu ini adalah sosok yang berorientasi pada hasil dengan rasa urgensi yang tinggi. Ia menantang status quo dan tidak segan membuat terobosan demi pencapaian target. Standar yang ia tetapkan untuk diri sendiri dan tim sangat tinggi, serta ia mengharapkan komitmen penuh dari setiap anggota tim.\n\nDalam mengambil keputusan, ia mengandalkan visi jelas dan tindakan tegas. Komunikasinya cenderung langsung dan to the point — ia menghargai efisiensi dan tidak suka membuang waktu pada hal-hal yang tidak produktif. Ia mampu memotivasi tim mencapai target ambisius, meskipun terkadang perlu lebih peka terhadap kebutuhan emosional rekan kerja.' },
  SD: { name: 'Developer', gayaKerja: 'Individu ini adalah sosok yang berorientasi pada hasil dengan rasa urgensi yang tinggi. Ia menantang status quo dan tidak segan membuat terobosan demi pencapaian target. Standar yang ia tetapkan untuk diri sendiri dan tim sangat tinggi, serta ia mengharapkan komitmen penuh dari setiap anggota tim.\n\nDalam mengambil keputusan, ia mengandalkan visi jelas dan tindakan tegas. Komunikasinya cenderung langsung dan to the point — ia menghargai efisiensi dan tidak suka membuang waktu pada hal-hal yang tidak produktif. Ia mampu memotivasi tim mencapai target ambisius, meskipun terkadang perlu lebih peka terhadap kebutuhan emosional rekan kerja.' },
  DC: { name: 'Creative', gayaKerja: 'Individu ini adalah pemikir strategis yang menggabungkan ketegasan dalam bertindak dengan ketelitian dalam merencanakan. Ia lebih suka bekerja secara independen dan sering menjadi pemecah masalah yang inovatif. Ia tidak takut menantang cara-cara konvensional jika merasa ada pendekatan yang lebih baik.\n\nDalam pengambilan keputusan, ia mengandalkan analisis objektif yang dipadukan dengan intuisi yang kuat. Komunikasinya bersifat substantif — ia lebih menghargai kualitas isi percakapan dibandingkan basa-basi. Ia menghargai otonomi dan kebebasan untuk mengeksplorasi solusi inovatif.' },
  CD: { name: 'Creative', gayaKerja: 'Individu ini adalah pemikir strategis yang menggabungkan ketegasan dalam bertindak dengan ketelitian dalam merencanakan. Ia lebih suka bekerja secara independen dan sering menjadi pemecah masalah yang inovatif. Ia tidak takut menantang cara-cara konvensional jika merasa ada pendekatan yang lebih baik.\n\nDalam pengambilan keputusan, ia mengandalkan analisis objektif yang dipadukan dengan intuisi yang kuat. Komunikasinya bersifat substantif — ia lebih menghargai kualitas isi percakapan dibandingkan basa-basi. Ia menghargai otonomi dan kebebasan untuk mengeksplorasi solusi inovatif.' },
  IS: { name: 'Counselor', gayaKerja: 'Individu ini adalah pendengar yang empatik dan pendukung yang tulus. Dalam bekerja, ia menciptakan lingkungan yang harmonis di mana setiap anggota tim merasa didengar dan dihargai. Ia terampil sebagai mediator dalam situasi konflik dan mampu membantu orang lain mengembangkan potensi terbaik mereka.\n\nGaya pengambilan keputusannya bersifat kolaboratif — ia mempertimbangkan dampak keputusan terhadap semua pihak sebelum bertindak. Dalam komunikasi, ia mendemonstrasikan kehangatan dan ketulusan, yang membuat orang merasa nyaman untuk berbagi pemikiran secara terbuka.' },
  SI: { name: 'Counselor', gayaKerja: 'Individu ini adalah pendengar yang empatik dan pendukung yang tulus. Dalam bekerja, ia menciptakan lingkungan yang harmonis di mana setiap anggota tim merasa didengar dan dihargai. Ia terampil sebagai mediator dalam situasi konflik dan mampu membantu orang lain mengembangkan potensi terbaik mereka.\n\nGaya pengambilan keputusannya bersifat kolaboratif — ia mempertimbangkan dampak keputusan terhadap semua pihak sebelum bertindak. Dalam komunikasi, ia mendemonstrasikan kehangatan dan ketulusan, yang membuat orang merasa nyaman untuk berbagi pemikiran secara terbuka.' },
  IC: { name: 'Persuader', gayaKerja: 'Individu ini adalah komunikator yang antusias dan optimis, dengan kemampuan luar biasa dalam mempengaruhi dan membujuk orang lain. Ia membawa energi yang menular ke setiap interaksi dan mampu membuat orang bersemangat tentang ide-ide barunya. Ia percaya diri dan menikmati tantangan memenangkan hati orang lain.\n\nDalam pengambilan keputusan, ia cenderung cepat bertindak berdasarkan intuisi dan antusiasme. Komunikasinya penuh semangat dan persuasif — ia tahu cara menyampaikan pesan yang menggerakkan orang untuk bertindak. Ia adalah networker alami yang membangun hubungan dengan mudah.' },
  CI: { name: 'Persuader', gayaKerja: 'Individu ini adalah komunikator yang antusias dan optimis, dengan kemampuan luar biasa dalam mempengaruhi dan membujuk orang lain. Ia membawa energi yang menular ke setiap interaksi dan mampu membuat orang bersemangat tentang ide-ide barunya. Ia percaya diri dan menikmati tantangan memenangkan hati orang lain.\n\nDalam pengambilan keputusan, ia cenderung cepat bertindak berdasarkan intuisi dan antusiasme. Komunikasinya penuh semangat dan persuasif — ia tahu cara menyampaikan pesan yang menggerakkan orang untuk bertindak. Ia adalah networker alami yang membangun hubungan dengan mudah.' },
  SC: { name: 'Specialist', gayaKerja: 'Individu ini adalah sosok yang berorientasi pada detail dan menghargai akurasi serta konsistensi dalam bekerja. Ia memiliki pengetahuan mendalam di bidang keahliannya dan dapat diandalkan untuk menghasilkan pekerjaan berkualitas tinggi secara konsisten. Ia lebih menyukai lingkungan kerja yang stabil dan terstruktur.\n\nDalam pengambilan keputusan, ia berhati-hati dan mempertimbangkan semua faktor dengan cermat sebelum bertindak. Komunikasinya bersifat terukur dan berbasis fakta — ia jarang membuat klaim tanpa data pendukung. Ia adalah aset berharga dalam peran yang memerlukan presisi dan ketelitian.' },
  CS: { name: 'Specialist', gayaKerja: 'Individu ini adalah sosok yang berorientasi pada detail dan menghargai akurasi serta konsistensi dalam bekerja. Ia memiliki pengetahuan mendalam di bidang keahliannya dan dapat diandalkan untuk menghasilkan pekerjaan berkualitas tinggi secara konsisten. Ia lebih menyukai lingkungan kerja yang stabil dan terstruktur.\n\nDalam pengambilan keputusan, ia berhati-hati dan mempertimbangkan semua faktor dengan cermat sebelum bertindak. Komunikasinya bersifat terukur dan berbasis fakta — ia jarang membuat klaim tanpa data pendukung. Ia adalah aset berharga dalam peran yang memerlukan presisi dan ketelitian.' },
  DD: { name: 'Driver', gayaKerja: 'Individu ini memiliki dorongan kompetitif yang kuat dan sangat fokus pada pencapaian hasil. Ia langsung, tegas, dan memiliki kemampuan alami untuk memimpin dan menggerakkan orang. Ia tidak takut mengambil keputusan sulit dan bertindak cepat demi efisiensi.\n\nGaya komunikasinya cenderung singkat, padat, dan berorientasi solusi. Ia menghargai waktu dan tidak menyukai pembahasan yang berbelit-belit. Dalam situasi stres, ia semakin fokus pada pencapaian dan mungkin perlu diingatkan untuk memperhatikan dampak emosinya terhadap orang lain.' },
  II: { name: 'Promoter', gayaKerja: 'Individu ini adalah sosok yang penuh semangat dan karismatik, dengan kemampuan luar biasa untuk membangun relasi dan menginspirasi orang lain. Ia membawa energi positif ke setiap ruangan dan mampu menciptakan suasana kerja yang menyenangkan dan memotivasi.\n\nDalam pengambilan keputusan, ia cenderung optimis dan berani mengambil peluang baru. Komunikasinya hangat, ekspresif, dan penuh antusiasme. Ia adalah networker alami yang mampu mempertemukan orang-orang dengan minat yang sama dan membangun kolaborasi yang produktif.' },
  SS: { name: 'Supporter', gayaKerja: 'Individu ini adalah pemain tim yang setia dan dapat diandalkan, menghargai stabilitas serta harmoni dalam lingkungan kerja. Ia menciptakan suasana yang aman dan dapat diprediksi di mana rekan kerja merasa didukung dan dihargai. Loyalitasnya terhadap tim dan organisasi sangat tinggi.\n\nDalam pengambilan keputusan, ia berhati-hati dan mempertimbangkan dampak terhadap semua pihak. Komunikasinya tenang, sabar, dan penuh perhatian. Ia adalah pendengar yang sangat baik yang memberikan dukungan emosional yang konsisten kepada rekan-rekannya.' },
  CC: { name: 'Analyst', gayaKerja: 'Individu ini adalah perfeksionis yang menghargai akurasi dan kualitas di atas segalanya. Ia mendekati setiap masalah secara sistematis, menggunakan data dan logika sebagai fondasi pengambilan keputusan. Ia berkomitmen menghasilkan pekerjaan yang presisi dan berkualitas tinggi.\n\nDalam komunikasi, ia cenderung terperinci dan berbasis bukti — setiap pernyataannya didukung oleh data dan analisis yang cermat. Ia memiliki kemampuan luar biasa untuk mengidentifikasi risiko dan masalah potensial sebelum terjadi. Ia paling berkembang dalam lingkungan yang menghargai standar tinggi dan pemikiran kritis.' },
};

// =========================================
// HEXACO INTERPRETATION TEMPLATES
// =========================================
const hexacoTemplates = {
  H: {
    high: 'Individu ini menunjukkan tingkat kejujuran dan ketulusan yang tinggi dalam interaksinya dengan orang lain. Ia cenderung menghindari manipulasi untuk keuntungan pribadi, bersikap adil dalam transaksi, tidak tertarik pada kemewahan berlebihan, dan tidak merasa berhak mendapatkan perlakuan istimewa.',
    mid: 'Individu ini memiliki kesadaran sosial yang seimbang — mampu bersikap jujur namun juga pragmatis dalam situasi tertentu. Ia menghargai keadilan tetapi dapat bersikap fleksibel dalam bernegosiasi demi kepentingan bersama.',
    low: 'Individu ini cenderung pragmatis dalam interaksi sosial dan mungkin menggunakan strategi persuasi yang beragam untuk mencapai tujuannya. Ia menghargai status dan pencapaian material sebagai indikator kesuksesan.',
  },
  E: {
    high: 'Individu ini memiliki kepekaan emosional yang tinggi terhadap lingkungan dan orang-orang di sekitarnya. Ia mudah merasa cemas dalam situasi yang tidak pasti, memiliki kebutuhan emosional yang kuat terhadap orang terdekat, dan menunjukkan empati mendalam terhadap penderitaan orang lain.',
    mid: 'Individu ini memiliki keseimbangan emosional yang cukup baik — mampu merasakan empati tanpa terlalu larut dalam emosi orang lain. Ia dapat menghadapi situasi stres dengan cukup tenang meskipun tetap responsif terhadap kebutuhan emosional.',
    low: 'Individu ini cenderung stabil secara emosional dan tidak mudah terpengaruh oleh tekanan situasional. Ia mampu tetap tenang dalam situasi berbahaya, mandiri secara emosional, dan mengandalkan logika dalam menghadapi permasalahan.',
  },
  X: {
    high: 'Individu ini memiliki rasa percaya diri sosial yang kuat dan menikmati interaksi dengan banyak orang. Ia merasa nyaman memimpin diskusi, aktif mencari pengalaman sosial, dan memiliki pandangan positif tentang dirinya sendiri. Energi dan antusiasmenya menular kepada orang-orang di sekitarnya.',
    mid: 'Individu ini memiliki keseimbangan yang baik antara kebutuhan bersosialisasi dan waktu untuk diri sendiri. Ia nyaman dalam kelompok maupun situasi yang lebih intim, dan mampu menyesuaikan tingkat keterlibatan sosialnya sesuai konteks.',
    low: 'Individu ini cenderung lebih introvert dan memilih lingkungan sosial yang lebih kecil dan intim. Ia menikmati waktu sendiri untuk refleksi dan tidak terlalu membutuhkan validasi sosial. Meskipun tampak pendiam, ia memiliki dunia batin yang kaya.',
  },
  A: {
    high: 'Individu ini sangat toleran dan pemaaf dalam hubungan interpersonal. Ia cenderung menghindari konflik, bersikap lembut dalam memberikan penilaian, fleksibel dalam mengakomodasi kebutuhan orang lain, dan sabar menghadapi provokasi. Ia menghargai keharmonisan dalam relasi.',
    mid: 'Individu ini memiliki keseimbangan yang baik antara ketegasan dan keramahan. Ia mampu bersikap tegas jika diperlukan namun tetap menghargai hubungan baik dengan orang lain. Ia dapat mengelola konflik secara konstruktif.',
    low: 'Individu ini cenderung memiliki standar tinggi dalam menilai orang lain dan tidak segan menyampaikan kritik secara langsung. Ia tegas dalam mempertahankan pendapatnya dan tidak mudah berkompromi jika merasa yakin dengan posisinya.',
  },
  C: {
    high: 'Individu ini menunjukkan tingkat disiplin dan ketelitian yang tinggi dalam bekerja. Ia tertata dalam mengelola waktu dan sumber daya, tekun mengejar tujuan, cermat memperhatikan detail, dan bijaksana dalam menimbang konsekuensi sebelum bertindak.',
    mid: 'Individu ini memiliki keseimbangan yang cukup baik antara keteraturan dan fleksibilitas. Ia mampu bekerja secara terstruktur namun juga bisa beradaptasi ketika situasi memerlukan spontanitas.',
    low: 'Individu ini cenderung lebih spontan dan fleksibel dalam bekerja. Ia lebih mengutamakan kreativitas dan adaptabilitas dibandingkan prosedur yang kaku, dan mungkin lebih efektif dalam lingkungan yang dinamis dan tidak terstruktur.',
  },
  O: {
    high: 'Individu ini memiliki ketertarikan mendalam terhadap keindahan, pengetahuan baru, dan ide-ide yang tidak konvensional. Ia menikmati eksplorasi intelektual, menghargai seni dan estetika, dan terbuka terhadap perspektif yang berbeda dari umumnya.',
    mid: 'Individu ini memiliki keterbukaan yang moderat terhadap pengalaman baru. Ia mampu menghargai tradisi sekaligus terbuka pada inovasi, menjadikannya adaptif dalam berbagai lingkungan kerja dan sosial.',
    low: 'Individu ini cenderung lebih praktis dan realistis dalam orientasinya. Ia menghargai pendekatan yang sudah terbukti dan mungkin lebih nyaman dengan hal-hal yang konkret dan dapat diukur dibandingkan konsep abstrak.',
  },
};

function getLevel(mean) {
  if (mean >= 3.8) return 'high';
  if (mean >= 2.5) return 'mid';
  return 'low';
}

// =========================================
// REKOMENDASI TEMPLATES
// =========================================
const rekomendasi = {
  DD: ['Melatih kesabaran dan empati aktif saat berinteraksi dengan rekan kerja yang memiliki tempo kerja berbeda.', 'Mengembangkan kemampuan mendengarkan secara mendalam sebelum menyampaikan solusi.', 'Menyeimbangkan dorongan untuk hasil cepat dengan perhatian terhadap proses dan kualitas hubungan interpersonal.'],
  DI: ['Mengembangkan sensitivitas terhadap kebutuhan emosional orang lain, tidak hanya fokus pada pencapaian.', 'Melatih kesabaran dalam menunggu proses dan tidak terburu-buru mengambil kendali.', 'Membangun sistem delegasi yang memberdayakan tim, bukan sekedar mengarahkan.'],
  ID: ['Mengembangkan sensitivitas terhadap kebutuhan emosional orang lain, tidak hanya fokus pada pencapaian.', 'Melatih kesabaran dalam menunggu proses dan tidak terburu-buru mengambil kendali.', 'Membangun sistem delegasi yang memberdayakan tim, bukan sekedar mengarahkan.'],
  DS: ['Mengembangkan empati dan kesabaran dalam berinteraksi dengan rekan kerja yang memiliki gaya berbeda.', 'Belajar memberikan apresiasi atas kontribusi orang lain, bukan hanya menuntut hasil.', 'Menyeimbangkan standar tinggi dengan pemahaman bahwa setiap orang memiliki kurva pembelajaran yang berbeda.'],
  SD: ['Mengembangkan empati dan kesabaran dalam berinteraksi dengan rekan kerja yang memiliki gaya berbeda.', 'Belajar memberikan apresiasi atas kontribusi orang lain, bukan hanya menuntut hasil.', 'Menyeimbangkan standar tinggi dengan pemahaman bahwa setiap orang memiliki kurva pembelajaran yang berbeda.'],
  DC: ['Mempraktikkan komunikasi yang lebih hangat dan inklusif saat menyampaikan ide-ide inovatif.', 'Mengembangkan kemampuan kolaborasi tim, bukan hanya bekerja secara independen.', 'Belajar menghargai kontribusi orang lain meskipun tidak sesuai dengan standar pribadi.'],
  CD: ['Mempraktikkan komunikasi yang lebih hangat dan inklusif saat menyampaikan ide-ide inovatif.', 'Mengembangkan kemampuan kolaborasi tim, bukan hanya bekerja secara independen.', 'Belajar menghargai kontribusi orang lain meskipun tidak sesuai dengan standar pribadi.'],
  IS: ['Melatih ketegasan dalam menetapkan prioritas dan batas waktu.', 'Mengembangkan keberanian untuk memberikan umpan balik konstruktif meskipun tidak nyaman.', 'Menyeimbangkan keinginan menjaga harmoni dengan kebutuhan untuk mengatasi masalah secara langsung.'],
  SI: ['Melatih ketegasan dalam menetapkan prioritas dan batas waktu.', 'Mengembangkan keberanian untuk memberikan umpan balik konstruktif meskipun tidak nyaman.', 'Menyeimbangkan keinginan menjaga harmoni dengan kebutuhan untuk mengatasi masalah secara langsung.'],
  IC: ['Membangun kebiasaan tindak lanjut yang lebih konsisten setelah memberikan komitmen.', 'Mengembangkan perhatian pada detail dan kualitas, tidak hanya pada antusiasme awal.', 'Melatih disiplin waktu agar energi dan antusiasme lebih terarah pada prioritas utama.'],
  CI: ['Membangun kebiasaan tindak lanjut yang lebih konsisten setelah memberikan komitmen.', 'Mengembangkan perhatian pada detail dan kualitas, tidak hanya pada antusiasme awal.', 'Melatih disiplin waktu agar energi dan antusiasme lebih terarah pada prioritas utama.'],
  SC: ['Melatih fleksibilitas dan keterbukaan terhadap perubahan serta cara-cara baru.', 'Mengembangkan inisiatif untuk menyuarakan pendapat dan ide-ide secara proaktif.', 'Membiasakan diri untuk mengambil risiko yang diperhitungkan demi pertumbuhan.'],
  CS: ['Melatih fleksibilitas dan keterbukaan terhadap perubahan serta cara-cara baru.', 'Mengembangkan inisiatif untuk menyuarakan pendapat dan ide-ide secara proaktif.', 'Membiasakan diri untuk mengambil risiko yang diperhitungkan demi pertumbuhan.'],
  II: ['Mengembangkan kebiasaan tindak lanjut dan disiplin dalam manajemen waktu.', 'Melatih perhatian pada detail dan kualitas eksekusi, bukan hanya ide besar.', 'Membangun kemampuan mendengarkan secara aktif agar tidak mendominasi percakapan.'],
  SS: ['Melatih ketegasan dan keberanian untuk menyuarakan pendapat secara langsung.', 'Mengembangkan kemauan untuk merangkul perubahan sebagai peluang pertumbuhan.', 'Membiasakan diri mengambil inisiatif dalam situasi yang memerlukan kepemimpinan.'],
  CC: ['Mengembangkan kecepatan pengambilan keputusan dan toleransi terhadap ketidaksempurnaan.', 'Melatih kemampuan melihat gambaran besar, bukan hanya detail teknis.', 'Membangun kepercayaan diri untuk mengambil risiko yang diperhitungkan.'],
};

// =========================================
// MASTER: Generate Interpretation Locally
// =========================================
export function generateLocalInterpretation(discPattern, hexacoFactorMeans) {
  // 1. Determine DISC pattern key (e.g. "SC", "DI")
  let patternKey = 'SC'; // default
  if (discPattern) {
    const parts = discPattern.includes('-') ? discPattern.split('-') : [discPattern[0], discPattern[1]];
    const primary = parts[0] || 'S';
    const secondary = parts[1] || 'C';
    patternKey = primary + secondary;
  }

  // 2. Get DISC interpretation
  const disc = DISC_PATTERNS[patternKey] || DISC_PATTERNS['SC'];
  const gayaKerja = disc.gayaKerja;

  // 3. Build HEXACO character narrative
  const fm = hexacoFactorMeans || {};
  const hexParts = ['H', 'E', 'X', 'A', 'C', 'O'].map(f => {
    const mean = fm[f] || 3;
    const level = getLevel(mean);
    return hexacoTemplates[f][level];
  });
  const karakterInti = hexParts.join(' ');

  // 4. Get recommendations
  const recs = rekomendasi[patternKey] || rekomendasi['SC'];

  return {
    gayaKerja,
    karakterInti,
    rekomendasi1: recs[0],
    rekomendasi2: recs[1],
    rekomendasi3: recs[2],
  };
}
