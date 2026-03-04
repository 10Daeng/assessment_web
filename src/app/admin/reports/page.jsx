'use client';
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { getDiscPatternName } from '@/utils/scoring';
import { logger } from '@/utils/logger';
import ExportSinglePDF from '@/components/ExportSinglePDF';

const BatchExportPDF = dynamic(() => import('@/components/BatchExportPDF'), { ssr: false });

function SortIcon({ sortBy, sortDir, field }) {
  if (sortBy !== field) return <span className="text-slate-600 ml-1">↕</span>;
  return <span className="text-blue-400 ml-1">{sortDir === 'asc' ? '↑' : '↓'}</span>;
}

export default function ReportsPage() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [searchField, setSearchField] = useState('semua');
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('submittedAt');
  const [sortDir, setSortDir] = useState('desc');

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await fetch('/api/admin/submissions');
        const json = await res.json();
        setData(json.data || []);
      } catch (e) {
        logger.error("Failed to fetch data:", e);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  function toggleSort(field) {
    if (sortBy === field) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDir('desc');
    }
  }

  function getHexacoAvg(sub) {
    const fm = sub.hexacoScores?.factorMeans || {};
    const factors = Object.values(fm).filter(v => typeof v === 'number');
    return factors.length > 0 ? factors.reduce((a, b) => a + b, 0) / factors.length : 0;
  }

  const sorted = useMemo(() => {
    let list = [...data];

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(s => {
        const ud = s.userData || {};
        if (searchField === 'nama') return (ud.nama || '').toLowerCase().includes(q);
        if (searchField === 'email') return (ud.email || '').toLowerCase().includes(q);
        if (searchField === 'pekerjaan') return (ud.pekerjaan || '').toLowerCase().includes(q);
        if (searchField === 'pattern') return (s.discScores?.pattern || '').toLowerCase().includes(q);
        // semua
        return (ud.nama || '').toLowerCase().includes(q)
          || (ud.email || '').toLowerCase().includes(q)
          || (ud.pekerjaan || '').toLowerCase().includes(q)
          || (s.discScores?.pattern || '').toLowerCase().includes(q);
      });
    }

    // Sort
    list.sort((a, b) => {
      let va, vb;
      switch (sortBy) {
        case 'nama': va = a.userData?.nama || ''; vb = b.userData?.nama || ''; break;
        case 'email': va = a.userData?.email || ''; vb = b.userData?.email || ''; break;
        case 'pekerjaan': va = a.userData?.pekerjaan || ''; vb = b.userData?.pekerjaan || ''; break;
        case 'pattern': va = a.discScores?.pattern || ''; vb = b.discScores?.pattern || ''; break;
        case 'hexacoAvg': va = getHexacoAvg(a); vb = getHexacoAvg(b); break;
        case 'submittedAt': va = a.submittedAt || ''; vb = b.submittedAt || ''; break;
        default: return 0;
      }
      if (typeof va === 'string') { va = va.toLowerCase(); vb = vb.toLowerCase(); }
      if (va < vb) return sortDir === 'asc' ? -1 : 1;
      if (va > vb) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return list;
  }, [data, search, searchField, sortBy, sortDir]);

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex flex-1 gap-3 w-full md:max-w-lg">
          <input
            type="text"
            placeholder="Cari data laporan..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 bg-slate-900 border border-slate-700 text-white px-4 py-3 rounded-xl text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none placeholder:text-slate-500"
          />
          <select
            value={searchField}
            onChange={e => setSearchField(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-white px-4 py-3 rounded-xl text-sm focus:border-blue-500 outline-none min-w-[150px]"
          >
            <option value="semua">Cari di: Semua</option>
            <option value="nama">Nama</option>
            <option value="email">Email/NIK</option>
            <option value="pekerjaan">Pekerjaan</option>
            <option value="pattern">Pola DISC</option>
          </select>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-xs text-slate-500 mr-2">{sorted.length} dari {data.length} hasil</div>
          <BatchExportPDF data={sorted} />
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center"><div className="w-8 h-8 border-2 border-slate-700 border-t-blue-500 rounded-full animate-spin mx-auto"></div></div>
        ) : sorted.length === 0 ? (
          <div className="p-12 text-center text-slate-500">Tidak ada data ditemukan.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-slate-400 text-xs uppercase tracking-wider border-b border-slate-800">
                  <th className="text-left px-4 py-3">ID</th>
                  <th className="text-left px-4 py-3 cursor-pointer hover:text-white" onClick={() => toggleSort('nama')}>
                    Nama <SortIcon sortBy={sortBy} sortDir={sortDir} field="nama" />
                  </th>
                  <th className="text-left px-4 py-3 cursor-pointer hover:text-white" onClick={() => toggleSort('email')}>
                    Email/NIK <SortIcon sortBy={sortBy} sortDir={sortDir} field="email" />
                  </th>
                  <th className="text-left px-6 py-3 cursor-pointer hover:text-white" onClick={() => toggleSort('pekerjaan')}>
                    Pekerjaan <SortIcon sortBy={sortBy} sortDir={sortDir} field="pekerjaan" />
                  </th>
                  <th className="text-center px-4 py-3 cursor-pointer hover:text-white" onClick={() => toggleSort('pattern')}>
                    Pola DISC <SortIcon sortBy={sortBy} sortDir={sortDir} field="pattern" />
                  </th>
                  <th className="text-center px-4 py-3 cursor-pointer hover:text-white" onClick={() => toggleSort('hexacoAvg')}>
                    HEXACO Avg <SortIcon sortBy={sortBy} sortDir={sortDir} field="hexacoAvg" />
                  </th>
                  <th className="text-left px-4 py-3 cursor-pointer hover:text-white" onClick={() => toggleSort('submittedAt')}>
                    Tanggal <SortIcon sortBy={sortBy} sortDir={sortDir} field="submittedAt" />
                  </th>
                  <th className="text-right px-6 py-3">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map(sub => {
                  const avgHex = getHexacoAvg(sub);
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
                      <td className="px-4 py-4 text-center font-mono text-white">{avgHex > 0 ? avgHex.toFixed(2) : '-'}</td>
                      <td className="px-4 py-4 text-slate-500 text-xs">
                        {sub.submittedAt ? new Date(sub.submittedAt).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta', dateStyle: 'medium', timeStyle: 'short' }) + ' WIB' : '-'}
                      </td>
                      <td className="px-6 py-4 text-right flex items-center justify-end gap-3">
                        <ExportSinglePDF sub={sub} />
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
