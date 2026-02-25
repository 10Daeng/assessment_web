import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer';
import { getDiscPatternName } from '../utils/scoring';

// Register fonts if needed, assuming standard fonts for now

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff'
  },
  header: {
    marginBottom: 30,
    textAlign: 'center'
  },
  rahasia: {
    color: 'red',
    fontSize: 10,
    textAlign: 'right',
    fontFamily: 'Helvetica-Bold',
    marginBottom: 10
  },
  lembaga: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 8
  },
  address: {
    fontSize: 9,
    color: '#333333',
    marginBottom: 20
  },
  mainTitle: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
    marginBottom: 20
  },
  table: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
    paddingBottom: 10
  },
  colLabel: {
    width: '20%',
    fontSize: 10,
    color: '#555555'
  },
  colValue: {
    width: '30%',
    fontSize: 10,
    fontFamily: 'Helvetica-Bold'
  },
  sectionTitle: {
    fontSize: 12,
    color: '#d35400',
    fontFamily: 'Helvetica-Bold',
    marginTop: 15,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#d35400',
    paddingBottom: 4
  },
  
  // DISC Table styles
  discContainer: {
    marginTop: 10,
    marginBottom: 20
  },
  discHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    paddingBottom: 5,
    marginBottom: 5
  },
  discRow: {
    flexDirection: 'row',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
    alignItems: 'center'
  },
  discLabel: {
    width: '30%',
    fontSize: 9,
    fontFamily: 'Helvetica-Bold'
  },
  discScore: {
    width: '20%',
    fontSize: 9,
    textAlign: 'center'
  },
  discBarContainer: {
    width: '50%',
    height: 10,
    backgroundColor: '#f0f0f0',
    position: 'relative'
  },
  discBar: {
    height: '100%',
    position: 'absolute',
    left: 0,
    top: 0
  },

  // Hexaco styles
  hexacoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  hexacoCol: {
    width: '48%'
  },
  hexacoFactorBox: {
    marginBottom: 10
  },
  hexacoFactorName: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 3
  },
  hexacoFacetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2
  },
  hexacoFacetName: {
    fontSize: 8,
    color: '#555555',
    width: '50%',
    paddingLeft: 10
  },
  hexacoFacetBarContainer: {
    width: '50%',
    height: 6,
    backgroundColor: '#f0f0f0',
    position: 'relative'
  },

  // Page 2 styles
  page2Title: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    color: '#333333',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#d35400',
    paddingBottom: 4
  },
  descText: {
    fontSize: 10,
    lineHeight: 1.6,
    color: '#444444',
    marginBottom: 10,
    textAlign: 'justify'
  },
  descSection: {
    marginBottom: 25
  },
  footerText: {
    position: 'absolute', 
    bottom: 30, 
    left: 40, 
    right: 40, 
    fontSize: 8, 
    color: 'grey', 
    textAlign: 'center'
  }
});

const getDiscColor = (trait) => {
  const colors = { D: '#e74c3c', I: '#f1c40f', S: '#2ecc71', C: '#3498db' };
  return colors[trait] || '#333';
};

const getHexacoColor = (factor) => {
  const colors = { H: '#8e44ad', E: '#c0392b', X: '#2980b9', A: '#27ae60', C: '#d35400', O: '#16a085' };
  return colors[factor] || '#333';
};

// Facet definitions to map correctly
const hexacoStructure = {
  left: [
    { factor: 'H', name: 'Honesty-Humility', facets: [{k:'sinc', n:'Sincerity'}, {k:'fair', n:'Fairness'}, {k:'gree', n:'Greed Avoidance'}, {k:'mode', n:'Modesty'}] },
    { factor: 'E', name: 'Emotionality', facets: [{k:'fear', n:'Fearfulness'}, {k:'anxi', n:'Anxiety'}, {k:'depe', n:'Dependence'}, {k:'sent', n:'Sentimentality'}] },
    { factor: 'X', name: 'eXtraversion', facets: [{k:'sses', n:'Social Self-Esteem'}, {k:'socb', n:'Social Boldness'}, {k:'soci', n:'Sociability'}, {k:'live', n:'Liveliness'}] }
  ],
  right: [
    { factor: 'A', name: 'Agreeableness', facets: [{k:'forg', n:'Forgivingness'}, {k:'gent', n:'Gentleness'}, {k:'flex', n:'Flexibility'}, {k:'pati', n:'Patience'}] },
    { factor: 'C', name: 'Conscientiousness', facets: [{k:'orga', n:'Organization'}, {k:'dili', n:'Diligence'}, {k:'perf', n:'Perfectionism'}, {k:'prud', n:'Prudence'}] },
    { factor: 'O', name: 'Openness', facets: [{k:'aesa', n:'Aesthetic Appreciation'}, {k:'inqu', n:'Inquisitiveness'}, {k:'crea', n:'Creativity'}, {k:'unco', n:'Unconventionality'}] }
  ]
};

export default function AssessmentPDF({ userData, discScores, hexacoScores, aiInsight }) {
  
  // Calculate DISC Graph 3 percentages for visualization (Scale -24 to +24)
  // Shift to 0-48 scale, then percentage of 48
  const getDiscPct = (rawScore) => {
    let shifted = rawScore + 24; 
    let pct = (shifted / 48) * 100;
    return Math.max(0, Math.min(100, pct));
  };

  // Hexaco Mean is 1.0 - 5.0. 
  // For percentage bar, formula -> ((Mean - 1) / 4) * 100
  const getHexacoPct = (mean) => {
    const safeMean = mean || 1;
    let pct = ((safeMean - 1) / 4) * 100;
    return Math.max(0, Math.min(100, pct));
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.rahasia}>SANGAT RAHASIA</Text>
          <Text style={styles.lembaga}>Lembaga Konseling dan Psikoterapi Islam</Text>
          <Text style={styles.address}>Jalan Potre Koneng II No. 31, Kolor, Sumenep 69417 | www.lenterabatin.co.id</Text>
          <Text style={styles.mainTitle}>HASIL PEMETAAN PSIKOLOGIS</Text>
        </View>

        {/* IDENTITAS */}
        <View style={styles.table}>
          <Text style={styles.colLabel}>Nama Lengkap:</Text>
          <Text style={styles.colValue}>{userData.nama?.toUpperCase() || '-'}</Text>
          
          <Text style={styles.colLabel}>Pekerjaan:</Text>
          <Text style={styles.colValue}>{userData.pekerjaan || '-'}</Text>
          
          <Text style={styles.colLabel}>Email / NIK:</Text>
          <Text style={styles.colValue}>{userData.email || '-'}</Text>
          
          <Text style={styles.colLabel}>Jabatan:</Text>
          <Text style={styles.colValue}>{userData.jabatan || '-'}</Text>

          <Text style={styles.colLabel}>Asal Instansi:</Text>
          <Text style={styles.colValue}>{userData.instansi || '-'}</Text>

          <Text style={styles.colLabel}>Durasi Asesmen:</Text>
          <Text style={styles.colValue}>{userData.durasi || '-'}</Text>
        </View>

        {/* DISC SECTION */}
        <Text style={styles.sectionTitle}>PROFIL GAYA KERJA (DISC - Composite)</Text>
        <View style={styles.discContainer}>
          <View style={styles.discHeader}>
            <Text style={{...styles.discLabel, width: '30%'}}>ASPEK</Text>
            <Text style={{...styles.discLabel, width: '20%', textAlign: 'center'}}>RAW (G3)</Text>
            <Text style={{...styles.discLabel, width: '50%'}}>VISUALISASI</Text>
          </View>

          {['D', 'I', 'S', 'C'].map((trait) => {
            const raw = discScores.discComposite[trait] || 0;
            const pct = getDiscPct(raw);
            const names = { D: 'Dominance', I: 'Influence', S: 'Steadiness', C: 'Compliance/Conscientious' };
            
            return (
              <View style={styles.discRow} key={trait}>
                <Text style={styles.discLabel}>{names[trait]} ({trait})</Text>
                <Text style={styles.discScore}>{raw > 0 ? `+${raw}` : raw}</Text>
                <View style={styles.discBarContainer}>
                  <View style={[styles.discBar, { width: `${pct}%`, backgroundColor: getDiscColor(trait) }]} />
                </View>
              </View>
            );
          })}
        </View>
        <Text style={{fontSize: 9, textAlign: 'center', color: '#555', marginBottom: 15}}>
          Pola Utama: {getDiscPatternName(discScores?.pattern)} ({discScores?.pattern})
        </Text>

        {/* HEXACO SECTION */}
        <Text style={styles.sectionTitle}>PROFIL KARAKTER (HEXACO 100)</Text>
        <View style={styles.hexacoGrid}>
          
          {/* Left Column (H, E, X) */}
          <View style={styles.hexacoCol}>
            {hexacoStructure.left.map((group) => {
              const factorMean = hexacoScores.factorMeans[group.factor];
              const factorPct = getHexacoPct(factorMean);
              const color = getHexacoColor(group.factor);

              return (
                <View key={group.factor} style={styles.hexacoFactorBox}>
                  <Text style={styles.hexacoFactorName}>{group.name} ({Math.round(factorPct)}%)</Text>
                  
                  {/* Factor Bar */}
                  <View style={{...styles.hexacoFacetBarContainer, width: '100%', height: 8, marginBottom: 4}}>
                    <View style={[styles.discBar, { width: `${factorPct}%`, backgroundColor: color }]} />
                  </View>

                  {/* Facets */}
                  {group.facets.map((facet) => {
                    const facetMean = hexacoScores.facetMeans[facet.k];
                    const facetPct = getHexacoPct(facetMean);
                    return (
                      <View style={styles.hexacoFacetRow} key={facet.k}>
                        <Text style={styles.hexacoFacetName}>{facet.n} ({Math.round(facetPct)}%)</Text>
                        <View style={styles.hexacoFacetBarContainer}>
                          <View style={[styles.discBar, { width: `${facetPct}%`, backgroundColor: color, opacity: 0.6 }]} />
                        </View>
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
              const factorMean = hexacoScores.factorMeans[group.factor];
              const factorPct = getHexacoPct(factorMean);
              const color = getHexacoColor(group.factor);

              return (
                <View key={group.factor} style={styles.hexacoFactorBox}>
                  <Text style={styles.hexacoFactorName}>{group.name} ({Math.round(factorPct)}%)</Text>
                  
                  {/* Factor Bar */}
                  <View style={{...styles.hexacoFacetBarContainer, width: '100%', height: 8, marginBottom: 4}}>
                    <View style={[styles.discBar, { width: `${factorPct}%`, backgroundColor: color }]} />
                  </View>

                  {/* Facets */}
                  {group.facets.map((facet) => {
                    const facetMean = hexacoScores.facetMeans[facet.k];
                    const facetPct = getHexacoPct(facetMean);
                    return (
                      <View style={styles.hexacoFacetRow} key={facet.k}>
                        <Text style={styles.hexacoFacetName}>{facet.n} ({Math.round(facetPct)}%)</Text>
                        <View style={styles.hexacoFacetBarContainer}>
                          <View style={[styles.discBar, { width: `${facetPct}%`, backgroundColor: color, opacity: 0.6 }]} />
                        </View>
                      </View>
                    );
                  })}
                </View>
              );
            })}
            
            {/* Altruism Interstitial */}
            <View style={styles.hexacoFactorBox}>
              <Text style={styles.hexacoFactorName}>Altruism (Interstitial) ({Math.round(getHexacoPct(hexacoScores.facetMeans['altr']))}%)</Text>
              <View style={{...styles.hexacoFacetBarContainer, width: '100%', height: 8, marginBottom: 4}}>
                <View style={[styles.discBar, { width: `${getHexacoPct(hexacoScores.facetMeans['altr'])}%`, backgroundColor: '#e67e22' }]} />
              </View>
            </View>

          </View>

        </View>

        <Text style={styles.footerText}>
          *Laporan ini disusun berdasarkan hasil asesmen mandiri (self-report). Akurasi hasil sangat bergantung pada keterbukaan dan kejujuran dalam menjawab. Profil kepribadian bersifat dinamis dan dapat berkembang seiring waktu.
        </Text>
      </Page>

      {/* PAGE 2 - DESKRIPSI KEPRIBADIAN */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.rahasia}>SANGAT RAHASIA</Text>
          <Text style={styles.lembaga}>Lembaga Konseling dan Psikoterapi Islam</Text>
          <Text style={styles.mainTitle}>DESKRIPSI KEPRIBADIAN</Text>
        </View>

        <View style={styles.descSection}>
          <Text style={styles.page2Title}>1. Dinamika Gaya Kerja</Text>
          <Text style={styles.descText}>
            Secara umum, individu dinilai memiliki kecenderungan karakteristik spesifik dalam merespon sebuah instruksi kerja, mengelola relasi profesional, serta membuat keputusan di tempat kerja.
          </Text>
          <Text style={styles.descText}>
            {aiInsight?.gayaKerja || `[Deskripsi gaya kerja belum digenerate.]`}
          </Text>
        </View>

        <View style={styles.descSection}>
          <Text style={styles.page2Title}>2. Dinamika Karakter Inti</Text>
          <Text style={styles.descText}>
            Profil karakter inti seseorang memberikan gambaran mengenai cara individu memaknai interaksi sosial, merespon tantangan emosional, serta menjalankan komitmen dan nilai moral sehari-hari. 
          </Text>
          <Text style={styles.descText}>
            {aiInsight?.karakterInti || '[Ringkasan profil karakter belum digenerate.]'}
          </Text>
        </View>

        <View style={styles.descSection}>
          <Text style={styles.page2Title}>3. Rekomendasi Pengembangan Diri</Text>
          <Text style={styles.descText}>
            Berdasarkan keseluruhan profil asesmen di atas, berikut adalah beberapa area yang dapat menjadi fokus pengembangan di masa mendatang:
          </Text>
          {aiInsight ? (
            <>
              <Text style={styles.descText}>• {aiInsight.rekomendasi1}</Text>
              <Text style={styles.descText}>• {aiInsight.rekomendasi2}</Text>
              <Text style={styles.descText}>• {aiInsight.rekomendasi3}</Text>
            </>
          ) : (
            <>
              <Text style={styles.descText}>• [Saran Pengembangan 1 belum digenerate]</Text>
              <Text style={styles.descText}>• [Saran Pengembangan 2 belum digenerate]</Text>
              <Text style={styles.descText}>• [Saran Pengembangan 3 belum digenerate]</Text>
            </>
          )}
        </View>

        <Text style={styles.footerText}>
          *Laporan ini disusun berdasarkan hasil asesmen mandiri (self-report). Akurasi hasil sangat bergantung pada keterbukaan dan kejujuran dalam menjawab. Profil kepribadian bersifat dinamis dan dapat berkembang seiring waktu.
        </Text>
      </Page>
    </Document>
  );
}
