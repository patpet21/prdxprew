
import React, { useState } from 'react';
import { Button } from '../../../ui/Button';
import { generateDeepSwotAnalysis } from '../../../../services/mockAiService';

export const SwotDeepDive: React.FC = () => {
  // Inputs
  const [assetName, setAssetName] = useState('');
  const [assetType, setAssetType] = useState('Real Estate');
  const [location, setLocation] = useState('');
  const [context, setContext] = useState('');
  
  // Outputs
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleGenerate = async () => {
    if (!assetName || !location) return;
    setIsAnalyzing(true);
    const data = await generateDeepSwotAnalysis(assetName, assetType, location, context);
    setResult(data);
    setIsAnalyzing(false);
  };

  return (
    <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 md:p-8 shadow-2xl animate-fadeIn">
      <div className="text-center mb-10">
         <h3 className="text-2xl font-bold text-white font-display mb-2 flex items-center justify-center gap-3">
             <span className="text-3xl">🧠</span> Strategic SWOT Analysis
         </h3>
         <p className="text-slate-400 text-sm max-w-lg mx-auto">
             Generate a personalized, investor-grade SWOT matrix. 
             Identify the unique selling points and critical risks for your Business Plan.
         </p>
      </div>

      {!result ? (
          <div className="max-w-2xl mx-auto space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                      <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Asset Name</label>
                      <input 
                          value={assetName}
                          onChange={(e) => setAssetName(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white outline-none focus:border-amber-500 transition-all"
                          placeholder="e.g. The Grand Hotel"
                      />
                  </div>
                  <div>
                      <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Asset Class</label>
                      <select 
                          value={assetType}
                          onChange={(e) => setAssetType(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white outline-none focus:border-amber-500 transition-all"
                      >
                          <option>Real Estate</option>
                          <option>Business Equity</option>
                          <option>Debt</option>
                          <option>Art / Collectible</option>
                      </select>
                  </div>
                  <div>
                      <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Location</label>
                      <input 
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white outline-none focus:border-amber-500 transition-all"
                          placeholder="e.g. Milan, Italy"
                      />
                  </div>
                  <div>
                      <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Context / Strategy</label>
                      <input 
                          value={context}
                          onChange={(e) => setContext(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white outline-none focus:border-amber-500 transition-all"
                          placeholder="e.g. Targeting digital nomads"
                      />
                  </div>
              </div>

              <Button 
                  onClick={handleGenerate} 
                  isLoading={isAnalyzing}
                  disabled={!assetName || !location}
                  className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-900 font-bold text-lg shadow-lg shadow-amber-900/20"
              >
                  {isAnalyzing ? 'Consulting AI Strategist...' : 'Generate Matrix'}
              </Button>
          </div>
      ) : (
          <div className="animate-slideUp space-y-8">
              
              {/* Executive Summary */}
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 text-center">
                  <h4 className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-2">Strategic Verdict</h4>
                  <p className="text-slate-300 text-sm leading-relaxed italic max-w-3xl mx-auto">
                      "{result.executive_summary}"
                  </p>
              </div>

              {/* 2x2 Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Strengths */}
                  <div className="bg-slate-950 rounded-2xl p-6 border-t-4 border-t-emerald-500 border-x border-x-slate-800 border-b border-b-slate-800 relative group hover:bg-slate-900 transition-colors">
                      <div className="absolute top-4 right-4 text-4xl opacity-10 group-hover:opacity-20 transition-opacity">💪</div>
                      <h4 className="text-lg font-bold text-emerald-400 mb-4 flex items-center gap-2">Strengths <span className="text-xs text-emerald-600/50 font-normal uppercase tracking-wider ml-2">Internal</span></h4>
                      <ul className="space-y-3">
                          {result.strengths.map((s: string, i: number) => (
                              <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                                  <span className="text-emerald-500 font-bold mt-0.5">✓</span>
                                  {s}
                              </li>
                          ))}
                      </ul>
                  </div>

                  {/* Weaknesses */}
                  <div className="bg-slate-950 rounded-2xl p-6 border-t-4 border-t-orange-500 border-x border-x-slate-800 border-b border-b-slate-800 relative group hover:bg-slate-900 transition-colors">
                      <div className="absolute top-4 right-4 text-4xl opacity-10 group-hover:opacity-20 transition-opacity">📉</div>
                      <h4 className="text-lg font-bold text-orange-400 mb-4 flex items-center gap-2">Weaknesses <span className="text-xs text-orange-600/50 font-normal uppercase tracking-wider ml-2">Internal</span></h4>
                      <ul className="space-y-3">
                          {result.weaknesses.map((w: string, i: number) => (
                              <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                                  <span className="text-orange-500 font-bold mt-0.5">•</span>
                                  {w}
                              </li>
                          ))}
                      </ul>
                  </div>

                  {/* Opportunities */}
                  <div className="bg-slate-950 rounded-2xl p-6 border-t-4 border-t-blue-500 border-x border-x-slate-800 border-b border-b-slate-800 relative group hover:bg-slate-900 transition-colors">
                      <div className="absolute top-4 right-4 text-4xl opacity-10 group-hover:opacity-20 transition-opacity">🚀</div>
                      <h4 className="text-lg font-bold text-blue-400 mb-4 flex items-center gap-2">Opportunities <span className="text-xs text-blue-600/50 font-normal uppercase tracking-wider ml-2">External</span></h4>
                      <ul className="space-y-3">
                          {result.opportunities.map((o: string, i: number) => (
                              <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                                  <span className="text-blue-500 font-bold mt-0.5">↗</span>
                                  {o}
                              </li>
                          ))}
                      </ul>
                  </div>

                  {/* Threats */}
                  <div className="bg-slate-950 rounded-2xl p-6 border-t-4 border-t-red-500 border-x border-x-slate-800 border-b border-b-slate-800 relative group hover:bg-slate-900 transition-colors">
                      <div className="absolute top-4 right-4 text-4xl opacity-10 group-hover:opacity-20 transition-opacity">🛡️</div>
                      <h4 className="text-lg font-bold text-red-400 mb-4 flex items-center gap-2">Threats <span className="text-xs text-red-600/50 font-normal uppercase tracking-wider ml-2">External</span></h4>
                      <ul className="space-y-3">
                          {result.threats.map((t: string, i: number) => (
                              <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                                  <span className="text-red-500 font-bold mt-0.5">!</span>
                                  {t}
                              </li>
                          ))}
                      </ul>
                  </div>

              </div>

              <div className="flex justify-center pt-4 border-t border-slate-800">
                  <div className="flex gap-4">
                      <button 
                          onClick={() => setResult(null)}
                          className="text-slate-500 hover:text-white text-sm font-bold uppercase tracking-wider transition-colors"
                      >
                          Start Over
                      </button>
                      <button className="bg-white text-slate-900 hover:bg-slate-200 px-6 py-2 rounded-lg font-bold text-sm shadow-lg transition-colors flex items-center gap-2">
                          <span>📥</span> Export to PDF
                      </button>
                  </div>
              </div>

          </div>
      )}
    </div>
  );
};
