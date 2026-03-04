'use client';

import { useState, useRef, useEffect } from 'react';
import { pdf } from '@react-pdf/renderer';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import AssessmentPDF from './AssessmentPDF';
import { logger } from '@/utils/logger';

export default function BatchExportPDF({ data }) {
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleExport = async (startIndex = 0, endIndex = data.length, chunkSize = 20) => {
    setIsOpen(false);
    const dataToExport = data.slice(startIndex, endIndex);

    if (!dataToExport || dataToExport.length === 0) {
      alert("Tidak ada data untuk diekspor pada rentang ini.");
      return;
    }

    setIsExporting(true);
    setProgress({ current: 0, total: dataToExport.length });

    try {
      let zip = new JSZip();
      let zipCount = 1;
      
      for (let i = 0; i < dataToExport.length; i++) {
        const sub = dataToExport[i];
        
        // Generate PDF using pdf() method
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
        
        // Sanitize filename to avoid OS invalid characters
        const safeName = (sub.userData?.nama || `Klien_${sub.id.substring(0,8)}`).replace(/[^a-zA-Z0-9\s-]/g, '').trim().replace(/\s+/g, '_');
        const safeInstansi = (sub.userData?.instansi || 'Instansi').replace(/[^a-zA-Z0-9\s-]/g, '').trim().replace(/\s+/g, '_');
        const fileName = `${safeName}_${safeInstansi}.pdf`;
        
        zip.file(fileName, blob);
        
        setProgress({ current: i + 1, total: dataToExport.length });

        // Chunking the ZIP output to prevent memory overload in browser (macet)
        if ((i + 1) % chunkSize === 0 || i === dataToExport.length - 1) {
          const zipContent = await zip.generateAsync({ type: 'blob' });
          const partSuffix = dataToExport.length > chunkSize ? `_Part${zipCount}` : '';
          const rangeSuffix = (startIndex > 0 || endIndex < data.length) ? `_${startIndex + 1}-${Math.min(endIndex, data.length)}` : '';
          saveAs(zipContent, `Export_Profil_LB${rangeSuffix}${partSuffix}_${new Date().toISOString().slice(0,10)}.zip`);
          
          if (i !== dataToExport.length - 1) {
            zip = new JSZip(); // Reset untuk batch berikutnya
            zipCount++;
            // Jeda 2 detik agar browser bisa memory garbage collection
            await new Promise(r => setTimeout(r, 2000));
          }
        } else {
          // Jeda singkat agar UI tidak freeze
          await new Promise(r => setTimeout(r, 200));
        }
      }

    } catch (e) {
      logger.error("Batch Export Error: ", e);
      alert("Terjadi kesalahan saat mengekspor: " + e.message);
    } finally {
      setIsExporting(false);
      setProgress({ current: 0, total: 0 });
    }
  };

  // Generate chunk options for 20 and 15
  const generateChunks = (size) => {
    const chunks = [];
    if (!data) return chunks;
    for (let i = 0; i < data.length; i += size) {
      chunks.push({ start: i, end: i + size });
    }
    return chunks;
  };

  const chunks20 = generateChunks(20);
  const chunks15 = generateChunks(15);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isExporting || !data || data.length === 0}
        className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-2 shadow-sm"
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
            Export (ZIP) ▾
          </>
        )}
      </button>

      {isOpen && !isExporting && (
        <div className="origin-top-right absolute right-0 mt-2 w-64 rounded-xl shadow-lg bg-slate-800 border border-slate-700 ring-1 ring-black ring-opacity-5 z-50 divide-y divide-slate-700/50 max-h-[80vh] overflow-y-auto">
          <div className="py-1">
            <button
              onClick={() => handleExport(0, data.length, 20)}
              className="w-full text-left px-4 py-3 text-sm text-emerald-400 font-medium hover:bg-slate-700 transition-colors"
            >
              🚀 Export Semua (Auto Patah per 20)
            </button>
          </div>
          
          <div className="py-1">
            <div className="px-4 py-2 text-xs font-semibold text-slate-400 bg-slate-800/80 uppercase tracking-wider sticky top-0">
              Download Parsial (per 20)
            </div>
            {chunks20.map((chunk, idx) => (
              <button
                key={`20-${idx}`}
                onClick={() => handleExport(chunk.start, chunk.end, 20)}
                className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
              >
                Data {chunk.start + 1} - {Math.min(chunk.end, data.length)}
              </button>
            ))}
          </div>

          <div className="py-1">
            <div className="px-4 py-2 text-xs font-semibold text-slate-400 bg-slate-800/80 uppercase tracking-wider sticky top-0">
              Download Parsial (per 15)
            </div>
            {chunks15.map((chunk, idx) => (
              <button
                key={`15-${idx}`}
                onClick={() => handleExport(chunk.start, chunk.end, 15)}
                className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
              >
                Data {chunk.start + 1} - {Math.min(chunk.end, data.length)}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
