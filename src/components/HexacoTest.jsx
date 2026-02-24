import { useState } from 'react';
import { hexaco100Questions } from '../data/hexaco';

export default function HexacoTest({ onComplete }) {
  const [answers, setAnswers] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const questionsPerPage = 10;
  const totalPages = Math.ceil(hexaco100Questions.length / questionsPerPage);
  
  const currentQuestions = hexaco100Questions.slice(
    currentPage * questionsPerPage, 
    (currentPage + 1) * questionsPerPage
  );

  const handleSelect = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const isPageComplete = () => {
    return currentQuestions.every(q => answers[q.id]);
  };

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(prev => prev + 1);
      window.scrollTo(0, 0);
    } else {
      onComplete(answers);
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  const getProgressWidth = () => {
    const totalAnswered = Object.keys(answers).length;
    return `${(totalAnswered / hexaco100Questions.length) * 100}%`;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-in slide-in-from-right-8 duration-500">
      <div className="mb-8 flex flex-col md:flex-row justify-between md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Bagian 3: Profil Karakter</h2>
          <p className="text-slate-500 mt-2 text-sm leading-relaxed max-w-2xl">
            Tentukan seberapa setuju Anda dengan setiap pernyataan berikut ini. 
            Mulai dari Sangat Tidak Setuju (1) hingga Sangat Setuju (5). Tidak ada jawaban yang benar atau salah.
          </p>
        </div>
        
        <div className="w-full md:w-48 shrink-0">
          <div className="flex justify-between text-xs font-semibold text-emerald-600 mb-1.5">
            <span>Progress</span>
            <span>{Object.keys(answers).length} / 100</span>
          </div>
          <div className="h-2.5 w-full bg-emerald-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-emerald-500 rounded-full transition-all duration-300" 
              style={{ width: getProgressWidth() }}
            ></div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {currentQuestions.map((q) => {
          return (
            <div key={q.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="text-lg text-slate-700 font-medium mb-5">{q.id}. {q.text}</h3>
              
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-2">
                <span className="text-xs font-semibold text-slate-400 hidden sm:block w-32 text-right pr-4">Sangat Tidak Setuju</span>
                
                <div className="flex justify-between sm:justify-center w-full sm:w-auto gap-2 md:gap-4 flex-1">
                  {[1, 2, 3, 4, 5].map((val) => {
                    const isSelected = answers[q.id] === val;
                    // Color mapping based on scale (1=rose, 3=slate, 5=emerald)
                    let colorClass = "border-slate-300 hover:border-emerald-400";
                    let bgClass = "bg-white";
                    
                    if (isSelected) {
                      if (val <= 2) { colorClass = "border-rose-500 bg-rose-50"; bgClass = "bg-rose-500"; }
                      else if (val === 3) { colorClass = "border-blue-500 bg-blue-50"; bgClass = "bg-blue-500"; }
                      else { colorClass = "border-emerald-500 bg-emerald-50"; bgClass = "bg-emerald-500"; }
                    }

                    return (
                      <div key={val} className="flex flex-col items-center gap-2">
                        <button
                          onClick={() => handleSelect(q.id, val)}
                          className={`w-10 h-10 md:w-12 md:h-12 rounded-full border-2 flex items-center justify-center font-bold transition-all shadow-sm ${colorClass} ${isSelected ? 'text-slate-800 scale-110 shadow-md' : 'text-slate-500 scale-100'}`}
                        >
                          {val}
                        </button>
                      </div>
                    );
                  })}
                </div>
                
                <span className="text-xs font-semibold text-slate-400 hidden sm:block w-32 text-left pl-4">Sangat Setuju</span>
              </div>
              
              {/* Mobile labels */}
              <div className="flex justify-between w-full mt-3 sm:hidden px-2">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Sangat Tidak Setuju</span>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Sangat Setuju</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-10 mb-20 flex justify-between items-center">
        <button 
          onClick={handlePrev}
          disabled={currentPage === 0}
          className={`px-8 py-3 rounded-xl font-medium transition-all ${currentPage === 0 ? 'opacity-0 pointer-events-none' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
        >
          Kembali
        </button>
        
        <button 
          onClick={handleNext}
          disabled={!isPageComplete()}
          className={`px-8 py-3 rounded-xl font-medium transition-all shadow-sm
            ${isPageComplete() 
              ? 'bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-md hover:-translate-y-0.5' 
              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }
          `}
        >
          {currentPage === totalPages - 1 ? 'Selesai & Kirim Jawaban' : 'Halaman Selanjutnya'}
        </button>
      </div>
    </div>
  );
}
