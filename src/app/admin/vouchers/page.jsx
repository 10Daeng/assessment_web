'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminVoucherPage() {
  const [vouchers, setVouchers] = useState([]);
  const [packages, setPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({ code: '', packageId: '', quota: 100 });
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/premium/vouchers');
      const data = await res.json();
      if (res.ok) {
        setVouchers(data.vouchers || []);
        setPackages(data.packages || []);
      }
    } catch (e) {
      console.error(e);
      alert('Gagal mengambil data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateVoucher = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const res = await fetch('/api/premium/vouchers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Gagal membuat voucher');
      
      setVouchers([data.voucher, ...vouchers]);
      setIsFormOpen(false);
      setFormData({ code: '', packageId: packages[0]?.id || '', quota: 100 });
      alert('Berhasil membuat voucher baru');
    } catch (e) {
      alert(e.message);
    } finally {
      setFormLoading(false);
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    if (!confirm(`Yakin ingin mengubah status voucher ini?`)) return;
    try {
      const res = await fetch('/api/premium/vouchers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isActive: !currentStatus })
      });
      if (res.ok) {
        fetchData();
      }
    } catch (e) {
      alert('Gagal mengubah status');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('PERINGATAN: Menghapus voucher akan menghapus relasi. Yakin menghapus permanen?')) return;
    try {
      const res = await fetch('/api/premium/vouchers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action: 'DELETE' })
      });
      if (res.ok) {
        setVouchers(vouchers.filter(v => v.id !== id));
      } else {
         const d = await res.json();
         alert(d.message || 'Gagal menghapus');
      }
    } catch (e) {
      alert('Gagal menghapus');
    }
  };

  if (isLoading) {
    return <div className="text-slate-400 p-8">Memuat Data Voucher...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Kelola Voucher AaaS</h1>
          <p className="text-slate-400 text-sm mt-1">Buat token dan kode kupon untuk akses Assessment Hub.</p>
        </div>
        <button 
          onClick={() => {
            if(!formData.packageId && packages.length > 0) setFormData({...formData, packageId: packages[0].id});
            setIsFormOpen(!isFormOpen);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition flex items-center gap-2"
        >
          {isFormOpen ? 'Tutup Form' : '✨ Buat Voucher Baru'}
        </button>
      </div>

      {isFormOpen && (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl mb-8 animate-in fade-in slide-in-from-top-4">
          <h2 className="text-lg font-bold text-white mb-4 border-b border-slate-800 pb-2">Form Pembuatan Voucher</h2>
          <form onSubmit={handleCreateVoucher} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Kode Voucher (Unik)</label>
                <input required type="text" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})} placeholder="misal: REKRUTMEN-ABC" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white outline-none focus:border-blue-500 uppercase"/>
                <p className="text-[10px] text-slate-500 mt-1">Hanya huruf dan angka, tanpa spasi.</p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Pilih Paket Assessment</label>
                <select required value={formData.packageId} onChange={e => setFormData({...formData, packageId: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white outline-none focus:border-blue-500">
                  {packages.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.intent})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Kuota Penggunaan</label>
                <input required type="number" min="1" value={formData.quota} onChange={e => setFormData({...formData, quota: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white outline-none focus:border-blue-500"/>
                <p className="text-[10px] text-slate-500 mt-1">Berapa kali bisa ditukarkan.</p>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button disabled={formLoading} type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-xl text-sm font-semibold transition disabled:opacity-50">
                {formLoading ? 'Menyimpan...' : 'Simpan Voucher'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tables */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/50 border-b border-slate-800">
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Kode Voucher</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Paket Akses</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-center">Kuota Terpakai</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-center">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {vouchers.map(v => (
                <tr key={v.id} className="hover:bg-slate-800/30 transition">
                  <td className="px-6 py-4">
                    <div className="font-mono text-sm font-bold text-white tracking-widest bg-slate-950 inline-block px-3 py-1 rounded-lg border border-slate-800">
                      {v.code}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold text-blue-400">{v.package?.name}</div>
                    <div className="text-xs text-slate-500 mt-0.5 font-mono">{v.packageId}</div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="text-sm">
                       <span className={v.usedCount >= v.quota ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}>{v.usedCount}</span>
                       <span className="text-slate-500"> / {v.quota}</span>
                    </div>
                    {v.usedCount >= v.quota && <p className="text-[10px] text-red-500/80 mt-1">Kuota Habis</p>}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => toggleStatus(v.id, v.isActive)}
                      className={`text-xs px-3 py-1 rounded-full font-semibold border transition ${
                        v.isActive 
                         ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20' 
                         : 'bg-slate-800 text-slate-500 border-slate-700 hover:bg-slate-700'
                      }`}
                    >
                      {v.isActive ? '🟢 Aktif' : '⚪ Nonaktif'}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleDelete(v.id)}
                      className="text-slate-500 hover:text-red-400 transition" 
                      title="Hapus Voucher"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
              {vouchers.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-500">Belum ada data voucher.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
