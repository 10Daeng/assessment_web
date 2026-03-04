import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import { getDiscPatternName } from '../utils/scoring';
import { calculateValidityIndex } from '../utils/validityCheck';

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
// 85pt = 3 cm margin for binding (jilid)
const styles = StyleSheet.create({
  pageOdd: { paddingTop: 40, paddingBottom: 40, paddingLeft: 85, paddingRight: 40, fontFamily: 'Helvetica', backgroundColor: '#ffffff' },
  pageEven: { paddingTop: 40, paddingBottom: 40, paddingLeft: 40, paddingRight: 85, fontFamily: 'Helvetica', backgroundColor: '#ffffff' },
  pageTextWrap: { paddingTop: 40, paddingBottom: 40, paddingLeft: 85, paddingRight: 85, fontFamily: 'Helvetica', backgroundColor: '#ffffff' },

  // Fonts back to normal/readable size
  rahasia: { color: 'red', fontSize: 10, textAlign: 'right', fontFamily: 'Helvetica-Bold', marginBottom: 5 },
  lembaga: { fontSize: 13, fontFamily: 'Helvetica-Bold', textAlign: 'center', marginBottom: 5 },
  logo: { width: 180, height: 38, alignSelf: 'center', marginBottom: 5 },
  address: { fontSize: 8, color: c.grey, textAlign: 'center', marginBottom: 15 },
  mainTitle: { fontSize: 16, fontFamily: 'Helvetica-Bold', textAlign: 'center', marginBottom: 15, color: c.dark },
  hr: { borderBottomWidth: 1.5, borderBottomColor: c.primary, marginBottom: 15 },
  pageHeader: { fontSize: 16, fontFamily: 'Helvetica-Bold', color: c.primary, marginBottom: 12, borderBottomWidth: 1.5, borderBottomColor: c.primary, paddingBottom: 5, textTransform: 'uppercase' },

  // Watermark for pages 2-4
  watermark: { position: 'absolute', top: '42%', left: '15%', width: '70%', opacity: 0.04 },

  // Section Header (Title + Right Text)
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 6, borderBottomWidth: 1.5, borderBottomColor: c.primary, paddingBottom: 4 },
  sectionTitle: { fontSize: 12, color: c.primary, fontFamily: 'Helvetica-Bold' },
  sectionRightText: { fontSize: 9, fontFamily: 'Helvetica-Bold', color: c.dark },

  // Identity 2 Columns
  identityContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  identityCol: { width: '48%' },
  identityRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#eeeeee', paddingVertical: 5, alignItems: 'center' },
  identityLabel: { width: '40%', fontSize: 9.5, color: c.grey },
  identityValue: { width: '60%', fontSize: 9.5, fontFamily: 'Helvetica-Bold', color: c.dark },

  // DISC 3-column
  discGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  discPanel: { width: '31.5%', border: '1 solid #e0e0e0', borderRadius: 3, padding: 8 },
  discPanelTitle: { fontSize: 7.5, fontFamily: 'Helvetica-Bold', textAlign: 'center', color: c.grey, marginBottom: 7, textTransform: 'uppercase', letterSpacing: 0.5 },
  discRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  discLabel: { width: '35%', fontSize: 7.5, fontFamily: 'Helvetica-Bold' },
  discBarBg: { width: '42%', height: 7, backgroundColor: '#f0f0f0', position: 'relative' },
  barFill: { height: '100%', position: 'absolute', left: 0, top: 0 },
  discVal: { width: '23%', fontSize: 7.5, textAlign: 'right', fontFamily: 'Helvetica-Bold' },

  // HEXACO
  hexGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  hexBox: { width: '48.5%', border: '1 solid #e0e0e0', borderRadius: 3, padding: 8, marginBottom: 8 },
  hexFactorHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  hexFactorName: { fontSize: 10, fontFamily: 'Helvetica-Bold', color: c.dark },
  hexPctBadge: { fontSize: 8.5, fontFamily: 'Helvetica-Bold', color: '#ffffff', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8 },
  hexRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 3 },
  hexRowLabel: { width: '38%', fontSize: 7.5, color: c.grey, textAlign: 'right', paddingRight: 6 },
  hexRowBar: { width: '48%', height: 6, backgroundColor: '#f0f0f0', position: 'relative' },
  hexRowPct: { width: '14%', fontSize: 7.5, textAlign: 'right', color: c.grey },

  // Narrative
  narrativeTitle: { fontSize: 12, fontFamily: 'Helvetica-Bold', color: c.primary, marginBottom: 6, marginTop: 12 },
  narrativeBody: { fontSize: 10.5, lineHeight: 1.5, color: '#222222', marginBottom: 8, textAlign: 'justify' },
  bulletItem: { fontSize: 10.5, lineHeight: 1.5, color: '#333333', marginBottom: 4, paddingLeft: 10 },

  // Footer & Page Numbers
  footerText: { fontSize: 8, color: c.grey, fontFamily: 'Helvetica-Bold' },
  disclaimer: { fontSize: 8.5, color: c.grey, textAlign: 'justify', fontStyle: 'italic', marginTop: 15 },
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

function HexacoBox({ group, factorMean, facetMeans }) {
  const factorPct = getHexacoPct(factorMean);
  return (
    <View style={styles.hexBox}>
      <View style={styles.hexFactorHeader}>
        <Text style={styles.hexFactorName}>{group.name}</Text>
        <Text style={[styles.hexPctBadge, { backgroundColor: group.color }]}>{Math.round(factorPct)}%</Text>
      </View>
      <View style={styles.hexRow}>
        <Text style={styles.hexRowLabel}>Skor Dimensi</Text>
        <View style={styles.hexRowBar}>
          <View style={[styles.barFill, { width: `${factorPct}%`, backgroundColor: group.color }]} />
        </View>
        <Text style={styles.hexRowPct}>{Math.round(factorPct)}%</Text>
      </View>
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

function IdRow({ label, value }) {
  return (
    <View style={styles.identityRow}>
      <Text style={styles.identityLabel}>{label}</Text>
      <Text style={styles.identityValue}>{value}</Text>
    </View>
  );
}

// ==========================================
// MAIN PDF DOCUMENT
// ==========================================
export default function AssessmentPDF({ userData, discScores, hexacoScores, aiInsight, submittedAt, rawData }) {
  const formatDate = (dateStr) => {
    if (!dateStr) return '.........................';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return '.........................';
      const months = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
      return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
    } catch { return '.........................'; }
  };

  const validity = calculateValidityIndex(rawData || {}, { rawData, discScores, hexacoScores });
  const isSuspicious = validity.overallScore !== '-' && validity.overallScore < 60;
  const validityColor = isSuspicious ? '#b91c1c' : '#166534';
  const nameLabel = (userData?.nama || '-').toUpperCase();

  // Footer Components to handle alternating pages correctly within `render` so we can check pageNumber
  const FooterDynamic = ({ pageNumber }) => {
    const isOdd = pageNumber % 2 !== 0;
    
    if (pageNumber === 1) {
      return (
        <View style={{ position: 'absolute', bottom: 20, left: 85, right: 40, flexDirection: 'row', justifyContent: 'flex-end' }}>
          <Text style={styles.footerText}>Hal. 1</Text>
        </View>
      );
    }

    if (isOdd) {
      return (
        <View style={{ position: 'absolute', bottom: 20, left: 85, right: 40, flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={styles.footerText}>{nameLabel}</Text>
          <Text style={styles.footerText}>Hal. {pageNumber}</Text>
        </View>
      );
    }

    return (
      <View style={{ position: 'absolute', bottom: 20, left: 40, right: 85, flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={styles.footerText}>Hal. {pageNumber}</Text>
        <Text style={styles.footerText}>{nameLabel}</Text>
      </View>
    );
  };

  return (
    <Document>
      {/* ============================================================ */}
      {/* PAGE 1 (ODD) — IDENTITAS, DISC, HEXACO                       */}
      {/* L: 3cm (85pt), R: 40pt                                       */}
      {/* ============================================================ */}
      <Page size="A4" style={styles.pageOdd}>
        <View style={{ textAlign: 'center', marginBottom: 10 }}>
          <Text style={styles.rahasia}>SANGAT RAHASIA</Text>
          <Text style={styles.lembaga}>Lembaga Konseling dan Psikoterapi Islam</Text>
          <Image src="/logo.png" style={styles.logo} alt="Logo" />
          <Text style={styles.address}>Jalan Potre Koneng II No. 31, Kolor, Sumenep 69417 | www.lenterabatin.co.id</Text>
        </View>
        <View style={styles.hr} />
        <Text style={styles.mainTitle}>HASIL PEMETAAN PSIKOLOGIS</Text>

        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Data Responden</Text>
        </View>
        
        <View style={styles.identityContainer}>
          <View style={styles.identityCol}>
            <IdRow label="Nama Lengkap" value={nameLabel} />
            <IdRow label="Usia" value={userData?.usia ? `${userData.usia} tahun` : '-'} />
          </View>
          <View style={styles.identityCol}>
            <IdRow label="Email / NIK" value={userData?.email || '-'} />
            <IdRow label="Asal Instansi" value={userData?.instansi || '-'} />
            <IdRow label="Pekerjaan / Jabatan" value={[userData?.pekerjaan, userData?.jabatan].filter(Boolean).join(' - ') || '-'} />
            <IdRow label="Tanggal Asesmen" value={formatDate(submittedAt)} />
          </View>
        </View>

        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Profil Gaya Kerja</Text>
          <Text style={styles.sectionRightText}>Pola Utama: {getDiscPatternName(discScores?.pattern)} ({discScores?.pattern || '-'})</Text>
        </View>

        <View style={styles.discGrid}>
          <DiscPanel title="Grafik 1 — Publik (Mask)" scores={discScores?.discMost} />
          <DiscPanel title="Grafik 2 — Pribadi (Core)" scores={discScores?.discLeast} />
          <DiscPanel title="Grafik 3 — Aktual (Composite)" scores={discScores?.discComposite} />
        </View>

        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Profil Karakter</Text>
          <Text style={{...styles.sectionRightText, color: validityColor}}>Status Validitas Pengerjaan: {validity.overallLabel} ({validity.overallScore}/100)</Text>
        </View>

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
          <View style={{ ...styles.hexBox, width: '100%', marginBottom: 0, flexDirection: 'row', alignItems: 'center' }}>
             <Text style={{...styles.hexFactorName, width: '40%'}}>Altruism (Interstitial)</Text>
             <View style={{...styles.hexRowBar, width: '45%'}}>
                <View style={[styles.barFill, { width: `${getHexacoPct(hexacoScores?.facetMeans?.['altr'])}%`, backgroundColor: '#e67e22' }]} />
             </View>
             <Text style={{...styles.hexPctBadge, backgroundColor: '#e67e22', marginLeft: 'auto'}}>{Math.round(getHexacoPct(hexacoScores?.facetMeans?.['altr']))}%</Text>
          </View>
        </View>

        <Text style={styles.disclaimer}>
          *Laporan ini disusun berdasarkan hasil asesmen mandiri (self-report). Akurasi hasil sangat bergantung pada keterbukaan dan kejujuran dalam menjawab. Profil kepribadian bersifat dinamis dan dapat berkembang seiring waktu serta pengalaman hidup.
        </Text>

        <View render={({ pageNumber }) => <FooterDynamic pageNumber={pageNumber} />} fixed />
      </Page>

      {/* ============================================================ */}
      {/* PAGE 2+ (WRAP) — DESKRIPSI AI & REKOMENDASI                  */}
      {/* Symmetrical margins (3cm left & right) for safe wrap binding */}
      {/* ============================================================ */}
      <Page size="A4" style={{ paddingTop: 40, paddingBottom: 40, paddingLeft: 85, paddingRight: 85, backgroundColor: '#ffffff', fontFamily: 'Helvetica' }} wrap>
        
        <Image src="/logo.png" style={styles.watermark} fixed alt="Watermark" />
        
        <Text style={styles.pageHeader}>DESKRIPSI KEPRIBADIAN</Text>

        <View style={{ marginBottom: 15 }}>
          <Text style={{...styles.narrativeTitle, marginTop: 0}}>1. Deskripsi Kepribadian Terintegrasi</Text>
          <Text style={styles.narrativeBody}>
            {aiInsight?.deskripsi_kepribadian_terintegrasi || aiInsight?.deskripsi_kepribadian || aiInsight?.gayaKerja || 'Deskripsi kepribadian terpadu belum tersedia. Silakan generate interpretasi AI.'}
          </Text>
        </View>

        {aiInsight?.kekuatan_utama ? (
          <View style={{ marginBottom: 15 }}>
            <Text style={styles.narrativeTitle}>2. Kekuatan Utama</Text>
            {aiInsight.kekuatan_utama.map((k, i) => (
              <Text key={i} style={styles.bulletItem}>• {k}</Text>
            ))}
          </View>
        ) : null}

        {aiInsight?.analisis_lingkungan_ideal ? (
           <View style={{ marginBottom: 15 }}>
            <Text style={styles.narrativeTitle}>{aiInsight?.kekuatan_utama ? '3' : '2'}. Analisis Lingkungan Ideal</Text>
            <Text style={styles.narrativeBody}>
              <Text style={{ fontFamily: 'Helvetica-Bold' }}>Ekosistem Kerja: </Text>
              {aiInsight.analisis_lingkungan_ideal.ekosistem_kerja}
            </Text>
            <Text style={styles.narrativeBody}>
              <Text style={{ fontFamily: 'Helvetica-Bold' }}>Kebutuhan Motivasi: </Text>
              {aiInsight.analisis_lingkungan_ideal.kebutuhan_motivasi}
            </Text>
          </View>
        ) : null}

        <View style={{ marginBottom: 15 }}>
          <Text style={styles.narrativeTitle}>{aiInsight?.analisis_lingkungan_ideal ? '4' : '3'}. Tantangan & Rekomendasi</Text>
          <Text style={styles.narrativeBody}>
            <Text style={{ fontFamily: 'Helvetica-Bold' }}>Area Friksi / Hambatan: </Text>
            {aiInsight?.tantangan_dan_faktor_penghambat?.komunikasi_dan_pola_kerja || 'Belum dianalisis'} 
            {aiInsight?.tantangan_dan_faktor_penghambat?.hambatan_karakter_internal ? ` Terutama dalam konteks internal, ${aiInsight.tantangan_dan_faktor_penghambat.hambatan_karakter_internal}` : ''}
          </Text>
          
          <Text style={{ ...styles.narrativeBody, marginTop: 10 }}>
            <Text style={{ fontFamily: 'Helvetica-Bold' }}>Saran Pengembangan Strategis: </Text>
          </Text>
          {(aiInsight?.saran_pengembangan_spesifik || []).map((k, i) => (
             <Text key={i} style={styles.bulletItem}>• {k}</Text>
          ))}
          {(!aiInsight?.saran_pengembangan_spesifik) ? (
              <Text style={styles.narrativeBody}>Rekomendasi belum tersedia. Silakan generate interpretasi AI terlebih dahulu melalui panel admin.</Text>
          ) : null}
        </View>

        <Text style={styles.disclaimer}>
          *Laporan ini disusun berdasarkan hasil asesmen mandiri (self-report). Akurasi hasil sangat bergantung pada keterbukaan dan kejujuran dalam menjawab. Profil kepribadian bersifat dinamis dan dapat berkembang seiring waktu serta pengalaman hidup.
        </Text>

        {/* Closing */}
        <View style={{ marginTop: 25, padding: 15, backgroundColor: '#fcfcfc', borderRadius: 4 }}>
          <Text style={{ fontSize: 9, color: c.grey, lineHeight: 1.5, textAlign: 'center', fontStyle: 'italic' }}>
            Profil kepribadian bersifat dinamis dan dapat berkembang seiring waktu serta pengalaman hidup. Laporan ini hendaknya dipahami sebagai gambaran kecenderungan perilaku pada saat pengisian asesmen berlangsung, bukan sebagai penilaian mutlak terhadap kemampuan atau potensi seseorang.
          </Text>
        </View>

        {/* Signature */}
        <View style={{ marginTop: 40, flexDirection: 'row', justifyContent: 'flex-end', paddingBottom: 20 }}>
          <View style={{ width: '50%', alignItems: 'center' }}>
            <Text style={{ fontSize: 9.5, color: c.dark, marginBottom: 15 }}>Sumenep, {formatDate(submittedAt)}</Text>
            <Image src="/logo.png" style={{ width: 120, height: 26, marginBottom: 8 }} alt="Logo" />
            <Text style={{ fontSize: 10.5, fontFamily: 'Helvetica-Bold', color: c.dark, marginBottom: 2 }}>Moh. Ilham, M.Si., CHA., C.Med.</Text>
            <Text style={{ fontSize: 8.5, color: c.grey }}>Assessor / Konselor</Text>
          </View>
        </View>

        {/* Premium Upsell Box */}
        <View style={{ marginTop: 20, padding: 15, borderRadius: 8, borderWidth: 1, borderColor: '#3b82f6', backgroundColor: '#eff6ff' }}>
          <Text style={{ fontSize: 11, fontFamily: 'Helvetica-Bold', color: '#1e40af', marginBottom: 6 }}>
            Ingin Membedah Hasil Ini Lebih Dalam?
          </Text>
          <Text style={{ fontSize: 10, color: '#1e3a8a', lineHeight: 1.5, marginBottom: 8, textAlign: 'justify' }}>
            Laporan ini hanya menunjukkan &ldquo;Siapa&rdquo; Anda. Melalui Sesi Konseling Premium, Psikolog Lentera Batin akan membedah &ldquo;Mengapa&rdquo; Anda merasakan kelelahan adaptasi, menemukan titik buta (blind spots) yang menghambat karir, serta menyusun strategi nyata untuk hubungan sosial dan asmara Anda.
          </Text>
          <Text style={{ fontSize: 10, fontFamily: 'Helvetica-Bold', color: '#2563eb' }}>
            Hubungi Admin via WhatsApp: 0851-1777-8798
          </Text>
        </View>

        <View render={({ pageNumber }) => <FooterDynamic pageNumber={pageNumber} />} fixed />
      </Page>
    </Document>
  );
}
