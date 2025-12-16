
import React, { useState } from 'react';
import { DistributionData } from '../../../../types';
import { Button } from '../../../../components/ui/Button';
import { generateMarketingAngle } from '../../../../services/mockAiService';

interface Props {
  distribution: DistributionData;
  updateData: (field: string, val: any) => void;
  onNext: () => void;
}

export const MarketingFunnelTab: React.FC<Props> = ({ distribution, updateData, onNext }) => {
  const [hook, setHook] = useState(distribution.marketingHook || '');
  const [loading, setLoading] = useState(false);
  const channels = distribution.marketingChannels || [];

  const toggleChannel = (ch: string) => {
      const updated = channels.includes(ch) ? channels.filter(c => c !== ch) : [...channels, ch];
      updateData('marketingChannels', updated);
  };

  const handleGenerateHook = async () => {
      setLoading(true);
      const res = await generateMarketingAngle('Real Estate', channels);
      setHook(res);
      updateData('marketingHook', res); // Persist
      setLoading(false);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
        <div className="bg-white p-6 rounded-2xl border border-sim-border shadow-sm">
            <h3 className="font-bold text-slate-900 text-lg mb-4">Acquisition Channels</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                {['Direct Website', 'Broker Network', 'Crypto Launchpad', 'Social Media Ads', 'Email Newsletter', 'Events'].map(ch => (
                    <button
                        key={ch}
                        onClick={() => toggleChannel(ch)}
                        className={`p-3 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all ${channels.includes(ch) ? 'bg-purple-600 text-white border-purple-600' : 'bg-slate-50 text-slate-500 border-slate-200 hover:border-purple-300'}`}
                    >
                        {ch}
                    </button>
                ))}
            </div>
            
            <div className="flex justify-between items-center bg-purple-50 p-4 rounded-xl border border-purple-100">
                <div>
                    <h5 className="text-xs font-bold text-purple-800 uppercase">AI Copywriter</h5>
                    <p className="text-xs text-purple-600 mt-1">Generate a headline based on channels.</p>
                </div>
                <Button onClick={handleGenerateHook} isLoading={loading} size="sm" className="bg-sim-ai hover:bg-purple-600 text-white">
                    Generate Hook
                </Button>
            </div>
        </div>

        {hook && (
            <div className="bg-slate-900 text-white p-8 rounded-2xl border border-slate-800 text-center shadow-xl animate-slideUp">
                <h4 className="text-sm text-slate-400 uppercase tracking-widest mb-4">Proposed Campaign Headline</h4>
                <h2 className="text-2xl md:text-3xl font-display font-bold">"{hook}"</h2>
            </div>
        )}

        <div className="flex justify-end pt-4 border-t border-slate-100">
             <button onClick={onNext} className="bg-sim-cta hover:bg-sim-cta-hover text-white px-8 py-3 rounded-xl font-bold shadow-lg transition-all">
                Save & Next →
             </button>
        </div>
    </div>
  );
};
