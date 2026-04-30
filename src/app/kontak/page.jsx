'use client';

import { useState } from 'react';

export default function KontakPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulasi pengiriman
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1500);
  };

  const contactInfos = [
    { label: 'E-mail', value: 'halo@lenterabatin.com', icon: '✉️' },
    { label: 'WhatsApp', value: '+62 851 1777 8798', icon: '💬' },
    { label: 'Lokasi', value: 'Jalan Potre Koneng II/31 Bumi Sumekar Asri Kolor Sumenep, Jawa Timur 69417', icon: '📍' }
  ];

  return (
    <div className="pt-24 pb-16 bg-white min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-800 mb-6 tracking-tight">
            Mari <span className="text-orange-500">Berdiskusi</span>
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Punya pertanyaan mengenai layanan kami atau ingin bekerjasama?
            Kami siap mendengar setiap cerita Anda.
          </p>
        </div>
      </section>

      <section className="py-24 max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Contact Info */}
          <div className="lg:col-span-5 space-y-12">
            <div>
              <h2 className="text-3xl font-bold text-slate-800 mb-8 border-l-4 border-orange-500 pl-6">Hubungi Kami</h2>
              <div className="space-y-8">
                {contactInfos.map((info, idx) => (
                  <div key={idx} className="flex gap-6 group">
                     <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-2xl group-hover:border-orange-500 transition-all transition-colors">
                        {info.icon}
                     </div>
                     <div>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{info.label}</div>
                        <div className="text-lg font-bold text-slate-800">{info.value}</div>
                     </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-10 bg-slate-900 rounded-[2.5rem] text-white relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl" />
               <h3 className="text-xl font-bold mb-4">Jam Layanan</h3>
               <p className="text-slate-400 text-sm leading-relaxed mb-8 font-medium">
                  Tim kami aktif menjawab pesan Anda pada:
               </p>
               <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm font-bold border-b border-white/5 pb-2">
                     <span>Senin - Jumat</span>
                     <span>09:00 - 17:00</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-bold border-b border-white/5 pb-2">
                     <span>Sabtu</span>
                     <span>10:00 - 15:00</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-bold text-orange-400 pt-2">
                     <span>Minggu</span>
                     <span>Tutup (Refleksi Mingguan)</span>
                  </div>
               </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7">
            {submitted ? (
              <div className="bg-emerald-50 border border-emerald-100 p-12 rounded-[3.5rem] text-center animate-in zoom-in duration-500">
                <div className="text-7xl mb-8">✨</div>
                <h2 className="text-3xl font-bold text-emerald-900 mb-4 tracking-tight">Pesan Terkirim!</h2>
                <p className="text-emerald-700 max-w-sm mx-auto leading-relaxed mb-10 font-medium">
                   Terima kasih telah menghubungi Lentera Batin. Tim kami akan segera menanggapi Anda dalam kurun waktu 24 jam.
                </p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="px-10 py-4 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-500/20 active:scale-95"
                >
                  Kirim Pesan Lain &rarr;
                </button>
              </div>
            ) : (
              <div className="bg-white p-10 md:p-14 rounded-[3.5rem] border border-slate-200 shadow-xl shadow-slate-200/50">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-500 ml-1">Nama Lengkap</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all font-medium"
                        placeholder="Masukkan nama lengkap Anda"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-500 ml-1">Email Aktif</label>
                      <input 
                        type="email" 
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all font-medium"
                        placeholder="Alamat email aktif"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-500 ml-1">Hal yang Ditanyakan</label>
                    <select 
                      className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all font-bold appearance-none"
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    >
                      <option value="">Pilih topik diskusi</option>
                      <option value="layanan">Tanya Seputar Layanan</option>
                      <option value="b2b">Kerjasama Perusahaan/Lembaga</option>
                      <option value="grafologi">Analisis Grafologi Khusus</option>
                      <option value="lainnya">Hal Lainnya</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-500 ml-1">Pesanmu</label>
                    <textarea 
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all font-medium resize-none"
                      placeholder="Apa yang bisa kami bantu hari ini?"
                    />
                  </div>
                  <button 
                    disabled={isSubmitting}
                    type="submit" 
                    className="w-full py-5 bg-orange-500 text-white font-bold rounded-2xl hover:bg-orange-600 transition-all shadow-xl shadow-orange-500/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                        Sedang Mengirim...
                      </>
                    ) : (
                      'Kirim Pesanmu Sekarang'
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
