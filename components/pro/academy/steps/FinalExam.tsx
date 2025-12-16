
import React, { useState } from 'react';
import { Button } from '../../../ui/Button';
import { AcademyState } from '../../../../types';
import { AcademyPdfService } from '../../../../services/academyPdfService';

interface Props {
    academyState?: AcademyState;
}

export const FinalExam: React.FC<Props> = ({ academyState }) => {
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [currentQ, setCurrentQ] = useState(0);

  const questions = [
      {
          q: "What is the primary function of an SPV in tokenization?",
          options: ["To avoid all taxes", "To isolate liability and hold the asset", "To mint crypto coins", "To pay the developers"],
          correct: 1
      },
      {
          q: "Which Investor Type requires the LEAST regulatory friction in the US?",
          options: ["Retail", "Accredited", "Foreign Retail", "Anonymous"],
          correct: 1
      },
      {
          q: "What is 'NoI'?",
          options: ["Number of Investors", "Net Operating Income", "New Object Instance", "Network of Internet"],
          correct: 1
      },
      {
          q: "Why is ERC-3643 used over ERC-20?",
          options: ["It is cheaper", "It forces Identity/KYC checks on-chain", "It is faster", "It supports NFTs"],
          correct: 1
      }
  ];

  const handleAnswer = (idx: number) => {
      if (idx === questions[currentQ].correct) {
          setScore(s => s + 1);
      }
      
      if (currentQ < questions.length - 1) {
          setCurrentQ(q => q + 1);
      } else {
          setFinished(true);
      }
  };

  const handleDownloadCertificate = () => {
      if (academyState) {
          AcademyPdfService.generateFullAcademyPDF(academyState);
      } else {
          alert("No Academy history found.");
      }
  };

  if (!started) {
      return (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-8 bg-slate-50 animate-fadeIn p-8">
              <div className="text-8xl mb-4">🎓</div>
              <h1 className="text-5xl font-bold text-slate-900 font-display">Final Certification Exam</h1>
              <p className="text-slate-500 max-w-lg mx-auto text-xl">
                  You have completed the theory modules. Prove your knowledge to unlock your "Tokenization Architect" certificate.
              </p>
              <div className="bg-white p-6 rounded-2xl text-base text-slate-600 border border-slate-200 shadow-sm max-w-sm w-full">
                  <p className="mb-2"><strong>Exam Requirements:</strong></p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>10 Questions</li>
                    <li>80% Passing Score</li>
                    <li>No Time Limit</li>
                  </ul>
              </div>
              <Button onClick={() => setStarted(true)} variant="sim" className="px-12 py-5 text-xl shadow-xl">
                  Start Exam
              </Button>
          </div>
      );
  }

  if (finished) {
      const passed = score >= 3;
      return (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-8 bg-slate-50 animate-fadeIn p-8">
              <div className="text-8xl mb-4">{passed ? '🏆' : '📚'}</div>
              <h1 className="text-5xl font-bold text-slate-900 font-display">
                  {passed ? 'Certified!' : 'Keep Studying'}
              </h1>
              <p className="text-slate-500 text-xl">
                  You scored <span className="text-indigo-600 font-bold">{score} / {questions.length}</span>
              </p>
              
              {passed ? (
                  <div className="space-y-6 w-full max-w-md">
                      <div className="p-8 bg-white rounded-2xl text-slate-900 shadow-lg border border-slate-200">
                          <h4 className="font-bold font-display text-2xl uppercase tracking-widest mb-2 text-indigo-900">Certificate of Completion</h4>
                          <p className="text-lg font-serif text-slate-600">Awarded to Pro User</p>
                          <p className="text-xs uppercase mt-6 tracking-widest opacity-60">Verified on PropertyDEX</p>
                      </div>

                      <Button onClick={handleDownloadCertificate} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl py-4 text-lg">
                          📥 Download Full Academy Report (PDF)
                      </Button>
                  </div>
              ) : (
                  <Button onClick={() => { setStarted(false); setScore(0); setCurrentQ(0); setFinished(false); }} variant="secondary" className="px-10 py-4 text-lg">
                      Retake Exam
                  </Button>
              )}
          </div>
      );
  }

  return (
      <div className="flex flex-col items-center justify-center h-full bg-slate-50 animate-slideUp p-8">
          <div className="max-w-2xl w-full bg-white rounded-3xl border border-slate-200 p-12 shadow-xl">
              <div className="flex justify-between items-center mb-10">
                  <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Question {currentQ + 1} / {questions.length}</span>
                  <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">Exam In Progress</span>
              </div>
              
              <h3 className="text-3xl font-bold text-slate-900 mb-10 leading-relaxed font-display">
                  {questions[currentQ].q}
              </h3>

              <div className="space-y-4">
                  {questions[currentQ].options.map((opt, i) => (
                      <button 
                          key={i}
                          onClick={() => handleAnswer(i)}
                          className="w-full text-left p-6 rounded-xl bg-slate-50 border-2 border-transparent hover:border-indigo-500 hover:bg-indigo-50 text-slate-700 transition-all font-medium text-lg shadow-sm"
                      >
                          {opt}
                      </button>
                  ))}
              </div>
          </div>
      </div>
  );
};
