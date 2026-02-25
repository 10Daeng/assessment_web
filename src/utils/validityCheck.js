/**
 * Validity Index Checker — Indeks Validitas Isian Psikometri
 * 
 * Mengukur 4 indikator utama:
 * 1. DURASI   — Apakah waktu pengerjaan wajar? (Min. 8 menit untuk 140 soal)
 * 2. STRAIGHT-LINING — Apakah klien menjawab angka yang sama terus-menerus?
 * 3. EXTREME RESPONDING — Apakah klien hanya menjawab 1 dan 5 saja?
 * 4. INCONSISTENCY — Apakah jawaban pada soal reverse-pair saling bertentangan?
 * 
 * Skor akhir: 0-100 (semakin tinggi = semakin valid)
 * Label:
 *   85-100 = ✅ VALID (Sangat dipercaya)
 *   70-84  = ⚠️ CUKUP VALID (Perlu diperhatikan)
 *   50-69  = ⚠️ MERAGUKAN (Kemungkinan asal-asalan)
 *   0-49   = ❌ TIDAK VALID (Hampir pasti asal-asalan)
 */

import { hexaco100Questions } from '../data/hexaco';

/**
 * Reverse-coded pairs for inconsistency detection within HEXACO.
 * These are pairs of questions measuring the same facet where one is reverse-coded.
 * If a respondent answers both consistently, the difference should be small.
 * Format: [normalItemId, reverseItemId] 
 * Expected: answer[normal] + answer[reverse] ≈ 6 (for 5-point scale)
 */
function getReversePairs() {
  // Group questions by facet
  const facetGroups = {};
  hexaco100Questions.forEach(q => {
    if (!facetGroups[q.facet]) facetGroups[q.facet] = [];
    facetGroups[q.facet].push(q);
  });

  const pairs = [];
  for (const facet in facetGroups) {
    const items = facetGroups[facet];
    const normals = items.filter(q => !q.isReverse);
    const reverses = items.filter(q => q.isReverse);
    
    // Pair each normal with each reverse in the same facet
    for (const n of normals) {
      for (const r of reverses) {
        pairs.push([n.id, r.id]);
      }
    }
  }
  return pairs;
}

/**
 * 1. DURASI CHECK
 * 140 soal total (40 DISC + 100 HEXACO).
 * Waktu wajar minimum: ~8 menit (3.4 detik per soal).
 * Waktu ideal: 15-45 menit.
 */
function checkDuration(durasiText) {
  if (!durasiText || durasiText === 'Tidak diketahui') {
    return { score: 50, label: 'Tidak dapat diukur', detail: 'Data durasi tidak tersedia' };
  }

  // Parse "X menit Y detik"
  const minMatch = durasiText.match(/(\d+)\s*menit/);
  const secMatch = durasiText.match(/(\d+)\s*detik/);
  const totalSeconds = (minMatch ? parseInt(minMatch[1]) * 60 : 0) + (secMatch ? parseInt(secMatch[1]) : 0);

  if (totalSeconds < 300) { // < 5 menit
    return { score: 10, label: 'Sangat Cepat', detail: `${durasiText} — Terlalu cepat, hampir pasti asal klik`, totalSeconds };
  } else if (totalSeconds < 480) { // < 8 menit
    return { score: 35, label: 'Terlalu Cepat', detail: `${durasiText} — Kemungkinan besar tidak membaca soal`, totalSeconds };
  } else if (totalSeconds < 600) { // < 10 menit
    return { score: 60, label: 'Agak Cepat', detail: `${durasiText} — Mungkin terburu-buru`, totalSeconds };
  } else if (totalSeconds <= 3600) { // 10-60 menit
    return { score: 100, label: 'Wajar', detail: `${durasiText} — Durasi normal`, totalSeconds };
  } else { // > 60 menit
    return { score: 80, label: 'Sangat Lama', detail: `${durasiText} — Mungkin ada jeda/istirahat`, totalSeconds };
  }
}

/**
 * 2. STRAIGHT-LINING CHECK
 * Menghitung persentase jawaban yang sama berturut-turut.
 * Jika > 80% jawaban sama = sangat mencurigakan.
 */
function checkStraightLining(hexacoAnswers) {
  if (!hexacoAnswers || Object.keys(hexacoAnswers).length === 0) {
    return { score: 50, label: 'Tidak dapat diukur', detail: 'Data jawaban tidak tersedia', stats: {} };
  }

  const values = [];
  for (let i = 1; i <= 100; i++) {
    if (hexacoAnswers[i] !== undefined) values.push(hexacoAnswers[i]);
  }

  if (values.length === 0) {
    return { score: 50, label: 'Tidak dapat diukur', detail: 'Tidak ada jawaban HEXACO', stats: {} };
  }

  // Count frequency of each answer
  const freq = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  values.forEach(v => { if (freq[v] !== undefined) freq[v]++; });

  // Find the most frequent answer
  const maxFreq = Math.max(...Object.values(freq));
  const dominantPct = (maxFreq / values.length) * 100;

  // Count consecutive identical answers (runs)
  let maxRun = 1, currentRun = 1;
  for (let i = 1; i < values.length; i++) {
    if (values[i] === values[i - 1]) {
      currentRun++;
      if (currentRun > maxRun) maxRun = currentRun;
    } else {
      currentRun = 1;
    }
  }

  // Standard deviation of answers (low SD = suspicious)
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((acc, v) => acc + (v - mean) ** 2, 0) / values.length;
  const sd = Math.sqrt(variance);

  let score;
  if (dominantPct >= 80) {
    score = 5;
  } else if (dominantPct >= 60) {
    score = 30;
  } else if (dominantPct >= 45) {
    score = 60;
  } else if (sd < 0.5) {
    score = 25; // Very low variance
  } else {
    score = 100;
  }

  const label = score >= 85 ? 'Normal' : score >= 60 ? 'Agak Seragam' : score >= 30 ? 'Mencurigakan' : 'Sangat Seragam';

  return {
    score,
    label,
    detail: `Jawaban paling sering: ${dominantPct.toFixed(0)}% sama | Run terpanjang: ${maxRun} berturut-turut | SD: ${sd.toFixed(2)}`,
    stats: { freq, dominantPct: dominantPct.toFixed(1), maxRun, sd: sd.toFixed(2) }
  };
}

/**
 * 3. EXTREME RESPONDING CHECK
 * Menghitung berapa banyak jawaban hanya 1 atau 5 (ekstrem).
 * Normal: 20-40% ekstrem. Terlalu tinggi (>70%) = mencurigakan.
 */
function checkExtremeResponding(hexacoAnswers) {
  if (!hexacoAnswers || Object.keys(hexacoAnswers).length === 0) {
    return { score: 50, label: 'Tidak dapat diukur', detail: 'Data jawaban tidak tersedia' };
  }

  const values = [];
  for (let i = 1; i <= 100; i++) {
    if (hexacoAnswers[i] !== undefined) values.push(hexacoAnswers[i]);
  }

  const extremeCount = values.filter(v => v === 1 || v === 5).length;
  const extremePct = (extremeCount / values.length) * 100;

  let score;
  if (extremePct >= 80) {
    score = 10;
  } else if (extremePct >= 60) {
    score = 40;
  } else if (extremePct >= 50) {
    score = 65;
  } else {
    score = 100;
  }

  const label = score >= 85 ? 'Normal' : score >= 60 ? 'Agak Ekstrem' : score >= 30 ? 'Terlalu Ekstrem' : 'Sangat Ekstrem';

  return {
    score,
    label,
    detail: `${extremeCount} dari ${values.length} jawaban (${extremePct.toFixed(0)}%) adalah nilai ekstrem (1 atau 5)`,
    extremePct: extremePct.toFixed(1)
  };
}

/**
 * 4. INCONSISTENCY CHECK
 * Membandingkan jawaban pada soal yang mengukur aspek yang sama (reverse-coded pairs).
 * Pada skala 1-5, jika soal normal dijawab X dan soal reverse dijawab Y,
 * maka X + Y seharusnya ≈ 6. Deviasi besar = inkonsisten.
 */
function checkInconsistency(hexacoAnswers) {
  if (!hexacoAnswers || Object.keys(hexacoAnswers).length === 0) {
    return { score: 50, label: 'Tidak dapat diukur', detail: 'Data jawaban tidak tersedia' };
  }

  const pairs = getReversePairs();
  let totalDeviation = 0;
  let pairCount = 0;
  let flaggedPairs = 0;

  for (const [normalId, reverseId] of pairs) {
    const a = hexacoAnswers[normalId];
    const b = hexacoAnswers[reverseId];
    if (a !== undefined && b !== undefined) {
      // Expected: a + b ≈ 6 for perfectly consistent answers
      const deviation = Math.abs((a + b) - 6);
      totalDeviation += deviation;
      pairCount++;
      if (deviation >= 3) flaggedPairs++; // Very inconsistent pair
    }
  }

  if (pairCount === 0) {
    return { score: 50, label: 'Tidak dapat diukur', detail: 'Tidak cukup data pasangan soal' };
  }

  const avgDeviation = totalDeviation / pairCount;

  let score;
  if (avgDeviation <= 1.0) {
    score = 100;
  } else if (avgDeviation <= 1.5) {
    score = 80;
  } else if (avgDeviation <= 2.0) {
    score = 55;
  } else if (avgDeviation <= 2.5) {
    score = 35;
  } else {
    score = 15;
  }

  const label = score >= 85 ? 'Konsisten' : score >= 60 ? 'Cukup Konsisten' : score >= 30 ? 'Inkonsisten' : 'Sangat Inkonsisten';

  return {
    score,
    label,
    detail: `Rata-rata deviasi: ${avgDeviation.toFixed(2)} | ${flaggedPairs} dari ${pairCount} pasangan soal sangat inkonsisten`,
    avgDeviation: avgDeviation.toFixed(2),
    flaggedPairs,
    totalPairs: pairCount
  };
}

/**
 * MASTER FUNCTION: Menghitung Validity Index keseluruhan
 * Bobot: Durasi 20%, Straight-lining 30%, Extreme 20%, Inconsistency 30%
 */
export function calculateValidityIndex(rawData) {
  const durasiText = rawData?.userData?.durasi;
  const hexacoAnswers = rawData?.answers?.hexaco;

  const duration = checkDuration(durasiText);
  const straightLining = checkStraightLining(hexacoAnswers);
  const extreme = checkExtremeResponding(hexacoAnswers);
  const inconsistency = checkInconsistency(hexacoAnswers);

  // Weighted Average
  const overallScore = Math.round(
    (duration.score * 0.20) +
    (straightLining.score * 0.30) +
    (extreme.score * 0.20) +
    (inconsistency.score * 0.30)
  );

  let overallLabel, overallColor;
  if (overallScore >= 85) {
    overallLabel = 'VALID';
    overallColor = '#22c55e'; // green
  } else if (overallScore >= 70) {
    overallLabel = 'CUKUP VALID';
    overallColor = '#eab308'; // yellow
  } else if (overallScore >= 50) {
    overallLabel = 'MERAGUKAN';
    overallColor = '#f97316'; // orange
  } else {
    overallLabel = 'TIDAK VALID';
    overallColor = '#ef4444'; // red
  }

  return {
    overallScore,
    overallLabel,
    overallColor,
    indicators: {
      duration,
      straightLining,
      extreme,
      inconsistency
    }
  };
}
