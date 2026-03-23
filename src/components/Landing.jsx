import Image from 'next/image';
import Link from 'next/link';

export default function Landing({ onStart, onPremium }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] text-center px-4 animate-in fade-in duration-700">
      {/* Hero Card */}
      <div className="bg-white/90 backdrop-blur-xl p-10 md:p-14 rounded-3xl shadow-2xl border border-slate-100 max-w-3xl w-full relative overflow-hidden">
        {/* Decorative Gradient Orb */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-orange-200/40 to-teal-200/40 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-gradient-to-tr from-teal-200/30 to-blue-200/30 rounded-full blur-3xl pointer-events-none"></div>

        {/* Logo */}
        <div className="relative mb-8 flex justify-center">
          <Image 
            src="/logo.png" 
            alt="Lentera Batin" 
            width={280} 
            height={80} 
            priority
            className="h-auto"
          />
        </div>

        <p className="text-xs text-teal-600 font-semibold uppercase tracking-[0.25em] mb-4">
          Lembaga Konseling & Psikoterapi Islam
        </p>

        <div className="w-12 h-px bg-gradient-to-r from-orange-400 to-teal-500 mx-auto mb-6"></div>

        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-4 tracking-tight leading-tight">
          Asesmen Pemetaan <br />
          <span className="bg-gradient-to-r from-orange-500 to-teal-600 bg-clip-text text-transparent">Psikologis</span>
        </h1>
        
        <p className="text-slate-500 text-base mb-10 leading-relaxed max-w-xl mx-auto">
          Selamat datang di platform asesmen kepribadian terintegrasi Lentera Batin.
          Tes ini dirancang untuk membantu Anda memahami diri sendiri lebih baik dengan memetakan profil gaya kerja dan karakter Anda secara mendalam.
        </p>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 text-left">
          <div className="group bg-gradient-to-br from-slate-50 to-slate-100/50 p-5 rounded-2xl border border-slate-200/80 hover:border-orange-300/50 hover:shadow-md transition-all duration-300">
            <div className="bg-gradient-to-br from-orange-400 to-orange-500 text-white rounded-full w-9 h-9 flex items-center justify-center font-bold text-sm shrink-0 shadow-md shadow-orange-500/20 mb-3">1</div>
            <h3 className="font-semibold text-slate-800 text-sm">Identitas</h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">Data diri singkat (Nama, Email, Usia, Instansi)</p>
          </div>
          <div className="group bg-gradient-to-br from-slate-50 to-slate-100/50 p-5 rounded-2xl border border-slate-200/80 hover:border-teal-300/50 hover:shadow-md transition-all duration-300">
            <div className="bg-gradient-to-br from-teal-500 to-teal-600 text-white rounded-full w-9 h-9 flex items-center justify-center font-bold text-sm shrink-0 shadow-md shadow-teal-500/20 mb-3">2</div>
            <h3 className="font-semibold text-slate-800 text-sm">Profil Gaya Kerja</h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">24 Pertanyaan pilihan (Paling sesuai & Paling tidak sesuai)</p>
          </div>
          <div className="group bg-gradient-to-br from-slate-50 to-slate-100/50 p-5 rounded-2xl border border-slate-200/80 hover:border-blue-300/50 hover:shadow-md transition-all duration-300">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-full w-9 h-9 flex items-center justify-center font-bold text-sm shrink-0 shadow-md shadow-blue-500/20 mb-3">3</div>
            <h3 className="font-semibold text-slate-800 text-sm">Profil Karakter</h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">100 Pertanyaan berskala (Sangat Tidak Setuju - Sangat Setuju)</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onStart}
            className="bg-gradient-to-r from-orange-500 to-teal-600 hover:from-orange-600 hover:to-teal-700 text-white font-semibold py-4 px-10 rounded-full text-lg shadow-xl shadow-orange-500/20 hover:shadow-orange-500/30 hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto"
          >
            Mulai Asesmen Gratis
          </button>

          <button
            onClick={onPremium}
            className="group flex items-center justify-center gap-2 bg-white border-2 border-slate-200 hover:border-blue-500 text-slate-700 hover:text-blue-600 font-semibold py-4 px-10 rounded-full text-lg transition-all duration-300 w-full sm:w-auto"
          >
            <span className="relative">
              Eksplor Paket Premium
              <span className="absolute -top-4 -right-6 bg-blue-500 text-white text-[10px] px-1.5 py-0.5 rounded-full animate-pulse">NEW</span>
            </span>
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
        
        <p className="text-[11px] text-slate-400 mt-6">
          ⏱ Dibutuhkan waktu sekitar 10–15 menit untuk menyelesaikan seluruh tes.
        </p>
      </div>

      {/* Contact/Soft Selling Section for Landing Page */}
      <div className="mt-8 relative z-10 w-full max-w-3xl">
        <div className="bg-white/80 backdrop-blur-md border border-slate-200/60 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <h4 className="font-bold text-slate-800 text-sm mb-1">Butuh bantuan atau ingin konsultasi pribadi?</h4>
            <p className="text-xs text-slate-500">Hubungi tim Lentera Batin untuk informasi lebih lanjut mengenai layanan kami.</p>
          </div>
          <a 
            href="https://wa.me/6285117778798?text=Halo%20Lentera%20Batin,%20saya%20ingin%20bertanya%20seputar%20layanan%20konseling/asesmen."
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebd5b] text-white font-semibold py-2.5 px-5 rounded-xl text-sm transition-all shadow-sm shadow-[#25D366]/20"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
            Hubungi CS
          </a>
        </div>
      </div>
    </div>
  );
}
