import { crossDimensions } from '../data/ai/crossDimensions';
import { facetParadoxes } from '../data/ai/facetParadoxes';
import { archetypes } from '../data/ai/archetypes';

// =========================================
// LOCAL AI ENGINE - BEHAVIORAL NARRATIVE GENERATOR
// =========================================
// Fungsi ini bertugas sebagai otak yang membaca kamus logika tanpa hitungan memberatkan PDF

// Helper: Menentukan klasifikasi skor menjadi "high", "mid", atau "low"
function getLevel(mean) {
  if (mean >= 3.8) return 'high';
  if (mean >= 2.5) return 'mid';
  return 'low';
}

/**
 * Mencari narasi Cross-Dimension dari 2 dimensi spesifik
 */
export function getCrossDimensionNarrative(dim1, val1, dim2, val2) {
  const level1 = getLevel(val1);
  const level2 = getLevel(val2);
  
  // Memastikan urutan key alfabetis berdasarkan nama dimensi agar cocok dengan kamus
  // Contoh: H dan E -> 'H_high-E_mid'
  const dims = [
    { name: dim1, level: level1 },
    { name: dim2, level: level2 }
  ].sort((a, b) => a.name.localeCompare(b.name));

  const key = `${dims[0].name}_${dims[0].level}-${dims[1].name}_${dims[1].level}`;
  return crossDimensions[key] || '';
}

/**
 * Memindai seluruh Facet dan mencari selisih ekstrem antar Facet di Dimensi yang sama
 */
export function getFacetParadoxNarrative(facetMeans) {
  // Logic to identify conflicting facets and pull from facetParadoxes.js
  // (Akan direalisasikan setelah kamus paradox selesai dibuat)
  return [];
}

/**
 * Menentukan Arketipe dominan klien berdasarkan 2 skor absolut tertinggi
 */
export function getArchetype(topDim1, topDim2) {
  // Logic to pull from archetypes.js
  return '';
}

/**
 * Fungsi Jahit (Weaver)
 * Menyusun potongan-potongan dari dict ke satu narasi rapih
 */
export function weaveNarrative(factorMeans, facetMeans) {
  // 1. Tentukan Dinamika Profil Inti (Misal: 3 tertinggi dipasangkan)
  // 2. Scan Paradox yang ada
  // 3. Gabungkan
  // Return final paragraf string.
  return "Draft Engine Ready.";
}
