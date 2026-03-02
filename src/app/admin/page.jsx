'use client';
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { calculateValidityIndex } from '@/utils/validityCheck';
import { logger } from '@/utils/logger';

export default function AdminDashboard() {
  const [allData, setAllData] = useState([]);
  const [dupCount, setDupCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const [subRes, dupRes] = await Promise.all([
          fetch('/api/admin/submissions?sortBy=submittedAt&sortDir=desc'),
          fetch('/api/admin/submissions?type=duplicates')
        ]);
        const subData = await subRes.json();
        const dupData = await dupRes.json();
        setAllData(subData.data || []);
        setDupCount((dupData.data || []).length);
      } catch (e) {
        logger.error(e);
      }
      setLoading(false);
    }
    load();
  }, []);

  const filtered = useMemo(() => {
    let list = allData;
    if (dateFrom) {
      list = list.filter(s => (s.submittedAt || '').slice(0, 10) >= dateFrom);
    }
    if (dateTo) {
      list = list.filter(s => (s.submittedAt || '').slice(0, 10) <= dateTo);
    }
    return list;
  }, [allData, dateFrom, dateTo]);

  const stats = useMemo(() => {
    const todayStr = new Date().toISOString().slice(0, 10);
    const todayCount = allData.filter(s => (s.submittedAt || '').slice(0, 10) === todayStr).length;
    return { total: allData.length, filtered: filtered.length, today: todayCount, duplicates: dupCount };
  }, [allData, filtered, dupCount]);

  const isFiltered = dateFrom || dateTo;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/10 border border-blue-500/20 rounded-2xl p-6">
          <p className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-2">Total Asesmen</p>
          <p className="text-4xl font-extrabold text-white">{stats.total}</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-600/20 to-emerald-800/10 border border-emerald-500/20 rounded-2xl p-6">
          <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-2">Hari Ini</p>
          <p className="text-4xl font-extrabold text-white">{stats.today}</p>
        </div>
        {isFiltered && (
          <div className="bg-gradient-to-br from-cyan-600/20 to-cyan-800/10 border border-cyan-500/20 rounded-2xl p-6">
            <p className="text-cyan-400 text-xs font-bold uppercase tracking-widest mb-2">Hasil Filter</p>
            <p className="text-4xl font-extrabold text-white">{stats.filtered}</p>
          </div>
        )}
        <div className="bg-gradient-to-br from-amber-600/20 to-amber-800/10 border border-amber-500/20 rounded-2xl p-6">
          <p className="text-amber-400 text-xs font-bold uppercase tracking-widest mb-2">Data Ganda</p>
          <p className="text-4xl font-extrabold text-white">{stats.duplicates}</p>
          {stats.duplicates > 0 && (
            <Link href="/admin/duplicates" className="text-xs text-amber-400 hover:underline mt-2 inline-block">
              Lihat detail →
            </Link>
          )}
        </div>
      </div>

      {/* Date Filter */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <span className="text-slate-400 text-sm font-medium whitespace-nowrap">📅 Filter Tanggal Submit:</span>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <label className="text-slate-500 text-xs">Dari</label>
              <input
                type="date"
                value={dateFrom}
                onChange={e => setDateFrom(e.target.value)}
                className="bg-slate-800 border border-slate-700 text-white px-3 py-2 rounded-lg text-sm focus:border-blue-500 outline-none"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-slate-500 text-xs">Sampai</label>
              <input
                type="date"
                value={dateTo}
                onChange={e => setDateTo(e.target.value)}
                className="bg-slate-800 border border-slate-700 text-white px-3 py-2 rounded-lg text-sm focus:border-blue-500 outline-none"
              />
            </div>
            {isFiltered && (
              <button
                onClick={() => { setDateFrom(''); setDateTo(''); }}
                className="text-xs text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 px-3 py-2 rounded-lg transition-all"
              >
                ✕ Reset
              </button>
            )}
          </div>
          {isFiltered && (
            <span className="text-xs text-slate-500">
              Menampilkan {filtered.length} dari {allData.length} data
            </span>
          )}
        </div>
      </div>

      {/* Submissions Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <h2 className="font-semibold text-white">
            {isFiltered ? `Submisi (${filtered.length} hasil)` : 'Submisi Terbaru'}
          </h2>
          <Link href="/admin/reports" className="text-xs text-blue-400 hover:underline">
            Lihat semua →
          </Link>
        </div>
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <p className="text-lg mb-2">{isFiltered ? 'Tidak ada data dalam rentang tanggal ini.' : 'Belum ada data asesmen.'}</p>
            <p className="text-sm">{isFiltered ? 'Coba ubah rentang tanggal filter.' : 'Data akan muncul di sini setelah klien mengisi formulir.'}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-slate-400 text-xs uppercase tracking-wider border-b border-slate-800">
                  <th className="text-left px-4 py-3">ID</th>
                  <th className="text-left px-4 py-3">Nama</th>
                  <th className="text-left px-4 py-3">Email</th>
                  <th className="text-left px-6 py-3">Validitas</th>
                  <th className="text-left px-6 py-3">Tanggal</th>
                  <th className="text-right px-6 py-3">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {(isFiltered ? filtered : filtered.slice(0, 8)).map(sub => {
                  const validity = calculateValidityIndex(sub.rawData, sub);
                  const isSuspicious = validity.overallScore !== '-' && validity.overallScore < 60;
                  
                  return (
                    <tr key={sub.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                      <td className="px-4 py-4"><span className="text-slate-500 font-mono text-[10px]">{sub.id?.substring(0, 8)}</span></td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-medium">{sub.userData?.nama || '-'}</span>
                          {isSuspicious && (
                            <span title={`Skor Validitas: ${validity.overallScore} - Meragukan/Tidak Valid`} className="bg-red-500/10 text-red-400 text-[10px] px-2 py-0.5 rounded-full border border-red-500/20 font-bold">
                              ⚠️ Indikasi Asal-asalan
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-slate-400">{sub.userData?.email || '-'}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold" style={{ color: validity.overallColor }}>
                            {validity.overallScore}
                          </span>
                          <span className="text-xs font-medium uppercase tracking-wider" style={{ color: validity.overallColor }}>
                            {validity.overallLabel}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-500 text-xs">
                        {sub.submittedAt ? new Date(sub.submittedAt).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta', dateStyle: 'medium', timeStyle: 'short' }) + ' WIB' : '-'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link href={`/admin/reports/${sub.id}`} className="text-blue-400 hover:text-blue-300 text-xs hover:underline">
                          Detail
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
