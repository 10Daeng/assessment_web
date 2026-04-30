import Link from 'next/link';

export default function TentangPage() {
  return (
    <div className="pt-24 pb-16">
      {/* Hero Section */}
      <section className="relative py-20 bg-slate-900 border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(249,115,22,0.1),transparent)]" />
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6">
            Mengenal <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">Lentera Batin</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Menjadi jembatan bagi Anda untuk memahami diri sendiri lebih dalam, 
            menata emosi yang terserak, dan menemukan arah hidup yang lebih bermutu.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="prose prose-slate prose-lg max-w-none">
            <h2 className="text-3xl font-bold text-slate-800 mb-8 border-l-4 border-orange-500 pl-6">
              Mengapa Kami Ada?
            </h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              Lentera Batin lahir dari sebuah kegelisahan: banyak individu yang merasa "lelah" dan "kosong" 
              namun kesulitan menemukan tempat yang tepat untuk bercerita tanpa penghakiman. Kami percaya bahwa 
              setiap manusia memiliki potensi untuk tumbuh, asalkan mereka memiliki "peta" yang jelas tentang 
              siapa diri mereka sebenarnya.
            </p>
            <p className="text-slate-600 leading-relaxed mb-6">
              Kami bukan sekadar platform tes kepribadian. Kami adalah ruang untuk refleksi. Dengan menggabungkan 
              metodologi terstruktur dan kearifan personal, kami membantu Anda melihat apa yang selama ini tersembunyi 
              di balik pola pikir dan perilaku sehari-hari.
            </p>

            <div className="my-16 bg-slate-50 rounded-3xl p-8 md:p-12 border border-slate-100 flex flex-col md:flex-row gap-8 items-center">
              <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-5xl flex-shrink-0 shadow-xl shadow-orange-500/20">
                🖊️
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-800 mb-4">Otoritas Berbasis Grafologi</h3>
                <p className="text-slate-600 leading-relaxed">
                  Lentera Batin dipandu oleh analis grafologi yang bersertifikasi internasional (**KAROHS International 
                  School of Handwriting Analysis, USA**). Analisis tulisan tangan menjadi salah satu pilar unik kami 
                  dalam memotret karakter manusia secara objektif dan mendalam.
                </p>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-slate-800 mb-8 border-l-4 border-orange-500 pl-6">
              Nilai yang Kami Pegang
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="text-3xl mb-4">🤝</div>
                <h4 className="font-bold text-slate-800 mb-2">Empati Tanpa Batas</h4>
                <p className="text-sm text-slate-600">Kami mendampingi Anda sebagai sahabat perjalanan, bukan sebagai hakim atas hidup Anda.</p>
              </div>
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="text-3xl mb-4">⚖️</div>
                <h4 className="font-bold text-slate-800 mb-2">Etika & Privasi</h4>
                <p className="text-sm text-slate-600">Keamanan data dan kerahasiaan proses adalah prioritas utama kami dalam setiap sesi.</p>
              </div>
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="text-3xl mb-4">🔬</div>
                <h4 className="font-bold text-slate-800 mb-2">Berbasis Data</h4>
                <p className="text-sm text-slate-600">Setiap wawasan yang kami berikan didasarkan pada metodologi refleksi batin yang disiplin.</p>
              </div>
            </div>

            <div className="text-center mt-20">
              <Link 
                href="/layanan" 
                className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all shadow-xl active:scale-95"
              >
                Lihat Bagaimana Kami Membantumu &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Disclaimer */}
      <footer className="py-12 bg-slate-50 border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-slate-400 text-sm max-w-2xl mx-auto leading-relaxed">
            Lentera Batin adalah lembaga pengembangan diri dan pendampingan batin. 
            Layanan kami dirancang untuk membantu pemahaman diri dan pertumbuhan personal. 
            Kami bukan penyedia layanan kesehatan mental klinis dan tidak melayani diagnosa medis.
          </p>
        </div>
      </footer>
    </div>
  );
}
