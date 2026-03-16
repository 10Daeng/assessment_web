'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Script from 'next/script';

function DirectBookingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultPkg = searchParams.get('pkg') || 'pkg-basic';
  
  const [selectedPkg, setSelectedPkg] = useState(defaultPkg);
  const [voucherCode, setVoucherCode] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Setup form user info
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    age: '',
    organization: ''
  });

  const handleApplyVoucher = async (e) => {
    e.preventDefault();
    if (!voucherCode.trim() || !userInfo.name || !userInfo.email) {
      setErrorMsg('Mohon lengkapi data diri dan kode voucher.');
      return;
    }

    setIsChecking(true);
    setErrorMsg('');

    try {
      // Validate voucher to API
      const res = await fetch('/api/premium/verify-voucher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: voucherCode, packageId: selectedPkg, userInfo })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || 'Voucher tidak valid atau kuota habis.');
      }

      // If success, data.sessionId is returned
      // Redirect to the assessment runner with that session!
      router.push(`/premium/assessment/${data.sessionId}`);
      
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setIsChecking(false);
    }
  };

  const handleCheckout = async (e) => {
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

      // Trigger Snap Popup
      window.snap.pay(data.token, {
        onSuccess: function(result){
          // Cukup redirect ke session runner
          router.push(`/premium/assessment/${data.sessionId}`);
        },
        onPending: function(result){
          alert('Pembayaran tertunda. Silakan selesaikan pembayaran Anda.');
        },
        onError: function(result){
          alert('Pembayaran gagal! Silakan coba lagi.');
        },
        onClose: function(){
          alert('Popup ditutup tanpa menyelesaikan pembayaran.');
        }
      });
      
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setIsCheckoutLoading(false);
    }
  };

  const getWaLink = () => {
    const text = `Halo Admin Lentera Batin, saya ingin membeli akses tes mandiri untuk paket: ${selectedPkg === 'pkg-basic' ? 'Basic (Gaya Kerja)' : 'Reguler (Kepribadian Eksekutif)'}. Mohon info pembayarannya.`;
    return `https://wa.me/6285117778798?text=${encodeURIComponent(text)}`;
  };

  return (
    <>
    <Script src="https://app.sandbox.midtrans.com/snap/snap.js" data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY} strategy="lazyOnload" />
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-8 md:p-12 rounded-3xl shadow-lg border border-slate-100 animate-in fade-in duration-500">
        
        {/* Left Col: Package Selection & WA Buy */}
        <div className="pr-0 md:pr-8 border-r-0 md:border-r border-slate-100">
          <Link href="/premium" className="text-sm text-slate-400 hover:text-blue-500 mb-8 inline-flex items-center gap-1">
            &larr; Kembali
          </Link>
          
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Pilih Paket Asesmen</h2>
          <p className="text-slate-500 mb-6 text-sm">Pilih paket yang ingin Anda ikuti.</p>
          
          <div className="space-y-3 mb-8">
            <label className={`block p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedPkg === 'pkg-basic' ? 'border-blue-500 bg-blue-50' : 'border-slate-100 hover:border-slate-300'}`}>
              <div className="flex items-center justify-between">
                <div className="font-bold text-slate-800">Paket Basic</div>
                <input type="radio" name="pkg" checked={selectedPkg === 'pkg-basic'} onChange={() => setSelectedPkg('pkg-basic')} className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-xs text-slate-500 mt-1">Gaya Kerja (DISC) - Rp 50.000</div>
            </label>

            <label className={`block p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedPkg === 'pkg-reguler' ? 'border-indigo-500 bg-indigo-50' : 'border-slate-100 hover:border-slate-300'}`}>
              <div className="flex items-center justify-between">
                <div className="font-bold text-slate-800">Paket Reguler</div>
                <input type="radio" name="pkg" checked={selectedPkg === 'pkg-reguler'} onChange={() => setSelectedPkg('pkg-reguler')} className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="text-xs text-slate-500 mt-1 flex flex-col">
                <span>Kepribadian Eksekutif (DISC + HEXACO) - Rp 150.000</span>
                <span className="text-xs font-semibold text-indigo-600 mt-1">⭐ Paling Detail</span>
              </div>
            </label>
          </div>

          <div className="bg-orange-50 border border-orange-100 p-5 rounded-2xl">
            <h3 className="font-bold text-orange-800 text-sm mb-2">Belum punya Voucher?</h3>
            <p className="text-xs text-orange-700 mb-4">Untuk pendaftar mandiri (B2C), silakan lakukan pembayaran manual via WhatsApp ke Admin kami. Voucher akan segera diberikan setelah pembayaran dikonfirmasi.</p>
            <a href={getWaLink()} target="_blank" rel="noopener noreferrer" className="block text-center w-full bg-[#25D366] text-white font-bold py-2.5 rounded-xl text-sm shadow-sm hover:shadow-md transition">
              Beli Voucher via WA
            </a>
          </div>
        </div>

        {/* Right Col: Enter Voucher */}
        <div className="pt-4 md:pt-12">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Mulai Asesmen</h2>
          <p className="text-slate-500 mb-6 text-sm">Lengkapi data diri dan masukkan kode voucher (B2B/B2C).</p>

          <form onSubmit={handleApplyVoucher} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Nama Lengkap *</label>
              <input type="text" value={userInfo.name} onChange={e => setUserInfo({...userInfo, name: e.target.value})} required className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:border-blue-500" placeholder="John Doe" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Email Aktif * <span className="text-slate-400 font-normal">(Hasil pdf dikirim ke sini)</span></label>
              <input type="email" value={userInfo.email} onChange={e => setUserInfo({...userInfo, email: e.target.value})} required className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:border-blue-500" placeholder="john@example.com" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Usia</label>
                <input type="number" value={userInfo.age} onChange={e => setUserInfo({...userInfo, age: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:border-blue-500" placeholder="25" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Instansi / Kampus</label>
                <input type="text" value={userInfo.organization} onChange={e => setUserInfo({...userInfo, organization: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:border-blue-500" placeholder="PT ABC..." />
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-4">
               {/* PILIHAN 1: BAYAR LANGSUNG (MIDTRANS) */}
               <div className="flex-1 bg-blue-50/50 p-4 border border-blue-100 rounded-2xl">
                  <h3 className="text-sm font-bold text-slate-800 mb-1">Belum punya Voucher?</h3>
                  <p className="text-xs text-slate-500 mb-3">Bayar otomatis sekarang pakai QRIS / Transfer / E-Wallet.</p>
                  <button 
                    onClick={handleCheckout} 
                    type="button"
                    disabled={isCheckoutLoading}
                    className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition flex justify-center items-center h-12 text-sm shadow-md"
                  >
                    {isCheckoutLoading ? (
                      <div className="w-5 h-5 border-2 border-blue-300 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      'Bayar Instan & Mulai'
                    )}
                  </button>
               </div>

               {/* PILIHAN 2: PAKAI VOUCHER */}
               <div className="flex-1 bg-slate-50 p-4 border border-slate-200 rounded-2xl">
                  <h3 className="text-sm font-bold text-slate-800 mb-1">Punya Voucher?</h3>
                  <p className="text-xs text-slate-500 mb-2">Tukarkan token dari instansi / HRD Anda.</p>
                  <input 
                    type="text" 
                    value={voucherCode} 
                    onChange={e => setVoucherCode(e.target.value.toUpperCase())} 
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
                      <div className="w-5 h-5 border-2 border-slate-500 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      'Klaim Kode & Mulai'
                    )}
                  </button>
               </div>
            </div>
            {errorMsg && <p className="text-red-500 text-xs mt-2">{errorMsg}</p>}
          </form>
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
