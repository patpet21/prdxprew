
import React, { useState } from 'react';
import { Button } from '../../../../components/ui/Button';

interface Props {
  onNext?: () => void;
}

export const ExportShareTab: React.FC<Props> = ({ onNext }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleDownload = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      alert("Simulation Summary PDF downloaded!");
    }, 2000);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="animate-fadeIn space-y-8 h-full flex flex-col">
      
      <div className="bg-gradient-to-br from-slate-900 to-blue-900 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden shadow-2xl border border-blue-500/30 shrink-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
          
          <div className="relative z-10 max-w-2xl mx-auto">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-2xl mb-6 backdrop-blur-sm border border-white/20 shadow-lg">
                  <span className="text-3xl">📥</span>
              </div>
              <h2 className="text-3xl font-bold font-display text-white mb-4">
                  Download Your Strategy
              </h2>
              <p className="text-blue-200 text-lg mb-8">
                  Get a professional PDF summary of your simulation, including the AI-generated Executive Summary, Risk Assessment, and Tokenomics Model.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Button 
                    onClick={handleDownload} 
                    isLoading={isDownloading}
                    className="px-8 py-4 bg-white text-slate-900 hover:bg-blue-50 font-bold text-lg shadow-xl shadow-blue-900/20"
                  >
                      {isDownloading ? 'Generating PDF...' : 'Download Free Report'}
                  </Button>
                  <button 
                    onClick={handleShare}
                    className="px-8 py-4 bg-blue-800/50 hover:bg-blue-800 text-white font-bold text-lg rounded-xl border border-blue-500/30 transition-all flex items-center justify-center gap-2"
                  >
                      {isCopied ? 'Link Copied!' : 'Share Project'}
                      {!isCopied && <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>}
                  </button>
              </div>
          </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold text-slate-900">Included in Free Report</h3>
                  <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider bg-emerald-50 px-2 py-1 rounded border border-emerald-100">Available Now</span>
              </div>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-slate-600">
                  <li className="flex items-center gap-3"><span className="text-emerald-500 font-bold">✓</span> Project DNA & Configuration</li>
                  <li className="flex items-center gap-3"><span className="text-emerald-500 font-bold">✓</span> AI Executive Summary</li>
                  <li className="flex items-center gap-3"><span className="text-emerald-500 font-bold">✓</span> Compliance Risk Flags</li>
                  <li className="flex items-center gap-3"><span className="text-emerald-500 font-bold">✓</span> Tokenomics Snapshot</li>
              </ul>
          </div>
      </div>

      {onNext && (
        <div className="mt-auto pt-6 flex justify-end border-t border-slate-200">
             <Button onClick={onNext} className="bg-slate-900 text-white hover:bg-slate-800 shadow-lg">
                 Continue to Execution Path →
             </Button>
        </div>
      )}
    </div>
  );
};
