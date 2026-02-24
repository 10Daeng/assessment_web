import { useState } from 'react';

export default function PersonalInfo({ onSubmit }) {
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    usia: '',
    instansi: '',
    pekerjaan: '',
    jabatan: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 animate-in slide-in-from-right-8 duration-500">
      <div className="bg-white/90 backdrop-blur-xl p-8 md:p-12 rounded-3xl shadow-2xl border border-white/50 max-w-lg w-full">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Bagian 1: Identitas</h2>
        <p className="text-slate-500 mb-8">Silakan lengkapi data diri Anda sebelum memulai asesmen.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2" htmlFor="nama">Nama Lengkap</label>
            <input 
              type="text" 
              name="nama" 
              id="nama"
              required 
              value={formData.nama}
              onChange={handleChange}
              placeholder="e.g. John Doe"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-slate-50 focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2" htmlFor="email">Email</label>
              <input 
                type="text" 
                name="email" 
                id="email"
                required 
                value={formData.email}
                onChange={handleChange}
                placeholder="e.g. user@example.com"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-slate-50 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2" htmlFor="usia">Usia</label>
              <input 
                type="number" 
                name="usia" 
                id="usia"
                min="10" max="100"
                value={formData.usia}
                onChange={handleChange}
                placeholder="e.g. 25"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-slate-50 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2" htmlFor="instansi">Asal Instansi</label>
            <input 
              type="text" 
              name="instansi" 
              id="instansi"
              value={formData.instansi}
              onChange={handleChange}
              placeholder="e.g. PT Lentera Batin Indonesia"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-slate-50 focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2" htmlFor="pekerjaan">Pekerjaan</label>
              <input 
                type="text" 
                name="pekerjaan" 
                id="pekerjaan"
                value={formData.pekerjaan}
                onChange={handleChange}
                placeholder="e.g. Konselor"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-slate-50 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2" htmlFor="jabatan">Jabatan</label>
              <input 
                type="text" 
                name="jabatan" 
                id="jabatan"
                value={formData.jabatan}
                onChange={handleChange}
                placeholder="e.g. Manager"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-slate-50 focus:bg-white"
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3.5 px-8 rounded-xl text-lg shadow-md hover:shadow-lg transition-all pt-4 mt-8"
          >
            Lanjutkan ke Bagian 2
          </button>
        </form>
      </div>
    </div>
  );
}
