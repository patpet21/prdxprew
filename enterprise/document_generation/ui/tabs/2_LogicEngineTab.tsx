
import React, { useState, useEffect } from 'react';
import { LegalProjectData, LogicRule } from '../../domain/legal_engineering.entity';
import { legalEngineeringService } from '../../services/legal_engineering_service';
import { Button } from '../../../../components/ui/Button';

interface Props {
  data: LegalProjectData;
  updateData: (updates: Partial<LegalProjectData>) => void;
}

export const LogicEngineTab: React.FC<Props> = ({ data, updateData }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
      if (data.activeRules.length === 0) {
          handleGenerate();
      }
  }, []);

  const handleGenerate = async () => {
      setIsGenerating(true);
      const rules = await legalEngineeringService.generateLogicRules(data);
      updateData({ activeRules: rules });
      setIsGenerating(false);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
        <div className="flex justify-between items-center">
            <div>
                <h3 className="text-2xl font-bold text-white font-display">Rule-Based Logic Engine</h3>
                <p className="text-slate-400 text-sm mt-1">The engine maps your context to specific legal clauses.</p>
            </div>
            <Button onClick={handleGenerate} isLoading={isGenerating} className="bg-amber-600 hover:bg-amber-500">
                {isGenerating ? 'Computing Logic...' : 'Refresh Rules'}
            </Button>
        </div>

        <div className="grid grid-cols-1 gap-4">
            {data.activeRules.map((rule, i) => (
                <div key={rule.id} className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex items-center gap-6 relative overflow-hidden group hover:border-amber-500/50 transition-colors">
                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${rule.impactLevel === 'High' ? 'bg-red-500' : rule.impactLevel === 'Medium' ? 'bg-amber-500' : 'bg-blue-500'}`}></div>
                    
                    <div className="flex flex-col items-center px-2">
                        <div className="text-xs font-bold text-slate-500 uppercase mb-1">IF</div>
                        <div className="p-2 bg-slate-800 rounded-lg border border-slate-700 text-slate-300 font-mono text-xs">
                            {rule.condition}
                        </div>
                    </div>

                    <div className="text-slate-600 text-xl">➔</div>

                    <div className="flex-1">
                        <div className="text-xs font-bold text-slate-500 uppercase mb-1">THEN APPLY</div>
                        <div className="text-white font-medium text-sm">
                            {rule.action}
                        </div>
                    </div>

                    <div className="text-right">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase border ${
                            rule.impactLevel === 'High' ? 'text-red-400 border-red-500/30 bg-red-900/20' :
                            rule.impactLevel === 'Medium' ? 'text-amber-400 border-amber-500/30 bg-amber-900/20' :
                            'text-blue-400 border-blue-500/30 bg-blue-900/20'
                        }`}>
                            {rule.impactLevel} Impact
                        </span>
                    </div>
                </div>
            ))}
            
            {data.activeRules.length === 0 && !isGenerating && (
                <div className="p-12 border-2 border-dashed border-slate-800 rounded-xl text-center text-slate-500">
                    No rules generated yet. Click Refresh.
                </div>
            )}
        </div>
    </div>
  );
};
