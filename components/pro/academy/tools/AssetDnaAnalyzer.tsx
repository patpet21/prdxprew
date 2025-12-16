
import React, { useState } from 'react';
import { Button } from '../../../ui/Button';
import { generateAssetDnaAnalysis } from '../../../../services/mockAiService';

export const AssetDnaAnalyzer: React.FC = () => {
  const [asset, setAsset] = useState('');
  const [location, setLocation] = useState('');
  const [usage, setUsage] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleAnalyze = async () => {
    if (!asset || !location || !usage) return;
    
    setIsAnalyzing(true);
    const data = await generateAssetDnaAnalysis(asset, location, usage);
    setResult(data);
    setIsAnalyzing(false);
  };

  return (
    <div className="bg-white rounded-3xl border border-sim-border p-6 md:p-8 shadow-md">
      <div className="text-center mb-8">
         <h3 className="text-2xl font-bold text-sim-orange font-display mb-2 flex items-center justify-center gap-3">
             <span className="text-3xl">🧬</span> Asset DNA Evolution
         </h3>
         <p className="text-slate-500 text-sm max-w-md mx-auto">
             Input your asset details below. Our AI will generate a strategic Identity Card, Market Insights, and Structural Strategy.
         </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Input Column */}
          <div className="bg-slate-50 p-6 rounded-2xl border border-sim-border flex flex-col gap-4 h-fit">
              <h4 className="text-xs font-bold text-sim-blue uppercase tracking-widest mb-2">1. Define Asset</h4>
              
              <div>
                  <label className="text-xs font-bold text-slate-500 block mb-2">Asset Type</label>
                  <input 
                      type="text" 
                      value={asset}
                      onChange={(e) => setAsset(e.target.value)}
                      placeholder="e.g. Boutique Hotel"
                      className="w-full bg-white border border-sim-border rounded-xl px-4 py-3 text-slate-900 outline-none focus:border-sim-blue transition-all placeholder:text-slate-400"
                  />
              </div>
              <div>
                  <label className="text-xs font-bold text-slate-500 block mb-2">Location</label>
                  <input 
                      type="text" 
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Florence, Italy"
                      className="w-full bg-white border border-sim-border rounded-xl px-4 py-3 text-slate-900 outline-none focus:border-sim-blue transition-all placeholder:text-slate-400"
                  />
              </div>
              <div>
                  <label className="text-xs font-bold text-slate-500 block mb-2">Current Usage</label>
                  <input 
                      type="text" 
                      value={usage}
                      onChange={(e) => setUsage(e.target.value)}
                      placeholder="e.g. Operational, Renovation needed"
                      className="w-full bg-white border border-sim-border rounded-xl px-4 py-3 text-slate-900 outline-none focus:border-sim-blue transition-all placeholder:text-slate-400"
                  />
              </div>

              <Button 
                  onClick={handleAnalyze} 
                  isLoading={isAnalyzing}
                  variant="sim"
                  className="mt-4 w-full py-3 shadow-lg"
              >
                  {isAnalyzing ? 'Decoding DNA...' : '🧬 Analyze DNA'}
              </Button>
          </div>

          {/* Results Column (Spans 2) */}
          <div className="lg:col-span-2 space-y-8">
              {result ? (
                  <div className="animate-fadeIn space-y-8">
                      
                      {/* 1. IDENTITY CARD */}
                      {result.identity_card && (
                          <div className="bg-white p-6 rounded-2xl border border-sim-blue/30 relative overflow-hidden shadow-lg">
                              
                              <div className="relative z-10">
                                  <div className="flex justify-between items-start mb-6">
                                      <div>
                                          <h4 className="text-lg font-bold text-sim-orange font-display flex items-center gap-2">
                                              <span className="text-2xl">🪪</span> Asset Identity Card
                                          </h4>
                                          <p className="text-slate-400 text-xs mt-1">AI-Generated Profile</p>
                                      </div>
                                      <div className="px-3 py-1 rounded-full bg-sim-purple text-white text-xs font-bold uppercase tracking-wider">
                                          {result.identity_card.asset_stage || "Analysis Ready"}
                                      </div>
                                  </div>

                                  <div className="mb-6">
                                      <p className="text-slate-600 text-sm leading-relaxed italic border-l-4 border-sim-blue pl-4 bg-slate-50 py-2 rounded-r-lg">
                                          "{result.identity_card.identity_text}"
                                      </p>
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                      <div className="bg-slate-50 p-4 rounded-xl border border-sim-border">
                                          <h5 className="text-xs font-bold text-sim-blue uppercase tracking-widest mb-3">Economic Model</h5>
                                          <ul className="space-y-2">
                                              {result.identity_card.economic_model?.map((item: string, i: number) => (
                                                  <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                                                      <span className="text-sim-cyan mt-1">●</span> {item}
                                                  </li>
                                              ))}
                                          </ul>
                                      </div>
                                      <div className="bg-slate-50 p-4 rounded-xl border border-sim-border">
                                          <h5 className="text-xs font-bold text-sim-blue uppercase tracking-widest mb-3">Sector Benchmarks ({location})</h5>
                                          <div className="grid grid-cols-2 gap-4">
                                              <div>
                                                  <span className="text-[10px] text-slate-400 block">Occupancy</span>
                                                  <span className="text-slate-900 font-mono font-bold">{result.identity_card.sector_params?.occupancy || 'N/A'}</span>
                                              </div>
                                              <div>
                                                  <span className="text-[10px] text-slate-400 block">Cap Rate</span>
                                                  <span className="text-slate-900 font-mono font-bold">{result.identity_card.sector_params?.cap_rate || 'N/A'}</span>
                                              </div>
                                              <div>
                                                  <span className="text-[10px] text-slate-400 block">Target IRR</span>
                                                  <span className="text-sim-green font-mono font-bold">{result.identity_card.sector_params?.returns || 'N/A'}</span>
                                              </div>
                                              <div>
                                                  <span className="text-[10px] text-slate-400 block">Primary Risk</span>
                                                  <span className="text-orange-500 text-xs font-bold leading-tight">{result.identity_card.sector_params?.risks || 'N/A'}</span>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      )}

                      {/* 2. MARKET INSIGHTS */}
                      {result.market_insights && (
                          <div className="bg-white p-6 rounded-2xl border border-sim-border relative overflow-hidden shadow-sm">
                              <div className="absolute top-0 left-0 w-full h-1 bg-sim-blue"></div>
                              <div className="flex items-center gap-3 mb-4">
                                  <span className="text-2xl">📈</span>
                                  <h4 className="text-lg font-bold text-sim-orange">Market Intelligence</h4>
                              </div>
                              
                              <p className="text-sm text-slate-600 leading-relaxed mb-6 font-medium">
                                  "{result.market_insights.demand_trend}"
                              </p>

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                  <div className="bg-slate-50 p-4 rounded-xl border border-sim-border">
                                      <div className="text-[10px] font-bold text-sim-blue uppercase mb-1">Benchmark</div>
                                      <p className="text-xs text-slate-600">{result.market_insights.benchmarks}</p>
                                  </div>
                                  <div className="bg-slate-50 p-4 rounded-xl border border-sim-border">
                                      <div className="text-[10px] font-bold text-red-500 uppercase mb-1">Macro Risks</div>
                                      <ul className="list-none space-y-1">
                                          {result.market_insights.macro_risks?.map((r: string, i: number) => (
                                              <li key={i} className="text-xs text-slate-600">• {r}</li>
                                          ))}
                                      </ul>
                                  </div>
                                  <div className="bg-slate-50 p-4 rounded-xl border border-sim-border">
                                      <div className="text-[10px] font-bold text-sim-green uppercase mb-1">Natural Investors</div>
                                      <ul className="list-none space-y-1">
                                          {result.market_insights.natural_investors?.map((inv: string, i: number) => (
                                              <li key={i} className="text-xs text-slate-600">• {inv}</li>
                                          ))}
                                      </ul>
                                  </div>
                              </div>
                          </div>
                      )}

                      {/* 3. TOKENIZATION MODELS (Comparison) */}
                      {result.tokenization_models && (
                          <div>
                              <h4 className="text-lg font-bold text-sim-orange mb-4 flex items-center gap-2">
                                  <span className="text-2xl">🏗️</span> Structural Strategy
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                  {result.tokenization_models.map((model: any, i: number) => (
                                      <div key={i} className="bg-white p-5 rounded-xl border border-sim-border hover:border-sim-blue transition-colors flex flex-col shadow-sm group">
                                          <div className="mb-3">
                                              <div className={`text-xs font-bold uppercase mb-1 text-slate-400`}>Model {String.fromCharCode(65+i)}</div>
                                              <h5 className="font-bold text-slate-900 text-sm leading-tight group-hover:text-sim-blue">{model.name}</h5>
                                          </div>
                                          
                                          <p className="text-xs text-slate-500 mb-4 flex-1 leading-relaxed">
                                              {model.description}
                                          </p>

                                          <div className="space-y-2 mb-4 border-y border-slate-100 py-3">
                                              <div className="flex justify-between text-[10px]">
                                                  <span className="text-slate-400">Ideal Investor</span>
                                                  <span className="text-slate-700 font-bold text-right">{model.ideal_investor}</span>
                                              </div>
                                              <div className="flex justify-between text-[10px]">
                                                  <span className="text-slate-400">Compliance</span>
                                                  <span className={`font-bold ${model.compliance_level === 'Low' ? 'text-sim-green' : model.compliance_level === 'High' ? 'text-red-500' : 'text-orange-500'}`}>{model.compliance_level}</span>
                                              </div>
                                              <div className="flex justify-between text-[10px]">
                                                  <span className="text-slate-400">Potential ROI</span>
                                                  <span className="text-sim-green font-bold">{model.potential_roi}</span>
                                              </div>
                                          </div>

                                          <div className="space-y-1">
                                              {model.pros?.slice(0,2).map((p: string, idx: number) => (
                                                  <div key={idx} className="flex items-start gap-1.5 text-[10px] text-slate-600">
                                                      <span className="text-sim-green font-bold">✓</span> {p}
                                                  </div>
                                              ))}
                                          </div>
                                      </div>
                                  ))}
                              </div>
                          </div>
                      )}

                      {/* 4. SWOT Grid (Compact) */}
                      <div className="bg-white p-6 rounded-2xl border border-sim-border shadow-sm">
                          <h4 className="text-xs font-bold text-slate-400 uppercase mb-4">SWOT Snapshot</h4>
                          <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                              <div>
                                  <span className="text-[10px] font-bold text-sim-green uppercase block mb-1">Strengths</span>
                                  <ul className="list-disc list-inside text-[10px] text-slate-600">
                                      {result.swot.strengths.slice(0,2).map((s: string, i: number) => <li key={i}>{s}</li>)}
                                  </ul>
                              </div>
                              <div>
                                  <span className="text-[10px] font-bold text-red-500 uppercase block mb-1">Weaknesses</span>
                                  <ul className="list-disc list-inside text-[10px] text-slate-600">
                                      {result.swot.weaknesses.slice(0,2).map((s: string, i: number) => <li key={i}>{s}</li>)}
                                  </ul>
                              </div>
                          </div>
                      </div>

                  </div>
              ) : (
                  <div className="h-full flex flex-col items-center justify-center bg-slate-50 border-2 border-sim-border border-dashed rounded-2xl text-slate-500 p-10 min-h-[400px]">
                      <div className="text-6xl mb-4 opacity-20 grayscale">🧬</div>
                      <p className="font-medium text-slate-600">Waiting for asset inputs...</p>
                      <p className="text-xs mt-2 max-w-xs text-center text-slate-400">Enter details on the left to unlock the full DNA report including Market Insights & Strategic Models.</p>
                  </div>
              )}
          </div>
      </div>
    </div>
  );
};
