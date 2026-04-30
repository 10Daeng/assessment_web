import Link from 'next/link';
import { notFound } from 'next/navigation';

const articles = {
  1: {
    id: 1,
    slug: 'mengenal-tanda-kelelahan-mental',
    title: 'Mengenal Tanda Kelelahan Mental Sebelum Menjadi Burnout',
    category: 'Self Development',
    date: '24 Maret 2026',
    readTime: '5 menit',
    author: 'Tim Lentera Batin',
    image: '🧘',
    content: `
      <h2>Apa Itu Burnout?</h2>
      <p>Burnout bukan sekadar "capek biasa". Ini adalah kondisi kelelahan mental, emosional, dan fisik yang disebabkan oleh stres berlebihan dan berkepanjangan. Berbeda dengan kelelahan normal yang biasanya bisa diatasi dengan istirahat pendek, burnout membuat Anda merasa kosong, putus asa, dan sulit menemukan motivasi untuk melanjutkan.</p>

      <h2>Tanda-Tanda Early Warning</h2>
      <p>Banyak orang tidak menyadari bahwa mereka sedang menuju burnout sampai terlambat. Berikut adalah tanda-tanda awal yang perlu Anda waspadai:</p>

      <ul>
        <li><strong>Kelelahan yang tidak kunjung reda</strong> - Meskipun sudah tidur atau istirahat, Anda tetap merasa lelah.</li>
        <li><strong>Menurunnya empati</strong> - Anda menjadi lebih sinis terhadap orang lain, merasa jengkel hal-hal kecil yang dulu tidak mengganggu.</li>
        <li><strong>Pengeluaran menurun</strong> - Penurunan kinerja kerja atau akademik yang mencolok.</li>
        <li><strong>Sikap negatif berlebihan</strong> - Anda cenderung fokus pada yang salah dan merasa pesimis tentang masa depan.</li>
        <li><strong>Diskoneksi dari hobi</strong> - Kegiatan yang dulu Anda nikmati kini terasa seperti beban.</li>
      </ul>

      <h2>Mencegah Burnout Sebelum Terlambat</h2>
      <p>Pencegahan jauh lebih baik daripada pengobatan. Berikut beberapa strategi yang bisa Anda terapkan:</p>

      <h3>1. Tetapkan Batas yang Jelas</h3>
      <p>Pelajari untuk mengatakan "tidak" pada tanggung jawab tambahan. Ingat: mengambil terlalu banyak pekerjaan bukan tanda dedikasi, tapi tanda tidak punya batas.</p>

      <h3>2. Istirahat Aktif vs Pasif</h3>
      <p>Istirahat pasif (scroll sosmed, nonton Netflix) memberi relaksasi fisik tapi seringkali menambah stres mental. Coba istirahat aktif: jalan kaki, meditasi, atau hobi yang melibatkan tangan dan pikiran.</p>

      <h3>3. Refleksi Harian</h3>
      <p>Luangkan 10-15 menit setiap malam untuk mengevaluasi hari Anda. Apa yang melelahkan? Apa yang memberi energi? Apa yang bisa diperbaiki besok?</p>

      <h2>Kapan Harus Mencari Bantuan?</h2>
      <p>Jika Anda sudah mencoba strategi pencegahan tapi tanda-tanda burnout terus memburuk, mungkin sudah saatnya mencari bantuan profesional. Tanda-tanda yang perlu perhatian:</p>

      <ul>
        <li>Insomnia atau gangguan tidur parah</li>
        <li>Pikiran ingin menyakiti diri sendiri</li>
        <li>Tidak bisa merasakan emosi apa pun</li>
        <li>Keputusan harian terasa sangat berat</li>
      </ul>

      <p>Lentera Batin menyediakan asesmen untuk membantu Anda memahami kondisi batin Anda. Jangan ragu untuk konsultasi dengan profesional jika Anda merasa tidak kuat menghadapinya sendirian.</p>
    `
  },
  2: {
    id: 2,
    slug: 'apa-yang-tulisan-tangan-ungkapkan',
    title: 'Apa yang Tulisan Tangan Ungkapkan tentang Strategi Kerjamu?',
    category: 'Grafologi',
    date: '18 Maret 2026',
    readTime: '8 menit',
    author: 'Tim Lentera Batin',
    image: '✍️',
    content: `
      <h2>Dasar Grafologi: Lebih dari Sekadar Tulisan</h2>
      <p>Grafologi adalah studi ilmiah tentang tulisan tangan yang mengungkapkan karakteristik kepribadian seseorang. Setiap goresan, kemiringan, tekanan, dan spasi memiliki makna psikologis yang dapat dianalisis secara objektif.</p>

      <p>Di Lentera Batin, analis kami bersertifikat internasional dari <strong>KAROHS International School of Handwriting Analysis</strong>, USA. Ini memastikan setiap analisis dilakukan berdasarkan metodologi yang tervalidasi dan terpercaya.</p>

      <h2>Kemiringan Tulisan dan Gaya Pengambilan Keputusan</h2>
      <p>Salah satu aspek paling fundamental dalam grafologi adalah kemiringan tulisan. Ini mengungkapkan bagaimana Anda merespons emosi dan mengambil keputusan.</p>

      <h3>Tulisan Cenderung Kanan (Right Slant)</h3>
      <p>Tulisan yang miring ke kanan seringkali menunjukkan:</p>
      <ul>
        <li>Orientasi yang lebih ekstrovert - Anda cenderung mengekspresikan emosi dengan terbuka</li>
        <li>Responsif terhadap orang lain - Mudah terhubung secara emosional</li>
        <li>Pengambilan keputusan berbasis intuisi - Anda mengandalkan "gut feeling"</li>
      </ul>

      <h3>Tulisan Cenderung Kiri (Left Slant)</h3>
      <p>Tulisan yang miring ke kiri biasanya mengindikasikan:</p>
      <ul>
        <li>Orientasi yang lebih introvert - Anda lebih menahan ekspresi emosi</li>
        <li>Kemandirian emosional - Tidak mudah dipengaruhi oleh orang lain</li>
        <li>Pengambilan keputusan berbasis logika - Anda menganalisis fakta sebelum merespons</li>
      </ul>

      <h3>Tulisan Vertikal (Upright)</h3>
      <p>Tulisan yang lurus ke atas tanpa kemiringan signifikan menunjukkan:</p>
      <ul>
        <li>Keseimbangan emosi - Anda mampu mengontrol ekspresi emosi</li>
        <li>Obyektivitas - Keputusan biasanya diambil berdasarkan fakta</li>
        <li>Fleksibilitas - Dapat beradaptasi dengan situasi yang berbeda</li>
      </ul>

      <h2>Tekanan Tulisan dan Tingkat Energi</h2>
      <p>Tekanan atau berat yang Anda berikan saat menulis juga mengungkapkan banyak tentang tingkat energi dan intensitas Anda.</p>

      <h3>Tekanan Ringan (Light Pressure)</h3>
      <ul>
        <li>Karakter yang halus dan sensitif</li>
        <li>Pendekatan yang diplomatik dalam konflik</li>
        <li>Mungkin mudah lelah secara emosional</li>
      </ul>

      <h3>Tekanan Berat (Heavy Pressure)</h3>
      <ul>
        <li>Karakter yang kuat dan tegas</li>
        <li>Intensitas tinggi dalam pekerjaan dan hubungan</li>
        <li>Tingkat stamina fisik dan mental yang baik</li>
      </ul>

      <h2>Ukuran Huruf dan Persepsi Diri</h2>
      <p>Ukuran huruf yang Anda gunakan secara konsisten juga memberikan wawasan tentang bagaimana Anda memandang diri sendiri dan dunia di sekitar Anda.</p>

      <h3>Huruf Kecil (Small Script)</h3>
      <ul>
        <li>Fokus yang baik dan kemampuan konsentrasi</li>
        <li>Mungkin sedikit introvert atau memilih perhatian yang rendah</li>
        <li>Teliti dalam detail</li>
      </ul>

      <h3>Huruf Besar (Large Script)</h3>
      <ul>
        <li>Kepribadian yang ekstrovert dan menonjol</li>
        <li>Konfidensi diri yang tinggi</li>
        <li>Menyukai perhatian dan pengakuan</li>
      </ul>

      <h2>Analisis Tulisan Tangan untuk Karier</h2>
      <p>Memahami karakteristik tulisan tangan Anda dapat memberikan wawasan berharga untuk pengembangan karier:</p>

      <ul>
        <li><strong>Penentuan role yang tepat</strong> - Apakah Anda lebih cocok dalam peran yang butuh empati, analisis, atau kreatif?</li>
        <li><strong>Pengembangan skill spesifik</strong> - Apa yang perlu dikuatkan untuk menjadi pemimpin yang lebih baik?</li>
        <li><strong>Kecocokan dengan tim</strong> - Apa tipe orang yang akan memberikan sinergi terbaik dengan Anda?</li>
      </ul>

      <p>Di Lentera Batin, kami menggabungkan analisis grafologi dengan asesmen kepribadian multidimensi untuk memberikan wawasan yang komprehensif tentang potensi Anda.</p>
    `
  },
  3: {
    id: 3,
    slug: 'menata-hubungan-dengan-diri-sendiri',
    title: 'Menata Hubungan dengan Diri Sendiri Melalui Refleksi Harian',
    category: 'Mental Health',
    date: '10 Maret 2026',
    readTime: '6 menit',
    author: 'Tim Lentera Batin',
    image: '🪞',
    content: `
      <h2>Mengapa Hubungan dengan Diri Sendiri Penting?</h2>
      <p>Banyak dari kita menghabiskan waktu berjam-jam merapikan hubungan dengan orang lain - pasangan, keluarga, teman, rekan kerja. Tapi berapa banyak yang benar-benar meluangkan waktu untuk membangun hubungan yang sehat dengan diri sendiri?</p>

      <p>Hubungan dengan diri sendiri adalah pondasi dari semua hubungan lain. Jika Anda tidak mengerti, menerima, dan mencintai diri sendiri, bagaimana mungkin Anda bisa melakukan hal yang sama untuk orang lain?</p>

      <h2>Tanda Hubungan dengan Diri yang Tidak Sehat</h2>
      <p>Sebelum kita perbaiki, mari kenali tanda-tanda bahwa hubungan Anda dengan diri sendiri mungkin perlu perhatian:</p>

      <ul>
        <li><strong>Kritik internal yang konstan</strong> - Suara dalam kepala Anda selalu mengkritik apa yang Anda lakukan.</li>
        <li><strong>Mengabaikan kebutuhan sendiri</strong> - Anda selalu menomorsatukan orang lain sampai mengorbankan diri sendiri.</li>
        <li><strong>Self-sabotage</strong> - Anda sengaja menunda atau menghancurkan peluang sukses Anda sendiri.</li>
        <li><strong>Ketidakamanan dalam sendirian</strong> - Anda tidak bisa menikmati waktu sendirian tanpa merasa cemas.</li>
      </ul>

      <h2>5 Pertanyaan Refleksi Harian</h2>
      <p>Memperbaiki hubungan dengan diri sendiri dimulai dengan kesadaran. Luangkan 5-10 menit setiap malam untuk menjawab 5 pertanyaan ini dengan jujur:</p>

      <h3>1. Apa yang Saya Rasa Hari Ini?</h3>
      <p>Tanyakan pada diri sendiri: "Apa emosi yang paling dominan yang saya rasakan hari ini?" Jangan menghakim emosi - hanya mengenalinya. Emosi adalah data, bukan musuh.</p>

      <h3>2. Apa yang Saya Lakukan dengan Baik Hari Ini?</h3>
      <p>Fokus pada pencapaian kecil, bukan hanya target besar. Mengucapkan terima kasih pada diri sendiri untuk hal-hal kecil adalah cara membangun self-compassion.</p>

      <h3>3. Apa yang Menguras Energi Saya Hari Ini?</h3>
      <p>Identifikasi orang, situasi, atau aktivitas yang membuat Anda lelah. Ini membantu Anda mengenali trigger stress dan mengatur batas lebih baik.</p>

      <h3>4. Apa yang Memberi Saya Energi Hari Ini?</h3>
      <p>Balas dengan yang memberi Anda energi. Apakah itu minum kopi di pagi hari? Mengobrol dengan teman? Menyelesaikan tugas? Kenali sumber energimu.</p>

      <h3>5. Apa yang Saya Bisa Perbaiki Besok?</h3>
      <p>Pilih satu hal kecil untuk diperbaiki. Jangan terlalu berambisi. Fokus pada perbaikan kecil yang realistis akan membangun kebiasaan positif seiring waktu.</p>

      <h2>Membangun Kebiasaan Refleksi</h2>
      <p>Mulai dengan kecil. Jangan berharap refleksi 30 menit setiap hari akan bertahan. Mulai dengan 5 menit, lalu perlahan naikkan ke 10, lalu 15.</p>

      <h3>Tips Membuat Kebiasaan Baru:</h3>
      <ul>
        <li><strong>Stacking habits</strong> - Kaitkan refleksi dengan kebiasaan yang sudah ada, seperti setelah menyikat gigi atau sebelum tidur.</li>
        <li><strong>Persiapkan lingkungan</strong> - Buat jurnal refleksi siap pakai di meja kerja atau di samping tempat tidur.</li>
        <li><strong>Fleksibel, tidak kaku</strong> - Jika Anda melewatkan satu hari, jangan menghakim diri sendiri. Mulai lagi besok.</li>
      </ul>

      <h2>Self-Compassion: Lebih Penting dari Self-Improvement</h2>
      <p>Banyak fokus terlalu banyak pada "mengimprove" diri sendiri sampai lupa bahwa menerima diri sendiri adalah langkah pertama menuju perbaikan yang sehat.</p>

      <p>Self-compassion bukan berarti menerima kekurangan dan tidak mau berubah. Ini berarti memahami bahwa Anda manusia - tidak sempurna, tapi layak dicintai dan dihargai.</p>

      <h2>Kapan Waktunya Mencari Bantuan Profesional?</h2>
      <p>Jika hubungan dengan diri sendiri sudah sangat terganggu sampai mempengaruhi kualitas hidup harian Anda, mungkin sudah saatnya mencari bantuan:</p>

      <ul>
        <li>Pikiran negatif yang konstan dan menghancurkan</li>
        <li>Tidak bisa menikmati aktivitas yang dulu Anda nikmati</li>
        <li>Isolasi diri dari orang lain</li>
        <li>Gejala fisik seperti insomnia atau perubahan nafsu makan</li>
      </ul>

      <p>Lentera Batin menyediakan asesmen untuk membantu Anda memahami kondisi batin Anda. Terkadang, hanya butuh sedikit bantuan untuk menemukan jalan keluar.</p>
    `
  }
};

export default function ArtikelDetail({ params }) {
  const article = Object.values(articles).find(a => a.slug === params.slug);

  if (!article) {
    notFound();
  }

  return (
    <div className="pt-24 pb-16 bg-white min-h-screen">
      {/* Header */}
      <section className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-xs font-bold text-orange-600 px-3 py-1 bg-orange-50 rounded-full uppercase tracking-widest">
              {article.category}
            </span>
            <span className="text-xs text-slate-400 font-medium">
              {article.date}
            </span>
            <span className="text-xs text-slate-400 font-medium">
              • {article.readTime} Baca
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-8 leading-tight">
            {article.title}
          </h1>

          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-xl">
              👤
            </div>
            <div>
              <div className="text-sm font-bold text-slate-800">{article.author}</div>
              <div className="text-xs text-slate-500">Penulis Lentera Batin</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <article className="py-16 max-w-4xl mx-auto px-4">
        <div className="prose prose-lg prose-slate prose-headings:font-bold prose-headings:text-slate-900 prose-p:text-slate-700 prose-p:leading-relaxed prose-p:mb-6 prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:border-l-4 prose-h2:border-orange-500 prose-h2:pl-6 prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4 prose-h3:text-slate-900 prose-ul:space-y-3 prose-li:text-slate-700 prose-li:leading-relaxed prose-li:marker:text-orange-500 max-w-none">
          <div dangerouslySetInnerHTML={{ __html: article.content }} />
        </div>

        {/* Author Bio */}
        <div className="mt-16 p-8 bg-slate-50 rounded-3xl border border-slate-200">
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center text-3xl flex-shrink-0">
              👤
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">{article.author}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Tim Lentera Batin terdiri dari analis grafologi bersertifikat dan konsultan pengembangan diri
                yang berdedikasi membantu individu memahami diri sendiri dan menata langkah ke depan.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 p-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-3xl text-white text-center">
          <div className="text-6xl mb-6">✨</div>
          <h2 className="text-3xl font-extrabold mb-4">Wawasan Lebih Mendalam?</h2>
          <p className="text-white/90 text-lg mb-8 max-w-xl mx-auto leading-relaxed">
            Dapatkan pemetaan karakter komprehensif melalui asesmen Lentera Batin.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/layanan"
              className="px-8 py-4 bg-white text-slate-900 font-bold rounded-2xl hover:bg-slate-100 transition-all shadow-xl active:scale-95"
            >
              Lihat Paket Asesmen
            </Link>
            <Link
              href="/kontak"
              className="px-8 py-4 bg-slate-900/30 text-white font-bold rounded-2xl hover:bg-slate-900/50 transition-all border border-white/20 active:scale-95"
            >
              Konsultasi Gratis
            </Link>
          </div>
        </div>

        {/* Related Articles */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-slate-800 mb-8 border-l-4 border-orange-500 pl-6">
            Baca Juga
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.values(articles)
              .filter(a => a.id !== article.id)
              .slice(0, 2)
              .map((related) => (
                <Link
                  key={related.id}
                  href={`/artikel/${related.slug}`}
                  className="group bg-slate-50 rounded-2xl p-6 border border-slate-200 hover:shadow-lg transition-all"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-4xl">{related.image}</div>
                    <div>
                      <span className="text-xs font-bold text-orange-600 px-2 py-0.5 bg-orange-50 rounded-full uppercase tracking-widest">
                        {related.category}
                      </span>
                      <div className="text-xs text-slate-400 mt-1">{related.date}</div>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-orange-600 transition-colors leading-snug">
                    {related.title}
                  </h3>
                  <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed">
                    {related.excerpt}
                  </p>
                </Link>
              ))}
          </div>
        </div>
      </article>
    </div>
  );
}
