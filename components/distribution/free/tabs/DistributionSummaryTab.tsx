
import React from 'react';
import { DistributionData } from '../../../../types';
import { Button } from '../../../../components/ui/Button';

interface Props {
  distribution: DistributionData;
}

export const DistributionSummaryTab: React.FC<Props> = ({ distribution }) => {
  return (
    <div className="space-y-8 animate-fadeIn text-center">
        <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-4xl mx-auto shadow-sm">
            📋
        </div>
        <h3 className="text-2xl font-bold text-slate-900">Strategy Locked</h3>
        
        <div className="bg-white p-6 rounded-2xl border border-slate-200 text-left max-w-lg mx-auto shadow-sm">
            <div className="space-y-4 text-sm">
                <div className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="text-slate-500">Target</span>
                    <span className="font-bold text-slate-900">{distribution.targetInvestorType}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="text-slate-500">Ticket Size</span>
                    <span className="font-bold text-slate-900">${distribution.minInvestment?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="text-slate-500">Channels</span>
                    <span className="font-bold text-slate-900 text-right max-w-[200px]">{distribution.marketingChannels.join(', ') || 'None'}</span>
                </div>
            </div>
        </div>

        <div className="flex gap-4 justify-center">
            <Button variant="secondary" className="border-slate-300">Edit</Button>
            <Button className="bg-blue-600 hover:bg-blue-500 text-white shadow-lg">
                Download PDF Report
            </Button>
        </div>
    </div>
  );
};
