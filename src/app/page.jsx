'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Landing from '@/components/Landing';
import PremiumSection from '@/components/PremiumSection';
import PersonalInfo from '@/components/PersonalInfo';
import DiscTest from '@/components/DiscTest';
import HexacoTest from '@/components/HexacoTest';
import { calculateDiscScores, calculateHexacoScores } from '@/utils/scoring';
import { logger } from '@/utils/logger';
import Script from 'next/script';

export default function Home() {
  const [step, setStep] = useState(0);
  const [userData, setUserData] = useState({});
  const [finalScores, setFinalScores] = useState({ disc: null, hexaco: null });
  const [isProcessing, setIsProcessing] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [selectedPkg, setSelectedPkg] = useState('pkg-basic');
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [showPremium, setShowPremium] = useState(false);

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
      const response = await fetch('/api/submit', {
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
      
      const resData = await response.json();
      setIsProcessing(false);
      
      // Trigger AI generation asynchronously without blocking the user
      if (resData?.data?.id) {
        fetch(`/api/admin/submissions/${resData.data.id}/ai`, { method: 'POST' }).catch(() => {});
      }

    } catch (e) {
      logger.error(e);
      setIsProcessing(false);
    }
  };

  return (
    <main className="min-h-screen bg-white selection:bg-teal-100 font-sans">

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

      <div>
        {showPremium ? (
          <PremiumSection
            onBack={() => setShowPremium(false)}
            onFreeAssessment={handleStart}
            selectedPkg={selectedPkg}
            setSelectedPkg={setSelectedPkg}
            isCheckoutLoading={isCheckoutLoading}
            setIsCheckoutLoading={setIsCheckoutLoading}
          />
        ) : (
          <>
            {step === 0 && <Landing onStart={handleStart} onPremium={() => setShowPremium(true)} />}
            {step === 1 && <div className="pt-8 pb-16"><PersonalInfo onSubmit={handleInfoSubmit} /></div>}
            {step === 2 && <div className="pt-8 pb-16"><DiscTest onComplete={handleDiscComplete} /></div>}
            {step === 3 && <div className="pt-8 pb-16"><HexacoTest onComplete={handleHexacoComplete} /></div>}
          </>
        )}
        
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

            {/* Soft Selling CTA */}
            <div className="mt-8 bg-gradient-to-br from-green-50 to-teal-50 border border-green-100 rounded-3xl p-8 shadow-lg text-center animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
              </div>
              
              <div className="relative z-10 w-full flex flex-col md:flex-row items-center gap-6">
                <div className="flex-1 text-left">
                  <h3 className="text-xl font-bold text-slate-800 mb-2">Ingin membedah hasil tes ini lebih dalam?</h3>
                  <p className="text-slate-600 mb-4 text-sm leading-relaxed">
                    Hasil asesmen gratis hanya menunjukkan <strong>Siapa</strong> Anda. Melalui <strong>Sesi Konseling Premium</strong>, Psikolog Lentera Batin akan membedah <strong>Mengapa</strong> Anda merasakan kelelahan adaptasi, menemukan titik buta (<em>blind spots</em>) karier yang selama ini menghambat potensi Anda, serta memformulasikan strategi nyata agar Anda lebih optimal dalam karier maupun relasi asmara.
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <a 
                    href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '6285117778798'}?text=${encodeURIComponent('Halo Lentera Batin, saya sudah mengisi Asesmen Karakter dan Gaya Kerja. Saya tertarik untuk mendapatkan laporan lengkap dan sesi konsultasi/konseling pribadi.')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebd5b] text-white font-bold py-3.5 px-6 rounded-xl shadow-[0_8px_20px_rgba(37,211,102,0.3)] hover:-translate-y-1 hover:shadow-[0_12px_25px_rgba(37,211,102,0.4)] transition-all duration-300"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                    Hubungi via WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-4 text-center">
        <p className="text-xs text-slate-300">
          © 2026 Lentera Batin
        </p>
      </footer>
    </main>
  );
}
