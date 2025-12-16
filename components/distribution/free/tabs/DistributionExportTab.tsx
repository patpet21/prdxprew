
import React from 'react';
import { TokenizationState } from '../../../../types';
import { Button } from '../../../ui/Button';
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

export const DistributionExportTab: React.FC<Props> = ({ data, onNextStep }) => {
  const { distribution } = data;

  const handleDownload = () => {
    const reportData = {
        StrategyProfile: {
            TargetAudience: distribution.targetInvestorType,
            MinimumTicket: `$${distribution.minInvestment?.toLocaleString() || 0}`,
            OfferingType: distribution.offeringType,
            Timeline: distribution.offeringTimeline
        },
        Marketing: {
            Channels: distribution.marketingChannels.join(', ') || 'None Selected',
            Hook: distribution.marketingHook || 'Pending AI Generation'
        },
        RiskAnalysis: {
            Level: distribution.riskAssessment?.riskLevel || 'Pending',
            Summary: distribution.riskAssessment?.riskSummary || 'Pending'
        }
    };

    downloadPDF(`Distribution_Strategy_Report`, reportData);
  };

  return (
    <div className="animate-fadeIn space-y-8 pb-12">
        
        <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-slate-900 font-display mb-2">Distribution Strategy Locked</h3>
            <p className="text-slate-500 max-w-lg mx-auto">
                Your go-to-market plan is configured. Review your investor targeting and sales channels.
            </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl max-w-3xl mx-auto relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-teal-500 to-emerald-500"></div>
            
            <div className="flex justify-between items-start mb-8">
                <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Strategy Status</span>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        <h4 className="text-xl font-bold text-slate-900">Valid Configuration</h4>
                    </div>
                </div>
                <div className="text-4xl">📢</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                <div>
                    <h5 className="text-xs font-bold text-teal-600 uppercase mb-4 border-b border-teal-100 pb-2">Target Audience</h5>
                    <DetailRow label="Primary Investor" value={distribution.targetInvestorType} />
                    <DetailRow label="Min Ticket" value={`$${distribution.minInvestment?.toLocaleString()}`} />
                    <DetailRow label="Max Ticket" value={distribution.maxInvestment ? `$${distribution.maxInvestment.toLocaleString()}` : 'Unlimited'} />
                </div>
                <div>
                    <h5 className="text-xs font-bold text-teal-600 uppercase mb-4 border-b border-teal-100 pb-2">Offering</h5>
                    <DetailRow label="Type" value={distribution.offeringType} />
                    <DetailRow label="Timeline" value={distribution.offeringTimeline} />
                    <div className="mt-2 text-xs text-slate-500">
                        Channels: <span className="font-bold text-slate-700">{distribution.marketingChannels.length} Selected</span>
                    </div>
                </div>
            </div>

            <div className="mt-8 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <h5 className="text-xs font-bold text-slate-700 uppercase mb-2">Marketing Hook</h5>
                <p className="text-sm text-slate-600 leading-relaxed italic">
                    "{distribution.marketingHook || 'No hook generated.'}"
                </p>
            </div>
            
            {distribution.riskAssessment && (
                 <div className="mt-4 p-4 bg-amber-50 border border-amber-100 rounded-xl flex items-start gap-3">
                    <span className="text-xl">⚠️</span>
                    <div>
                        <h5 className="text-xs font-bold text-amber-800 uppercase mb-1">Risk Assessment</h5>
                        <p className="text-xs text-amber-700 leading-relaxed">
                            {distribution.riskAssessment.riskSummary}
                        </p>
                    </div>
                </div>
            )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto">
            <Button variant="secondary" onClick={handleDownload} className="flex-1 border-slate-300 bg-white">
                📥 Download Strategy PDF
            </Button>
            {onNextStep && (
                <Button onClick={onNextStep} className="flex-1 bg-slate-900 hover:bg-slate-800 text-white shadow-lg">
                    💾 Save & Continue to Summary →
                </Button>
            )}
        </div>
    </div>
  );
};
