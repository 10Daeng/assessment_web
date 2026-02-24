'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getDiscPatternName } from '@/utils/scoring';

export default function DuplicatesPage() {
  const [duplicates, setDuplicates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/submissions?type=duplicates')
      .then(r => r.json())
      .then(json => { setDuplicates(json.data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-5 flex items-start gap-4">
        <span className="text-2xl">⚠️</span>
        <div>
          <h3 className="text-amber-400 font-semibold mb-1">Deteksi Data Ganda</h3>
          <p className="text-amber-300/70 text-sm">
            Sistem mendeteksi berdasarkan kesamaan <strong>Nama</strong> dan <strong>Email/NIK</strong>. 
            Data dengan kedua field identik dianggap kemungkinan duplikat.
          </p>
        </div>
      </div>

      {duplicates.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
          <div className="text-4xl mb-4">✅</div>
          <p className="text-emerald-400 font-semibold text-lg">Tidak Ada Data Ganda</p>
          <p className="text-slate-500 text-sm mt-2">Semua submisi memiliki identitas unik.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {duplicates.map((dup, idx) => (
            <div key={idx} className="bg-slate-900 border border-amber-500/20 rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-amber-500/5">
                <div>
                  <h3 className="text-white font-semibold">{dup.nama || 'Tanpa Nama'}</h3>
                  <p className="text-slate-400 text-xs mt-0.5">{dup.email || 'Tanpa Email'}</p>
                </div>
                <span className="bg-amber-500/20 text-amber-400 font-bold px-3 py-1 rounded-full text-xs">
                  {dup.count}x Submisi
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-slate-400 text-xs uppercase tracking-wider border-b border-slate-800">
                      <th className="text-left px-6 py-3">ID</th>
                      <th className="text-left px-4 py-3">Pola DISC</th>
                      <th className="text-left px-4 py-3">Tanggal Submisi</th>
                      <th className="text-right px-6 py-3">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dup.submissions.map(s => (
                      <tr key={s.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                        <td className="px-6 py-3 text-slate-400 font-mono text-xs">{s.id}</td>
                        <td className="px-4 py-3">
                          <span className="bg-blue-500/20 text-blue-400 font-bold px-2.5 py-0.5 rounded-full text-xs">
                            {getDiscPatternName(s.discScores?.pattern)} ({s.discScores?.pattern || '-'})
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-500 text-xs">
                          {s.submittedAt ? new Date(s.submittedAt).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta', dateStyle: 'medium', timeStyle: 'short' }) + ' WIB' : '-'}
                        </td>
                        <td className="px-6 py-3 text-right">
                          <Link href={`/admin/reports/${s.id}`} className="text-blue-400 hover:text-blue-300 text-xs hover:underline">
                            Lihat →
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
