'use client';

import { useState } from 'react';
import { pdf } from '@react-pdf/renderer';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import AssessmentPDF from './AssessmentPDF';
import { logger } from '@/utils/logger';

export default function BatchExportPDF({ data }) {
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  const handleExport = async () => {
    if (!data || data.length === 0) {
      alert("Tidak ada data untuk diekspor.");
      return;
    }

    setIsExporting(true);
    setProgress({ current: 0, total: data.length });

    try {
      const zip = new JSZip();
      
      for (let i = 0; i < data.length; i++) {
        const sub = data[i];
        
        // Generate PDF using pdf() method
        const doc = (
          <AssessmentPDF 
            userData={sub.userData} 
            discScores={sub.discScores} 
            hexacoScores={sub.hexacoScores} 
            aiInsight={sub.aiInsight} 
          />
        );
        const blob = await pdf(doc).toBlob();
        
        // Sanitize filename to avoid OS invalid characters
        const safeName = (sub.userData?.nama || `Klien_${sub.id.substring(0,8)}`).replace(/[^a-zA-Z0-9\s-]/g, '').trim().replace(/\s+/g, '_');
        const safeInstansi = (sub.userData?.instansi || 'Instansi').replace(/[^a-zA-Z0-9\s-]/g, '').trim().replace(/\s+/g, '_');
        const fileName = `${safeName}_${safeInstansi}.pdf`;
        
        zip.file(fileName, blob);
        
        setProgress({ current: i + 1, total: data.length });
      }

      // Generate Zip
      const zipContent = await zip.generateAsync({ type: 'blob' });
      saveAs(zipContent, `Export_Profil_LB_${new Date().toISOString().slice(0,10)}.zip`);
      
    } catch (e) {
      logger.error("Batch Export Error: ", e);
      alert("Terjadi kesalahan saat mengekspor: " + e.message);
    } finally {
      setIsExporting(false);
      setProgress({ current: 0, total: 0 });
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={isExporting || data.length === 0}
      className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm"
    >
      {isExporting ? (
        <>
          <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
          Memproses {progress.current}/{progress.total}
        </>
      ) : (
        <>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export Semua (ZIP)
        </>
      )}
    </button>
  );
}
