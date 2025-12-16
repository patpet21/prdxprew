import React from 'react';
import { DistributionData } from '../../../../types';
import { Select } from '../../../../components/ui/Select';
import { Input } from '../../../../components/ui/Input';

interface Props {
  distribution: DistributionData;
  updateData: (field: string, val: any) => void;
}

export const SalesStrategyTab: React.FC<Props> = ({ distribution, updateData }) => {
  return (
    <div className="space-y-8 animate-fadeIn">
        
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 text-lg mb-1">Investor Targeting</h3>
            <p className="text-sm text-slate-500 mb-6">Who are you selling to?</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                    <Select
                        id="investorType" label="Primary Audience"
                        value={distribution.targetInvestorType}
                        onChange={e => updateData('targetInvestorType', e.target.value)}
                        options={[
                            { value: 'Retail', label: 'Retail (General Public)' },
                            { value: 'Accredited', label: 'Accredited / HNWI Only' },
                            { value: 'Institutional', label: 'Institutional / Funds' },
                            { value: 'Mixed', label: 'Mixed Strategy' },
                        ]}
                    />
                </div>
                
                <Input 
                    id="min" label="Minimum Ticket ($)" type="number"
                    value={distribution.minInvestment || ''} onChange={e => updateData('minInvestment', parseFloat(e.target.value))}
                    placeholder="e.g. 5000"
                />
                <Input 
                    id="max" label="Maximum Ticket ($)" type="number" placeholder="No Limit"
                    value={distribution.maxInvestment || ''} onChange={e => updateData('maxInvestment', parseFloat(e.target.value))}
                />
            </div>
        </div>

        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
            <h3 className="font-bold text-slate-900 text-lg mb-4">Marketing Channels</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
               {['Direct Website', 'Launchpad Partner', 'Broker-Dealer', 'Crypto Exchanges', 'Private Network', 'Social Media'].map(channel => {
                 const isActive = distribution.marketingChannels.includes(channel);
                 return (
                   <button
                     key={channel}
                     onClick={() => {
                        const newCh = isActive ? distribution.marketingChannels.filter(c => c !== channel) : [...distribution.marketingChannels, channel];
                        updateData('marketingChannels', newCh);
                     }}
                     className={`px-4 py-3 rounded-xl text-sm font-semibold transition-all text-left flex items-center justify-between ${
                       isActive 
                        ? 'bg-indigo-600 text-white shadow-md transform scale-105' 
                        : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                     }`}
                   >
                     <span>{channel}</span>
                     {isActive && <span>✓</span>}
                   </button>
                 )
               })}
            </div>
        </div>

    </div>
  );
};