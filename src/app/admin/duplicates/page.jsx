'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getDiscPatternName } from '@/utils/scoring';
import { logger } from '@/utils/logger';

export default function DuplicatesPage() {
  const [duplicates, setDuplicates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const [editId, setEditId] = useState(null);
  const [editFormData, setEditFormData] = useState({ nama: '', email: '' });

  useEffect(() => {
    fetch('/api/admin/submissions?type=duplicates')
      .then(r => r.json())
      .then(json => { setDuplicates(json.data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [refreshKey]);

  // Calculate max duplicate count
  const maxDuplicateCount = Math.max(...duplicates.map(d => d.count || 0), 0);
  const totalDuplicates = duplicates.reduce((sum, d) => sum + (d.count || 0), 0);
  const uniquePersons = duplicates.length;

  // Validity color function
  const getValidityColor = (score) => {
    if (score === '-' || score === undefined) return 'text-slate-500';
    if (score >= 80) return 'text-emerald-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-rose-400';
  };

  const getValidityLabel = (score) => {
    if (score === '-' || score === undefined) return '-';
    if (score >= 80) return 'Valid';
    if (score >= 60) return 'Meragukan';
    return 'Tidak Valid';
  };

  const triggerRefresh = () => setRefreshKey(k => k + 1);

  const startEdit = (s) => {
    setEditId(s.id);
    setEditFormData({
      nama: s.userData?.nama || '',
      email: s.userData?.email || ''
    });
  };

  const saveEdit = async (id) => {
    try {
      await fetch(`/api/admin/submissions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'user_data', ...editFormData })
      });
      setEditId(null);
      triggerRefresh();
    } catch (_e) {
      alert('Gagal menyimpan perubahan');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Apakah Yakin Ingin Menghapus Data Ini? Data Hancur Permanen!')) return;
    try {
      await fetch(`/api/admin/submissions/${id}`, { method: 'DELETE' });
      triggerRefresh();
    } catch (_e) {
      alert('Gagal menghapus submisi');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 border-4 border-slate-700 border-t-amber-500 rounded-full animate-spin"></div>
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
          <div className="mt-3 grid grid-cols-3 gap-3">
            <div className="bg-slate-800/50 rounded-lg p-3">
              <p className="text-amber-200 text-xs uppercase tracking-wider mb-1">Total Orang Duplikat</p>
              <p className="text-white font-bold text-2xl">{uniquePersons}</p>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-3">
              <p className="text-amber-200 text-xs uppercase tracking-wider mb-1">Maks. Submisi / Orang</p>
              <p className="text-white font-bold text-2xl">
                {maxDuplicateCount}x
                <span className="text-sm font-normal text-slate-400">/orang</span>
              </p>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-3">
              <p className="text-amber-200 text-xs uppercase tracking-wider mb-1">Total Submisi Duplikat</p>
              <p className="text-white font-bold text-2xl">{totalDuplicates}</p>
            </div>
          </div>
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
                      <th className="text-left px-4 py-3">Validitas</th>
                      <th className="text-left px-4 py-3">Nama</th>
                      <th className="text-left px-4 py-3">Email/NIK</th>
                      <th className="text-left px-4 py-3">Pola DISC</th>
                      <th className="text-left px-4 py-3">Tanggal Submisi</th>
                      <th className="text-right px-6 py-3">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dup.submissions.map(s => {
                      const val = s.validity || {};
                      return (
                        <tr key={s.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                          <td className="px-6 py-3 text-slate-400 font-mono text-xs">{s.id.substring(0,8)}</td>
                          <td className="px-4 py-3">
                            <span className={`${getValidityColor(val.overallScore)} font-semibold text-sm`}>
                              {val.overallScore || '-'}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {editId === s.id ? (
                            <input type="text" className="w-full bg-slate-800 border-none text-white rounded px-2 py-1 text-sm" value={editFormData.nama} onChange={e => setEditFormData({...editFormData, nama: e.target.value})} placeholder="Nama" />
                          ) : (
                            <span className="text-white font-medium">{s.userData?.nama || '-'}</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {editId === s.id ? (
                            <input type="text" className="w-full bg-slate-800 border-none text-white rounded px-2 py-1 text-sm" value={editFormData.email} onChange={e => setEditFormData({...editFormData, email: e.target.value})} placeholder="Email/NIK" />
                          ) : (
                            <span className="text-slate-400 text-xs">{s.userData?.email || '-'}</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span className="bg-blue-500/20 text-blue-400 font-bold px-2.5 py-0.5 rounded-full text-xs">
                            {getDiscPatternName(s.discScores?.pattern)} ({s.discScores?.pattern || '-'})
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-500 text-xs">
                          {s.submittedAt ? new Date(s.submittedAt).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta', dateStyle: 'medium', timeStyle: 'short' }) + ' WIB' : '-'}
                        </td>
                        <td className="px-6 py-3 text-right flex gap-3 justify-end items-center">
                          {editId === s.id ? (
                            <>
                              <button onClick={() => saveEdit(s.id)} className="text-emerald-400 hover:text-emerald-300 font-medium text-xs">Simpan</button>
                              <button onClick={() => setEditId(null)} className="text-slate-400 hover:text-slate-300 font-medium text-xs">Batal</button>
                            </>
                          ) : (
                            <>
                              <button onClick={() => startEdit(s)} className="text-amber-400 hover:text-amber-300 font-medium text-xs">Edit</button>
                              <button onClick={() => handleDelete(s.id)} className="text-red-400 hover:text-red-300 font-medium text-xs">Hapus</button>
                              <Link href={`/admin/reports/${s.id}`} className="text-blue-400 hover:text-blue-300 font-medium text-xs">
                                Lihat →
                              </Link>
                            </>
                          )}
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
