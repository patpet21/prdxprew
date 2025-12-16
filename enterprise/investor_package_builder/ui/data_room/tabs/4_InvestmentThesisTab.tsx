
import React, { useState } from 'react';
import { DataRoomProject } from '../../../domain/data_room.entity';
import { Button } from '../../../../../../components/ui/Button';
import { dataRoomService } from '../../../services/data_room_service';

interface Props {
  data: DataRoomProject;
  update: (field: keyof DataRoomProject, val: any) => void;
}

export const InvestmentThesisTab: React.FC<Props> = ({ data, update }) => {
  const { thesis, overview } = data;
  const [isThinking, setIsThinking] = useState(false);

  const generateThesis = async () => {
      setIsThinking(true);
      const result = await dataRoomService.generateThesis(overview);
      update('thesis', result);
      setIsThinking(false);
  };

  return (
    <div className="animate-fadeIn space-y-8">
        <div className="flex justify-end">
            <Button onClick={generateThesis} isLoading={isThinking} className="bg-purple-600 hover:bg-purple-500">
                {isThinking ? 'Strategizing...' : 'Generate Institutional Thesis'}
            </Button>
        </div>

        <div className="bg-gradient-to-r from-slate-900 to-purple-900/40 p-8 rounded-2xl border border-purple-500/30 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
             <label className="text-xs font-bold text-purple-300 uppercase tracking-widest block mb-3">Core Thesis</label>
             <textarea 
                value={thesis?.coreThesis || ''}
                onChange={e => update('thesis', {...thesis, coreThesis: e.target.value})}
                className="w-full h-32 bg-transparent border-none text-white text-lg leading-relaxed outline-none resize-none placeholder:text-purple-200/30"
                placeholder="Why is this the single best investment opportunity right now?"
             />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                <h4 className="text-sm font-bold text-emerald-400 uppercase tracking-widest mb-4">Value Drivers</h4>
                <ul className="space-y-2">
                    {(thesis?.valueDrivers || []).map((d, i) => (
                        <li key={i} className="flex items-center gap-3 bg-emerald-900/20 p-3 rounded-lg border border-emerald-500/20">
                            <span className="text-emerald-500">✓</span>
                            <span className="text-sm text-emerald-100">{d}</span>
                        </li>
                    ))}
                    {(!thesis?.valueDrivers || thesis.valueDrivers.length === 0) && <p className="text-slate-500 text-sm italic">Pending Generation...</p>}
                </ul>
            </div>

            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                <h4 className="text-sm font-bold text-red-400 uppercase tracking-widest mb-4">Key Risks & Mitigations</h4>
                <ul className="space-y-2">
                    {(thesis?.risks || []).map((r, i) => (
                        <li key={i} className="p-3 bg-red-900/20 rounded-lg border border-red-500/20">
                            <p className="text-xs font-bold text-red-300 mb-1">{r}</p>
                            <p className="text-xs text-slate-400">Mitigation: {thesis?.mitigations?.[i] || 'TBD'}</p>
                        </li>
                    ))}
                    {(!thesis?.risks || thesis.risks.length === 0) && <p className="text-slate-500 text-sm italic">Pending Generation...</p>}
                </ul>
            </div>
        </div>
    </div>
  );
};
