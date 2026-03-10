'use client';

import { useState } from 'react';

// Common Base Fields
const BaseFields = ({ formData, handleChange }) => (
  <>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">Nama Lengkap</label>
        <input type="text" name="nama" required value={formData.nama || ''} onChange={handleChange} placeholder="e.g. John Doe" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-blue-500 bg-slate-50 transition-all" />
      </div>
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
        <input type="email" name="email" required value={formData.email || ''} onChange={handleChange} placeholder="e.g. user@example.com" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 transition-all" />
      </div>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">Usia</label>
        <input type="number" name="usia" min="10" max="100" required value={formData.usia || ''} onChange={handleChange} placeholder="25" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50" />
      </div>
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">Jenis Kelamin</label>
        <select name="jenisKelamin" required value={formData.jenisKelamin || ''} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50">
           <option value="">Pilih...</option>
           <option value="L">Laki-Laki</option>
           <option value="P">Perempuan</option>
        </select>
      </div>
      <div className="col-span-2">
         <label className="block text-sm font-semibold text-slate-700 mb-2">No. HP / WhatsApp Active</label>
         <input type="text" name="phone" required value={formData.phone || ''} onChange={handleChange} placeholder="0812xxxxxx" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50" />
      </div>
    </div>
  </>
);

const AcademicFields = ({ formData, handleChange }) => (
  <div className="space-y-4 mt-6 border-t pt-6 bg-blue-50/50 p-4 rounded-xl">
    <h3 className="font-bold text-lg text-blue-900 mb-4">Profil Akademik & Penjurusan</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div><label className="block text-sm font-semibold text-slate-700 mb-2">NISN</label><input type="text" name="nisn" required value={formData.nisn || ''} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white" placeholder="Nomor Induk Siswa Nasional" /></div>
      <div><label className="block text-sm font-semibold text-slate-700 mb-2">Asal Sekolah</label><input type="text" name="asalSekolah" required value={formData.asalSekolah || ''} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white" placeholder="SMA Negeri 1..." /></div>
      <div><label className="block text-sm font-semibold text-slate-700 mb-2">Kelas Saat Ini</label><input type="text" name="kelas" required value={formData.kelas || ''} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white" placeholder="12 IPA 1" /></div>
      <div><label className="block text-sm font-semibold text-slate-700 mb-2">Nilai Rata-rata Rapor Terakhir</label><input type="text" name="rataRapor" required value={formData.rataRapor || ''} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white" placeholder="Contoh: 88.5" /></div>
    </div>
    <div><label className="block text-sm font-semibold text-slate-700 mb-2">Mata Pelajaran Terfavorit & Alasannya</label><textarea name="mapelFavorit" required value={formData.mapelFavorit || ''} onChange={handleChange} rows="2" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white" placeholder="Suka Biologi karena..."></textarea></div>
    <div><label className="block text-sm font-semibold text-slate-700 mb-2">Cita-cita / Karir Impian</label><input type="text" name="citaCita" required value={formData.citaCita || ''} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white" placeholder="Dokter, Pengusaha, dll" /></div>
  </div>
);

const ComprehensiveRHFields = ({ formData, handleChange, isRecruitment }) => (
  <div className="space-y-4 mt-6 border-t pt-6 bg-slate-50 p-4 rounded-xl">
    <h3 className="font-bold text-lg text-slate-800 mb-4">Riwayat Hidup Lengkap {isRecruitment ? "(Rekrutmen)" : "(Grafologi)"}</h3>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div><label className="block text-sm font-semibold text-slate-700 mb-2">Tempat, Tanggal Lahir</label><input type="text" name="ttl" required value={formData.ttl || ''} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white" placeholder="Jakarta, 17 Agustus 1990" /></div>
      <div><label className="block text-sm font-semibold text-slate-700 mb-2">Agama & Suku Bangsa</label><input type="text" name="agamaSuku" required value={formData.agamaSuku || ''} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white" placeholder="Islam, Jawa" /></div>
      <div className="col-span-2"><label className="block text-sm font-semibold text-slate-700 mb-2">Alamat Lengkap Domisili</label><textarea name="alamat" required value={formData.alamat || ''} onChange={handleChange} rows="2" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white"></textarea></div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div><label className="block text-sm font-semibold text-slate-700 mb-2">Pendidikan Formal Terakhir (IPK bila lulus)</label><textarea name="pendidikan" required value={formData.pendidikan || ''} onChange={handleChange} rows="2" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white" placeholder="S1 Teknik Informatika Universitas X (IPK 3.80)"></textarea></div>
        <div><label className="block text-sm font-semibold text-slate-700 mb-2">Pengalaman Organisasi Tertinggi / Terbaru</label><textarea name="organisasi" required value={formData.organisasi || ''} onChange={handleChange} rows="2" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white" placeholder="Ketua BEM Univ (2020-2021)"></textarea></div>
    </div>

    <div><label className="block text-sm font-semibold text-slate-700 mb-2">Pengalaman Kerja (Perusahaan, Jabatan, Lama Kerja)</label><textarea name="pengalamanKerja" value={formData.pengalamanKerja || ''} onChange={handleChange} rows="3" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white" placeholder="- PT XYZ (Marketing, 2 Tahun)&#10;- Bebas dikosongkan jika fresh grad"></textarea></div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      <div><label className="block text-sm font-semibold text-slate-700 mb-2">Susunan Keluarga (Anda anak ke- berapa dari berapa)</label><input type="text" name="keluarga" required value={formData.keluarga || ''} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white" placeholder="Anak ke-2 dari 4 bersaudara" /></div>
      <div><label className="block text-sm font-semibold text-slate-700 mb-2">Status Menikah & Tanggungan</label><input type="text" name="statusNikah" required value={formData.statusNikah || ''} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white" placeholder="Menikah, 1 Anak" /></div>
    </div>

    <div><label className="block text-sm font-semibold text-slate-700 mb-2">Riwayat Medis (Sakit Fisik/Psikologis/Kecelakaan Berat)</label><textarea name="riwayatMedis" required value={formData.riwayatMedis || ''} onChange={handleChange} rows="2" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white" placeholder="Pernah tifus tahun 2021. Sisanya tidak ada."></textarea></div>

    {/* Spesifik Rekrutmen: Ekspektasi Gaji & Posisi */}
    {isRecruitment && (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 bg-orange-50 p-4 rounded-xl border border-orange-100">
        <div><label className="block text-sm font-semibold text-slate-700 mb-2">Posisi / Jabatan yang Dilamar</label><input type="text" name="posisiDilamar" required value={formData.posisiDilamar || ''} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-orange-200 bg-white" placeholder="Data Analyst" /></div>
        <div><label className="block text-sm font-semibold text-slate-700 mb-2">Ekspektasi Gaji (Per Bulan)</label><input type="text" name="gajiHarapan" required value={formData.gajiHarapan || ''} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-orange-200 bg-white" placeholder="Rp 5.000.000" /></div>
      </div>
    )}

    {/* Spesifik Grafologi: Tujuan Analisa & Hobi */}
    {!isRecruitment && (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 bg-emerald-50 p-4 rounded-xl border border-emerald-100">
        <div><label className="block text-sm font-semibold text-slate-700 mb-2">Tujuan Analisa (Profil diri/Penempatan)</label><input type="text" name="tujuanAnalisa" required value={formData.tujuanAnalisa || ''} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-emerald-200 bg-white" placeholder="Melihat potensi diri" /></div>
        <div><label className="block text-sm font-semibold text-slate-700 mb-2">Hobi & Kegemaran Khusus</label><input type="text" name="hobi" required value={formData.hobi || ''} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-emerald-200 bg-white" placeholder="Membaca, melukis" /></div>
      </div>
    )}
  </div>
);

// MAPPING KOMPONEN BERDASARKAN INTENT
export default function IdentityFormAaas({ intent, isLoading, onSubmit, initialData = {} }) {
  const [formData, setFormData] = useState(initialData);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="w-full animate-in fade-in duration-500">
      <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">Informasi Profil Peserta</h2>
      <p className="text-slate-500 mb-8">
        Mohon isikan biodata dengan jujur dan lengkap agar analisa laporan lebih akurat. 
        {' '}<span className="font-semibold text-blue-600">Sistem mendeteksi jalur tes {intent || 'UMUM'}.</span>
      </p>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 md:p-8 rounded-3xl shadow-xl border border-slate-100">
        {/* Base Profil (Selalu ada) */}
        <BaseFields formData={formData} handleChange={handleChange} />

        {/* Dynamic Branching berdasarkan Intent Data dari Package */}
        {intent === 'ACADEMIC' && <AcademicFields formData={formData} handleChange={handleChange} />}
        {intent === 'RECRUITMENT' && <ComprehensiveRHFields formData={formData} handleChange={handleChange} isRecruitment={true} />}
        {intent === 'GRAPHOLOGY' && <ComprehensiveRHFields formData={formData} handleChange={handleChange} isRecruitment={false} />}
        
        {/* Jika GENERAL / INTERNAL, tampilkan BaseFields saja, tidak perlu render form tambahan kompleks. */}

        <div className="pt-8">
            <button 
                type="submit"
                disabled={isLoading}
                className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-4 px-12 rounded-2xl text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
            >
                {isLoading ? "Menyimpan Data..." : "Lanjut ke Tahap Asesmen"}
            </button>
        </div>
      </form>
    </div>
  );
}
