import Link from 'next/link';

export default function ArtikelPage() {
  const articles = [
    {
      id: 1,
      slug: 'mengenal-tanda-kelelahan-mental',
      title: 'Mengenal Tanda Kelelahan Mental Sebelum Menjadi Burnout',
      category: 'Self Development',
      excerpt: 'Banyak dari kita yang tidak menyadari bahwa kita sedang berada di ambang kelelahan. Bagaimana cara mendeteksinya?',
      date: '24 Maret 2026',
      readTime: '5 menit',
      image: '🧘'
    },
    {
      id: 2,
      slug: 'apa-yang-tulisan-tangan-ungkapkan',
      title: 'Apa yang Tulisan Tangan Ungkapkan tentang Strategi Kerjamu?',
      category: 'Grafologi',
      excerpt: 'Setiap goresan pena memiliki makna. Pelajari bagaimana kemiringan tulisan mengungkap cara Anda mengambil keputusan.',
      date: '18 Maret 2026',
      readTime: '8 menit',
      image: '✍️'
    },
    {
      id: 3,
      slug: 'menata-hubungan-dengan-diri-sendiri',
      title: 'Menata Hubungan dengan Diri Sendiri Melalui Refleksi Harian',
      category: 'Mental Health',
      excerpt: 'Memahami diri sendiri adalah langkah pertama menuju kedamaian batin. Mulailah dengan 5 pertanyaan harian ini.',
      date: '10 Maret 2026',
      readTime: '6 menit',
      image: '🪞'
    }
  ];

  return (
    <div className="pt-24 pb-16 bg-slate-50 min-h-screen">
       {/* Header Section */}
       <section className="py-20 bg-slate-100 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 mb-6 tracking-tight">
            Wawasan & <span className="bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">Catatan Batin</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Beragam perspektif dan panduan praktis untuk membantu Anda bertumbuh sebagai pribadi yang utuh.
          </p>
        </div>
      </section>

      {/* Categories Bar */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-wrap items-center justify-center gap-4">
          {['Semua', 'Self Development', 'Grafologi', 'Mental Health', 'Kisah Inspiratif'].map((cat, i) => (
            <button key={i} className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${i === 0 ? 'bg-orange-500 text-white' : 'bg-white text-slate-500 border border-slate-200 hover:border-orange-500'}`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      <section className="py-12 max-w-7xl mx-auto px-4">
        {/* Latest Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((art) => (
            <Link key={art.id} href={`/artikel/${art.slug}`} className="group bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer block">
              <div className="aspect-[16/10] bg-slate-100 flex items-center justify-center text-7xl group-hover:scale-105 transition-transform duration-500">
                {art.image}
              </div>
              <div className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-orange-600 px-3 py-1 bg-orange-50 rounded-full uppercase tracking-widest">{art.category}</span>
                  <span className="text-xs text-slate-400 font-medium">{art.date}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-4 group-hover:text-orange-600 transition-colors leading-snug">
                  {art.title}
                </h3>
                <p className="text-slate-500 text-sm mb-6 leading-relaxed line-clamp-3">
                  {art.excerpt}
                </p>
                <div className="pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-widest">
                  <span>{art.readTime} Baca</span>
                  <span className="text-orange-500">Baca Selengkapnya &rarr;</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State / Newsletter */}
        <div className="mt-24 p-10 md:p-16 bg-white rounded-[3rem] border border-slate-200 shadow-sm text-center">
          <div className="max-w-2xl mx-auto">
             <div className="text-4xl mb-6">📬</div>
             <h2 className="text-3xl font-bold text-slate-800 mb-4 tracking-tight">Wawasan Langsung ke Email-mu</h2>
             <p className="text-slate-500 mb-10 leading-relaxed">
                Dapatkan artikel kurasi mingguan tentang pengembangan diri, grafologi, dan kesehatan mental pilihan Analis kami.
             </p>
             <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
               <input 
                 type="email" 
                 placeholder="Alamat email aktif" 
                 className="flex-1 px-6 py-4 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all font-medium"
               />
               <button className="px-8 py-4 bg-orange-500 text-white font-bold rounded-2xl hover:bg-orange-600 transition-all shadow-xl shadow-orange-500/20 active:scale-95">
                 Berlangganan
               </button>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
}
