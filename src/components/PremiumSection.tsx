'use client';

import { useState } from 'react';
import Script from 'next/script';

// TypeScript declarations for Midtrans Snap.js
declare global {
  interface Window {
    snap: {
      pay: (token: string, options: {
        onSuccess: (result: any) => void;
        onPending: (result: any) => void;
        onError: (result: any) => void;
        onClose: () => void;
      }) => void;
    };
  }
}

const PACKAGES = {
  psikometri: [
    {
      id: 'pkg-psiko-basic',
      name: 'Gambaran Diri - Basic Profiling',
      description: 'Asesmen DISC fundamental untuk memetakan gaya kerja dasar',
      price: 150000,
      features: ['24 Pertanyaan DISC', 'Gaya Kerja Dasar', 'Laporan PDF'],
      intent: 'PSYCHOLOGY',
      highlight: 'Terjangkau'
    },
    {
      id: 'pkg-psiko-comprehensive',
      name: 'Gambaran Diri - Comprehensive Profile',
      description: 'Profil kepribadian lengkap dengan DISC dan HEXACO plus konseling',
      price: 300000,
      features: ['24 Pertanyaan DISC', '100 Pertanyaan HEXACO', 'Analisis Mendalam', 'Laporan PDF Lengkap'],
      intent: 'PSYCHOLOGY',
      highlight: 'Paling Populer',
      popular: true
    },
    {
      id: 'pkg-psiko-executive',
      name: 'Gambaran Diri - Executive Profile',
      description: 'Profil kepribadian eksekutif dengan analisis mendalam dan rekomendasi karier',
      price: 500000,
      features: ['24 Pertanyaan DISC', '100 Pertanyaan HEXACO', 'Self Report Test', 'Analisis Eksekutif'],
      intent: 'PSYCHOLOGY',
      highlight: 'Premium'
    }
  ],
  grafologi: [
    {
      id: 'pkg-grafologi-brief',
      name: 'Gambaran Diri - Grafologi Brief',
      description: 'Analisis grafologi dasar untuk pemetaan kepribadian singkat',
      price: 200000,
      features: ['Analisis Grafologi', '24 Pertanyaan DISC', 'Laporan PDF'],
      intent: 'GRAPHOLOGY',
      highlight: 'Dasar'
    },
    {
      id: 'pkg-grafologi-indepth',
      name: 'Gambaran Diri - In-Depth Graphology',
      description: 'Analisis grafologi mendalam dengan DISC dan HEXACO untuk pemetaan kepribadian komprehensif',
      price: 350000,
      features: ['Analisis Grafologi', '24 Pertanyaan DISC', '100 Pertanyaan HEXACO', 'Analisis Mendalam', 'Laporan PDF Lengkap'],
      intent: 'GRAPHOLOGY',
      highlight: 'Populer',
      popular: true
    },
    {
      id: 'pkg-grafologi-advanced',
      name: 'Gambaran Diri - Advanced Grapho-Analysis',
      description: 'Analisis grafologi tingkat lanjut dengan DISC, HEXACO, dan Self Report Test',
      price: 550000,
      features: ['Analisis Grafologi Lanjut', '24 Pertanyaan DISC', '100 Pertanyaan HEXACO', 'Self Report Test', 'Analisis Komplit'],
      intent: 'GRAPHOLOGY',
      highlight: 'Komplit'
    }
  ]
};

interface PremiumSectionProps {
  onBack: () => void;
  onFreeAssessment: () => void;
  selectedPkg: string;
  setSelectedPkg: (pkg: string) => void;
  isCheckoutLoading: boolean;
  setIsCheckoutLoading: (loading: boolean) => void;
}

export default function PremiumSection({ onBack, onFreeAssessment, selectedPkg, setSelectedPkg, isCheckoutLoading, setIsCheckoutLoading }: PremiumSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState('psikometri');
  const [userInfo, setUserInfo] = useState({ name: '', email: '' });
  const [voucherCode, setVoucherCode] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInfo.name || !userInfo.email) {
      setErrorMsg('Mohon lengkapi data diri untuk melanjutkan pembayaran.');
      return;
    }

    setIsCheckoutLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/premium/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packageId: selectedPkg, userInfo })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Gagal membuat transaksi.');
      }

      window.snap.pay(data.token, {
        onSuccess: function(result) {
          window.location.href = `/premium/assessment/${data.sessionId}`;
        },
        onPending: function(result) {
          alert('Pembayaran tertunda. Silakan selesaikan pembayaran Anda.');
        },
        onError: function(result) {
          alert('Pembayaran gagal! Silakan coba lagi.');
          setIsCheckoutLoading(false);
        },
        onClose: function() {
          setIsCheckoutLoading(false);
        }
      });

    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Terjadi kesalahan yang tidak terduga.');
      setIsCheckoutLoading(false);
    }
  };

  const handleApplyVoucher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!voucherCode.trim() || !userInfo.name || !userInfo.email) {
      setErrorMsg('Mohon lengkapi data diri dan kode voucher.');
      return;
    }

    setIsChecking(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/premium/verify-voucher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: voucherCode, packageId: selectedPkg, userInfo })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Voucher tidak valid atau kuota habis.');
      }

      window.location.href = `/premium/assessment/${data.sessionId}`;

    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Terjadi kesalahan yang tidak terduga.');
    } finally {
      setIsChecking(false);
    }
  };

  const getWaLink = () => {
    const allPackages = [...PACKAGES.psikometri, ...PACKAGES.grafologi];
    const pkg = allPackages.find((p) => p.id === selectedPkg);
    const pkgName = pkg?.name || 'Paket Premium';
    const text = `Halo Admin Lentera Batin, saya ingin membeli akses tes mandiri untuk paket: ${pkgName}. Mohon info pembayarannya.`;
    return `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '6285117778798'}?text=${encodeURIComponent(text)}`;
  };

  const currentPackages = selectedCategory === 'psikometri' ? PACKAGES.psikometri : PACKAGES.grafologi;

  return (
    <>
      <Script src="https://app.sandbox.midtrans.com/snap/snap.js" data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY} strategy="lazyOnload" />

      <div className="max-w-6xl mx-auto px-4 pt-8 pb-16 animate-in fade-in duration-700">
        {/* Header */}
        <div className="text-center mb-12">
          <button
            onClick={onBack}
            className="mb-8 text-sm text-slate-400 hover:text-blue-500 transition-colors"
          >
            &larr; Kembali ke Landing
          </button>

          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 mb-4 tracking-tight">
            Pilih Paket <span className="bg-gradient-to-r from-orange-500 to-teal-600 bg-clip-text text-transparent">Premium</span>
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed">
            Dapatkan laporan asesmen mendalam dengan AI-driven insights dan rekomendasi personal.
          </p>
        </div>

        {/* Category Selection */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => {
              setSelectedCategory('psikometri');
              setSelectedPkg('pkg-psiko-basic');
            }}
            className={`flex-1 px-6 py-3 rounded-xl font-medium transition-all ${
              selectedCategory === 'psikometri'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
            }`}
          >
            🧠 Metodologi Psikotes
          </button>
          <button
            onClick={() => {
              setSelectedCategory('grafologi');
              setSelectedPkg('pkg-grafologi-brief');
            }}
            className={`flex-1 px-6 py-3 rounded-xl font-medium transition-all ${
              selectedCategory === 'grafologi'
                ? 'bg-teal-600 text-white'
                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
            }`}
          >
            🖊 Analisis Grafologi
          </button>
        </div>

        {/* Package Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {currentPackages.map((pkg) => (
            <div
              key={pkg.id}
              onClick={() => setSelectedPkg(pkg.id)}
              className={`relative p-6 rounded-3xl border-2 cursor-pointer transition-all ${
                selectedPkg === pkg.id
                  ? pkg.popular
                    ? 'border-indigo-600 bg-indigo-50 ring-4 ring-indigo-200'
                    : pkg.highlight === 'Komplit'
                      ? 'border-purple-600 bg-purple-50 ring-4 ring-purple-200'
                      : pkg.highlight === 'Premium'
                        ? 'border-amber-600 bg-amber-50 ring-4 ring-amber-200'
                        : 'border-blue-600 bg-blue-50 ring-4 ring-blue-200'
                  : 'border-slate-200 hover:border-slate-300 hover:shadow-lg'
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-3 -right-3 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                  PALING POPULER
                </div>
              )}

              {pkg.highlight && !pkg.popular && (
                <div className="absolute -top-3 -right-3 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                  {pkg.highlight}
                </div>
              )}

              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-1">{pkg.name}</h3>
                  <p className="text-slate-500 text-sm">{pkg.description}</p>
                </div>
                <div className="text-2xl font-extrabold text-slate-800">
                  Rp {(pkg.price / 1000).toLocaleString('id-ID')}
                </div>
              </div>

              <ul className="space-y-2 mb-4">
                {pkg.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-slate-600 text-sm">
                    <svg className="w-4 h-4 text-green-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => setSelectedPkg(pkg.id)}
                className={`w-full font-bold py-3 rounded-xl transition-all ${
                  selectedPkg === pkg.id
                    ? pkg.popular
                      ? 'bg-indigo-600 text-white'
                      : pkg.highlight === 'Komplit'
                        ? 'bg-purple-600 text-white'
                        : pkg.highlight === 'Premium'
                          ? 'bg-amber-600 text-white'
                          : 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {selectedPkg === pkg.id ? 'Dipilih' : 'Pilih Paket'}
              </button>
            </div>
          ))}
        </div>

        {/* Payment Section */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 md:p-10">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">
            Informasi Pembeli
          </h2>

          {errorMsg && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm">
              {errorMsg}
            </div>
          )}

          <div className="space-y-4 mb-8">
            <div>
              <label className="block text-sm font-semibold text-slate-500 mb-2">Nama Lengkap *</label>
              <input
                type="text"
                value={userInfo.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUserInfo({ ...userInfo, name: e.target.value })}
                required
                className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-blue-500 transition-colors"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-500 mb-2">
                Email Aktif * <span className="text-slate-400 font-normal">(Hasil pdf dikirim ke sini)</span>
              </label>
              <input
                type="email"
                value={userInfo.email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUserInfo({ ...userInfo, email: e.target.value })}
                required
                className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-blue-500 transition-colors"
                placeholder="john@example.com"
              />
            </div>
          </div>

          {/* Payment Options */}
          <div className="space-y-4">
            {/* Option 1: Pay with Midtrans */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold">
                  💳
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-lg">Bayar Langsung (Otomatis)</h3>
                  <p className="text-slate-500 text-sm">
                    Bayar dengan QRIS, Transfer Bank, atau E-Wallet tanpa antrian.
                  </p>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isCheckoutLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCheckoutLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-blue-300 border-t-white rounded-full animate-spin" />
                    Memproses...
                  </>
                ) : (
                  <>
                    Bayar Sekarang &rarr;
                    <span className="text-sm font-normal opacity-90">
                      (Rp {((currentPackages.find((p) => p.id === selectedPkg)?.price || 0) / 1000).toLocaleString('id-ID')})
                    </span>
                  </>
                )}
              </button>
            </div>

            {/* Option 2: Use Voucher */}
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-6 rounded-2xl border border-slate-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-slate-700 rounded-xl flex items-center justify-center text-white font-bold">
                  🎟
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-lg">Punya Kode Voucher?</h3>
                  <p className="text-slate-500 text-sm">
                    Tukarkan token dari perusahaan / HRD Anda.
                  </p>
                </div>
              </div>

              <input
                type="text"
                value={voucherCode}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setVoucherCode(e.target.value.toUpperCase())}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl outline-none focus:border-slate-400 font-mono tracking-widest uppercase text-sm mb-3 placeholder:text-slate-300"
                placeholder="XXXX-YYYY-ZZZZ"
              />

              <button
                onClick={handleApplyVoucher}
                disabled={isChecking}
                className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isChecking ? (
                  <>
                    <div className="w-5 h-5 border-2 border-slate-500 border-t-white rounded-full animate-spin" />
                    Memverifikasi...
                  </>
                ) : (
                  'Klaim Voucher & Mulai'
                )}
              </button>
            </div>
          </div>

          {/* Manual Payment Info */}
          <div className="mt-6 bg-orange-50 border border-orange-200 p-5 rounded-2xl">
            <h3 className="font-bold text-orange-800 text-sm mb-2">Belum punya Voucher?</h3>
            <p className="text-xs text-orange-700 mb-3">
              Untuk pendaftar mandiri (B2C), silakan lakukan pembayaran manual via WhatsApp ke Admin kami. Voucher akan segera diberikan setelah pembayaran dikonfirmasi.
            </p>
            <a
              href={getWaLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center w-full bg-[#25D366] hover:bg-[#1ebd5b] text-white font-bold py-3 rounded-xl text-sm shadow-sm hover:shadow-md transition-all"
            >
              Beli Voucher via WhatsApp
            </a>
          </div>
        </div>

        {/* Back to Free Assessment */}
        <div className="text-center mt-10">
          <p className="text-slate-500 mb-4">
            Ingin mencoba tes gratis terlebih dahulu?
          </p>
          <button
            onClick={onFreeAssessment}
            className="inline-flex items-center gap-2 bg-white border-2 border-slate-200 hover:border-blue-500 text-slate-700 hover:text-blue-600 font-semibold py-3 px-8 rounded-full transition-all"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-6" />
            </svg>
            Mulai Asesmen Gratis
          </button>
        </div>
      </div>
    </>
  );
}
