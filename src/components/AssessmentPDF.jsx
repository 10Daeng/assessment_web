import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import { getDiscPatternName } from '../utils/scoring';

// ==========================================
// STYLES
// ==========================================
const c = {
  primary: '#d35400',
  discD: '#e74c3c', discI: '#f1c40f', discS: '#2ecc71', discC: '#3498db',
  hexH: '#8e44ad', hexE: '#c0392b', hexX: '#2980b9', hexA: '#27ae60', hexC: '#d35400', hexO: '#16a085',
  dark: '#1a1a1a', grey: '#555555', light: '#f7f9fa', line: '#e0e0e0',
};

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: 'Helvetica', backgroundColor: '#ffffff' },
  
  // Header
  rahasia: { color: 'red', fontSize: 10, textAlign: 'right', fontFamily: 'Helvetica-Bold', marginBottom: 5 },
  lembaga: { fontSize: 14, fontFamily: 'Helvetica-Bold', textAlign: 'center', marginBottom: 6 },
  logo: { width: 200, height: 43, alignSelf: 'center', marginBottom: 5 },
  address: { fontSize: 9, color: c.grey, textAlign: 'center', marginBottom: 15 },
  mainTitle: { fontSize: 18, fontFamily: 'Helvetica-Bold', textAlign: 'center', marginBottom: 15, color: c.dark },
  hr: { borderBottomWidth: 2, borderBottomColor: c.primary, marginBottom: 20 },

  // Identity Page
  identitySection: { marginTop: 20 },
  identityRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#eeeeee', paddingVertical: 8 },
  identityLabel: { width: '35%', fontSize: 10, color: c.grey, paddingLeft: 10 },
  identityValue: { width: '65%', fontSize: 10, fontFamily: 'Helvetica-Bold', color: c.dark },
  
  // Section Title
  sectionTitle: {
    fontSize: 13, color: c.primary, fontFamily: 'Helvetica-Bold',
    marginTop: 10, marginBottom: 10, borderBottomWidth: 2,
    borderBottomColor: c.primary, paddingBottom: 5
  },

  // DISC bars
  discRow: { flexDirection: 'row', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: '#f0f0f0', alignItems: 'center' },
  discLabel: { width: '30%', fontSize: 9, fontFamily: 'Helvetica-Bold' },
  discScore: { width: '12%', fontSize: 9, textAlign: 'center' },
  discBarBg: { width: '48%', height: 10, backgroundColor: '#f0f0f0', position: 'relative' },
  discBarFill: { height: '100%', position: 'absolute', left: 0, top: 0 },
  discPct: { width: '10%', fontSize: 8, textAlign: 'right', color: c.grey },

  // HEXACO  
  hexacoGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  hexacoCol: { width: '48%' },
  hexacoFactorBox: { marginBottom: 8 },
  hexacoFactorName: { fontSize: 9, fontFamily: 'Helvetica-Bold', marginBottom: 3 },
  hexacoFacetRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
  hexacoFacetName: { fontSize: 7.5, color: c.grey, width: '48%', paddingLeft: 8 },
  hexacoFacetBarBg: { width: '40%', height: 6, backgroundColor: '#f0f0f0', position: 'relative' },
  hexacoFacetPct: { width: '12%', fontSize: 7, textAlign: 'right', color: c.grey },
  barFill: { height: '100%', position: 'absolute', left: 0, top: 0 },

  // Page 3-4: Narrative
  narrativeTitle: {
    fontSize: 13, fontFamily: 'Helvetica-Bold', color: c.dark,
    marginBottom: 10, borderBottomWidth: 1, borderBottomColor: c.primary, paddingBottom: 4
  },
  narrativeBody: {
    fontSize: 10, lineHeight: 1.7, color: '#333333', marginBottom: 12, textAlign: 'justify'
  },
  narrativeSection: { marginBottom: 20 },
  bulletItem: { fontSize: 10, lineHeight: 1.6, color: '#333333', marginBottom: 6, paddingLeft: 10 },

  // Footer
  footer: { position: 'absolute', bottom: 25, left: 40, right: 40, fontSize: 7.5, color: 'grey', textAlign: 'center' },
  pageNum: { position: 'absolute', bottom: 25, right: 40, fontSize: 8, color: 'grey' },
});

// ==========================================
// HELPERS
// ==========================================
const hexacoStructure = {
  left: [
    { factor: 'H', name: 'Honesty-Humility', color: c.hexH, facets: [{k:'sinc', n:'Sincerity'}, {k:'fair', n:'Fairness'}, {k:'gree', n:'Greed Avoidance'}, {k:'mode', n:'Modesty'}] },
    { factor: 'E', name: 'Emotionality', color: c.hexE, facets: [{k:'fear', n:'Fearfulness'}, {k:'anxi', n:'Anxiety'}, {k:'depe', n:'Dependence'}, {k:'sent', n:'Sentimentality'}] },
    { factor: 'X', name: 'eXtraversion', color: c.hexX, facets: [{k:'sses', n:'Social Self-Esteem'}, {k:'socb', n:'Social Boldness'}, {k:'soci', n:'Sociability'}, {k:'live', n:'Liveliness'}] },
  ],
  right: [
    { factor: 'A', name: 'Agreeableness', color: c.hexA, facets: [{k:'forg', n:'Forgivingness'}, {k:'gent', n:'Gentleness'}, {k:'flex', n:'Flexibility'}, {k:'pati', n:'Patience'}] },
    { factor: 'C', name: 'Conscientiousness', color: c.hexC, facets: [{k:'orga', n:'Organization'}, {k:'dili', n:'Diligence'}, {k:'perf', n:'Perfectionism'}, {k:'prud', n:'Prudence'}] },
    { factor: 'O', name: 'Openness', color: c.hexO, facets: [{k:'aesa', n:'Aesthetic Appreciation'}, {k:'inqu', n:'Inquisitiveness'}, {k:'crea', n:'Creativity'}, {k:'unco', n:'Unconventionality'}] },
  ]
};

const getDiscPct = (rawScore) => {
  let shifted = (rawScore || 0) + 24;
  return Math.max(0, Math.min(100, (shifted / 48) * 100));
};

const getHexacoPct = (mean) => {
  const safeMean = mean || 1;
  return Math.max(0, Math.min(100, ((safeMean - 1) / 4) * 100));
};

// ==========================================
// SHARED COMPONENTS
// ==========================================
function PageHeader({ showAddress = true }) {
  return (
    <View style={{ textAlign: 'center', marginBottom: showAddress ? 15 : 10 }}>
      <Text style={styles.rahasia}>SANGAT RAHASIA</Text>
      <Text style={styles.lembaga}>Lembaga Konseling dan Psikoterapi Islam</Text>
      <Image src="/logo.png" style={styles.logo} />
      {showAddress && (
        <Text style={styles.address}>Jalan Potre Koneng II No. 31, Kolor, Sumenep 69417 | www.lenterabatin.co.id</Text>
      )}
    </View>
  );
}

function PageFooter({ pageNum }) {
  return (
    <>
      <Text style={styles.footer}>
        *Laporan ini disusun berdasarkan hasil asesmen mandiri (self-report). Akurasi hasil sangat bergantung pada keterbukaan dan kejujuran dalam menjawab.
      </Text>
      <Text style={styles.pageNum}>Hal. {pageNum}</Text>
    </>
  );
}

// ==========================================
// MAIN PDF DOCUMENT — 4 PAGES
// ==========================================
export default function AssessmentPDF({ userData, discScores, hexacoScores, aiInsight }) {

  const discTraits = [
    { key: 'D', name: 'Dominance', color: c.discD },
    { key: 'I', name: 'Influence', color: c.discI },
    { key: 'S', name: 'Steadiness', color: c.discS },
    { key: 'C', name: 'Compliance', color: c.discC },
  ];

  return (
    <Document>
      {/* ======================================================= */}
      {/* PAGE 1 — IDENTITAS LEMBAGA & RESPONDEN                  */}
      {/* ======================================================= */}
      <Page size="A4" style={styles.page}>
        <PageHeader />
        <View style={styles.hr} />
        <Text style={styles.mainTitle}>HASIL PEMETAAN PSIKOLOGIS</Text>

        {/* Identity Table */}
        <View style={styles.identitySection}>
          <Text style={{ ...styles.sectionTitle, marginTop: 0 }}>Data Responden</Text>
          
          {[
            ['Nama Lengkap', (userData?.nama || '-').toUpperCase()],
            ['Email / NIK', userData?.email || '-'],
            ['Usia', userData?.usia ? `${userData.usia} tahun` : '-'],
            ['Asal Instansi', userData?.instansi || '-'],
            ['Pekerjaan', userData?.pekerjaan || '-'],
            ['Jabatan', userData?.jabatan || '-'],
            ['Durasi Pengerjaan', userData?.durasi || '-'],
          ].map(([label, value]) => (
            <View style={styles.identityRow} key={label}>
              <Text style={styles.identityLabel}>{label}</Text>
              <Text style={styles.identityValue}>{value}</Text>
            </View>
          ))}
        </View>

        {/* Status & Pattern Summary */}
        <View style={{ marginTop: 30, padding: 15, backgroundColor: c.light, borderRadius: 4 }}>
          <Text style={{ fontSize: 10, fontFamily: 'Helvetica-Bold', marginBottom: 6, color: c.dark }}>Ringkasan Hasil Asesmen</Text>
          <Text style={{ fontSize: 9, color: c.grey, lineHeight: 1.5 }}>
            Pola Gaya Kerja (DISC): {getDiscPatternName(discScores?.pattern)} ({discScores?.pattern || '-'})
          </Text>
          <Text style={{ fontSize: 9, color: c.grey, lineHeight: 1.5, marginTop: 3 }}>
            Status: VALID & TERINTEGRASI
          </Text>
        </View>

        <PageFooter pageNum={1} />
      </Page>

      {/* ======================================================= */}
      {/* PAGE 2 — FULL PSIKOGRAM (DISC + HEXACO)                 */}
      {/* ======================================================= */}
      <Page size="A4" style={styles.page}>
        <PageHeader showAddress={false} />

        {/* DISC Section */}
        <Text style={styles.sectionTitle}>PROFIL GAYA KERJA (DISC — Composite)</Text>
        
        {/* DISC Header */}
        <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#000', paddingBottom: 4, marginBottom: 4 }}>
          <Text style={{ ...styles.discLabel, fontFamily: 'Helvetica-Bold', fontSize: 8 }}>ASPEK</Text>
          <Text style={{ ...styles.discScore, fontFamily: 'Helvetica-Bold', fontSize: 8 }}>RAW</Text>
          <Text style={{ width: '48%', fontFamily: 'Helvetica-Bold', fontSize: 8 }}>VISUALISASI</Text>
          <Text style={{ width: '10%', fontFamily: 'Helvetica-Bold', fontSize: 8, textAlign: 'right' }}>%</Text>
        </View>

        {discTraits.map(({ key, name, color }) => {
          const raw = discScores?.discComposite?.[key] || 0;
          const pct = getDiscPct(raw);
          return (
            <View style={styles.discRow} key={key}>
              <Text style={styles.discLabel}>{name} ({key})</Text>
              <Text style={styles.discScore}>{raw > 0 ? `+${raw}` : raw}</Text>
              <View style={styles.discBarBg}>
                <View style={[styles.discBarFill, { width: `${pct}%`, backgroundColor: color }]} />
              </View>
              <Text style={styles.discPct}>{Math.round(pct)}%</Text>
            </View>
          );
        })}

        <Text style={{ fontSize: 8, textAlign: 'center', color: c.grey, marginTop: 5, marginBottom: 15 }}>
          Pola Utama: {getDiscPatternName(discScores?.pattern)} ({discScores?.pattern || '-'})
        </Text>

        {/* HEXACO Section */}
        <Text style={styles.sectionTitle}>PROFIL KARAKTER (HEXACO-100)</Text>

        <View style={styles.hexacoGrid}>
          {/* Left Column (H, E, X) */}
          <View style={styles.hexacoCol}>
            {hexacoStructure.left.map((group) => {
              const factorMean = hexacoScores?.factorMeans?.[group.factor];
              const factorPct = getHexacoPct(factorMean);
              return (
                <View key={group.factor} style={styles.hexacoFactorBox}>
                  <Text style={styles.hexacoFactorName}>{group.name} ({Math.round(factorPct)}%)</Text>
                  <View style={{ ...styles.hexacoFacetBarBg, width: '100%', height: 7, marginBottom: 3 }}>
                    <View style={[styles.barFill, { width: `${factorPct}%`, backgroundColor: group.color }]} />
                  </View>
                  {group.facets.map((facet) => {
                    const fm = hexacoScores?.facetMeans?.[facet.k];
                    const fp = getHexacoPct(fm);
                    return (
                      <View style={styles.hexacoFacetRow} key={facet.k}>
                        <Text style={styles.hexacoFacetName}>{facet.n}</Text>
                        <View style={styles.hexacoFacetBarBg}>
                          <View style={[styles.barFill, { width: `${fp}%`, backgroundColor: group.color, opacity: 0.6 }]} />
                        </View>
                        <Text style={styles.hexacoFacetPct}>{Math.round(fp)}%</Text>
                      </View>
                    );
                  })}
                </View>
              );
            })}
          </View>

          {/* Right Column (A, C, O) */}
          <View style={styles.hexacoCol}>
            {hexacoStructure.right.map((group) => {
              const factorMean = hexacoScores?.factorMeans?.[group.factor];
              const factorPct = getHexacoPct(factorMean);
              return (
                <View key={group.factor} style={styles.hexacoFactorBox}>
                  <Text style={styles.hexacoFactorName}>{group.name} ({Math.round(factorPct)}%)</Text>
                  <View style={{ ...styles.hexacoFacetBarBg, width: '100%', height: 7, marginBottom: 3 }}>
                    <View style={[styles.barFill, { width: `${factorPct}%`, backgroundColor: group.color }]} />
                  </View>
                  {group.facets.map((facet) => {
                    const fm = hexacoScores?.facetMeans?.[facet.k];
                    const fp = getHexacoPct(fm);
                    return (
                      <View style={styles.hexacoFacetRow} key={facet.k}>
                        <Text style={styles.hexacoFacetName}>{facet.n}</Text>
                        <View style={styles.hexacoFacetBarBg}>
                          <View style={[styles.barFill, { width: `${fp}%`, backgroundColor: group.color, opacity: 0.6 }]} />
                        </View>
                        <Text style={styles.hexacoFacetPct}>{Math.round(fp)}%</Text>
                      </View>
                    );
                  })}
                </View>
              );
            })}

            {/* Altruism */}
            <View style={styles.hexacoFactorBox}>
              <Text style={styles.hexacoFactorName}>Altruism (Interstitial) ({Math.round(getHexacoPct(hexacoScores?.facetMeans?.['altr']))}%)</Text>
              <View style={{ ...styles.hexacoFacetBarBg, width: '100%', height: 7, marginBottom: 3 }}>
                <View style={[styles.barFill, { width: `${getHexacoPct(hexacoScores?.facetMeans?.['altr'])}%`, backgroundColor: '#e67e22' }]} />
              </View>
            </View>
          </View>
        </View>

        <PageFooter pageNum={2} />
      </Page>

      {/* ======================================================= */}
      {/* PAGE 3 — DINAMIKA KEPRIBADIAN (BAGIAN 1)                */}
      {/* ======================================================= */}
      <Page size="A4" style={styles.page}>
        <PageHeader showAddress={false} />
        <Text style={styles.mainTitle}>DESKRIPSI KEPRIBADIAN</Text>

        <View style={styles.narrativeSection}>
          <Text style={styles.narrativeTitle}>1. Dinamika Gaya Kerja</Text>
          <Text style={styles.narrativeBody}>
            Secara umum, individu dinilai memiliki kecenderungan karakteristik spesifik dalam merespon sebuah instruksi kerja, mengelola relasi profesional, serta membuat keputusan di tempat kerja.
          </Text>
          <Text style={styles.narrativeBody}>
            {aiInsight?.gayaKerja || '[Deskripsi gaya kerja belum digenerate.]'}
          </Text>
        </View>

        <View style={styles.narrativeSection}>
          <Text style={styles.narrativeTitle}>2. Dinamika Karakter Inti</Text>
          <Text style={styles.narrativeBody}>
            Profil karakter inti seseorang memberikan gambaran mengenai cara individu memaknai interaksi sosial, merespon tantangan emosional, serta menjalankan komitmen dan nilai moral sehari-hari.
          </Text>
          <Text style={styles.narrativeBody}>
            {aiInsight?.karakterInti || '[Ringkasan profil karakter belum digenerate.]'}
          </Text>
        </View>

        <PageFooter pageNum={3} />
      </Page>

      {/* ======================================================= */}
      {/* PAGE 4 — REKOMENDASI PENGEMBANGAN                       */}
      {/* ======================================================= */}
      <Page size="A4" style={styles.page}>
        <PageHeader showAddress={false} />

        <View style={styles.narrativeSection}>
          <Text style={styles.narrativeTitle}>3. Rekomendasi Pengembangan Diri</Text>
          <Text style={styles.narrativeBody}>
            Berdasarkan keseluruhan profil asesmen, berikut adalah beberapa area yang dapat menjadi fokus pengembangan di masa mendatang:
          </Text>
          {aiInsight ? (
            <>
              <Text style={styles.bulletItem}>•  {aiInsight.rekomendasi1}</Text>
              <Text style={styles.bulletItem}>•  {aiInsight.rekomendasi2}</Text>
              <Text style={styles.bulletItem}>•  {aiInsight.rekomendasi3}</Text>
            </>
          ) : (
            <>
              <Text style={styles.bulletItem}>•  [Saran Pengembangan 1 belum digenerate]</Text>
              <Text style={styles.bulletItem}>•  [Saran Pengembangan 2 belum digenerate]</Text>
              <Text style={styles.bulletItem}>•  [Saran Pengembangan 3 belum digenerate]</Text>
            </>
          )}
        </View>

        {/* Closing Section */}
        <View style={{ marginTop: 40, padding: 20, backgroundColor: c.light, borderRadius: 4 }}>
          <Text style={{ fontSize: 9, color: c.grey, lineHeight: 1.5, textAlign: 'center', fontStyle: 'italic' }}>
            Profil kepribadian bersifat dinamis dan dapat berkembang seiring waktu serta pengalaman hidup. Laporan ini hendaknya dipahami sebagai gambaran kecenderungan perilaku pada saat pengisian asesmen berlangsung, bukan sebagai penilaian mutlak terhadap kemampuan atau potensi seseorang.
          </Text>
        </View>

        {/* Signature Area */}
        <View style={{ marginTop: 50, flexDirection: 'row', justifyContent: 'flex-end' }}>
          <View style={{ width: '45%', textAlign: 'center' }}>
            <Text style={{ fontSize: 9, color: c.grey, marginBottom: 60 }}>Sumenep, .........................</Text>
            <Text style={{ fontSize: 9, color: c.grey, borderTopWidth: 1, borderTopColor: c.grey, paddingTop: 4 }}>
              Assessor / Konselor
            </Text>
          </View>
        </View>

        <PageFooter pageNum={4} />
      </Page>
    </Document>
  );
}
