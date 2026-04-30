'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Script from 'next/script';

// ============================================================
// DATA PAKET - Sinkron dengan seed/route.js & katalog harga
// ============================================================
const PACKAGES = {
  kepribadian: [
    {
      id: 'pkg-psiko-basic',
      name: 'Gambaran Diri - Basic Profiling',
      price: 150000,
      priceLabel: 'Rp 150.000',
      modules: 'Profil gaya komunikasi & cara bekerja',
      badge: null,
      color: 'blue',
    },
    {
      id: 'pkg-psiko-comprehensive',
      name: 'Gambaran Diri - Comprehensive Profile',
      price: 300000,
      priceLabel: 'Rp 300.000',
      modules: 'Pemetaan karakter komprehensif multidimensi',
      badge: '⭐ Paling Populer',
      color: 'indigo',
    },
    {
      id: 'pkg-psiko-executive',
      name: 'Gambaran Diri - Executive Profile',
      price: 500000,
      priceLabel: 'Rp 500.000',
      modules: 'Profil karakter mendalam + refleksi tertulis',
      badge: '🏆 Paling Lengkap',
      color: 'violet',
    },
  ],
  grafologi: [
    {
      id: 'pkg-grafologi-brief',
      name: 'Gambaran Diri - Grafologi Brief',
      price: 200000,
      priceLabel: 'Rp 200.000',
      modules: 'Analisis karakter dari tulisan tangan',
      badge: null,
      color: 'teal',
    },
    {
      id: 'pkg-grafologi-indepth',
      name: 'Gambaran Diri - In-Depth Graphology',
      price: 350000,
      priceLabel: 'Rp 350.000',
      modules: 'Analisis tulisan tangan + profil gaya bekerja',
      badge: '⭐ Paling Populer',
      color: 'emerald',
    },
    {
      id: 'pkg-grafologi-advanced',
      name: 'Gambaran Diri - Advanced Grapho-Analysis',
      price: 550000,
      priceLabel: 'Rp 550.000',
      modules: 'Analisis tulisan tangan + pemetaan karakter lengkap',
      badge: '🏆 Paling Lengkap',
      color: 'green',
    },
  ],
};

// Warna per paket
const COLOR_MAP = {
  blue:    { border: 'border-blue-500',   bg: 'bg-blue-50',   badge: 'text-blue-600',   radio: 'text-blue-600'   },
  indigo:  { border: 'border-indigo-500', bg: 'bg-indigo-50', badge: 'text-indigo-600', radio: 'text-indigo-600' },
  violet:  { border: 'border-violet-500', bg: 'bg-violet-50', badge: 'text-violet-600', radio: 'text-violet-600' },
  teal:    { border: 'border-teal-500',   bg: 'bg-teal-50',   badge: 'text-teal-600',   radio: 'text-teal-600'   },
  emerald: { border: 'border-emerald-500',bg: 'bg-emerald-50',badge: 'text-emerald-600',radio: 'text-emerald-600'},
  green:   { border: 'border-green-500',  bg: 'bg-green-50',  badge: 'text-green-600',  radio: 'text-green-600'  },
};

function PackageCard({ pkg, selectedPkg, onSelect }) {
  const isSelected = selectedPkg === pkg.id;
  const c = COLOR_MAP[pkg.color];

  return (
    <label
      className={`block p-4 rounded-xl border-2 cursor-pointer transition-all ${
        isSelected ? `${c.border} ${c.bg}` : 'border-slate-100 hover:border-slate-300'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="font-bold text-slate-800 text-sm leading-snug">{pkg.name}</div>
          <div className="text-xs text-slate-500 mt-0.5">{pkg.modules}</div>
          {pkg.badge && (
            <span className={`text-xs font-semibold mt-1 inline-block ${c.badge}`}>
              {pkg.badge}
            </span>
          )}
        </div>
        <div className="text-right flex-shrink-0">
          <div className="font-bold text-slate-800 text-sm">{pkg.priceLabel}</div>
          <input
            type="radio"
            name="pkg"
            checked={isSelected}
            onChange={() => onSelect(pkg.id)}
            className={`mt-1 w-4 h-4 ${c.radio}`}
          />
        </div>
      </div>
    </label>
  );
}

function DirectBookingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultPkg = searchParams.get('pkg') || 'pkg-psiko-basic';

  const [methodology, setMethodology] = useState(
    defaultPkg.startsWith('pkg-grafologi') ? 'grafologi' : 'kepribadian'
  );
  const [selectedPkg, setSelectedPkg] = useState(defaultPkg);
  const [voucherCode, setVoucherCode] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    age: '',
    organization: '',
  });

  const currentPackages = PACKAGES[methodology];
  const selectedPkgData = [...PACKAGES.kepribadian, ...PACKAGES.grafologi].find(
    (p) => p.id === selectedPkg
  );

  const handleMethodologyChange = (m) => {
    setMethodology(m);
    // Auto-pilih paket pertama dari metodologi baru
    setSelectedPkg(PACKAGES[m][0].id);
    setErrorMsg('');
  };

  const handleApplyVoucher = async (e) => {
    if (e) e.preventDefault();
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
        body: JSON.stringify({ code: voucherCode, packageId: selectedPkg, userInfo }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Voucher tidak valid atau kuota habis.');
      router.push(`/premium/assessment/${data.sessionId}`);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setIsChecking(false);
    }
  };

  const handleCheckout = async (e) => {
    if (e) e.preventDefault();
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
        body: JSON.stringify({ packageId: selectedPkg, userInfo }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Gagal membuat transaksi.');
      window.snap.pay(data.token, {
        onSuccess: () => router.push(`/premium/assessment/${data.sessionId}`),
        onPending: () => alert('Pembayaran tertunda. Silakan selesaikan pembayaran Anda.'),
        onError: () => alert('Pembayaran gagal! Silakan coba lagi.'),
        onClose: () => alert('Popup ditutup tanpa menyelesaikan pembayaran.'),
      });
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setIsCheckoutLoading(false);
    }
  };

  return (
    <>
      <Script
        src="https://app.sandbox.midtrans.com/snap/snap.js"
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
        strategy="lazyOnload"
      />
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
        <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-8 md:p-12 rounded-3xl shadow-lg border border-slate-100 animate-in fade-in duration-500">

          {/* ===== KOLOM KIRI: Pilih Metodologi & Paket ===== */}
          <div className="pr-0 md:pr-8 border-r-0 md:border-r border-slate-100">
            <Link href="/premium" className="text-sm text-slate-400 hover:text-blue-500 mb-6 inline-flex items-center gap-1">
              &larr; Kembali
            </Link>

            <h2 className="text-2xl font-bold text-slate-800 mb-1">Pilih Paket Asesmen</h2>
            <p className="text-slate-500 mb-5 text-sm">Pilih jenis layanan dan paket yang sesuai tujuanmu.</p>

            {/* Tab Metodologi */}
            <div className="flex rounded-xl border border-slate-200 overflow-hidden mb-5">
              <button
                onClick={() => handleMethodologyChange('kepribadian')}
                className={`flex-1 py-2.5 text-sm font-semibold transition-all ${
                  methodology === 'kepribadian'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-slate-500 hover:bg-slate-50'
                }`}
              >
                🧠 Profil Kepribadian
              </button>
              <button
                onClick={() => handleMethodologyChange('grafologi')}
                className={`flex-1 py-2.5 text-sm font-semibold transition-all ${
                  methodology === 'grafologi'
                    ? 'bg-teal-600 text-white'
                    : 'bg-white text-slate-500 hover:bg-slate-50'
                }`}
              >
                ✍️ Analisis Tulisan Tangan
              </button>
            </div>

            {/* Daftar Paket */}
            <div className="space-y-3 mb-6">
              {currentPackages.map((pkg) => (
                <PackageCard
                  key={pkg.id}
                  pkg={pkg}
                  selectedPkg={selectedPkg}
                  onSelect={setSelectedPkg}
                />
              ))}
            </div>

            {/* Ringkasan Harga */}
            {selectedPkgData && (
              <div className="bg-slate-800 text-white rounded-2xl p-4 text-sm">
                <div className="text-slate-400 text-xs mb-1">Paket Dipilih</div>
                <div className="font-bold leading-snug">{selectedPkgData.name}</div>
                <div className="text-slate-300 text-xs mt-0.5">{selectedPkgData.modules}</div>
                <div className="text-xl font-extrabold mt-2">{selectedPkgData.priceLabel}</div>
              </div>
            )}
          </div>

          {/* ===== KOLOM KANAN: Form User & Pembayaran ===== */}
          <div className="pt-4 md:pt-12">
            <h2 className="text-2xl font-bold text-slate-800 mb-1">Mulai Asesmen</h2>
            <p className="text-slate-500 mb-6 text-sm">Lengkapi data diri dan pilih cara memulai.</p>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Nama Lengkap *</label>
                <input
                  type="text"
                  value={userInfo.name}
                  onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:border-blue-500 text-sm"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">
                  Email Aktif * <span className="text-slate-400 font-normal">(Hasil PDF dikirim ke sini)</span>
                </label>
                <input
                  type="email"
                  value={userInfo.email}
                  onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:border-blue-500 text-sm"
                  placeholder="john@example.com"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Usia</label>
                  <input
                    type="number"
                    value={userInfo.age}
                    onChange={(e) => setUserInfo({ ...userInfo, age: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:border-blue-500 text-sm"
                    placeholder="25"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Instansi / Kampus</label>
                  <input
                    type="text"
                    value={userInfo.organization}
                    onChange={(e) => setUserInfo({ ...userInfo, organization: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:border-blue-500 text-sm"
                    placeholder="PT ABC..."
                  />
                </div>
              </div>
            </div>

            {/* Pilihan Bayar / Voucher */}
            <div className="flex flex-col sm:flex-row gap-4">
              {/* BAYAR LANGSUNG */}
              <div className="flex-1 bg-blue-50/60 p-4 border border-blue-100 rounded-2xl">
                <h3 className="text-sm font-bold text-slate-800 mb-1">Belum punya Voucher?</h3>
                <p className="text-xs text-slate-500 mb-3">Bayar otomatis via QRIS / Transfer / E-Wallet.</p>
                <button
                  onClick={handleCheckout}
                  type="button"
                  disabled={isCheckoutLoading}
                  className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition flex justify-center items-center h-12 text-sm shadow-md"
                >
                  {isCheckoutLoading ? (
                    <div className="w-5 h-5 border-2 border-blue-300 border-t-white rounded-full animate-spin" />
                  ) : (
                    'Bayar Instan & Mulai'
                  )}
                </button>
              </div>

              {/* PAKAI VOUCHER */}
              <div className="flex-1 bg-slate-50 p-4 border border-slate-200 rounded-2xl">
                <h3 className="text-sm font-bold text-slate-800 mb-1">Punya Voucher?</h3>
                <p className="text-xs text-slate-500 mb-2">Tukarkan token dari instansi / HRD Anda.</p>
                <input
                  type="text"
                  value={voucherCode}
                  onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                  className="w-full px-4 py-2 border-2 border-slate-200 rounded-xl outline-none focus:border-slate-400 font-mono tracking-widest uppercase mb-3 text-sm"
                  placeholder="XXXX-YYYY-ZZZZ"
                />
                <button
                  onClick={handleApplyVoucher}
                  type="button"
                  disabled={isChecking}
                  className="w-full bg-slate-800 text-white font-bold py-3 rounded-xl hover:bg-slate-900 transition flex justify-center items-center h-12 text-sm"
                >
                  {isChecking ? (
                    <div className="w-5 h-5 border-2 border-slate-500 border-t-white rounded-full animate-spin" />
                  ) : (
                    'Klaim Kode & Mulai'
                  )}
                </button>
              </div>
            </div>

            {errorMsg && <p className="text-red-500 text-xs mt-3">{errorMsg}</p>}
          </div>

        </div>
      </div>
    </>
  );
}

export default function DirectBookingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <DirectBookingContent />
    </Suspense>
  );
}
