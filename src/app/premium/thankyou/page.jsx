'use client';

import Link from 'next/link';

export default function PremiumThankYou() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="max-w-2xl w-full text-center">
        <div className="bg-white rounded-3xl p-10 md:p-14 shadow-xl border border-slate-100 animate-in zoom-in-95 duration-700">
          <div className="w-24 h-24 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h2 className="text-3xl font-extrabold text-slate-800 mb-4 bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
            Asesmen Selesai!
          </h2>
          
          <p className="text-slate-600 mb-8 text-lg leading-relaxed">
            Selamat, Anda telah menuntaskan seluruh rangkaian modul asesmen. Data Anda sedang diproses oleh mesin kecerdasan kami untuk menghasilkan laporan akhir yang komprehensif.
          </p>
          
          <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6 text-left mb-8 shadow-inner">
            <h3 className="font-bold text-orange-800 text-sm mb-2 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Pemberitahuan Hasil
            </h3>
            <p className="text-sm text-orange-700 leading-relaxed">
              Tautan unduhan Laporan PDF (Basic / Reguler / Premium) akan segera <strong>dikirimkan ke email Anda</strong> dalam waktu maksimal 1x24 jam setelah proses *Quality Control* selesai.
            </p>
          </div>

          <Link href="/" className="inline-block bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 px-8 rounded-xl transition">
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
