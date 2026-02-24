import Image from 'next/image';

export default function Landing({ onStart }) {
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

        <button 
          onClick={onStart}
          className="bg-gradient-to-r from-orange-500 to-teal-600 hover:from-orange-600 hover:to-teal-700 text-white font-semibold py-4 px-12 rounded-full text-lg shadow-xl shadow-orange-500/20 hover:shadow-orange-500/30 hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto"
        >
          Mulai Asesmen
        </button>
        
        <p className="text-[11px] text-slate-400 mt-6">
          ⏱ Dibutuhkan waktu sekitar 10–15 menit untuk menyelesaikan seluruh tes.
        </p>
      </div>
    </div>
  );
}
