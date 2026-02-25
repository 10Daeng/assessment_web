'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { calculateValidityIndex } from '@/utils/validityCheck';

export default function UsersPage() {
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [sortBy, setSortBy] = useState('nama');
  const [sortDir, setSortDir] = useState('asc');

  useEffect(() => {
    fetchData();
  }, [sortBy, sortDir]);

  async function fetchData() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/submissions?sortBy=${sortBy}&sortDir=${sortDir}`);
      const data = await res.json();
      if (data.success) {
        setSubs(data.data || []);
      }
    } catch (e) {
      console.error('Fetch error', e);
    }
    setLoading(false);
  }

  async function handleSync() {
    if (!confirm('Fitur Sinkronisasi akan menarik data yang hilang/gagal masuk saat re-deploy. Lanjutkan?')) return;
    setSyncing(true);
    try {
      // Dummy sync logic or triggering a robust pull if you have external syncing configured.
      // Often, a re-fetch handles this if the DB hasn't lost the data, but if you need a specific script:
      await fetch('/api/admin/submissions?sync=true', { method: 'POST' }); 
      await fetchData();
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

  function SortIcon({ field }) {
    if (sortBy !== field) return <span className="text-slate-600 ml-1">↕</span>;
    return <span className="text-blue-400 ml-1">{sortDir === 'asc' ? '↑' : '↓'}</span>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Daftar Klien & Identitas</h2>
          <p className="text-slate-400 text-sm mt-1">Laporan demografis lengkap seluruh pengguna beserta indeks validitas</p>
        </div>
        <button 
          onClick={handleSync}
          disabled={syncing}
          className="bg-slate-800 hover:bg-slate-700 text-white font-medium py-2 px-4 rounded-xl text-sm transition-all border border-slate-700 disabled:opacity-50 flex items-center gap-2"
        >
          {syncing ? (
            <><div className="w-4 h-4 border-2 border-slate-400 border-t-white rounded-full animate-spin"></div> Menyinkronkan...</>
          ) : (
            <>🔄 Sinkronisasi Data</>
          )}
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="text-xs uppercase bg-slate-800/50 text-slate-400 border-b border-slate-700/50">
              <tr>
                <th className="px-5 py-4 font-semibold tracking-wider cursor-pointer hover:text-white" onClick={() => toggleSort('nama')}>
                  Nama & Kontak <SortIcon field="nama" />
                </th>
                <th className="px-5 py-4 font-semibold tracking-wider cursor-pointer hover:text-white" onClick={() => toggleSort('usia')}>
                  Usia <SortIcon field="usia" />
                </th>
                <th className="px-5 py-4 font-semibold tracking-wider cursor-pointer hover:text-white" onClick={() => toggleSort('instansi')}>
                  Instansi <SortIcon field="instansi" />
                </th>
                <th className="px-5 py-4 font-semibold tracking-wider">Pekerjaan</th>
                <th className="px-5 py-4 font-semibold tracking-wider">Durasi</th>
                <th className="px-5 py-4 font-semibold tracking-wider cursor-pointer hover:text-white" onClick={() => toggleSort('validity')}>
                  Validitas <SortIcon field="validity" />
                </th>
                <th className="px-5 py-4 font-semibold tracking-wider text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-slate-500">Memuat data...</td>
                </tr>
              ) : subs.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-slate-500">Belum ada data klien.</td>
                </tr>
              ) : (
                subs.map((s) => {
                  const validity = calculateValidityIndex(s.rawData, s);
                  return (
                    <tr key={s.id} className="hover:bg-slate-800/20 transition-colors">
                      <td className="px-5 py-4 w-56">
                        <div className="font-semibold text-white mb-1 truncate">{s.userData?.nama}</div>
                        <div className="text-xs text-slate-500 truncate">{s.userData?.email}</div>
                      </td>
                      <td className="px-5 py-4 text-slate-400">
                        {s.userData?.usia ? `${s.userData.usia} thn` : '-'}
                      </td>
                      <td className="px-5 py-4">
                        <span className="bg-purple-500/10 text-purple-400 font-medium px-2.5 py-1 rounded-md text-xs">
                          {s.userData?.instansi || '-'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-slate-400 truncate max-w-[130px]">
                        {s.userData?.pekerjaan || '-'}
                      </td>
                      <td className="px-5 py-4 text-amber-400/80 font-mono text-xs">
                        {s.rawData?.userData?.durasi || '-'}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-slate-700 rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${validity.overallScore}%`, backgroundColor: validity.overallColor }}></div>
                          </div>
                          <span className="text-xs font-bold" style={{ color: validity.overallColor }}>
                            {validity.overallScore}
                          </span>
                          <span className="text-[10px] font-medium px-1.5 py-0.5 rounded" style={{ backgroundColor: validity.overallColor + '20', color: validity.overallColor }}>
                            {validity.overallLabel}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <Link 
                          href={`/admin/reports/${s.id}`}
                          className="text-blue-400 hover:text-blue-300 hover:underline text-xs font-medium px-3 py-1.5 bg-blue-500/10 rounded-lg inline-block transition-all"
                        >
                          Detail
                        </Link>
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
