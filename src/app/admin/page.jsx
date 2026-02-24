'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getDiscPatternName } from '@/utils/scoring';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ total: 0, today: 0, duplicates: 0 });
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [subRes, dupRes] = await Promise.all([
          fetch('/api/admin/submissions?sortBy=submittedAt&sortDir=desc'),
          fetch('/api/admin/submissions?type=duplicates')
        ]);
        const subData = await subRes.json();
        const dupData = await dupRes.json();

        const all = subData.data || [];
        const todayStr = new Date().toISOString().slice(0, 10);
        const todayCount = all.filter(s => (s.submittedAt || '').slice(0, 10) === todayStr).length;

        setStats({ total: all.length, today: todayCount, duplicates: (dupData.data || []).length });
        setRecent(all.slice(0, 8));
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    }
    load();
  }, []);

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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/10 border border-blue-500/20 rounded-2xl p-6">
          <p className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-2">Total Asesmen</p>
          <p className="text-4xl font-extrabold text-white">{stats.total}</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-600/20 to-emerald-800/10 border border-emerald-500/20 rounded-2xl p-6">
          <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-2">Hari Ini</p>
          <p className="text-4xl font-extrabold text-white">{stats.today}</p>
        </div>
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

      {/* Recent Submissions */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <h2 className="font-semibold text-white">Submisi Terbaru</h2>
          <Link href="/admin/reports" className="text-xs text-blue-400 hover:underline">
            Lihat semua →
          </Link>
        </div>
        {recent.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <p className="text-lg mb-2">Belum ada data asesmen.</p>
            <p className="text-sm">Data akan muncul di sini setelah klien mengisi formulir.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-slate-400 text-xs uppercase tracking-wider border-b border-slate-800">
                  <th className="text-left px-4 py-3">ID</th>
                  <th className="text-left px-4 py-3">Nama</th>
                  <th className="text-left px-4 py-3">Email</th>
                  <th className="text-left px-6 py-3">Pola DISC</th>
                  <th className="text-left px-6 py-3">Tanggal</th>
                  <th className="text-right px-6 py-3">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {recent.map(sub => (
                  <tr key={sub.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-4"><span className="text-slate-500 font-mono text-[10px]">{sub.id?.substring(0, 8)}</span></td>
                    <td className="px-4 py-4 text-white font-medium">{sub.userData?.nama || '-'}</td>
                    <td className="px-4 py-4 text-slate-400">{sub.userData?.email || '-'}</td>
                    <td className="px-6 py-4">
                      <span className="bg-blue-500/20 text-blue-400 font-bold px-3 py-1 rounded-full text-xs">
                        {getDiscPatternName(sub.discScores?.pattern)} ({sub.discScores?.pattern || '-'})
                      </span>
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
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
