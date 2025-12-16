
import React, { useState } from 'react';
import { Button } from '../../../../ui/Button';

export const FounderDiagnostic: React.FC = () => {
  const [stage, setStage] = useState<'INTRO' | 'QUIZ' | 'RESULT'>('INTRO');
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const questions = [
    { id: 'risk', question: "How do you react to short-term market volatility?", options: ["Panic sell", "Hold steady", "Buy more (Aggressive)"] },
    { id: 'ambition', question: "What is the ultimate scale of this project?", options: ["Local Asset", "National Portfolio", "Global Ecosystem"] },
    { id: 'execution', question: "Rate your team's operational experience:", options: ["First-time", "Experienced", "Expert / Institutional"] },
    { id: 'timeline', question: "What is your exit horizon?", options: ["Quick Flip (<2 yrs)", "Medium (3-5 yrs)", "Long Term / Perpetual"] }
  ];

  const handleAnswer = (questionId: string, answer: string) => {
      setAnswers(prev => ({ ...prev, [questionId]: answer }));
      if (currentQ < questions.length - 1) {
          setCurrentQ(prev => prev + 1);
      } else {
          setStage('RESULT');
          // Mock Analysis Logic
          setTimeout(() => {
              setResult({
                  archetype: "Visionary Builder",
                  strengths: ["Ambition", "Risk Tolerance"],
                  weaknesses: ["May underestimate operational friction"],
                  advice: "Focus on building a strong legal team to match your ambitious vision."
              });
          }, 1000);
      }
  };

  if (stage === 'INTRO') {
      return (
          <div className="flex flex-col items-center justify-center p-8 text-center bg-slate-900 rounded-3xl border border-slate-800 shadow-xl h-full min-h-[400px]">
              <div className="text-6xl mb-6 animate-pulse">🧠</div>
              <h3 className="text-2xl font-bold text-white font-display mb-4">Founder DNA Diagnostic</h3>
              <p className="text-slate-400 max-w-md mx-auto mb-8 text-lg">
                  Understand your bias. Are you a "Flipper", a "Builder", or an "Institutional Allocator"? 
                  Our AI profiles your psychological approach to deal-making.
              </p>
              <Button onClick={() => setStage('QUIZ')} className="px-10 py-4 text-lg bg-indigo-600 hover:bg-indigo-500 shadow-lg">
                  Start Assessment
              </Button>
          </div>
      );
  }

  if (stage === 'QUIZ') {
      const q = questions[currentQ];
      return (
          <div className="flex flex-col items-center justify-center p-8 bg-slate-900 rounded-3xl border border-slate-800 h-full min-h-[400px] animate-fadeIn">
              <div className="w-full max-w-lg">
                  <div className="flex justify-between items-center mb-8">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Question {currentQ + 1}/{questions.length}</span>
                      <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-500 transition-all duration-300" style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}></div>
                      </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-8 leading-relaxed">{q.question}</h3>
                  
                  <div className="space-y-4">
                      {q.options.map((opt, i) => (
                          <button 
                            key={i}
                            onClick={() => handleAnswer(q.id, opt)}
                            className="w-full text-left p-4 rounded-xl border border-slate-700 bg-slate-800 text-slate-300 hover:bg-indigo-600 hover:text-white hover:border-indigo-500 transition-all font-medium"
                          >
                              {opt}
                          </button>
                      ))}
                  </div>
              </div>
          </div>
      );
  }

  return (
      <div className="flex flex-col items-center justify-center p-8 bg-gradient-to-br from-slate-900 to-indigo-950 rounded-3xl border border-slate-800 h-full min-h-[400px] animate-scaleIn">
          {!result ? (
              <div className="text-center">
                  <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                  <h3 className="text-xl font-bold text-white">Analyzing Profile...</h3>
              </div>
          ) : (
              <div className="w-full max-w-2xl text-center">
                  <div className="inline-block px-4 py-1.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-widest mb-6 border border-indigo-500/30">
                      Profile Analysis
                  </div>
                  
                  <h2 className="text-4xl md:text-5xl font-bold text-white font-display mb-2">{result.archetype}</h2>
                  <p className="text-slate-400 text-lg mb-10 italic">"{result.advice}"</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                      <div className="bg-emerald-900/20 p-5 rounded-xl border border-emerald-500/20">
                          <h4 className="text-emerald-400 font-bold uppercase text-xs tracking-widest mb-3">Core Strengths</h4>
                          <ul className="space-y-2">
                              {result.strengths.map((s: string, i: number) => (
                                  <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
                                      <span className="text-emerald-500">✓</span> {s}
                                  </li>
                              ))}
                          </ul>
                      </div>
                      <div className="bg-red-900/20 p-5 rounded-xl border border-red-500/20">
                          <h4 className="text-red-400 font-bold uppercase text-xs tracking-widest mb-3">Blind Spots</h4>
                          <ul className="space-y-2">
                              {result.weaknesses.map((w: string, i: number) => (
                                  <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
                                      <span className="text-red-500">!</span> {w}
                                  </li>
                              ))}
                          </ul>
                      </div>
                  </div>

                  <div className="mt-10">
                      <Button onClick={() => setStage('INTRO')} variant="secondary" className="border-slate-700 text-slate-400 hover:text-white">
                          Retake Diagnostic
                      </Button>
                  </div>
              </div>
          )}
      </div>
  );
};
