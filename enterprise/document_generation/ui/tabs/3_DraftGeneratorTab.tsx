
import React, { useState } from 'react';
import { LegalProjectData, LegalClause } from '../../domain/legal_engineering.entity';
import { legalEngineeringService } from '../../services/legal_engineering_service';
import { Button } from '../../../../components/ui/Button';

interface Props {
  data: LegalProjectData;
  updateData: (updates: Partial<LegalProjectData>) => void;
}

export const DraftGeneratorTab: React.FC<Props> = ({ data, updateData }) => {
  const [selectedClauseId, setSelectedClauseId] = useState<string | null>(null);
  const [isDrafting, setIsDrafting] = useState(false);

  const requiredClauses = [
      "Definitions & Interpretation",
      "Token Rights & Obligations",
      "Transfer Restrictions",
      "Representations & Warranties",
      "Risk Factors"
  ];

  const handleGenerateClause = async (name: string) => {
      setIsDrafting(true);
      const newClause = await legalEngineeringService.generateClauseDraft(name, data);
      updateData({ draftClauses: [...data.draftClauses, newClause] });
      setIsDrafting(false);
      setSelectedClauseId(newClause.id);
  };

  const activeClause = data.draftClauses.find(c => c.id === selectedClauseId);

  return (
    <div className="h-full flex flex-col md:flex-row gap-6 animate-fadeIn">
        
        {/* Left: Outline / Controls */}
        <div className="w-full md:w-80 shrink-0 flex flex-col gap-6">
            <div className="bg-slate-900 p-5 rounded-xl border border-slate-800">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Document Outline</h4>
                <div className="space-y-2">
                    {requiredClauses.map((name, i) => {
                        const existing = data.draftClauses.find(c => c.title === name);
                        return (
                            <button
                                key={i}
                                onClick={() => existing ? setSelectedClauseId(existing.id) : handleGenerateClause(name)}
                                disabled={isDrafting}
                                className={`
                                    w-full text-left p-3 rounded-lg border text-sm transition-all flex justify-between items-center
                                    ${existing 
                                        ? (selectedClauseId === existing.id ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-slate-800 text-slate-300 border-slate-700') 
                                        : 'bg-transparent border-dashed border-slate-700 text-slate-500 hover:border-slate-500 hover:text-slate-400'
                                    }
                                `}
                            >
                                <span>{i+1}. {name}</span>
                                {existing ? <span className="text-xs">✓</span> : <span className="text-[10px] uppercase">Draft</span>}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="bg-slate-900 p-5 rounded-xl border border-slate-800">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">AI Controls</h4>
                {activeClause ? (
                    <div className="space-y-3">
                        <Button size="sm" className="w-full bg-slate-800 border border-slate-700 text-slate-300 hover:text-white">
                            🔄 Regenerate
                        </Button>
                        <Button size="sm" className="w-full bg-slate-800 border border-slate-700 text-slate-300 hover:text-white">
                            🔀 View Variants ({activeClause.variants?.length || 0})
                        </Button>
                    </div>
                ) : (
                    <p className="text-xs text-slate-500 italic">Select a clause to activate controls.</p>
                )}
            </div>
        </div>

        {/* Right: Editor Preview */}
        <div className="flex-1 bg-white rounded-xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden relative">
            {/* Editor Toolbar */}
            <div className="h-12 bg-slate-100 border-b border-slate-200 flex items-center px-4 justify-between">
                <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {activeClause ? activeClause.title : 'No Selection'}
                </span>
                <div className="text-xs text-slate-400">Markdown Mode</div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-slate-50/50">
                {activeClause ? (
                    <div className="prose prose-slate max-w-none">
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">{activeClause.title}</h2>
                        <div className="whitespace-pre-wrap text-sm leading-loose font-serif text-slate-800">
                            {activeClause.content}
                        </div>
                        <div className="mt-8 pt-4 border-t border-slate-200 text-xs text-slate-400 italic">
                            AI Generated Draft based on {data.governingLaw} Law.
                        </div>
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400">
                        <span className="text-4xl mb-4 opacity-30">📄</span>
                        <p>Select a section from the outline to begin drafting.</p>
                    </div>
                )}
            </div>

            {isDrafting && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
                    <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                    <span className="text-indigo-600 font-bold animate-pulse">Drafting Legal Text...</span>
                </div>
            )}
        </div>

    </div>
  );
};
