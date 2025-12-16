
import React, { useState, useEffect } from 'react';
import { generateBusinessPlanSection } from '../../services/mockAiService';
import { Button } from '../ui/Button';
import { SECTIONS_CONFIG } from '../../content/business_plan/sections_config';

interface Props {
  sectionId: string;
  sectionTitle: string;
  content: string;
  onChange: (content: string) => void;
  onNext: () => void;
}

export const DynamicSectionEditor: React.FC<Props> = ({ sectionId, sectionTitle, content, onChange, onNext }) => {
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [inputValues, setInputValues] = useState<Record<string, string>>({});
  
  const config = SECTIONS_CONFIG[sectionId];

  // Reset inputs when section changes
  useEffect(() => {
      setInputValues({});
  }, [sectionId]);

  const handleInputChange = (name: string, value: string) => {
      setInputValues(prev => ({ ...prev, [name]: value }));
  };

  const handleAiDraft = async () => {
    setIsAiGenerating(true);
    
    // 1. Call AI Service with Inputs
    const generatedText = await generateBusinessPlanSection(sectionId, inputValues);
    
    // 2. Append or Replace content
    // For a smoother experience, we append if there is existing content, or replace if empty
    const newContent = content ? content + "\n\n" + generatedText : generatedText;
    
    onChange(newContent);
    setIsAiGenerating(false);
  };

  if (!config) {
      return <div className="p-8 text-center text-slate-500">Configuration not found for {sectionId}</div>;
  }

  return (
    <div className="h-full flex flex-col lg:flex-row overflow-hidden bg-slate-50">
        
        {/* LEFT: INPUTS FORM */}
        <div className="w-full lg:w-1/3 bg-white border-r border-slate-200 p-6 overflow-y-auto">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                {config.title} Inputs
            </h3>
            
            <div className="space-y-5">
                {config.fields.map((field) => (
                    <div key={field.name}>
                        <label className="text-xs font-bold text-slate-500 uppercase block mb-2">{field.label}</label>
                        {field.type === 'textarea' ? (
                             <textarea 
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm focus:border-indigo-500 outline-none resize-none h-24"
                                placeholder={field.placeholder}
                                value={inputValues[field.name] || ''}
                                onChange={(e) => handleInputChange(field.name, e.target.value)}
                             />
                        ) : (
                            <input 
                                type={field.type || 'text'}
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm focus:border-indigo-500 outline-none"
                                placeholder={field.placeholder}
                                value={inputValues[field.name] || ''}
                                onChange={(e) => handleInputChange(field.name, e.target.value)}
                            />
                        )}
                    </div>
                ))}
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100">
                <Button 
                    onClick={handleAiDraft} 
                    isLoading={isAiGenerating} 
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-200"
                >
                    {isAiGenerating ? 'Drafting...' : '✨ Write with AI'}
                </Button>
                <p className="text-[10px] text-slate-400 text-center mt-3">
                    AI will use these inputs to draft a professional section.
                </p>
            </div>
        </div>

        {/* RIGHT: EDITOR */}
        <div className="flex-1 flex flex-col h-full bg-slate-50">
             <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-white">
                <h2 className="font-bold text-slate-800 text-lg">{sectionTitle} <span className="text-slate-400 font-normal text-sm">Draft</span></h2>
                <div className="flex gap-2">
                    <button className="text-xs font-bold text-slate-500 hover:text-indigo-600 px-3 py-1.5 rounded hover:bg-slate-100 transition-colors">
                        Clear
                    </button>
                    <button className="text-xs font-bold text-slate-500 hover:text-indigo-600 px-3 py-1.5 rounded hover:bg-slate-100 transition-colors">
                        Copy
                    </button>
                </div>
            </div>

            <textarea 
                value={content || ''}
                onChange={(e) => onChange(e.target.value)}
                className="flex-1 w-full p-8 resize-none outline-none text-slate-800 leading-loose font-serif text-lg placeholder:text-slate-300 bg-white"
                placeholder={`Use the form on the left to generate content, or start typing your ${sectionTitle} here...`}
            />

            <div className="p-4 border-t border-slate-200 bg-white flex justify-end">
                <Button onClick={onNext} className="bg-slate-900 text-white px-8">
                    Save & Next Section →
                </Button>
            </div>
        </div>

    </div>
  );
};
