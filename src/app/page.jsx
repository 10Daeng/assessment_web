'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Landing from '@/components/Landing';
import PersonalInfo from '@/components/PersonalInfo';
import DiscTest from '@/components/DiscTest';
import HexacoTest from '@/components/HexacoTest';
import { calculateDiscScores, calculateHexacoScores } from '@/utils/scoring';

export default function Home() {
  const [step, setStep] = useState(0); 
  const [userData, setUserData] = useState({});
  const [finalScores, setFinalScores] = useState({ disc: null, hexaco: null });
  const [isProcessing, setIsProcessing] = useState(false);
  const [startTime, setStartTime] = useState(null);

  const handleStart = () => {
    setStartTime(Date.now());
    setStep(1);
  };

  const handleInfoSubmit = (data) => {
    setUserData(data);
    setStep(2);
    window.scrollTo(0, 0);
  };

  const handleDiscComplete = (answers) => {
    setFinalScores(prev => ({ ...prev, discRawAnswers: answers }));
    setStep(3);
    window.scrollTo(0, 0);
  };

  const handleHexacoComplete = async (answers) => {
    window.scrollTo(0, 0);
    setStep(4);
    setIsProcessing(true);

    try {
      // 1. Calculate Scores based on User Manual
      const disc = calculateDiscScores(finalScores.discRawAnswers);
      const hexaco = calculateHexacoScores(answers);

      setFinalScores(prev => ({ ...prev, disc, hexaco }));

      // 2. Kalkulasi durasi
      let durasiText = "Tidak diketahui";
      if (startTime) {
        const diffInSeconds = Math.floor((Date.now() - startTime) / 1000);
        const mins = Math.floor(diffInSeconds / 60);
        const secs = diffInSeconds % 60;
        durasiText = `${mins} menit ${secs} detik`;
      }
      
      const payloadUserData = { ...userData, durasi: durasiText };

      // 3. Transmit to remote Database
      await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userData: payloadUserData,
          discScores: disc,
          hexacoScores: hexaco,
          answers: {
            disc: finalScores.discRawAnswers,
            hexaco: answers
          }
        })
      });
      
      setIsProcessing(false);
      
    } catch (e) {
      console.error(e);
      setIsProcessing(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50/50 selection:bg-teal-100 font-sans">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-50/50 via-white to-teal-50/30"></div>
      
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Image src="/logo.png" alt="Lentera Batin" width={140} height={40} className="h-9 w-auto" priority />
          {step > 0 && step < 4 && (
            <div className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full">
              Tahap {step} dari 3
            </div>
          )}
        </div>
      </header>

      <div className="pt-8 pb-16">
        {step === 0 && <Landing onStart={handleStart} />}
        {step === 1 && <PersonalInfo onSubmit={handleInfoSubmit} />}
        {step === 2 && <DiscTest onComplete={handleDiscComplete} />}
        {step === 3 && <HexacoTest onComplete={handleHexacoComplete} />}
        
        {step === 4 && isProcessing && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-in fade-in zoom-in duration-500">
            <div className="w-20 h-20 mb-8 border-4 border-slate-100 border-t-blue-600 rounded-full animate-spin"></div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Memproses Hasil Asesmen...</h2>
            <p className="text-slate-500">Sistem sedang memproses jawaban Anda. Mohon tunggu sebentar.</p>
          </div>
        )}

        {step === 4 && !isProcessing && (
          <div className="max-w-3xl mx-auto px-4 animate-in slide-in-from-bottom-8 duration-700">
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-slate-100 text-center">
              <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-slate-800 mb-4">Terima Kasih!</h2>
              <p className="text-slate-600 mb-6 text-lg leading-relaxed">
                Anda telah berhasil menyelesaikan seluruh rangkaian asesmen <strong>Profil Gaya Kerja</strong> dan <strong>Profil Karakter</strong>.
              </p>
              <p className="text-slate-500 mb-10 leading-relaxed">
                Data Anda telah tersimpan dengan aman dan akan diproses oleh tim konselor kami. 
                Hasil asesmen akan disampaikan langsung oleh konselor pada sesi konsultasi Anda.
              </p>

              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100 text-left">
                <h3 className="font-semibold text-blue-800 mb-2 text-sm uppercase tracking-wider">Langkah Selanjutnya</h3>
                <ul className="text-blue-700 text-sm space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-0.5">•</span>
                    Tim konselor akan menganalisis hasil asesmen Anda.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-0.5">•</span>
                    Hasil lengkap akan dibahas dalam sesi konsultasi tatap muka.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-0.5">•</span>
                    Jika ada pertanyaan, silakan hubungi kami melalui kanal resmi.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer with subtle admin link */}
      <footer className="border-t border-slate-100 py-4 text-center">
        <p className="text-xs text-slate-300">
          © 2026 Lentera Batin · <Link href="/admin" className="text-slate-400 hover:text-blue-500 transition-colors">Admin</Link>
        </p>
      </footer>
    </main>
  );
}
