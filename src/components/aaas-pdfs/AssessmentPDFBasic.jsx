import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import { getDiscPatternName } from '../../utils/scoring';

const c = {
  primary: '#1e40af', // Blue 800 - Different from old orange theme
  discD: '#e74c3c', discI: '#f1c40f', discS: '#2ecc71', discC: '#3498db',
  dark: '#1a1a1a', grey: '#555555', light: '#f7f9fa', line: '#e0e0e0',
};

const styles = StyleSheet.create({
  pageOdd: { paddingTop: 40, paddingBottom: 65, paddingLeft: 71, paddingRight: 40, fontFamily: 'Helvetica', backgroundColor: '#ffffff' },
  pageWrap: { paddingTop: 40, paddingBottom: 65, paddingLeft: 55, paddingRight: 55, fontFamily: 'Helvetica', backgroundColor: '#ffffff' },
  rahasia: { color: 'red', fontSize: 10, textAlign: 'right', fontFamily: 'Helvetica-Bold', marginBottom: 5 },
  lembaga: { fontSize: 13, fontFamily: 'Helvetica-Bold', textAlign: 'center', marginBottom: 5 },
  logo: { width: 180, height: 38, alignSelf: 'center', marginBottom: 5 },
  address: { fontSize: 8, color: c.grey, textAlign: 'center', marginBottom: 15 },
  mainTitle: { fontSize: 16, fontFamily: 'Helvetica-Bold', textAlign: 'center', marginBottom: 15, color: c.dark },
  hr: { borderBottomWidth: 1.5, borderBottomColor: c.primary, marginBottom: 15 },
  pageHeader: { fontSize: 16, fontFamily: 'Helvetica-Bold', color: c.primary, marginBottom: 12, borderBottomWidth: 1.5, borderBottomColor: c.primary, paddingBottom: 5, textTransform: 'uppercase' },
  watermark: { position: 'absolute', top: '42%', left: '15%', width: '70%', opacity: 0.04 },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 6, borderBottomWidth: 1.5, borderBottomColor: c.primary, paddingBottom: 4, marginTop: 10 },
  sectionTitle: { fontSize: 12, color: c.primary, fontFamily: 'Helvetica-Bold' },
  sectionRightText: { fontSize: 9, fontFamily: 'Helvetica-Bold', color: c.dark },
  identityContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  identityCol: { width: '48%' },
  identityRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#eeeeee', paddingVertical: 5, alignItems: 'center' },
  identityLabel: { width: '40%', fontSize: 9.5, color: c.grey },
  identityValue: { width: '60%', fontSize: 9.5, fontFamily: 'Helvetica-Bold', color: c.dark },
  discGrid: { flexDirection: 'row', justifyContent: 'space-between', mb: 15 },
  discPanel: { width: '31.5%', border: '1 solid #e0e0e0', borderRadius: 3, padding: 8 },
  discPanelTitle: { fontSize: 7.5, fontFamily: 'Helvetica-Bold', textAlign: 'center', color: c.grey, marginBottom: 7, textTransform: 'uppercase', letterSpacing: 0.5 },
  discRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  discLabel: { width: '35%', fontSize: 7.5, fontFamily: 'Helvetica-Bold' },
  discBarBg: { width: '42%', height: 7, backgroundColor: '#f0f0f0', position: 'relative' },
  barFill: { height: '100%', position: 'absolute', left: 0, top: 0 },
  discVal: { width: '23%', fontSize: 7.5, textAlign: 'right', fontFamily: 'Helvetica-Bold' },
  narrativeTitle: { fontSize: 12, fontFamily: 'Helvetica-Bold', color: c.primary, marginBottom: 6, marginTop: 8 },
  narrativeBody: { fontSize: 10.5, lineHeight: 1.5, color: '#222222', marginBottom: 8, textAlign: 'justify' },
  footerContainer: { position: 'absolute', bottom: 25, left: 55, right: 55, flexDirection: 'row', justifyContent: 'space-between' },
  footerText: { fontSize: 8, color: c.grey, fontFamily: 'Helvetica-Bold' },
});

const getDiscPct = (raw) => Math.max(0, Math.min(100, (((raw || 0) + 24) / 48) * 100));

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

function IdRow({ label, value }) {
  return (
    <View style={styles.identityRow}>
      <Text style={styles.identityLabel}>{label}</Text>
      <Text style={styles.identityValue}>{value}</Text>
    </View>
  );
}

export default function AssessmentPDFBasic({ session, aiInsight, calculatedScores }) {
  const { discScores } = calculatedScores || {};
  
  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    try {
      const d = new Date(dateStr);
      return `${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()}`;
    } catch { return '-'; }
  };

  const nameLabel = (session?.participantName || '-').toUpperCase();

  return (
    <Document>
      <Page size="A4" style={styles.pageWrap} wrap>
        <View style={{ textAlign: 'center', marginBottom: 10 }}>
          <Text style={styles.rahasia}>SANGAT RAHASIA - BASIC PACK</Text>
          <Text style={styles.lembaga}>Lembaga Konseling dan Psikoterapi Islam</Text>
          <Image src="/logo.png" style={styles.logo} />
          <Text style={styles.address}>Jalan Potre Koneng II No. 31, Kolor, Sumenep 69417 | www.lenterabatin.co.id</Text>
        </View>
        <View style={styles.hr} />
        <Text style={styles.mainTitle}>HASIL PEMETAAN GAYA KERJA DASAR (DISC)</Text>

        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Data Responden</Text>
        </View>
        
        <View style={styles.identityContainer}>
          <View style={styles.identityCol}>
            <IdRow label="ID Sesi" value={session?.id?.substring(0,8) || '-'} />
            <IdRow label="Nama Lengkap" value={nameLabel} />
            <IdRow label="Email" value={session?.participantEmail || '-'} />
          </View>
          <View style={styles.identityCol}>
            <IdRow label="Usia" value={session?.participantAge || '-'} />
            <IdRow label="Tanggal Asesmen" value={formatDate(session?.startedAt)} />
            <IdRow label="Paket Asesmen" value="Basic (DISC Only)" />
          </View>
        </View>

        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Profil Gaya Kerja</Text>
          <Text style={styles.sectionRightText}>Pola Utama: {getDiscPatternName(discScores?.pattern)} ({discScores?.pattern || '-'})</Text>
        </View>

        <View style={styles.discGrid}>
          <DiscPanel title="Grafik 1 — Publik" scores={discScores?.discMost} />
          <DiscPanel title="Grafik 2 — Pribadi" scores={discScores?.discLeast} />
          <DiscPanel title="Grafik 3 — Aktual" scores={discScores?.discComposite} />
        </View>

        <View style={{ marginTop: 15 }}>
          <Text style={styles.narrativeTitle}>Interpretasi Gaya Kerja</Text>
          <Text style={styles.narrativeBody}>
            {aiInsight?.analisis_gaya_kerja || aiInsight || 'Hasil analisis gaya kerja belum dirumuskan sepenuhnya oleh mesin kami.'}
          </Text>
        </View>

        <View style={{ marginTop: 30, padding: 15, borderRadius: 8, borderWidth: 1, borderColor: '#e2e8f0', backgroundColor: '#f8fafc' }}>
          <Text style={{ fontSize: 10,  color: '#475569', lineHeight: 1.5, textAlign: 'justify' }}>
            <Text style={{ fontFamily: 'Helvetica-Bold' }}>Catatan: </Text>
            Anda sedang melihat Laporan Paket Basic. Jika Anda merasa membutuhkan analisis yang jauh lebih mendalam mengenai Integritas, Emosinalitas, dan faktor Karakter mendasar lainnya, pertimbangkan untuk mengambil Paket Reguler atau Premium.
          </Text>
        </View>

        <View fixed style={styles.footerContainer}>
          <Text render={({ pageNumber }) => `Hal. ${pageNumber}`} style={styles.footerText} />
          <Text style={styles.footerText}>{nameLabel}</Text>
        </View>
      </Page>
    </Document>
  );
}
