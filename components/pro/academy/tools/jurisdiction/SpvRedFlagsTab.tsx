
import React, { useState, useEffect } from 'react';
import { Button } from '../../../../ui/Button';
import { generateSpvRedFlags } from '../../../../../services/mockAiService';

export const SpvRedFlagsTab: React.FC = () => {
  const [filter, setFilter] = useState('All');
  const [riskTolerance, setRiskTolerance] = useState('Medium');
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<any>(null);

  // Load persistence
  useEffect(() => {
    const saved = localStorage.getItem('academyPro_spvModule');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.redFlagsSummary) {
         setResult(parsed.redFlagsSummary.flags);
         if (parsed.redFlagsSummary.filters) {
             setFilter(parsed.redFlagsSummary.filters.focusCategory);
             setRiskTolerance(parsed.redFlagsSummary.filters.riskTolerance);
         }
      }
    }
  }, []);

  const handleSave = () => {
      const current = JSON.parse(localStorage.getItem('academyPro_spvModule') || '{}');
      current.redFlagsSummary = {
          filters: { focusCategory: filter, riskTolerance },
          flags: result
      };
      localStorage.setItem('academyPro_spvModule', JSON.stringify(current));
  };

  const handleNext = () => {
      handleSave();
      const event = new CustomEvent('navToTab', { detail: 'BLUEPRINT' });
      window.dispatchEvent(event); // Simple event bus or parent callback in real app
  };

  const runScan = async () => {
      setIsScanning(true);
      
      // Gather data
      const strategic = JSON.parse(localStorage.getItem('pdx_academy_spv_module') || '{}');
      const architect = JSON.parse(localStorage.getItem('academyPro_spvArchitect') || '{}');
      
      const allData = { 
          strategic, 
          architect, 
          riskTolerance 
      };

      const scanResult = await generateSpvRedFlags(allData);
      setResult(scanResult);
      setIsScanning(false);
  };

  // Helper for filtering
  const displayFlags = result?.flags?.filter((f: any) => filter === 'All' || f.category === filter) || [];

  return (
    <div className="space-y-6 animate-fadeIn">
        
        {/* Controls */}
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row gap-6 items-end">
            <div className="flex-1">
                <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Focus Category</label>
                <select 
                    value={filter}
                    onChange={e => setFilter(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white outline-none"
                >
                    <option value="All">All Categories</option>
                    <option value="Legal">Legal</option>
                    <option value="Tax">Tax</option>
                    <option value="Investor">Investor</option>
                    <option value="Execution">Execution</option>
                    <option value="Cross-border">Cross-border</option>
                </select>
            </div>
             <div className="flex-1">
                <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Risk Tolerance</label>
                <select 
                    value={riskTolerance}
                    onChange={e => setRiskTolerance(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white outline-none"
                >
                    <option value="Low">Low (Strict)</option>
                    <option value="Medium">Medium (Balanced)</option>
                    <option value="High">High (Flexible)</option>
                </select>
            </div>
            <Button onClick={runScan} isLoading={isScanning} className="bg-red-600 hover:bg-red-500 shadow-lg shadow-red-900/20">
                {isScanning ? 'Scanning...' : 'Run Risk Scan'}
            </Button>
        </div>

        {/* Results */}
        {result && (
            <div className="space-y-6 animate-slideUp">
                
                {/* Heat Meter */}
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center justify-between">
                    <div>
                        <h4 className="text-white font-bold text-lg">Total Risk Heat</h4>
                        <p className="text-xs text-slate-500">Based on configured tolerance.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-48 h-4 bg-slate-800 rounded-full overflow-hidden">
                            <div 
                                style={{ width: `${result.riskHeat || 0}%` }}
                                className={`h-full transition-all duration-1000 ${(result.riskHeat || 0) > 70 ? 'bg-red-500' : (result.riskHeat || 0) > 40 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                            ></div>
                        </div>
                        <span className={`font-bold text-xl ${(result.riskHeat || 0) > 70 ? 'text-red-500' : (result.riskHeat || 0) > 40 ? 'text-amber-500' : 'text-emerald-500'}`}>
                            {result.riskHeat || 0}/100
                        </span>
                    </div>
                </div>

                {/* Flags Grid */}
                <div className="grid grid-cols-1 gap-4">
                    {displayFlags.length > 0 ? displayFlags.map((flag: any, i: number) => (
                        <div key={i} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all border-l-4 border-l-red-500 relative overflow-hidden">
                             <div className="flex justify-between items-start mb-2">
                                 <div>
                                     <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{flag.category}</span>
                                     <h5 className="font-bold text-slate-900 text-lg">{flag.title}</h5>
                                 </div>
                                 <div className="flex gap-2">
                                     <span className="text-[10px] px-2 py-1 bg-red-50 text-red-600 rounded font-bold border border-red-100">
                                         Imp: {flag.impact}
                                     </span>
                                     <span className="text-[10px] px-2 py-1 bg-slate-100 text-slate-600 rounded font-bold border border-slate-200">
                                         Prob: {flag.probability}
                                     </span>
                                 </div>
                             </div>
                             <p className="text-sm text-slate-600 mb-4">{flag.explanation}</p>
                             
                             <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-lg flex gap-3 items-start">
                                 <span className="text-emerald-500 font-bold text-lg">🛡️</span>
                                 <div>
                                     <span className="text-[10px] font-bold text-emerald-700 uppercase">Mitigation Strategy</span>
                                     <p className="text-xs text-emerald-900">{flag.mitigation}</p>
                                 </div>
                             </div>
                        </div>
                    )) : (
                        <div className="text-center py-12 text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
                            No flags found for this category.
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-4 pt-4 border-t border-slate-100">
                    <Button variant="secondary" onClick={handleSave}>Save Progress</Button>
                    <Button onClick={handleNext} className="bg-slate-900 text-white">Save & Next →</Button>
                </div>
            </div>
        )}
    </div>
  );
};
