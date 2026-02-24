'use client';
import { PDFDownloadLink } from '@react-pdf/renderer';
import AssessmentPDF from './AssessmentPDF';

export default function PDFExport({ userData, discScores, hexacoScores, aiInsight }) {
  return (
    <PDFDownloadLink 
      document={
        <AssessmentPDF 
          userData={userData} 
          discScores={discScores} 
          hexacoScores={hexacoScores} 
          aiInsight={aiInsight}
        />
      }
      fileName={`${(userData?.nama || 'Klien').replace(/[^a-zA-Z0-9\s-]/g, '').trim().replace(/\s+/g, '_')}_${(userData?.instansi || 'Instansi').replace(/[^a-zA-Z0-9\s-]/g, '').trim().replace(/\s+/g, '_')}.pdf`}
      className="inline-flex items-center justify-center gap-3 w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium py-4 px-10 rounded-xl text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
    >
      {({ loading }) => (loading ? 'Menyiapkan PDF...' : 'Unduh Laporan PDF (Cetak)')}
    </PDFDownloadLink>
  );
}
