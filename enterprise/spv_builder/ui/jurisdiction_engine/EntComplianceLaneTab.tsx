
import React, { useState } from 'react';
import { EnterpriseAI } from '../../../services/ai/ai_manager';
import { ENT_COMPLIANCE_RISK_PROMPT } from '../../prompts/jurisdiction/ent_compliance.prompts';

interface Props {
  data: any;
  updateData: (field: string, val: any) => void;
}

export const EntComplianceLaneTab: React.FC<Props> = ({ data, updateData }) => {
  const jurisdiction = data.jurisdiction || {};
  const property = data.property || {};
  
  const profile = jurisdiction?.complianceProfile || {
      retailAllowed: false,
      accreditedOnly: true,
      institutionalFocus: false,
      regLane: 'Reg D 506(c)'
  };

  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const updateProfile = (field: string, val: any) => {
      updateData('jurisdiction', { 
          ...jurisdiction, 
          complianceProfile: { ...profile, [field]: val }
      });
  };

  const runRiskAnalysis = async () => {
      setIsAnalyzing(true);
      const result = await EnterpriseAI.generateJSON(
          "Compliance Officer",
          ENT_COMPLIANCE_RISK_PROMPT(
              jurisdiction.country || "Global",
              [profile.retailAllowed ? 'Retail' : '', profile.accreditedOnly ? 'Accredited' : ''].filter(Boolean),
              property.category || "Asset"
          ),
          { riskScore: 50, requiredDocs: ["Prospectus"], redFlags: ["None"], recommendation: "Proceed" }
      );
      setAiAnalysis(result);
      setIsAnalyzing(false);
  };

  return (
    <div className="animate-fadeIn space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-900 rounded-lg text-white border border-slate-700">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                </div>
                <div>
                    <h3 className="text-lg font-bold text-white">Compliance Configuration</h3>
                    <p className="text-xs text-slate-400">Define the regulatory "lanes" for your token.</p>
                </div>
            </div>
            <button 
                onClick={runRiskAnalysis}
                disabled={isAnalyzing}
                className="bg-red-600/20 text-red-400 border border-red-500/30 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-red-600/30 transition-all"
            >
                {isAnalyzing ? 'Auditing...' : 'Run Risk Audit'}
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* 1. Investor Eligibility */}
            <div className="space-y-4">
                <label className="text-xs font-bold text-slate-500 uppercase block">Investor Access</label>
                
                <div 
                    className={`p-5 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between group ${profile.retailAllowed ? 'bg-purple-900/10 border-purple-500' : 'bg-slate-900 border-slate-800'}`}
                    onClick={() => updateProfile('retailAllowed', !profile.retailAllowed)}
                >
                    <div className="flex gap-4 items-center">
                        <div className="text-2xl">🛍️</div>
                        <div>
                            <h4 className="font-bold text-sm text-white">Retail Allowed</h4>
                            <p className="text-xs text-slate-500">General public access (High Friction)</p>
                        </div>
                    </div>
                    <div className={`w-12 h-6 rounded-full relative transition-colors ${profile.retailAllowed ? 'bg-purple-500' : 'bg-slate-700'}`}>
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${profile.retailAllowed ? 'left-7' : 'left-1'}`}></div>
                    </div>
                </div>

                <div 
                    className={`p-5 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between group ${profile.accreditedOnly ? 'bg-emerald-900/10 border-emerald-500' : 'bg-slate-900 border-slate-800'}`}
                    onClick={() => updateProfile('accreditedOnly', !profile.accreditedOnly)}
                >
                    <div className="flex gap-4 items-center">
                        <div className="text-2xl">🎩</div>
                        <div>
                            <h4 className="font-bold text-sm text-white">Accredited / HNWI</h4>
                            <p className="text-xs text-slate-500">Wealthy investors (Low Friction)</p>
                        </div>
                    </div>
                    <div className={`w-12 h-6 rounded-full relative transition-colors ${profile.accreditedOnly ? 'bg-emerald-500' : 'bg-slate-700'}`}>
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${profile.accreditedOnly ? 'left-7' : 'left-1'}`}></div>
                    </div>
                </div>
            </div>

            {/* 2. Regulatory Framework */}
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
                <label className="text-xs font-bold text-slate-500 uppercase block mb-4">Primary Regulation Lane</label>
                <div className="space-y-3">
                    {['Reg D 506(c)', 'Reg S', 'Reg A+', 'MiCA / EU Prospectus', 'Crowdfunding Reg'].map(reg => (
                        <button
                            key={reg}
                            onClick={() => updateProfile('regLane', reg)}
                            className={`w-full text-left px-4 py-3 rounded-lg text-sm font-bold transition-all ${profile.regLane === reg ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-800 text-slate-400 hover:text-slate-200'}`}
                        >
                            {reg}
                        </button>
                    ))}
                </div>
            </div>
        </div>

        {/* AI Analysis Output */}
        {aiAnalysis && (
            <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden animate-slideUp">
                <div className="absolute top-0 right-0 p-6 opacity-10 text-6xl">🛡️</div>
                
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="col-span-1 border-r border-slate-800 pr-6">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Compliance Score</span>
                        <div className={`text-4xl font-display font-bold ${aiAnalysis.riskScore < 50 ? 'text-red-500' : aiAnalysis.riskScore < 80 ? 'text-amber-500' : 'text-emerald-500'}`}>
                            {aiAnalysis.riskScore}/100
                        </div>
                        <p className="text-xs text-slate-400 mt-2">{aiAnalysis.recommendation}</p>
                    </div>
                    
                    <div className="col-span-2">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Required Documentation</span>
                        <div className="flex flex-wrap gap-2 mb-4">
                            {aiAnalysis.requiredDocs.map((doc: string, i: number) => (
                                <span key={i} className="px-3 py-1 rounded-full bg-slate-800 text-xs font-mono text-indigo-300 border border-slate-700">{doc}</span>
                            ))}
                        </div>
                        
                        {aiAnalysis.redFlags.length > 0 && aiAnalysis.redFlags[0] !== 'None' && (
                            <div>
                                <span className="text-xs font-bold text-red-500 uppercase tracking-widest mb-2 block">Red Flags</span>
                                <ul className="space-y-1">
                                    {aiAnalysis.redFlags.map((flag: string, i: number) => (
                                        <li key={i} className="text-xs text-red-300 flex items-center gap-2">
                                            <span>⚠️</span> {flag}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )}

    </div>
  );
};
