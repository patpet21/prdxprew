

import React, { useEffect, useState, useRef } from 'react';
import { StepProps, AiResponse } from '../../../types';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { AiSuggestionBox } from '../../../components/AiSuggestionBox';
import { analyzeJurisdiction, getRegionRecommendations, getSpvRecommendation, generateEntityDetails } from '../../../services/mockAiService';
import { ENTITY_LIBRARY, JURISDICTION_METADATA, JurisdictionMeta, EntityDefinition } from '../../../content/jurisdictionContent';

const CountrySelectionCard: React.FC<{ 
    meta: JurisdictionMeta, 
    isActive: boolean, 
    onClick: () => void 
}> = ({ meta, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`
            relative p-4 rounded-xl border-2 transition-all duration-300 group text-left h-full flex flex-col items-center md:items-start justify-center md:justify-start active:scale-95
            ${isActive 
                ? 'bg-slate-800 border-emerald-500 shadow-xl shadow-emerald-900/20 transform scale-105 z-10' 
                : 'bg-slate-900 border-slate-800 hover:border-emerald-500/50 hover:shadow-lg'
            }
        `}
    >
        <div className="flex items-center justify-between w-full mb-2 md:mb-3">
            <span className="text-2xl md:text-3xl shadow-sm rounded-full bg-slate-800 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center border border-slate-700 mx-auto md:mx-0">
                {meta.flag}
            </span>
            {isActive && (
                <div className="bg-emerald-500 rounded-full p-1 absolute top-3 right-3 md:relative md:top-auto md:right-auto">
                    <svg className="w-3 h-3 text-slate-900" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                </div>
            )}
        </div>
        <h3 className={`font-bold font-display text-sm md:text-lg mb-1 text-center md:text-left ${isActive ? 'text-white' : 'text-slate-300'}`}>
            {meta.name}
        </h3>
        <p className={`text-[10px] md:text-xs font-semibold uppercase tracking-wider text-center md:text-left ${isActive ? 'text-emerald-400' : 'text-slate-500'}`}>
            {meta.tagline}
        </p>
    </button>
);

export const Ent_JurisdictionStep: React.FC<StepProps> = ({ data, updateData, onValidationChange }) => {
  const { jurisdiction, property, projectInfo } = data;
  const { entityDetails } = jurisdiction;
  
  const [aiContent, setAiContent] = useState<AiResponse | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [activeEntityDef, setActiveEntityDef] = useState<EntityDefinition | null>(null);
  const [recommendedRegions, setRecommendedRegions] = useState<string[]>([]);
  const [isLoadingRegions, setIsLoadingRegions] = useState(false);
  const [spvRecommendation, setSpvRecommendation] = useState<{ recommendedSpvId: string, reasoning: string } | null>(null);
  const [isSpvRecLoading, setIsSpvRecLoading] = useState(false);

  useEffect(() => {
    if (jurisdiction.country) {
        setIsLoadingRegions(true);
        updateData('jurisdiction', { 
            entityDetails: { ...jurisdiction.entityDetails, registrationState: '' },
            spvType: ''
        });
        setSpvRecommendation(null);
        
        getRegionRecommendations(jurisdiction.country, property.category)
            .then(regions => {
                setRecommendedRegions(Array.isArray(regions) ? regions : []);
                setIsLoadingRegions(false);
            });
    }
  }, [jurisdiction.country, property.category]);

  useEffect(() => {
      if (jurisdiction.country && entityDetails.registrationState) {
          setIsSpvRecLoading(true);
          getSpvRecommendation(jurisdiction.country, entityDetails.registrationState, property.category, projectInfo)
            .then(rec => {
                setSpvRecommendation(rec);
                setIsSpvRecLoading(false);
            });
      }
  }, [jurisdiction.country, entityDetails.registrationState, property.category, projectInfo]);

  useEffect(() => {
    if (jurisdiction.country && jurisdiction.spvType) {
      const def = ENTITY_LIBRARY[jurisdiction.country]?.find(e => e.id === jurisdiction.spvType);
      setActiveEntityDef(def || null);
      if (def && !entityDetails.governanceType) {
        updateData('jurisdiction', { 
            entityDetails: { ...entityDetails, governanceType: def.governanceOptions[0] } 
        });
      }
    }
  }, [jurisdiction.country, jurisdiction.spvType]);

  useEffect(() => {
    const hasDirectors = entityDetails?.directors?.length > 0;
    const hasName = Boolean(entityDetails?.companyName);
    const hasRegion = Boolean(entityDetails?.registrationState);
    onValidationChange(hasName && hasDirectors && hasRegion);
  }, [jurisdiction, entityDetails, activeEntityDef, onValidationChange]);

  const handleRunAnalysis = async () => {
    if (!jurisdiction.country || !jurisdiction.spvType) return;
    setIsAiLoading(true);
    const result = await analyzeJurisdiction(
      jurisdiction.country, 
      jurisdiction.spvType, 
      property.category, 
      entityDetails,
      projectInfo
    );
    setAiContent({ ...result, text: result.text || 'Analysis complete' }); // Ensure text property is present
    setIsAiLoading(false);
  };

  return (
    <div className="space-y-6 md:space-y-10 animate-fadeIn pb-24 text-white">
      <div className="space-y-2">
        <h2 className="text-3xl md:text-4xl font-bold text-white font-display tracking-tight">
          Jurisdiction & Structure
        </h2>
        <p className="text-slate-400 text-base md:text-lg max-w-2xl">
          Configure the legal wrapper for your {property.category} assets.
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">1. Select Country</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
            {JURISDICTION_METADATA.map(meta => (
                <CountrySelectionCard 
                    key={meta.code}
                    meta={meta}
                    isActive={jurisdiction.country === meta.code}
                    onClick={() => updateData('jurisdiction', { country: meta.code, spvType: '' })}
                />
            ))}
        </div>
      </div>

      {jurisdiction.country && (
          <div className="animate-slideUp space-y-4">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                  2. Select Domicile / State
              </h3>
              <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm">
                  <div className="flex flex-wrap gap-3 mb-4">
                      {(recommendedRegions || []).map(region => (
                          <button
                            key={region}
                            onClick={() => updateData('jurisdiction', { entityDetails: { ...entityDetails, registrationState: region }})}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
                                entityDetails.registrationState === region 
                                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500 ring-2 ring-emerald-500/20' 
                                : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-emerald-500/50 hover:text-emerald-300'
                            }`}
                          >
                            {region}
                          </button>
                      ))}
                  </div>
              </div>
          </div>
      )}

      {jurisdiction.country && (
        <div className="animate-slideUp space-y-4">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">3. Select Structure</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {(ENTITY_LIBRARY[jurisdiction.country] || []).map(ent => (
              <div 
                key={ent.id}
                onClick={() => updateData('jurisdiction', { spvType: ent.id })}
                className={`
                    cursor-pointer p-4 md:p-6 rounded-2xl relative transition-all duration-300 group
                    ${jurisdiction.spvType === ent.id 
                        ? 'bg-slate-800 ring-2 ring-emerald-500 shadow-xl shadow-emerald-500/10 transform scale-[1.02] z-10' 
                        : 'bg-slate-900 border border-slate-800 hover:border-emerald-500/50 hover:shadow-lg'
                    }
                `}
              >
                <h4 className="text-lg md:text-xl font-bold text-white mb-2 font-display">{ent.name}</h4>
                <p className="text-sm text-slate-400">{ent.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 mb-4">4. Entity Details</h3>
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input 
                    id="entName"
                    label="Entity Name"
                    value={entityDetails.companyName}
                    onChange={e => updateData('jurisdiction', { entityDetails: { ...entityDetails, companyName: e.target.value }})}
                    className="bg-slate-800 border-slate-700 text-white"
                />
                <Input 
                    id="regAgent"
                    label="Registered Agent"
                    value={entityDetails.formationAgent || ''}
                    onChange={e => updateData('jurisdiction', { entityDetails: { ...entityDetails, formationAgent: e.target.value }})}
                    className="bg-slate-800 border-slate-700 text-white"
                />
                <div className="md:col-span-2">
                    <label className="text-xs uppercase tracking-wider font-bold text-slate-500 ml-1 mb-2 block">Directors</label>
                     <div className="bg-slate-800 rounded-lg p-2 border border-slate-700 flex flex-wrap gap-2 min-h-[50px]">
                        {(entityDetails.directors || []).map((d, i) => (
                            <span key={i} className="bg-slate-700 text-white px-3 py-1.5 rounded-md text-sm flex items-center gap-2 border border-slate-600">
                                {d}
                                <button onClick={() => {
                                    const n = [...(entityDetails.directors || [])]; n.splice(i, 1);
                                    updateData('jurisdiction', { entityDetails: { ...entityDetails, directors: n }});
                                }} className="text-slate-400 hover:text-red-400">×</button>
                            </span>
                        ))}
                        <input 
                            type="text"
                            placeholder="Add Name + Enter"
                            className="bg-transparent text-white placeholder-slate-500 outline-none flex-1 min-w-[150px] px-2 h-8"
                            onKeyDown={e => {
                                if (e.key === 'Enter') {
                                    const val = (e.target as HTMLInputElement).value;
                                    if(val) {
                                        updateData('jurisdiction', { entityDetails: { ...entityDetails, directors: [...(entityDetails.directors || []), val] }});
                                        (e.target as HTMLInputElement).value = '';
                                    }
                                }
                            }}
                        />
                    </div>
                </div>
          </div>
      </div>

      <AiSuggestionBox 
        isLoading={isAiLoading}
        onAsk={handleRunAnalysis}
        content={aiContent}
        contextNote={aiContent ? "Review guidance above." : "Ask AI to validate structure."}
      />
    </div>
  );
};