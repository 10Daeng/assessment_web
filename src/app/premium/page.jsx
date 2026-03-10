export default function PremiumHubPage() {
  return (
    <main className="min-h-screen bg-slate-50 font-sans p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-sm border border-slate-100 p-10 mt-10 text-center animate-in fade-in zoom-in duration-500">
        <h1 className="text-4xl font-extrabold text-slate-800 mb-6 bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
          Premium Assessment Hub
        </h1>
        <p className="text-slate-500 mb-12 max-w-2xl mx-auto leading-relaxed text-lg">
          Platform asesmen mendalam untuk pemetaan diri, seleksi kandidat, dan pengembangan karier berbasis kecerdasan komprehensif.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Opsi 1: Saya Tahu Tes */}
          <div className="group bg-slate-50 hover:bg-teal-50/50 p-8 rounded-2xl border border-slate-200 hover:border-teal-300 transition-all duration-300 cursor-pointer text-left">
            <div className="w-14 h-14 bg-teal-100 text-teal-600 rounded-xl flex items-center justify-center mb-6 shadow-inner">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-teal-700">Saya Tahu Paket Asesmennya</h2>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">
              Langsung pilih paket tes (Basic, Reguler, Premium) atau gunakan <strong>Kode Voucher</strong> dari perusahaan Anda untuk memulai.
            </p>
            <a href="/premium/direct" className="inline-block text-sm font-semibold text-teal-600 group-hover:underline">
              Beli / Input Voucher &rarr;
            </a>
          </div>

          {/* Opsi 2: Wizard / Rekomendasi */}
          <div className="group bg-slate-50 hover:bg-blue-50/50 p-8 rounded-2xl border border-slate-200 hover:border-blue-300 transition-all duration-300 cursor-pointer text-left">
            <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6 shadow-inner">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-blue-700">Bantu Saya Memilih</h2>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">
              Jawab beberapa pertanyaan singkat mengenai kebutuhan Anda (Rekrutmen atau Personal), dan kami akan merekomendasikan Paket yang paling tepat.
            </p>
            <a href="/premium/wizard" className="inline-block text-sm font-semibold text-blue-600 group-hover:underline">
              Mulai Konsultasi Auto &rarr;
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
