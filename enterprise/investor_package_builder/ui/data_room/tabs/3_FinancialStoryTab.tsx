
import React, { useState } from 'react';
import { DataRoomProject } from '../../../domain/data_room.entity';
import { Button } from '../../../../../../components/ui/Button';
import { dataRoomService } from '../../../services/data_room_service';

interface Props {
  data: DataRoomProject;
  update: (field: keyof DataRoomProject, val: any) => void;
}

export const FinancialStoryTab: React.FC<Props> = ({ data, update }) => {
  const { financials } = data;
  const [isWriting, setIsWriting] = useState(false);

  const handleGenerateNarrative = async () => {
      setIsWriting(true);
      const story = await dataRoomService.generateFinancialNarrative(financials);
      update('financials', { ...financials, narrative: story });
      setIsWriting(false);
  };

  const updateFin = (k: string, v: any) => update('financials', { ...financials, [k]: v });

  return (
    <div className="animate-fadeIn space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                <label className="text-xs text-slate-500 font-bold block mb-2">Valuation ($)</label>
                <input type="number" value={financials.valuation} onChange={e => updateFin('valuation', parseFloat(e.target.value))} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white font-mono" />
            </div>
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                <label className="text-xs text-slate-500 font-bold block mb-2">NOI (Annual)</label>
                <input type="number" value={financials.noi} onChange={e => updateFin('noi', parseFloat(e.target.value))} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white font-mono" />
            </div>
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                <label className="text-xs text-slate-500 font-bold block mb-2">Cap Rate (%)</label>
                <input type="number" value={financials.capRate} onChange={e => updateFin('capRate', parseFloat(e.target.value))} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white font-mono" />
            </div>
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                <label className="text-xs text-slate-500 font-bold block mb-2">Target IRR (%)</label>
                <input type="number" value={financials.irr} onChange={e => updateFin('irr', parseFloat(e.target.value))} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white font-mono" />
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                <div className="flex justify-between items-center mb-4">
                    <h4 className="text-sm font-bold text-white uppercase">Financial Narrative</h4>
                    <Button size="sm" onClick={handleGenerateNarrative} isLoading={isWriting} className="bg-amber-600">
                        Draft Story
                    </Button>
                </div>
                <textarea 
                    value={financials.narrative}
                    onChange={e => updateFin('narrative', e.target.value)}
                    className="w-full h-64 bg-slate-950 border border-slate-700 rounded-lg p-4 text-slate-300 text-sm leading-loose outline-none resize-none font-serif"
                    placeholder="The financial attractiveness of this deal lies in..."
                />
            </div>

            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 flex flex-col">
                <h4 className="text-sm font-bold text-white uppercase mb-4">Pro-Forma Visualization</h4>
                <div className="flex-1 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-center">
                    <div className="text-center">
                        <span className="text-4xl opacity-20 grayscale mb-2 block">📊</span>
                        <p className="text-slate-500 text-xs">Chart Engine Placeholder</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};
