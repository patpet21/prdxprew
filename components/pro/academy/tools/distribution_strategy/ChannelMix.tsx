

import React, { useState, useEffect } from 'react';
import { Button } from '../../../../ui/Button';
import { generateChannelMixAnalysis } from '../../../../../services/mockAiService';
import { Input } from '../../../../ui/Input';
import { Select } from '../../../../ui/Select';

interface Props {
  onChange: (data: any) => void;
}

export const ChannelMix: React.FC<Props> = ({ onChange }) => {
  const [inputs, setInputs] = useState({
      allowedChannels: [] as string[],
      availableBudget: 10000,
      timelineMonths: 6,
      teamStrengths: [] as string[]
  });
  const [aiResult, setAiResult] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('academyPro_distribution');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            if (parsed.channelMix) {
                if (parsed.channelMix.inputs) setInputs(parsed.channelMix.inputs);
                if (parsed.channelMix.aiOutput) setAiResult(parsed.channelMix.aiOutput);
            }
        } catch (e) { console.error(e); }
    }
  }, []);

  const toggleList = (field: 'allowedChannels' | 'teamStrengths', item: string) => {
      const current = inputs[field];
      const updated = current.includes(item) ? current.filter(x => x !== item) : [...current, item];
      setInputs(prev => ({ ...prev, [field]: updated }));
  };

  const handleAnalyze = async () => {
      if (inputs.allowedChannels.length === 0) return alert("Select at least one channel.");
      setIsAnalyzing(true);
      const context = {
          investorPersona: JSON.parse(localStorage.getItem('academyPro_distribution') || '{}').investorPersona?.aiOutput,
      };
      const result = await generateChannelMixAnalysis(inputs, context);
      setAiResult(result);
      setIsAnalyzing(false);

      const current = JSON.parse(localStorage.getItem('academyPro_distribution') || '{}');
      current.channelMix = { inputs, aiOutput: result };
      localStorage.setItem('academyPro_distribution', JSON.stringify(current));
      onChange(result);
  };

  const ALL_CHANNELS = ['LinkedIn', 'Twitter/X', 'Email Marketing', 'Events/Conf', 'Paid Ads', 'Influencers/KOLs', 'PR/Media', 'Telegram/Discord'];

  return (
    <div className="space-y-8 animate-fadeIn">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <span className="text-xl">📢</span> Channel Configuration
                </h4>
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-3">Allowed Channels</label>
                    <div className="flex flex-wrap gap-2">
                        {ALL_CHANNELS.map(ch => (
                            <button
                                key={ch}
                                onClick={() => toggleList('allowedChannels', ch)}
                                className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${
                                    inputs.allowedChannels.includes(ch) 
                                        ? 'bg-indigo-600 text-white border-indigo-600' 
                                        : 'bg-slate-50 text-slate-500 border-slate-200 hover:border-indigo-300'
                                }`}
                            >
                                {ch}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <Input label="Budget ($)" id="budget" type="number" value={inputs.availableBudget} onChange={e => setInputs({...inputs, availableBudget: parseFloat(e.target.value)})} />
                    <Select 
                        label="Timeline" 
                        id="timeline" 
                        value={String(inputs.timelineMonths)} 
                        onChange={e => setInputs({...inputs, timelineMonths: parseInt(e.target.value)})} 
                        options={[{value:'3',label:'3 Months'},{value:'6',label:'6 Months'},{value:'12',label:'12 Months'}]} 
                    />
                </div>
                <Button onClick={handleAnalyze} isLoading={isAnalyzing} className="w-full bg-sim-ai hover:bg-purple-600 text-white shadow-lg">
                    {isAnalyzing ? 'Optimizing Mix...' : '🧠 Generate Mix Strategy'}
                </Button>
            </div>

            <div className="flex flex-col gap-6">
                {aiResult && (
                    <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-100 animate-slideUp">
                         <h5 className="text-xs font-bold text-emerald-800 uppercase tracking-widest mb-4 flex items-center gap-2">
                             <span>🏗️</span> Recommended Blueprint
                         </h5>
                         <div className="flex flex-col gap-2">
                             {aiResult.recommendedCoreMix?.map((c: string, i: number) => (
                                 <span key={i} className="text-sm font-bold text-slate-800 bg-white px-3 py-2 rounded border border-emerald-200 shadow-sm">{c}</span>
                             ))}
                         </div>
                         <p className="text-xs text-emerald-900/80 italic mt-4 border-l-2 border-emerald-400 pl-3">"{aiResult.blueprintRationale}"</p>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};