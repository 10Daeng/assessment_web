'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export default function ChatPage() {
  const [subs, setSubs] = useState([]);
  const [selectedTarget, setSelectedTarget] = useState('all');
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Halo! Saya Asisten AI Lentera Batin. Apa yang ingin Anda diskusikan mengenai hasil asesmen klien atau profil organisasi?' }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const endRef = useRef(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    fetch('/api/admin/submissions')
      .then(r => r.json())
      .then(d => {
        if (d.success) setSubs(d.data || []);
      })
      .catch(console.error);
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputVal.trim() || isLoading) return;

    const newMsgs = [...messages, { role: 'user', content: inputVal }];
    setMessages(newMsgs);
    setInputVal('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/admin/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // Send only the messages (we don't prepend system prompts here, server does it)
          messages: newMsgs.filter(m => m.role === 'user' || m.role === 'assistant'),
          selectedClientId: selectedTarget
        })
      });
      const data = await res.json();
      if (data.success) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: '❌ Terjadi kesalahan: ' + data.error }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: '❌ Gagal terhubung ke server.' }]);
    }
    setIsLoading(false);
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col pt-0 pb-6 px-1 md:px-4 max-w-5xl mx-auto space-y-4">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm shrink-0">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2 text-white">
            <span className="text-2xl">🧠</span> Ruang Diskusi AI
          </h2>
          <p className="text-sm text-slate-400 mt-1">Konsultasikan pola profil, temukan blind-spots, atau gali wawasan agregat klien.</p>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-xs text-slate-500 uppercase tracking-widest font-medium">Bahas Tema:</label>
          <select
            value={selectedTarget}
            onChange={e => setSelectedTarget(e.target.value)}
            className="bg-slate-800 border-none text-white text-sm focus:ring-2 focus:ring-blue-500 rounded-xl px-4 py-2.5 outline-none max-w-[200px]"
          >
            <option value="all">🏢 Semua Klien (Profil Organisasi)</option>
            <optgroup label="Bahas Personal Klien:">
              {subs.map(s => (
                <option key={s.id} value={s.id}>👤 {s.userData?.nama || 'Tanpa Nama'} - {s.userData?.instansi || 'Tanpa Instansi'}</option>
              ))}
            </optgroup>
          </select>
        </div>
      </div>

      {/* CHAT WINDOW */}
      <div className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col overflow-hidden shadow-xl">
        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {messages.map((m, idx) => (
            <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[85%] md:max-w-[75%] rounded-2xl px-5 py-4 ${
                  m.role === 'user'
                    ? 'bg-blue-600 text-white rounded-br-sm'
                    : 'bg-slate-800 border border-slate-700 text-slate-300 rounded-tl-sm'
                }`}
              >
                {/* For assistant, handle newlines gracefully */}
                {m.role === 'assistant' ? (
                  <div className="text-[13px] md:text-sm leading-relaxed whitespace-pre-wrap">
                    {/* Render basic bold formatting from markdown-like responses */}
                    {m.content.split('\n').map((line, i) => {
                      if (line.startsWith('* ') || line.startsWith('- ')) {
                        // format bullets
                        return <li key={i} className="ml-4 mb-2">{line.substring(2).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</li>
                      }
                      // Replace **bold** with <strong> tags roughly
                      const parts = line.split(/(\*\*.*?\*\*)/g);
                      return (
                        <p key={i} className={i !== 0 ? 'mt-2' : ''}>
                          {parts.map((p, j) => 
                            p.startsWith('**') && p.endsWith('**') ? <strong key={j} className="text-white">{p.slice(2, -2)}</strong> : p
                          )}
                        </p>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-sm whitespace-pre-wrap">{m.content}</div>
                )}
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-slate-800 border border-slate-700 text-slate-300 rounded-2xl rounded-tl-sm px-6 py-5 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                <span className="ml-2 text-xs text-slate-400">Sedang membedah data...</span>
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-slate-900 border-t border-slate-800">
          <form onSubmit={handleSend} className="relative flex items-center">
            <input
              type="text"
              className="w-full bg-slate-800 border-none text-white focus:ring-1 focus:ring-blue-500 rounded-xl pl-5 pr-32 py-4 shadow-inner outline-none placeholder:text-slate-500"
              placeholder={selectedTarget === 'all' ? "Tanya pola masalah umum organisasi, pemetaan SDM, dll..." : "Tanya potensi karier, rekomendasi treatment, gaya komunikasi klien ini..."}
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !inputVal.trim()}
              className="absolute right-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 transition-colors text-white text-sm font-semibold rounded-lg px-6 py-2"
            >
              Kirim
            </button>
          </form>
          <div className="text-center mt-3">
             <span className="text-[10px] text-slate-500">AI dapat melakukan kesalahan. Selalu verifikasi wawasan dengan penilaian profesional nyata.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
