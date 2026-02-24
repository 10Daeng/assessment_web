'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const hexacoLabels = {
  H: { name: 'Honesty-Humility', color: 'purple' },
  E: { name: 'Emotionality', color: 'red' },
  X: { name: 'eXtraversion', color: 'blue' },
  A: { name: 'Agreeableness', color: 'green' },
  C: { name: 'Conscientiousness', color: 'orange' },
  O: { name: 'Openness', color: 'teal' },
};

export default function HexacoResultsPage() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [filterDimension, setFilterDimension] = useState('');
  const [filterLevel, setFilterLevel] = useState('');

  useEffect(() => { fetchData(); }, [search]);

  async function fetchData() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/submissions?search=${encodeURIComponent(search)}`);
      const json = await res.json();
      setData(json.data || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  }

  function getLevel(mean) {
    if (mean >= 4) return { label: 'Tinggi', cls: 'text-emerald-400 bg-emerald-500/20' };
    if (mean >= 2.5) return { label: 'Sedang', cls: 'text-blue-400 bg-blue-500/20' };
    return { label: 'Rendah', cls: 'text-amber-400 bg-amber-500/20' };
  }

  let filtered = data;
  if (filterDimension) {
    filtered = filtered.filter(d => {
      const mean = d.hexacoScores?.factorMeans?.[filterDimension];
      return mean !== undefined;
    });
    if (filterLevel) {
      filtered = filtered.filter(d => {
        const mean = d.hexacoScores?.factorMeans?.[filterDimension] || 0;
        const level = getLevel(mean).label;
        return level === filterLevel;
      });
    }
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Cari nama, email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 bg-slate-900 border border-slate-700 text-white px-4 py-3 rounded-xl text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none placeholder:text-slate-500"
        />
        <select
          value={filterDimension}
          onChange={e => { setFilterDimension(e.target.value); setFilterLevel(''); }}
          className="bg-slate-900 border border-slate-700 text-white px-4 py-3 rounded-xl text-sm focus:border-blue-500 outline-none min-w-[200px]"
        >
          <option value="">Semua Dimensi</option>
          {Object.entries(hexacoLabels).map(([k, v]) => (
            <option key={k} value={k}>{v.name} ({k})</option>
          ))}
        </select>
        {filterDimension && (
          <select
            value={filterLevel}
            onChange={e => setFilterLevel(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-white px-4 py-3 rounded-xl text-sm focus:border-blue-500 outline-none min-w-[140px]"
          >
            <option value="">Semua Level</option>
            <option value="Tinggi">Tinggi (≥4.0)</option>
            <option value="Sedang">Sedang (2.5-3.9)</option>
            <option value="Rendah">Rendah (&lt;2.5)</option>
          </select>
        )}
      </div>

      {/* Results Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center"><div className="w-8 h-8 border-2 border-slate-700 border-t-blue-500 rounded-full animate-spin mx-auto"></div></div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-500">Tidak ada data ditemukan.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-slate-400 text-xs uppercase tracking-wider border-b border-slate-800">
                  <th className="text-left px-4 py-3">ID</th>
                  <th className="text-left px-4 py-3">Nama</th>
                  {Object.entries(hexacoLabels).map(([k, v]) => (
                    <th key={k} className="text-center px-3 py-3">{k}</th>
                  ))}
                  <th className="text-center px-3 py-3">ALT</th>
                  <th className="text-left px-4 py-3">Tanggal</th>
                  <th className="text-right px-6 py-3">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(sub => {
                  const fm = sub.hexacoScores?.factorMeans || {};
                  const facetM = sub.hexacoScores?.facetMeans || {};
                  return (
                    <tr key={sub.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                      <td className="px-4 py-4">
                        <span className="text-slate-500 font-mono text-[10px]">{sub.id?.substring(0, 8)}</span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-white font-medium">{sub.userData?.nama || '-'}</div>
                        <div className="text-slate-500 text-xs mt-0.5">{sub.userData?.jabatan || ''}</div>
                      </td>
                      {Object.keys(hexacoLabels).map(k => {
                        const mean = fm[k];
                        const level = getLevel(mean);
                        return (
                          <td key={k} className="px-3 py-4 text-center">
                            <div className="font-mono text-sm text-white">{mean?.toFixed(2) || '-'}</div>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${level.cls}`}>
                              {mean ? level.label : ''}
                            </span>
                          </td>
                        );
                      })}
                      <td className="px-3 py-4 text-center">
                        <div className="font-mono text-sm text-white">{facetM.altr?.toFixed(2) || '-'}</div>
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
          Menampilkan {filtered.length} dari {data.length} data
        </div>
      </div>
    </div>
  );
}
