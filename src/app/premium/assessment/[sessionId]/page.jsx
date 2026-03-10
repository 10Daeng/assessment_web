'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { use } from 'react';

// Reusing existing components but wrapped logically
import DiscTest from '@/components/DiscTest';
import HexacoTest from '@/components/HexacoTest';
import IdentityFormAaas from '@/components/AaaS/IdentityFormAaas';
import ModuleEssay from '@/components/AaaS/modules/ModuleEssay';

export default function AssessmentRunnerPage(props) {
  const params = use(props.params);
  const router = useRouter();
  const sessionId = params.sessionId;
  
  const [session, setSession] = useState(null);
  const [modules, setModules] = useState([]);
  const [currentModuleIdx, setCurrentModuleIdx] = useState(0);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorStatus, setErrorStatus] = useState('');

  // 1. Load Session & Package Configuration
  useEffect(() => {
    async function loadSession() {
      try {
        const res = await fetch(`/api/premium/session/${sessionId}`);
        if (!res.ok) throw new Error('Sesi tidak ditemukan atau kedaluwarsa.');
        
        const data = await res.json();
        
        if (data.session.status === 'COMPLETED') {
          router.push(`/premium/thankyou`);
          return;
        }

        setSession(data.session);
        // Sort modules by 'order'
        const sortedModules = data.session.package.modules.sort((a,b) => a.order - b.order);
        setModules(sortedModules);
        
      } catch (err) {
        setErrorStatus(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    loadSession();
  }, [sessionId, router]);

  // 2. Handle Module Completion
  const handleModuleComplete = async (rawAnswers) => {
    setIsSubmitting(true);
    const activeModule = modules[currentModuleIdx].module;

    try {
      // Save result to Database
      const res = await fetch(`/api/premium/session/${sessionId}/submit-module`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          moduleId: activeModule.id,
          rawScore: rawAnswers
        })
      });

      if (!res.ok) throw new Error('Gagal menyimpan hasil tes.');

      // Proceed to next module OR Finalize
      if (currentModuleIdx < modules.length - 1) {
        setCurrentModuleIdx(prev => prev + 1);
        window.scrollTo(0, 0);
      } else {
        // Last module finished! Handle Finalization
        await handleFinalizeSession();
      }
    } catch (e) {
      alert(e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3. Finalize Session (Trigger AI aggregation)
  const handleFinalizeSession = async () => {
    try {
      const res = await fetch(`/api/premium/session/${sessionId}/finish`, {
        method: 'POST'
      });
      if (!res.ok) throw new Error('Gagal merangkum laporan akhir.');
      
      // Done!
      router.push(`/premium/thankyou`);
    } catch (e) {
      alert(e.message);
    }
  };

  // 3.5 Handle Identity Form Submission
  const handleIdentitySubmit = async (metadata) => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/premium/session/${sessionId}/metadata`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ metadata })
      });
      if (!res.ok) throw new Error('Gagal menyimpan formulir identitas.');
      
      const resData = await res.json();
      setSession(resData.session); // This will populate participantMetadata and bypass this form next render
      window.scrollTo(0, 0);
    } catch (e) {
      alert(e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 4. Dynamic Renderer
  const renderCurrentModule = () => {
    const activeModule = modules[currentModuleIdx]?.module;
    if (!activeModule) return null;

    // Based on ID or Name, we mount the proper standard component
    if (activeModule.id === 'mod-disc-primary' || activeModule.name.includes('DISC')) {
      return <DiscTest onComplete={handleModuleComplete} />;
    }
    
    if (activeModule.id === 'mod-hexaco-primary' || activeModule.name.includes('HEXACO')) {
      return <HexacoTest onComplete={handleModuleComplete} />;
    }

    if (activeModule.id === 'mod-essay' || activeModule.name.toLowerCase().includes('wawancara') || activeModule.name.toLowerCase().includes('esai')) {
      return <ModuleEssay intent={session.package.intent} onComplete={handleModuleComplete} />;
    }

    return (
      <div className="text-center p-12 bg-rose-50 rounded-2xl">
        <p className="text-rose-600">Terjadi kesalahan: Modul tidak dikenali sistem.</p>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-teal-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (errorStatus) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-rose-100 max-w-lg text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Oops!</h2>
          <p className="text-slate-500 mb-6">{errorStatus}</p>
          <a href="/premium" className="text-blue-600 hover:underline">Kembali ke Beranda</a>
        </div>
      </div>
    );
  }

  // GATEWAY: If identity/metadata is not filled yet, FORCE user to fill it based on package intent.
  if (session && !session.participantMetadata) {
    return (
      <main className="min-h-screen bg-slate-50 font-sans p-4 md:p-8">
        <div className="max-w-4xl mx-auto mt-4 md:mt-12">
          <IdentityFormAaas 
            intent={session.package.intent} 
            initialData={{
              nama: session.participantName || '',
              email: session.participantEmail || '',
              usia: session.participantAge || ''
            }}
            onSubmit={handleIdentitySubmit} 
            isLoading={isSubmitting} 
          />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50/50 font-sans pb-20">
      {/* Session Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-teal-600 uppercase tracking-wider">{session.package.name}</div>
            <div className="text-sm text-slate-500">
              Modul {currentModuleIdx + 1} dari {modules.length}: 
              <span className="font-semibold text-slate-700 ml-1">
                {modules[currentModuleIdx].module.name}
              </span>
            </div>
          </div>
          <div className="font-medium text-slate-500 text-sm hidden sm:block">
            {session.participantName} ({session.voucher?.code || 'Personal'})
          </div>
        </div>
      </header>

      {/* Module Rendering */}
      <div className="pt-8 relative">
        {isSubmitting && (
          <div className="absolute inset-0 z-10 bg-white/50 backdrop-blur-sm flex items-center justify-center min-h-[50vh]">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-3"></div>
              <div className="text-sm font-semibold text-slate-600">Menyimpan hasil tes...</div>
            </div>
          </div>
        )}
        
        {renderCurrentModule()}
      </div>
    </main>
  );
}
