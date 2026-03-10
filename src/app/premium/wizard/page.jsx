'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RecommendationWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({ audience: '', goal: '' });

  const handleAudience = (type) => {
    setAnswers({ ...answers, audience: type });
    setStep(1);
  };

  const handleGoal = (goal) => {
    setAnswers({ ...answers, goal });
    setStep(2);
  };

  const handleSelectPackage = (packageId) => {
    router.push(`/premium/direct?pkg=${packageId}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="max-w-2xl w-full bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-100 animate-in fade-in duration-500">
        
        <Link href="/premium" className="text-sm text-slate-400 hover:text-blue-500 mb-8 inline-flex items-center gap-1 transition-colors">
          &larr; Kembali
        </Link>

        {step === 0 && (
          <div className="animate-in slide-in-from-right-4 duration-300">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4">Untuk siapa asesmen ini?</h2>
            <p className="text-slate-500 mb-8">Pilih profil yang paling sesuai dengan kebutuhan Anda saat ini.</p>
            
            <div className="space-y-4">
              <button 
                onClick={() => handleAudience('personal')}
                className="w-full text-left p-5 rounded-2xl border-2 border-slate-100 hover:border-blue-400 hover:bg-blue-50 transition-all"
              >
                <div className="font-bold text-slate-800 text-lg">Individu / Personal</div>
                <div className="text-sm text-slate-500 mt-1">Untuk pengembangan diri, penemuan potensi, atau transisi karier.</div>
              </button>
              
              <button 
                onClick={() => handleAudience('organization')}
                className="w-full text-left p-5 rounded-2xl border-2 border-slate-100 hover:border-teal-400 hover:bg-teal-50 transition-all"
              >
                <div className="font-bold text-slate-800 text-lg">Organisasi / Perusahaan</div>
                <div className="text-sm text-slate-500 mt-1">Untuk rekrutmen kandidat, pemetaan karyawan, atau promosi jabatan.</div>
              </button>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="animate-in slide-in-from-right-4 duration-300">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4">Apa tujuan utama asesmen ini?</h2>
            <p className="text-slate-500 mb-8">Informasi ini membantu kami meracik modul pertanyaan yang relevan.</p>
            
            <div className="space-y-4">
              {answers.audience === 'personal' ? (
                <>
                  <button onClick={() => handleGoal('basic_discovery')} className="w-full text-left p-5 rounded-2xl border-2 border-slate-100 hover:border-blue-400 hover:bg-blue-50 transition-all">
                    <div className="font-bold text-slate-800 text-lg">Mengenal Gaya Kerja Dasar</div>
                    <div className="text-sm text-slate-500 mt-1">Mencari tahu cara kerja dan komunikasi alami saya.</div>
                  </button>
                  <button onClick={() => handleGoal('holistic_discovery')} className="w-full text-left p-5 rounded-2xl border-2 border-slate-100 hover:border-blue-400 hover:bg-blue-50 transition-all">
                    <div className="font-bold text-slate-800 text-lg">Evaluasi Holistik & Kepribadian Eksekutif</div>
                    <div className="text-sm text-slate-500 mt-1">Ingin laporan mendalam tentang sisi moral, emosional, dan dinamika karier saya seutuhnya.</div>
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => handleGoal('basic_screening')} className="w-full text-left p-5 rounded-2xl border-2 border-slate-100 hover:border-teal-400 hover:bg-teal-50 transition-all">
                    <div className="font-bold text-slate-800 text-lg">Screening Massal / Staf Operasional</div>
                    <div className="text-sm text-slate-500 mt-1">Butuh tes yang cepat untuk menyaring gaya kerja dasar kandidat.</div>
                  </button>
                  <button onClick={() => handleGoal('executive_screening')} className="w-full text-left p-5 rounded-2xl border-2 border-slate-100 hover:border-teal-400 hover:bg-teal-50 transition-all">
                    <div className="font-bold text-slate-800 text-lg">Seleksi Level Manajerial / Promosi</div>
                    <div className="text-sm text-slate-500 mt-1">Membutuhkan deteksi karakter integritas, ketahanan stres, dan kepemimpinan.</div>
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="text-center animate-in zoom-in-95 duration-500">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">Rekomendasi Kami</h2>
            
            {answers.goal.includes('basic') ? (
              <div className="my-8 bg-blue-50 border border-blue-100 p-6 rounded-2xl text-left">
                <div className="uppercase tracking-widest text-xs font-bold text-blue-500 mb-1">REKOMENDASI</div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">Paket Basic: Gaya Kerja</h3>
                <p className="text-slate-600 mb-4 text-sm">Paket ini sangat ideal untuk pemetaan instan karena menggunakan instrumen DISC tunggal untuk mendeteksi preferensi perilaku berharga di tempat kerja.</p>
                <button 
                  onClick={() => handleSelectPackage('pkg-basic')}
                  className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition"
                >
                  Pilih Paket Basic &rarr;
                </button>
              </div>
            ) : (
              <div className="my-8 bg-indigo-50 border border-indigo-100 p-6 rounded-2xl text-left relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-3 py-1 rounded-bl-lg">PALING POPULER</div>
                <div className="uppercase tracking-widest text-xs font-bold text-indigo-500 mb-1">REKOMENDASI</div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">Paket Reguler: Kepribadian Eksekutif</h3>
                <p className="text-slate-600 mb-4 text-sm">Sangat komprehensif. Menyatukan ketajaman DISC (kerja) dan HEXACO (karakter) secara berurutan. AI kami akan membedah sisi gelap dan terang dari potensi tersebut.</p>
                <button 
                  onClick={() => handleSelectPackage('pkg-reguler')}
                  className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition"
                >
                  Pilih Paket Reguler &rarr;
                </button>
              </div>
            )}

            <button onClick={() => setStep(0)} className="text-sm text-slate-400 hover:text-slate-600 underline">
              Ulangi kuesioner
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
