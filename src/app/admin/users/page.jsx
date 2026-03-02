'use client';
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { calculateValidityIndex } from '@/utils/validityCheck';
import { logger } from '@/utils/logger';

function SortIcon({ sortBy, sortDir, field }) {
  if (sortBy !== field) return <span className="text-slate-600 ml-1">↕</span>;
  return <span className="text-blue-400 ml-1">{sortDir === 'asc' ? '↑' : '↓'}</span>;
}

export default function UsersPage() {
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [sortBy, setSortBy] = useState('nama');
  const [sortDir, setSortDir] = useState('asc');
  const [refreshKey, setRefreshKey] = useState(0);
  const [search, setSearch] = useState('');
  const [searchField, setSearchField] = useState('semua');
  const [editId, setEditId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    nama: '', usia: '', instansi: '', pekerjaan: '', jabatan: ''
  });
  const [bulkGenState, setBulkGenState] = useState({ active: false, current: 0, total: 0 });
  const [regenAiId, setRegenAiId] = useState(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await fetch('/api/admin/submissions');
        const data = await res.json();
        if (data.success) {
          setSubs(data.data || []);
        }
      } catch (e) {
        logger.error('Fetch error:', e);
      }
      setLoading(false);
    }
    fetchData();
  }, [refreshKey]);

  const triggerRefresh = () => setRefreshKey(k => k + 1);

  async function handleSync() {
    if (!confirm('Fitur Sinkronisasi akan menarik data yang hilang/gagal masuk saat re-deploy. Lanjutkan?')) return;
    setSyncing(true);
    try {
      await fetch('/api/admin/submissions?sync=true', { method: 'POST' });
      triggerRefresh();
      alert('Sinkronisasi selesai!');
    } catch (e) {
      alert('Sinkronisasi gagal: ' + e.message);
    }
    setSyncing(false);
  }

  function toggleSort(field) {
    if (sortBy === field) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDir('asc');
    }
  }

  async function handleBulkGenerate(mode = 'missing') {
    let targets = [];
    if (mode === 'missing') {
      targets = sorted.filter(s => !s.aiInsight);
      if (targets.length === 0) {
        alert('Semua rekaman pada daftar ini sudah memiliki Hasil Interpretasi AI.');
        return;
      }
      if (!confirm(`Terdapat ${targets.length} klien tanpa AI Insight. Mulai generate massal secara otomatis? Proses ini memakan waktu (±10 detik per klien).`)) return;
    } else {
      targets = sorted;
      if (targets.length === 0) {
        alert('Tidak ada data klien untuk diproses.');
        return;
      }
      if (!confirm(`PERINGATAN! Anda akan MENGHASILKAN ULANG (Regenerate) AI Insight untuk SEMUA ${targets.length} klien di daftar ini. Proses ini akan menimpa data lama dan memakan waktu sangat lama (±10-15 detik per klien). Lanjutkan?`)) return;
    }
    
    setBulkGenState({ active: true, current: 0, total: targets.length });
    let successCount = 0;
    
    for (let i = 0; i < targets.length; i++) {
      try {
        const bodyMsg = mode === 'all' ? JSON.stringify({ force: true }) : undefined;
        const res = await fetch(`/api/admin/submissions/${targets[i].id}/ai`, { 
          method: 'POST',
          headers: bodyMsg ? { 'Content-Type': 'application/json' } : undefined,
          body: bodyMsg 
        });
        const json = await res.json();
        if (json.success) successCount++;
      } catch (e) {
        logger.error('Failed to generate for', targets[i].id, e);
      }
      setBulkGenState(prev => ({ ...prev, current: i + 1 }));
    }
    
    setTimeout(() => {
      setBulkGenState({ active: false, current: 0, total: 0 });
      triggerRefresh();
      alert(`Proses generate massal selesai! Berhasil: ${successCount} dari ${targets.length}`);
    }, 1000);
  }

  const sorted = useMemo(() => {
    let list = [...subs];

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(s => {
        const ud = s.userData || {};
        if (searchField === 'nama') return (ud.nama || '').toLowerCase().includes(q);
        if (searchField === 'email') return (ud.email || '').toLowerCase().includes(q);
        if (searchField === 'instansi') return (ud.instansi || '').toLowerCase().includes(q);
        if (searchField === 'jabatan') return (ud.jabatan || '').toLowerCase().includes(q);
        if (searchField === 'pekerjaan') return (ud.pekerjaan || '').toLowerCase().includes(q);
        // semua
        return (ud.nama || '').toLowerCase().includes(q)
          || (ud.email || '').toLowerCase().includes(q)
          || (ud.instansi || '').toLowerCase().includes(q)
          || (ud.pekerjaan || '').toLowerCase().includes(q)
          || (ud.jabatan || '').toLowerCase().includes(q);
      });
    }

    // Sort
    list.sort((a, b) => {
      let va, vb;
      switch (sortBy) {
        case 'nama': va = a.userData?.nama || ''; vb = b.userData?.nama || ''; break;
        case 'email': va = a.userData?.email || ''; vb = b.userData?.email || ''; break;
        case 'submit': va = a.submittedAt || ''; vb = b.submittedAt || ''; break;
        case 'usia': va = a.userData?.usia || 0; vb = b.userData?.usia || 0; break;
        case 'instansi': va = a.userData?.instansi || ''; vb = b.userData?.instansi || ''; break;
        case 'pekerjaan': va = a.userData?.pekerjaan || ''; vb = b.userData?.pekerjaan || ''; break;
        case 'jabatan': va = a.userData?.jabatan || ''; vb = b.userData?.jabatan || ''; break;
        case 'validity':
          va = calculateValidityIndex(a.rawData, a).overallScore || 0;
          vb = calculateValidityIndex(b.rawData, b).overallScore || 0;
          break;
        default: return 0;
      }
      if (typeof va === 'string') { va = va.toLowerCase(); vb = vb.toLowerCase(); }
      if (va < vb) return sortDir === 'asc' ? -1 : 1;
      if (va > vb) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return list;
  }, [subs, search, searchField, sortBy, sortDir]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Daftar Klien & Identitas</h2>
          <p className="text-slate-400 text-sm mt-1">Laporan demografis lengkap seluruh pengguna beserta indeks validitas</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {/* Dropdown for AI Generation */}
          <div className="relative group inline-block">
            <button
              disabled={bulkGenState.active}
              className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-xl text-sm transition-all disabled:opacity-50 flex items-center gap-2 shadow-lg"
            >
              {bulkGenState.active ? 'Sedang Memproses...' : '✨ Hasilkan AI Massal ▾'}
            </button>
            {!bulkGenState.active && (
              <div className="absolute right-0 mt-2 w-56 bg-slate-800 border border-slate-700 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 focus-within:opacity-100 focus-within:visible">
                <button
                  onClick={() => handleBulkGenerate('missing')}
                  className="w-full text-left px-4 py-3 text-sm text-slate-300 hover:bg-slate-700 hover:text-white rounded-t-xl transition-colors border-b border-slate-700"
                >
                  <span className="block font-medium">✨ Generate yang Kosong</span>
                  <span className="block text-xs text-slate-500 mt-0.5">Hanya klien tanpa interpretasi</span>
                </button>
                <button
                  onClick={() => handleBulkGenerate('all')}
                  className="w-full text-left px-4 py-3 text-sm text-rose-300 hover:bg-rose-900/40 hover:text-rose-200 transition-colors rounded-b-xl"
                >
                  <span className="block font-medium">🔄 Regenerate Semua</span>
                  <span className="block text-xs text-rose-400/60 mt-0.5">Timpa paksa seluruh daftar</span>
                </button>
              </div>
            )}
          </div>

          <button
            onClick={handleSync}
            disabled={syncing || bulkGenState.active}
            className="bg-slate-800 hover:bg-slate-700 text-white font-medium py-2 px-4 rounded-xl text-sm transition-all border border-slate-700 disabled:opacity-50 flex items-center gap-2"
          >
            {syncing ? (
              <><div className="w-4 h-4 border-2 border-slate-400 border-t-white rounded-full animate-spin"></div> Menyinkronkan...</>
            ) : (
              <>🔄 Sinkronisasi Data</>
            )}
          </button>
        </div>
      </div>

      {/* Bulk Generate Progress Bar */}
      {bulkGenState.active && (
        <div className="bg-blue-900/30 border border-blue-500/30 p-4 rounded-xl flex items-center gap-4">
          <div className="w-8 h-8 rounded-full border-2 border-blue-400 border-t-transparent animate-spin shrink-0"></div>
          <div className="flex-1">
            <div className="flex justify-between text-xs text-blue-300 font-medium mb-1.5">
              <span>Memproses Interpretasi Otomatis (AI) untuk Klien...</span>
              <span>{Math.round((bulkGenState.current / bulkGenState.total) * 100)}% ({bulkGenState.current}/{bulkGenState.total})</span>
            </div>
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 rounded-full transition-all duration-300 relative"
                style={{ width: `${(bulkGenState.current / bulkGenState.total) * 100}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="flex flex-col md:flex-row gap-3">
        <input
          type="text"
          placeholder="Cari data klien..."
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
          <option value="email">Email/NIK</option>
          <option value="instansi">Instansi</option>
          <option value="pekerjaan">Pekerjaan</option>
          <option value="jabatan">Jabatan</option>
        </select>
        <div className="text-xs text-slate-500 self-center">{sorted.length} dari {subs.length} data</div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="text-xs uppercase bg-slate-800/50 text-slate-400 border-b border-slate-700/50">
              <tr>
                <th className="px-5 py-4 font-semibold tracking-wider cursor-pointer hover:text-white" onClick={() => toggleSort('nama')}>
                  Nama <SortIcon sortBy={sortBy} sortDir={sortDir} field="nama" />
                </th>
                <th className="px-5 py-4 font-semibold tracking-wider cursor-pointer hover:text-white" onClick={() => toggleSort('email')}>
                  Email / NIK <SortIcon sortBy={sortBy} sortDir={sortDir} field="email" />
                </th>
                <th className="px-5 py-4 font-semibold tracking-wider cursor-pointer hover:text-white" onClick={() => toggleSort('submit')}>
                  Tgl Submit <SortIcon sortBy={sortBy} sortDir={sortDir} field="submit" />
                </th>
                <th className="px-5 py-4 font-semibold tracking-wider cursor-pointer hover:text-white" onClick={() => toggleSort('usia')}>
                  Usia <SortIcon sortBy={sortBy} sortDir={sortDir} field="usia" />
                </th>
                <th className="px-5 py-4 font-semibold tracking-wider cursor-pointer hover:text-white" onClick={() => toggleSort('instansi')}>
                  Instansi <SortIcon sortBy={sortBy} sortDir={sortDir} field="instansi" />
                </th>
                <th className="px-5 py-4 font-semibold tracking-wider cursor-pointer hover:text-white" onClick={() => toggleSort('pekerjaan')}>
                  Pekerjaan <SortIcon sortBy={sortBy} sortDir={sortDir} field="pekerjaan" />
                </th>
                <th className="px-5 py-4 font-semibold tracking-wider cursor-pointer hover:text-white" onClick={() => toggleSort('jabatan')}>
                  Jabatan <SortIcon sortBy={sortBy} sortDir={sortDir} field="jabatan" />
                </th>
                <th className="px-5 py-4 font-semibold tracking-wider cursor-pointer hover:text-white" onClick={() => toggleSort('validity')}>
                  Validitas <SortIcon sortBy={sortBy} sortDir={sortDir} field="validity" />
                </th>
                <th className="px-5 py-4 font-semibold tracking-wider text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {loading ? (
                <tr>
                  <td colSpan="9" className="px-6 py-12 text-center text-slate-500">Memuat data...</td>
                </tr>
              ) : sorted.length === 0 ? (
                <tr>
                  <td colSpan="9" className="px-6 py-12 text-center text-slate-500">Belum ada data klien.</td>
                </tr>
              ) : (
                sorted.map((s) => {
                  const validity = calculateValidityIndex(s.rawData, s);
                  return (
                    <tr key={s.id} className="hover:bg-slate-800/20 transition-colors">
                      <td className="px-5 py-4 max-w-[150px]">
                        {editId === s.id ? (
                           <input type="text" className="w-full bg-slate-800 border-none text-white rounded px-2 py-1 text-sm mb-1" value={editFormData.nama} onChange={e => setEditFormData({...editFormData, nama: e.target.value})} placeholder="Nama" />
                        ) : (
                           <div className="font-semibold text-white truncate" title={s.userData?.nama}>{s.userData?.nama}</div>
                        )}
                      </td>
                      <td className="px-5 py-4 text-slate-400 text-xs truncate max-w-[130px]" title={s.userData?.email || '-'}>
                        {s.userData?.email || '-'}
                      </td>
                      <td className="px-5 py-4 text-slate-400 text-xs truncate max-w-[100px]">
                        {s.submittedAt ? new Date(s.submittedAt).toLocaleDateString('id-ID', {day: '2-digit', month: 'short', year: 'numeric'}) : '-'}
                      </td>
                      <td className="px-5 py-4 text-slate-400">
                        {editId === s.id ? (<input type="number" className="w-16 bg-slate-800 border-none text-white rounded px-2 py-1 text-sm inline-block" value={editFormData.usia} onChange={e => setEditFormData({...editFormData, usia: e.target.value})} placeholder="Usia" />) : (s.userData?.usia ? `${s.userData.usia} thn` : '-')}
                      </td>
                      <td className="px-5 py-4">
                       {editId === s.id ? (<input type="text" className="w-full bg-slate-800 border-none text-white rounded px-2 py-1 text-sm" value={editFormData.instansi} onChange={e => setEditFormData({...editFormData, instansi: e.target.value})} placeholder="Instansi" />) : (
                        <span className="bg-purple-500/10 text-purple-400 font-medium px-2.5 py-1 rounded-md text-xs inline-block max-w-[100px] truncate" title={s.userData?.instansi || '-'}>
                          {s.userData?.instansi || '-'}
                        </span>
                       )}
                      </td>
                      <td className="px-5 py-4 text-slate-400 truncate max-w-[100px]" title={s.userData?.pekerjaan || '-'}>
                        {editId === s.id ? (<input type="text" className="w-full bg-slate-800 border-none text-white rounded px-2 py-1 text-sm inline-block" value={editFormData.pekerjaan} onChange={e => setEditFormData({...editFormData, pekerjaan: e.target.value})} placeholder="Pekerjaan" />) : (s.userData?.pekerjaan || '-')}
                      </td>
                      <td className="px-5 py-4 text-slate-400 truncate max-w-[100px]" title={s.userData?.jabatan || '-'}>
                        {editId === s.id ? (<input type="text" className="w-full bg-slate-800 border-none text-white rounded px-2 py-1 text-sm inline-block" value={editFormData.jabatan} onChange={e => setEditFormData({...editFormData, jabatan: e.target.value})} placeholder="Jabatan" />) : (s.userData?.jabatan || '-')}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold" style={{ color: validity.overallColor }} title={validity.overallLabel}>
                            {validity.overallScore} - {validity.overallLabel}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-right flex gap-2 justify-end">
                        {editId === s.id ? (
                          <>
                            <button
                              onClick={async () => {
                                try {
                                  await fetch(`/api/admin/submissions/${s.id}`, {
                                    method: 'PUT',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ mode: 'user_data', ...editFormData })
                                  });
                                  setEditId(null);
                                  triggerRefresh();
                                } catch (_e) { alert('Gagal Simpan'); }
                              }}
                              className="text-emerald-400 font-medium px-2 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-lg text-lg"
                              title="Simpan Perubahan"
                            >
                              💾
                            </button>
                            <button onClick={() => setEditId(null)} className="text-slate-400 font-medium px-2 py-1.5 bg-slate-500/10 hover:bg-slate-500/20 rounded-lg text-lg" title="Batal Edit">
                              ✖️
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => {
                                setEditId(s.id);
                                setEditFormData({
                                  nama: s.userData?.nama || '',
                                  usia: s.userData?.usia || '',
                                  instansi: s.userData?.instansi || '',
                                  pekerjaan: s.userData?.pekerjaan || '',
                                  jabatan: s.userData?.jabatan || ''
                                });
                              }}
                              className="text-amber-400 hover:text-amber-300 text-lg font-medium px-2 py-1 bg-amber-500/10 hover:bg-amber-500/20 rounded-lg transition-all"
                              title="Edit Data Klien"
                            >
                              ✏️
                            </button>
                            <Link
                              href={`/admin/reports/${s.id}`}
                              className="text-blue-400 hover:text-blue-300 hover:underline text-lg font-medium px-2 py-1 bg-blue-500/10 hover:bg-blue-500/20 rounded-lg inline-block transition-all"
                              title="Lihat Detail Laporan"
                            >
                              📄
                            </Link>

                            <button
                              onClick={async () => {
                                setRegenAiId(s.id);
                                try {
                                  const r = await fetch(`/api/admin/submissions/${s.id}/ai`, { 
                                      method: 'POST', 
                                      headers: { 'Content-Type': 'application/json' },
                                      body: JSON.stringify({ force: true })
                                  });
                                  const j = await r.json();
                                  if (j.success) {
                                      triggerRefresh();
                                  } else {
                                      alert('Gagal menghasilkan AI: ' + j.error);
                                  }
                                } catch (_e) { alert('Kesalahan jaringan'); }
                                setRegenAiId(null);
                              }}
                              disabled={regenAiId === s.id}
                              className="disabled:opacity-50 text-xl px-2 py-1 bg-purple-500/10 hover:bg-purple-500/20 rounded-lg inline-block transition-all flex items-center justify-center"
                              title={s.aiInsight ? "Regenerate AI Ulang" : "Generate AI Baru"}
                            >
                              {regenAiId === s.id ? '⏳' : (s.aiInsight ? '🔄' : '✨')}
                            </button>

                            <button
                              onClick={async () => {
                                if (!confirm(`Hapus data ${s.userData?.nama}?`)) return;
                                try {
                                  const res = await fetch(`/api/admin/submissions/${s.id}`, { method: 'DELETE' });
                                  if (res.ok) triggerRefresh();
                                } catch (_e) { alert('Hapus Gagal'); }
                              }}
                              className="text-red-400 hover:text-red-300 text-lg font-medium px-2 py-1 bg-red-500/10 hover:bg-red-500/20 rounded-lg inline-block transition-all"
                              title="Hapus Klien Secara Permanen"
                            >
                              🗑️
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
