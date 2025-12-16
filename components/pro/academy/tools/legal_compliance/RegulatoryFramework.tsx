
import React, { useState, useEffect } from 'react';
import { Button } from '../../../../ui/Button';
import { Select } from '../../../../ui/Select';
import { Input } from '../../../../ui/Input';
import { 
    generateComplianceFrameworkAnalysis, 
    generateFrameworkInputEducation, 
    generateFrameworkOutputEducation 
} from '../../../../../services/mockAiService';

interface Props {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
}

const LOCAL_STORAGE_KEY = 'academyPro_compliance';

export const RegulatoryFramework: React.FC<Props> = ({ data, onUpdate, onNext }) => {
  // 1. INPUTS
  const [inputs, setInputs] = useState({
      jurisdiction: 'USA',
      assetClass: 'Real Estate',
      investorType: 'Accredited Only',
      marketingModel: 'Public Solicitation',
      // New Inputs
      assetValue: 0,
      totalInvestorsPlanned: 0,
      investorJurisdictions: [] as string[],
      fundraisingMethod: 'Equity',
      transferabilityPreference: 'Locked',
      distributionModel: 'Manual',
      custodyModel: 'Regulated Custodian'
  });

  // 2. AI OUTPUTS
  const [aiOutput, setAiOutput] = useState<any>(null);
  const [inputEducation, setInputEducation] = useState<any>(null);
  const [outputEducation, setOutputEducation] = useState<any>(null);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load from Storage
  useEffect(() => {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
          try {
              const parsed = JSON.parse(saved);
              if (parsed.framework) {
                  if (parsed.framework.inputs) setInputs(prev => ({ ...prev, ...parsed.framework.inputs }));
                  if (parsed.framework.aiOutput) setAiOutput(parsed.framework.aiOutput);
                  if (parsed.framework.inputEducation) setInputEducation(parsed.framework.inputEducation);
                  if (parsed.framework.outputEducation) setOutputEducation(parsed.framework.outputEducation);
              }
          } catch (e) {
              console.error("Failed to load Compliance Framework data", e);
          }
      }
  }, []);

  const handleChange = (field: string, value: any) => {
      setInputs(prev => ({ ...prev, [field]: value }));
  };

  const toggleJurisdiction = (region: string) => {
      const current = inputs.investorJurisdictions;
      if (current.includes(region)) {
          handleChange('investorJurisdictions', current.filter(r => r !== region));
      } else {
          handleChange('investorJurisdictions', [...current, region]);
      }
  };

  const handleAnalyze = async () => {
      setIsAnalyzing(true);
      
      // Parallel execution
      const [analysis, inEdu] = await Promise.all([
          generateComplianceFrameworkAnalysis(inputs),
          generateFrameworkInputEducation(inputs)
      ]);
      
      const outEdu = await generateFrameworkOutputEducation(inputs, analysis);
      
      setAiOutput(analysis);
      setInputEducation(inEdu);
      setOutputEducation(outEdu);
      setIsAnalyzing(false);
      
      saveToStorage(analysis, inEdu, outEdu);
  };

  const saveToStorage = (analysis = aiOutput, inEdu = inputEducation, outEdu = outputEducation) => {
      const existing = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '{}');
      const updated = {
          ...existing,
          framework: {
              inputs,
              aiOutput: analysis,
              inputEducation: inEdu,
              outputEducation: outEdu
          }
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      onUpdate(updated.framework);
  };

  const handleSave = () => {
      setIsSaving(true);
      saveToStorage();
      setTimeout(() => setIsSaving(false), 500);
  };

  const handleSaveNext = () => {
      handleSave();
      onNext();
  };

  return (
    <div className="space-y-8 animate-fadeIn">
        
        {/* Header */}
        <div className="flex justify-between items-center">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-indigo-500 flex items-center justify-center text-slate-900 text-xs">1</span>
                Compliance Framework
            </h4>
            <div className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/30 rounded-full text-[10px] text-indigo-400 font-bold uppercase tracking-wider">
                Regulatory Engine
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* LEFT: INPUTS */}
            <div className="bg-white p-6 rounded-xl border border-sim-border shadow-sm space-y-6">
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <span className="text-xl">⚙️</span> Configuration
                </h4>

                <div className="grid grid-cols-2 gap-4">
                    <Select 
                        id="jurisdiction" label="Primary Jurisdiction"
                        value={inputs.jurisdiction}
                        onChange={(e) => handleChange('jurisdiction', e.target.value)}
                        options={[
                            { value: 'USA', label: 'USA' },
                            { value: 'EU', label: 'European Union' },
                            { value: 'UK', label: 'United Kingdom' },
                            { value: 'UAE', label: 'UAE / Dubai' },
                            { value: 'Global', label: 'Global / Offshore' }
                        ]}
                    />
                    <Select 
                        id="assetClass" label="Asset Class"
                        value={inputs.assetClass}
                        onChange={(e) => handleChange('assetClass', e.target.value)}
                        options={[
                            { value: 'Real Estate', label: 'Real Estate' },
                            { value: 'Company Equity', label: 'Company Equity' },
                            { value: 'Debt Instrument', label: 'Debt Instrument' },
                            { value: 'Fund Interest', label: 'Fund Interest' },
                            { value: 'Utility / Access', label: 'Utility / Access' }
                        ]}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Input 
                        id="assetValue" label="Asset Value ($)" type="number"
                        value={inputs.assetValue || ''}
                        onChange={(e) => handleChange('assetValue', parseFloat(e.target.value))}
                        placeholder="1000000"
                    />
                    <Input 
                        id="totalInvestors" label="Max Investors" type="number"
                        value={inputs.totalInvestorsPlanned || ''}
                        onChange={(e) => handleChange('totalInvestorsPlanned', parseFloat(e.target.value))}
                        placeholder="50"
                    />
                </div>

                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Target Investor Regions</label>
                    <div className="flex flex-wrap gap-2">
                        {['US', 'EU', 'UK', 'Asia', 'LatAm'].map(r => (
                            <button
                                key={r}
                                onClick={() => toggleJurisdiction(r)}
                                className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${
                                    inputs.investorJurisdictions.includes(r) 
                                        ? 'bg-indigo-600 text-white border-indigo-600' 
                                        : 'bg-slate-50 text-slate-500 border-slate-200'
                                }`}
                            >
                                {r}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Select 
                        id="investorType" label="Target Investors"
                        value={inputs.investorType}
                        onChange={(e) => handleChange('investorType', e.target.value)}
                        options={[
                            { value: 'Accredited Only', label: 'Accredited Only (HNWI)' },
                            { value: 'Institutional Only', label: 'Institutional Only' },
                            { value: 'Includes Retail', label: 'Includes Retail (Crowd)' },
                            { value: 'Family & Friends', label: 'Family & Friends' }
                        ]}
                    />
                    <Select 
                        id="marketingModel" label="Marketing Strategy"
                        value={inputs.marketingModel}
                        onChange={(e) => handleChange('marketingModel', e.target.value)}
                        options={[
                            { value: 'Private Placement', label: 'Private Placement (No Ads)' },
                            { value: 'Public Solicitation', label: 'Public Solicitation (Ads)' },
                            { value: 'Reverse Solicitation', label: 'Reverse Solicitation' }
                        ]}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Select 
                        id="fundraisingMethod" label="Instrument"
                        value={inputs.fundraisingMethod}
                        onChange={(e) => handleChange('fundraisingMethod', e.target.value)}
                        options={[
                            { value: 'Equity', label: 'Equity' },
                            { value: 'Debt', label: 'Debt' },
                            { value: 'Revenue Share', label: 'Revenue Share' },
                            { value: 'Hybrid', label: 'Hybrid' }
                        ]}
                    />
                    <Select 
                        id="transferability" label="Transferability"
                        value={inputs.transferabilityPreference}
                        onChange={(e) => handleChange('transferabilityPreference', e.target.value)}
                        options={[
                            { value: 'Locked', label: 'Locked (No Secondary)' },
                            { value: 'Limited', label: 'Limited (Whitelist)' },
                            { value: 'Freely Transferable', label: 'Freely Transferable' }
                        ]}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Select 
                        id="distModel" label="Distribution"
                        value={inputs.distributionModel}
                        onChange={(e) => handleChange('distributionModel', e.target.value)}
                        options={[
                            { value: 'Manual', label: 'Manual (Bank)' },
                            { value: 'Automated', label: 'Automated (Platform)' },
                            { value: 'On-chain', label: 'On-chain (Smart Contract)' }
                        ]}
                    />
                    <Select 
                        id="custodyModel" label="Custody"
                        value={inputs.custodyModel}
                        onChange={(e) => handleChange('custodyModel', e.target.value)}
                        options={[
                            { value: 'Regulated Custodian', label: 'Regulated Custodian' },
                            { value: 'Self-Custody', label: 'Self-Custody' },
                            { value: 'Platform-Custody', label: 'Platform Wallet' }
                        ]}
                    />
                </div>

                {inputEducation && (
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 text-xs space-y-2 mt-4">
                        <h5 className="font-bold text-slate-700 uppercase flex items-center gap-2">
                             <span className="text-lg">🎓</span> Professor's Input Note
                        </h5>
                        <p className="text-slate-600"><strong>Asset Implication:</strong> {inputEducation.assetImplication}</p>
                        <p className="text-slate-600"><strong>Marketing Implication:</strong> {inputEducation.marketingImplication}</p>
                        <p className="text-slate-600"><strong>Custody Note:</strong> {inputEducation.custodyImplication}</p>
                        <p className="text-amber-600 bg-amber-50 p-2 rounded border border-amber-100">
                            <strong>Warning:</strong> {inputEducation.investorMisunderstanding}
                        </p>
                    </div>
                )}
            </div>

            {/* RIGHT: ANALYSIS & OUTPUT */}
            <div className="flex flex-col gap-6">
                
                {/* Visualizer Card */}
                <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
                    
                    <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Strategic Verdict</h5>
                    
                    <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                        <div>
                            <span className="text-[10px] text-slate-500 block uppercase">Security Status</span>
                            <span className={`text-sm font-bold ${aiOutput?.securityStatus?.includes('Security') ? 'text-amber-400' : 'text-emerald-400'}`}>
                                {aiOutput?.securityStatus || 'Pending...'}
                            </span>
                        </div>
                        <div>
                            <span className="text-[10px] text-slate-500 block uppercase">Prospectus</span>
                            <span className={`text-sm font-bold ${aiOutput?.prospectusRequirement?.includes('Required') ? 'text-red-400' : 'text-blue-400'}`}>
                                {aiOutput?.prospectusRequirement || 'Pending...'}
                            </span>
                        </div>
                        <div className="col-span-2">
                            <span className="text-[10px] text-slate-500 block uppercase">Recommended Regime</span>
                            <span className="text-xl font-mono text-white bg-slate-800 px-3 py-1 rounded border border-slate-700 inline-block mt-1">
                                {aiOutput?.recommendedRegime || 'Waiting for Analysis'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="text-center">
                    <Button onClick={handleAnalyze} isLoading={isAnalyzing} className="w-full bg-sim-ai hover:bg-purple-600 text-white shadow-lg shadow-purple-500/20">
                        {isAnalyzing ? 'Consulting Professor...' : '⚖️ Verify with Professor'}
                    </Button>
                </div>

                {/* AI Output Education */}
                {aiOutput && (
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 animate-slideUp space-y-4">
                        
                        {/* Rationale */}
                        <div>
                            <h5 className="text-xs font-bold text-indigo-700 uppercase mb-2">Justification</h5>
                            <ul className="space-y-1">
                                {aiOutput.justification?.map((r: string, i: number) => (
                                    <li key={i} className="text-xs text-slate-600 flex gap-2">
                                        <span className="text-indigo-500">•</span> {r}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Rules Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-white p-3 rounded border border-slate-200">
                                <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Investor Rules</span>
                                <ul className="list-disc list-inside text-xs text-slate-600">
                                    {aiOutput.investorEligibilityRules?.map((r: string, i: number) => <li key={i}>{r}</li>)}
                                </ul>
                            </div>
                            <div className="bg-white p-3 rounded border border-slate-200">
                                <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Marketing</span>
                                <ul className="list-disc list-inside text-xs text-slate-600">
                                    {aiOutput.marketingRestrictions?.map((r: string, i: number) => <li key={i}>{r}</li>)}
                                </ul>
                            </div>
                        </div>

                        {/* Restrictions */}
                        <div className="text-xs text-red-500 bg-red-50 p-3 rounded border border-red-100">
                             <strong>Limitations:</strong> {aiOutput.limitations?.join(' • ')}
                        </div>
                        
                        {/* Cross Border */}
                        <div className="text-xs text-blue-600 bg-blue-50 p-3 rounded border border-blue-100">
                             <strong>Cross-Border:</strong> {aiOutput.crossBorderImpact?.join(' ')}
                        </div>

                        {/* Output Education */}
                         {outputEducation && (
                            <div className="text-xs text-slate-600 bg-white p-3 rounded border border-slate-200 mt-2">
                                <strong>Practical Reality:</strong> {outputEducation.practicalObligations?.join(' ')}
                            </div>
                         )}
                    </div>
                )}
            </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-4 pt-4 border-t border-slate-200/50">
            <Button onClick={handleSave} disabled={isSaving} variant="secondary" className="border-slate-300 text-slate-500">
                {isSaving ? 'Saving...' : 'Save Progress'}
            </Button>
            <Button onClick={handleSaveNext} className="bg-sim-cta hover:bg-sim-cta-hover text-white shadow-lg">
                Save & Next: Investor Rules →
            </Button>
        </div>

    </div>
  );
};
