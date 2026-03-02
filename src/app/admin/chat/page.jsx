'use client';
import { useState, useEffect, useRef, useMemo } from 'react';
import { logger } from '@/utils/logger';

export default function ChatPage() {
  const [subs, setSubs] = useState([]);
  const [histories, setHistories] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  
  const [selectedTarget, setSelectedTarget] = useState('all');
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Halo! Saya Asisten AI Lentera Batin. Apa yang ingin Anda diskusikan mengenai hasil asesmen klien atau profil organisasi?' }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [editingTitleId, setEditingTitleId] = useState(null);
  const [editTitleVal, setEditTitleVal] = useState('');
  const [isTargetMenuOpen, setIsTargetMenuOpen] = useState(false);
  
  const instansiList = useMemo(() => Array.from(new Set(subs.map(s => s.userData?.instansi).filter(Boolean))), [subs]);
  
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const fetchHistories = () => {
    fetch('/api/admin/chat/history').then(r => r.json()).then(d => { if (d.success) setHistories(d.data || []); }).catch(logger.error);
  };

  useEffect(() => {
    // Load clients
    fetch('/api/admin/submissions').then(r => r.json()).then(d => { if (d.success) setSubs(d.data || []); }).catch(logger.error);
    // Load histories
    fetchHistories();
  }, []);

  const startNewChat = () => {
    setCurrentChatId(null);
    setSelectedTarget('all');
    setMessages([{ role: 'assistant', content: 'Halo! Saya Asisten AI Lentera Batin. Apa yang ingin Anda diskusikan mengenai hasil asesmen klien atau profil organisasi?' }]);
  };

  const loadChat = async (hist) => {
    setCurrentChatId(hist.id);
    setSelectedTarget(hist.selectedTarget || 'all');
    try {
       const res = await fetch(`/api/admin/chat/history/${hist.id}`);
       const json = await res.json();
       if (json.success && json.data.messages) {
         setMessages(json.data.messages);
       }
    } catch(e) { logger.error(e); }
  };

  const updateChatMessages = async (id, msgs, target) => {
    try {
      await fetch(`/api/admin/chat/history/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: msgs, selectedTarget: target })
      });
    } catch(e) { logger.error(e); }
  };

  const renameChat = async (id) => {
    if (!editTitleVal.trim()) { setEditingTitleId(null); return; }
    try {
      await fetch(`/api/admin/chat/history/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: editTitleVal })
      });
      setHistories(prev => prev.map(h => h.id === id ? { ...h, title: editTitleVal } : h));
      setEditingTitleId(null);
    } catch(e) { logger.error(e); }
  };

  const deleteChat = async (id, e) => {
    e.stopPropagation();
    if (!confirm('Hapus riwayat obrolan ini?')) return;
    try {
      await fetch(`/api/admin/chat/history/${id}`, { method: 'DELETE' });
      setHistories(prev => prev.filter(h => h.id !== id));
      if (currentChatId === id) startNewChat();
    } catch(_err) { logger.error(_err); }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputVal.trim() || isLoading) return;

    const userText = inputVal;
    const newMsgs = [...messages, { role: 'user', content: userText }];
    setMessages(newMsgs);
    setInputVal('');
    setIsLoading(true);

    let activeChatId = currentChatId;

    // Create DB record if new chat
    if (!activeChatId) {
      try {
        const title = userText.length > 30 ? userText.substring(0, 30) + '...' : userText;
        const res = await fetch('/api/admin/chat/history', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, selectedTarget, messages: newMsgs })
        });
        const d = await res.json();
        if (d.success) {
           activeChatId = d.data.id;
           setCurrentChatId(activeChatId);
           setHistories([d.data, ...histories]);
        }
      } catch(err) { logger.error(err); }
    } else {
      await updateChatMessages(activeChatId, newMsgs, selectedTarget);
    }

    try {
      const res = await fetch('/api/admin/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMsgs.filter(m => m.role === 'user' || m.role === 'assistant'),
          selectedClientId: selectedTarget
        })
      });
      const data = await res.json();
      let finalMsgs = [...newMsgs];
      if (data.success) {
        finalMsgs.push({ role: 'assistant', content: data.reply });
      } else {
        finalMsgs.push({ role: 'assistant', content: '❌ Terjadi kesalahan: ' + data.error });
      }
      setMessages(finalMsgs);
      
      // Update DB with assistant's reply
      if (activeChatId) {
        await updateChatMessages(activeChatId, finalMsgs, selectedTarget);
      }
    } catch (_err) {
      setMessages(prev => [...prev, { role: 'assistant', content: '❌ Gagal terhubung ke server.' }]);
    }
    setIsLoading(false);
  };

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col md:flex-row gap-4 pt-0 pb-6 px-1 md:px-4 max-w-7xl mx-auto">
      
      {/* SIDEBAR - HISTORY */}
      <div className="w-full md:w-72 lg:w-80 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col shrink-0 shadow-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800">
          <button 
            onClick={startNewChat}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
          >
            <span>➕</span> Chat Baru
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {histories.length === 0 ? (
            <div className="text-center text-slate-500 text-xs mt-4">Belum ada riwayat obrolan</div>
          ) : (
            histories.map(h => (
              <div 
                key={h.id} 
                onClick={() => loadChat(h)}
                className={`group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${currentChatId === h.id ? 'bg-slate-800 border border-slate-700' : 'hover:bg-slate-800/50 border border-transparent'}`}
              >
                {editingTitleId === h.id ? (
                  <input 
                    autoFocus
                    className="bg-slate-950 text-white text-sm px-2 py-1 rounded w-full outline-none mr-2"
                    value={editTitleVal}
                    onChange={e => setEditTitleVal(e.target.value)}
                    onBlur={() => renameChat(h.id)}
                    onKeyDown={e => e.key === 'Enter' && renameChat(h.id)}
                  />
                ) : (
                  <div className="text-sm text-slate-300 truncate font-medium flex-1 mr-2">{h.title}</div>
                )}
                
                {editingTitleId !== h.id && (
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={(e) => { e.stopPropagation(); setEditTitleVal(h.title); setEditingTitleId(h.id); }}
                      className="text-slate-400 hover:text-amber-400 p-1" title="Ubah Nama"
                    >✏️</button>
                    <button 
                      onClick={(e) => deleteChat(h.id, e)}
                      className="text-slate-400 hover:text-red-400 p-1" title="Hapus"
                    >🗑️</button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* MAIN CHAT AREA */}
      <div className="flex-1 flex flex-col space-y-4 min-w-0">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 md:p-5 rounded-2xl shadow-sm shrink-0">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2 text-white">
              <span className="text-2xl">🧠</span> Ruang Diskusi AI
            </h2>
            <p className="text-xs text-slate-400 mt-1 hidden sm:block">Konsultasikan pola profil, temukan blind-spots, atau gali wawasan agregat klien.</p>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-xs text-slate-500 uppercase tracking-widest font-medium hidden lg:block">Bahas Tema:</label>
            <div className="relative">
              <button
                type="button"
                className="bg-slate-800 border border-slate-700 text-white text-sm focus:ring-2 focus:ring-blue-500 rounded-xl px-4 py-2.5 outline-none w-full min-w-[150px] lg:min-w-[200px] text-left flex justify-between items-center z-10"
                onClick={() => setIsTargetMenuOpen(!isTargetMenuOpen)}
                disabled={isLoading}
              >
                <span className="truncate pr-2">
                  {selectedTarget === 'all' ? '🏢 Semua Klien' : 
                   selectedTarget.startsWith('org:') ? `🏢 ${selectedTarget.replace('org:', '').split('|').length} Instansi Terpilih` :
                   `👤 ${subs.find(s => s.id === selectedTarget)?.userData?.nama || 'Tanpa Nama'}`}
                </span>
                <span className="text-xs">▾</span>
              </button>
              
              {isTargetMenuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsTargetMenuOpen(false)}></div>
                  <div className="absolute right-0 mt-2 w-72 max-h-[50vh] flex flex-col bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-20">
                    <div className="p-3 border-b border-slate-700 shrink-0">
                      <label className="flex items-center gap-2 text-sm cursor-pointer group">
                        <input 
                          type="radio" 
                          name="theme_target" 
                          checked={selectedTarget === 'all'}
                          onChange={() => { setSelectedTarget('all'); setIsTargetMenuOpen(false); }}
                          className="w-4 h-4 text-blue-600 bg-slate-900 border-slate-700 focus:ring-blue-600 focus:ring-1"
                        />
                        <span className="text-white font-medium group-hover:text-blue-400 transition-colors">🏢 Semua Klien / Organisasi</span>
                      </label>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                      {instansiList.length > 0 && (
                        <div className="p-3 border-b border-slate-700">
                          <div className="text-xs text-slate-400 font-semibold mb-2 uppercase tracking-wide">Filter Instansi Spesifik:</div>
                          <div className="space-y-2">
                            {instansiList.map(inst => {
                              const isOrgChecked = selectedTarget.startsWith('org:') && selectedTarget.replace('org:', '').split('|').includes(inst);
                              return (
                                <label key={inst} className="flex items-start gap-2 text-sm cursor-pointer group">
                                  <input 
                                    type="checkbox"
                                    checked={isOrgChecked}
                                    onChange={(e) => {
                                       let current = selectedTarget.startsWith('org:') ? selectedTarget.replace('org:', '').split('|').filter(Boolean) : [];
                                       if (e.target.checked) current.push(inst);
                                       else current = current.filter(x => x !== inst);
                                       
                                       if (current.length === 0) setSelectedTarget('all');
                                       else setSelectedTarget('org:' + current.join('|'));
                                    }}
                                    className="mt-0.5 w-4 h-4 text-blue-600 bg-slate-900 border-slate-700 rounded focus:ring-blue-600 focus:ring-1"
                                  />
                                  <span className="text-slate-300 group-hover:text-white transition-colors">{inst}</span>
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      <div className="p-3">
                        <div className="text-xs text-slate-400 font-semibold mb-2 uppercase tracking-wide">Personal Klien:</div>
                        <div className="space-y-1">
                          {subs.map(s => (
                            <button
                              key={s.id}
                              className={`w-full text-left px-2 py-1.5 rounded text-sm transition-colors ${selectedTarget === s.id ? 'bg-blue-600/20 text-blue-400 font-medium' : 'text-slate-300 hover:bg-slate-700 hover:text-white'}`}
                              onClick={() => { setSelectedTarget(s.id); setIsTargetMenuOpen(false); }}
                            >
                              👤 {s.userData?.nama || 'Tanpa Nama'}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* CHAT WINDOW */}
        <div className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col overflow-hidden shadow-xl min-h-0">
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
                  {m.role === 'assistant' ? (
                    <div className="text-[13px] md:text-sm leading-relaxed whitespace-pre-wrap">
                      {m.content.split('\n').map((line, i) => {
                        if (line.startsWith('* ') || line.startsWith('- ')) {
                          return <li key={i} className="ml-4 mb-2">{line.substring(2).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</li>
                        }
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
          <div className="p-4 bg-slate-900 border-t border-slate-800 shrink-0">
            <form onSubmit={handleSend} className="relative flex items-center">
              <input
                type="text"
                className="w-full bg-slate-800 border-none text-white focus:ring-1 focus:ring-blue-500 rounded-xl pl-5 pr-24 py-4 shadow-inner outline-none placeholder:text-slate-500 text-sm md:text-base"
                placeholder="Diskusikan profil atau karier klien..."
                value={inputVal}
                onChange={e => setInputVal(e.target.value)}
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !inputVal.trim()}
                className="absolute right-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 transition-colors text-white text-sm font-semibold rounded-lg px-4 py-2"
              >
                Kirim
              </button>
            </form>
            <div className="text-center mt-3">
               <span className="text-[10px] text-slate-500">AI dapat melakukan kesalahan. Verifikasi semua rekomendasi psikologis.</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
