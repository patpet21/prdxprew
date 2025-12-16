
import React, { useState, useEffect } from 'react';
import { Button } from '../../../../ui/Button';
import { generateDeepSpvArchitectAnalysis } from '../../../../../services/mockAiService';
import { Input } from '../../../../ui/Input';
import { Select } from '../../../../ui/Select';

type Tab = 'LEGAL' | 'INVESTORS' | 'TOKEN' | 'OPS';

// --- INITIAL STATE ---
const INITIAL_STATE = {
    legalBasics: {
        legalPersonality: 'LLC',
        entityJurisdiction: 'United States',
        assetJurisdiction: 'United States',
        needsHoldingCompany: 'No',
        assetSegregationLevel: 'Medium',
        beneficialOwnerVisibility: 'Medium',
        crossBorderRecognition: 'No'
    },
    investorsGovernance: {
        expectedInvestorCount: 50,
        investorType: 'Accredited',
        investorOrigin: 'Local',
        eligibilityRules: 'KYC + Accreditation',
        governanceModel: 'Manager-managed',
        votingRights: 'Non-voting',
        investorRights: ['Information', 'Dividends']
    },
    tokenMechanics: {
        capitalUse: 'Acquisition',
        tokenRights: 'Economic only',
        redeemability: 'No redemption',
        expectedLiquidityWindows: 'Annual',
        complianceMode: 'Reg D 506(c)',
        targetRaiseAmount: 1000000
    },
    operationsBanking: {
        requiresLocalDirector: 'No',
        requiresCorporateSecretary: 'No',
        bankingPreference: 'Local bank',
        operationsComplexity: 'Low',
        accountingAuditFrequency: 'Annual',
        expectedKYCIntensity: 'Medium'
    },
    analysisResults: null as any
};

export const SpvArchitectTool: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('LEGAL');
  const [state, setState] = useState(INITIAL_STATE);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Load from LocalStorage on mount
  useEffect(() => {
      const saved = localStorage.getItem('academyPro_spvArchitect');
      if (saved) {
          try {
              const parsed = JSON.parse(saved);
              setState(prev => ({ ...prev, ...parsed }));
          } catch (e) {
              console.error("Failed to load SPV Architect state", e);
          }
      }
  }, []);

  // Save to LocalStorage
  const handleSave = () => {
      localStorage.setItem('academyPro_spvArchitect', JSON.stringify(state));
  };

  // Generalized updater
  const updateSection = (section: keyof typeof state, field: string, value: any) => {
      setState(prev => ({
          ...prev,
          [section]: {
              ...prev[section],
              [field]: value
          }
      }));
  };

  const handleNext = () => {
      handleSave();
      if (activeTab === 'LEGAL') setActiveTab('INVESTORS');
      else if (activeTab === 'INVESTORS') setActiveTab('TOKEN');
      else if (activeTab === 'TOKEN') setActiveTab('OPS');
  };

  const handleRunAnalysis = async () => {
      handleSave();
      setIsAnalyzing(true);
      
      const results = await generateDeepSpvArchitectAnalysis(state);
      
      const newState = { ...state, analysisResults: results };
      setState(newState);
      localStorage.setItem('academyPro_spvArchitect', JSON.stringify(newState));
      
      setIsAnalyzing(false);
      // Optionally scroll to results
      setTimeout(() => document.getElementById('spv-analysis-results')?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  return (
    <div className="flex flex-col h-full space-y-6">
        
        {/* Navigation Tabs */}
        <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 shrink-0">
            {[
                { id: 'LEGAL', label: '1. Legal & Entity' },
                { id: 'INVESTORS', label: '2. Investors & Gov' },
                { id: 'TOKEN', label: '3. Token & Capital' },
                { id: 'OPS', label: '4. Ops & Banking' },
            ].map(tab => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as Tab)}
                    className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                        activeTab === tab.id 
                            ? 'bg-sim-blue text-white shadow-md' 
                            : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
                    }`}
                >
                    {tab.label}
                </button>
            ))}
        </div>

        {/* Workspace - Scrollable */}
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-8">
            
            {/* TAB 1: LEGAL BASICS */}
            {activeTab === 'LEGAL' && (
                <div className="space-y-6 animate-fadeIn">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-6">Entity Configuration</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Select 
                                id="legalPersonality" label="Legal Personality"
                                value={state.legalBasics.legalPersonality}
                                onChange={e => updateSection('legalBasics', 'legalPersonality', e.target.value)}
                                options={[
                                    { value: 'LLC', label: 'Limited Liability Company (LLC)' },
                                    { value: 'SRL', label: 'S.r.l. (European LLC)' },
                                    { value: 'Joint-Stock', label: 'Joint-Stock (Corp/SPA)' },
                                    { value: 'Foundation', label: 'Foundation' },
                                    { value: 'Trust', label: 'Trust' },
                                    { value: 'Partnership', label: 'Partnership (LP)' }
                                ]}
                            />
                            <Input 
                                id="entityJurisdiction" label="Entity Jurisdiction"
                                value={state.legalBasics.entityJurisdiction}
                                onChange={e => updateSection('legalBasics', 'entityJurisdiction', e.target.value)}
                                placeholder="e.g. Delaware, USA"
                            />
                            <Input 
                                id="assetJurisdiction" label="Asset Jurisdiction"
                                value={state.legalBasics.assetJurisdiction}
                                onChange={e => updateSection('legalBasics', 'assetJurisdiction', e.target.value)}
                                placeholder="e.g. Milan, Italy"
                            />
                             <Select 
                                id="needsHolding" label="Need Holding Co?"
                                value={state.legalBasics.needsHoldingCompany}
                                onChange={e => updateSection('legalBasics', 'needsHoldingCompany', e.target.value)}
                                options={[{ value: 'Yes', label: 'Yes' }, { value: 'No', label: 'No' }]}
                            />
                             <Select 
                                id="segregation" label="Asset Segregation"
                                value={state.legalBasics.assetSegregationLevel}
                                onChange={e => updateSection('legalBasics', 'assetSegregationLevel', e.target.value)}
                                options={[{ value: 'Low', label: 'Low' }, { value: 'Medium', label: 'Medium' }, { value: 'High', label: 'High (Ring-fenced)' }]}
                            />
                             <Select 
                                id="ubo" label="Beneficial Owner Visibility"
                                value={state.legalBasics.beneficialOwnerVisibility}
                                onChange={e => updateSection('legalBasics', 'beneficialOwnerVisibility', e.target.value)}
                                options={[{ value: 'High', label: 'Public Registry' }, { value: 'Medium', label: 'Regulator Only' }, { value: 'Low', label: 'Private' }]}
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-4">
                        <Button variant="secondary" onClick={handleSave}>Save Draft</Button>
                        <Button onClick={handleNext} className="bg-sim-cta text-white">Save & Next →</Button>
                    </div>
                </div>
            )}

            {/* TAB 2: INVESTORS & GOVERNANCE */}
            {activeTab === 'INVESTORS' && (
                <div className="space-y-6 animate-fadeIn">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-6">Capital & Control</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input 
                                id="investorCount" label="Expected Investors" type="number"
                                value={state.investorsGovernance.expectedInvestorCount}
                                onChange={e => updateSection('investorsGovernance', 'expectedInvestorCount', parseInt(e.target.value))}
                            />
                            <Select 
                                id="investorType" label="Primary Investor Type"
                                value={state.investorsGovernance.investorType}
                                onChange={e => updateSection('investorsGovernance', 'investorType', e.target.value)}
                                options={[
                                    { value: 'Retail', label: 'Retail (Crowd)' },
                                    { value: 'Accredited', label: 'Accredited / HNWI' },
                                    { value: 'Institutional', label: 'Institutional / VC' },
                                    { value: 'Mixed', label: 'Mixed' }
                                ]}
                            />
                            <Select 
                                id="investorOrigin" label="Investor Origin"
                                value={state.investorsGovernance.investorOrigin}
                                onChange={e => updateSection('investorsGovernance', 'investorOrigin', e.target.value)}
                                options={[
                                    { value: 'Local', label: 'Domestic Only' },
                                    { value: 'EU', label: 'EU Passporting' },
                                    { value: 'Global', label: 'Global / Offshore' }
                                ]}
                            />
                            <Select 
                                id="governance" label="Governance Model"
                                value={state.investorsGovernance.governanceModel}
                                onChange={e => updateSection('investorsGovernance', 'governanceModel', e.target.value)}
                                options={[
                                    { value: 'Manager-managed', label: 'Manager-Managed (GP)' },
                                    { value: 'Board', label: 'Board of Directors' },
                                    { value: 'Member-managed', label: 'Member-Managed (DAO)' }
                                ]}
                            />
                            <Select 
                                id="voting" label="Voting Rights"
                                value={state.investorsGovernance.votingRights}
                                onChange={e => updateSection('investorsGovernance', 'votingRights', e.target.value)}
                                options={[
                                    { value: 'Non-voting', label: 'Economic Only (Non-voting)' },
                                    { value: 'Voting', label: 'Full Voting Rights' },
                                    { value: 'Mixed', label: 'Mixed Classes' }
                                ]}
                            />
                        </div>
                    </div>
                     <div className="flex justify-end gap-4">
                        <Button variant="secondary" onClick={handleSave}>Save Draft</Button>
                        <Button onClick={handleNext} className="bg-sim-cta text-white">Save & Next →</Button>
                    </div>
                </div>
            )}

            {/* TAB 3: TOKEN MECHANICS */}
            {activeTab === 'TOKEN' && (
                <div className="space-y-6 animate-fadeIn">
                     <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-6">Tokenomics</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <Select 
                                id="capitalUse" label="Use of Proceeds"
                                value={state.tokenMechanics.capitalUse}
                                onChange={e => updateSection('tokenMechanics', 'capitalUse', e.target.value)}
                                options={[
                                    { value: 'Acquisition', label: 'Asset Acquisition' },
                                    { value: 'Development', label: 'Development / Construction' },
                                    { value: 'Renovation', label: 'Renovation / Value-Add' },
                                    { value: 'Refinancing', label: 'Refinancing' }
                                ]}
                            />
                            <Select 
                                id="redeemability" label="Redemption Policy"
                                value={state.tokenMechanics.redeemability}
                                onChange={e => updateSection('tokenMechanics', 'redeemability', e.target.value)}
                                options={[
                                    { value: 'No redemption', label: 'No Redemption (Secondary Only)' },
                                    { value: 'Cash redemption', label: 'Cash Redemption at Maturity' },
                                    { value: 'Buyback', label: 'Discretionary Buyback' }
                                ]}
                            />
                            <Select 
                                id="complianceMode" label="Compliance Framework"
                                value={state.tokenMechanics.complianceMode}
                                onChange={e => updateSection('tokenMechanics', 'complianceMode', e.target.value)}
                                options={[
                                    { value: 'Reg D 506(c)', label: 'US Reg D 506(c)' },
                                    { value: 'Reg S', label: 'Reg S (International)' },
                                    { value: 'Reg A+', label: 'Reg A+ (Public)' },
                                    { value: 'MiCA ART', label: 'EU MiCA (ART)' },
                                    { value: 'Prospectus Exemption', label: 'EU Prospectus Exemption' }
                                ]}
                            />
                            <Input 
                                id="targetRaise" label="Target Raise ($)" type="number"
                                value={state.tokenMechanics.targetRaiseAmount}
                                onChange={e => updateSection('tokenMechanics', 'targetRaiseAmount', parseInt(e.target.value))}
                            />
                        </div>
                     </div>
                      <div className="flex justify-end gap-4">
                        <Button variant="secondary" onClick={handleSave}>Save Draft</Button>
                        <Button onClick={handleNext} className="bg-sim-cta text-white">Save & Next →</Button>
                    </div>
                </div>
            )}

            {/* TAB 4: OPERATIONS & BANKING */}
            {activeTab === 'OPS' && (
                <div className="space-y-6 animate-fadeIn">
                     <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-6">Operations</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Select 
                                id="localDirector" label="Local Director Required?"
                                value={state.operationsBanking.requiresLocalDirector}
                                onChange={e => updateSection('operationsBanking', 'requiresLocalDirector', e.target.value)}
                                options={[{ value: 'Yes', label: 'Yes' }, { value: 'No', label: 'No' }]}
                            />
                            <Select 
                                id="bankingPref" label="Banking Preference"
                                value={state.operationsBanking.bankingPreference}
                                onChange={e => updateSection('operationsBanking', 'bankingPreference', e.target.value)}
                                options={[
                                    { value: 'Local bank', label: 'Tier 1 Local Bank' },
                                    { value: 'EMI', label: 'EMI / Fintech (Revolut/Wise)' },
                                    { value: 'Crypto-friendly', label: 'Crypto-Friendly Offshore' }
                                ]}
                            />
                             <Select 
                                id="kyc" label="Expected KYC Intensity"
                                value={state.operationsBanking.expectedKYCIntensity}
                                onChange={e => updateSection('operationsBanking', 'expectedKYCIntensity', e.target.value)}
                                options={[{ value: 'Low', label: 'Low (Email only)' }, { value: 'Medium', label: 'Medium (ID Scan)' }, { value: 'High', label: 'High (Video/Biometric)' }]}
                            />
                        </div>
                     </div>

                     <div className="flex justify-center pt-8">
                         <Button 
                            onClick={handleRunAnalysis} 
                            isLoading={isAnalyzing}
                            className="bg-gradient-to-r from-sim-blue to-sim-purple text-white px-10 py-4 text-lg shadow-xl"
                         >
                            {isAnalyzing ? 'Architecting...' : '✨ Run SPV Analysis'}
                         </Button>
                     </div>
                </div>
            )}

            {/* RESULTS SECTION */}
            {state.analysisResults && state.analysisResults.structure && (
                <div id="spv-analysis-results" className="pt-8 border-t border-slate-800 animate-slideUp">
                    <h3 className="text-2xl font-bold text-white mb-6 font-display">AI Strategic Blueprint</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* 1. Structure */}
                        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-lg">
                            <h4 className="text-sm font-bold text-sim-cyan uppercase tracking-widest mb-4">Recommended Structure</h4>
                            <div className="text-xl font-bold text-white mb-2">{state.analysisResults.structure.structureName || 'Custom Structure'}</div>
                            <div className="flex flex-col items-center py-4 space-y-2">
                                {state.analysisResults.structure.nodes?.map((node: string, i: number) => (
                                    <React.Fragment key={i}>
                                        <div className="px-4 py-2 bg-slate-800 rounded border border-slate-700 text-sm text-slate-200">{node}</div>
                                        {i < (state.analysisResults.structure.nodes.length || 0) - 1 && <div className="h-4 w-0.5 bg-slate-600"></div>}
                                    </React.Fragment>
                                ))}
                            </div>
                            <p className="text-xs text-slate-400 italic text-center mt-2">{state.analysisResults.structure.flowDescription}</p>
                        </div>

                        {/* 2. Reasoning */}
                        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-lg">
                            <h4 className="text-sm font-bold text-sim-orange uppercase tracking-widest mb-4">Strategic Logic</h4>
                            <div className="space-y-4 text-sm text-slate-300">
                                {state.analysisResults.explanation && (
                                    <>
                                        <div>
                                            <span className="font-bold text-white block mb-1">Tax Efficiency:</span>
                                            {state.analysisResults.explanation.taxReasoning}
                                        </div>
                                        <div>
                                            <span className="font-bold text-white block mb-1">Operational:</span>
                                            {state.analysisResults.explanation.operationalReasoning}
                                        </div>
                                        <div>
                                            <span className="font-bold text-white block mb-1">Investor Protection:</span>
                                            {state.analysisResults.explanation.investorProtectionReasoning}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* 3. Red Flags */}
                        <div className="bg-slate-900 p-6 rounded-2xl border border-red-900/30 shadow-lg">
                            <h4 className="text-sm font-bold text-red-400 uppercase tracking-widest mb-4">Risk Audit</h4>
                            <ul className="space-y-3">
                                {state.analysisResults.flags?.map((flag: any, i: number) => (
                                    <li key={i} className="flex gap-3 text-sm text-slate-300 bg-red-900/10 p-3 rounded-lg border border-red-900/20">
                                        <span className="text-red-500 font-bold">!</span>
                                        <div>
                                            <span className="block font-bold text-red-300">{flag.risk}</span>
                                            <span className="text-xs">{flag.fix}</span>
                                        </div>
                                    </li>
                                ))}
                                {(!state.analysisResults.flags || state.analysisResults.flags.length === 0) && <li className="text-emerald-400">No Critical Flags Detected.</li>}
                            </ul>
                        </div>

                        {/* 4. Compliance & Banking */}
                        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-lg">
                             <h4 className="text-sm font-bold text-purple-400 uppercase tracking-widest mb-4">Banking & Regs</h4>
                             {state.analysisResults.compliance && (
                                 <>
                                     <div className="mb-4">
                                         <span className="text-xs text-slate-500 uppercase font-bold">Regulatory Path</span>
                                         <div className="text-lg font-bold text-white">{state.analysisResults.compliance.pathName}</div>
                                         <p className="text-xs text-slate-400 mt-1">{state.analysisResults.compliance.complianceSummary}</p>
                                     </div>
                                     <div>
                                         <span className="text-xs text-slate-500 uppercase font-bold">Banking Feasibility</span>
                                         <div className={`text-lg font-bold ${state.analysisResults.compliance.bankingFeasibility === 'Hard' ? 'text-red-400' : 'text-emerald-400'}`}>
                                             {state.analysisResults.compliance.bankingFeasibility}
                                         </div>
                                         <p className="text-xs text-slate-400 mt-1">{state.analysisResults.compliance.bankingNotes}</p>
                                     </div>
                                 </>
                             )}
                        </div>
                    </div>
                </div>
            )}

        </div>
    </div>
  );
};
