
import React, { useState, useEffect } from 'react';
import { Button } from '../../../../ui/Button';
import { Select } from '../../../../ui/Select';
import { Input } from '../../../../ui/Input';
import { 
    generateRiskMatrixAnalysis, 
    generateRiskMitigationPlan, 
    generateRiskInputEducation, 
    generateRiskOutputEducation 
} from '../../../../../services/mockAiService';

interface Props {
  data: any;
  framework: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
}

const LOCAL_STORAGE_KEY = 'academyPro_compliance';

export const RiskMatrix: React.FC<Props> = ({ data, framework, onUpdate, onNext }) => {
  // 1. STATE & INPUTS
  const [inputs, setInputs] = useState({
      // Toggles
      allowRetailInvestors: false,
      disableGeoBlocking: false,
      planSecondaryMarket: true,
      usingProspectusExemption: false,
      noRegulatedCustodian: false,
      noKYCprovider: false,
      noBrokerDealer: false,
      noTransferRestrictions: false,
      allowNonUSInvestors: true,
      allowLargeScaleMarketing: false,
      // Selectors / Inputs
      custodyModel: 'Regulated',
      AMLprovider: 'SumSub',
      secondaryMarketJurisdiction: 'Global',
      stablecoinUsage: 'USDC',
      expectedDailyTradingVolume: 10000,
      expectedInvestorJurisdictions: 'US, EU'
  });

  const [aiOutput, setAiOutput] = useState<any>(null);
  const [mitigation, setMitigation] = useState<any>(null);
  const [inputEducation, setInputEducation] = useState<any>(null);
  const [outputEducation, setOutputEducation] = useState<any>(null);

  const [isScanning, setIsScanning] = useState(false);
  const [isMitigating, setIsMitigating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load from Storage
  useEffect(() => {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
          try {
              const parsed = JSON.parse(saved);
              if (parsed.riskMatrix) {
                  if (parsed.riskMatrix.inputs) setInputs(prev => ({ ...prev, ...parsed.riskMatrix.inputs }));
                  if (parsed.riskMatrix.aiOutput) setAiOutput(parsed.riskMatrix.aiOutput);
                  if (parsed.riskMatrix.mitigation) setMitigation(parsed.riskMatrix.mitigation);
                  if (parsed.riskMatrix.inputEducation) setInputEducation(parsed.riskMatrix.inputEducation);
                  if (parsed.riskMatrix.outputEducation) setOutputEducation(parsed.riskMatrix.outputEducation);
              }
          } catch (e) {
              console.error("Failed to load Risk Matrix data", e);
          }
      }
  }, []);

  const toggle = (key: string) => {
      setInputs((prev: any) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleChange = (field: string, val: any) => {
      setInputs((prev: any) => ({ ...prev, [field]: val }));
  };

  // 2. AI ACTIONS
  const handleAnalyze = async () => {
      setIsScanning(true);
      const [analysis, inEdu] = await Promise.all([
          generateRiskMatrixAnalysis(inputs),
          generateRiskInputEducation(inputs)
      ]);
      const outEdu = await generateRiskOutputEducation(analysis.totalRiskScore, analysis.riskBreakdown);

      setAiOutput(analysis);
      setInputEducation(inEdu);
      setOutputEducation(outEdu);
      setMitigation(null); // Reset mitigation if inputs change
      setIsScanning(false);
      
      saveToStorage(analysis, inEdu, outEdu, null);
  };

  const handleMitigate = async () => {
      if (!aiOutput) return;
      setIsMitigating(true);
      const plan = await generateRiskMitigationPlan(inputs, aiOutput);
      setMitigation(plan);
      setIsMitigating(false);
      
      saveToStorage(aiOutput, inputEducation, outputEducation, plan);
  };

  const saveToStorage = (analysis = aiOutput, inEdu = inputEducation, outEdu = outputEducation, plan = mitigation) => {
      const existing = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '{}');
      const updated = {
          ...existing,
          riskMatrix: {
              inputs,
              aiOutput: analysis,
              mitigation: plan,
              inputEducation: inEdu,
              outputEducation: outEdu
          }
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      onUpdate(updated.riskMatrix);
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

  const getScoreColor = (score: number) => {
      if (score >= 80) return 'text-emerald-500';
      if (score >= 50) return 'text-amber-500';
      return 'text-red-500';
  };

  return (
    <div className="space-y-8 animate-fadeIn">
        
        {/* Header */}
        <div className="flex justify-between items-center">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-red-500 flex items-center justify-center text-white text-xs">3</span>
                Compliance Risk Matrix
            </h4>
            <div className="px-3 py-1 bg-red-500/10 border border-red-500/30 rounded-full text-[10px] text-red-400 font-bold uppercase tracking-wider">
                Risk Engine Active
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* LEFT: INPUTS & TOGGLES */}
            <div className="bg-white p-6 rounded-xl border border-sim-border shadow-sm space-y-6">
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <span className="text-xl">⚠️</span> Risk Configuration
                </h4>

                {/* Risk Toggles */}
                <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-500 uppercase block">Critical Switches</label>
                    {[
                        { k: 'allowRetailInvestors', l: 'Allow Retail Investors', risk: 'High' },
                        { k: 'disableGeoBlocking', l: 'Disable Geo-Blocking', risk: 'High' },
                        { k: 'noRegulatedCustodian', l: 'No Regulated Custodian', risk: 'High' },
                        { k: 'noKYCprovider', l: 'No KYC Provider', risk: 'Critical' },
                        { k: 'planSecondaryMarket', l: 'Plan Secondary Market', risk: 'Med' },
                        { k: 'allowLargeScaleMarketing', l: 'Large Scale Marketing', risk: 'Med' }
                    ].map(opt => (
                        <div 
                            key={opt.k} 
                            onClick={() => toggle(opt.k)}
                            className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                                inputs[opt.k as keyof typeof inputs] 
                                    ? 'bg-red-50 border-red-200 shadow-inner' 
                                    : 'bg-white border-slate-200 hover:border-slate-300'
                            }`}
                        >
                            <span className={`text-sm font-medium ${inputs[opt.k as keyof typeof inputs] ? 'text-red-700' : 'text-slate-600'}`}>{opt.l}</span>
                            <div className={`w-10 h-5 rounded-full relative transition-colors ${inputs[opt.k as keyof typeof inputs] ? 'bg-red-500' : 'bg-slate-300'}`}>
                                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${inputs[opt.k as keyof typeof inputs] ? 'left-6' : 'left-1'}`}></div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Additional Inputs */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                    <Select 
                        id="custody" label="Custody Model"
                        value={inputs.custodyModel}
                        onChange={e => handleChange('custodyModel', e.target.value)}
                        options={[
                            { value: 'Regulated', label: 'Regulated Custodian' },
                            { value: 'Unregulated', label: 'Self-Custody / DAO' }
                        ]}
                    />
                    <Input 
                        id="aml" label="AML Provider"
                        value={inputs.AMLprovider}
                        onChange={e => handleChange('AMLprovider', e.target.value)}
                    />
                    <Select 
                        id="stablecoin" label="Stablecoin"
                        value={inputs.stablecoinUsage}
                        onChange={e => handleChange('stablecoinUsage', e.target.value)}
                        options={[
                            { value: 'USDC', label: 'USDC (Regulated)' },
                            { value: 'USDT', label: 'USDT' },
                            { value: 'Algo', label: 'Algorithmic' },
                            { value: 'None', label: 'None' }
                        ]}
                    />
                    <Input 
                        id="vol" label="Daily Vol ($)" type="number"
                        value={inputs.expectedDailyTradingVolume}
                        onChange={e => handleChange('expectedDailyTradingVolume', parseInt(e.target.value))}
                    />
                </div>

                {inputEducation && (
                    <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-2">
                        <h5 className="font-bold text-slate-700 uppercase flex items-center gap-2">
                             <span className="text-lg">🎓</span> Educational Note
                        </h5>
                        <p className="text-slate-600"><strong>Retail Risk:</strong> {inputEducation.retailRiskExplained}</p>
                        <p className="text-slate-600"><strong>Custody:</strong> {inputEducation.custodyImpact}</p>
                        <p className="text-slate-600"><strong>Geo-Blocking:</strong> {inputEducation.geoBlockingLogic}</p>
                    </div>
                )}
            </div>

            {/* RIGHT: RISK SCORE & ANALYSIS */}
            <div className="flex flex-col gap-6">
                
                {/* Score Card */}
                <div className="bg-slate-900 p-8 rounded-xl border border-slate-800 text-white relative overflow-hidden flex flex-col items-center justify-center text-center">
                    <div className="absolute top-0 right-0 p-6 opacity-10 text-9xl">🛡️</div>
                    
                    {!aiOutput ? (
                         <div className="opacity-60">
                             <span className="text-5xl mb-4 block">⚖️</span>
                             <p className="text-sm">Configure risks and run analysis.</p>
                         </div>
                    ) : (
                        <div className="relative z-10 w-full animate-slideUp">
                            <div className={`text-6xl font-bold mb-2 ${getScoreColor(aiOutput.totalRiskScore)}`}>
                                {aiOutput.totalRiskScore}
                            </div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">Compliance Safety Score</p>
                            
                            <div className="text-left bg-slate-800/50 p-4 rounded-xl border border-slate-700 mb-6">
                                <p className="text-sm text-slate-300 italic">"{aiOutput.explanation}"</p>
                            </div>

                            {/* Risk Tags */}
                            <div className="flex flex-wrap justify-center gap-2">
                                {aiOutput.triggeredRisks?.map((risk: string, i: number) => (
                                    <span key={i} className="px-3 py-1 bg-red-900/40 text-red-300 border border-red-500/30 rounded text-[10px] font-bold uppercase">
                                        {risk}
                                    </span>
                                ))}
                            </div>
                            
                            {/* Breakdown */}
                            <div className="mt-6 grid grid-cols-2 gap-4 text-left">
                                {Object.entries(aiOutput.riskBreakdown || {}).map(([key, val]: [string, any], i) => (
                                    val.length > 0 && (
                                        <div key={i} className="text-xs text-slate-400">
                                            <span className="text-slate-500 uppercase font-bold">{key}</span>: {val[0]}
                                        </div>
                                    )
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex gap-4">
                     <Button 
                        onClick={handleAnalyze} 
                        isLoading={isScanning} 
                        className="flex-1 bg-sim-ai hover:bg-purple-600 text-white shadow-lg shadow-purple-500/20"
                    >
                        {isScanning ? 'Calculating Risk...' : '🔍 Analyze Risks'}
                    </Button>
                    <Button 
                        onClick={handleMitigate}
                        disabled={!aiOutput}
                        isLoading={isMitigating}
                        variant="secondary"
                        className="flex-1 bg-slate-800 border-slate-700 text-slate-300 hover:text-white"
                    >
                        Get Mitigation Plan
                    </Button>
                </div>

                {/* Mitigation Plan */}
                {mitigation && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 animate-slideUp">
                        <h5 className="text-xs font-bold text-emerald-800 uppercase mb-4 flex items-center gap-2">
                            <span>🛡️</span> Mitigation Strategy
                        </h5>
                        
                        <div className="space-y-4">
                            <div>
                                <span className="text-[10px] font-bold text-red-500 uppercase bg-red-100 px-2 py-0.5 rounded">Urgent Fixes</span>
                                <ul className="mt-2 space-y-1">
                                    {mitigation.urgentFixes.map((fix: string, i: number) => (
                                        <li key={i} className="text-xs text-slate-700 flex gap-2">
                                            <span className="text-red-500">•</span> {fix}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            
                            <div>
                                <span className="text-[10px] font-bold text-emerald-600 uppercase bg-emerald-100 px-2 py-0.5 rounded">Best Practices</span>
                                <ul className="mt-2 space-y-1">
                                    {mitigation.bestPractices.map((bp: string, i: number) => (
                                        <li key={i} className="text-xs text-slate-700 flex gap-2">
                                            <span className="text-emerald-500">✓</span> {bp}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <span className="text-[10px] font-bold text-blue-600 uppercase bg-blue-100 px-2 py-0.5 rounded">Recommended Providers</span>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {mitigation.providerRecommendations.map((prov: string, i: number) => (
                                        <span key={i} className="text-[10px] text-slate-600 bg-white border border-slate-200 px-2 py-1 rounded">
                                            {prov}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {outputEducation && (
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-600">
                        <strong>Auditor View:</strong> {outputEducation.auditorPerspective}
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
                Save & Next: Templates →
            </Button>
        </div>

    </div>
  );
};
