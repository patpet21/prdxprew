
import React, { useState, useEffect } from 'react';
import { Button } from '../../../../ui/Button';
import { Select } from '../../../../ui/Select';
import { generateTokenTypeDecisionMatrix } from '../../../../../services/mockAiService';

interface Props {
    onNext?: () => void;
}

export const TokenTypeCompare: React.FC<Props> = ({ onNext }) => {
  const [inputs, setInputs] = useState({
      returnStyle: 'Income (Cashflow)',
      liquidity: 'Medium',
      riskTolerance: 'Medium'
  });

  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [expandedModel, setExpandedModel] = useState<string | null>(null);

  useEffect(() => {
      const saved = localStorage.getItem('academyPro_compare');
      if (saved) {
          try {
              const parsed = JSON.parse(saved);
              if (parsed.token) {
                  if (parsed.token.inputs) setInputs(parsed.token.inputs);
                  if (parsed.token.result) setResult(parsed.token.result);
              }
          } catch(e) {}
      }
  }, []);

  const handleCompare = async () => {
      setLoading(true);
      const data = await generateTokenTypeDecisionMatrix(inputs);
      setResult(data);
      setLoading(false);
      
      const current = JSON.parse(localStorage.getItem('academyPro_compare') || '{}');
      current.token = { inputs, result: data };
      localStorage.setItem('academyPro_compare', JSON.stringify(current));
  };

  const handleSaveAndNext = () => {
      setIsSaving(true);
      setTimeout(() => {
          setIsSaving(false);
          if (onNext) onNext();
      }, 500);
  };

  const handleChange = (field: string, val: any) => {
      setInputs(prev => ({ ...prev, [field]: val }));
  };

  const renderModelCard = (key: string, modelData: any) => {
      const primaryRec = result?.recommendation?.primary || '';
      const isRecommended = primaryRec.toLowerCase().includes(key.toLowerCase());
      
      const isExpanded = expandedModel === key;
      const title = key.charAt(0).toUpperCase() + key.slice(1);
      
      const borderColor = isRecommended ? 'border-emerald-500' : 'border-slate-800';
      const bgColor = isRecommended ? 'bg-slate-900' : 'bg-slate-900';
      const glow = isRecommended ? 'shadow-[0_0_30px_rgba(16,185,129,0.15)]' : '';
      const icon = key === 'equity' ? '🏢' : key === 'debt' ? '💳' : '💸';

      return (
          <div 
             key={key}
             onClick={() => setExpandedModel(isExpanded ? null : key)}
             className={`
                cursor-pointer transition-all duration-500 rounded-2xl border-2 overflow-hidden relative group
                ${borderColor} ${bgColor} ${glow}
                ${isExpanded ? 'col-span-1 md:col-span-3 row-span-2' : 'col-span-1'}
             `}
          >
              {/* Active Stripe */}
              {isRecommended && <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500"></div>}
              
              <div className="p-6 h-full flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${isRecommended ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
                              {icon}
                          </div>
                          <div>
                              <h4 className="font-bold text-white text-lg font-display">{title} Token</h4>
                              {isRecommended && <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">AI Recommended</span>}
                          </div>
                      </div>
                      <div className={`text-slate-500 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>▼</div>
                  </div>

                  <p className="text-sm text-slate-400 mb-6 leading-relaxed font-medium">
                      {modelData?.deal || 'Analysis pending...'}
                  </p>

                  {/* Expanded Content */}
                  {isExpanded && modelData && (
                      <div className="animate-slideUp border-t border-slate-800 pt-6 mt-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                          
                          {/* Trade-off */}
                          <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                              <h5 className="text-[10px] font-bold text-slate-500 uppercase mb-3 flex items-center gap-2">
                                  <span>⚖️</span> The Trade-off
                              </h5>
                              <div className="space-y-3 text-xs">
                                  <p className="text-slate-300">
                                      <strong className="text-indigo-400 block mb-1">Sacrifice:</strong>
                                      {modelData.sacrifice}
                                  </p>
                                  <p className="text-slate-300">
                                      <strong className="text-red-400 block mb-1">Failure Mode:</strong>
                                      {modelData.failureMode}
                                  </p>
                                  <div className="text-amber-500 italic bg-amber-900/10 p-2 rounded border border-amber-900/30">
                                      🚫 Don't use if: {modelData.doNotUseIf}
                                  </div>
                              </div>
                          </div>

                          {/* Investor Fit */}
                          <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                               <h5 className="text-[10px] font-bold text-slate-500 uppercase mb-3 flex items-center gap-2">
                                  <span>👥</span> Investor Reality
                              </h5>
                              <div className="space-y-2">
                                  <div className="flex justify-between items-center text-xs border-b border-slate-800/50 pb-2">
                                      <span className="text-slate-400">Retail</span>
                                      <span className={`font-bold ${modelData.investorFit?.retail === 'High' ? 'text-emerald-400' : 'text-slate-500'}`}>{modelData.investorFit?.retail}</span>
                                  </div>
                                  <div className="flex justify-between items-center text-xs border-b border-slate-800/50 pb-2">
                                      <span className="text-slate-400">Family Office</span>
                                      <span className={`font-bold ${modelData.investorFit?.familyOffice === 'High' ? 'text-emerald-400' : 'text-slate-500'}`}>{modelData.investorFit?.familyOffice}</span>
                                  </div>
                                  <div className="flex justify-between items-center text-xs">
                                      <span className="text-slate-400">Institutional</span>
                                      <span className={`font-bold ${modelData.investorFit?.institutional === 'High' ? 'text-emerald-400' : 'text-slate-500'}`}>{modelData.investorFit?.institutional}</span>
                                  </div>
                              </div>
                          </div>

                          {/* Regulatory */}
                          <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                              <h5 className="text-[10px] font-bold text-slate-500 uppercase mb-3 flex items-center gap-2">
                                  <span>🏛️</span> Compliance Load
                              </h5>
                              <div className="space-y-3 text-xs">
                                   <div className="flex justify-between">
                                      <span className="text-slate-400">Implicit Claim</span>
                                      <span className="text-indigo-300 font-mono">{modelData.regSensitivity?.claim}</span>
                                  </div>
                                  <div className="flex justify-between">
                                      <span className="text-slate-400">Reporting</span>
                                      <span className="text-amber-300 font-mono">{modelData.regSensitivity?.reporting}</span>
                                  </div>
                              </div>
                          </div>

                      </div>
                  )}

                  {!isExpanded && (
                      <div className="mt-auto pt-4 flex justify-between items-center text-xs text-slate-500 group-hover:text-slate-300 transition-colors">
                          <span>Click to expand details</span>
                          <span>→</span>
                      </div>
                  )}
              </div>
          </div>
      );
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-6xl mx-auto">
        
        {/* INPUTS */}
        <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden">
            <div className="relative z-10 flex flex-col lg:flex-row justify-between items-end gap-8">
                <div className="w-full">
                    <h4 className="text-lg font-bold text-white font-display mb-6 flex items-center gap-3">
                        <span className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-sm">1</span>
                        Model Parameters
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Select 
                            label="Return Style" 
                            value={inputs.returnStyle} 
                            onChange={e => handleChange('returnStyle', e.target.value)} 
                            options={[
                                { value: 'Income (Cashflow)', label: 'Income (Dividends/Rent)' },
                                { value: 'Growth (Appreciation)', label: 'Growth (Exit Value)' },
                                { value: 'Blended', label: 'Blended (Hybrid)' }
                            ]}
                            className="bg-slate-950 border-slate-700 text-white text-sm"
                        />
                        <Select 
                            label="Liquidity Need" 
                            value={inputs.liquidity} 
                            onChange={e => handleChange('liquidity', e.target.value)} 
                            options={[
                                { value: 'Low', label: 'Low (Long Hold)' },
                                { value: 'Medium', label: 'Medium (Secondary)' },
                                { value: 'High', label: 'High (Active Trading)' }
                            ]}
                            className="bg-slate-950 border-slate-700 text-white text-sm"
                        />
                         <Select 
                            label="Investor Risk Appetite" 
                            value={inputs.riskTolerance} 
                            onChange={e => handleChange('riskTolerance', e.target.value)} 
                            options={[
                                { value: 'Low', label: 'Low (Conservative)' },
                                { value: 'Medium', label: 'Medium (Balanced)' },
                                { value: 'High', label: 'High (Speculative)' }
                            ]}
                            className="bg-slate-950 border-slate-700 text-white text-sm"
                        />
                    </div>
                </div>

                <Button 
                    onClick={handleCompare} 
                    isLoading={loading} 
                    className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-900/20 px-8 py-4 h-full"
                >
                    {loading ? 'Analyzing...' : 'Run Simulation'}
                </Button>
            </div>
        </div>

        {/* RESULTS */}
        {result && result.models && (
            <div className="animate-slideUp space-y-8">
                
                {/* Professor's Verdict */}
                <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-8 rounded-3xl border border-slate-700/50 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-2xl">🎓</span>
                            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Professor's Verdict</h4>
                        </div>
                        <h3 className="text-3xl font-bold text-white font-display mb-3">
                            Best Fit: <span className="text-emerald-400 underline decoration-emerald-500/30 underline-offset-4">{result.recommendation?.primary}</span>
                        </h3>
                        <p className="text-slate-300 text-lg leading-relaxed font-light max-w-3xl">
                            "{result.recommendation?.reason}"
                        </p>
                        
                        <div className="mt-6 flex items-center gap-4 text-sm">
                            <span className="text-slate-500 font-bold uppercase text-xs tracking-wider">Alternative Scenario</span>
                            <span className="text-slate-300 bg-slate-800 px-3 py-1 rounded border border-slate-700">
                                Consider <strong>{result.recommendation?.secondBest}</strong> {result.recommendation?.condition}
                            </span>
                        </div>
                    </div>
                </div>

                {/* THE MATRIX */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-min">
                    {renderModelCard('equity', result.models.equity)}
                    {renderModelCard('debt', result.models.debt)}
                    {renderModelCard('revenue', result.models.revenue)}
                </div>

                {/* FOOTER */}
                <div className="flex justify-end pt-8 border-t border-slate-800">
                    <Button 
                        onClick={handleSaveAndNext} 
                        disabled={isSaving}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg px-10 py-4 font-bold rounded-xl"
                    >
                        {isSaving ? 'Saving...' : 'Lock Strategy & Next →'}
                    </Button>
                </div>

            </div>
        )}
    </div>
  );
};
