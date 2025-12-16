
import React, { useState, useEffect } from 'react';
import { Button } from '../../../../ui/Button';
import { generateRegionsLawAnalysis } from '../../../../../services/mockAiService';

export const GeoComplianceMarketing: React.FC = () => {
  const [inputs, setInputs] = useState({
    selectedMarkets: ['USA', 'EU'],
    tokenModel: 'Security Token',
    offerType: 'Private Placement',
    distributionMethod: 'Direct Sales',
    hasKYCAML: true,
    hasRegulatedCustodian: true
  });

  const [aiOutput, setAiOutput] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeRegionTab, setActiveRegionTab] = useState<number>(0);

  useEffect(() => {
    const saved = localStorage.getItem('academyPro_distribution');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            if (parsed.regionsLaw) {
                if (parsed.regionsLaw.inputs) setInputs(parsed.regionsLaw.inputs);
                if (parsed.regionsLaw.aiOutput) setAiOutput(parsed.regionsLaw.aiOutput);
            }
        } catch (e) { console.error(e); }
    }
  }, []);

  const toggleMarket = (market: string) => {
    const current = inputs.selectedMarkets;
    const updated = current.includes(market) 
      ? current.filter(m => m !== market) 
      : [...current, market];
    setInputs(prev => ({ ...prev, selectedMarkets: updated }));
  };

  const handleAnalyze = async () => {
    if (inputs.selectedMarkets.length === 0) return alert("Select at least one market.");
    setIsAnalyzing(true);
    
    const context = {
        investorPersona: JSON.parse(localStorage.getItem('academyPro_distribution') || '{}').investorPersona?.aiOutput,
        tokenomics: JSON.parse(localStorage.getItem('academyPro_tokenomics') || '{}')
    };

    const result = await generateRegionsLawAnalysis(inputs, context);
    setAiOutput(result);
    setIsAnalyzing(false);
    
    const current = JSON.parse(localStorage.getItem('academyPro_distribution') || '{}');
    current.regionsLaw = { inputs, aiOutput: result };
    localStorage.setItem('academyPro_distribution', JSON.stringify(current));
  };

  return (
    <div className="space-y-8 animate-fadeIn">
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
            <h4 className="text-sm font-bold text-blue-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                <span className="text-xl">🌍</span> Regional Configuration
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-3">Target Markets</label>
                    <div className="flex flex-wrap gap-3">
                        {['USA', 'EU', 'UK', 'UAE', 'Asia', 'LatAm'].map(m => {
                            const isSelected = inputs.selectedMarkets.includes(m);
                            return (
                                <button
                                    key={m}
                                    onClick={() => toggleMarket(m)}
                                    className={`px-4 py-2 rounded-lg border text-xs font-bold transition-all ${
                                        isSelected 
                                        ? 'bg-blue-600 text-white border-blue-600' 
                                        : 'bg-slate-950 text-slate-400 border-slate-700 hover:border-slate-500'
                                    }`}
                                >
                                    {m}
                                </button>
                            );
                        })}
                    </div>
                </div>
                <div className="flex justify-center items-center">
                    <Button onClick={handleAnalyze} isLoading={isAnalyzing} className="bg-blue-600 hover:bg-blue-500 text-white">
                        {isAnalyzing ? 'Analyzing...' : '🗺️ Analyze Regions'}
                    </Button>
                </div>
            </div>
        </div>

        {aiOutput && (
            <div className="animate-slideUp space-y-8">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-4">Professor's Lecture</h4>
                    <ul className="space-y-3">
                        {(aiOutput.education || []).map((pt: string, i: number) => (
                            <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                                <span className="text-blue-500 font-bold">•</span> {pt}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                    <div className="flex gap-2 overflow-x-auto mb-6 border-b border-slate-800 pb-2">
                        {(aiOutput.regionalAnalysis || []).map((regionData: any, i: number) => (
                            <button
                                key={i}
                                onClick={() => setActiveRegionTab(i)}
                                className={`px-4 py-2 rounded-t-lg text-xs font-bold uppercase transition-all ${activeRegionTab === i ? 'bg-slate-800 text-blue-400 border-b-2 border-blue-500' : 'text-slate-500 hover:text-slate-300'}`}
                            >
                                {regionData.region}
                            </button>
                        ))}
                    </div>

                    {aiOutput.regionalAnalysis && aiOutput.regionalAnalysis[activeRegionTab] && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 text-center">
                            <div className="text-5xl font-display font-bold text-white mb-2">
                                {aiOutput.regionalAnalysis[activeRegionTab].feasibilityScore}
                            </div>
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Feasibility Score</span>
                        </div>

                        <div className="lg:col-span-2 space-y-4">
                            <div className="p-3 bg-slate-800 rounded-lg border border-slate-700">
                                <h5 className="text-[10px] text-slate-400 uppercase font-bold mb-1">Messaging Style</h5>
                                <p className="text-sm text-white font-medium">{aiOutput.regionalAnalysis[activeRegionTab].messagingStyle}</p>
                            </div>
                            <div className="p-3 bg-red-900/10 border border-red-500/20 rounded-lg">
                                <h5 className="text-[10px] text-red-400 uppercase font-bold mb-1">Disclaimer Preview</h5>
                                <p className="text-xs text-red-200/80 italic">"{aiOutput.regionalAnalysis[activeRegionTab].disclaimers}"</p>
                            </div>
                        </div>
                    </div>
                    )}
                </div>
            </div>
        )}
    </div>
  );
};
