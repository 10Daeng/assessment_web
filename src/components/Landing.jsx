'use client';

import Image from 'next/image';
import { useState } from 'react';

// ================================================================
// PAKET DATA — nama tools INTERNAL, yang dijual adalah OUTPUT
// ================================================================
const packages = [
  {
    id: 'free',
    category: 'semua',
    badge: 'GRATIS',
    badgeColor: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    name: 'Kenali Dirimu',
    tagline: 'Mulai perjalanan memahami dirimu',
    gradient: 'from-emerald-500 to-teal-600',
    accentColor: 'emerald',
    features: [
      'Gambaran umum pola komunikasimu',
      'Profil dasar karakter & kebiasaan mental',
      'Hasil tersimpan untuk konsultasi lanjutan',
    ],
    cta: 'Mulai Gratis Sekarang',
    ctaStyle: 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700',
    action: 'free',
  },
  {
    id: 'pkg-psiko-basic',
    category: 'individu',
    badge: 'POPULER',
    badgeColor: 'bg-blue-50 text-blue-700 border border-blue-200',
    name: 'Self Insight Session',
    tagline: 'Pahami cara kerja pikiranmu',
    gradient: 'from-blue-500 to-indigo-600',
    accentColor: 'blue',
    features: [
      'Laporan gaya komunikasi & pola cara bekerja',
      'Gambaran mendalam tentang pola pikir & strategi dirimu',
      'Cocok untuk profesional & karyawan',
    ],
    cta: 'Mulai Self Insight',
    ctaStyle: 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700',
    action: 'pkg-psiko-basic',
  },
  {
    id: 'pkg-psiko-comprehensive',
    category: 'individu',
    badge: '⭐ TERLENGKAP',
    badgeColor: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
    name: 'Inner Growth Program',
    tagline: 'Peta diri 360° untuk tumbuh optimal',
    gradient: 'from-indigo-500 to-purple-600',
    accentColor: 'indigo',
    highlight: true,
    features: [
      'Pemetaan karakter komprehensif dari berbagai sudut',
      'Laporan kekuatan & titik buta (blind spots)',
      'Saran pengembangan personal & karier',
      'Wawasan mendalam tentang pola perilaku & potensi tersembunyi',
    ],
    cta: 'Mulai Inner Growth',
    ctaStyle: 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700',
    action: 'pkg-psiko-comprehensive',
  },
  {
    id: 'pkg-rekrutmen',
    category: 'b2b',
    badge: 'B2B / TIM',
    badgeColor: 'bg-orange-50 text-orange-700 border border-orange-200',
    name: 'Reflective Coaching — Tim',
    tagline: 'Seleksi & petakan potensi kandidat',
    gradient: 'from-orange-500 to-red-500',
    accentColor: 'orange',
    features: [
      'Profil kepribadian & gaya kerja kandidat',
      'Formulir riwayat hidup terstruktur',
      'Laporan kecocokan posisi & rekomendasi rekrutmen terstruktur',
      'Kuota tim via Voucher khusus Perusahaan',
    ],
    cta: 'Hubungi untuk Bulk',
    ctaStyle: 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600',
    action: 'pkg-rekrutmen',
  },
  {
    id: 'pkg-akademik',
    category: 'pelajar',
    badge: 'PELAJAR',
    badgeColor: 'bg-sky-50 text-sky-700 border border-sky-200',
    name: 'Arahan Karier & Jurusan',
    tagline: 'Temukan arah hidupmu yang tepat',
    gradient: 'from-sky-500 to-cyan-500',
    accentColor: 'sky',
    features: [
      'Profil minat & bakat akademik',
      'Rekomendasi jurusan sesuai kepribadian',
      'Laporan potensi karier berbasis karakter',
      'Panduan langkah konkret setelah lulus',
    ],
    cta: 'Temukan Arah Kariermu',
    ctaStyle: 'bg-gradient-to-r from-sky-500 to-cyan-500 text-white hover:from-sky-600 hover:to-cyan-600',
    action: 'pkg-akademik',
  },
  {
    id: 'pkg-grafologi-brief',
    category: 'individu',
    badge: 'PREMIUM',
    badgeColor: 'bg-violet-50 text-violet-700 border border-violet-200',
    name: 'Analisis Tulisan Tangan',
    tagline: 'Karakter terdalam terbaca dari goresan pena',
    gradient: 'from-violet-500 to-fuchsia-600',
    accentColor: 'violet',
    features: [
      'Analisis grafologi bersertifikat internasional',
      'Profil kepribadian dari tulisan tangan',
      'Laporan karakter mendalam & potensi tersembunyi',
      'Sesi pendampingan langsung dengan analis',
    ],
    cta: 'Mulai Analisis Grafologi',
    ctaStyle: 'bg-gradient-to-r from-violet-500 to-fuchsia-600 text-white hover:from-violet-600 hover:to-fuchsia-700',
    action: 'pkg-grafologi-brief',
  },
];

const problems = [
  { icon: '😮‍💨', text: 'Overthinking yang tidak selesai-selesai' },
  { icon: '🌫️', text: 'Ngerasa kosong padahal hidup "baik-baik aja"' },
  { icon: '😓', text: 'Capek terus tapi tidak tahu apa yang salah' },
  { icon: '🤷', text: 'Bingung arah karier dan keputusan hidup' },
  { icon: '🔇', text: 'Sulit dipahami orang lain meski sudah berusaha' },
  { icon: '💔', text: 'Pola hubungan yang terus berulang' },
];

const testimonials = [
  {
    text: 'Saya kira saya cuma capek biasa… ternyata ada pola pikir yang sudah lama terbentuk tanpa saya sadari. Ini benar-benar membuka mata.',
    name: 'Anindra R.',
    role: 'HR Manager, Jakarta',
    initial: 'A',
    color: 'bg-teal-500',
  },
  {
    text: 'Laporan yang saya dapat sangat detail dan terasa personal. Bukan sekadar label — tapi benar-benar menjelaskan KENAPA saya bertindak seperti itu.',
    name: 'Maya S.',
    role: 'Mahasiswi, Bandung',
    initial: 'M',
    color: 'bg-indigo-500',
  },
  {
    text: 'Kami pakai ini untuk seleksi tim. Akurasinya membuat proses wawancara jadi jauh lebih fokus dan waktu lebih efisien.',
    name: 'Budi W.',
    role: 'Direktur Operasional, Surabaya',
    initial: 'B',
    color: 'bg-orange-500',
  },
];

const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '6285117778798';
const CATEGORIES = ['semua', 'individu', 'pelajar', 'b2b'];
const CATEGORY_LABELS = { semua: 'Semua', individu: 'Individu', pelajar: 'Pelajar', b2b: 'B2B / Tim' };

export default function Landing({ onStart, onPremium }) {
  const [activeCategory, setActiveCategory] = useState('semua');

  const filteredPackages = packages.filter(
    (p) => activeCategory === 'semua' || p.category === activeCategory
  );

  const handleAction = (action) => {
    if (action === 'free') { onStart(); return; }
    const pkgMap = {
      'pkg-psiko-basic': 'pkg-psiko-basic',
      'pkg-psiko-comprehensive': 'pkg-psiko-comprehensive',
      'pkg-psiko-executive': 'pkg-psiko-executive'
    };
    if (pkgMap[action]) {
      window.location.href = `/premium/direct?pkg=${pkgMap[action]}`;
    } else {
      const texts = {
        'pkg-rekrutmen': 'Halo Lentera Batin, saya ingin informasi Paket Reflective Coaching untuk Tim/Rekrutmen.',
        'pkg-akademik': 'Halo Lentera Batin, saya ingin memulai Arahan Karier & Jurusan.',
        'pkg-grafologi-brief': 'Halo Lentera Batin, saya tertarik dengan Analisis Tulisan Tangan.',
      };
      const text = texts[action] || 'Halo Lentera Batin, saya ingin informasi lebih lanjut.';
      window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`, '_blank');
    }
  };

  return (
    <div className="flex flex-col items-center w-full font-sans">

      {/* ===== SECTION 1: HERO ===== */}
      <section className="relative w-full min-h-[92vh] flex items-center justify-center px-4 py-20 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(13,148,136,0.15),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_80%,rgba(249,115,22,0.1),transparent_60%)]" />
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.3) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

        <div className="relative max-w-4xl mx-auto text-center z-10">
          {/* Label atas */}
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-8">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
            <span className="text-teal-300 text-xs font-semibold uppercase tracking-widest">Lentera Batin</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-white/50 text-xs">Lembaga Pengembangan Diri & Pemulihan Batin</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-6 tracking-tight">
            Kamu capek…{' '}
            <span className="block mt-1 bg-gradient-to-r from-orange-400 via-amber-300 to-teal-400 bg-clip-text text-transparent">
              tapi tidak tahu kenapa?
            </span>
          </h1>

          <p className="text-white/60 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-10">
            Lentera Batin membantu kamu memahami pola pikir, karakter, dan titik buta diri —
            melalui pendampingan terstruktur dan{' '}
            <span className="text-white/90 font-semibold">analisis grafologi bersertifikat internasional.</span>
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            <button
              onClick={onStart}
              className="group relative bg-gradient-to-r from-orange-500 to-teal-500 text-white font-bold py-4 px-10 rounded-2xl text-lg shadow-[0_8px_30px_rgba(249,115,22,0.3)] hover:shadow-[0_12px_40px_rgba(249,115,22,0.4)] hover:-translate-y-0.5 transition-all duration-300 w-full sm:w-auto"
            >
              <span className="flex items-center justify-center gap-2">
                Mulai Perjalananmu — Gratis
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </button>
            <a
              href="#layanan"
              className="group flex items-center justify-center gap-2 bg-white/5 border border-white/15 hover:bg-white/10 text-white font-semibold py-4 px-8 rounded-2xl text-lg transition-all duration-300 backdrop-blur-sm w-full sm:w-auto"
            >
              Lihat Semua Layanan
              <svg className="w-4 h-4 group-hover:translate-y-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </a>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-white/40 text-sm">
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-teal-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" /></svg>
              Grafologi bersertifikat internasional
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-teal-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" /></svg>
              Pendekatan terstruktur & terverifikasi
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-teal-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" /></svg>
              Asesmen selesai 10–15 menit
            </span>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/20">
          <span className="text-xs uppercase tracking-widest">scroll</span>
          <svg className="w-4 h-4 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* ===== SECTION 2: MASALAH AUDIENCE ===== */}
      <section className="w-full bg-slate-50 py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-orange-500 mb-3">Apakah kamu merasakannya?</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-4">
              Mungkin kamu sedang di fase ini
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              Banyak orang terlihat baik-baik saja dari luar… tapi di dalam, ada yang terasa berat dan tidak bisa dijelaskan.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {problems.map((p, i) => (
              <div
                key={i}
                className="flex items-start gap-4 bg-white rounded-2xl p-5 border border-slate-100 hover:border-orange-200 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
              >
                <span className="text-2xl mt-0.5 shrink-0">{p.icon}</span>
                <p className="text-slate-700 font-medium text-sm leading-relaxed">{p.text}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <p className="text-slate-500 text-sm">
              Kalau satu saja terasa familiar —{' '}
              <span className="text-teal-600 font-semibold">kamu tidak sendirian, dan ada penjelasannya.</span>
            </p>
          </div>
        </div>
      </section>

      {/* ===== SECTION 3: SOLUSI ===== */}
      <section className="w-full bg-white py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-teal-600 mb-3">Pendekatan Kami</p>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-6 leading-tight">
                Bukan sekadar tes.<br />
                <span className="text-teal-600">Ini peta dirimu.</span>
              </h2>
              <p className="text-slate-600 leading-relaxed mb-6">
                Di Lentera Batin, kami tidak hanya "mendengar". Kami membantu kamu
                memahami diri, menemukan pola yang selama ini tersembunyi, dan menata ulang
                cara pandang tentang dirimu sendiri.
              </p>
              <p className="text-slate-600 leading-relaxed mb-8">
                Melalui{' '}
                <span className="font-semibold text-slate-800">Metode Refleksi Batin Terstruktur</span>{' '}
                kami — yang mengintegrasikan asesmen kepribadian dengan analisis grafologi bersertifikat internasional —
                kamu mendapatkan gambaran diri yang jauh lebih dalam dari sekadar label.
              </p>

              <div className="space-y-3">
                {[
                  'Memahami pola pikir & kebiasaan mentalmu',
                  'Menemukan kekuatan yang belum kamu sadari',
                  'Mengenali titik buta yang sering jadi hambatan',
                  'Mendapatkan arah yang lebih jelas untuk tumbuh',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-slate-700 text-sm">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: '🧠', title: 'Profil Gaya Kerja', desc: 'Bagaimana kamu bekerja, berkomunikasi, dan merespons tekanan', color: 'from-blue-50 to-indigo-50 border-blue-100' },
                { icon: '🪞', title: 'Profil Karakter', desc: '6 dimensi kepribadian yang membentuk siapa dirimu', color: 'from-purple-50 to-violet-50 border-purple-100' },
                { icon: '✍️', title: 'Analisis Grafologi', desc: 'Karakter terdalam terbaca dari tulisan tanganmu', color: 'from-orange-50 to-amber-50 border-orange-100' },
                { icon: '🧭', title: 'Arah Pengembangan', desc: 'Langkah konkret untuk tumbuh sesuai kepribadianmu', color: 'from-teal-50 to-emerald-50 border-teal-100' },
              ].map((item, i) => (
                <div key={i} className={`rounded-2xl p-5 bg-gradient-to-br ${item.color} border hover:-translate-y-1 transition-transform duration-300`}>
                  <span className="text-3xl mb-3 block">{item.icon}</span>
                  <h4 className="font-bold text-slate-800 text-sm mb-1">{item.title}</h4>
                  <p className="text-slate-500 text-xs leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== SECTION 4: LAYANAN UTAMA ===== */}
      <section className="w-full bg-slate-50 py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-indigo-500 mb-3">Layanan Kami</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-4">Apa yang bisa kamu mulai hari ini</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: '💡',
                name: 'Self Insight Session',
                desc: 'Sesi refleksi diri terstruktur untuk memahami pola pikir, karakter, dan cara komunikasimu. Cocok untuk individu & profesional.',
                color: 'border-blue-100 hover:border-blue-300',
                badge: 'Paling diminati',
                badgeColor: 'bg-blue-100 text-blue-700',
                link: '/premium/direct?pkg=pkg-psiko-basic',
              },
              {
                icon: '🌱',
                name: 'Inner Growth Program',
                desc: 'Pemetaan karakter 360° lengkap dengan laporan kekuatan, titik buta, dan saran pengembangan diri konkret.',
                color: 'border-indigo-100 hover:border-indigo-300',
                badge: 'Terlengkap',
                badgeColor: 'bg-indigo-100 text-indigo-700',
                link: '/premium/direct?pkg=pkg-psiko-comprehensive',
              },
              {
                icon: '✍️',
                name: 'Analisis Tulisan Tangan',
                desc: 'Analisis grafologi bersertifikat internasional — baca karakter terdalam dari goresan tulisan tanganmu.',
                color: 'border-violet-100 hover:border-violet-300',
                badge: 'Satu-satunya di kelasnya',
                badgeColor: 'bg-violet-100 text-violet-700',
                link: `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('Halo Lentera Batin, saya tertarik dengan Analisis Tulisan Tangan.')}`,
                external: true,
              },
            ].map((s, i) => (
              <div key={i} className={`bg-white rounded-2xl border-2 ${s.color} p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col`}>
                <span className="text-4xl mb-4 block">{s.icon}</span>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${s.badgeColor} w-fit mb-3`}>{s.badge}</span>
                <h3 className="font-extrabold text-slate-800 text-lg mb-2">{s.name}</h3>
                <p className="text-slate-500 text-sm leading-relaxed flex-1">{s.desc}</p>
                <a
                  href={s.link}
                  target={s.external ? '_blank' : undefined}
                  rel={s.external ? 'noopener noreferrer' : undefined}
                  className="mt-5 text-sm font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
                >
                  Lihat detail
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SECTION 5: TESTIMONI ===== */}
      <section className="w-full bg-white py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-teal-600 mb-3">Kata Mereka</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800">Bukan klaim. Ini pengalaman nyata.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-slate-50 rounded-2xl p-6 border border-slate-100 hover:shadow-md transition-shadow duration-300">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, si) => (
                    <svg key={si} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                  ))}
                </div>
                <p className="text-slate-600 text-sm leading-relaxed mb-5 italic">&quot;{t.text}&quot;</p>
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full ${t.color} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
                    {t.initial}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">{t.name}</p>
                    <p className="text-slate-400 text-xs">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SECTION 6: SEMUA PAKET ===== */}
      <section id="layanan" className="w-full bg-gradient-to-b from-slate-50 to-white py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-indigo-500 mb-3">Pilih Sesuai Kebutuhanmu</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-4">Semua Paket Asesmen</h2>
            <p className="text-slate-500 text-sm max-w-md mx-auto">
              Dari refleksi diri gratis hingga pemetaan karakter mendalam — ada yang tepat untuk setiap tujuan.
            </p>
          </div>

          {/* Category filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                  activeCategory === cat
                    ? 'bg-slate-800 text-white shadow-md'
                    : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-400'
                }`}
              >
                {CATEGORY_LABELS[cat]}
              </button>
            ))}
          </div>

          {/* Package cards */}
          <div className={`grid grid-cols-1 sm:grid-cols-2 ${filteredPackages.length >= 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-2 max-w-3xl mx-auto'} gap-6 text-left`}>
            {filteredPackages.map((pkg) => (
              <div
                key={pkg.id}
                className={`relative bg-white rounded-2xl border-2 ${
                  pkg.highlight ? 'border-indigo-400 shadow-xl shadow-indigo-100/50' : 'border-slate-100 hover:border-slate-300'
                } hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group`}
              >
                {pkg.highlight && (
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />
                )}

                {/* Header */}
                <div className={`p-6 bg-gradient-to-br ${pkg.gradient} text-white`}>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full bg-white/90 ${pkg.badgeColor}`}>
                      {pkg.badge}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-1">{pkg.name}</h3>
                  <p className="text-white/80 text-sm">{pkg.tagline}</p>
                </div>

                {/* Features */}
                <div className="px-6 py-4 flex-1">
                  <ul className="space-y-2.5">
                    {pkg.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                        <svg className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA */}
                <div className="px-6 pb-6">
                  <button
                    onClick={() => handleAction(pkg.action)}
                    className={`w-full py-3 rounded-xl font-semibold text-sm shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 ${pkg.ctaStyle}`}
                  >
                    {pkg.cta}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Voucher bar */}
          <div className="mt-10 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-7 flex flex-col md:flex-row items-center justify-between gap-5 shadow-xl">
            <div className="text-left">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">Sudah dapat Kode dari HRD / Instansi?</p>
              <h3 className="text-white text-xl font-bold">Tukar Voucher dan Mulai Sekarang</h3>
              <p className="text-slate-400 text-sm mt-1">Masukkan kode yang diberikan perusahaan atau lembagamu untuk langsung mengakses paket asesmen.</p>
            </div>
            <a
              href="/premium/direct"
              className="shrink-0 bg-white text-slate-800 font-bold px-7 py-3.5 rounded-xl hover:bg-slate-100 transition text-sm shadow-lg whitespace-nowrap"
            >
              🎟️ Input Kode Voucher →
            </a>
          </div>
        </div>
      </section>

      {/* ===== SECTION 7: CTA AKHIR ===== */}
      <section className="w-full bg-gradient-to-br from-slate-900 to-teal-950 py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(13,148,136,0.15),transparent_70%)]" />
        <div className="relative max-w-2xl mx-auto text-center z-10">
          <p className="text-teal-400 text-sm font-semibold uppercase tracking-widest mb-4">Mulai Hari Ini</p>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-6">
            Nggak harus langsung sembuh…
            <span className="block text-teal-300 mt-1">tapi kamu bisa mulai paham.</span>
          </h2>
          <p className="text-white/50 mb-10 text-lg">
            Satu langkah kecil hari ini — memahami dirimu — bisa mengubah banyak hal ke depannya.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onStart}
              className="group bg-gradient-to-r from-orange-500 to-teal-500 text-white font-bold py-4 px-10 rounded-2xl text-lg shadow-[0_8px_30px_rgba(249,115,22,0.3)] hover:shadow-[0_12px_40px_rgba(249,115,22,0.4)] hover:-translate-y-0.5 transition-all duration-300 w-full sm:w-auto"
            >
              Mulai Asesmen Gratis
            </button>
            <a
              href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('Halo Lentera Batin, saya ingin berdiskusi tentang perjalanan pengembangan diri saya.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-white/5 border border-white/15 hover:bg-white/10 text-white font-semibold py-4 px-8 rounded-2xl text-lg transition-all backdrop-blur-sm w-full sm:w-auto"
            >
              <svg className="w-5 h-5 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" /></svg>
              Hubungi via WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ===== DISCLAIMER ===== */}
      <div className="w-full bg-slate-50 border-t border-slate-200 py-5 px-4">
        <p className="max-w-4xl mx-auto text-center text-xs text-slate-400 leading-relaxed">
          ⚠️ <strong className="text-slate-500">Penting:</strong> Layanan Lentera Batin adalah program pengembangan diri dan refleksi karakter, 
          bukan pengganti diagnosis atau terapi klinis dari psikolog/psikiater berlisensi. 
          Jika Anda mengalami gangguan kesehatan mental yang berat, kami sangat menyarankan konsultasi dengan profesional berlisensi.
        </p>
      </div>

    </div>
  );
}
