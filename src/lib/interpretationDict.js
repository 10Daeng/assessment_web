/**
 * Kamus Interpretasi DISC + HEXACO Komprehensif — 100% Lokal
 * 
 * DISC: 15 pola gaya kerja
 * HEXACO: 6 dimensi × 3 level + 25 facet × 3 level + kombinasi dinamis
 */

// =========================================
// DISC 15 PATTERNS
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
// HEXACO DIMENSION-LEVEL TEMPLATES
// =========================================
export const dimTemplates = {
  H: {
    very_high: 'Dalam aspek kejujuran dan kerendahhatian, individu ini berada di titik puncak integritas moral. Ia nyaris tidak bisa dibujuk untuk berbohong atau memanipulasi, dan memiliki penolakan yang sangat kuat terhadap segala bentuk ketidakjujuran. Kemewahan dan status sosial sama sekali tidak menjadi daya tarik baginya.',
    high: 'Individu ini menunjukkan integritas moral yang kuat. Ia cenderung tulus dalam berinteraksi, menghindari manipulasi, dan tidak tertarik pada kemewahan berlebihan.',
    mid: 'Individu ini memiliki kesadaran moral yang seimbang — mampu bersikap jujur namun juga pragmatis ketika situasi menuntut. Ia menghargai keadilan tetapi dapat bernegosiasi secara fleksibel.',
    low: 'Individu ini cenderung pragmatis dan strategis dalam interaksi sosial. Ia menghargai pencapaian material dan status sosial, serta terampil dalam menggunakan berbagai pendekatan persuasi.',
    very_low: 'Individu ini sangat berorientasi pada keuntungan diri dan pencapaian material. Ia terampil menggunakan berbagai taktik sosial untuk kepentingannya, dan tidak segan memanfaatkan posisi atau relasi untuk mendapatkan apa yang diinginkannya.',
  },
  E: {
    very_high: 'Dari segi emosionalitas, individu ini memiliki sensitivitas yang sangat intens. Ia merasakan emosi secara mendalam, mudah tersentuh oleh penderitaan orang lain, dan memiliki kebutuhan afektif serta keterikatan emosional yang sangat besar terhadap orang-orang terdekatnya.',
    high: 'Individu ini memiliki kepekaan emosional yang tinggi. Ia cenderung merasakan emosi secara intens, memiliki kebutuhan afektif yang kuat, dan menunjukkan empati mendalam kepada orang lain.',
    mid: 'Individu ini memiliki keseimbangan emosional yang baik — responsif terhadap perasaan orang lain tanpa terlalu larut dalam emosi. Ia mampu mengelola stres dengan cukup efektif.',
    low: 'Individu ini menunjukkan stabilitas emosional yang kokoh. Ia tidak mudah terguncang oleh tekanan, mandiri secara emosional, dan cenderung mengandalkan logika dalam menghadapi tantangan.',
    very_low: 'Individu ini sangat tangguh secara emosional — nyaris kebal terhadap tekanan dan guncangan psikologis. Ia memproses segala situasi dengan logika murni, tidak terpengaruh oleh sentimen, dan sangat mandiri dalam mengelola emosinya.',
  },
  X: {
    very_high: 'Dalam dimensi ekstraversi, individu ini memancarkan energi sosial yang luar biasa kuat. Ia adalah magnet sosial alami yang mendominasi setiap ruangan, memimpin percakapan tanpa ragu, dan memiliki kebutuhan sangat tinggi untuk berinteraksi dengan banyak orang setiap hari.',
    high: 'Individu ini menunjukkan rasa percaya diri sosial yang kuat. Ia menikmati interaksi dengan banyak orang, nyaman memimpin percakapan, dan membawa energi positif ke lingkungannya.',
    mid: 'Individu ini memiliki keseimbangan yang baik antara bersosialisasi dan menyendiri. Ia nyaman baik dalam kelompok besar maupun situasi yang lebih intim.',
    low: 'Individu ini cenderung introspektif dan memilih lingkungan sosial yang lebih kecil. Ia menikmati waktu sendiri untuk berpikir mendalam dan tidak membutuhkan validasi sosial.',
    very_low: 'Individu ini sangat introvert dan memilih menarik diri dari interaksi sosial. Ia menemukan energi terdalam dari kesendirian total, merasa tidak nyaman menjadi pusat perhatian, dan membutuhkan sedikit sekali kontak sosial untuk merasa puas.',
  },
  A: {
    very_high: 'Dalam hal keramahan, individu ini berada di tingkat yang sangat akomodatif. Ia nyaris tidak pernah terlibat konflik, selalu memaafkan tanpa syarat, dan bersedia mengorbankan kebutuhan pribadinya demi keharmonisan orang lain.',
    high: 'Individu ini sangat toleran dan pemaaf. Ia menghindari konfrontasi, bersikap lembut dalam berinteraksi, dan memprioritaskan keharmonisan hubungan.',
    mid: 'Individu ini memiliki keseimbangan antara ketegasan dan keramahan. Ia mampu bersikap tegas ketika diperlukan namun tetap menghargai relasi yang positif.',
    low: 'Individu ini cenderung tegas dan kritis dalam menilai orang lain. Ia tidak segan menyampaikan pendapat secara langsung dan mempertahankan posisinya dengan kukuh.',
    very_low: 'Individu ini sangat konfrontatif dan kompetitif. Ia sulit memaafkan, cepat bereaksi emosional terhadap provokasi, dan tidak ragu terlibat dalam perdebatan tajam untuk mempertahankan pendiriannya.',
  },
  C: {
    very_high: 'Pada dimensi kehati-hatian, individu ini berada di puncak kedisiplinan. Ia sangat perfeksionis, terorganisir secara obsesif, dan memiliki standar kerja yang sangat tinggi. Setiap keputusannya dipertimbangkan dengan sangat cermat sebelum dieksekusi.',
    high: 'Individu ini sangat terorganisir dan disiplin. Ia tertata dalam mengelola pekerjaan, tekun mengejar tujuan, dan cermat mempertimbangkan konsekuensi sebelum bertindak.',
    mid: 'Individu ini memiliki keseimbangan antara keteraturan dan fleksibilitas. Ia mampu bekerja secara terstruktur namun juga beradaptasi ketika situasi memerlukan spontanitas.',
    low: 'Individu ini cenderung spontan dan fleksibel. Ia mengutamakan kreativitas dan adaptabilitas, serta lebih efektif dalam lingkungan yang dinamis dan tidak terlalu kaku.',
    very_low: 'Individu ini sangat spontan dan tidak terstruktur. Ia cenderung impulsif dalam mengambil keputusan, menolak rutinitas, dan bekerja dengan cara yang sangat mengalir tanpa perencanaan matang.',
  },
  O: {
    very_high: 'Dalam aspek keterbukaan, individu ini memiliki kelaparan intelektual yang sangat tinggi. Ia terobsesi dengan ide-ide baru yang mendobrak konvensi, memiliki imajinasi tanpa batas, dan sangat tidak konvensional dalam cara berpikir maupun gaya hidupnya.',
    high: 'Individu ini memiliki ketertarikan mendalam terhadap keindahan, ide-ide baru, dan perspektif yang tidak konvensional. Ia menikmati eksplorasi intelektual dan kreativitas.',
    mid: 'Individu ini moderat dalam keterbukaan terhadap hal baru. Ia mampu menghargai tradisi sekaligus terbuka pada inovasi, menjadikannya adaptif dalam berbagai konteks.',
    low: 'Individu ini lebih berorientasi pada hal-hal praktis dan konkret. Ia menghargai pendekatan yang sudah terbukti dan cenderung nyaman dengan rutinitas yang terprediksi.',
    very_low: 'Individu ini sangat konservatif dan pragmatis. Ia menolak ide-ide abstrak, tidak tertarik pada seni atau filosofi, dan sangat menghargai tradisi serta cara-cara yang sudah terbukti berhasil.',
  },
};

// =========================================
// HEXACO FACET-LEVEL TEMPLATES (25 facets)
// =========================================
const facetTemplates = {
  // === H — Honesty-Humility ===
  sinc: {
    name: 'Ketulusan (Sincerity)',
    very_high: 'Ia secara radikal tulus — tidak memiliki kemampuan maupun keinginan untuk berpura-pura, bahkan dalam situasi di mana sedikit diplomasi mungkin bermanfaat.',
    high: 'Ia cenderung tulus dan apa adanya dalam menjalin hubungan, menghindari sikap berpura-pura atau memanipulasi orang lain demi keuntungan pribadi.',
    mid: 'Dalam hubungan sosial, ia umumnya bersikap tulus meskipun terkadang dapat menyesuaikan pendekatannya sesuai konteks.',
    low: 'Ia cukup terampil dalam menyesuaikan cara berkomunikasi sesuai siapa yang dihadapi, dan tidak ragu menggunakan strategi sosial untuk mencapai tujuan.',
    very_low: 'Ia sangat lihai dalam bermanuver sosial — mampu menyesuaikan pesan dan citra dirinya dengan sangat presisi agar mendapatkan apa yang diinginkannya.',
  },
  fair: {
    name: 'Keadilan (Fairness)',
    very_high: 'Ia memiliki standar etika yang sangat absolut — menolak segala bentuk kecurangan bahkan ketika tidak ada yang mengawasi atau ketika kecurangan itu menguntungkan dirinya.',
    high: 'Ia sangat menjunjung tinggi prinsip keadilan dan tidak bersedia mengambil keuntungan dari orang lain meskipun ada kesempatan.',
    mid: 'Ia menghargai keadilan dalam transaksi, namun cukup realistis dalam melihat bahwa tidak semua situasi bisa selalu adil.',
    low: 'Ia cenderung oportunistik — mampu melihat dan memanfaatkan peluang untuk keuntungan pribadi, termasuk jika itu berarti melanggar aturan tertentu.',
    very_low: 'Ia sangat berorientasi pada keuntungan dan memiliki toleransi yang sangat tinggi terhadap tindakan yang merugikan pihak lain demi kepentingannya sendiri.',
  },
  gree: {
    name: 'Penghindaran Keserakahan (Greed Avoidance)',
    very_high: 'Ia menjalani hidup dengan prinsip kesederhanaan yang sangat kuat — kemewahan dan status material nyaris tidak memiliki daya tarik sama sekali baginya.',
    high: 'Ia tidak tertarik pada kemewahan berlebihan dan tidak terdorong oleh kekayaan atau status material sebagai motivasi utama.',
    mid: 'Ia menghargai kenyamanan material namun tidak terobsesi dengannya. Ia melihat uang sebagai sarana, bukan tujuan akhir.',
    low: 'Ia memiliki motivasi kuat untuk mencapai kemakmuran material dan menikmati simbol-simbol kesuksesan serta gaya hidup mewah.',
    very_low: 'Ia sangat terobsesi dengan pencapaian material dan status — kemewahan, kekuasaan, dan pengakuan sosial menjadi bahan bakar utama motivasinya.',
  },
  mode: {
    name: 'Kerendahhatian (Modesty)',
    very_high: 'Ia sangat merendahkan diri — bahkan cenderung meremehkan kemampuannya sendiri dan merasa tidak nyaman menerima pujian atau pengakuan.',
    high: 'Ia cenderung rendah hati dan tidak merasa layak mendapat perlakuan istimewa. Ia tidak ingin menjadi pusat perhatian dan menghindari sikap sombong.',
    mid: 'Ia memiliki rasa percaya diri yang sehat tanpa menjadi arogan. Ia dapat menerima pujian dengan baik namun tidak mencarinya secara aktif.',
    low: 'Ia memiliki kepercayaan diri yang tinggi terhadap keistimewaan dirinya dan merasa layak mendapatkan perhatian serta penghargaan khusus dari lingkungan.',
    very_low: 'Ia memiliki grandiosity yang sangat tinggi — merasa sangat istimewa dan layak mendapatkan perlakuan berbeda dari orang lain.',
  },

  // === E — Emotionality ===
  fear: {
    name: 'Kecemasan Fisik (Fearfulness)',
    very_high: 'Ia sangat waspada dan takut terhadap segala bentuk bahaya fisik — menghindari risiko sekecil apa pun dan secara aktif mencari lingkungan yang paling aman.',
    high: 'Ia cenderung waspada terhadap bahaya fisik dan menghindari situasi yang mengandung risiko keselamatan.',
    mid: 'Ia memiliki kesadaran yang wajar terhadap risiko tanpa menjadi terlalu khawatir. Ia mampu mengelola rasa takut dengan cukup baik.',
    low: 'Ia berani menghadapi situasi berbahaya dan tidak mudah gentar oleh ancaman fisik. Ia menikmati tantangan dan aktivitas yang mengandung risiko.',
    very_low: 'Ia nyaris tidak mengenal rasa takut fisik — berani mengambil risiko ekstrem dan merasa tertantang oleh situasi berbahaya.',
  },
  anxi: {
    name: 'Kecemasan Psikologis (Anxiety)',
    very_high: 'Pikiran-pikiran negatif nyaris tidak pernah berhenti berputar di kepalanya. Ia sangat mudah terpicu oleh kekhawatiran dan butuh waktu lama untuk menenangkan diri.',
    high: 'Ia mudah merasa cemas dan khawatir tentang berbagai hal, bahkan dalam situasi yang relatif netral. Pikiran-pikiran negatif cenderung muncul secara berulang.',
    mid: 'Ia memiliki tingkat kecemasan yang normal — khawatir pada saat yang tepat namun mampu mengendalikan kekhawatiran agar tidak berlebihan.',
    low: 'Ia jarang merasa cemas dan mampu tetap tenang bahkan dalam situasi yang penuh tekanan. Ia memiliki stabilitas psikologis yang kuat.',
    very_low: 'Ia memiliki ketenangan mental yang luar biasa — nyaris tidak pernah merasa cemas atau khawatir, bahkan dalam situasi krisis.',
  },
  depe: {
    name: 'Ketergantungan Emosional (Dependence)',
    very_high: 'Ia sangat bergantung pada dukungan emosional orang lain — merasa tidak mampu menghadapi tantangan tanpa kehadiran orang terdekat di sisinya.',
    high: 'Ia memiliki kebutuhan kuat untuk mendapatkan dukungan emosional dari orang-orang terdekat dan merasa tidak nyaman jika harus menghadapi masalah sendirian.',
    mid: 'Ia menghargai dukungan emosional dari orang lain namun juga mampu menghadapi tantangan secara mandiri jika diperlukan.',
    low: 'Ia sangat mandiri secara emosional dan jarang merasa perlu mencari dukungan dari orang lain. Ia percaya pada kemampuannya sendiri untuk mengatasi masalah.',
    very_low: 'Ia sepenuhnya otonom secara emosional — tidak merasa butuh simpati atau dukungan dari siapa pun dan terbiasa menyelesaikan segala hal sendirian.',
  },
  sent: {
    name: 'Sentimentalitas (Sentimentality)',
    very_high: 'Ia memiliki kedalaman emosional yang sangat intens — mudah menangis, sangat tersentuh oleh kebaikan, dan merasa terikat secara emosional sangat kuat dengan orang-orang di sekitarnya.',
    high: 'Ia memiliki ikatan emosional yang sangat kuat dengan orang-orang di sekitarnya dan mudah tersentuh oleh situasi emosional.',
    mid: 'Ia memiliki empati yang cukup baik — mampu merasakan emosi orang lain tanpa terlalu larut dalam perasaan tersebut.',
    low: 'Ia cenderung terpisah secara emosional dan tidak mudah terpengaruh oleh emosi orang lain. Ia merespons situasi dengan logika lebih dari perasaan.',
    very_low: 'Ia sangat terlepas dari ikatan emosional — tidak mudah tersentuh oleh kisah sedih atau kebahagiaan orang lain, dan merespons segala situasi dengan nalar murni.',
  },

  // === X — eXtraversion ===
  sses: {
    name: 'Harga Diri Sosial (Social Self-Esteem)',
    very_high: 'Ia memiliki citra diri yang sangat positif dan tak tergoyahkan — sangat yakin bahwa ia berharga, diterima, dan mampu berkontribusi di mana pun.',
    high: 'Ia memiliki pandangan yang sangat positif tentang dirinya sendiri dan merasa yakin bahwa ia diterima dan dihargai oleh orang lain.',
    mid: 'Ia memiliki rasa percaya diri yang cukup sehat, meskipun terkadang ragu tentang bagaimana orang lain memandangnya.',
    low: 'Ia cenderung meragukan nilai dirinya dalam konteks sosial dan mungkin merasa kurang dihargai atau kurang menarik dibandingkan orang lain.',
    very_low: 'Ia memiliki evaluasi diri yang sangat negatif — merasa tidak berharga, tidak dihargai, dan sering membandingkan diri secara buruk dengan orang lain.',
  },
  socb: {
    name: 'Keberanian Sosial (Social Boldness)',
    very_high: 'Ia sangat berani dan percaya diri dalam segala situasi sosial — memimpin dengan natural, berbicara tanpa ragu, dan tidak pernah merasa canggung.',
    high: 'Ia nyaman menjadi pusat perhatian, percaya diri berbicara di depan umum, dan tidak canggung berinteraksi dengan orang yang baru dikenal.',
    mid: 'Ia cukup nyaman dalam situasi sosial, meskipun terkadang merasa sedikit gugup dalam kelompok besar atau di depan orang asing.',
    low: 'Ia cenderung pemalu dan tidak nyaman menjadi pusat perhatian. Ia lebih memilih untuk mendengarkan daripada memimpin percakapan.',
    very_low: 'Ia sangat pemalu dan menghindari situasi di mana ia harus tampil di depan orang — berbicara di depan umum adalah hal yang sangat menekan baginya.',
  },
  soci: {
    name: 'Kebutuhan Sosial (Sociability)',
    very_high: 'Ia nyaris tidak bisa tanpa interaksi sosial — merasa gelisah jika terlalu lama sendiri dan selalu mencari kegiatan berkumpul dengan orang lain.',
    high: 'Ia sangat menikmati kegiatan sosial, pesta, dan berkumpul dengan banyak orang. Ia merasa bersemangat dalam keramaian.',
    mid: 'Ia menikmati aktivitas sosial namun juga menghargai waktu untuk menyendiri. Kebutuhannya akan interaksi sosial bersifat moderat.',
    low: 'Ia lebih menyukai kesendirian atau pertemuan kecil dibandingkan acara sosial besar. Ia merasa cepat lelah dalam keramaian.',
    very_low: 'Ia sangat menghindari keramaian dan acara sosial — merasa energinya terkuras habis oleh interaksi dan sangat membutuhkan kesendirian untuk memulihkan diri.',
  },
  live: {
    name: 'Vitalitas (Liveliness)',
    very_high: 'Ia memancarkan semangat hidup yang sangat menular — penuh energi, selalu ceria, dan mampu mengangkat suasana ruangan mana pun yang ia masuki.',
    high: 'Ia penuh semangat dan antusiasme dalam menjalani aktivitas sehari-hari. Ia memancarkan energi positif dan keceriaan yang menular.',
    mid: 'Ia memiliki tingkat energi yang cukup stabil — antusias dalam hal-hal yang menarik minatnya namun tidak selalu ekspresif.',
    low: 'Ia cenderung kalem dan lebih pendiam. Ia tidak terlalu ekspresif secara emosional dan lebih menyukai suasana yang tenang.',
    very_low: 'Ia sangat pendiam dan tampak datar secara emosional — jarang menunjukkan antusiasme atau semangat yang terlihat dari luar.',
  },

  // === A — Agreeableness ===
  forg: {
    name: 'Kemampuan Memaafkan (Forgivingness)',
    very_high: 'Ia memaafkan nyaris tanpa syarat — bahkan kesalahan besar pun bisa dilepaskannya dengan cepat tanpa menyimpan rasa sakit.',
    high: 'Ia mudah memaafkan orang yang menyakitinya dan tidak menyimpan dendam. Ia percaya pada kebaikan orang lain dan memberi kesempatan kedua.',
    mid: 'Ia mampu memaafkan meskipun membutuhkan waktu. Ia tidak dendam namun juga tidak melupakan perlakuan buruk dengan mudah.',
    low: 'Ia cenderung sulit melupakan ketika merasa diperlakukan tidak adil. Ia menyimpan ingatan kuat tentang perlakuan buruk dan lambat dalam memaafkan.',
    very_low: 'Ia sangat pendendam — menyimpan kemarahan dalam waktu lama dan sulit sekali melepaskan luka masa lalu, bahkan untuk kesalahan kecil.',
  },
  gent: {
    name: 'Kelembutan (Gentleness)',
    very_high: 'Ia sangat lembut dalam menilai siapa pun — nyaris tidak mampu mengkritik dan selalu berusaha melihat sisi terbaik dari setiap orang.',
    high: 'Ia sangat berhati-hati dalam memberikan penilaian terhadap orang lain, cenderung mencari sisi positif dan menghindari kritik tajam.',
    mid: 'Ia mampu memberikan umpan balik yang seimbang — menghargai kelebihan orang lain namun juga jujur tentang kekurangan.',
    low: 'Ia cenderung langsung dan kritis dalam menilai orang lain. Ia tidak segan menyampaikan pendapat yang tidak populer jika merasa benar.',
    very_low: 'Ia sangat tajam dan blak-blakan dalam mengkritik — penilaiannya terhadap orang lain sering kali keras dan tanpa basa-basi.',
  },
  flex: {
    name: 'Fleksibilitas (Flexibility)',
    very_high: 'Ia akan selalu mengalah demi orang lain — sangat akomodatif hingga terkadang mengabaikan kebutuhannya sendiri untuk menjaga keharmonisan.',
    high: 'Ia sangat akomodatif dan bersedia berkompromi demi menjaga keharmonisan. Ia menyesuaikan diri dengan keinginan orang lain dengan mudah.',
    mid: 'Ia cukup fleksibel dalam berkompromi namun tetap mempertahankan hal-hal yang dianggap penting baginya.',
    low: 'Ia teguh pada pendiriannya dan tidak mudah berkompromi. Ia percaya bahwa ide dan pendekatan miliknya sering kali yang terbaik.',
    very_low: 'Ia sangat keras kepala — nyaris tidak pernah berkompromi dan mempertahankan pendiriannya mati-matian meskipun bukti menunjukkan sebaliknya.',
  },
  pati: {
    name: 'Kesabaran (Patience)',
    very_high: 'Ia memiliki kesabaran yang nyaris tanpa batas — sangat jarang merasa terprovokasi dan mampu menghadapi situasi paling frustasi dengan ketenangan luar biasa.',
    high: 'Ia sangat sabar menghadapi provokasi dan jarang meledak secara emosional. Ia mampu menahan diri dalam situasi yang membuat frustrasi.',
    mid: 'Ia umumnya sabar meskipun memiliki batas toleransi tertentu. Pada titik tertentu, ia akan menyuarakan ketidakpuasannya.',
    low: 'Ia cenderung cepat marah dan mudah frustrasi. Ia tidak segan menunjukkan kekesalannya secara terbuka ketika merasa terprovokasi.',
    very_low: 'Ia sangat mudah meledak secara emosional — hal-hal kecil pun bisa memicu amarah besar, dan ia butuh waktu lama untuk mendinginkan diri.',
  },

  // === C — Conscientiousness ===
  orga: {
    name: 'Organisasi (Organization)',
    very_high: 'Ia sangat obsesif tentang keteraturan — segala hal harus tertata sempurna dan ia merasa tidak nyaman jika ada kekacauan sekecil apa pun.',
    high: 'Ia sangat terorganisir — ruang kerja dan jadwalnya tertata rapi. Ia memiliki sistem yang jelas untuk mengelola tugas dan tanggung jawab.',
    mid: 'Ia cukup teratur dalam mengelola pekerjaan, meskipun terkadang membiarkan beberapa hal tidak sempurna terorganisir.',
    low: 'Ia cenderung kurang teratur dan mungkin terlihat berantakan. Ia bekerja dengan gaya yang lebih spontan dan tidak terlalu terikat pada sistem.',
    very_low: 'Ia sangat tidak teratur — jadwal, file, dan ruang kerjanya cenderung sangat berantakan dan ia tidak merasa terganggu oleh kekacauan tersebut.',
  },
  dili: {
    name: 'Ketekunan (Diligence)',
    very_high: 'Ia adalah work-aholic sejati — memiliki dorongan internal yang sangat kuat untuk bekerja melampaui batas dan tidak pernah puas dengan hasil yang biasa-biasa saja.',
    high: 'Ia adalah pekerja keras yang tekun dan berdedikasi. Ia menetapkan standar tinggi dan mendorong dirinya untuk selalu memberikan yang terbaik.',
    mid: 'Ia menunjukkan etos kerja yang cukup baik — bekerja keras ketika diperlukan namun juga tahu kapan harus beristirahat.',
    low: 'Ia cenderung melakukan pekerjaan seperlunya saja dan tidak terdorong untuk melampaui ekspektasi. Ia menikmati waktu luang dan keseimbangan hidup.',
    very_low: 'Ia sangat minim motivasi kerja — hanya bekerja ketika benar-benar terpaksa dan cenderung mencari jalan pintas di setiap kesempatan.',
  },
  perf: {
    name: 'Perfeksionisme (Perfectionism)',
    very_high: 'Ia perfeksionis ekstrem — memeriksa setiap detail berulang kali hingga benar-benar sempurna, terkadang sampai menghambat penyelesaian tugas.',
    high: 'Ia sangat teliti dan memperhatikan detail terkecil. Ia memeriksa pekerjaannya berulang kali untuk memastikan tidak ada kesalahan.',
    mid: 'Ia cukup teliti dalam pekerjaan penting namun bisa menerima bahwa tidak semua hal harus sempurna.',
    low: 'Ia tidak terlalu khawatir tentang kesalahan kecil dan lebih fokus pada gambaran besar. Ia cenderung mentoleransi ketidaksempurnaan.',
    very_low: 'Ia sangat toleran terhadap ketidaksempurnaan — tidak membuang waktu untuk memeriksa detail dan lebih mementingkan kecepatan daripada akurasi.',
  },
  prud: {
    name: 'Kebijaksanaan (Prudence)',
    very_high: 'Ia sangat berhati-hati, bahkan cenderung terlalu lama mempertimbangkan sebelum bertindak — analisis yang berlebihan terkadang menghambat responsivitasnya.',
    high: 'Ia sangat berhati-hati dalam mengambil keputusan, mempertimbangkan semua konsekuensi sebelum bertindak, dan menghindari tindakan impulsif.',
    mid: 'Ia cukup bijaksana dalam mengambil keputusan, menimbang risiko namun juga berani bertindak ketika dirasa tepat.',
    low: 'Ia cenderung impulsif dan mengambil keputusan berdasarkan dorongan sesaat. Ia lebih memilih bertindak cepat daripada menganalisis terlalu lama.',
    very_low: 'Ia sangat impulsif — bertindak berdasarkan perasaan saat itu tanpa mempertimbangkan konsekuensi, dan sering menyesali keputusannya belakangan.',
  },

  // === O — Openness to Experience ===
  aesa: {
    name: 'Apresiasi Estetik (Aesthetic Appreciation)',
    very_high: 'Ia sangat terobsesi dengan keindahan — seni, musik, dan alam mampu menggerakkannya secara emosional hingga ke tingkat yang sangat mendalam.',
    high: 'Ia sangat menghargai keindahan dalam seni, alam, dan kehidupan sehari-hari. Ia terpesona oleh karya seni, musik, dan pengalaman estetik.',
    mid: 'Ia dapat menghargai keindahan namun tidak menjadikannya fokus utama. Ia menikmati seni secara kasual.',
    low: 'Ia kurang tertarik pada seni dan estetika. Ia lebih menaruh perhatian pada hal-hal praktis dan fungsional.',
    very_low: 'Ia sama sekali tidak tertarik pada seni atau keindahan — menganggapnya membuang waktu dan lebih memilih hal-hal yang memiliki fungsi nyata.',
  },
  inqu: {
    name: 'Rasa Ingin Tahu (Inquisitiveness)',
    very_high: 'Ia memiliki kelaparan intelektual yang tidak pernah terpuaskan — terus-menerus mencari pengetahuan baru, membaca, dan mendalami topik yang kompleks.',
    high: 'Ia memiliki rasa ingin tahu intelektual yang besar. Ia haus akan pengetahuan baru dan menikmati eksplorasi gagasan dan konsep yang kompleks.',
    mid: 'Ia memiliki rasa ingin tahu yang moderat — tertarik pada topik tertentu namun tidak selalu terdorong untuk menggali lebih dalam.',
    low: 'Ia kurang berminat pada pembelajaran yang bersifat abstrak dan lebih memilih pengetahuan yang langsung aplikatif dalam kehidupan sehari-hari.',
    very_low: 'Ia sama sekali tidak tertarik pada pengetahuan teoretis — hanya peduli pada informasi yang langsung bisa digunakan dalam kehidupan praktis.',
  },
  crea: {
    name: 'Kreativitas (Creativity)',
    very_high: 'Pikirannya tidak pernah berhenti menghasilkan ide-ide baru yang original — imajinasi dan kreativitasnya jauh melampaui rata-rata orang kebanyakan.',
    high: 'Ia memiliki imajinasi yang kaya dan sering menemukan solusi inovatif untuk masalah. Ia menikmati proses kreatif dan berpikir di luar kebiasaan.',
    mid: 'Ia mampu berpikir kreatif ketika dibutuhkan, meskipun tidak selalu mencari pendekatan yang tidak konvensional.',
    low: 'Ia lebih menyukai pendekatan yang sudah terbukti dan tidak terlalu tertarik untuk bereksperimen dengan ide-ide baru yang belum teruji.',
    very_low: 'Ia sangat pragmatis dan menolak ekperimentasi — hanya mau menggunakan cara-cara yang sudah teruji dan menganggap ide baru sebagai risiko yang tidak perlu.',
  },
  unco: {
    name: 'Ketidakkonvensionalan (Unconventionality)',
    very_high: 'Ia sangat tidak konvensional — menantang hampir semua norma yang ada, berpikir dengan cara yang sangat unik, dan tidak peduli dengan pandangan mainstream.',
    high: 'Ia berpikir dengan cara yang unik dan tidak konvensional. Ia menantang norma sosial dan mencari kebenaran melalui perspektif yang tidak mainstream.',
    mid: 'Ia terkadang mempertanyakan konvensi sosial namun secara umum masih mengikuti norma yang berlaku.',
    low: 'Ia menghargai tradisi dan konvensi sosial. Ia percaya bahwa aturan dan norma yang ada memiliki tujuan penting dan layak dipertahankan.',
    very_low: 'Ia sangat konservatif dan konformis — merasa nyaman mengikuti aturan dan tradisi yang ada, dan memandang penyimpangan sebagai ancaman terhadap stabilitas.',
  },

  // === Altruism (Interstitial) ===
  altr: {
    name: 'Altruisme',
    very_high: 'Ia nyaris tanpa pamrih — bersedia mengorbankan waktu, tenaga, bahkan sumber daya pribadinya demi kesejahteraan orang lain meskipun tidak diminta.',
    high: 'Ia memiliki kepedulian yang sangat besar terhadap kesejahteraan orang lain dan bersedia mengorbankan kepentingan pribadinya untuk membantu mereka yang membutuhkan.',
    mid: 'Ia menunjukkan kepedulian yang wajar terhadap orang lain dan bersedia membantu dalam batas-batas yang wajar.',
    low: 'Ia cenderung lebih fokus pada kepentingan pribadinya dan tidak terlalu terdorong untuk mengorbankan waktu atau sumber daya untuk orang lain.',
    very_low: 'Ia sangat self-oriented — prioritas utamanya adalah dirinya sendiri, dan ia nyaris tidak termotivasi untuk membantu orang lain kecuali ada manfaat langsung.',
  },
};

// =========================================
// CROSS-DIMENSIONAL DYNAMICS
// =========================================
export const crossDynamics = {
  'H-high_A-low': 'Menariknya, meskipun ia menjunjung tinggi kejujuran, ia tidak segan bersikap kritis dan tegas dalam mengkonfrontasi ketidakadilan. Kombinasi ini menghasilkan sosok penegak kebenaran yang berani menyuarakan kebenaran.',
  'H-low_X-high': 'Kepercayaan diri sosialnya yang tinggi dikombinasikan dengan ambisi material menciptakan sosok yang terampil dalam membangun jejaring untuk keuntungan pribadi maupun profesional.',
  'E-high_A-high': 'Kepekaan emosionalnya yang tinggi dipadukan dengan sikap ramah menciptakan sosok yang sangat empatik — mampu merasakan dan merespons kebutuhan emosional orang lain secara mendalam.',
  'E-low_C-high': 'Stabilitas emosional yang kuat dikombinasikan dengan disiplin tinggi menghasilkan sosok yang sangat efisien dan produktif dalam mengeksekusi tugas-tugas kompleks tanpa terpengaruh tekanan.',
  'X-high_A-low': 'Energi sosialnya yang tinggi namun dengan sikap kritis menciptakan sosok yang dominan dalam interaksi — ia memimpin percakapan dan tidak ragu menantang ide-ide yang dianggap lemah.',
  'X-low_C-high': 'Kecenderungannya untuk bekerja secara mandiri dipadukan dengan ketelitian tinggi menghasilkan spesialis yang fokus dan produktif — mampu menghasilkan karya berkualitas tanpa gangguan.',
  'X-low_O-high': 'Meskipun cenderung introvert, ia memiliki dunia batin yang sangat kaya dan imajinatif. Ia menggunakan waktu menyendiri untuk eksplorasi intelektual dan kreativitas mendalam.',
  'A-high_C-low': 'Keramahannya yang tinggi namun spontanitas dalam bekerja menciptakan sosok yang menyenangkan namun terkadang kurang konsisten dalam memenuhi komitmen — ia lebih mengutamakan hubungan daripada deadline.',
  'A-low_C-high': 'Ketegasannya dalam berpendapat dipadukan dengan disiplin kerja yang tinggi menghasilkan sosok yang efektif dalam mengelola tim dan proyek — ia menuntut standar tinggi tanpa kompromi.',
  'C-high_O-high': 'Kombinasi disiplin dengan kreativitas menghasilkan sosok inovator yang terstruktur — ia tidak hanya menghasilkan ide-ide brilliant, tetapi juga mampu mengeksekusinya dengan terencana dan terukur.',
  'H-high_E-low': 'Kejujuran yang kuat dikombinasikan dengan ketenangan emosional menciptakan sosok yang berintegritas namun tegas — ia menyampaikan kebenaran tanpa drama emosional.',
  'E-high_X-low': 'Sensitivitas emosional yang tinggi namun introvert menciptakan sosok yang mendalam — ia merasakan emosi secara intens dalam diam, sering kali menjadi pengamat yang tajam atas dinamika emosional di sekitarnya.',
};

// =========================================
// REKOMENDASI PER PATTERN
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
// HELPER
// =========================================
function getLevel(mean) {
  if (mean >= 4.2) return 'very_high';
  if (mean >= 3.5) return 'high';
  if (mean >= 2.8) return 'mid';
  if (mean >= 2.0) return 'low';
  return 'very_low';
}

// =========================================
// MASTER: Generate Comprehensive Interpretation
// =========================================
import { analyzeDiscThreeGraphs } from './discAnalysis';
import { analyzeHexacoProfile } from './hexacoAnalysis';

export function generateLocalInterpretation(discPattern, hexacoFactorMeans, hexacoFacetMeans, discScores) {
  // 1. DISC pattern key
  let patternKey = 'SC';
  if (discPattern) {
    const parts = discPattern.includes('-') ? discPattern.split('-') : [discPattern[0], discPattern[1]];
    patternKey = (parts[0] || 'S') + (parts[1] || 'C');
  }

  const disc = DISC_PATTERNS[patternKey] || DISC_PATTERNS['SC'];

  // 2. DISC 3-Graph Deep Analysis
  let gayaKerja = disc.gayaKerja;
  let discAnalysisResult = null;

  if (discScores?.discMost && discScores?.discLeast && discScores?.discComposite) {
    discAnalysisResult = analyzeDiscThreeGraphs(
      discScores.discMost, discScores.discLeast, discScores.discComposite
    );
    gayaKerja = disc.gayaKerja + '\n\n' + discAnalysisResult.profilUmum
      + '\n\n' + discAnalysisResult.dinamikaAdaptasi;
  }

  // 3. HEXACO Deep Analysis
  const fm = hexacoFactorMeans || {};
  const facets = hexacoFacetMeans || {};
  const hexAnalysis = analyzeHexacoProfile(fm, facets);

  // Build karakter inti narration
  let karakterInti = '';

  // Overview of dimension ranking (No numbers)
  karakterInti += hexAnalysis.dimensiOverview;
  
  // Intra-dimension patterns (facet conflicts/patterns within a dimension)
  if (hexAnalysis.intraInsights.length > 0) {
    karakterInti += '\n\n' + hexAnalysis.intraInsights.join(' ');
  }

  // Build narrative strictly from Facets (to make it highly unique per individual)
  const facetDetailsHigh = [];
  const facetDetailsLow = [];
  const facetKeys = Object.keys(facetTemplates);
  for (const fk of facetKeys) {
    const val = facets[fk];
    if (val !== undefined) {
      const level = getLevel(val);
      if (level === 'high') {
        let text = facetTemplates[fk].high;
        // make sure the text starts with lower case if it begins with "Ia"
        text = text.replace(/^Ia /i, 'ia ');
        facetDetailsHigh.push(text);
      } else if (level === 'low') {
        let text = facetTemplates[fk].low;
        text = text.replace(/^Ia /i, 'ia ');
        facetDetailsLow.push(text);
      }
    }
  }

  if (facetDetailsHigh.length > 0) {
    karakterInti += '\n\nSecara spesifik, pendorong utama karakternya terlihat dari kecenderungannya di mana ' + 
      facetDetailsHigh.slice(0, 5).join(' Selain itu, ') + '.';
  }
  
  if (facetDetailsLow.length > 0) {
    karakterInti += '\n\nDi sisi lain, pendekatannya yang rasional dan adaptif tercermin dari perilakunya di mana ' + 
      facetDetailsLow.slice(0, 5).join(' Hal ini juga didukung oleh bagaimana ') + '.';
  }

  // Cross-dimensional dynamics (from hexacoAnalysis — more extensive)
  if (hexAnalysis.crossInsights.length > 0) {
    karakterInti += '\n\n' + hexAnalysis.crossInsights.join(' ');
  }

  // Archetype
  if (hexAnalysis.archetype) {
    karakterInti += `\n\nSecara keseluruhan, profil ini membentuk arketipe "${hexAnalysis.archetype.name}": ${hexAnalysis.archetype.desc}`;
  }

  // Altruism note
  if (hexAnalysis.altruismNote) {
    karakterInti += '\n\n' + hexAnalysis.altruismNote;
  }

  // 4. Build enhanced recommendations
  const recs = rekomendasi[patternKey] || rekomendasi['SC'];
  let rec1 = recs[0], rec2 = recs[1], rec3 = recs[2];

  if (discAnalysisResult) {
    rec3 = discAnalysisResult.pengembangan;
  }

  return {
    gayaKerja,
    karakterInti: karakterInti.trim(),
    rekomendasi1: rec1,
    rekomendasi2: rec2,
    rekomendasi3: rec3,
    discAnalysis: discAnalysisResult || null,
    hexacoAnalysis: hexAnalysis,
  };
}

