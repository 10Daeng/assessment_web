'use client';
import { useState, useEffect, useMemo } from 'react';
import * as XLSX from 'xlsx';
import { calculateValidityIndex } from '@/utils/validityCheck';
import { getDiscPatternName } from '@/utils/scoring';

const HEXACO_LABELS = {
  H: 'Integritas',
  E: 'Stabilitas Emosi',
  X: 'Energi Sosial',
  A: 'Kesabaran',
  C: 'Disiplin',
  O: 'Kreativitas',
};

const HEXACO_FACETS = {
  H: ['sinc', 'fair', 'gree', 'mode'],
  E: ['fear', 'anxi', 'depe', 'sent'],
  X: ['sest', 'sobo', 'soci', 'live'],
  A: ['forg', 'gent', 'flex', 'pati'],
  C: ['orga', 'dili', 'perf', 'prud'],
  O: ['aest', 'inqu', 'crea', 'unco'],
};

const FACET_NAMES = {
  sinc: 'Sincerity', fair: 'Fairness', gree: 'Greed Avoidance', mode: 'Modesty',
  fear: 'Fearfulness', anxi: 'Anxiety', depe: 'Dependence', sent: 'Sentimentality',
  sest: 'Social Self-Esteem', sobo: 'Social Boldness', soci: 'Sociability', live: 'Liveliness',
  forg: 'Forgiveness', gent: 'Gentleness', flex: 'Flexibility', pati: 'Patience',
  orga: 'Organization', dili: 'Diligence', perf: 'Perfectionism', prud: 'Prudence',
  aest: 'Aesthetic Appreciation', inqu: 'Inquisitiveness', crea: 'Creativity', unco: 'Unconventionality',
};

function getLevel(mean) {
  if (mean >= 4) return { label: 'Tinggi', cls: 'text-emerald-400', bg: 'bg-emerald-500' };
  if (mean >= 2.5) return { label: 'Sedang', cls: 'text-blue-400', bg: 'bg-blue-500' };
  return { label: 'Rendah', cls: 'text-amber-400', bg: 'bg-amber-500' };
}

export default function ProfilOrganisasiPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInstansi, setSelectedInstansi] = useState('');
  const [expandedDisc, setExpandedDisc] = useState(null);
  const [expandedArketipe, setExpandedArketipe] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/admin/submissions');
        const json = await res.json();
        setData(json.data || []);
      } catch (e) {
        console.error('Failed to load:', e);
      }
      setLoading(false);
    }
    load();
  }, []);

  const instansiList = useMemo(() => {
    return [...new Set(data.map(d => d.userData?.instansi).filter(Boolean))].sort();
  }, [data]);

  const filtered = useMemo(() => {
    if (!selectedInstansi) return data;
    return data.filter(d => d.userData?.instansi === selectedInstansi);
  }, [data, selectedInstansi]);

  // === AGGREGATIONS ===

  const stats = useMemo(() => {
    const total = filtered.length;
    const jabatanSet = new Set(filtered.map(d => d.userData?.jabatan).filter(Boolean));
    const validScores = filtered.map(d => {
      const v = calculateValidityIndex(d.rawData, d);
      return typeof v.overallScore === 'number' ? v.overallScore : null;
    }).filter(v => v !== null);
    const avgValidity = validScores.length > 0 ? (validScores.reduce((a, b) => a + b, 0) / validScores.length).toFixed(1) : '-';
    const latestDate = filtered.reduce((max, d) => {
      const dt = d.submittedAt || '';
      return dt > max ? dt : max;
    }, '');
    return { total, jabatanCount: jabatanSet.size, avgValidity, latestDate };
  }, [filtered]);

  // DISC Distribution
  const discDist = useMemo(() => {
    const map = {};
    filtered.forEach(d => {
      const pat = d.discScores?.pattern;
      if (pat) {
        if (!map[pat]) map[pat] = { count: 0, names: [] };
        map[pat].count++;
        map[pat].names.push(d.userData?.nama || 'Anonim');
      }
    });
    return Object.entries(map)
      .map(([pattern, v]) => ({ pattern, fullName: getDiscPatternName(pattern), ...v, pct: ((v.count / filtered.length) * 100).toFixed(1) }))
      .sort((a, b) => b.count - a.count);
  }, [filtered]);

  // Arketipe Distribution
  const arketipeDist = useMemo(() => {
    const map = {};
    filtered.forEach(d => {
      const ai = d.aiInsight;
      const ark = ai?.arketipe_personal || ai?.arketipe;
      if (ark) {
        if (!map[ark]) map[ark] = { count: 0, names: [] };
        map[ark].count++;
        map[ark].names.push(d.userData?.nama || 'Anonim');
      }
    });
    return Object.entries(map)
      .map(([arketipe, v]) => ({ arketipe, ...v, pct: ((v.count / filtered.length) * 100).toFixed(1) }))
      .sort((a, b) => b.count - a.count);
  }, [filtered]);

  // HEXACO Averages
  const hexacoAvg = useMemo(() => {
    const dims = {};
    Object.keys(HEXACO_LABELS).forEach(k => {
      const values = filtered.map(d => d.hexacoScores?.factorMeans?.[k]).filter(v => typeof v === 'number');
      dims[k] = values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;
    });
    return dims;
  }, [filtered]);

  // HEXACO Facet Averages
  const facetAvg = useMemo(() => {
    const result = {};
    Object.entries(HEXACO_FACETS).forEach(([dim, facets]) => {
      result[dim] = facets.map(f => {
        const values = filtered.map(d => d.hexacoScores?.facetMeans?.[f]).filter(v => typeof v === 'number');
        const avg = values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;
        return { key: f, name: FACET_NAMES[f] || f, avg };
      });
    });
    return result;
  }, [filtered]);

  // Top/Bottom facets
  const allFacets = useMemo(() => {
    const list = [];
    Object.entries(facetAvg).forEach(([dim, facets]) => {
      facets.forEach(f => list.push({ ...f, dim }));
    });
    return list.sort((a, b) => b.avg - a.avg);
  }, [facetAvg]);

  // Peran Distribution
  const peranDist = useMemo(() => {
    const map = {};
    filtered.forEach(d => {
      const roles = d.aiInsight?.peta_potensi_peran;
      if (Array.isArray(roles)) {
        roles.forEach(r => {
          const tipe = r.tipe_arketipe;
          if (tipe) {
            if (!map[tipe]) map[tipe] = { count: 0, names: [] };
            map[tipe].count++;
            const nama = d.userData?.nama || 'Anonim';
            if (!map[tipe].names.includes(nama)) map[tipe].names.push(nama);
          }
        });
      }
    });
    return Object.entries(map)
      .map(([tipe, v]) => ({ tipe, ...v }))
      .sort((a, b) => b.count - a.count);
  }, [filtered]);

  // Kekuatan & Tantangan keywords
  const kekuatanKeywords = useMemo(() => {
    const map = {};
    filtered.forEach(d => {
      const k = d.aiInsight?.kekuatan_utama;
      if (Array.isArray(k)) {
        k.forEach(item => {
          const short = item.length > 60 ? item.substring(0, 60) + '...' : item;
          map[short] = (map[short] || 0) + 1;
        });
      }
    });
    return Object.entries(map).sort(([,a], [,b]) => b - a).slice(0, 8);
  }, [filtered]);

  const tantanganKeywords = useMemo(() => {
    const items = [];
    filtered.forEach(d => {
      const t = d.aiInsight?.tantangan_dan_faktor_penghambat;
      if (t) {
        if (t.komunikasi_dan_pola_kerja) items.push(t.komunikasi_dan_pola_kerja);
        if (t.hambatan_karakter_internal) items.push(t.hambatan_karakter_internal);
      }
    });
    const map = {};
    items.forEach(item => {
      const short = item.length > 60 ? item.substring(0, 60) + '...' : item;
      map[short] = (map[short] || 0) + 1;
    });
    return Object.entries(map).sort(([,a], [,b]) => b - a).slice(0, 8);
  }, [filtered]);

  // Excel Export
  const downloadExcel = () => {
    if (filtered.length === 0) return;
    const rows = filtered.map((sub, i) => {
      const ud = sub.userData || {};
      const ai = sub.aiInsight || {};
      const fm = sub.hexacoScores?.factorMeans || {};
      return {
        "No": i + 1,
        "Nama": ud.nama || '-',
        "Instansi": ud.instansi || '-',
        "Jabatan": ud.jabatan || '-',
        "Pola DISC": sub.discScores?.pattern || '-',
        "Arketipe": ai.arketipe_personal || ai.arketipe || '-',
        "H": fm.H?.toFixed(2) || '-', "E": fm.E?.toFixed(2) || '-',
        "X": fm.X?.toFixed(2) || '-', "A": fm.A?.toFixed(2) || '-',
        "C": fm.C?.toFixed(2) || '-', "O": fm.O?.toFixed(2) || '-',
        "Kekuatan": Array.isArray(ai.kekuatan_utama) ? ai.kekuatan_utama.join('; ') : '-',
        "Tantangan": ai.tantangan_dan_faktor_penghambat ? `${ai.tantangan_dan_faktor_penghambat.komunikasi_dan_pola_kerja || ''} | ${ai.tantangan_dan_faktor_penghambat.hambatan_karakter_internal || ''}` : '-',
        "Peran Potensial": Array.isArray(ai.peta_potensi_peran) ? ai.peta_potensi_peran.map(p => p.tipe_arketipe).join(', ') : '-',
      };
    });
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Profil Organisasi");
    ws['!cols'] = Object.keys(rows[0]).map(() => ({ wch: 20 }));
    XLSX.writeFile(wb, `Profil_Organisasi_${selectedInstansi || 'Semua'}_${new Date().toISOString().slice(0,10)}.xlsx`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Profil Organisasi</h2>
          <p className="text-slate-400 text-sm mt-1">Analisis manajerial komposisi tim berdasarkan data asesmen psikometrik</p>
        </div>
        <div className="flex gap-3">
          <select
            value={selectedInstansi}
            onChange={e => setSelectedInstansi(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-white px-4 py-3 rounded-xl text-sm focus:border-blue-500 outline-none min-w-[220px]"
          >
            <option value="">Semua Instansi ({data.length})</option>
            {instansiList.map(inst => (
              <option key={inst} value={inst}>{inst} ({data.filter(d => d.userData?.instansi === inst).length})</option>
            ))}
          </select>
          <button
            onClick={downloadExcel}
            className="bg-emerald-600/20 border border-emerald-500/30 hover:bg-emerald-600/30 text-emerald-400 font-bold py-2.5 px-5 rounded-xl text-sm transition-all flex items-center gap-2 whitespace-nowrap"
          >
            📥 Export Excel
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/10 border border-blue-500/20 rounded-2xl p-5">
          <p className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-1">Total Personel</p>
          <p className="text-3xl font-extrabold text-white">{stats.total}</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-600/20 to-emerald-800/10 border border-emerald-500/20 rounded-2xl p-5">
          <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-1">Rata-rata Validitas</p>
          <p className="text-3xl font-extrabold text-white">{stats.avgValidity}<span className="text-lg text-slate-400">%</span></p>
        </div>
        <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/10 border border-purple-500/20 rounded-2xl p-5">
          <p className="text-purple-400 text-xs font-bold uppercase tracking-widest mb-1">Jumlah Jabatan</p>
          <p className="text-3xl font-extrabold text-white">{stats.jabatanCount}</p>
        </div>
        <div className="bg-gradient-to-br from-amber-600/20 to-amber-800/10 border border-amber-500/20 rounded-2xl p-5">
          <p className="text-amber-400 text-xs font-bold uppercase tracking-widest mb-1">Asesmen Terakhir</p>
          <p className="text-lg font-bold text-white">
            {stats.latestDate ? new Date(stats.latestDate).toLocaleDateString('id-ID', { dateStyle: 'medium' }) : '-'}
          </p>
        </div>
      </div>

      {/* DISC Distribution + Arketipe */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* DISC */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">📊 Distribusi Pola DISC</h3>
          {discDist.length === 0 ? (
            <p className="text-slate-500 text-sm">Belum ada data DISC.</p>
          ) : (
            <div className="space-y-3">
              {discDist.map(d => (
                <div key={d.pattern}>
                  <div
                    className="flex items-center justify-between cursor-pointer hover:bg-slate-800/50 rounded-lg px-3 py-2 transition-colors"
                    onClick={() => setExpandedDisc(expandedDisc === d.pattern ? null : d.pattern)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="bg-blue-500/20 text-blue-400 font-bold px-2.5 py-0.5 rounded-full text-xs">{d.pattern}</span>
                      <span className="text-slate-300 text-sm">{d.fullName}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${d.pct}%` }}></div>
                      </div>
                      <span className="text-white font-bold text-sm w-8 text-right">{d.count}</span>
                      <span className="text-slate-500 text-xs w-12 text-right">{d.pct}%</span>
                      <span className="text-slate-600 text-xs">{expandedDisc === d.pattern ? '▲' : '▼'}</span>
                    </div>
                  </div>
                  {expandedDisc === d.pattern && (
                    <div className="ml-6 mt-1 mb-2 flex flex-wrap gap-1.5">
                      {d.names.map((n, i) => (
                        <span key={i} className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-xs">{n}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Arketipe */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">🎭 Distribusi Arketipe AI</h3>
          {arketipeDist.length === 0 ? (
            <p className="text-slate-500 text-sm">Belum ada data arketipe (analisis AI belum digenerate).</p>
          ) : (
            <div className="space-y-3">
              {arketipeDist.map(a => (
                <div key={a.arketipe}>
                  <div
                    className="flex items-center justify-between cursor-pointer hover:bg-slate-800/50 rounded-lg px-3 py-2 transition-colors"
                    onClick={() => setExpandedArketipe(expandedArketipe === a.arketipe ? null : a.arketipe)}
                  >
                    <span className="text-yellow-400 font-semibold text-sm">{a.arketipe}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-500 rounded-full transition-all" style={{ width: `${a.pct}%` }}></div>
                      </div>
                      <span className="text-white font-bold text-sm w-8 text-right">{a.count}</span>
                      <span className="text-slate-500 text-xs w-12 text-right">{a.pct}%</span>
                      <span className="text-slate-600 text-xs">{expandedArketipe === a.arketipe ? '▲' : '▼'}</span>
                    </div>
                  </div>
                  {expandedArketipe === a.arketipe && (
                    <div className="ml-6 mt-1 mb-2 flex flex-wrap gap-1.5">
                      {a.names.map((n, i) => (
                        <span key={i} className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-xs">{n}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* HEXACO Profil Organisasi */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-6">🧬 Profil HEXACO Organisasi</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(HEXACO_LABELS).map(([dim, label]) => {
            const avg = hexacoAvg[dim];
            const level = getLevel(avg);
            const facets = facetAvg[dim] || [];
            return (
              <div key={dim} className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-white font-bold text-lg">{dim}</span>
                    <span className="text-slate-400 text-xs ml-2">{label}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-white font-mono font-bold text-lg">{avg > 0 ? avg.toFixed(2) : '-'}</span>
                    <span className={`ml-2 text-xs font-bold px-2 py-0.5 rounded-full ${level.cls} ${level.bg}/20`}>{avg > 0 ? level.label : ''}</span>
                  </div>
                </div>
                <div className="w-full h-2 bg-slate-700 rounded-full mb-3 overflow-hidden">
                  <div className={`h-full rounded-full ${level.bg}`} style={{ width: `${(avg / 5) * 100}%` }}></div>
                </div>
                <div className="space-y-1.5">
                  {facets.map(f => (
                    <div key={f.key} className="flex items-center gap-2">
                      <span className="text-slate-500 text-[11px] w-28 truncate" title={f.name}>{f.name}</span>
                      <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${getLevel(f.avg).bg}/70`} style={{ width: `${(f.avg / 5) * 100}%` }}></div>
                      </div>
                      <span className="text-white font-mono text-[11px] w-8 text-right">{f.avg > 0 ? f.avg.toFixed(1) : '-'}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Facet Highlights */}
        {allFacets.length > 0 && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
              <h4 className="text-emerald-400 font-bold text-sm mb-2">💪 Facet Tertinggi Organisasi</h4>
              <div className="space-y-1">
                {allFacets.slice(0, 5).map(f => (
                  <div key={f.key} className="flex justify-between text-sm">
                    <span className="text-slate-300">{f.name} <span className="text-slate-600">({f.dim})</span></span>
                    <span className="text-emerald-400 font-mono font-bold">{f.avg.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
              <h4 className="text-amber-400 font-bold text-sm mb-2">⚠️ Facet Terendah Organisasi</h4>
              <div className="space-y-1">
                {allFacets.slice(-5).reverse().map(f => (
                  <div key={f.key} className="flex justify-between text-sm">
                    <span className="text-slate-300">{f.name} <span className="text-slate-600">({f.dim})</span></span>
                    <span className="text-amber-400 font-mono font-bold">{f.avg.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Peran Potensial Distribution */}
      {peranDist.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">🧩 Distribusi Peran Potensial (Tim)</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-slate-400 text-xs uppercase tracking-wider border-b border-slate-700">
                  <th className="text-left px-4 py-3">Tipe Peran</th>
                  <th className="text-center px-4 py-3">Jumlah</th>
                  <th className="text-left px-4 py-3">Personel</th>
                </tr>
              </thead>
              <tbody>
                {peranDist.map(p => (
                  <tr key={p.tipe} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                    <td className="px-4 py-3 text-teal-400 font-semibold">{p.tipe}</td>
                    <td className="px-4 py-3 text-center text-white font-bold">{p.count}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1.5">
                        {p.names.map((n, i) => (
                          <span key={i} className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-xs">{n}</span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Kekuatan & Tantangan */}
      {(kekuatanKeywords.length > 0 || tantanganKeywords.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">💎 Kekuatan Dominan Organisasi</h3>
            {kekuatanKeywords.length === 0 ? (
              <p className="text-slate-500 text-sm">Belum ada data kekuatan.</p>
            ) : (
              <div className="space-y-2">
                {kekuatanKeywords.map(([text, count], i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="bg-emerald-500/20 text-emerald-400 font-bold min-w-[28px] text-center py-0.5 rounded text-xs">{count}x</span>
                    <span className="text-slate-300 text-sm leading-relaxed">{text}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">🔥 Tantangan Umum Organisasi</h3>
            {tantanganKeywords.length === 0 ? (
              <p className="text-slate-500 text-sm">Belum ada data tantangan.</p>
            ) : (
              <div className="space-y-2">
                {tantanganKeywords.map(([text, count], i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="bg-rose-500/20 text-rose-400 font-bold min-w-[28px] text-center py-0.5 rounded text-xs">{count}x</span>
                    <span className="text-slate-300 text-sm leading-relaxed">{text}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
