
import React, { useState, useEffect } from 'react';
import { generateTokenSupplyAnalysis } from '../../../../../services/mockAiService';
import { Button } from '../../../../ui/Button';

interface Props {
  valuation: number;
  onChange: (data: { supply: number, price: number }) => void;
  // Enhanced Props
  data?: any;
  onUpdate?: (data: any) => void;
  onNext?: () => void;
}

export const SupplyPricing: React.FC<Props> = ({ valuation, onChange, data, onUpdate, onNext }) => {
  const [supply, setSupply] = useState(1000000);
  const [price, setPrice] = useState(valuation / 1000000);
  const [liquidityExpectations, setLiquidityExpectations] = useState('Medium');
  
  // AI State
  const [aiResult, setAiResult] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Initialize from data prop if available
  useEffect(() => {
      if (data) {
          if (data.supply) setSupply(data.supply);
          if (data.price) setPrice(data.price);
          if (data.liquidityExpectations) setLiquidityExpectations(data.liquidityExpectations);
          if (data.aiResult) setAiResult(data.aiResult);
      }
  }, []);

  // Auto-recalculate price when supply changes to match valuation (Market Cap = Valuation)
  const handleSupplyChange = (val: number) => {
      setSupply(val);
      const newPrice = valuation / val;
      setPrice(newPrice);
      onChange({ supply: val, price: newPrice }); // Keep legacy prop for now
  };

  const handlePriceChange = (val: number) => {
      setPrice(val);
      const newSupply = Math.round(valuation / val);
      setSupply(newSupply);
      onChange({ supply: newSupply, price: val });
  };

  const handleAskArchitect = async () => {
      setIsAnalyzing(true);
      
      const inputs = {
          totalSupply: supply,
          unitPrice: price,
          targetValuation: valuation,
          marketCap: supply * price,
          liquidityExpectations,
          projectType: "Real Estate/Asset" // Mock context
      };

      const result = await generateTokenSupplyAnalysis(inputs);
      setAiResult(result);
      setIsAnalyzing(false);
  };

  const handleSaveNext = () => {
      setIsSaving(true);
      if (onUpdate) {
          onUpdate({ supply, price, liquidityExpectations, aiResult });
      }
      // Also call legacy onChange just in case
      onChange({ supply, price });
      
      setTimeout(() => {
          setIsSaving(false);
          if (onNext) onNext();
      }, 500);
  };

  // Safe Accessors
  const educationList = Array.isArray(aiResult?.education) ? aiResult.education : [];
  const dexRoles = Array.isArray(aiResult?.providerBridge?.propertyDEXRole) ? aiResult.providerBridge.propertyDEXRole : [];
  const partnerTypes = Array.isArray(aiResult?.providerBridge?.partnerTypes) ? aiResult.providerBridge.partnerTypes : [];

  return (
    <div className="space-y-8 animate-fadeIn">
        
        {/* SECTION 1: CONFIGURATION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                <div className="flex justify-between items-end mb-6">
                    <h4 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                        <span className="text-xl">🎛️</span> Supply Engineer
                    </h4>
                    <span className="text-xs text-slate-500">Target: ${valuation.toLocaleString()}</span>
                </div>

                <div className="space-y-8">
                    {/* Supply Slider */}
                    <div>
                        <div className="flex justify-between text-xs font-bold text-slate-400 mb-2">
                            <span>Total Supply</span>
                            <span className="text-white font-mono">{supply.toLocaleString()} Tokens</span>
                        </div>
                        <input 
                            type="range" 
                            min="1000" 
                            max="100000000" 
                            step="1000"
                            value={supply}
                            onChange={(e) => handleSupplyChange(Number(e.target.value))}
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                        />
                        <div className="flex justify-between text-[10px] text-slate-600 mt-1 uppercase font-bold">
                            <span>Scarcity (1k)</span>
                            <span>Abundance (100M)</span>
                        </div>
                    </div>

                    {/* Price Input */}
                    <div className="p-4 bg-slate-800 rounded-xl border border-slate-700 flex items-center justify-between">
                        <div>
                            <span className="block text-xs text-slate-500 uppercase font-bold mb-1">Unit Price ($)</span>
                            <input 
                                type="number" 
                                value={price.toFixed(2)}
                                onChange={(e) => handlePriceChange(Number(e.target.value))}
                                className="bg-transparent text-2xl font-mono text-emerald-400 font-bold outline-none w-32"
                            />
                        </div>
                        <div className="text-right">
                            <span className="block text-xs text-slate-500 uppercase font-bold mb-1">Market Cap</span>
                            <span className="text-xl font-mono text-white font-bold">${valuation.toLocaleString()}</span>
                        </div>
                    </div>

                    {/* Context Switch */}
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Liquidity Strategy</label>
                        <select 
                            value={liquidityExpectations} 
                            onChange={(e) => setLiquidityExpectations(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white outline-none focus:border-indigo-500"
                        >
                            <option>Low (Long-term Hold)</option>
                            <option>Medium (Balanced)</option>
                            <option>High (Active Trading)</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* SECTION 2: AI TEACHING LAYER */}
            <div className="flex flex-col justify-between">
                 <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-full">
                     <h4 className="text-sm font-bold text-indigo-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <span className="text-xl">🎓</span> Supply & Demand Logic
                     </h4>
                     
                     {!aiResult ? (
                         <div className="flex flex-col items-center justify-center h-48 text-center opacity-60">
                             <span className="text-4xl mb-2">🧠</span>
                             <p className="text-sm text-slate-500">Configure parameters and ask the architect.</p>
                         </div>
                     ) : (
                         <div className="space-y-4 animate-slideUp">
                             <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-lg">
                                 <h5 className="text-xs font-bold text-indigo-700 uppercase mb-1">Valuation Check</h5>
                                 <p className="text-sm text-slate-700">{aiResult.valuationCheck}</p>
                             </div>
                             
                             <ul className="space-y-2">
                                 {educationList.map((pt: string, i: number) => (
                                     <li key={i} className="text-xs text-slate-600 flex gap-2">
                                         <span className="text-indigo-500 font-bold">•</span> {pt}
                                     </li>
                                 ))}
                             </ul>

                             <div className="pt-4 border-t border-slate-100">
                                 <p className="text-xs text-slate-500 italic">
                                     <strong>Why this matters:</strong> {aiResult.reasoningWhyThisStepExists}
                                 </p>
                             </div>
                         </div>
                     )}
                 </div>
                 
                 <div className="mt-6 text-center">
                    <Button 
                        onClick={handleAskArchitect} 
                        isLoading={isAnalyzing} 
                        className="w-full bg-sim-ai hover:bg-purple-600 text-white shadow-lg shadow-purple-500/20 py-3"
                    >
                        {isAnalyzing ? 'Analyzing Economics...' : '🧠 Analyze with Architect'}
                    </Button>
                </div>
            </div>
        </div>

        {/* SECTION 3: PROVIDER BRIDGE */}
        {aiResult && (
            <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 relative overflow-hidden animate-fadeIn">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
                
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="text-3xl">🌉</span>
                        <h3 className="text-xl font-bold text-white">Execution Bridge</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                        <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-600">
                            <h5 className="text-xs font-bold text-blue-400 uppercase mb-2">PropertyDEX Role</h5>
                            <ul className="text-xs text-slate-300 space-y-1">
                                {dexRoles.map((r: string, i: number) => <li key={i}>• {r}</li>)}
                            </ul>
                        </div>
                        
                        <div className="hidden md:flex items-center justify-center text-slate-500 text-2xl">➔</div>

                        <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-600">
                            <h5 className="text-xs font-bold text-emerald-400 uppercase mb-2">Partner Execution</h5>
                            <ul className="text-xs text-slate-300 space-y-1">
                                {partnerTypes.map((r: string, i: number) => <li key={i}>• {r}</li>)}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* FOOTER */}
        <div className="flex justify-end pt-6 border-t border-slate-200">
             <Button 
                onClick={handleSaveNext} 
                disabled={isSaving}
                className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg px-8 py-3 font-bold"
            >
                {isSaving ? 'Saving...' : 'Save & Next Section →'}
            </Button>
        </div>

    </div>
  );
};
