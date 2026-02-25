'use client';
import { useState, useEffect, use } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { getDiscPatternName } from '@/utils/scoring';
import { hexaco100Questions } from '@/data/hexaco';

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
      <span className="text-xs text-white font-mono w-10 text-right">{typeof value === 'number' ? value.toFixed(2) : '-'}</span>
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
          />
        </div>
      </div>

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
            <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Tanggal Asesmen</p>
            <p className="text-white">{sub.submittedAt ? new Date(sub.submittedAt).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta', dateStyle: 'long', timeStyle: 'medium' }) + ' WIB' : '-'}</p>
          </div>
        </div>
      </div>

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
            <DiscBar scoreObj={sub.discScores?.discMost} label="Grafik 1 — Mask (Most)" maxVal={24} />
          </div>
          <div className="bg-slate-800/50 rounded-xl p-4">
            <DiscBar scoreObj={sub.discScores?.discLeast} label="Grafik 2 — Core (Least)" maxVal={24} />
          </div>
          <div className="bg-slate-800/50 rounded-xl p-4">
            <DiscBar scoreObj={sub.discScores?.discComposite} label="Grafik 3 — Composite" maxVal={24} />
          </div>
        </div>

        {/* Raw Tally Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-400 text-xs uppercase border-b border-slate-700">
                <th className="text-left px-4 py-2">Dimensi</th>
                <th className="text-center px-4 py-2">Most (G1)</th>
                <th className="text-center px-4 py-2">Least (G2)</th>
                <th className="text-center px-4 py-2">Composite (G3)</th>
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
                  {fm[group.factor]?.toFixed(2) || '-'}
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
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <span className="text-2xl">✨</span> Interpretasi Otomatis (Sistem)
        </h2>
        
        {!sub.aiInsight ? (
          <div className="bg-slate-800/50 rounded-xl p-8 py-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mb-4">
              <span className="text-3xl">🧩</span>
            </div>
            <h3 className="text-white font-medium mb-2">Interpretasi Belum Dibuat</h3>
            <p className="text-slate-400 text-sm max-w-md mx-auto mb-6">
              Klik tombol di bawah ini untuk menghasilkan interpertasi natural secara otomatis dari hasil DISC dan HEXACO klien ini. 
              Gunakan fitur ini sebelum mengunduh PDF agar halaman 2 terisi penuh.
            </p>
            <button 
              onClick={async () => {
                const btn = document.getElementById('btn-gen-ai');
                btn.disabled = true;
                btn.innerHTML = 'Sedang Memproses...';
                try {
                  const r = await fetch(`/api/admin/submissions/${id}/ai`, { method: 'POST' });
                  const j = await r.json();
                  if (j.success) {
                    setSub(prev => ({ ...prev, aiInsight: j.aiInsight }));
                  } else {
                    alert('Gagal menghasilkan interpretasi: ' + j.error);
                    btn.disabled = false;
                    btn.innerHTML = 'Hasilkan Interpretasi Otomatis';
                  }
                } catch (e) {
                  alert('Terjadi kesalahan jaringan.');
                  btn.disabled = false;
                  btn.innerHTML = 'Hasilkan Interpretasi Otomatis';
                }
              }}
              id="btn-gen-ai"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-xl text-sm transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Hasilkan Interpretasi Otomatis
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-slate-800/30 rounded-xl p-5 border border-slate-700/50">
              <h4 className="text-blue-400 font-medium text-sm mb-3">Dinamika Gaya Kerja</h4>
              <p className="text-slate-300 text-sm leading-relaxed">{sub.aiInsight.gayaKerja}</p>
            </div>
            
            <div className="bg-slate-800/30 rounded-xl p-5 border border-slate-700/50">
              <h4 className="text-purple-400 font-medium text-sm mb-3">Dinamika Karakter Inti</h4>
              <p className="text-slate-300 text-sm leading-relaxed">{sub.aiInsight.karakterInti}</p>
            </div>
            
            <div className="bg-slate-800/30 rounded-xl p-5 border border-slate-700/50">
              <h4 className="text-emerald-400 font-medium text-sm mb-3">Rekomendasi Pengembangan</h4>
              <ul className="space-y-2 text-slate-300 text-sm leading-relaxed list-disc list-inside">
                <li>{sub.aiInsight.rekomendasi1}</li>
                <li>{sub.aiInsight.rekomendasi2}</li>
                <li>{sub.aiInsight.rekomendasi3}</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
