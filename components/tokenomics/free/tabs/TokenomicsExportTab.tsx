
import React from 'react';
import { Button } from '../../../ui/Button';
import { TokenizationState } from '../../../../types';
import { downloadPDF } from '../../../../utils/pdfGenerator';

interface Props {
  data: TokenizationState;
  onNextStep?: () => void;
}

const DetailRow = ({ label, value }: { label: string, value: string | number | undefined | null }) => (
    <div className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0">
        <span className="text-slate-500 text-sm">{label}</span>
        <span className="text-slate-900 font-bold text-sm text-right max-w-[200px] truncate">{value || '-'}</span>
    </div>
);

export const TokenomicsExportTab: React.FC<Props> = ({ data, onNextStep }) => {
  const { property, tokenAllocation, tokenStrategy } = data;
  
  const marketCap = (property.total_tokens || 0) * (property.token_price || 0);

  const handleDownload = () => {
    const reportData = {
        Economics: {
            TokenPrice: `€${property.token_price}`,
            TotalSupply: property.total_tokens?.toLocaleString(),
            MarketCap: `€${marketCap.toLocaleString()}`,
            HardCap: `€${property.hard_cap?.toLocaleString()}`
        },
        YieldMetrics: {
            AnnualYield: `${property.annual_yield}%`,
            TargetIRR: `${property.roi_target}%`,
            PayoutFrequency: property.distribution_frequency
        },
        CapTable: {
            Investors: `${tokenAllocation.investors}%`,
            Sponsor: `${tokenAllocation.founders}%`,
            Treasury: `${tokenAllocation.treasury}%`,
            Advisors: `${tokenAllocation.advisors}%`
        },
        Strategy: {
            Behavior: tokenStrategy?.behavior || 'Not Defined',
            Compliance: tokenStrategy?.complianceNote || 'Not Defined'
        }
    };

    downloadPDF(`Tokenomics_Blueprint`, reportData);
  };

  // Safe render helper
  const getInsightText = () => {
      if (typeof data.aiTokenomicsInsight === 'string') return data.aiTokenomicsInsight;
      return 'Standard model aligned with asset class.';
  };

  return (
    <div className="animate-fadeIn space-y-8 pb-12">
        
        <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-slate-900 font-display mb-2">Tokenomics Blueprint</h3>
            <p className="text-slate-500 max-w-lg mx-auto">
                Your economic model is configured. Review the supply, pricing, and distribution logic.
            </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl max-w-3xl mx-auto relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
            
            <div className="flex justify-between items-start mb-8">
                <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Structure Status</span>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        <h4 className="text-xl font-bold text-slate-900">Valid Configuration</h4>
                    </div>
                </div>
                <div className="text-4xl">🪙</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                <div>
                    <h5 className="text-xs font-bold text-indigo-600 uppercase mb-4 border-b border-indigo-100 pb-2">Supply & Price</h5>
                    <DetailRow label="Token Price" value={`€${property.token_price}`} />
                    <DetailRow label="Total Supply" value={property.total_tokens?.toLocaleString()} />
                    <DetailRow label="Implied Market Cap" value={`€${marketCap.toLocaleString()}`} />
                </div>
                <div>
                    <h5 className="text-xs font-bold text-indigo-600 uppercase mb-4 border-b border-indigo-100 pb-2">Targets</h5>
                    <DetailRow label="Annual Yield" value={`${property.annual_yield}%`} />
                    <DetailRow label="Target IRR" value={`${property.roi_target}%`} />
                    <DetailRow label="Hard Cap" value={`€${property.hard_cap?.toLocaleString()}`} />
                </div>
            </div>

            <div className="mt-8 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <h5 className="text-xs font-bold text-slate-700 uppercase mb-2">Strategic Insight</h5>
                <p className="text-xs text-slate-500 leading-relaxed italic">
                    "{getInsightText()}"
                </p>
            </div>
            
            {tokenStrategy && (
                 <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <h5 className="text-xs font-bold text-slate-700 uppercase mb-2">Token Behavior</h5>
                    <p className="text-xs text-slate-500 leading-relaxed">
                        {tokenStrategy.behavior}
                    </p>
                </div>
            )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto">
            <Button variant="secondary" onClick={handleDownload} className="flex-1 border-slate-300 bg-white">
                📥 Download Blueprint PDF
            </Button>
            {onNextStep && (
                <Button onClick={onNextStep} className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20">
                    💾 Save & Continue to Distribution →
                </Button>
            )}
        </div>
    </div>
  );
};
