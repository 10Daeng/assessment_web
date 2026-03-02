'use client';
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { getDiscPatternName } from '@/utils/scoring';
import { logger } from '@/utils/logger';

function SortIcon({ sortBy, sortDir, field }) {
  if (sortBy !== field) return <span className="text-slate-600 ml-1">↕</span>;
  return <span className="text-blue-400 ml-1">{sortDir === 'asc' ? '↑' : '↓'}</span>;
}

export default function DiscResultsPage() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [filterPattern, setFilterPattern] = useState('');
  const [sortBy, setSortBy] = useState('submittedAt');
  const [sortDir, setSortDir] = useState('desc');

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/submissions?search=${encodeURIComponent(search)}`);
        const json = await res.json();
        setData(json.data || []);
      } catch (e) {
        logger.error("Failed to fetch DISC data:", e);
      }
      setLoading(false);
    }
    fetchData();
  }, [search]);

  function toggleSort(field) {
    if (sortBy === field) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDir('asc');
    }
  }

  const patterns = [...new Set(data.map(d => d.discScores?.pattern).filter(Boolean))];

  const sorted = useMemo(() => {
    let list = filterPattern ? data.filter(d => d.discScores?.pattern === filterPattern) : [...data];
    list.sort((a, b) => {
      let va, vb;
      switch (sortBy) {
        case 'nama': va = a.userData?.nama || ''; vb = b.userData?.nama || ''; break;
        case 'pattern': va = a.discScores?.pattern || ''; vb = b.discScores?.pattern || ''; break;
        case 'D': va = a.discScores?.discComposite?.D || 0; vb = b.discScores?.discComposite?.D || 0; break;
        case 'I': va = a.discScores?.discComposite?.I || 0; vb = b.discScores?.discComposite?.I || 0; break;
        case 'S': va = a.discScores?.discComposite?.S || 0; vb = b.discScores?.discComposite?.S || 0; break;
        case 'C': va = a.discScores?.discComposite?.C || 0; vb = b.discScores?.discComposite?.C || 0; break;
        case 'submittedAt': va = a.submittedAt || ''; vb = b.submittedAt || ''; break;
        default: return 0;
      }
      if (typeof va === 'string') { va = va.toLowerCase(); vb = vb.toLowerCase(); }
      if (va < vb) return sortDir === 'asc' ? -1 : 1;
      if (va > vb) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return list;
  }, [data, filterPattern, sortBy, sortDir]);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Cari nama, email, jabatan..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 bg-slate-900 border border-slate-700 text-white px-4 py-3 rounded-xl text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none placeholder:text-slate-500"
        />
        <select
          value={filterPattern}
          onChange={e => setFilterPattern(e.target.value)}
          className="bg-slate-900 border border-slate-700 text-white px-4 py-3 rounded-xl text-sm focus:border-blue-500 outline-none min-w-[180px]"
        >
          <option value="">Semua Pola DISC</option>
          {patterns.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
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
                  <th className="text-center px-4 py-3 cursor-pointer hover:text-white" onClick={() => toggleSort('pattern')}>
                    Pola <SortIcon sortBy={sortBy} sortDir={sortDir} field="pattern" />
                  </th>
                  <th className="text-center px-2 py-3 cursor-pointer hover:text-white" onClick={() => toggleSort('D')}>
                    <span className="text-red-400">D</span> <SortIcon sortBy={sortBy} sortDir={sortDir} field="D" />
                  </th>
                  <th className="text-center px-2 py-3 cursor-pointer hover:text-white" onClick={() => toggleSort('I')}>
                    <span className="text-yellow-400">I</span> <SortIcon sortBy={sortBy} sortDir={sortDir} field="I" />
                  </th>
                  <th className="text-center px-2 py-3 cursor-pointer hover:text-white" onClick={() => toggleSort('S')}>
                    <span className="text-green-400">S</span> <SortIcon sortBy={sortBy} sortDir={sortDir} field="S" />
                  </th>
                  <th className="text-center px-2 py-3 cursor-pointer hover:text-white" onClick={() => toggleSort('C')}>
                    <span className="text-blue-400">C</span> <SortIcon sortBy={sortBy} sortDir={sortDir} field="C" />
                  </th>
                  <th className="text-center px-4 py-3">Grafik</th>
                  <th className="text-left px-4 py-3 cursor-pointer hover:text-white" onClick={() => toggleSort('submittedAt')}>
                    Tanggal <SortIcon sortBy={sortBy} sortDir={sortDir} field="submittedAt" />
                  </th>
                  <th className="text-right px-6 py-3">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map(sub => {
                  const comp = sub.discScores?.discComposite || { D: 0, I: 0, S: 0, C: 0 };
                  const most = sub.discScores?.discMost || { D: 0, I: 0, S: 0, C: 0 };
                  return (
                    <tr key={sub.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                      <td className="px-4 py-4">
                        <span className="text-slate-500 font-mono text-[10px]">{sub.id?.substring(0, 8)}</span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-white font-medium">{sub.userData?.nama || '-'}</div>
                        <div className="text-slate-500 text-xs mt-0.5">{sub.userData?.pekerjaan || ''}</div>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className="bg-blue-500/20 text-blue-400 font-bold px-3 py-1 rounded-full text-xs">
                          {getDiscPatternName(sub.discScores?.pattern)} ({sub.discScores?.pattern || '-'})
                        </span>
                      </td>
                      <td className="px-2 py-4 text-center">
                        <span className={`font-mono text-sm ${comp.D > 0 ? 'text-red-400' : comp.D < 0 ? 'text-red-800' : 'text-slate-600'}`}>
                          {comp.D > 0 ? '+' : ''}{comp.D}
                        </span>
                      </td>
                      <td className="px-2 py-4 text-center">
                        <span className={`font-mono text-sm ${comp.I > 0 ? 'text-yellow-400' : comp.I < 0 ? 'text-yellow-800' : 'text-slate-600'}`}>
                          {comp.I > 0 ? '+' : ''}{comp.I}
                        </span>
                      </td>
                      <td className="px-2 py-4 text-center">
                        <span className={`font-mono text-sm ${comp.S > 0 ? 'text-green-400' : comp.S < 0 ? 'text-green-800' : 'text-slate-600'}`}>
                          {comp.S > 0 ? '+' : ''}{comp.S}
                        </span>
                      </td>
                      <td className="px-2 py-4 text-center">
                        <span className={`font-mono text-sm ${comp.C > 0 ? 'text-blue-400' : comp.C < 0 ? 'text-blue-800' : 'text-slate-600'}`}>
                          {comp.C > 0 ? '+' : ''}{comp.C}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex gap-0.5 h-6 items-end">
                          {['D', 'I', 'S', 'C'].map(t => {
                            const v = most[t] || 0;
                            const h = Math.max(2, (v / 24) * 100);
                            const colors = { D: 'bg-red-500', I: 'bg-yellow-500', S: 'bg-green-500', C: 'bg-blue-500' };
                            return <div key={t} className={`w-3 rounded-t ${colors[t]}`} style={{ height: `${h}%` }}></div>;
                          })}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-slate-500 text-xs whitespace-nowrap">
                        {sub.submittedAt ? new Date(sub.submittedAt).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta', dateStyle: 'medium', timeStyle: 'short' }) + ' WIB' : '-'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link href={`/admin/reports/${sub.id}`} className="text-blue-400 hover:text-blue-300 text-xs hover:underline">
                          Detail →
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        <div className="px-6 py-3 border-t border-slate-800 text-xs text-slate-500">
          Menampilkan {sorted.length} dari {data.length} data
        </div>
      </div>
    </div>
  );
}
