
import React, { useEffect, useState } from 'react';
import { StepProps, TokenizationCategory } from '../../../types';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Button } from '../../../components/ui/Button';
import { ASSET_CLASS_LEARNING } from '../../../content/projectVisionContent';
import { improveProjectDescription } from '../../../services/mockAiService';

export const Ent_ProjectInitiationStep: React.FC<StepProps> = ({ data, updateData, onValidationChange }) => {
  const { projectInfo, property } = data;
  const [isImproving, setIsImproving] = useState(false);
  const [suggestion, setSuggestion] = useState<string | null>(null);

  useEffect(() => {
    const isValid = Boolean(
      projectInfo.projectName && 
      projectInfo.projectGoal && 
      projectInfo.description && 
      projectInfo.description.length > 20
    );
    onValidationChange(isValid);
  }, [projectInfo, onValidationChange]);

  const handleChange = (field: string, val: any) => {
    updateData('projectInfo', { [field]: val });
  };

  const handleAssetClassChange = (val: TokenizationCategory) => {
    updateData('projectInfo', { assetClass: val });
    updateData('property', { category: val });
  };

  const handleImproveDescription = async () => {
    if (!projectInfo.description || projectInfo.description.length < 5) return;
    setIsImproving(true);
    setSuggestion(null);
    const improved = await improveProjectDescription(projectInfo, currentAssetClass as TokenizationCategory);
    if (improved) {
      setSuggestion(improved);
    }
    setIsImproving(false);
  };

  const applySuggestion = () => {
    if (suggestion) {
        handleChange('description', suggestion);
        setSuggestion(null);
    }
  };

  const getComplexityScore = (): { score: 'Low' | 'Medium' | 'High'; color: string; bg: string } => {
    const cat = currentAssetClass;
    const amount = projectInfo.targetRaiseAmount || 0;
    
    if (cat === 'Funds' || cat === 'Business') return { score: 'High', color: 'text-rose-600', bg: 'bg-rose-50 border-rose-100' };
    if (amount > 5000000) return { score: 'High', color: 'text-rose-600', bg: 'bg-rose-50 border-rose-100' };
    if (amount > 1000000 || cat === 'Debt') return { score: 'Medium', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-100' };
    
    return { score: 'Low', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-100' };
  };

  const currentAssetClass = projectInfo.assetClass || property.category || 'Real Estate';
  const learningData = ASSET_CLASS_LEARNING[currentAssetClass as keyof typeof ASSET_CLASS_LEARNING] || ASSET_CLASS_LEARNING['Other'];
  const complexity = getComplexityScore();

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="space-y-2 border-b border-slate-800 pb-6">
        <h2 className="text-3xl font-bold font-display text-white">Project Vision</h2>
        <p className="text-slate-400 text-lg leading-relaxed max-w-2xl">
           Define the core DNA of your project.
        </p>
      </div>

      <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
           <div className="flex flex-col md:flex-row gap-6 mb-8">
               <div className="flex-1">
                   <Select 
                     id="assetClass"
                     label="Primary Asset Class"
                     value={currentAssetClass}
                     onChange={(e) => handleAssetClassChange(e.target.value as TokenizationCategory)}
                     options={[
                       { value: 'Real Estate', label: 'Real Estate' },
                       { value: 'Business', label: 'Company Equity / Business' },
                       { value: 'Art', label: 'Art & Collectibles' },
                       { value: 'Debt', label: 'Debt Instruments' },
                       { value: 'Funds', label: 'Investment Funds' },
                       { value: 'Other', label: 'Other / Custom' },
                     ]}
                   />
               </div>
               
               <div className="md:w-1/3">
                  <label className="text-xs uppercase tracking-wider font-bold text-slate-500 ml-1 mb-2 block">Tokenization Complexity</label>
                  <div className={`flex items-center justify-between p-3.5 rounded-xl border ${complexity.score === 'Low' ? 'bg-emerald-500/10 border-emerald-500/30' : complexity.score === 'Medium' ? 'bg-amber-500/10 border-amber-500/30' : 'bg-rose-500/10 border-rose-500/30'}`}>
                      <span className={`font-bold text-sm uppercase ${complexity.score === 'Low' ? 'text-emerald-400' : complexity.score === 'Medium' ? 'text-amber-400' : 'text-rose-400'}`}>Level: {complexity.score}</span>
                      <div className={`w-2 h-2 rounded-full ${complexity.score === 'Low' ? 'bg-emerald-500' : complexity.score === 'Medium' ? 'bg-amber-500' : 'bg-rose-500'} animate-pulse`}></div>
                  </div>
               </div>
           </div>
      </div>

      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <Input 
            id="pname" 
            label="Project Name" 
            placeholder="e.g. Green Valley Resort"
            value={projectInfo.projectName} 
            onChange={e => handleChange('projectName', e.target.value)} 
            className="md:col-span-1"
          />
          
          <Select 
            id="pgoal" 
            label="Primary Goal"
            value={projectInfo.projectGoal}
            onChange={e => handleChange('projectGoal', e.target.value)}
            options={[
              { value: 'Capital Raise', label: 'Raise Capital (Equity/Debt)' },
              { value: 'Liquidity', label: 'Liquidity for Existing Owners' },
              { value: 'Community', label: 'Community Ownership / DAO' },
              { value: 'Exit', label: 'Exit Strategy / Sale' },
              { value: 'DeFi Collateral', label: 'Use as DeFi Collateral' },
            ]}
          />

           <Input 
            id="target" 
            label="Target Raise Amount ($)" 
            type="number"
            placeholder="5000000"
            value={projectInfo.targetRaiseAmount || ''} 
            onChange={e => handleChange('targetRaiseAmount', parseFloat(e.target.value))} 
          />
           <Input 
            id="web" 
            label="Website (Optional)" 
            placeholder="https://..."
            value={projectInfo.website || ''} 
            onChange={e => handleChange('website', e.target.value)} 
          />
        </div>

        <div>
          <div className="flex justify-between items-end mb-3">
              <label className="text-xs uppercase tracking-wider font-bold text-slate-500 ml-1">
                Project Description & Strategy
                <span className="ml-2 text-[10px] font-normal text-slate-600 lowercase">(min 20 chars)</span>
              </label>
              <Button 
                size="sm" 
                variant="ghost"
                onClick={handleImproveDescription}
                isLoading={isImproving}
                disabled={!projectInfo.description || projectInfo.description.length < 10}
                className="text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 border border-indigo-500/30 h-8 text-xs"
              >
                 ✨ Improve with AI
              </Button>
          </div>
          <div className="relative group">
              <textarea 
                className="w-full h-40 p-5 text-white bg-slate-900 border border-slate-700 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all leading-relaxed shadow-sm resize-none"
                placeholder="Describe the asset, the business model, and why investors should care."
                value={projectInfo.description}
                onChange={e => handleChange('description', e.target.value)}
              />
              {isImproving && (
                  <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm rounded-xl flex items-center justify-center z-10 transition-all">
                      <div className="flex items-center gap-3 text-indigo-400 font-bold animate-pulse">
                          <span className="text-2xl">✨</span> 
                          <span>Rewriting for institutional clarity...</span>
                      </div>
                  </div>
              )}
          </div>

          {suggestion && (
            <div className="mt-4 bg-indigo-900/20 border border-indigo-500/30 rounded-xl p-4 animate-fadeIn relative shadow-sm">
                <div className="flex items-start gap-3">
                    <div className="p-2 bg-indigo-500/20 rounded-lg shadow-sm text-indigo-400 shrink-0">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    </div>
                    <div className="flex-1">
                        <h4 className="text-sm font-bold text-indigo-300 mb-1">AI Suggestion</h4>
                        <div className="bg-slate-900/50 p-3 rounded-lg border border-indigo-500/30 text-sm text-slate-300 leading-relaxed mb-4 shadow-sm">
                            {suggestion}
                        </div>
                        <div className="flex gap-3">
                            <Button size="sm" onClick={applySuggestion} className="bg-indigo-600 text-white hover:bg-indigo-500 shadow-md shadow-indigo-900/20">
                                Use This Version
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => setSuggestion(null)} className="text-slate-500 hover:text-white hover:bg-slate-800">
                                Dismiss
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
