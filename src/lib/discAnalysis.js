/**
 * Engine Analisis DISC 3-Grafik Komprehensif
 * 
 * Membandingkan Grafik 1 (Publik/Mask), Grafik 2 (Pribadi/Core),
 * dan Grafik 3 (Aktual/Composite) untuk menghasilkan:
 * - Dinamika adaptasi (gap publik vs pribadi)
 * - Kelebihan & tantangan
 * - Potensi terpendam
 * - Arah pengembangan
 * - Narasi dinamis lintas-grafik
 */

const DIMS = ['D', 'I', 'S', 'C'];
const _DIM_NAMES = { D: 'Dominance', I: 'Influence', S: 'Steadiness', C: 'Compliance' };
const DIM_NAMES_ID = { D: 'Ketegasan', I: 'Pengaruh', S: 'Kestabilan', C: 'Kepatuhan' };

// =========================================
// Per-dimension meaning at different levels
// =========================================
const dimMeaning = {
  D: {
    high: { trait: 'tegas, kompetitif, dan berorientasi hasil', behavior: 'mengambil keputusan cepat, mengarahkan orang lain, dan menantang status quo' },
    mid: { trait: 'cukup asertif namun tidak terlalu mendominasi', behavior: 'mampu memimpin ketika dibutuhkan namun juga bisa mengikuti arahan orang lain' },
    low: { trait: 'kooperatif, akomodatif, dan menghindari konfrontasi', behavior: 'lebih memilih konsensus daripada konflik, dan cenderung mendukung keputusan kelompok' },
  },
  I: {
    high: { trait: 'ekspresif, antusias, dan pandai bersosialisasi', behavior: 'membangun relasi dengan mudah, berbicara dengan penuh semangat, dan mempengaruhi orang melalui emosi' },
    mid: { trait: 'cukup ramah dan komunikatif namun selektif', behavior: 'dapat bersosialisasi dengan baik ketika diperlukan namun juga nyaman bekerja sendiri' },
    low: { trait: 'pendiam, reflektif, dan berpegang pada fakta', behavior: 'lebih memilih komunikasi tertulis, menghindari small talk, dan mengandalkan data daripada emosi' },
  },
  S: {
    high: { trait: 'sabar, konsisten, dan loyal', behavior: 'menciptakan stabilitas, menyelesaikan tugas secara metodis, dan mendukung tim dengan tenang' },
    mid: { trait: 'cukup adaptif dengan keseimbangan antara stabilitas dan fleksibilitas', behavior: 'mampu menghadapi perubahan namun tetap menghargai keteraturan' },
    low: { trait: 'dinamis, cepat bergerak, dan menyukai variasi', behavior: 'mudah bosan dengan rutinitas, mencari tantangan baru, dan nyaman dengan perubahan cepat' },
  },
  C: {
    high: { trait: 'analitis, cermat, dan mengutamakan kualitas', behavior: 'mengikuti prosedur dengan ketat, memeriksa detail, dan menghindari kesalahan' },
    mid: { trait: 'cukup teliti namun tidak berlebihan', behavior: 'memperhatikan kualitas tanpa menjadi perfeksionis yang menghambat progres' },
    low: { trait: 'independen, fleksibel terhadap aturan, dan berani mengambil risiko', behavior: 'tidak terikat prosedur kaku, mengutamakan kecepatan dan kreativitas daripada kepatuhan' },
  },
};

// =========================================
// Gap interpretation (Publik vs Pribadi)
// =========================================
const gapMeaning = {
  D: {
    pub_high_pri_low: 'Dalam lingkungan sosial, ia berusaha tampil lebih tegas dan mengambil kendali daripada sifat aslinya. Di dalam dirinya, ia sebenarnya lebih kooperatif dan tidak terlalu menuntut. Adaptasi ini menunjukkan bahwa ia memandang ketegasan sebagai hal yang diharapkan lingkungan.',
    pub_low_pri_high: 'Meskipun secara alami ia memiliki dorongan kompetitif dan ketegasan yang kuat, ia cenderung menyembunyikan sisi ini di depan publik. Ia mungkin merasa bahwa menunjukkan dominasi secara terbuka kurang diterima, sehingga ia "menahan" sifat aslinya.',
    both_high: 'Ia secara konsisten tegas dan berorientasi hasil, baik di depan publik maupun di kehidupan pribadinya. Ini adalah sifat yang autentik dan tidak memerlukan adaptasi signifikan.',
    both_low: 'Ia secara konsisten lebih memilih jalur kooperatif dan kolaboratif. Ia tidak merasa perlu menunjukkan ketegasan berlebihan, baik di depan publik maupun secara pribadi.',
  },
  I: {
    pub_high_pri_low: 'Ia berusaha tampil lebih ramah dan ekspresif di depan orang lain daripada dirinya yang sebenarnya. Secara alami, ia lebih pendiam dan reflektif, namun ia mengadaptasi perilakunya untuk memenuhi harapan sosial.',
    pub_low_pri_high: 'Di balik tampilan yang tenang dan terukur, ia sebenarnya memiliki sisi sosial dan ekspresif yang kuat. Ia memilih untuk tidak menampilkannya secara terbuka, mungkin karena konteks kerja yang lebih formal.',
    both_high: 'Ia memang secara alami ramah, ekspresif, dan antusias. Sifat sosialnya autentik dan konsisten di berbagai situasi.',
    both_low: 'Ia secara konsisten lebih mengandalkan fakta dan logika daripada emosi dalam berkomunikasi. Ia nyaman dengan pendekatan yang lebih terukur dan substantif.',
  },
  S: {
    pub_high_pri_low: 'Di depan orang lain, ia menampilkan kesabaran dan stabilitas yang lebih besar daripada sifat aslinya. Secara pribadi, ia sebenarnya lebih dinamis dan menyukai perubahan daripada yang ia tunjukkan.',
    pub_low_pri_high: 'Meskipun secara alami ia menghargai stabilitas dan konsistensi, ia menekan sisi ini di lingkungan sosialnya. Ia berusaha tampil lebih adaptif dan terbuka terhadap perubahan di depan publik.',
    both_high: 'Ia secara autentik sabar, konsisten, dan menghargai stabilitas. Sifat ini ternuansakan di semua aspek kehidupannya.',
    both_low: 'Ia memang secara alami menyukai dinamika, kecepatan, dan variasi. Ia tidak berpura-pura menyukai rutinitas.',
  },
  C: {
    pub_high_pri_low: 'Ia berusaha tampil lebih teliti dan teratur di depan orang lain daripada dirinya yang sebenarnya. Secara pribadi, ia lebih santai terhadap aturan dan prosedur.',
    pub_low_pri_high: 'Di balik tampilan yang santai dan fleksibel, ia sebenarnya memiliki standar internal yang tinggi dan perhatian terhadap detail yang kuat. Ia memilih untuk tidak menampilkan sisi perfeksionisnya secara terbuka.',
    both_high: 'Ia secara konsisten teliti, cermat, dan berorientasi pada kualitas. Standar tingginya autentik dan konsisten di semua situasi.',
    both_low: 'Ia secara konsisten memprioritaskan kecepatan dan fleksibilitas daripada ketelitian yang berlebihan. Ia nyaman mengambil risiko dan tidak terlalu terikat aturan.',
  },
};

// =========================================
// Strength & Challenge templates
// =========================================
const strengths = {
  D: { high: 'Ketegasan dan kemampuan leadership yang kuat', low: 'Kemampuan bekerja sama dan menghargai pendapat orang lain' },
  I: { high: 'Kemampuan komunikasi dan membangun relasi yang luar biasa', low: 'Fokus pada substansi dan kemampuan analisis yang mendalam' },
  S: { high: 'Konsistensi, keandalan, dan loyalitas yang tinggi', low: 'Fleksibilitas dan kemampuan beradaptasi dengan perubahan cepat' },
  C: { high: 'Ketelitian, akurasi, dan komitmen terhadap kualitas', low: 'Keberanian mengambil risiko dan berpikir out-of-the-box' },
};

const challenges = {
  D: { high: 'Perlu melatih kesabaran dan empati dalam berinteraksi', low: 'Perlu melatih ketegasan dalam mengambil keputusan sulit' },
  I: { high: 'Perlu meningkatkan disiplin dalam tindak lanjut dan penyelesaian detail', low: 'Perlu mengembangkan kemampuan ekspresi dan persuasi' },
  S: { high: 'Perlu melatih kemauan untuk menerima dan menginisiasi perubahan', low: 'Perlu membangun kesabaran dan konsistensi dalam rutinitas' },
  C: { high: 'Perlu mengurangi perfeksionisme yang menghambat kecepatan', low: 'Perlu meningkatkan perhatian pada detail dan prosedur' },
};

// =========================================
// HELPERS
// =========================================
function getLevel(score) {
  if (score >= 6) return 'high';
  if (score >= -5) return 'mid';
  return 'low';
}

function getGapType(pub, pri) {
  const pubLevel = getLevel(pub);
  const priLevel = getLevel(pri);
  
  if (pubLevel === 'high' && priLevel === 'low') return 'pub_high_pri_low';
  if (pubLevel === 'low' && priLevel === 'high') return 'pub_low_pri_high';
  if (pubLevel === 'high' || priLevel === 'high') return 'both_high';
  if (pubLevel === 'low' || priLevel === 'low') return 'both_low';
  if (pubLevel === 'high' && priLevel === 'high') return 'both_high';
  // Default for mid-mid or mixed
  return pub > pri ? 'pub_high_pri_low' : pri > pub ? 'pub_low_pri_high' : 'both_high';
}

function sortDims(scores) {
  return DIMS.map(d => ({ dim: d, score: scores?.[d] || 0 }))
    .sort((a, b) => b.score - a.score);
}

// =========================================
// MASTER: Analyze 3 DISC Graphs
// =========================================
export function analyzeDiscThreeGraphs(discMost, discLeast, discComposite) {
  const pub = discMost || { D: 0, I: 0, S: 0, C: 0 };
  const pri = discLeast || { D: 0, I: 0, S: 0, C: 0 };
  const act = discComposite || { D: 0, I: 0, S: 0, C: 0 };

  // Sorted dimensions per graph
  const pubRank = sortDims(pub);
  const priRank = sortDims(pri);
  const actRank = sortDims(act);

  const dominant = actRank[0];
  const secondary = actRank[1];
  const weakest = actRank[3];

  // ====== 1. PROFIL UMUM (Aktual) ======
  let profilUmum = `Berdasarkan profil aktual, dimensi yang paling menonjol pada individu ini adalah ${DIM_NAMES_ID[dominant.dim]} (${dominant.dim}), yang berarti ia secara keseluruhan ${dimMeaning[dominant.dim][getLevel(dominant.score)].trait}. `;
  profilUmum += `Dimensi kedua yang dominan adalah ${DIM_NAMES_ID[secondary.dim]} (${secondary.dim}), di mana ia ${dimMeaning[secondary.dim][getLevel(secondary.score)].trait}. `;
  profilUmum += `Sementara itu, dimensi ${DIM_NAMES_ID[weakest.dim]} (${weakest.dim}) berada pada posisi terendah, yang menunjukkan ia ${dimMeaning[weakest.dim][getLevel(weakest.score)].trait}.`;

  // ====== 2. DINAMIKA ADAPTASI (Gap Publik vs Pribadi) ======
  let dinamikaAdaptasi = '';
  const significantGaps = [];

  for (const d of DIMS) {
    const gap = Math.abs((pub[d] || 0) - (pri[d] || 0));
    if (gap >= 5) {
      significantGaps.push({ dim: d, gap, pubScore: pub[d] || 0, priScore: pri[d] || 0 });
    }
  }

  if (significantGaps.length > 0) {
    dinamikaAdaptasi = 'Terdapat perbedaan menarik antara tampilan publik dan sifat pribadi individu ini. ';
    for (const sg of significantGaps) {
      const gapType = getGapType(sg.pubScore, sg.priScore);
      dinamikaAdaptasi += gapMeaning[sg.dim][gapType] + ' ';
    }
    dinamikaAdaptasi += '\n\nPerbedaan ini menunjukkan adanya upaya adaptasi yang signifikan — ia menggunakan energi psikologis untuk menyesuaikan perilakunya dengan tuntutan lingkungan. Semakin besar gap antara publik dan pribadi, semakin tinggi tekanan adaptif yang dialami.';
  } else {
    dinamikaAdaptasi = 'Profil publik dan pribadi individu ini cukup konsisten, yang menunjukkan bahwa ia relatif autentik dalam menampilkan dirinya. Ia tidak merasa perlu "memakai topeng" yang berbeda secara signifikan di lingkungan sosial dibanding kehidupan pribadinya. Konsistensi ini umumnya mengindikasikan tingkat kenyamanan yang tinggi dengan sifat alaminya.';
  }

  // ====== 3. KELEBIHAN ======
  const kelebihanList = [];
  for (const d of DIMS) {
    const level = getLevel(act[d] || 0);
    if (level === 'high' || level === 'low') {
      kelebihanList.push(strengths[d][level]);
    }
  }
  // Always include top 2
  if (kelebihanList.length < 2) {
    kelebihanList.push(strengths[dominant.dim][getLevel(dominant.score) === 'mid' ? 'high' : getLevel(dominant.score)]);
    kelebihanList.push(strengths[secondary.dim][getLevel(secondary.score) === 'mid' ? 'high' : getLevel(secondary.score)]);
  }

  // ====== 4. TANTANGAN ======
  const tantanganList = [];
  for (const d of DIMS) {
    const level = getLevel(act[d] || 0);
    if (level === 'high' || level === 'low') {
      tantanganList.push(challenges[d][level]);
    }
  }
  if (tantanganList.length < 2) {
    tantanganList.push(challenges[dominant.dim][getLevel(dominant.score) === 'mid' ? 'high' : getLevel(dominant.score)]);
  }

  // ====== 5. POTENSI TERPENDAM ======
  let potensi = '';
  // Look for dimensions where Private is high but Public is low (hidden strengths)
  const hiddenStrengths = DIMS.filter(d => (pri[d] || 0) > 5 && (pub[d] || 0) < 0);
  if (hiddenStrengths.length > 0) {
    const hs = hiddenStrengths[0];
    potensi = `Individu ini memiliki potensi terpendam pada dimensi ${DIM_NAMES_ID[hs]} (${hs}). Secara pribadi, ia memiliki sifat ${dimMeaning[hs].high.trait}, namun belum sepenuhnya menampilkannya di lingkungan publik. Jika diberi ruang dan kepercayaan yang tepat, potensi ini dapat berkembang menjadi kekuatan utama.`;
  } else {
    // Look for strong secondary dimension
    potensi = `Dimensi ${DIM_NAMES_ID[secondary.dim]} (${secondary.dim}) yang kuat memberikan potensi pengembangan yang menarik. Dengan penguatan lebih lanjut, individu ini dapat menjadi lebih efektif dalam ${dimMeaning[secondary.dim][getLevel(secondary.score)].behavior}.`;
  }

  // ====== 6. ARAH PENGEMBANGAN ======
  let pengembangan = `Untuk pengembangan optimal, individu ini disarankan untuk: `;
  const devAreas = [];
  // Weakest actual dimension
  devAreas.push(`memperkuat aspek ${DIM_NAMES_ID[weakest.dim]} dengan melatih diri untuk ${dimMeaning[weakest.dim][weakest.score < 0 ? 'high' : 'mid'].behavior}`);
  // Gap-based development
  if (significantGaps.length > 0) {
    const sg = significantGaps[0];
    if (sg.pubScore > sg.priScore) {
      devAreas.push(`mengurangi tekanan adaptif pada dimensi ${DIM_NAMES_ID[sg.dim]} dengan lebih menerima sifat alaminya, sehingga energi psikologis dapat dialihkan untuk hal yang lebih produktif`);
    } else {
      devAreas.push(`lebih berani menampilkan sisi ${DIM_NAMES_ID[sg.dim]}-nya di lingkungan publik, karena ia memiliki kapasitas internal yang kuat pada aspek ini`);
    }
  }
  pengembangan += devAreas.join('; serta ') + '.';

  // ====== 7. ENERGY INDEX ======
  let totalGap = 0;
  for (const d of DIMS) {
    totalGap += Math.abs((pub[d] || 0) - (pri[d] || 0));
  }
  const energyLevel = totalGap >= 30 ? 'Sangat Tinggi' : totalGap >= 20 ? 'Tinggi' : totalGap >= 10 ? 'Moderat' : 'Rendah';
  const energyNote = totalGap >= 20
    ? `Indeks tekanan adaptif individu ini termasuk ${energyLevel.toLowerCase()} (gap total: ${totalGap}). Ia menggunakan energi psikologis yang cukup besar untuk menyesuaikan penampilannya dengan harapan lingkungan. Dalam jangka panjang, hal ini dapat menimbulkan kelelahan emosional jika tidak dikelola.`
    : `Indeks tekanan adaptif individu ini termasuk ${energyLevel.toLowerCase()} (gap total: ${totalGap}). Ia relatif autentik dalam menampilkan dirinya, yang berarti ia tidak banyak membuang energi psikologis untuk "berakting" di lingkungan sosial.`;

  return {
    profilUmum,
    dinamikaAdaptasi,
    kelebihan: [...new Set(kelebihanList)].slice(0, 4),
    tantangan: [...new Set(tantanganList)].slice(0, 3),
    potensi,
    pengembangan,
    energyNote,
    energyLevel,
    totalGap,
    // Raw analysis for display
    ranks: { publik: pubRank, pribadi: priRank, aktual: actRank },
    significantGaps,
  };
}
