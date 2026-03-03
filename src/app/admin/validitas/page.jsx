'use client';
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import * as XLSX from 'xlsx';
import { calculateValidityIndex } from '@/utils/validityCheck';
import { logger } from '@/utils/logger';

function SortIcon({ sortBy, sortDir, field }) {
  if (sortBy !== field) return <span className="text-slate-600 ml-1">↕</span>;
  return <span className="text-blue-400 ml-1">{sortDir === 'asc' ? '↑' : '↓'}</span>;
}

const getScoreColor = (score) => {
  if (score < 0 || score === '-') return 'text-slate-500';
  if (score >= 85) return 'text-emerald-400';
  if (score >= 70) return 'text-yellow-400';
  if (score >= 50) return 'text-orange-400';
  return 'text-red-400';
};

const getScoreBg = (score) => {
  if (score < 0 || score === '-') return 'bg-slate-500/10';
  if (score >= 85) return 'bg-emerald-500/10';
  if (score >= 70) return 'bg-yellow-500/10';
  if (score >= 50) return 'bg-orange-500/10';
  return 'bg-red-500/10';
};

const getScoreLabel = (score) => {
  if (score < 0 || score === '-') return 'N/A';
  if (score >= 85) return 'Valid';
  if (score >= 70) return 'Cukup';
  if (score >= 50) return 'Ragu';
  return 'Tidak Valid';
};

export default function ValiditasPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('semua');
  const [sortBy, setSortBy] = useState('submittedAt');
  const [sortDir, setSortDir] = useState('desc');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [editId, setEditId] = useState(null);
  const [editFormData, setEditFormData] = useState({ nama: '', email: '' });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const res = await fetch('/api/admin/submissions?sortBy=submittedAt&sortDir=desc');
      const json = await res.json();
      setData(json.data || []);
    } catch (e) {
      logger.error(e);
    }
    setLoading(false);
  }

  function toggleSort(field) {
    if (sortBy === field) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDir('asc');
    }
  }

  // CRUD: Delete
  async function handleDelete(id) {
    try {
      const res = await fetch(`/api/admin/submissions/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setData(prev => prev.filter(d => d.id !== id));
        setDeleteConfirm(null);
      }
    } catch (e) {
      logger.error(e);
    }
  }

  // CRUD: Edit
  function startEdit(sub) {
    setEditId(sub.id);
    setEditFormData({ nama: sub.userData?.nama || '', email: sub.userData?.email || '' });
  }

  async function saveEdit(id) {
    try {
      const res = await fetch(`/api/admin/submissions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editFormData),
      });
      if (res.ok) {
        setData(prev => prev.map(d =>
          d.id === id ? { ...d, userData: { ...d.userData, ...editFormData } } : d
        ));
        setEditId(null);
      }
    } catch (e) {
      logger.error(e);
    }
  }

  // Compute validity for all entries
  const enriched = useMemo(() => {
    return data.map(sub => {
      const val = calculateValidityIndex(sub.rawData, sub);
      return { ...sub, _validity: val };
    });
  }, [data]);

  // Filter + sort
  const sorted = useMemo(() => {
    let list = [...enriched];

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(s => {
        const ud = s.userData || {};
        return (ud.nama || '').toLowerCase().includes(q) || (ud.email || '').toLowerCase().includes(q);
      });
    }

    // Filter by validity status
    if (filterStatus !== 'semua') {
      list = list.filter(s => {
        const score = s._validity.overallScore;
        if (score === '-') return filterStatus === 'na';
        if (filterStatus === 'valid') return score >= 85;
        if (filterStatus === 'cukup') return score >= 70 && score < 85;
        if (filterStatus === 'ragu') return score >= 50 && score < 70;
        if (filterStatus === 'invalid') return score < 50;
        return true;
      });
    }

    // Sort
    list.sort((a, b) => {
      let va, vb;
      switch (sortBy) {
        case 'nama':
          va = (a.userData?.nama || '').toLowerCase();
          vb = (b.userData?.nama || '').toLowerCase();
          break;
        case 'overall':
          va = typeof a._validity.overallScore === 'number' ? a._validity.overallScore : -1;
          vb = typeof b._validity.overallScore === 'number' ? b._validity.overallScore : -1;
          break;
        case 'durasi':
          va = a._validity.indicators.duration.score;
          vb = b._validity.indicators.duration.score;
          break;
        case 'straightLining':
          va = a._validity.indicators.straightLining.score;
          vb = b._validity.indicators.straightLining.score;
          break;
        case 'extreme':
          va = a._validity.indicators.extreme.score;
          vb = b._validity.indicators.extreme.score;
          break;
        case 'inconsistency':
          va = a._validity.indicators.inconsistency.score;
          vb = b._validity.indicators.inconsistency.score;
          break;
        case 'discUndiff':
          va = a._validity.indicators.discUndifferentiated.score;
          vb = b._validity.indicators.discUndifferentiated.score;
          break;
        case 'discShift':
          va = a._validity.indicators.discOverShift.score;
          vb = b._validity.indicators.discOverShift.score;
          break;
        case 'submittedAt':
        default:
          va = a.submittedAt || '';
          vb = b.submittedAt || '';
          break;
      }
      if (va < vb) return sortDir === 'asc' ? -1 : 1;
      if (va > vb) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

    return list;
  }, [enriched, search, filterStatus, sortBy, sortDir]);

  // Stats
  const stats = useMemo(() => {
    const total = enriched.length;
    let valid = 0, cukup = 0, ragu = 0, invalid = 0, na = 0;
    enriched.forEach(s => {
      const sc = s._validity.overallScore;
      if (sc === '-') na++;
      else if (sc >= 85) valid++;
      else if (sc >= 70) cukup++;
      else if (sc >= 50) ragu++;
      else invalid++;
    });
    return { total, valid, cukup, ragu, invalid, na };
  }, [enriched]);

  // Excel export
  const downloadExcel = () => {
    if (sorted.length === 0) return;
    const rows = sorted.map((sub, i) => {
      const v = sub._validity;
      const ind = v.indicators;
      return {
        "No": i + 1,
        "Nama": sub.userData?.nama || '-',
        "Email/NIK": sub.userData?.email || '-',
        "Tanggal Submit": sub.submittedAt ? new Date(sub.submittedAt).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }) : '-',
        "Skor Total": v.overallScore,
        "Label": v.overallLabel,
        "HEXACO": typeof v.hexaco?.score === 'number' ? v.hexaco.score : '-',
        "DISC": typeof v.disc?.score === 'number' ? v.disc.score : '-',
        "Durasi": `${ind.duration.score >= 0 ? ind.duration.score : '-'} (${ind.duration.label})`,
        "Straight-Lining": `${ind.straightLining.score >= 0 ? ind.straightLining.score : '-'} (${ind.straightLining.label})`,
        "Extreme Responding": `${ind.extreme.score >= 0 ? ind.extreme.score : '-'} (${ind.extreme.label})`,
        "Inkonsistensi": `${ind.inconsistency.score >= 0 ? ind.inconsistency.score : '-'} (${ind.inconsistency.label})`,
        "DISC Undifferentiated": `${ind.discUndifferentiated.score >= 0 ? ind.discUndifferentiated.score : '-'} (${ind.discUndifferentiated.label})`,
        "DISC Over-Shift": `${ind.discOverShift.score >= 0 ? ind.discOverShift.score : '-'} (${ind.discOverShift.label})`,
      };
    });
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Validitas");
    ws['!cols'] = Object.keys(rows[0]).map(() => ({ wch: 22 }));
    XLSX.writeFile(wb, `Validitas_Isian_${new Date().toISOString().slice(0,10)}.xlsx`);
  };

  const ScoreCell = ({ score, label, detail }) => (
    <td className="px-3 py-3 align-top text-center" title={detail || ''}>
      <div className={`inline-flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg ${getScoreBg(score)}`}>
        <span className={`font-mono font-bold text-sm ${getScoreColor(score)}`}>
          {score >= 0 ? score : '-'}
        </span>
        <span className={`text-[10px] ${getScoreColor(score)} opacity-70`}>{label}</span>
      </div>
    </td>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Validitas Isian</h2>
          <p className="text-slate-400 text-sm mt-1">
            Analisis keandalan respons klien berdasarkan 6 indikator psikometrik.
          </p>
        </div>
        <button onClick={downloadExcel} className="bg-emerald-600/20 border border-emerald-500/30 hover:bg-emerald-600/30 text-emerald-400 font-bold py-2.5 px-5 rounded-xl text-sm transition-all flex items-center gap-2">
          <span>📥</span> Download Excel
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        {[
          { label: 'Total', value: stats.total, color: 'text-white', bg: 'bg-slate-800' },
          { label: 'Valid', value: stats.valid, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'Cukup', value: stats.cukup, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
          { label: 'Meragukan', value: stats.ragu, color: 'text-orange-400', bg: 'bg-orange-500/10' },
          { label: 'Tidak Valid', value: stats.invalid, color: 'text-red-400', bg: 'bg-red-500/10' },
          { label: 'Belum Ada', value: stats.na, color: 'text-slate-400', bg: 'bg-slate-700/50' },
        ].map(s => (
          <div key={s.label} className={`${s.bg} border border-slate-700/50 rounded-xl p-3 text-center`}>
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-slate-500 text-xs mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-3">
        <input
          type="text" placeholder="Cari nama atau email..."
          value={search} onChange={e => setSearch(e.target.value)}
          className="flex-1 bg-slate-900 border border-slate-700 text-white px-4 py-3 rounded-xl text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none placeholder:text-slate-500"
        />
        <select
          value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          className="bg-slate-900 border border-slate-700 text-white px-4 py-3 rounded-xl text-sm focus:border-blue-500 outline-none min-w-[180px]"
        >
          <option value="semua">Semua Status</option>
          <option value="valid">✅ Valid (≥85)</option>
          <option value="cukup">⚠️ Cukup Valid (70-84)</option>
          <option value="ragu">🟠 Meragukan (50-69)</option>
          <option value="invalid">❌ Tidak Valid (&lt;50)</option>
          <option value="na">⬜ Belum Ada Data</option>
        </select>
        <div className="text-xs text-slate-500 self-center whitespace-nowrap">{sorted.length} dari {data.length} data</div>
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-800/80 text-slate-300 text-[11px] uppercase tracking-wider">
                <th className="text-left px-3 py-3">No</th>
                <th className="text-left px-3 py-3 cursor-pointer hover:text-white whitespace-nowrap" onClick={() => toggleSort('nama')}>
                  Nama <SortIcon sortBy={sortBy} sortDir={sortDir} field="nama" />
                </th>
                <th className="text-left px-3 py-3 cursor-pointer hover:text-white whitespace-nowrap" onClick={() => toggleSort('submittedAt')}>
                  Tanggal Submit <SortIcon sortBy={sortBy} sortDir={sortDir} field="submittedAt" />
                </th>
                <th className="text-center px-3 py-3 cursor-pointer hover:text-white whitespace-nowrap" onClick={() => toggleSort('overall')}>
                  Total <SortIcon sortBy={sortBy} sortDir={sortDir} field="overall" />
                </th>
                <th className="text-center px-3 py-3 cursor-pointer hover:text-white whitespace-nowrap" onClick={() => toggleSort('durasi')}>
                  Durasi <SortIcon sortBy={sortBy} sortDir={sortDir} field="durasi" />
                </th>
                <th className="text-center px-3 py-3 cursor-pointer hover:text-white whitespace-nowrap" onClick={() => toggleSort('straightLining')}>
                  Straight-Lining <SortIcon sortBy={sortBy} sortDir={sortDir} field="straightLining" />
                </th>
                <th className="text-center px-3 py-3 cursor-pointer hover:text-white whitespace-nowrap" onClick={() => toggleSort('extreme')}>
                  Extreme <SortIcon sortBy={sortBy} sortDir={sortDir} field="extreme" />
                </th>
                <th className="text-center px-3 py-3 cursor-pointer hover:text-white whitespace-nowrap" onClick={() => toggleSort('inconsistency')}>
                  Inkonsistensi <SortIcon sortBy={sortBy} sortDir={sortDir} field="inconsistency" />
                </th>
                <th className="text-center px-3 py-3 cursor-pointer hover:text-white whitespace-nowrap" onClick={() => toggleSort('discUndiff')}>
                  DISC Flat <SortIcon sortBy={sortBy} sortDir={sortDir} field="discUndiff" />
                </th>
                <th className="text-center px-3 py-3 cursor-pointer hover:text-white whitespace-nowrap" onClick={() => toggleSort('discShift')}>
                  Over-Shift <SortIcon sortBy={sortBy} sortDir={sortDir} field="discShift" />
                </th>
                <th className="text-center px-3 py-3">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {sorted.map((sub, idx) => {
                const ud = sub.userData || {};
                const v = sub._validity;
                const ind = v.indicators;

                return (
                  <tr key={sub.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-3 py-3 text-slate-500 align-top">{idx + 1}</td>
                    <td className="px-3 py-3 align-top min-w-[180px]">
                      {editId === sub.id ? (
                        <div className="space-y-1">
                          <input type="text" className="w-full bg-slate-800 border border-slate-600 text-white rounded px-2 py-1 text-xs" value={editFormData.nama} onChange={e => setEditFormData({...editFormData, nama: e.target.value})} placeholder="Nama" />
                          <input type="text" className="w-full bg-slate-800 border border-slate-600 text-white rounded px-2 py-1 text-xs" value={editFormData.email} onChange={e => setEditFormData({...editFormData, email: e.target.value})} placeholder="Email/NIK" />
                        </div>
                      ) : (
                        <>
                          <div className="text-white font-medium text-sm">{ud.nama || '-'}</div>
                          <div className="text-slate-500 text-xs">{ud.email || '-'}</div>
                          {ud.jabatan && <div className="text-blue-400/70 text-[11px] mt-0.5">{ud.jabatan}</div>}
                        </>
                      )}
                    </td>
                    <td className="px-3 py-3 align-top whitespace-nowrap">
                      <div className="text-slate-300 text-xs">
                        {sub.submittedAt ? new Date(sub.submittedAt).toLocaleDateString('id-ID', { timeZone: 'Asia/Jakarta', day: '2-digit', month: 'short', year: 'numeric' }) : '-'}
                      </div>
                      <div className="text-slate-500 text-[11px]">
                        {sub.submittedAt ? new Date(sub.submittedAt).toLocaleTimeString('id-ID', { timeZone: 'Asia/Jakarta', hour: '2-digit', minute: '2-digit' }) + ' WIB' : ''}
                      </div>
                    </td>
                    {/* Overall */}
                    <ScoreCell score={v.overallScore === '-' ? -1 : v.overallScore} label={v.overallLabel} detail={`HEXACO: ${v.hexaco?.score ?? '-'} | DISC: ${v.disc?.score ?? '-'}`} />
                    {/* 6 Indicators */}
                    <ScoreCell score={ind.duration.score} label={ind.duration.label} detail={ind.duration.detail} />
                    <ScoreCell score={ind.straightLining.score} label={ind.straightLining.label} detail={ind.straightLining.detail} />
                    <ScoreCell score={ind.extreme.score} label={ind.extreme.label} detail={ind.extreme.detail} />
                    <ScoreCell score={ind.inconsistency.score} label={ind.inconsistency.label} detail={ind.inconsistency.detail} />
                    <ScoreCell score={ind.discUndifferentiated.score} label={ind.discUndifferentiated.label} detail={ind.discUndifferentiated.detail} />
                    <ScoreCell score={ind.discOverShift.score} label={ind.discOverShift.label} detail={ind.discOverShift.detail} />
                    {/* Actions */}
                    <td className="px-3 py-3 align-top text-center">
                      <div className="flex flex-col gap-1.5 items-center">
                        {editId === sub.id ? (
                          <>
                            <button onClick={() => saveEdit(sub.id)} className="text-emerald-400 hover:text-emerald-300 text-xs font-medium">Simpan</button>
                            <button onClick={() => setEditId(null)} className="text-slate-400 hover:text-slate-300 text-xs">Batal</button>
                          </>
                        ) : (
                          <>
                            <Link href={`/admin/reports/${sub.id}`} className="text-blue-400 hover:text-blue-300 text-xs font-medium">Detail</Link>
                            <button onClick={() => startEdit(sub)} className="text-amber-400 hover:text-amber-300 text-xs">Edit</button>
                            {deleteConfirm === sub.id ? (
                              <div className="flex gap-1">
                                <button onClick={() => handleDelete(sub.id)} className="text-red-400 hover:text-red-300 text-[10px] font-bold">Ya</button>
                                <button onClick={() => setDeleteConfirm(null)} className="text-slate-400 text-[10px]">Tidak</button>
                              </div>
                            ) : (
                              <button onClick={() => setDeleteConfirm(sub.id)} className="text-red-400/60 hover:text-red-400 text-xs">Hapus</button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {sorted.length === 0 && (
                <tr>
                  <td colSpan="11" className="px-6 py-12 text-center text-slate-500">
                    Belum ada data atau tidak ada yang cocok dengan filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
        <h4 className="text-slate-300 font-medium text-sm mb-2">Keterangan Indikator</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs text-slate-400">
          <div><span className="text-white font-medium">Durasi</span> — Apakah waktu pengerjaan wajar (min. 8 menit)</div>
          <div><span className="text-white font-medium">Straight-Lining</span> — Apakah jawaban seragam/monoton</div>
          <div><span className="text-white font-medium">Extreme</span> — Apakah hanya menjawab 1 dan 5</div>
          <div><span className="text-white font-medium">Inkonsistensi</span> — Apakah jawaban reverse-pair bertentangan</div>
          <div><span className="text-white font-medium">DISC Flat</span> — Apakah pola DISC terlalu datar</div>
          <div><span className="text-white font-medium">Over-Shift</span> — Apakah pola publik vs pribadi terlalu berbeda</div>
        </div>
        <div className="flex gap-4 mt-3 text-xs">
          <span className="text-emerald-400">● ≥85 Valid</span>
          <span className="text-yellow-400">● 70-84 Cukup</span>
          <span className="text-orange-400">● 50-69 Meragukan</span>
          <span className="text-red-400">● &lt;50 Tidak Valid</span>
        </div>
      </div>
    </div>
  );
}
