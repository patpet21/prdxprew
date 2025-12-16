
import React, { useState } from 'react';
import { generateTermContext } from '../../../../../services/mockAiService';
import { Button } from '../../../../ui/Button';

interface Props {
  term: { id: string, label: string, desc: string };
  moduleState: any; 
  onUpdateState: (key: string, value: string) => void;
}

export const TermCard: React.FC<Props> = ({ term, moduleState, onUpdateState }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Initialize with saved data, but maintain local state for immediate feedback
  const savedContext = moduleState?.[`term_${term.id}`] || "";
  const [context, setContext] = useState(savedContext);

  const handleGenerate = async () => {
      const simState = localStorage.getItem('pdx_simulator_state') || "{}";
      
      setIsGenerating(true);
      // Call updated mock service that returns rich text
      const result = await generateTermContext(term.label, simState);
      
      setContext(result);
      onUpdateState(`term_${term.id}`, result); 
      setIsGenerating(false);
  };

  const handleSaveEdit = () => {
      onUpdateState(`term_${term.id}`, context);
      setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-lg transition-all h-full flex flex-col group">
        <div className="flex justify-between items-start mb-4">
            <h4 className="font-bold text-slate-900 text-lg group-hover:text-indigo-600 transition-colors">{term.label}</h4>
            <div className="text-2xl p-2 bg-slate-50 rounded-lg">📖</div>
        </div>
        
        <p className="text-sm text-slate-500 mb-6 leading-relaxed flex-1">
            {term.desc}
        </p>

        <div className="mt-auto">
            {context && !isEditing ? (
                <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 text-sm text-slate-800 relative group/edit animate-fadeIn">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                        <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">AI Applied Context</span>
                    </div>
                    <p className="leading-relaxed font-medium whitespace-pre-wrap">{context}</p>
                    
                    <button 
                        onClick={() => setIsEditing(true)}
                        className="absolute top-2 right-2 text-xs font-bold text-indigo-400 hover:text-indigo-600 opacity-0 group-hover/edit:opacity-100 transition-opacity bg-white px-2 py-1 rounded shadow-sm"
                    >
                        Edit
                    </button>
                </div>
            ) : isEditing ? (
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                     <textarea 
                        value={context}
                        onChange={(e) => setContext(e.target.value)}
                        className="w-full h-24 p-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                     />
                     <div className="flex justify-end gap-2 mt-3">
                        <button onClick={() => setIsEditing(false)} className="px-3 py-1 text-xs font-bold text-slate-500 hover:text-slate-700">Cancel</button>
                        <button onClick={handleSaveEdit} className="px-3 py-1 text-xs font-bold bg-indigo-600 text-white rounded hover:bg-indigo-700">Save Note</button>
                     </div>
                </div>
            ) : (
                <div className="text-center py-6 bg-slate-50 rounded-xl border border-dashed border-slate-300 group-hover:border-indigo-200 transition-colors">
                    <p className="text-xs text-slate-500 mb-3 font-medium">How does this apply to your project?</p>
                    <Button 
                        size="sm" 
                        onClick={handleGenerate} 
                        isLoading={isGenerating}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md w-full max-w-[180px]"
                    >
                        {isGenerating ? 'Analyzing...' : '✨ Generate Context'}
                    </Button>
                </div>
            )}
        </div>
    </div>
  );
};
