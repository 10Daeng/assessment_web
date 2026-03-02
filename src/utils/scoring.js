import { hexaco100Questions } from '../data/hexaco';

export function calculateHexacoScores(answers) {
  // Store raw totals and counts to calculate Means
  const facetScoresRaw = {};
  const factorScoresRaw = { 'H': 0, 'E': 0, 'X': 0, 'A': 0, 'C': 0, 'O': 0 };
  const factorCounts = { 'H': 0, 'E': 0, 'X': 0, 'A': 0, 'C': 0, 'O': 0 };

  // Calculate raw scores and handle reverse coding
  hexaco100Questions.forEach(q => {
    let rawScore = answers[q.id] || 3; // Default to neutral if missing
    
    // Reverse scoring (Langkah 1)
    let finalScore = q.isReverse ? (6 - rawScore) : rawScore;

    const isAltruism = q.dimension === 'Altruism';
    const factor = isAltruism ? null : q.varName.charAt(0); // H, E, X, A, C, O
    const facet = isAltruism ? 'altr' : q.varName.substring(1, 5).toLowerCase().replace(/[^a-z]/g, ''); // sinc, fair, etc.

    // 1. Accumulate Facet Totals
    if (!facetScoresRaw[facet]) {
      facetScoresRaw[facet] = { total: 0, count: 0 };
    }
    facetScoresRaw[facet].total += finalScore;
    facetScoresRaw[facet].count += 1;

    // 2. Accumulate Factor Totals (Altruism is interstitial, not part of any factor)
    if (factor && factorScoresRaw.hasOwnProperty(factor)) {
      factorScoresRaw[factor] += finalScore;
      factorCounts[factor] += 1;
    }
  });

  // Calculate Means (Langkah 2 & 3)
  const facetMeans = {};
  for (let facet in facetScoresRaw) {
    facetMeans[facet] = facetScoresRaw[facet].total / facetScoresRaw[facet].count;
  }

  const factorMeans = {};
  for (let factor in factorScoresRaw) {
    factorMeans[factor] = factorScoresRaw[factor] / factorCounts[factor];
  }

  return { facetMeans, factorMeans, rawTotals: facetScoresRaw };
}

export function calculateDiscScores(answers) {
  // Format answers: { 1: { most: 'D', least: 'C' }, 2: { ... } }
  
  let discMost = { D: 0, I: 0, S: 0, C: 0 };      // Grafik 1 (Mask / Public)
  let discLeast = { D: 0, I: 0, S: 0, C: 0 };     // Grafik 2 (Core / Private)
  let discComposite = { D: 0, I: 0, S: 0, C: 0 }; // Grafik 3 (Mirror / Perceived)

  // Langkah 1 & 2: Tally Most & Least
  Object.values(answers).forEach(ans => {
    if (ans.most) discMost[ans.most] += 1;
    if (ans.least) discLeast[ans.least] += 1;
  });

  // Langkah 3: Calculate Composite Graph 3
  ['D', 'I', 'S', 'C'].forEach(trait => {
    discComposite[trait] = discMost[trait] - discLeast[trait];
  });

  // Pattern detection (Based on Composite Graph 3 as primary)
  // Sort by score descending. Tie breaker preference mapped in offline code: D > I > S > C
  const traitOrder = { 'D': 1, 'I': 2, 'S': 3, 'C': 4 };
  const sorted = Object.entries(discComposite).sort((a,b) => {
    if (b[1] !== a[1]) return b[1] - a[1];
    return traitOrder[a[0]] - traitOrder[b[0]]; // Tie breaker
  });

  const fullPattern = sorted.map(s => s[0]).join('-'); // format: D-I-S-C
  const primary = sorted[0][0];
  const secondary = sorted[1][1] > 0 ? sorted[1][0] : '';
  const pattern = secondary ? `${primary}${secondary}` : primary; // Legacy 2-letter pattern

  return { discMost, discLeast, discComposite, pattern, primary, fullPattern };
}

export const DISC_PATTERNS_MAP = {
  // Mixed profiles (D dominant)
  DI: 'Inspirational', 
  DS: 'Developer', 
  DC: 'Creative', 
  
  // Mixed profiles (I dominant)
  ID: 'Persuader', 
  IS: 'Counselor', 
  IC: 'Appraiser', 
  
  // Mixed profiles (S dominant)
  SI: 'Agent',
  SD: 'Achiever', 
  SC: 'Practitioner', 
  
  // Mixed profiles (C dominant)
  CD: 'Creative', 
  CI: 'Investigator',
  CS: 'Objective Thinker',
  
  // Single dominant profiles (using doubled letters for consistency or single letter fallbacks)
  DD: 'Result-Oriented', D: 'Result-Oriented',
  II: 'Promoter', I: 'Promoter',
  SS: 'Specialist', S: 'Specialist',
  CC: 'Perfectionist', C: 'Perfectionist',
};

export function getDiscPatternName(patternStr) {
  if (!patternStr) return 'Unknown';
  
  // Clean up string just in case
  const key = patternStr.toUpperCase().trim();
  
  // If it's a 3-letter profile (e.g. DIC), typically we take the first two dominant letters.
  const primaryKeys = key.substring(0, 2);
  
  return DISC_PATTERNS_MAP[primaryKeys] || DISC_PATTERNS_MAP[key.charAt(0)] || 'Professional';
}
