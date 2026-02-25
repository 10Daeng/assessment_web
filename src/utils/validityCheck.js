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
 */
function getReversePairs() {
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
    for (const n of normals) {
      for (const r of reverses) {
        pairs.push([n.id, r.id]);
      }
    }
  }
  return pairs;
}

// ==================================================
// 1. DURASI CHECK
// ==================================================
function checkDuration(durasiText) {
  if (!durasiText || durasiText === 'Tidak diketahui') {
    return { score: -1, label: 'Tidak tersedia', detail: 'Fitur durasi belum tersedia saat klien ini mengisi' };
  }

  const minMatch = durasiText.match(/(\d+)\s*menit/);
  const secMatch = durasiText.match(/(\d+)\s*detik/);
  const totalSeconds = (minMatch ? parseInt(minMatch[1]) * 60 : 0) + (secMatch ? parseInt(secMatch[1]) : 0);

  if (totalSeconds < 300) {
    return { score: 10, label: 'Sangat Cepat', detail: `${durasiText} — Terlalu cepat, hampir pasti asal klik`, totalSeconds };
  } else if (totalSeconds < 480) {
    return { score: 35, label: 'Terlalu Cepat', detail: `${durasiText} — Kemungkinan besar tidak membaca soal`, totalSeconds };
  } else if (totalSeconds < 600) {
    return { score: 60, label: 'Agak Cepat', detail: `${durasiText} — Mungkin terburu-buru`, totalSeconds };
  } else if (totalSeconds <= 3600) {
    return { score: 100, label: 'Wajar', detail: `${durasiText} — Durasi normal`, totalSeconds };
  } else {
    return { score: 80, label: 'Sangat Lama', detail: `${durasiText} — Mungkin ada jeda/istirahat`, totalSeconds };
  }
}

// ==================================================
// 2. STRAIGHT-LINING CHECK
// ==================================================
function checkStraightLining(hexacoAnswers, facetMeans) {
  // FULL MODE: Raw answers available
  if (hexacoAnswers && Object.keys(hexacoAnswers).length > 0) {
    const values = [];
    for (let i = 1; i <= 100; i++) {
      if (hexacoAnswers[i] !== undefined) values.push(hexacoAnswers[i]);
    }
    if (values.length === 0) return fallbackStraightLining(facetMeans);

    const freq = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    values.forEach(v => { if (freq[v] !== undefined) freq[v]++; });

    const maxFreq = Math.max(...Object.values(freq));
    const dominantPct = (maxFreq / values.length) * 100;

    let maxRun = 1, currentRun = 1;
    for (let i = 1; i < values.length; i++) {
      if (values[i] === values[i - 1]) {
        currentRun++;
        if (currentRun > maxRun) maxRun = currentRun;
      } else {
        currentRun = 1;
      }
    }

    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((acc, v) => acc + (v - mean) ** 2, 0) / values.length;
    const sd = Math.sqrt(variance);

    let score;
    if (dominantPct >= 80) score = 5;
    else if (dominantPct >= 60) score = 30;
    else if (dominantPct >= 45) score = 60;
    else if (sd < 0.5) score = 25;
    else score = 100;

    const label = score >= 85 ? 'Normal' : score >= 60 ? 'Agak Seragam' : score >= 30 ? 'Mencurigakan' : 'Sangat Seragam';
    return {
      score, label, mode: 'full',
      detail: `Jawaban paling sering: ${dominantPct.toFixed(0)}% sama | Run terpanjang: ${maxRun} | SD: ${sd.toFixed(2)}`
    };
  }

  // FALLBACK MODE: Use facet means
  return fallbackStraightLining(facetMeans);
}

function fallbackStraightLining(facetMeans) {
  if (!facetMeans || Object.keys(facetMeans).length === 0) {
    return { score: -1, label: 'Tidak tersedia', detail: 'Data jawaban mentah tidak tersedia', mode: 'none' };
  }

  const values = Object.values(facetMeans).filter(v => typeof v === 'number');
  if (values.length < 5) {
    return { score: -1, label: 'Tidak tersedia', detail: 'Data facet terlalu sedikit', mode: 'none' };
  }

  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((acc, v) => acc + (v - mean) ** 2, 0) / values.length;
  const sd = Math.sqrt(variance);

  let score;
  if (sd < 0.15) score = 15;       // Semua facet nyaris identik = sangat mencurigakan
  else if (sd < 0.30) score = 40;   // Terlalu seragam
  else if (sd < 0.45) score = 65;   // Agak seragam
  else score = 95;                   // Variasi normal

  const label = score >= 85 ? 'Normal' : score >= 60 ? 'Agak Seragam' : score >= 30 ? 'Mencurigakan' : 'Sangat Seragam';
  return {
    score, label, mode: 'facet',
    detail: `Analisis dari ${values.length} skor facet | Variasi (SD): ${sd.toFixed(3)} | (Estimasi dari data agregat)`
  };
}

// ==================================================
// 3. EXTREME RESPONDING CHECK
// ==================================================
function checkExtremeResponding(hexacoAnswers, facetMeans) {
  // FULL MODE
  if (hexacoAnswers && Object.keys(hexacoAnswers).length > 0) {
    const values = [];
    for (let i = 1; i <= 100; i++) {
      if (hexacoAnswers[i] !== undefined) values.push(hexacoAnswers[i]);
    }
    if (values.length === 0) return fallbackExtreme(facetMeans);

    const extremeCount = values.filter(v => v === 1 || v === 5).length;
    const extremePct = (extremeCount / values.length) * 100;

    let score;
    if (extremePct >= 80) score = 10;
    else if (extremePct >= 60) score = 40;
    else if (extremePct >= 50) score = 65;
    else score = 100;

    const label = score >= 85 ? 'Normal' : score >= 60 ? 'Agak Ekstrem' : score >= 30 ? 'Terlalu Ekstrem' : 'Sangat Ekstrem';
    return {
      score, label, mode: 'full',
      detail: `${extremeCount} dari ${values.length} jawaban (${extremePct.toFixed(0)}%) adalah nilai ekstrem (1 atau 5)`
    };
  }

  // FALLBACK MODE
  return fallbackExtreme(facetMeans);
}

function fallbackExtreme(facetMeans) {
  if (!facetMeans || Object.keys(facetMeans).length === 0) {
    return { score: -1, label: 'Tidak tersedia', detail: 'Data jawaban mentah tidak tersedia', mode: 'none' };
  }

  const values = Object.values(facetMeans).filter(v => typeof v === 'number');
  // Facet means near 1.0 or 5.0 suggest extreme responding
  const extremeFacets = values.filter(v => v <= 1.3 || v >= 4.7).length;
  const extremePct = (extremeFacets / values.length) * 100;

  let score;
  if (extremePct >= 70) score = 20;
  else if (extremePct >= 50) score = 50;
  else if (extremePct >= 35) score = 70;
  else score = 95;

  const label = score >= 85 ? 'Normal' : score >= 60 ? 'Agak Ekstrem' : score >= 30 ? 'Terlalu Ekstrem' : 'Sangat Ekstrem';
  return {
    score, label, mode: 'facet',
    detail: `${extremeFacets} dari ${values.length} facet memiliki skor ekstrem (≤1.3 atau ≥4.7) | (Estimasi dari data agregat)`
  };
}

// ==================================================
// 4. INCONSISTENCY CHECK
// ==================================================
function checkInconsistency(hexacoAnswers, factorMeans) {
  // FULL MODE
  if (hexacoAnswers && Object.keys(hexacoAnswers).length > 0) {
    const pairs = getReversePairs();
    let totalDeviation = 0, pairCount = 0, flaggedPairs = 0;

    for (const [normalId, reverseId] of pairs) {
      const a = hexacoAnswers[normalId];
      const b = hexacoAnswers[reverseId];
      if (a !== undefined && b !== undefined) {
        const deviation = Math.abs((a + b) - 6);
        totalDeviation += deviation;
        pairCount++;
        if (deviation >= 3) flaggedPairs++;
      }
    }

    if (pairCount === 0) return fallbackInconsistency(factorMeans);

    const avgDeviation = totalDeviation / pairCount;

    let score;
    if (avgDeviation <= 1.0) score = 100;
    else if (avgDeviation <= 1.5) score = 80;
    else if (avgDeviation <= 2.0) score = 55;
    else if (avgDeviation <= 2.5) score = 35;
    else score = 15;

    const label = score >= 85 ? 'Konsisten' : score >= 60 ? 'Cukup Konsisten' : score >= 30 ? 'Inkonsisten' : 'Sangat Inkonsisten';
    return {
      score, label, mode: 'full',
      detail: `Rata-rata deviasi: ${avgDeviation.toFixed(2)} | ${flaggedPairs} dari ${pairCount} pasangan soal sangat inkonsisten`
    };
  }

  // FALLBACK MODE
  return fallbackInconsistency(factorMeans);
}

function fallbackInconsistency(factorMeans) {
  if (!factorMeans || Object.keys(factorMeans).length === 0) {
    return { score: -1, label: 'Tidak tersedia', detail: 'Data jawaban mentah tidak tersedia', mode: 'none' };
  }

  // Heuristic: if all 6 factor means are nearly identical, respondent
  // may have answered randomly (random answers converge to ~3.0 for all factors)
  const values = Object.values(factorMeans).filter(v => typeof v === 'number');
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((acc, v) => acc + (v - mean) ** 2, 0) / values.length;
  const sd = Math.sqrt(variance);

  // Also check if all values cluster around 3.0 (neutral / random)
  const avgDistFrom3 = values.reduce((acc, v) => acc + Math.abs(v - 3.0), 0) / values.length;

  let score;
  if (sd < 0.15 && avgDistFrom3 < 0.3) {
    score = 20; // All factors ≈ 3.0 = likely random
  } else if (sd < 0.25) {
    score = 50; // Suspiciously uniform
  } else if (sd < 0.40) {
    score = 70; // Somewhat uniform but could be genuine
  } else {
    score = 90; // Healthy variation between factors
  }

  const label = score >= 85 ? 'Konsisten' : score >= 60 ? 'Cukup Konsisten' : score >= 30 ? 'Meragukan' : 'Sangat Meragukan';
  return {
    score, label, mode: 'facet',
    detail: `Variasi antar-dimensi (SD): ${sd.toFixed(3)} | Jarak dari titik netral: ${avgDistFrom3.toFixed(2)} | (Estimasi dari data agregat)`
  };
}

// ==================================================
// MASTER FUNCTION
// ==================================================
export function calculateValidityIndex(rawData, submissionData) {
  const durasiText = rawData?.userData?.durasi;
  const hexacoAnswers = rawData?.answers?.hexaco;
  // Try rawData first, then fall back to submission-level hexacoScores
  const facetMeans = rawData?.hexacoScores?.facetMeans || submissionData?.hexacoScores?.facetMeans;
  const factorMeans = rawData?.hexacoScores?.factorMeans || submissionData?.hexacoScores?.factorMeans;

  const duration = checkDuration(durasiText);
  const straightLining = checkStraightLining(hexacoAnswers, facetMeans);
  const extreme = checkExtremeResponding(hexacoAnswers, facetMeans);
  const inconsistency = checkInconsistency(hexacoAnswers, factorMeans);

  // Collect valid scores (skip -1 = not available)
  const indicators = [
    { data: duration, weight: 0.20 },
    { data: straightLining, weight: 0.30 },
    { data: extreme, weight: 0.20 },
    { data: inconsistency, weight: 0.30 },
  ];

  const available = indicators.filter(i => i.data.score >= 0);

  let overallScore;
  if (available.length === 0) {
    overallScore = -1; // No data at all
  } else {
    // Redistribute weights among available indicators
    const totalWeight = available.reduce((s, i) => s + i.weight, 0);
    overallScore = Math.round(
      available.reduce((s, i) => s + (i.data.score * (i.weight / totalWeight)), 0)
    );
  }

  let overallLabel, overallColor;
  if (overallScore < 0) {
    overallLabel = 'DATA BELUM TERSEDIA';
    overallColor = '#6b7280'; // grey
  } else if (overallScore >= 85) {
    overallLabel = 'VALID';
    overallColor = '#22c55e';
  } else if (overallScore >= 70) {
    overallLabel = 'CUKUP VALID';
    overallColor = '#eab308';
  } else if (overallScore >= 50) {
    overallLabel = 'MERAGUKAN';
    overallColor = '#f97316';
  } else {
    overallLabel = 'TIDAK VALID';
    overallColor = '#ef4444';
  }

  return {
    overallScore: overallScore < 0 ? '-' : overallScore,
    overallLabel,
    overallColor,
    indicators: { duration, straightLining, extreme, inconsistency }
  };
}
