
import React, { useState, useEffect } from 'react';
import { Button } from '../../../../ui/Button';
import { Select } from '../../../../ui/Select';
import { generateInvestorFitDecisionMatrix } from '../../../../../services/mockAiService';

interface Props {
    onExport?: () => void;
    isExporting?: boolean;
    onNext?: () => void; // Navigation Prop
}

export const InvestorFitCompare: React.FC<Props> = ({ onExport, isExporting, onNext }) => {
  const [inputs, setInputs] = useState({
      investorA: 'Retail (Crowd)',
      investorB: 'Family Office',
      ticketRange: '$500 - $5,000',
      reportingLevel: 'Low (Automated)',
      acquisitionChannel: 'Social Media Ads'
  });

  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('academyPro_compare');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            if (parsed.investorFit) {
                setInputs(parsed.investorFit.inputs || inputs);
                setResult(parsed.investorFit.result);
            }
        } catch(e) {}
    }
  }, []);

  const handleChange = (field: string, val: string) => {
      setInputs(prev => ({ ...prev, [field]: val }));
  };

  const handleCompare = async () => {
      setLoading(true);
      const data = await generateInvestorFitDecisionMatrix(inputs);
      setResult(data);
      setLoading(false);
      saveState(data);
  };

  const saveState = (dataToSave = result) => {
      const current = JSON.parse(localStorage.getItem('academyPro_compare') || '{}');
      current.investorFit = { inputs, result: dataToSave };
      localStorage.setItem('academyPro_compare', JSON.stringify(current));
  };

  return (
    <div className="space-y-8 animate-fadeIn">
        
        {/* INPUTS */}
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-lg">
            <div className="flex justify-between items-center mb-6">
                <h4 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                    <span className="text-xl">👥</span> Audience Match
                </h4>
                <div className="text-[10px] bg-slate-800 text-slate-400 px-2 py-1 rounded border border-slate-700">
                    Reality Check
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-700/50 space-y-4">
                    <h5 className="text-xs font-bold text-indigo-400 uppercase">Profile A</h5>
                    <Select 
                        value={inputs.investorA}
                        onChange={e => handleChange('investorA', e.target.value)}
                        options={[
                            { value: 'Retail (Crowd)', label: 'Retail (General Public)' },
                            { value: 'Crypto Native', label: 'Crypto Native (DeFi)' },
                            { value: 'Accredited Angel', label: 'Accredited Angel' }
                        ]}
                        className="bg-slate-900 border-slate-700 text-white text-sm" label={''}                    />
                </div>
                <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-700/50 space-y-4">
                    <h5 className="text-xs font-bold text-emerald-400 uppercase">Profile B</h5>
                    <Select 
                        value={inputs.investorB}
                        onChange={e => handleChange('investorB', e.target.value)}
                        options={[
                            { value: 'Family Office', label: 'Family Office' },
                            { value: 'VC Fund', label: 'Venture Capital Fund' },
                            { value: 'Real Estate PE', label: 'Real Estate PE' }
                        ]}
                        className="bg-slate-900 border-slate-700 text-white text-sm" label={''}                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <Select 
                    label="Ticket Range"
                    value={inputs.ticketRange}
                    onChange={e => handleChange('ticketRange', e.target.value)}
                    options={[
                        { value: '$100 - $1,000', label: 'Micro ($100 - $1k)' },
                        { value: '$5k - $25k', label: 'Mid ($5k - $25k)' },
                        { value: '$100k - $500k', label: 'Macro ($100k - $500k)' },
                        { value: '$1M+', label: 'Whale ($1M+)' }
                    ]}
                    className="bg-slate-800 border-slate-700 text-white text-sm"
                />
                 <Select 
                    label="Reporting Level"
                    value={inputs.reportingLevel}
                    onChange={e => handleChange('reportingLevel', e.target.value)}
                    options={[
                        { value: 'Low (Automated)', label: 'Low (Automated Dashboard)' },
                        { value: 'Medium (Quarterly)', label: 'Medium (Quarterly Reports)' },
                        { value: 'High (Bespoke)', label: 'High (Dedicated Calls)' }
                    ]}
                    className="bg-slate-800 border-slate-700 text-white text-sm"
                />
                 <Select 
                    label="Acquisition Channel"
                    value={inputs.acquisitionChannel}
                    onChange={e => handleChange('acquisitionChannel', e.target.value)}
                    options={[
                        { value: 'Social Media Ads', label: 'Social Media Ads' },
                        { value: 'Events / Network', label: 'Events / Network' },
                        { value: 'Placement Agent', label: 'Placement Agent' },
                        { value: 'Crypto Launchpad', label: 'Crypto Launchpad' }
                    ]}
                    className="bg-slate-800 border-slate-700 text-white text-sm"
                />
            </div>

            <div className="flex justify-center">
                <Button 
                    onClick={handleCompare} 
                    isLoading={loading} 
                    className="bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 text-white shadow-xl px-12 py-3"
                >
                    {loading ? 'Crunching CAC Data...' : '🔮 Predict Investor Fit'}
                </Button>
            </div>
        </div>

        {/* RESULTS */}
        {result && (
            <div className="animate-slideUp space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Investor A Card */}
                    <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl">A</div>
                        <h4 className="text-lg font-bold text-white mb-2">{result.investorA?.name || 'Investor A'}</h4>
                        <div className="flex gap-2 mb-4">
                            <span className={`text-[10px] font-bold px-2 py-1 rounded border ${result.investorA?.realityStatus === 'Realistic' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50' : 'bg-red-500/20 text-red-400 border-red-500/50'}`}>
                                {result.investorA?.realityStatus || 'Unknown'}
                            </span>
                            <span className="text-[10px] font-bold px-2 py-1 rounded border bg-slate-800 text-slate-300 border-slate-700">
                                CAC: {result.investorA?.cacEstimate || 'N/A'}
                            </span>
                        </div>
                        <p className="text-xs text-slate-400 mb-2"><strong>The Win:</strong> {result.investorA?.winningHook}</p>
                        <p className="text-xs text-red-400 italic"><strong>Friction:</strong> {result.investorA?.frictionPoint}</p>
                    </div>

                    {/* Investor B Card */}
                    <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl">B</div>
                        <h4 className="text-lg font-bold text-white mb-2">{result.investorB?.name || 'Investor B'}</h4>
                         <div className="flex gap-2 mb-4">
                            <span className={`text-[10px] font-bold px-2 py-1 rounded border ${result.investorB?.realityStatus === 'Realistic' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50' : 'bg-red-500/20 text-red-400 border-red-500/50'}`}>
                                {result.investorB?.realityStatus || 'Unknown'}
                            </span>
                            <span className="text-[10px] font-bold px-2 py-1 rounded border bg-slate-800 text-slate-300 border-slate-700">
                                CAC: {result.investorB?.cacEstimate || 'N/A'}
                            </span>
                        </div>
                        <p className="text-xs text-slate-400 mb-2"><strong>The Win:</strong> {result.investorB?.winningHook}</p>
                        <p className="text-xs text-red-400 italic"><strong>Friction:</strong> {result.investorB?.frictionPoint}</p>
                    </div>
                </div>

                {/* Pivot Advice */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-4">Strategic Pivots</h4>
                    <div className="space-y-3">
                        {(result.pivotMoves || []).map((move: any, i: number) => (
                            <div key={i} className="flex items-start gap-3 text-sm text-slate-600">
                                <div className="mt-1 w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold shrink-0">{i+1}</div>
                                <div>
                                    <strong className="text-indigo-900 block mb-0.5">{move.move}</strong>
                                    <span className="text-slate-500 text-xs">{move.impact}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Final Verdict */}
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-1 rounded-xl shadow-lg">
                    <div className="bg-slate-900 rounded-lg p-4 text-center">
                        <h4 className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-2">AI Verdict</h4>
                        <p className="text-lg text-white font-medium">"{result.verdict}"</p>
                    </div>
                </div>

                {/* EXPORT & PROCEED */}
                <div className="flex flex-col md:flex-row gap-4 justify-center pt-8 border-t border-slate-800/50">
                    <Button 
                        onClick={onExport} 
                        disabled={!result || isExporting}
                        isLoading={isExporting}
                        className="bg-slate-800 hover:bg-slate-700 text-white shadow-xl px-12 py-4 text-sm font-bold flex items-center gap-2 border border-slate-700"
                    >
                        {isExporting ? 'Generating PDF...' : '📥 Finalize & Export Matrix'}
                    </Button>

                    <Button 
                        onClick={onNext} 
                        className="bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl px-12 py-4 text-sm font-bold flex items-center gap-2"
                    >
                        Proceed to Build →
                    </Button>
                </div>

            </div>
        )}
    </div>
  );
};
