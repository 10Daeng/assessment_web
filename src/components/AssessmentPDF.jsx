import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import { getDiscPatternName } from '../utils/scoring';

// ==========================================
// COLORS
// ==========================================
const c = {
  primary: '#d35400',
  discD: '#e74c3c', discI: '#f1c40f', discS: '#2ecc71', discC: '#3498db',
  hexH: '#8e44ad', hexE: '#c0392b', hexX: '#2980b9', hexA: '#27ae60', hexC: '#d35400', hexO: '#16a085',
  dark: '#1a1a1a', grey: '#555555', light: '#f7f9fa', line: '#e0e0e0',
};

// ==========================================
// STYLES
// ==========================================
const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: 'Helvetica', backgroundColor: '#ffffff' },

  // Page 1 Header
  rahasia: { color: 'red', fontSize: 10, textAlign: 'right', fontFamily: 'Helvetica-Bold', marginBottom: 5 },
  lembaga: { fontSize: 14, fontFamily: 'Helvetica-Bold', textAlign: 'center', marginBottom: 6 },
  logo: { width: 200, height: 43, alignSelf: 'center', marginBottom: 5 },
  address: { fontSize: 9, color: c.grey, textAlign: 'center', marginBottom: 15 },
  mainTitle: { fontSize: 18, fontFamily: 'Helvetica-Bold', textAlign: 'center', marginBottom: 15, color: c.dark },
  hr: { borderBottomWidth: 2, borderBottomColor: c.primary, marginBottom: 20 },

  // Watermark for pages 2-4
  watermark: { position: 'absolute', top: '42%', left: '15%', width: '70%', opacity: 0.04 },

  // Identity
  identityRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#eeeeee', paddingVertical: 8 },
  identityLabel: { width: '35%', fontSize: 10, color: c.grey, paddingLeft: 10 },
  identityValue: { width: '65%', fontSize: 10, fontFamily: 'Helvetica-Bold', color: c.dark },

  // Section Title
  sectionTitle: { fontSize: 12, color: c.primary, fontFamily: 'Helvetica-Bold', marginBottom: 8, borderBottomWidth: 2, borderBottomColor: c.primary, paddingBottom: 4 },
  subTitle: { fontSize: 8, fontFamily: 'Helvetica-Bold', color: c.grey, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 },

  // DISC 3-column
  discGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  discPanel: { width: '31.5%', border: '1 solid #e0e0e0', borderRadius: 3, padding: 8 },
  discPanelTitle: { fontSize: 7.5, fontFamily: 'Helvetica-Bold', textAlign: 'center', color: c.grey, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 },
  discRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  discLabel: { width: '35%', fontSize: 7.5, fontFamily: 'Helvetica-Bold' },
  discBarBg: { width: '42%', height: 7, backgroundColor: '#f0f0f0', position: 'relative' },
  discBarFill: { height: '100%', position: 'absolute', left: 0, top: 0 },
  discVal: { width: '23%', fontSize: 7.5, textAlign: 'right', fontFamily: 'Helvetica-Bold' },

  // HEXACO
  hexGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  hexBox: { width: '48.5%', border: '1 solid #e0e0e0', borderRadius: 3, padding: 8, marginBottom: 8 },
  hexFactorHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  hexFactorName: { fontSize: 10, fontFamily: 'Helvetica-Bold', color: c.dark },
  hexPctBadge: { fontSize: 8, fontFamily: 'Helvetica-Bold', color: '#ffffff', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8 },
  hexRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 3 },
  hexRowLabel: { width: '38%', fontSize: 7.5, color: c.grey, textAlign: 'right', paddingRight: 6 },
  hexRowBar: { width: '48%', height: 6, backgroundColor: '#f0f0f0', position: 'relative' },
  hexRowPct: { width: '14%', fontSize: 7.5, textAlign: 'right', color: c.grey },
  barFill: { height: '100%', position: 'absolute', left: 0, top: 0 },

  // Narrative
  narrativeTitle: { fontSize: 12, fontFamily: 'Helvetica-Bold', color: c.dark, marginBottom: 8, borderBottomWidth: 1, borderBottomColor: c.primary, paddingBottom: 4 },
  narrativeBody: { fontSize: 10, lineHeight: 1.7, color: '#333333', marginBottom: 10, textAlign: 'justify' },
  bulletItem: { fontSize: 10, lineHeight: 1.6, color: '#333333', marginBottom: 5, paddingLeft: 10 },

  // Footer
  footer: { position: 'absolute', bottom: 25, left: 40, right: 40, fontSize: 7.5, color: 'grey', textAlign: 'center' },
  pageNum: { position: 'absolute', bottom: 25, right: 40, fontSize: 8, color: 'grey' },
  disclaimer: { fontSize: 8, color: c.grey, textAlign: 'center', fontStyle: 'italic', marginTop: 15, paddingHorizontal: 10 },
});

// ==========================================
// HELPERS
// ==========================================
const hexacoStructure = [
  { factor: 'H', name: 'Honesty-Humility', color: c.hexH, facets: [{k:'sinc',n:'Sincerity'},{k:'fair',n:'Fairness'},{k:'gree',n:'Greed Avoidance'},{k:'mode',n:'Modesty'}] },
  { factor: 'E', name: 'Emotionality', color: c.hexE, facets: [{k:'fear',n:'Fearfulness'},{k:'anxi',n:'Anxiety'},{k:'depe',n:'Dependence'},{k:'sent',n:'Sentimentality'}] },
  { factor: 'X', name: 'eXtraversion', color: c.hexX, facets: [{k:'sses',n:'Social Self-Esteem'},{k:'socb',n:'Social Boldness'},{k:'soci',n:'Sociability'},{k:'live',n:'Liveliness'}] },
  { factor: 'A', name: 'Agreeableness', color: c.hexA, facets: [{k:'forg',n:'Forgivingness'},{k:'gent',n:'Gentleness'},{k:'flex',n:'Flexibility'},{k:'pati',n:'Patience'}] },
  { factor: 'C', name: 'Conscientiousness', color: c.hexC, facets: [{k:'orga',n:'Organization'},{k:'dili',n:'Diligence'},{k:'perf',n:'Perfectionism'},{k:'prud',n:'Prudence'}] },
  { factor: 'O', name: 'Openness', color: c.hexO, facets: [{k:'aesa',n:'Aesthetic Appreciation'},{k:'inqu',n:'Inquisitiveness'},{k:'crea',n:'Creativity'},{k:'unco',n:'Unconventionality'}] },
];

const getDiscPct = (raw) => Math.max(0, Math.min(100, (((raw || 0) + 24) / 48) * 100));
const getHexacoPct = (mean) => Math.max(0, Math.min(100, (((mean || 1) - 1) / 4) * 100));

const discTraits = [
  { key: 'D', name: 'Dominance', color: c.discD },
  { key: 'I', name: 'Influence', color: c.discI },
  { key: 'S', name: 'Steadiness', color: c.discS },
  { key: 'C', name: 'Compliance', color: c.discC },
];

// ==========================================
// DISC PANEL (one of 3 columns)
// ==========================================
function DiscPanel({ title, scores }) {
  return (
    <View style={styles.discPanel}>
      <Text style={styles.discPanelTitle}>{title}</Text>
      {discTraits.map(({ key, name, color }) => {
        const raw = scores?.[key] || 0;
        const pct = getDiscPct(raw);
        return (
          <View style={styles.discRow} key={key}>
            <Text style={{ ...styles.discLabel, color }}>{name}</Text>
            <View style={styles.discBarBg}>
              <View style={[styles.barFill, { width: `${pct}%`, backgroundColor: color }]} />
            </View>
            <Text style={styles.discVal}>{raw > 0 ? `+${raw}` : raw}</Text>
          </View>
        );
      })}
    </View>
  );
}

// ==========================================
// HEXACO BOX (one factor)
// ==========================================
function HexacoBox({ group, factorMean, facetMeans }) {
  const factorPct = getHexacoPct(factorMean);
  return (
    <View style={styles.hexBox}>
      <View style={styles.hexFactorHeader}>
        <Text style={styles.hexFactorName}>{group.name}</Text>
        <Text style={[styles.hexPctBadge, { backgroundColor: group.color }]}>{Math.round(factorPct)}%</Text>
      </View>
      {/* Factor dimension bar */}
      <View style={styles.hexRow}>
        <Text style={styles.hexRowLabel}>Skor Dimensi</Text>
        <View style={styles.hexRowBar}>
          <View style={[styles.barFill, { width: `${factorPct}%`, backgroundColor: group.color }]} />
        </View>
        <Text style={styles.hexRowPct}>{Math.round(factorPct)}%</Text>
      </View>
      {/* Facets */}
      {group.facets.map((facet) => {
        const fm = facetMeans?.[facet.k];
        const fp = getHexacoPct(fm);
        return (
          <View style={styles.hexRow} key={facet.k}>
            <Text style={styles.hexRowLabel}>{facet.n}</Text>
            <View style={styles.hexRowBar}>
              <View style={[styles.barFill, { width: `${fp}%`, backgroundColor: group.color, opacity: 0.6 }]} />
            </View>
            <Text style={styles.hexRowPct}>{Math.round(fp)}%</Text>
          </View>
        );
      })}
    </View>
  );
}

// ==========================================
// MAIN PDF DOCUMENT — 4 PAGES
// ==========================================
export default function AssessmentPDF({ userData, discScores, hexacoScores, aiInsight, submittedAt }) {
  // Format date for signature
  const formatDate = (dateStr) => {
    if (!dateStr) return '.........................';
    try {
      const d = new Date(dateStr);
      const months = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
      return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
    } catch { return '.........................'; }
  };
  return (
    <Document>
      {/* ============================================================ */}
      {/* PAGE 1 — IDENTITAS LEMBAGA & RESPONDEN                       */}
      {/* ============================================================ */}
      <Page size="A4" style={styles.page}>
        {/* Full header only on page 1 */}
        <View style={{ textAlign: 'center', marginBottom: 10 }}>
          <Text style={styles.rahasia}>SANGAT RAHASIA</Text>
          <Text style={styles.lembaga}>Lembaga Konseling dan Psikoterapi Islam</Text>
          <Image src="/logo.png" style={styles.logo} />
          <Text style={styles.address}>Jalan Potre Koneng II No. 31, Kolor, Sumenep 69417 | www.lenterabatin.co.id</Text>
        </View>
        <View style={styles.hr} />
        <Text style={styles.mainTitle}>HASIL PEMETAAN PSIKOLOGIS</Text>

        {/* Identity Table */}
        <View style={{ marginTop: 15 }}>
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

        {/* Summary box */}
        <View style={{ marginTop: 25, padding: 15, backgroundColor: c.light, borderRadius: 4 }}>
          <Text style={{ fontSize: 10, fontFamily: 'Helvetica-Bold', marginBottom: 6, color: c.dark }}>Ringkasan Hasil Asesmen</Text>
          <Text style={{ fontSize: 9, color: c.grey, lineHeight: 1.5 }}>
            Pola Gaya Kerja: {getDiscPatternName(discScores?.pattern)} ({discScores?.pattern || '-'})
          </Text>
          <Text style={{ fontSize: 9, color: c.grey, lineHeight: 1.5, marginTop: 3 }}>
            Status: VALID & TERINTEGRASI
          </Text>
        </View>

        <Text style={styles.pageNum}>Hal. 1</Text>
      </Page>

      {/* ============================================================ */}
      {/* PAGE 2 — FULL PSIKOGRAM (DISC 3 grafik + HEXACO)             */}
      {/* ============================================================ */}
      <Page size="A4" style={styles.page}>
        {/* Watermark */}
        <Image src="/logo.png" style={styles.watermark} />

        {/* DISC Section — 3 columns */}
        <Text style={styles.sectionTitle}>Profil Gaya Kerja (DISC)</Text>
        <View style={styles.discGrid}>
          <DiscPanel title="Grafik 1 — Publik (Mask)" scores={discScores?.discMost} />
          <DiscPanel title="Grafik 2 — Pribadi (Core)" scores={discScores?.discLeast} />
          <DiscPanel title="Grafik 3 — Aktual (Composite)" scores={discScores?.discComposite} />
        </View>
        <Text style={{ fontSize: 8, textAlign: 'center', color: c.grey, marginBottom: 15 }}>
          Pola Utama: {getDiscPatternName(discScores?.pattern)} ({discScores?.pattern || '-'})
        </Text>

        {/* HEXACO Section — 6 boxes in 2-column grid */}
        <Text style={styles.sectionTitle}>Profil Karakter (HEXACO-100)</Text>
        <View style={styles.hexGrid}>
          {hexacoStructure.map((group) => (
            <HexacoBox
              key={group.factor}
              group={group}
              factorMean={hexacoScores?.factorMeans?.[group.factor]}
              facetMeans={hexacoScores?.facetMeans}
            />
          ))}
          {/* Altruism */}
          <View style={{ ...styles.hexBox, width: '100%' }}>
            <View style={styles.hexFactorHeader}>
              <Text style={styles.hexFactorName}>Altruism (Interstitial)</Text>
              <Text style={[styles.hexPctBadge, { backgroundColor: '#e67e22' }]}>{Math.round(getHexacoPct(hexacoScores?.facetMeans?.['altr']))}%</Text>
            </View>
            <View style={styles.hexRow}>
              <Text style={styles.hexRowLabel}>Skor Altruism</Text>
              <View style={{ ...styles.hexRowBar, width: '48%' }}>
                <View style={[styles.barFill, { width: `${getHexacoPct(hexacoScores?.facetMeans?.['altr'])}%`, backgroundColor: '#e67e22' }]} />
              </View>
              <Text style={styles.hexRowPct}>{Math.round(getHexacoPct(hexacoScores?.facetMeans?.['altr']))}%</Text>
            </View>
          </View>
        </View>

        {/* Disclaimer — only on page 2 */}
        <Text style={styles.disclaimer}>
          *Laporan ini disusun berdasarkan hasil asesmen mandiri (self-report). Akurasi hasil sangat bergantung pada keterbukaan dan kejujuran dalam menjawab. Profil kepribadian bersifat dinamis dan dapat berkembang seiring waktu serta pengalaman hidup.
        </Text>

        <Text style={styles.pageNum}>Hal. 2</Text>
      </Page>

      {/* ============================================================ */}
      {/* PAGE 3 — DINAMIKA KEPRIBADIAN                                */}
      {/* ============================================================ */}
      <Page size="A4" style={styles.page}>
        <Image src="/logo.png" style={styles.watermark} />

        <Text style={{ ...styles.mainTitle, fontSize: 15 }}>DESKRIPSI KEPRIBADIAN</Text>

        <View style={{ marginBottom: 20 }}>
          <Text style={styles.narrativeTitle}>1. Dinamika Gaya Kerja</Text>
          <Text style={styles.narrativeBody}>
            {aiInsight?.gayaKerja || 'Deskripsi gaya kerja belum tersedia. Silakan generate interpretasi AI terlebih dahulu melalui panel admin.'}
          </Text>
        </View>

        <View style={{ marginBottom: 20 }}>
          <Text style={styles.narrativeTitle}>2. Dinamika Karakter Inti</Text>
          <Text style={styles.narrativeBody}>
            {aiInsight?.karakterInti || 'Ringkasan profil karakter belum tersedia. Silakan generate interpretasi AI terlebih dahulu melalui panel admin.'}
          </Text>
        </View>

        <Text style={styles.pageNum}>Hal. 3</Text>
      </Page>

      {/* ============================================================ */}
      {/* PAGE 4 — REKOMENDASI PENGEMBANGAN                            */}
      {/* ============================================================ */}
      <Page size="A4" style={styles.page}>
        <Image src="/logo.png" style={styles.watermark} />

        <View style={{ marginBottom: 20 }}>
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
            <Text style={styles.narrativeBody}>Rekomendasi belum tersedia. Silakan generate interpretasi AI terlebih dahulu melalui panel admin.</Text>
          )}
        </View>

        {/* Closing */}
        <View style={{ marginTop: 30, padding: 18, backgroundColor: c.light, borderRadius: 4 }}>
          <Text style={{ fontSize: 9, color: c.grey, lineHeight: 1.5, textAlign: 'center', fontStyle: 'italic' }}>
            Profil kepribadian bersifat dinamis dan dapat berkembang seiring waktu serta pengalaman hidup. Laporan ini hendaknya dipahami sebagai gambaran kecenderungan perilaku pada saat pengisian asesmen berlangsung, bukan sebagai penilaian mutlak terhadap kemampuan atau potensi seseorang.
          </Text>
        </View>

        {/* Signature */}
        <View style={{ marginTop: 40, flexDirection: 'row', justifyContent: 'flex-end' }}>
          <View style={{ width: '50%', alignItems: 'center' }}>
            <Text style={{ fontSize: 9, color: c.dark, marginBottom: 15 }}>Sumenep, {formatDate(submittedAt)}</Text>
            <Image src="/logo.png" style={{ width: 120, height: 26, marginBottom: 8 }} />
            <Text style={{ fontSize: 10, fontFamily: 'Helvetica-Bold', color: c.dark, marginBottom: 2 }}>Moh. Ilham, M.Si., CHA., C.Med.</Text>
            <Text style={{ fontSize: 8, color: c.grey }}>Assessor / Konselor</Text>
          </View>
        </View>

        <Text style={styles.pageNum}>Hal. 4</Text>
      </Page>
    </Document>
  );
}
