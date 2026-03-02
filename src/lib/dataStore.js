import { neon } from '@neondatabase/serverless';

function getSQL() {
  return neon(process.env.DATABASE_URL);
}

export async function addSubmission(data) {
  const sql = getSQL();
  const { userData, discScores, hexacoScores } = data;

  const result = await sql`
    INSERT INTO "Submission" (
      id, "submittedAt",
      nama, email, usia, instansi, pekerjaan, jabatan,
      "discMostD", "discMostI", "discMostS", "discMostC",
      "discLeastD", "discLeastI", "discLeastS", "discLeastC",
      "discCompositeD", "discCompositeI", "discCompositeS", "discCompositeC",
      "discPattern", "discPrimary",
      "hexacoH", "hexacoE", "hexacoX", "hexacoA", "hexacoC", "hexacoO",
      "hexacoFacetMeans", "rawData"
    ) VALUES (
      gen_random_uuid(), NOW(),
      ${userData?.nama || ''}, 
      ${userData?.email || ''}, 
      ${userData?.usia ? parseInt(userData.usia) : null},
      ${userData?.instansi || null}, 
      ${userData?.pekerjaan || null}, 
      ${userData?.jabatan || null},
      ${discScores?.discMost?.D || 0}, ${discScores?.discMost?.I || 0}, 
      ${discScores?.discMost?.S || 0}, ${discScores?.discMost?.C || 0},
      ${discScores?.discLeast?.D || 0}, ${discScores?.discLeast?.I || 0}, 
      ${discScores?.discLeast?.S || 0}, ${discScores?.discLeast?.C || 0},
      ${discScores?.discComposite?.D || 0}, ${discScores?.discComposite?.I || 0}, 
      ${discScores?.discComposite?.S || 0}, ${discScores?.discComposite?.C || 0},
      ${discScores?.pattern || null}, ${discScores?.primary || null},
      ${hexacoScores?.factorMeans?.H || 0}, ${hexacoScores?.factorMeans?.E || 0},
      ${hexacoScores?.factorMeans?.X || 0}, ${hexacoScores?.factorMeans?.A || 0},
      ${hexacoScores?.factorMeans?.C || 0}, ${hexacoScores?.factorMeans?.O || 0},
      ${JSON.stringify(hexacoScores?.facetMeans || {})},
      ${JSON.stringify(data)}
    ) RETURNING id, "submittedAt"
  `;

  return result[0];
}

export async function getAllSubmissions({ search, sortBy: _sortBy, sortDir: _sortDir } = {}) {
  const sql = getSQL();

  let query;
  if (search) {
    const q = `%${search}%`;
    query = await sql`
      SELECT * FROM "Submission" 
      WHERE nama ILIKE ${q} 
        OR email ILIKE ${q} 
        OR instansi ILIKE ${q}
        OR pekerjaan ILIKE ${q}
        OR jabatan ILIKE ${q}
        OR "discPattern" ILIKE ${q}
      ORDER BY "submittedAt" DESC
    `;
  } else {
    query = await sql`SELECT * FROM "Submission" ORDER BY "submittedAt" DESC`;
  }

  return query.map(transformSubmission);
}

export async function getSubmissionById(id) {
  const sql = getSQL();
  const result = await sql`SELECT * FROM "Submission" WHERE id = ${id} LIMIT 1`;
  if (result.length === 0) return null;
  return transformSubmission(result[0]);
}

export async function detectDuplicates() {
  const sql = getSQL();
  const all = await sql`SELECT * FROM "Submission" ORDER BY "submittedAt" DESC`;

  const seen = {};
  all.forEach(sub => {
    const t = transformSubmission(sub);
    const key = (t.userData?.nama || '').trim().toLowerCase() + '|' + (t.userData?.email || '').trim().toLowerCase();
    if (!seen[key]) seen[key] = [];
    seen[key].push(t);
  });

  const duplicates = [];
  for (const key in seen) {
    if (seen[key].length > 1) {
      duplicates.push({
        key,
        nama: seen[key][0].userData?.nama,
        email: seen[key][0].userData?.email,
        count: seen[key].length,
        submissions: seen[key],
      });
    }
  }

  return duplicates;
}

export async function updateSubmissionAiInsight(id, aiInsightData) {
  const sql = getSQL();
  const result = await sql`
    UPDATE "Submission"
    SET "aiInsight" = ${JSON.stringify(aiInsightData)}
    WHERE id = ${id}
    RETURNING id
  `;
  return result.length > 0;
}

export async function deleteSubmission(id) {
  const sql = getSQL();
  
  // Archiving the data into DeletedSubmission before deleting
  await sql`
    INSERT INTO "DeletedSubmission"
    SELECT * FROM "Submission" WHERE id = ${id}
    ON CONFLICT (id) DO NOTHING
  `;

  // Original deletion
  const result = await sql`
    DELETE FROM "Submission" 
    WHERE id = ${id} 
    RETURNING id
  `;
  return result.length > 0;
}

function transformSubmission(sub) {
  return {
    id: sub.id,
    submittedAt: sub.submittedAt instanceof Date ? sub.submittedAt.toISOString() : sub.submittedAt,
    userData: {
      nama: sub.nama,
      email: sub.email,
      usia: sub.usia,
      instansi: sub.instansi,
      pekerjaan: sub.pekerjaan,
      jabatan: sub.jabatan,
    },
    discScores: {
      discMost: { D: sub.discMostD, I: sub.discMostI, S: sub.discMostS, C: sub.discMostC },
      discLeast: { D: sub.discLeastD, I: sub.discLeastI, S: sub.discLeastS, C: sub.discLeastC },
      discComposite: { D: sub.discCompositeD, I: sub.discCompositeI, S: sub.discCompositeS, C: sub.discCompositeC },
      pattern: sub.discPattern,
      primary: sub.discPrimary,
    },
    hexacoScores: {
      factorMeans: {
        H: sub.hexacoH,
        E: sub.hexacoE,
        X: sub.hexacoX,
        A: sub.hexacoA,
        C: sub.hexacoC,
        O: sub.hexacoO,
      },
      facetMeans: typeof sub.hexacoFacetMeans === 'string' ? JSON.parse(sub.hexacoFacetMeans) : (sub.hexacoFacetMeans || {}),
    },
    aiInsight: typeof sub.aiInsight === 'string' ? JSON.parse(sub.aiInsight) : (sub.aiInsight || null),
    rawData: typeof sub.rawData === 'string' ? JSON.parse(sub.rawData) : (sub.rawData || null),
  };
}
