

import React, { useState, useEffect } from 'react';
import { DistributionData } from '../../../../types';
import { Button } from '../../../../components/ui/Button';
import { getOfferingAdvice } from '../../../../services/mockAiService';

interface Props {
  distribution: DistributionData;
  updateData: (field: string, val: any) => void;
  onNext: () => void;
}

export const OfferingStyleTab: React.FC<Props> = ({ distribution, updateData, onNext }) => {
  const [offeringMode, setOfferingMode] = useState(distribution.offeringType || 'Private Placement');
  const [timeline, setTimeline] = useState(distribution.offeringTimeline || '3 Months');
  const [advice, setAdvice] = useState('');
  const [loading, setLoading] = useState(false);

  // Sync internal state to global state when it changes
  const handleModeChange = (mode: string) => {
      setOfferingMode(mode);
      updateData('offeringType', mode);
  };

  const handleTimelineChange = (tl: string) => {
      setTimeline(tl);
      updateData('offeringTimeline', tl);
  };

  // Initialize global state if empty
  useEffect(() => {
      if (!distribution.offeringType) updateData('offeringType', offeringMode);
      if (!distribution.offeringTimeline) updateData('offeringTimeline', timeline);
  }, []);

  const handleGetAdvice = async () => {
      setLoading(true);
      const res = await getOfferingAdvice(offeringMode, timeline);
      setAdvice(res);
      setLoading(false);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
        <div className="bg-white p-6 rounded-2xl border border-sim-border shadow-sm">
            <h3 className="font-bold text-slate-900 text-lg mb-4">Structuring the Raise</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-3">Offering Mode</label>
                    <div className="space-y-2">
                        {['Private Placement', 'Public Offering (Reg A+)', 'Club Deal'].map(mode => (
                            <button
                                key={mode}
                                onClick={() => handleModeChange(mode)}
                                className={`w-full text-left p-3 rounded-lg border transition-all ${offeringMode === mode ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'bg-white border-slate-200 hover:bg-slate-50'}`}
                            >
                                <div className="font-bold text-sm">{mode}</div>
                            </button>
                        ))}
                    </div>
                </div>
                <div>
                     <label className="text-xs font-bold text-slate-500 uppercase block mb-3">Expected Timeline</label>
                     <select 
                        value={timeline} 
                        onChange={e => handleTimelineChange(e.target.value)}
                        className="w-full p-3 rounded-lg border border-slate-200 bg-white outline-none"
                     >
                         <option>1 Month (Aggressive)</option>
                         <option>3 Months (Standard)</option>
                         <option>6+ Months (Public)</option>
                     </select>

                     <div className="mt-6">
                        <Button onClick={handleGetAdvice} isLoading={loading} size="sm" variant="secondary" className="w-full">
                            Get Timeline Advice
                        </Button>
                     </div>
                </div>
            </div>
        </div>

        {advice && (
            <div className="p-4 bg-indigo-900/10 border border-indigo-500/20 rounded-xl text-indigo-800 text-sm font-medium animate-slideUp">
                💡 {advice}
            </div>
        )}

        <div className="flex justify-end pt-4 border-t border-slate-100">
             <button 
                onClick={onNext}
                className="bg-sim-cta hover:bg-sim-cta-hover text-white px-8 py-3 rounded-xl font-bold shadow-lg transition-all"
             >
                Save & Next →
             </button>
        </div>
    </div>
  );
};