'use client';
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { calculateValidityIndex } from '@/utils/validityCheck';
import { logger } from '@/utils/logger';

function SortIcon({ sortBy, sortDir, field }) {
  if (sortBy !== field) return <span className="text-slate-600 ml-1">↕</span>;
  return <span className="text-blue-400 ml-1">{sortDir === 'asc' ? '↑' : '↓'}</span>;
}

const getFirstSentence = (str) => {
  if (!str) return '';
  const match = str.match(/[^.!?]+[.!?]*/);
  return match ? match[0].trim() : str.trim();
};

// Deteksi kata kunci risiko/bahaya untuk highlight otomatis
const RISK_KEYWORDS = ['burnout', 'kelelahan', 'konflik', 'stres', 'stress', 'isolasi', 'frustrasi', 'overload', 'masking', 'topeng', 'menguras', 'menahan'];

const highlightRisk = (text) => {
  if (!text) return '-';
  const lower = text.toLowerCase();
  const hasRisk = RISK_KEYWORDS.some(k => lower.includes(k));
  if (hasRisk) {
    return (
      <span className="bg-red-500/15 text-red-400 font-medium px-2 py-1 rounded-md text-xs border border-red-500/20 inline-block">
        ⚠️ {text}
      </span>
    );
  }
  return text;
};

// Same deskripsi as full report, but displayed with proper line breaks
const getDeskripsiLaporan = (ai) => {
  return ai?.deskripsi_kepribadian_terintegrasi || ai?.deskripsi_kepribadian || ai?.karakterInti || (
    <span className="text-slate-600 italic">Analisis AI belum digenerate</span>
  );
};

export default function RekapPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searchField, setSearchField] = useState('semua');
  const [sortBy, setSortBy] = useState('');
  const [sortDir, setSortDir] = useState('asc');

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/admin/submissions?sortBy=submittedAt&sortDir=desc');
        const json = await res.json();
        setData(json.data || []);
      } catch (e) {
        logger.error(e);
      }
      setLoading(false);
    }
    load();
  }, []);

  function toggleSort(field) {
    if (sortBy === field) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDir('asc');
    }
  }

  const getValidityColor = (score) => {
    if (score === '-') return 'text-slate-500';
    if (score >= 80) return 'text-emerald-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-rose-400';
  };

  const getValidityLabel = (score) => {
    if (score === '-') return '-';
    if (score >= 80) return 'Valid';
    if (score >= 60) return 'Meragukan';
    return 'Tidak Valid';
  };

  const sorted = useMemo(() => {
    let list = [...data];

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(s => {
        const ud = s.userData || {};
        const ai = s.aiInsight || {};
        if (searchField === 'nama') return (ud.nama || '').toLowerCase().includes(q);
        if (searchField === 'arketipe') return (ai.arketipe_personal || ai.arketipe || '').toLowerCase().includes(q);
        if (searchField === 'instansi') return (ud.instansi || '').toLowerCase().includes(q);
        // semua
        return (ud.nama || '').toLowerCase().includes(q)
          || (ai.arketipe_personal || ai.arketipe || '').toLowerCase().includes(q)
          || (ud.instansi || '').toLowerCase().includes(q);
      });
    }

    // Sort
    if (sortBy) {
      list.sort((a, b) => {
        let va, vb;
        switch (sortBy) {
          case 'validitas': {
            const validityA = calculateValidityIndex(a.rawData, a);
            const validityB = calculateValidityIndex(b.rawData, b);
            va = typeof validityA.overallScore === 'number' ? validityA.overallScore : -1;
            vb = typeof validityB.overallScore === 'number' ? validityB.overallScore : -1;
            if (va < vb) return sortDir === 'asc' ? -1 : 1;
            if (va > vb) return sortDir === 'asc' ? 1 : -1;
            return 0;
          }
          case 'nama': va = a.userData?.nama || ''; vb = b.userData?.nama || ''; break;
          case 'arketipe':
            va = a.aiInsight?.arketipe_personal || a.aiInsight?.arketipe || '';
            vb = b.aiInsight?.arketipe_personal || b.aiInsight?.arketipe || '';
            break;
          case 'instansi': va = a.userData?.instansi || ''; vb = b.userData?.instansi || ''; break;
          default: return 0;
        }
        va = va.toLowerCase(); vb = vb.toLowerCase();
        if (va < vb) return sortDir === 'asc' ? -1 : 1;
        if (va > vb) return sortDir === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return list;
  }, [data, search, searchField, sortBy, sortDir]);

  const downloadExcel = async () => {
    if (sorted.length === 0) return;

    const exportData = sorted.map((sub, index) => {
      const d = sub.userData || {};
      const ai = sub.aiInsight || {};
      const val = calculateValidityIndex(sub.rawData, sub);

      return {
        "No": index + 1,
        "Validitas": val.overallScore ?? '-',
        "Nama": d.nama || '-',
        "Instansi": d.instansi || '-',
        "Pola DISC Asli": sub.discScores?.fullPattern || sub.discScores?.pattern || '-',
        "Arketipe": ai.arketipe_personal || ai.arketipe || '-',
        "Deskripsi Kepribadian Terintegrasi": ai.deskripsi_kepribadian_terintegrasi || ai.deskripsi_kepribadian || ai.karakterInti || '-',
        "Kekuatan Utama": Array.isArray(ai.kekuatan_utama) ? ai.kekuatan_utama.map(k=>`• ${k}`).join('\n') : (ai.kekuatan || '-'),
        "Tantangan Utama": ai.tantangan_dan_faktor_penghambat ? `Komunikasi: ${ai.tantangan_dan_faktor_penghambat.komunikasi_dan_pola_kerja}\nInternal: ${ai.tantangan_dan_faktor_penghambat.hambatan_karakter_internal}` : (ai.tantangan || '-'),
        "Saran Pengembangan": Array.isArray(ai.saran_pengembangan_spesifik) ? ai.saran_pengembangan_spesifik.map(s=>`• ${s}`).join('\n') : (ai.saran || '-'),
        "Peran Potensial (Tim)": (() => {
          const roles = ai.peran_potensial_dalam_tim || ai.peta_potensi_peran;
          return Array.isArray(roles) ? roles.map(p => `[${p.peran || p.tipe_arketipe}] ${p.alasan}`).join('\n\n') : (ai.peran || '-');
        })()
      };
    });

    // Create workbook using ExcelJS
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Rekap Analisis');

    // Add headers
    const headers = Object.keys(exportData[0]);
    worksheet.columns = headers.map((header, index) => ({
      header,
      key: header,
      width: index === 5 ? 60 : (index === 0 ? 5 : (index === 1 ? 25 : 35))
    }));

    // Add data
    worksheet.addRows(exportData);

    // Generate and download
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `Rekap_Analisis_PsychAuto_${new Date().toISOString().slice(0,10)}.xlsx`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Tabulasi Rekap Analisis</h2>
          <p className="text-slate-400 text-sm mt-1">
            Lihat ringkasan analisis AI per kandidat dalam format tabulasi.
          </p>
        </div>
        <button
          onClick={downloadExcel}
          className="bg-emerald-600/20 border border-emerald-500/30 hover:bg-emerald-600/30 text-emerald-400 font-bold py-2.5 px-5 rounded-xl text-sm transition-all flex items-center gap-2"
        >
          <span>📥</span> Download Excel
        </button>
      </div>

      {/* Search */}
      <div className="flex flex-col md:flex-row gap-3">
        <input
          type="text"
          placeholder="Cari rekap analisis..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 bg-slate-900 border border-slate-700 text-white px-4 py-3 rounded-xl text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none placeholder:text-slate-500"
        />
        <select
          value={searchField}
          onChange={e => setSearchField(e.target.value)}
          className="bg-slate-900 border border-slate-700 text-white px-4 py-3 rounded-xl text-sm focus:border-blue-500 outline-none min-w-[160px]"
        >
          <option value="semua">Cari di: Semua</option>
          <option value="nama">Nama</option>
          <option value="arketipe">Arketipe</option>
          <option value="instansi">Instansi</option>
        </select>
        <div className="text-xs text-slate-500 self-center">{sorted.length} dari {data.length} data</div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-800/80 text-slate-300 text-xs uppercase tracking-wider">
                <th className="text-left px-4 py-4 whitespace-nowrap">No</th>
                <th className="text-left px-4 py-4 whitespace-nowrap cursor-pointer hover:text-white" onClick={() => toggleSort('validitas')}>
                  Validitas <SortIcon sortBy={sortBy} sortDir={sortDir} field="validitas" />
                </th>
                <th className="text-left px-4 py-4 whitespace-nowrap cursor-pointer hover:text-white" onClick={() => toggleSort('nama')}>
                  Nama & Identitas <SortIcon sortBy={sortBy} sortDir={sortDir} field="nama" />
                </th>
                <th className="text-left px-4 py-4 whitespace-nowrap cursor-pointer hover:text-white" onClick={() => toggleSort('arketipe')}>
                  Arketipe <SortIcon sortBy={sortBy} sortDir={sortDir} field="arketipe" />
                </th>
                <th className="text-left px-4 py-4 min-w-[450px]">Deskripsi Kepribadian Terintegrasi</th>
                <th className="text-left px-4 py-4 min-w-[250px]">Kekuatan Utama</th>
                <th className="text-left px-4 py-4 min-w-[200px]">Tantangan Utama</th>
                <th className="text-left px-4 py-4 min-w-[250px]">Saran Pengembangan</th>
                <th className="text-left px-4 py-4 min-w-[200px]">Peran Potensial (Tim)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {sorted.map((sub, idx) => {
                const ai = sub.aiInsight || {};
                const ud = sub.userData || {};
                const val = calculateValidityIndex(sub.rawData, sub);
                const vScore = typeof val.overallScore === 'number' ? val.overallScore : '-';

                return (
                  <tr key={sub.id} className="hover:bg-slate-800/30 transition-colors group">
                    <td className="px-4 py-4 text-slate-500 align-top">{idx + 1}</td>
                    <td className="px-4 py-4 align-top">
                      <span className={`${getValidityColor(vScore)} font-semibold`}>
                        {vScore}
                      </span>
                    </td>
                    <td className="px-4 py-4 align-top">
                      <div className="text-white font-medium whitespace-nowrap">{ud.nama || '-'}</div>
                      <div className="text-slate-500 text-xs mt-0.5">
                        {[ud.jenis_kelamin, ud.usia ? `${ud.usia} Thn` : null].filter(Boolean).join(', ') || '-'}
                      </div>
                      {ud.jabatan && <div className="text-blue-400 font-medium text-xs mt-0.5">{ud.jabatan}</div>}
                      {ud.instansi && <div className="text-slate-600 text-xs">{ud.instansi}</div>}
                      <Link href={`/admin/reports/${sub.id}`} className="text-blue-400/70 mt-1.5 block hover:text-blue-300 text-xs hover:underline whitespace-nowrap">
                        Lihat Detail →
                      </Link>
                    </td>
                    <td className="px-4 py-4 align-top">
                      <span className="text-yellow-400 font-semibold">{ai.arketipe_personal || ai.arketipe || '-'}</span>
                    </td>
                    <td className="px-4 py-4 align-top text-slate-300 text-[13px] leading-relaxed">
                      <div className="whitespace-pre-wrap text-xs">
                        {ai.ringkasan_kepribadian || ai.deskripsi_kepribadian_terintegrasi || (
                           <span className="text-slate-600 italic">Analisis AI belum digenerate</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 align-top text-slate-400 text-xs leading-relaxed">
                       {ai.rekap_singkat?.kekuatan || (Array.isArray(ai.kekuatan_utama) ? <ul className="list-disc pl-3">{ai.kekuatan_utama.map((k,i) => <li key={i} className="mb-1">{getFirstSentence(k)}</li>)}</ul> : (getFirstSentence(ai.kekuatan) || '-'))}
                    </td>
                    <td className="px-4 py-4 align-top text-rose-400/80 text-xs leading-relaxed">
                       {ai.rekap_singkat?.tantangan || (ai.tantangan_dan_faktor_penghambat ?
                         <div className="space-y-2">
                           <div>
                             <div className="font-semibold mb-0.5 text-rose-300">Komunikasi:</div>
                             <div>{highlightRisk(getFirstSentence(ai.tantangan_dan_faktor_penghambat.komunikasi_dan_pola_kerja))}</div>
                           </div>
                           <div>
                             <div className="font-semibold mb-0.5 text-rose-300">Internal:</div>
                             <div>{highlightRisk(getFirstSentence(ai.tantangan_dan_faktor_penghambat.hambatan_karakter_internal))}</div>
                           </div>
                         </div>
                       : highlightRisk(getFirstSentence(ai.tantangan)) || '-')}
                    </td>
                    <td className="px-4 py-4 align-top text-blue-300/80 text-xs leading-relaxed">
                       {ai.rekap_singkat?.saran || (Array.isArray(ai.saran_pengembangan_spesifik) ? <ul className="list-decimal pl-3">{ai.saran_pengembangan_spesifik.map((s,i) => <li key={i} className="mb-1">{getFirstSentence(s)}</li>)}</ul> : (getFirstSentence(ai.saran) || '-'))}
                    </td>
                    <td className="px-4 py-4 align-top text-teal-400/80 text-xs leading-relaxed">
                      {ai.rekap_singkat?.peran || (Array.isArray(ai.peran_potensial_dalam_tim) ?
                        <div>
                          {ai.peran_potensial_dalam_tim.map((p,i) => (
                             <div key={i} className="mb-1.5 flex flex-col">
                               <span className="font-bold text-teal-300">{p.peran}</span> <span>{getFirstSentence(p.alasan)}</span>
                             </div>
                          ))}
                        </div>
                      : Array.isArray(ai.peta_potensi_peran) ?
                        <div>
                          {ai.peta_potensi_peran.map((p,i) => (
                             <div key={i} className="mb-1.5 flex flex-col">
                               <span className="font-bold text-teal-300">[{p.tipe_arketipe}]</span> <span>{getFirstSentence(p.alasan)}</span>
                             </div>
                          ))}
                        </div>
                      : (getFirstSentence(ai.peran) || '-'))}
                    </td>
                  </tr>
                );
              })}
              {sorted.length === 0 && (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center text-slate-500">
                    Belum ada data rekap.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
