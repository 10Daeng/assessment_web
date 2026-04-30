import Link from 'next/link';

export default function LayananPage() {
  const layouts = [
    {
      title: 'Self Insight Session',
      desc: 'Pahami gaya komunikasimu, cara kerjamu, dan strategi untuk tumbuh lebih baik dalam keseharian.',
      icon: '🧠',
      accent: 'blue',
      href: '/premium/direct?pkg=pkg-psiko-basic'
    },
    {
      title: 'Inner Growth Program',
      desc: 'Pemetaan karakter multidimensi yang mendalam. Cocok untuk Anda yang sedang menata ulang hidup atau mencari arah karier yang tepat.',
      icon: '🌱',
      accent: 'indigo',
      badge: 'TERPOPULER',
      href: '/premium/direct?pkg=pkg-psiko-comprehensive'
    },
    {
      title: 'Analisis Tulisan Tangan',
      desc: 'Wawasan unik dari goresan pena Anda. Menggunakan kaidah grafologi ilmiah untuk memotret karakter yang sulit terlihat oleh tes biasa.',
      icon: '🖊️',
      accent: 'emerald',
      href: '/premium/direct?pkg=pkg-grafologi-brief'
    }
  ];

  return (
    <div className="pt-24 pb-16 bg-white min-h-screen">
      {/* Header Section */}
      <section className="py-20 bg-slate-900 border-b border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(14,165,233,0.1),transparent)]" />
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6">
            Layanan <span className="bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">Lentera Batin</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Pilih cara yang paling sesuai untuk membantu Anda memahami diri dan menata langkah ke depan.
          </p>
        </div>
      </section>

      {/* Main Services Grid */}
      <section className="py-24 max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {layouts.map((item, idx) => (
            <div key={idx} className="group relative bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-2xl hover:border-slate-300 transition-all">
              {item.badge && (
                <div className="absolute -top-3 right-6 px-4 py-1.5 bg-orange-500 text-white text-xs font-bold rounded-full shadow-lg">
                  {item.badge}
                </div>
              )}
              <div className="text-5xl mb-6">{item.icon}</div>
              <h3 className="text-2xl font-bold text-slate-800 mb-4">{item.title}</h3>
              <p className="text-slate-600 mb-8 leading-relaxed h-24">{item.desc}</p>
              <div className="mt-auto pt-6 border-t border-slate-100">
                <Link
                  href={item.href}
                  className="w-full block px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-all active:scale-95 text-center"
                >
                  Lihat Semua Paket
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Corporate Services (B2B) */}
        <div className="bg-slate-900 rounded-[3rem] p-10 md:p-16 border border-white/10 relative overflow-hidden">
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px] -z-0" />
          <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
            <div>
              <span className="inline-block px-4 py-1.5 bg-indigo-500/20 text-indigo-300 text-xs font-bold rounded-full mb-6 tracking-widest uppercase">
                KERJASAMA LELEMBAGA
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Layanan Untuk Institusi & Perusahaan</h2>
              <p className="text-slate-400 text-lg leading-relaxed mb-8">
                Kami menyediakan solusi rekrutmen berbasis karakter, pemetaan potensi tim, 
                hingga program pengembangan SDM yang terarah berdasarkan data refleksi batin.
              </p>
              <ul className="space-y-4 mb-10">
                {['Pemetaan Potensi Karyawan', 'Laporan Kecocokan Jabatan', 'Voucher Bulk untuk Sekolah', 'In-House Training Karakter'].map((feat, i) => (
                  <li key={i} className="flex items-center gap-3 text-white font-medium">
                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-xs">✓</div>
                    {feat}
                  </li>
                ))}
              </ul>
              <Link 
                href="/kontak" 
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-900 font-bold rounded-2xl hover:bg-slate-100 transition-all shadow-xl active:scale-95"
              >
                Konsultasikan Kebutuhan Tim &rarr;
              </Link>
            </div>
            <div className="relative group perspective-1000 hidden md:block">
               <div className="w-full aspect-square rounded-3xl bg-gradient-to-br from-slate-800 to-slate-950 border border-white/10 flex items-center justify-center text-9xl shadow-2xl group-hover:rotate-y-12 transition-all duration-700">
                  🏢
               </div>
            </div>
          </div>
        </div>
      </section>

       {/* How It Works */}
       <section className="py-24 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Langkah Menuju Pemulihan</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">Proses yang sederhana namun berdampak mendalam bagi masa depan Anda.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-12 text-center relative">
            <div className="hidden md:block absolute top-10 left-[calc(33%-60px)] right-[calc(33%-60px)] h-0.5 bg-slate-200 -z-0" />
            
            {[
              { step: '01', name: 'Pilih & Daftar', desc: 'Pilih paket yang sesuai kebutuhan Anda dan lengkapi data diri dasar.' },
              { step: '02', name: 'Refleksi Terstruktur', desc: 'Lakukan proses asesmen atau pengiriman sampel tulisan tangan secara mandiri.' },
              { step: '03', name: 'Insight Dashboard', desc: 'Dapatkan laporan wawasan yang mendalam di dashboard personal Anda.' }
            ].map((s, idx) => (
              <div key={idx} className="relative z-10 px-6">
                <div className="w-20 h-20 rounded-3xl bg-white border border-slate-200 shadow-xl mx-auto mb-8 flex items-center justify-center text-2xl font-black text-slate-800 ring-8 ring-slate-50">
                  {s.step}
                </div>
                <h4 className="text-xl font-bold text-slate-800 mb-3">{s.name}</h4>
                <p className="text-slate-500 leading-relaxed text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
