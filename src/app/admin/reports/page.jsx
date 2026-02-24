'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { getDiscPatternName } from '@/utils/scoring';

const BatchExportPDF = dynamic(() => import('@/components/BatchExportPDF'), { ssr: false });

export default function ReportsPage() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('submittedAt');
  const [sortDir, setSortDir] = useState('desc');

  useEffect(() => { fetchData(); }, [search, sortBy, sortDir]);

  async function fetchData() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/submissions?search=${encodeURIComponent(search)}&sortBy=${sortBy}&sortDir=${sortDir}`);
      const json = await res.json();
      setData(json.data || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  }

  function toggleSort(field) {
    if (sortBy === field) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDir('desc');
    }
  }

  function SortIcon({ field }) {
    if (sortBy !== field) return <span className="text-slate-600 ml-1">↕</span>;
    return <span className="text-blue-400 ml-1">{sortDir === 'asc' ? '↑' : '↓'}</span>;
  }

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <input
          type="text"
          placeholder="Cari nama, email, pekerjaan..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 bg-slate-900 border border-slate-700 text-white px-4 py-3 rounded-xl text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none placeholder:text-slate-500 w-full md:max-w-md"
        />
        <div className="flex items-center gap-3">
          <div className="text-xs text-slate-500 mr-2">{data.length} hasil ditemukan</div>
          <BatchExportPDF data={data} />
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center"><div className="w-8 h-8 border-2 border-slate-700 border-t-blue-500 rounded-full animate-spin mx-auto"></div></div>
        ) : data.length === 0 ? (
          <div className="p-12 text-center text-slate-500">Tidak ada data ditemukan.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-slate-400 text-xs uppercase tracking-wider border-b border-slate-800">
                  <th className="text-left px-4 py-3">ID</th>
                  <th className="text-left px-4 py-3 cursor-pointer hover:text-white" onClick={() => toggleSort('nama')}>
                    Nama <SortIcon field="nama" />
                  </th>
                  <th className="text-left px-4 py-3">Email/NIK</th>
                  <th className="text-left px-6 py-3">Pekerjaan</th>
                  <th className="text-center px-4 py-3 cursor-pointer hover:text-white" onClick={() => toggleSort('pattern')}>
                    Pola DISC <SortIcon field="pattern" />
                  </th>
                  <th className="text-center px-4 py-3">HEXACO Avg</th>
                  <th className="text-left px-4 py-3 cursor-pointer hover:text-white" onClick={() => toggleSort('submittedAt')}>
                    Tanggal <SortIcon field="submittedAt" />
                  </th>
                  <th className="text-right px-6 py-3">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {data.map(sub => {
                  const fm = sub.hexacoScores?.factorMeans || {};
                  const factors = Object.values(fm).filter(v => typeof v === 'number');
                  const avgHex = factors.length > 0 ? (factors.reduce((a, b) => a + b, 0) / factors.length).toFixed(2) : '-';

                  return (
                    <tr key={sub.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors group">
                      <td className="px-4 py-4">
                        <span className="text-slate-500 font-mono text-[10px]">{sub.id?.substring(0, 8)}</span>
                      </td>
                      <td className="px-4 py-4 text-white font-medium">{sub.userData?.nama || '-'}</td>
                      <td className="px-4 py-4 text-slate-400">{sub.userData?.email || '-'}</td>
                      <td className="px-6 py-4 text-slate-400 text-xs">{sub.userData?.pekerjaan || '-'}</td>
                      <td className="px-4 py-4 text-center">
                        <span className="bg-blue-500/20 text-blue-400 font-bold px-3 py-1 rounded-full text-xs">
                          {getDiscPatternName(sub.discScores?.pattern)} ({sub.discScores?.pattern || '-'})
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center font-mono text-white">{avgHex}</td>
                      <td className="px-4 py-4 text-slate-500 text-xs">
                        {sub.submittedAt ? new Date(sub.submittedAt).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta', dateStyle: 'medium', timeStyle: 'short' }) + ' WIB' : '-'}
                      </td>
                      <td className="px-6 py-4 text-right space-x-3">
                        <Link href={`/admin/reports/${sub.id}`} className="text-blue-400 hover:text-blue-300 text-xs hover:underline">
                          Lihat Laporan
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
