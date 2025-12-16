
import React, { useEffect } from 'react';
import { LegalProjectData } from '../../domain/legal_engineering.entity';
import { legalEngineeringService } from '../../services/legal_engineering_service';

interface Props {
  data: LegalProjectData;
  updateData: (updates: Partial<LegalProjectData>) => void;
}

export const PreExportChecklistTab: React.FC<Props> = ({ data, updateData }) => {
  
  useEffect(() => {
      if (data.checklist.length === 0) {
          legalEngineeringService.generateChecklist(data).then(list => {
              updateData({ checklist: list });
          });
      }
  }, []);

  const toggleItem = (idx: number) => {
      const newList = [...data.checklist];
      newList[idx].checked = !newList[idx].checked;
      updateData({ checklist: newList });
  };

  const allChecked = data.checklist.length > 0 && data.checklist.every(i => i.checked);

  return (
    <div className="space-y-8 animate-fadeIn">
        <div className="flex justify-between items-end border-b border-slate-800 pb-6">
            <div>
                <h3 className="text-2xl font-bold text-white font-display">Final Validation</h3>
                <p className="text-slate-400 text-sm">Confirm structural integrity before packaging.</p>
            </div>
            <div className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-colors ${allChecked ? 'bg-emerald-500 text-slate-900' : 'bg-slate-800 text-slate-500'}`}>
                {allChecked ? 'Ready for Export' : 'Pending Items'}
            </div>
        </div>

        <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
            {data.checklist.map((item, i) => (
                <div 
                    key={i} 
                    onClick={() => toggleItem(i)}
                    className={`flex items-center gap-4 p-5 border-b border-slate-800 last:border-0 cursor-pointer transition-colors ${item.checked ? 'bg-slate-900' : 'bg-slate-900/50 hover:bg-slate-800'}`}
                >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all ${item.checked ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-600 text-transparent'}`}>
                        ✓
                    </div>
                    <span className={`text-sm font-medium ${item.checked ? 'text-white' : 'text-slate-400'}`}>
                        {item.item}
                    </span>
                </div>
            ))}
             {data.checklist.length === 0 && (
                <div className="p-8 text-center text-slate-500">Generating Checklist...</div>
             )}
        </div>
    </div>
  );
};
