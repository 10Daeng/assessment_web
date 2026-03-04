'use client';

import { useState } from 'react';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import { logger } from '@/utils/logger';
import dynamic from 'next/dynamic';

const AssessmentPDF = dynamic(() => import('./AssessmentPDF'), { ssr: false });

export default function ExportSinglePDF({ sub }) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const doc = (
        <AssessmentPDF 
          userData={sub.userData} 
          discScores={sub.discScores} 
          hexacoScores={sub.hexacoScores} 
          aiInsight={sub.aiInsight} 
          submittedAt={sub.submittedAt}
          rawData={sub.rawData}
        />
      );
      const blob = await pdf(doc).toBlob();
      
      const safeName = (sub.userData?.nama || `Klien_${sub.id.substring(0,8)}`).replace(/[^a-zA-Z0-9\s-]/g, '').trim().replace(/\s+/g, '_');
      const safeInstansi = (sub.userData?.instansi || 'Instansi').replace(/[^a-zA-Z0-9\s-]/g, '').trim().replace(/\s+/g, '_');
      const fileName = `${safeName}_${safeInstansi}.pdf`;
      
      saveAs(blob, fileName);
    } catch (e) {
      logger.error("Single Export Error: ", e);
      alert("Terjadi kesalahan saat mencetak PDF: " + e.message);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      className={`text-emerald-400 hover:text-emerald-300 text-lg font-medium px-2 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-lg inline-flex items-center justify-center transition-all ${isExporting ? 'opacity-50 cursor-not-allowed' : ''}`}
      title="Cetak PDF Laporan"
    >
      {isExporting ? '⏳' : '🖨️'}
    </button>
  );
}
