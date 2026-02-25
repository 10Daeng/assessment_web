'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { calculateValidityIndex } from '@/utils/validityCheck';

export default function UsersPage() {
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/submissions')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setSubs(data.data);
        }
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Daftar Klien & Identitas</h2>
          <p className="text-slate-400 text-sm mt-1">Laporan demografis lengkap seluruh pengguna beserta indeks validitas</p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="text-xs uppercase bg-slate-800/50 text-slate-400 border-b border-slate-700/50">
              <tr>
                <th className="px-5 py-4 font-semibold tracking-wider">Nama & Kontak</th>
                <th className="px-5 py-4 font-semibold tracking-wider">Usia</th>
                <th className="px-5 py-4 font-semibold tracking-wider">Instansi</th>
                <th className="px-5 py-4 font-semibold tracking-wider">Pekerjaan</th>
                <th className="px-5 py-4 font-semibold tracking-wider">Durasi</th>
                <th className="px-5 py-4 font-semibold tracking-wider">Validitas</th>
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
                  const validity = calculateValidityIndex(s.rawData);
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
