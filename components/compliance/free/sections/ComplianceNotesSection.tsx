
import React, { useState } from 'react';
import { Button } from '../../../ui/Button';
import { ComplianceData } from '../../../../types';
import { generateComplianceNotes } from '../../../../services/mockAiService';

interface Props {
  compliance: ComplianceData;
  updateData: (field: string, val: any) => void;
}

export const ComplianceNotesSection: React.FC<Props> = ({ compliance, updateData }) => {
  const [note, setNote] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
      setIsGenerating(true);
      const result = await generateComplianceNotes(compliance);
      setNote(result);
      setIsGenerating(false);
  };

  return (
    <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center text-sm font-bold">5</div>
            <h3 className="font-bold text-slate-900 text-lg">Compliance Notes (AI)</h3>
        </div>
        <Button 
            onClick={handleGenerate} 
            isLoading={isGenerating}
            size="sm"
            className="bg-purple-600 hover:bg-purple-500 text-white text-xs shadow-lg shadow-purple-500/20"
        >
            {isGenerating ? 'Writing...' : '✨ Generate Notes'}
        </Button>
      </div>

      <div className="relative flex-1">
          {note ? (
              <div className="bg-purple-50 p-5 rounded-xl border border-purple-100 animate-fadeIn h-full flex flex-col">
                  <textarea 
                    className="w-full bg-transparent text-slate-700 text-sm leading-relaxed outline-none resize-none flex-1 min-h-[150px]"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                  <div className="flex justify-end mt-3 pt-3 border-t border-purple-200/50">
                      <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-purple-400 rounded-full"></span> AI Generated
                      </span>
                  </div>
              </div>
          ) : (
              <div className="h-full min-h-[150px] border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400 bg-slate-50/50">
                  <span className="text-3xl mb-3 opacity-30">📝</span>
                  <p className="text-sm font-medium">Click "Generate" to draft a professional summary.</p>
              </div>
          )}
      </div>
    </div>
  );
};
