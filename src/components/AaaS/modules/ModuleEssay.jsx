'use client';

import { useState } from 'react';
import { getInterviewQuestions } from '@/data/interviewQuestions';

/**
 * Form Komponen Wawancara Terstruktur berdasarkan Intent
 */
export default function ModuleEssay({ intent = 'GENERAL', onComplete }) {
  const questions = getInterviewQuestions(intent);
  const [answers, setAnswers] = useState({});
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e, qId) => {
    setAnswers({
      ...answers,
      [qId]: e.target.value
    });
  };

  const validateWords = () => {
    for (let i = 0; i < questions.length; i++) {
       const q = questions[i];
       const ansText = (answers[q.id] || '').trim();
       
       if (!ansText) {
          return `Pertanyaan No. ${i + 1} belum dijawab!`;
       }

       // Simple word count check
       const wCount = ansText.split(/\s+/).filter(w => w.length > 0).length;
       if (wCount < q.minWords) {
          return `Jawaban No. ${i + 1} terlalu singkat. (Minimal ${q.minWords} kata, Anda menulis ${wCount} kata)`;
       }
    }
    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Prevent short answers
    const vErr = validateWords();
    if (vErr) {
       setErrorMsg(vErr);
       return;
    }

    // Standardize object structure for ModuleResult rawScore:
    // [ { questionId, questionText, answerText }, ... ]
    const payload = questions.map(q => ({
       questionId: q.id,
       questionText: q.question,
       answerText: answers[q.id] || ''
    }));

    onComplete(payload);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 py-8 animate-in slide-in-from-right-8 duration-500">
      <div className="bg-white/95 backdrop-blur-xl p-8 md:p-12 rounded-3xl shadow-xl border border-slate-100 max-w-3xl w-full">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2 mt-4">Wawancara Terstruktur (Esai)</h2>
        <p className="text-slate-500 mb-8 leading-relaxed">
           Untuk memahami karakter Anda lebih jauh, silakan jawab pertanyaan berikut berdasarkan kepribadian dan pengalaman asli Anda secara terperinci. 
        </p>

        {errorMsg && (
           <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200 mb-6 font-medium text-sm">
             {errorMsg}
           </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {questions.map((q, idx) => (
             <div key={q.id} className="p-6 bg-slate-50/50 rounded-2xl border border-slate-100 focus-within:border-blue-300 focus-within:shadow-md transition-all">
                <label htmlFor={q.id} className="block text-base font-semibold text-slate-700 mb-4 leading-relaxed">
                   <span className="text-blue-500 mr-2">{idx + 1}.</span> {q.question}
                </label>
                <textarea 
                   id={q.id}
                   name={q.id}
                   rows="4"
                   placeholder={`Tulis jawaban/pengalaman (Minimal ${q.minWords} kata)...`}
                   required
                   value={answers[q.id] || ''}
                   onChange={(e) => handleChange(e, q.id)}
                   className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none bg-white text-slate-700 resize-y transition-all"
                ></textarea>
                
                {/* Visual indicator for typing progress */}
                <div className="mt-2 text-right">
                    <span className={`text-xs ${(answers[q.id] || '').split(/\s+/).filter(w => w.length > 0).length >= q.minWords ? 'text-green-500 font-medium' : 'text-slate-400'}`}>
                      { (answers[q.id] || '').split(/\s+/).filter(w => w.length > 0).length } / {q.minWords} kata
                    </span>
                </div>
             </div>
          ))}

          <button 
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-2xl text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all mt-6 active:scale-[0.98]"
          >
            Kirimkan Jawaban Wawancara
          </button>
        </form>
      </div>
    </div>
  );
}
