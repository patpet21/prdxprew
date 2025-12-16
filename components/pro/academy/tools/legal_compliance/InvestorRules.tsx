
import React, { useState, useEffect } from 'react';
import { Button } from '../../../../ui/Button';
import { Input } from '../../../../ui/Input';
import { Select } from '../../../../ui/Select';
import { 
    generateInvestorRulesValidation, 
    generateInvestorRulesInputEducation, 
    generateInvestorRulesOutputEducation 
} from '../../../../../services/mockAiService';

interface Props {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
}

const LOCAL_STORAGE_KEY = 'academyPro_compliance';

export const InvestorRules: React.FC<Props> = ({ data, onUpdate, onNext }) => {
  // 1. INPUTS (Expanded)
  const [inputs, setInputs] = useState({
      regulatoryRegime: 'Reg D 506(c)',
      totalInvestors: 50,
      retailCount: 0,
      accreditedCount: 45,
      institutionalCount: 5,
      includesUSInvestors: true,
      maxInvestmentPerInvestor: 0,
      minInvestmentTicket: 5000,
      secondaryTradingPlanned: true,
      investorJurisdictions: ['US', 'EU'],
      marketingReach: 'Global'
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
              if (parsed.investorRules) {
                  if (parsed.investorRules.inputs) setInputs(prev => ({ ...prev, ...parsed.investorRules.inputs }));
                  if (parsed.investorRules.aiOutput) setAiOutput(parsed.investorRules.aiOutput);
                  if (parsed.investorRules.inputEducation) setInputEducation(parsed.investorRules.inputEducation);
                  if (parsed.investorRules.outputEducation) setOutputEducation(parsed.investorRules.outputEducation);
              }
          } catch (e) {
              console.error("Failed to load Investor Rules data", e);
          }
      }
  }, []);

  const handleChange = (field: string, value: any) => {
      setInputs(prev => ({ ...prev, [field]: value }));
  };

  const handleJurisdictionToggle = (jur: string) => {
      const current = inputs.investorJurisdictions || [];
      if (current.includes(jur)) {
          handleChange('investorJurisdictions', current.filter(j => j !== jur));
      } else {
          handleChange('investorJurisdictions', [...current, jur]);
      }
  };

  const handleAnalyze = async () => {
      setIsAnalyzing(true);
      
      const [validation, inEdu] = await Promise.all([
          generateInvestorRulesValidation(inputs),
          generateInvestorRulesInputEducation(inputs)
      ]);
      
      setAiOutput(validation);
      setInputEducation(inEdu);
      setIsAnalyzing(false);
      
      // Save results
      saveToStorage(validation, inEdu, null);
  };

  const handleExplainResult = async () => {
      if (!aiOutput) return;
      setIsAnalyzing(true);
      const outEdu = await generateInvestorRulesOutputEducation(inputs, aiOutput);
      setOutputEducation(outEdu);
      setIsAnalyzing(false);
      
      saveToStorage(aiOutput, inputEducation, outEdu);
  };

  const saveToStorage = (validation = aiOutput, inEdu = inputEducation, outEdu = outputEducation) => {
      const existing = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '{}');
      const updated = {
          ...existing,
          investorRules: {
              inputs,
              aiOutput: validation,
              inputEducation: inEdu,
              outputEducation: outEdu
          }
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      onUpdate(updated.investorRules);
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

  const getStatusColor = (status: string) => {
      switch(status) {
          case 'PASS': return 'text-emerald-400 bg-emerald-900/20 border-emerald-500/50';
          case 'WARNING': return 'text-amber-400 bg-amber-900/20 border-amber-500/50';
          case 'FAIL': return 'text-red-400 bg-red-900/20 border-red-500/50';
          default: return 'text-slate-400 bg-slate-800 border-slate-700';
      }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
        
        {/* Header */}
        <div className="flex justify-between items-center">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-emerald-500 flex items-center justify-center text-slate-900 text-xs">2</span>
                Investor Compliance Rules
            </h4>
            <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                Validation Engine
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* LEFT: INPUTS */}
            <div className="bg-white p-6 rounded-xl border border-sim-border shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                        <span className="text-xl">⚙️</span> Parameters
                    </h4>
                    {inputEducation && (
                        <span className="text-[10px] text-indigo-600 bg-indigo-50 px-2 py-1 rounded border border-indigo-100 font-bold">
                             AI Context Loaded
                        </span>
                    )}
                </div>

                <div className="space-y-4">
                    <Select 
                        label="Regulatory Regime" id="regime"
                        value={inputs.regulatoryRegime}
                        onChange={e => handleChange('regulatoryRegime', e.target.value)}
                        options={[
                            { value: 'Reg D 506(b)', label: 'Reg D 506(b) (Private, No Ads)' },
                            { value: 'Reg D 506(c)', label: 'Reg D 506(c) (Public, Accredited)' },
                            { value: 'Reg S', label: 'Reg S (Offshore Only)' },
                            { value: 'Reg A+', label: 'Reg A+ (Mini-IPO)' },
                            { value: 'MiCA', label: 'EU MiCA / Prospectus' },
                            { value: 'Crowdfunding', label: 'Reg CF / ECSP' }
                        ]}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <Input 
                            label="Total Investors" id="totalInv" type="number"
                            value={inputs.totalInvestors}
                            onChange={e => handleChange('totalInvestors', parseInt(e.target.value))}
                        />
                        <Input 
                            label="Retail Count" id="retail" type="number"
                            value={inputs.retailCount}
                            onChange={e => handleChange('retailCount', parseInt(e.target.value))}
                        />
                        <Input 
                            label="Accredited Count" id="accredited" type="number"
                            value={inputs.accreditedCount}
                            onChange={e => handleChange('accreditedCount', parseInt(e.target.value))}
                        />
                        <Input 
                            label="Institutional Count" id="institutional" type="number"
                            value={inputs.institutionalCount}
                            onChange={e => handleChange('institutionalCount', parseInt(e.target.value))}
                        />
                    </div>

                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                        <label className="text-xs font-bold text-slate-500 uppercase block mb-3">Investor Jurisdictions</label>
                        <div className="flex flex-wrap gap-2">
                            {['US', 'EU', 'UK', 'Asia', 'LatAm'].map(jur => (
                                <button
                                    key={jur}
                                    onClick={() => handleJurisdictionToggle(jur)}
                                    className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${
                                        (inputs.investorJurisdictions || []).includes(jur) 
                                            ? 'bg-indigo-600 text-white border-indigo-600' 
                                            : 'bg-white text-slate-500 border-slate-300'
                                    }`}
                                >
                                    {jur}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                         <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200 h-full">
                            <input 
                                type="checkbox" id="usBool"
                                checked={inputs.includesUSInvestors}
                                onChange={e => handleChange('includesUSInvestors', e.target.checked)}
                                className="w-5 h-5 accent-indigo-600"
                            />
                            <label htmlFor="usBool" className="text-sm text-slate-700 font-medium cursor-pointer">Include US Investors?</label>
                         </div>
                         <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200 h-full">
                            <input 
                                type="checkbox" id="secondaryBool"
                                checked={inputs.secondaryTradingPlanned}
                                onChange={e => handleChange('secondaryTradingPlanned', e.target.checked)}
                                className="w-5 h-5 accent-indigo-600"
                            />
                            <label htmlFor="secondaryBool" className="text-sm text-slate-700 font-medium cursor-pointer">Secondary Trading?</label>
                         </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Input 
                            label="Min Ticket ($)" id="minTicket" type="number"
                            value={inputs.minInvestmentTicket}
                            onChange={e => handleChange('minInvestmentTicket', parseFloat(e.target.value))}
                        />
                        <Select 
                            label="Marketing Reach" id="marketing"
                            value={inputs.marketingReach}
                            onChange={e => handleChange('marketingReach', e.target.value)}
                            options={[
                                { value: 'Local', label: 'Local Only' },
                                { value: 'Regional', label: 'Regional (e.g. EU)' },
                                { value: 'Global', label: 'Global / Public' }
                            ]}
                        />
                    </div>
                </div>

                {inputEducation && (
                    <div className="mt-4 p-4 bg-indigo-50 border border-indigo-100 rounded-xl text-xs space-y-2">
                        <h5 className="font-bold text-indigo-800 uppercase flex items-center gap-2">
                             <span className="text-lg">🎓</span> Professor's Note
                        </h5>
                        <p className="text-indigo-700 leading-relaxed"><strong>Regime:</strong> {inputEducation.regimeDefinition}</p>
                        <p className="text-indigo-700 leading-relaxed"><strong>US Exposure:</strong> {inputEducation.usExposure}</p>
                         <p className="text-indigo-700 leading-relaxed"><strong>Trading:</strong> {inputEducation.tradingImpact}</p>
                    </div>
                )}
            </div>

            {/* RIGHT: VALIDATION ENGINE */}
            <div className="flex flex-col gap-6">
                
                <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 text-white relative overflow-hidden flex flex-col h-full">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
                    
                    <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Validation Status</h5>

                    {!aiOutput ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center opacity-60">
                            <span className="text-5xl mb-4">🛡️</span>
                            <p className="text-sm">Configure parameters and run validation to check compliance.</p>
                        </div>
                    ) : (
                        <div className="flex-1 space-y-6 animate-slideUp z-10">
                            
                            {/* Main Badge */}
                            <div className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 ${getStatusColor(aiOutput.status)}`}>
                                <div className="text-4xl font-bold mb-2">{aiOutput.status}</div>
                                <div className="text-xs font-bold uppercase tracking-widest opacity-80">Regulatory Check</div>
                            </div>

                            {/* Rule Checks */}
                            <div className="space-y-2">
                                {(aiOutput.ruleChecks || []).map((check: any, i: number) => (
                                    <div key={i} className="flex justify-between items-center p-3 bg-slate-800 rounded-lg border border-slate-700">
                                        <span className="text-sm text-slate-300">{check.rule}</span>
                                        {check.passed 
                                            ? <span className="text-xs font-bold text-emerald-400 bg-emerald-900/30 px-2 py-0.5 rounded">PASS</span>
                                            : <span className="text-xs font-bold text-red-400 bg-red-900/30 px-2 py-0.5 rounded">FAIL</span>
                                        }
                                    </div>
                                ))}
                            </div>

                            {/* Violations */}
                            {(aiOutput.violations || []).length > 0 && (
                                <div className="bg-red-900/20 border border-red-500/30 p-4 rounded-xl">
                                    <h6 className="text-xs font-bold text-red-400 uppercase mb-2">Critical Violations</h6>
                                    <ul className="space-y-1">
                                        {(aiOutput.violations || []).map((v: string, i: number) => (
                                            <li key={i} className="text-xs text-red-200 flex gap-2">
                                                <span>•</span> {v}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Fixes */}
                            {(aiOutput.fixes || []).length > 0 && (
                                <div className="bg-emerald-900/20 border border-emerald-500/30 p-4 rounded-xl">
                                    <h6 className="text-xs font-bold text-emerald-400 uppercase mb-2">Suggested Fixes</h6>
                                    <ul className="space-y-1">
                                        {(aiOutput.fixes || []).map((f: string, i: number) => (
                                            <li key={i} className="text-xs text-emerald-200 flex gap-2">
                                                <span>✓</span> {f}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                        </div>
                    )}
                </div>

                <div className="flex gap-4">
                     <Button 
                        onClick={handleAnalyze} 
                        isLoading={isAnalyzing && !aiOutput} 
                        className="flex-1 bg-sim-ai hover:bg-purple-600 text-white shadow-lg shadow-purple-500/20"
                    >
                        {isAnalyzing && !aiOutput ? 'Checking Rules...' : '🔍 Validate Rules'}
                    </Button>
                    <Button 
                        onClick={handleExplainResult}
                        disabled={!aiOutput}
                        isLoading={isAnalyzing && !!aiOutput}
                        variant="secondary"
                        className="flex-1 bg-slate-800 border-slate-700 text-slate-300 hover:text-white"
                    >
                        Explain Result
                    </Button>
                </div>

                {/* Output Education */}
                {outputEducation && (
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 animate-slideUp">
                        <h5 className="text-xs font-bold text-slate-700 uppercase mb-2 flex items-center gap-2">
                            <span>👨‍🏫</span> Expert Interpretation
                        </h5>
                        <p className="text-sm text-slate-600 leading-relaxed mb-3 italic">
                            "{outputEducation.resultInterpretation}"
                        </p>
                        <div className="text-xs text-slate-500">
                            <strong>Impact:</strong> {outputEducation.compositionImpact}
                        </div>
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
                Save & Next: Risk Matrix →
            </Button>
        </div>

    </div>
  );
};
