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
  pageOdd: { paddingTop: 40, paddingBottom: 65, paddingLeft: 71, paddingRight: 40, fontFamily: 'Helvetica', backgroundColor: '#ffffff' },
  pageEven: { paddingTop: 40, paddingBottom: 65, paddingLeft: 40, paddingRight: 71, fontFamily: 'Helvetica', backgroundColor: '#ffffff' },
  pageWrap: { paddingTop: 40, paddingBottom: 65, paddingLeft: 55, paddingRight: 55, fontFamily: 'Helvetica', backgroundColor: '#ffffff' },

  // Fonts back to normal/readable size
  rahasia: { color: 'red', fontSize: 10, textAlign: 'right', fontFamily: 'Helvetica-Bold', marginBottom: 5 },
  lembaga: { fontSize: 13, fontFamily: 'Helvetica-Bold', textAlign: 'center', marginBottom: 5 },
  logo: { width: 180, height: 38, alignSelf: 'center', marginBottom: 5 },
  address: { fontSize: 8, color: c.grey, textAlign: 'center', marginBottom: 15 },
  mainTitle: { fontSize: 16, fontFamily: 'Helvetica-Bold', textAlign: 'center', marginBottom: 15, color: c.dark },
  hr: { borderBottomWidth: 1.5, borderBottomColor: c.primary, marginBottom: 15 },
  pageHeader: { fontSize: 16, fontFamily: 'Helvetica-Bold', color: c.primary, marginBottom: 12, borderBottomWidth: 1.5, borderBottomColor: c.primary, paddingBottom: 5, textTransform: 'uppercase' },

  // Watermark for pages 2+
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

  // Footer (absolute positioned)
  footerContainer: { position: 'absolute', bottom: 25, left: 55, right: 55, flexDirection: 'row', justifyContent: 'space-between' },
  footerText: { fontSize: 8, color: c.grey, fontFamily: 'Helvetica-Bold' },
  disclaimer: { fontSize: 8.5, color: c.grey, textAlign: 'justify', fontStyle: 'italic', marginTop: 15 },
});

// ==========================================
// HELPERS
// ==========================================
const hexacoStructure = [
  { factor: 'H', name: 'Kejujuran-Kerendahan Hati', color: c.hexH, facets: [{k:'sinc',n:'Ketulusan'},{k:'fair',n:'Keadilan'},{k:'gree',n:'Tanpa Keserakahan'},{k:'mode',n:'Kesederhanaan'}] },
  { factor: 'E', name: 'Emosionalitas', color: c.hexE, facets: [{k:'fear',n:'Ketakutan'},{k:'anxi',n:'Kecemasan'},{k:'depe',n:'Ketergantungan'},{k:'sent',n:'Sentimentalitas'}] },
  { factor: 'X', name: 'Ekstraversi', color: c.hexX, facets: [{k:'sses',n:'Percaya Diri Sosial'},{k:'socb',n:'Keberanian Sosial'},{k:'soci',n:'Kemudahan Bergaul'},{k:'live',n:'Semangat / Ceria'}] },
  { factor: 'A', name: 'Keramahan', color: c.hexA, facets: [{k:'forg',n:'Pemaaf'},{k:'gent',n:'Kelembutan'},{k:'flex',n:'Fleksibilitas'},{k:'pati',n:'Kesabaran'}] },
  { factor: 'C', name: 'Kesungguhan (Hati-hati)', color: c.hexC, facets: [{k:'orga',n:'Pengorganisasian'},{k:'dili',n:'Kerajinan'},{k:'perf',n:'Perfeksionisme'},{k:'prud',n:'Kehati-hatian'}] },
  { factor: 'O', name: 'Keterbukaan', color: c.hexO, facets: [{k:'aesa',n:'Apresiasi Estetika'},{k:'inqu',n:'Keingintahuan'},{k:'crea',n:'Kreativitas'},{k:'unco',n:'Originalitas'}] },
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

  return (
    <Document>
      {/* ============================================================ */}
      {/* PAGE 1 — IDENTITAS, DISC, HEXACO (TANPA FOOTER)              */}
      {/* ============================================================ */}
      <Page size="A4" style={styles.pageOdd}>
        <View style={{ textAlign: 'center', marginBottom: 10 }}>
          <Text style={styles.rahasia}>SANGAT RAHASIA</Text>
          <Text style={styles.lembaga}>Lembaga Konseling dan Psikoterapi Islam</Text>
          <Image src="/logo.png" style={styles.logo} />
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
            <IdRow label="Asal Instansi" value={userData?.instansi || '-'} />
          </View>
          <View style={styles.identityCol}>
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
          <DiscPanel title="Grafik 3 — Aktual" scores={discScores?.discComposite} />
        </View>

        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Profil Karakter</Text>
          <Text style={{...styles.sectionRightText, color: validityColor}}>Status Validitas: {validity.overallLabel} ({validity.overallScore}/100)</Text>
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
          {/* Altruisme */}
          <View style={{ ...styles.hexBox, width: '100%', marginBottom: 0, flexDirection: 'row', alignItems: 'center' }}>
             <Text style={{...styles.hexFactorName, width: '40%'}}>Altruisme (Tambahan)</Text>
             <View style={{...styles.hexRowBar, width: '45%'}}>
                <View style={[styles.barFill, { width: `${getHexacoPct(hexacoScores?.facetMeans?.['altr'])}%`, backgroundColor: '#e67e22' }]} />
             </View>
             <Text style={{...styles.hexPctBadge, backgroundColor: '#e67e22', marginLeft: 'auto'}}>{Math.round(getHexacoPct(hexacoScores?.facetMeans?.['altr']))}%</Text>
          </View>
        </View>

        {/* TIDAK ADA FOOTER DI HALAMAN 1 */}
      </Page>

      {/* ============================================================ */}
      {/* PAGE 2 & 3 — DESKRIPSI AI (MENGGUNAKAN WRAP)                 */}
      {/* ============================================================ */}
      <Page size="A4" style={styles.pageWrap} wrap>
        
        <Image src="/logo.png" style={styles.watermark} fixed />
        
        <Text style={styles.pageHeader}>DESKRIPSI KEPRIBADIAN</Text>

        <View wrap={false} style={{ marginBottom: 15 }}>
          <Text style={{...styles.narrativeTitle, marginTop: 0}}>1. Deskripsi Kepribadian Terintegrasi</Text>
          <Text style={styles.narrativeBody}>
            {aiInsight?.deskripsi_kepribadian_terintegrasi || aiInsight?.deskripsi_kepribadian || aiInsight?.gayaKerja || 'Deskripsi kepribadian terpadu belum tersedia. Silakan generate interpretasi AI.'}
          </Text>
        </View>

        {aiInsight?.kekuatan_utama ? (
          <View wrap={false} style={{ marginBottom: 15 }}>
            <Text style={styles.narrativeTitle}>2. Kekuatan Utama</Text>
            {aiInsight.kekuatan_utama.map((k, i) => (
              <Text key={i} style={styles.bulletItem}>• {k}</Text>
            ))}
          </View>
        ) : null}

        <View wrap={false} style={{ marginBottom: 15 }}>
          <Text style={styles.narrativeTitle}>{aiInsight?.kekuatan_utama ? '3' : '2'}. Tantangan & Hambatan</Text>
          <Text style={styles.narrativeBody}>
            <Text style={{ fontFamily: 'Helvetica-Bold' }}>Area Friksi / Hambatan: </Text>
            {aiInsight?.tantangan_dan_faktor_penghambat?.komunikasi_dan_pola_kerja || '-'} 
            {aiInsight?.tantangan_dan_faktor_penghambat?.hambatan_karakter_internal ? ` ${aiInsight.tantangan_dan_faktor_penghambat.hambatan_karakter_internal}` : ''}
          </Text>
        </View>

        {aiInsight?.analisis_lingkungan_ideal ? (
           <View wrap={false} style={{ marginBottom: 15 }}>
            <Text style={styles.narrativeTitle}>{aiInsight?.kekuatan_utama ? '4' : '3'}. Analisis Lingkungan Ideal</Text>
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

        <View wrap={false} style={{ marginBottom: 15 }}>
          <Text style={styles.narrativeTitle}>{aiInsight?.analisis_lingkungan_ideal ? '5' : '4'}. Saran Pengembangan Strategis</Text>
          {(aiInsight?.saran_pengembangan_spesifik || []).map((k, i) => (
             <Text key={i} style={styles.bulletItem}>• {k}</Text>
          ))}
          {(!aiInsight?.saran_pengembangan_spesifik || aiInsight.saran_pengembangan_spesifik.length === 0) ? (
              <Text style={styles.narrativeBody}>Rekomendasi belum tersedia. Silakan generate interpretasi AI terlebih dahulu melalui panel admin.</Text>
          ) : null}
        </View>

        {/* Disclaimer / Teks Penutup */}
        <View style={{ marginTop: 25, padding: 15, backgroundColor: '#fcfcfc', borderRadius: 4 }}>
          <Text style={{ fontSize: 9, color: c.grey, lineHeight: 1.5, textAlign: 'center', fontStyle: 'italic' }}>
            *Laporan ini disusun berdasarkan hasil asesmen mandiri (self-report). Akurasi hasil sangat bergantung pada keterbukaan dan kejujuran dalam menjawab. Profil kepribadian bersifat dinamis dan dapat berkembang seiring waktu serta pengalaman hidup. Laporan ini hendaknya dipahami sebagai gambaran kecenderungan perilaku pada saat pengisian asesmen berlangsung, bukan sebagai penilaian mutlak terhadap kemampuan atau potensi seseorang.
          </Text>
        </View>

        {/* Signature Box */}
        <View style={{ marginTop: 40, flexDirection: 'row', justifyContent: 'flex-end', paddingBottom: 20 }}>
          <View style={{ width: '50%', alignItems: 'center' }}>
            <Text style={{ fontSize: 9.5, color: c.dark, marginBottom: 15 }}>Sumenep, {formatDate(new Date())}</Text>
            <Image src="/logo.png" style={{ width: 120, height: 26, marginBottom: 8 }} />
            <Text style={{ fontSize: 10.5, fontFamily: 'Helvetica-Bold', color: c.dark, marginBottom: 2 }}>Moh. Ilham, M.Si., CHA., C.Med.</Text>
            <Text style={{ fontSize: 8.5, color: c.grey }}>Assessor / Konselor</Text>
          </View>
        </View>

        {/* Premium Upsell Box */}
        <View wrap={false} style={{ marginTop: 30, padding: 15, borderRadius: 8, borderWidth: 1, borderColor: '#3b82f6', backgroundColor: '#eff6ff' }}>
          <Text style={{ fontSize: 11, fontFamily: 'Helvetica-Bold', color: '#1e40af', marginBottom: 6 }}>
            Mari Pahami Diri dan Kuatkan Hati Lebih Dalam
          </Text>
          <Text style={{ fontSize: 10, color: '#1e3a8a', lineHeight: 1.5, marginBottom: 8, textAlign: 'justify' }}>
            Laporan yang Anda pegang saat ini adalah peta tentang "Siapa" Anda. Namun, peta saja tidak cukup jika Anda merasa sedang tersesat atau mengalami kelelahan batin.{"\n\n"}
            Di Lentera Batin, kami mengundang Anda untuk duduk bersama dalam Sesi Konseling Premium. Kita tidak hanya akan membaca angka hasil tes, tetapi juga membedah "Mengapa" Anda sering mengalami kelelahan adaptasi, menavigasi blind spots (titik buta) yang menghambat kemajuan karir, dan menata ulang strategi untuk kebahagiaan hubungan sosial serta asmara Anda.
          </Text>
          <Text style={{ fontSize: 10, fontFamily: 'Helvetica-Bold', color: '#2563eb' }}>
            Mari temukan kembali kendali atas diri Anda. Hubungi Admin kami untuk reservasi jadwal via WhatsApp: 0851-1777-8798
          </Text>
        </View>

        {/* Footer */}
        <View fixed style={styles.footerContainer}>
          <Text render={({ pageNumber }) => `Hal. ${pageNumber}`} style={styles.footerText} />
          <Text style={styles.footerText}>{nameLabel}</Text>
        </View>
      </Page>
    </Document>
  );
}
