

import React, { useState } from 'react';
import { DistributionData } from '../../../../types';
import { Select } from '../../../../components/ui/Select';
import { Button } from '../../../../components/ui/Button';
import { analyzeInvestorFit } from '../../../../services/mockAiService';

interface Props {
  distribution: DistributionData;
  updateData: (field: string, val: any) => void;
  onNext: () => void;
}

export const InvestorProfilingTab: React.FC<Props> = ({ distribution, updateData, onNext }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiInsight, setAiInsight] = useState<{ matchScore: number; insight: string } | null>(null);

  const handleAnalyze = async () => {
    if (!distribution.targetInvestorType || !distribution.minInvestment) return;
    setIsAnalyzing(true);
    const result = await analyzeInvestorFit(distribution.targetInvestorType, distribution.minInvestment);
    setAiInsight(result);
    setIsAnalyzing(false);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
        <div className="bg-white p-6 rounded-2xl border border-sim-border shadow-sm">
            <h3 className="font-bold text-slate-900 text-lg mb-4">Investor Qualification</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Select
                    id="investorType" label="Primary Audience"
                    value={distribution.targetInvestorType}
                    onChange={e => updateData('targetInvestorType', e.target.value)}
                    options={[
                        { value: 'Retail', label: 'Retail (Crowdfunding)' },
                        { value: 'Accredited', label: 'Accredited / HNWI Only' },
                        { value: 'Institutional', label: 'Institutional / Funds' },
                    ]}
                />
                <div>
                   <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Minimum Ticket ($)</label>
                   <input 
                       type="number"
                       className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none"
                       value={distribution.minInvestment || ''}
                       onChange={e => updateData('minInvestment', parseFloat(e.target.value))}
                       placeholder="5000"
                   />
                </div>
            </div>
            
            <div className="mt-6 flex justify-end">
                <Button size="sm" onClick={handleAnalyze} isLoading={isAnalyzing} disabled={!distribution.targetInvestorType} className="bg-sim-ai hover:bg-purple-600">
                    Analyze Fit with AI
                </Button>
            </div>
        </div>

        {aiInsight && (
            <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 animate-slideUp">
                <div className="flex items-center gap-4 mb-2">
                    <div className="text-3xl">🎯</div>
                    <div>
                        <h4 className="font-bold text-lg">AI Match Score: <span className={aiInsight.matchScore > 80 ? 'text-emerald-400' : 'text-amber-400'}>{aiInsight.matchScore}/100</span></h4>
                        <p className="text-sm text-slate-300">{aiInsight.insight}</p>
                    </div>
                </div>
            </div>
        )}

        <div className="flex justify-end pt-4 border-t border-slate-100">
             <button 
                onClick={onNext}
                className="bg-sim-cta hover:bg-sim-cta-hover text-white px-8 py-3 rounded-xl font-bold shadow-lg transition-all flex items-center gap-2"
             >
                Save & Next →
             </button>
        </div>
    </div>
  );
};