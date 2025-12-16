import React, { useState } from 'react';
import { DistributionData, TokenAllocation } from '../../../../types';
import { Button } from '../../../../components/ui/Button';
import { analyzeDistributionStrategy } from '../../../../services/mockAiService';

interface Props {
  distribution: DistributionData;
  allocation: TokenAllocation;
}

export const DistributionAiTab: React.FC<Props> = ({ distribution, allocation }) => {
  const [analysis, setAnalysis] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyze = async () => {
      setIsLoading(true);
      const res = await analyzeDistributionStrategy(distribution, allocation);
      setAnalysis(res);
      setIsLoading(false);
  };

  return (
    <div className="animate-fadeIn space-y-8">
        <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 text-center">
            <div className="w-16 h-16 bg-indigo-500/20 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-4 border border-indigo-500/30">
                🤖
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Distribution Analyst</h3>
            <p className="text-slate-400 text-sm max-w-md mx-auto mb-6">
                Is your strategy fair? Are your ticket sizes realistic? Let our AI validate your configuration.
            </p>
            <Button 
                onClick={handleAnalyze} 
                isLoading={isLoading}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 shadow-lg"
            >
                {isLoading ? 'Analyzing Structure...' : 'Run Analysis'}
            </Button>
        </div>

        {analysis && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slideUp">
                <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-xl">
                    <h5 className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-2 flex items-center gap-2">
                        <span>📊</span> Sponsor Check
                    </h5>
                    <p className="text-sm text-emerald-900 font-medium leading-relaxed">
                        "{analysis.sponsorCheck}"
                    </p>
                </div>

                <div className="bg-blue-50 border border-blue-100 p-5 rounded-xl">
                    <h5 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2 flex items-center gap-2">
                        <span>🎯</span> Strategy Fit
                    </h5>
                    <p className="text-sm text-blue-900 font-medium leading-relaxed">
                        "{analysis.strategyFit}"
                    </p>
                </div>

                <div className="bg-amber-50 border border-amber-100 p-5 rounded-xl">
                    <h5 className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-2 flex items-center gap-2">
                        <span>🔒</span> Vesting Hint
                    </h5>
                    <p className="text-sm text-amber-900 font-medium leading-relaxed">
                        "{analysis.vestingHint}"
                    </p>
                </div>
            </div>
        )}
    </div>
  );
};