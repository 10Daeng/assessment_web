'use client';
import { useState, useEffect, use } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { getDiscPatternName } from '@/utils/scoring';
import { hexaco100Questions } from '@/data/hexaco';
import { calculateValidityIndex } from '@/utils/validityCheck';

const PDFExport = dynamic(() => import('@/components/PDFExport'), { ssr: false });

const hexacoStructure = [
  { factor: 'H', name: 'Honesty-Humility', color: '#8e44ad', facets: [
    { k: 'sinc', n: 'Sincerity' }, { k: 'fair', n: 'Fairness' }, { k: 'gree', n: 'Greed Avoidance' }, { k: 'mode', n: 'Modesty' }
  ]},
  { factor: 'E', name: 'Emotionality', color: '#c0392b', facets: [
    { k: 'fear', n: 'Fearfulness' }, { k: 'anxi', n: 'Anxiety' }, { k: 'depe', n: 'Dependence' }, { k: 'sent', n: 'Sentimentality' }
  ]},
  { factor: 'X', name: 'eXtraversion', color: '#2980b9', facets: [
    { k: 'sses', n: 'Social Self-Esteem' }, { k: 'socb', n: 'Social Boldness' }, { k: 'soci', n: 'Sociability' }, { k: 'live', n: 'Liveliness' }
  ]},
  { factor: 'A', name: 'Agreeableness', color: '#27ae60', facets: [
    { k: 'forg', n: 'Forgivingness' }, { k: 'gent', n: 'Gentleness' }, { k: 'flex', n: 'Flexibility' }, { k: 'pati', n: 'Patience' }
  ]},
  { factor: 'C', name: 'Conscientiousness', color: '#d35400', facets: [
    { k: 'orga', n: 'Organization' }, { k: 'dili', n: 'Diligence' }, { k: 'perf', n: 'Perfectionism' }, { k: 'prud', n: 'Prudence' }
  ]},
  { factor: 'O', name: 'Openness', color: '#16a085', facets: [
    { k: 'aesa', n: 'Aesthetic Appreciation' }, { k: 'inqu', n: 'Inquisitiveness' }, { k: 'crea', n: 'Creativity' }, { k: 'unco', n: 'Unconventionality' }
  ]},
];

const discLabels = { D: 'Dominance', I: 'Influence', S: 'Steadiness', C: 'Compliance' };
const discColors = { D: '#e74c3c', I: '#f1c40f', S: '#2ecc71', C: '#3498db' };

function BarChart({ value, max, color, label }) {
  const pct = max > 0 ? Math.max(0, Math.min(100, ((value - 1) / (max - 1)) * 100)) : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-slate-400 w-28 text-right shrink-0">{label}</span>
      <div className="flex-1 h-3 bg-slate-800 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: color }}></div>
      </div>
      <span className="text-xs text-white font-mono w-10 text-right">{Math.round(pct)}%</span>
    </div>
  );
}

function DiscBar({ scoreObj, label, maxVal }) {
  return (
    <div className="space-y-2">
      <h4 className="text-xs text-slate-400 font-bold uppercase tracking-wider">{label}</h4>
      {['D', 'I', 'S', 'C'].map(t => {
        const raw = scoreObj?.[t] || 0;
        const shifted = raw + maxVal;
        const total = maxVal * 2;
        const pct = Math.max(0, (shifted / total) * 100);
        return (
          <div key={t} className="flex items-center gap-3">
            <span className="text-xs font-bold w-24 text-right" style={{ color: discColors[t] }}>{discLabels[t]}</span>
            <div className="flex-1 h-3 bg-slate-800 rounded-full overflow-hidden relative">
              <div className="absolute left-1/2 top-0 w-px h-full bg-slate-600 z-10"></div>
              <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: discColors[t] }}></div>
            </div>
            <span className="text-xs text-white font-mono w-8 text-right">{raw > 0 ? `+${raw}` : raw}</span>
          </div>
        );
      })}
    </div>
  );
}

export default function ReportDetailPage({ params }) {
  const { id } = use(params);
  const [sub, setSub] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper to trigger raw data download
  const downloadRawData = () => {
    if (!sub || !sub.rawData) return;
    
    // Construct CSV Header
    let csv = "Item,Dimensi,Jawaban (Skor 1-5)\n";
    
    // Append DISC answers (if any)
    const discAnswers = sub.rawData.answers?.disc || sub.rawData.answers_disc;
    if (discAnswers) {
      for (let i = 1; i <= Object.keys(discAnswers || {}).length; i++) {
        const d = discAnswers[i];
        if (d) {
          csv += `DISC No. ${i},Most: ${d.most || '-'} | Least: ${d.least || '-'},\n`;
        }
      }
    }
    
    // Append HEXACO answers
    const hexacoAnswers = sub.rawData.answers?.hexaco || sub.rawData.answers_hexaco;
    if (hexacoAnswers) {
      for (let i = 1; i <= 100; i++) {
        const h = hexacoAnswers[i];
        // Find if this question is reversed
        const questionDef = hexaco100Questions.find(q => q.id === i);
        const isRev = questionDef?.isReverse ? '*' : '';
        
        csv += `HEXACO No. ${i}${isRev},-,${h || '-'}\n`;
      }
    }

    // Create and trigger download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `RawData_${sub.userData?.nama || 'Klien'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    fetch(`/api/admin/submissions/${id}`)
      .then(r => r.json())
      .then(json => { setSub(json.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!sub) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-400 text-lg">Data tidak ditemukan.</p>
        <Link href="/admin/reports" className="text-blue-400 hover:underline text-sm mt-4 inline-block">← Kembali</Link>
      </div>
    );
  }

  const fm = sub.hexacoScores?.factorMeans || {};
  const facetM = sub.hexacoScores?.facetMeans || {};

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Back + Actions */}
      <div className="flex items-center justify-between">
        <Link href="/admin/reports" className="text-slate-400 hover:text-white text-sm flex items-center gap-2 transition-colors">
          ← Kembali ke Daftar
        </Link>
        <div className="flex items-center gap-3">
          <button 
            onClick={downloadRawData}
            className="text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white px-4 py-2 rounded-xl text-xs font-medium transition-all"
            title="Download jawaban asli per butir soal (CSV)"
          >
            ↓ Data Mentah (CSV)
          </button>
          <PDFExport
            userData={sub.userData}
            discScores={sub.discScores}
            hexacoScores={sub.hexacoScores}
            aiInsight={sub.aiInsight}
            submittedAt={sub.submittedAt}
            rawData={sub.rawData}
          />
        </div>
      </div>

      {/* VALIDITY ALERT */}
      {(() => {
        const validity = calculateValidityIndex(sub.rawData, sub);
        if (validity.overallScore < 60) {
          return (
            <div className="bg-red-500/10 border border-red-500/50 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
              <span className="text-4xl mb-3">⚠️</span>
              <h3 className="text-red-400 font-bold text-lg mb-1">Peringatan: Asesmen Meragukan / Tidak Valid!</h3>
              <p className="text-red-300 text-sm max-w-2xl">
                Tingkat validitas pengerjaan tes ini berada di angka <b>{validity.overallScore}/100</b> ({validity.overallLabel}). 
                Sistem mendeteksi bahwa responden mungkin mengisi secara asal-asalan, durasi terlalu cepat, atau terdapat inkonsistensi yang tinggi.
                Interpretasi AI di bawah ini mungkin <b>tidak akurat</b>. Disarankan untuk meminta klien melakukan tes ulang.
              </p>
            </div>
          );
        }
        return null;
      })()}

      {/* Identity Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Nama Lengkap</p>
            <p className="text-white font-semibold">{sub.userData?.nama || '-'}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Email / NIK</p>
            <p className="text-white">{sub.userData?.email || '-'}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Usia</p>
            <p className="text-white">{sub.userData?.usia ? `${sub.userData.usia} tahun` : '-'}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Asal Instansi</p>
            <p className="text-white">{sub.userData?.instansi || '-'}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Pekerjaan / Jabatan</p>
            <p className="text-white">{[sub.userData?.pekerjaan, sub.userData?.jabatan].filter(Boolean).join(' — ') || '-'}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Durasi Pengerjaan</p>
            <p className="text-white">{sub.rawData?.userData?.durasi || 'Tidak diketahui'}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Tanggal Asesmen</p>
            <p className="text-white">{sub.submittedAt ? new Date(sub.submittedAt).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta', dateStyle: 'long', timeStyle: 'medium' }) + ' WIB' : '-'}</p>
          </div>
        </div>
      </div>

      {/* VALIDITY INDEX Section */}
      {(() => {
        const validity = calculateValidityIndex(sub.rawData, sub);
        return (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">🛡️ Indeks Validitas Isian</h2>
              <span className="font-bold px-5 py-1.5 rounded-full text-sm" style={{ backgroundColor: validity.overallColor + '25', color: validity.overallColor }}>
                {validity.overallScore}/100 — {validity.overallLabel}
              </span>
            </div>

            {/* Overall progress bar */}
            <div className="w-full h-4 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-700" style={{ width: `${validity.overallScore}%`, backgroundColor: validity.overallColor }}></div>
            </div>

            {/* Indicators Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {[
                { icon: '⏱️', title: 'Durasi Pengerjaan', data: validity.indicators.duration },
                { icon: '📏', title: 'Keseragaman Jawaban (HEXACO)', data: validity.indicators.straightLining },
                { icon: '⚡', title: 'Jawaban Ekstrem (HEXACO)', data: validity.indicators.extreme },
                { icon: '🔄', title: 'Konsistensi Internal (HEXACO)', data: validity.indicators.inconsistency },
                { icon: '🎭', title: 'Konsistensi Publik vs Pribadi (DISC)', data: validity.indicators.discOverShift },
                { icon: '📊', title: 'Ketegasan Pola (DISC)', data: validity.indicators.discUndifferentiated },
              ].map(({ icon, title, data }) => {
                const unavailable = data.score < 0;
                const sc = unavailable ? 0 : data.score;
                const getColor = (s) => unavailable ? '#6b7280' : s >= 85 ? '#22c55e' : s >= 60 ? '#eab308' : s >= 30 ? '#f97316' : '#ef4444';
                const col = getColor(sc);
                return (
                  <div key={title} className="bg-slate-800/60 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-white font-medium">{icon} {title}</span>
                      <span className="text-xs font-mono px-2 py-0.5 rounded-md" style={{ backgroundColor: col + '25', color: col }}>
                        {unavailable ? '—' : `${sc}/100`} — {data.label}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden mb-2">
                      <div className="h-full rounded-full transition-all" style={{ width: unavailable ? '0%' : `${sc}%`, backgroundColor: col }}></div>
                    </div>
                    <p className="text-xs text-slate-400">
                      {data.detail}
                      {data.mode === 'facet' && <span className="text-blue-400/60 ml-1">[Estimasi]</span>}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}

      {/* DISC Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Profil Gaya Kerja (DISC)</h2>
          <span className="bg-blue-500/20 text-blue-400 font-bold px-4 py-1.5 rounded-full text-sm">
            Pola: {getDiscPatternName(sub.discScores?.pattern)} ({sub.discScores?.pattern || '-'})
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-800/50 rounded-xl p-4">
            <DiscBar scoreObj={sub.discScores?.discMost} label="Grafik 1 — Publik (Mask)" maxVal={24} />
          </div>
          <div className="bg-slate-800/50 rounded-xl p-4">
            <DiscBar scoreObj={sub.discScores?.discLeast} label="Grafik 2 — Pribadi (Core)" maxVal={24} />
          </div>
          <div className="bg-slate-800/50 rounded-xl p-4">
            <DiscBar scoreObj={sub.discScores?.discComposite} label="Grafik 3 — Aktual (Composite)" maxVal={24} />
          </div>
        </div>

        {/* Raw Tally Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-400 text-xs uppercase border-b border-slate-700">
                <th className="text-left px-4 py-2">Dimensi</th>
                <th className="text-center px-4 py-2">Publik (G1)</th>
                <th className="text-center px-4 py-2">Pribadi (G2)</th>
                <th className="text-center px-4 py-2">Aktual (G3)</th>
              </tr>
            </thead>
            <tbody>
              {['D', 'I', 'S', 'C'].map(t => (
                <tr key={t} className="border-b border-slate-800/50">
                  <td className="px-4 py-3 font-semibold" style={{ color: discColors[t] }}>{discLabels[t]} ({t})</td>
                  <td className="px-4 py-3 text-center text-white font-mono">{sub.discScores?.discMost?.[t] ?? '-'}</td>
                  <td className="px-4 py-3 text-center text-white font-mono">{sub.discScores?.discLeast?.[t] ?? '-'}</td>
                  <td className="px-4 py-3 text-center text-white font-mono font-bold">
                    {(() => { const v = sub.discScores?.discComposite?.[t]; return v > 0 ? `+${v}` : v; })()}
                  </td>
                </tr>
              ))}
              <tr className="border-t border-slate-600">
                <td className="px-4 py-2 text-slate-500 text-xs">Total</td>
                <td className="px-4 py-2 text-center text-slate-400 font-mono text-xs">
                  {Object.values(sub.discScores?.discMost || {}).reduce((a, b) => a + b, 0)}
                </td>
                <td className="px-4 py-2 text-center text-slate-400 font-mono text-xs">
                  {Object.values(sub.discScores?.discLeast || {}).reduce((a, b) => a + b, 0)}
                </td>
                <td className="px-4 py-2 text-center text-slate-400 font-mono text-xs">
                  {Object.values(sub.discScores?.discComposite || {}).reduce((a, b) => a + b, 0)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* HEXACO Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
        <h2 className="text-lg font-bold text-white">Profil Karakter (HEXACO 100)</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {hexacoStructure.map(group => (
            <div key={group.factor} className="bg-slate-800/50 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-bold text-white text-sm">{group.name}</h3>
                <span className="font-mono text-sm px-3 py-0.5 rounded-full" style={{ backgroundColor: group.color + '30', color: group.color }}>
                  {fm[group.factor] ? `${Math.round(((fm[group.factor] - 1) / 4) * 100)}%` : '-'}
                </span>
              </div>
              {/* Factor bar */}
              <BarChart value={fm[group.factor] || 1} max={5} color={group.color} label="Skor Dimensi" />
              {/* Facet bars */}
              {group.facets.map(f => (
                <BarChart key={f.k} value={facetM[f.k] || 1} max={5} color={group.color + 'aa'} label={f.n} />
              ))}
            </div>
          ))}
        </div>

        {/* Altruism */}
        <div className="bg-slate-800/50 rounded-xl p-5">
          <h3 className="font-bold text-white text-sm mb-3">Altruism (Interstitial)</h3>
          <BarChart value={facetM.altr || 1} max={5} color="#e67e22" label="Skor Altruism" />
        </div>
      </div>

      {/* AI Insight Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="text-2xl">✨</span> Interpretasi Otomatis (Sistem)
          </h2>
          <button 
            onClick={async () => {
              const btn = document.getElementById('btn-gen-ai');
              const ogText = btn.innerHTML;
              btn.disabled = true;
              btn.innerHTML = '⏳ Memproses... (±30 detik)';
              const ac = new AbortController();
              const t = setTimeout(() => ac.abort(), 65000);
              try {
                const r = await fetch(`/api/admin/submissions/${id}/ai`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ force: true }),
                  signal: ac.signal
                });
                clearTimeout(t);
                const j = await r.json();
                if (j.success) {
                  setSub(prev => ({ ...prev, aiInsight: j.aiInsight }));
                  btn.innerHTML = 'Berhasil Diperbarui ✅';
                  setTimeout(() => { if(btn) btn.innerHTML = ogText; btn.disabled = false; }, 3000);
                } else {
                  alert('Gagal: ' + j.error);
                  btn.disabled = false;
                  btn.innerHTML = ogText;
                }
              } catch (_e) {
                clearTimeout(t);
                alert(_e.name === 'AbortError' ? 'Timeout: server terlalu lama merespons. Coba lagi.' : 'Kesalahan jaringan.');
                btn.disabled = false;
                btn.innerHTML = ogText;
              }
            }}
            id="btn-gen-ai"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg text-xs transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Hasilkan Ulang Interpretasi
          </button>
        </div>
        
        {!sub.aiInsight ? (
          <div className="bg-slate-800/50 rounded-xl p-8 py-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mb-4">
              <span className="text-3xl">🧩</span>
            </div>
            <h3 className="text-white font-medium mb-2">Interpretasi Belum Tersedia</h3>
            <p className="text-slate-400 text-sm max-w-md mx-auto mb-6">
              Sistem AI belum menghasilkan interpretasi untuk laporan ini. Silakan klik tombol "Hasilkan Ulang Interpretasi" di atas.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-slate-800/30 rounded-xl p-5 border border-slate-700/50">
              <h4 className="text-yellow-400 font-medium text-sm mb-3">Arketipe Personal</h4>
              <p className="text-slate-300 text-sm font-semibold whitespace-pre-line">{sub.aiInsight.arketipe_personal || sub.aiInsight.arketipe}</p>
            </div>
            
            <div className="bg-slate-800/30 rounded-xl p-5 border border-slate-700/50">
              <h4 className="text-blue-400 font-medium text-sm mb-3">Deskripsi Kepribadian Terintegrasi</h4>
              <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">{sub.aiInsight.deskripsi_kepribadian_terintegrasi || sub.aiInsight.deskripsi_kepribadian}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-800/30 rounded-xl p-5 border border-slate-700/50">
                <h4 className="text-emerald-400 font-medium text-sm mb-3">Kekuatan Utama</h4>
                <ul className="text-slate-300 text-sm leading-relaxed space-y-2 list-disc ml-4">
                  {(sub.aiInsight.kekuatan_utama || []).map((k, i) => <li key={i}>{k}</li>)}
                </ul>
              </div>

              <div className="bg-slate-800/30 rounded-xl p-5 border border-slate-700/50">
                <h4 className="text-rose-400 font-medium text-sm mb-3">Analisis Lingkungan Ideal</h4>
                <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line mb-4">
                  <span className="font-bold text-white">Ekosistem Kerja:</span> {sub.aiInsight.analisis_lingkungan_ideal?.ekosistem_kerja}
                </p>
                <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                  <span className="font-bold text-white">Bahan Bakar Psikologis:</span> {sub.aiInsight.analisis_lingkungan_ideal?.kebutuhan_motivasi}
                </p>
              </div>
            </div>

            <div className="bg-slate-800/30 rounded-xl p-5 border border-slate-700/50">
              <h4 className="text-purple-400 font-medium text-sm mb-4">Tantangan & Faktor Penghambat</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-800/50 p-4 rounded-lg">
                   <h5 className="text-slate-200 font-medium text-xs mb-2">Komunikasi & Pola Kerja</h5>
                   <p className="text-slate-300 text-sm">{sub.aiInsight.tantangan_dan_faktor_penghambat?.komunikasi_dan_pola_kerja}</p>
                </div>
                <div className="bg-slate-800/50 p-4 rounded-lg">
                   <h5 className="text-slate-200 font-medium text-xs mb-2">Hambatan Karakter Internal</h5>
                   <p className="text-slate-300 text-sm">{sub.aiInsight.tantangan_dan_faktor_penghambat?.hambatan_karakter_internal}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-800/30 rounded-xl p-5 border border-slate-700/50">
                <h4 className="text-amber-400 font-medium text-sm mb-3">Peran Potensial dalam Tim</h4>
                <div className="space-y-4">
                  {(sub.aiInsight.peran_potensial_dalam_tim || sub.aiInsight.peta_potensi_peran || []).map((p, i) => (
                    <div key={i} className="bg-slate-800/50 p-3 rounded-lg border-l-2 border-amber-500/50">
                      <p className="text-white font-semibold text-sm mb-1">{p.peran || p.tipe_arketipe}</p>
                      <p className="text-slate-400 text-xs leading-relaxed">{p.alasan}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-800/30 rounded-xl p-5 border border-slate-700/50">
                <h4 className="text-teal-400 font-medium text-sm mb-3">Saran Pengembangan Spesifik</h4>
                <ul className="text-slate-300 text-sm leading-relaxed space-y-3 list-decimal ml-4">
                  {(sub.aiInsight.saran_pengembangan_spesifik || []).map((k, i) => <li key={i}>{k}</li>)}
                </ul>
              </div>
            </div>

            {/* Regenerate Button */}
            <div className="flex justify-center pt-2">
              <button
                id="btn-regen-ai"
                onClick={async () => {
                  const btn = document.getElementById('btn-regen-ai');
                  btn.disabled = true;
                  btn.innerHTML = '⏳ Memproses... (±30 detik)';
                  const ac = new AbortController();
                  const t = setTimeout(() => ac.abort(), 65000);
                  try {
                    const r = await fetch(`/api/admin/submissions/${id}/ai`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ force: true }),
                      signal: ac.signal
                    });
                    clearTimeout(t);
                    const j = await r.json();
                    if (j.success) {
                      setSub(prev => ({ ...prev, aiInsight: j.aiInsight }));
                    } else {
                      alert('Gagal: ' + j.error);
                    }
                  } catch (_e) {
                    clearTimeout(t);
                    alert(_e.name === 'AbortError' ? 'Timeout: coba lagi.' : 'Kesalahan jaringan.');
                  }
                  btn.disabled = false;
                  btn.innerHTML = '🔄 Hasilkan Ulang Interpretasi';
                }}
                className="bg-slate-700 hover:bg-slate-600 text-white font-medium py-2.5 px-6 rounded-xl text-sm transition-all flex items-center gap-2 disabled:opacity-50"
              >
                🔄 Hasilkan Ulang Interpretasi
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
