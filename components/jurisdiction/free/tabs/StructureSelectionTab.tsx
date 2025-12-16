

import React, { useState } from 'react';
import { TokenizationState, SpvDatasheet } from '../../../../types';
import { SpvFormContainer } from '../../../pro/steps/spv_form/SpvFormContainer';
import { AiSuggestionBox } from '../../../AiSuggestionBox';
import { analyzeJurisdiction, getSpvDatasheet } from '../../../../services/mockAiService';
import { ENTITY_LIBRARY } from '../../../../content/jurisdictionContent';

interface Props {
  data: TokenizationState;
  updateData: (section: keyof TokenizationState, payload: any) => void;
  onNext: () => void;
}

export const StructureSelectionTab: React.FC<Props> = ({ data, updateData, onNext }) => {
  const { jurisdiction, property, projectInfo } = data;
  const [aiContent, setAiContent] = useState<any>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  
  // Selection State
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(jurisdiction.spvType || null);
  const [showForm, setShowForm] = useState(false);
  
  // Datasheet State (Cache)
  const [datasheets, setDatasheets] = useState<Record<string, SpvDatasheet>>({});
  const [analyzingSheet, setAnalyzingSheet] = useState<string | null>(null);

  const entities = ENTITY_LIBRARY[jurisdiction.country] || [];

  const handleRunAnalysis = async () => {
    setIsAiLoading(true);
    const result = await analyzeJurisdiction(
      jurisdiction.country,
      selectedEntityId || 'LLC', 
      property.category,
      jurisdiction.entityDetails,
      projectInfo
    );
    setAiContent(result);
    setIsAiLoading(false);
  };

  const handleAnalyzeEntity = async (entityId: string, entityName: string, e: React.MouseEvent) => {
      e.stopPropagation(); // Prevent card selection
      if (datasheets[entityId]) return; // Already loaded

      setAnalyzingSheet(entityId);
      try {
          const sheet = await getSpvDatasheet(jurisdiction.country, entityName);
          setDatasheets(prev => ({ ...prev, [entityId]: sheet }));
      } catch (err) {
          console.error(err);
      } finally {
          setAnalyzingSheet(null);
      }
  };

  const handleSelect = (entityId: string) => {
      setSelectedEntityId(entityId);
      updateData('jurisdiction', { spvType: entityId });
      setShowForm(true);
  };

  const handleBackToGrid = () => {
      setShowForm(false);
  };

  if (showForm) {
      return (
          <div className="animate-fadeIn">
              <button 
                onClick={handleBackToGrid}
                className="mb-4 text-xs font-bold text-sim-blue hover:text-sim-cta-hover flex items-center gap-2 uppercase tracking-wider"
              >
                  ← Back to Selection
              </button>
              
              <div className="text-center mb-6">
                 <h3 className="text-2xl font-bold text-slate-900 font-display">Customize Structure</h3>
                 <p className="text-slate-500 text-sm">Fine-tune your {selectedEntityId} parameters.</p>
             </div>

             <AiSuggestionBox 
                content={aiContent} 
                isLoading={isAiLoading} 
                onAsk={handleRunAnalysis} 
                title="AI Legal Advisor"
                contextNote="Ask AI to validate your structure against local regulations."
             />

             <div className="mt-8">
                 <SpvFormContainer 
                    data={data} 
                    updateData={updateData} 
                    onClose={onNext} 
                 />
             </div>
          </div>
      );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
         <div className="text-center mb-6">
             <h3 className="text-2xl font-bold text-slate-900 font-display">Select Legal Entity</h3>
             <p className="text-slate-500 text-sm">Available structures for {jurisdiction.country} ({data.jurisdiction.entityDetails.registrationState || 'General'}).</p>
         </div>

         {entities.length > 0 ? (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {entities.map(ent => (
                     <div 
                        key={ent.id}
                        className={`
                            relative p-6 rounded-2xl border-2 transition-all group flex flex-col h-full bg-white
                            ${selectedEntityId === ent.id ? 'border-sim-blue shadow-lg ring-1 ring-sim-blue' : 'border-sim-border hover:border-indigo-300 hover:shadow-md'}
                        `}
                     >
                         <div className="flex justify-between items-start mb-4">
                             <div>
                                 <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded ${ent.badgeColor.replace('bg-', 'bg-opacity-20 bg-').replace('text-', 'text-')}`}>
                                     {ent.badge}
                                 </span>
                                 <h4 className="text-xl font-bold text-slate-900 mt-2">{ent.name}</h4>
                             </div>
                             {selectedEntityId === ent.id && (
                                 <div className="bg-sim-blue text-white rounded-full p-1 shadow-sm">
                                     <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                 </div>
                             )}
                         </div>

                         <p className="text-sm text-slate-600 mb-6 flex-1 leading-relaxed">
                             {ent.desc}
                         </p>

                         {/* AI Datasheet Section */}
                         {datasheets[ent.id] ? (
                             <div className="mb-6 p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 text-xs space-y-2 animate-slideUp">
                                 <div className="flex justify-between">
                                     <span className="text-slate-500 font-medium">Min Capital:</span>
                                     <span className="font-mono text-slate-900 font-bold">{datasheets[ent.id].minCapital}</span>
                                 </div>
                                 <div className="flex justify-between">
                                     <span className="text-slate-500 font-medium">Setup Time:</span>
                                     <span className="font-mono text-slate-900 font-bold">{datasheets[ent.id].setupTime}</span>
                                 </div>
                                 <div className="pt-2 border-t border-indigo-200 mt-2">
                                     <span className="text-indigo-600 font-bold block mb-1">Tax Impact:</span>
                                     <p className="text-slate-600 leading-tight">{datasheets[ent.id].taxImplications}</p>
                                 </div>
                             </div>
                         ) : (
                             <div className="mb-6">
                                 <button 
                                    onClick={(e) => handleAnalyzeEntity(ent.id, ent.name, e)}
                                    disabled={analyzingSheet === ent.id}
                                    className="text-xs font-bold text-sim-ai hover:text-purple-700 flex items-center gap-1 transition-colors"
                                 >
                                     {analyzingSheet === ent.id ? (
                                         <>
                                            <svg className="animate-spin h-3 w-3 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Analyzing...
                                         </>
                                     ) : (
                                         <>✨ AI Analysis (Tax & Cost)</>
                                     )}
                                 </button>
                             </div>
                         )}

                         <button 
                            onClick={() => handleSelect(ent.id)}
                            className="w-full py-3 rounded-xl bg-sim-cta hover:bg-sim-cta-hover text-white font-bold shadow-lg transition-all active:scale-95"
                         >
                             Select {ent.acronym || 'Entity'}
                         </button>
                     </div>
                 ))}
             </div>
         ) : (
             <div className="p-12 text-center border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50">
                 <div className="text-4xl mb-4 opacity-20 grayscale">🚧</div>
                 <h4 className="text-lg font-bold text-slate-700">No Templates Found</h4>
                 <p className="text-slate-500 text-sm mb-6">We don't have pre-configured templates for {jurisdiction.country} yet.</p>
                 <button 
                    onClick={() => handleSelect('Generic SPV')}
                    className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold shadow-lg hover:bg-slate-800"
                 >
                     Use Generic SPV
                 </button>
             </div>
         )}
    </div>
  );
};