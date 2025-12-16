
import React, { useState } from 'react';
import { TokenBlueprintEntity } from '../../domain/token_blueprint.entity';
import { Button } from '../../../../components/ui/Button';
import { TokenEconomicsTab } from './tabs/TokenEconomicsTab';
import { TokenDistributionTab } from './tabs/TokenDistributionTab';
import { TokenRightsTab } from './tabs/TokenRightsTab';
import { DeFiDeploymentHandoffTab } from './tabs/DeFiDeploymentHandoffTab'; // NEW IMPORT

interface Props {
  blueprint: TokenBlueprintEntity;
  updateBlueprint: (updates: Partial<TokenBlueprintEntity>) => void;
  onExit: () => void;
}

type ModuleTab = 'ARCHITECTURE' | 'COMPLIANCE' | 'ECONOMICS' | 'DISTRIBUTION' | 'RIGHTS' | 'PROVIDER_OUTPUT' | 'HANDOFF';

export const DeFiArchitectView: React.FC<Props> = ({ blueprint, updateBlueprint, onExit }) => {
  const [activeTab, setActiveTab] = useState<ModuleTab>('ARCHITECTURE');

  // --- RENDERERS ---

  const renderArchitecture = () => (
    <div className="space-y-6 animate-fadeIn">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900 border border-slate-700 p-6 rounded-xl">
                <h4 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <span className="text-xl">📜</span> Standard Consigliato
                </h4>
                <div className="space-y-4">
                    <div>
                        <label className="text-xs text-slate-500 font-bold block mb-2">Technical Standard</label>
                        <select 
                            value={blueprint.tokenStandard}
                            onChange={(e) => updateBlueprint({ tokenStandard: e.target.value as any })}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white outline-none focus:border-purple-500"
                        >
                            <option value="ERC-3643">ERC-3643 (T-REX) - Institutional Compliance</option>
                            <option value="ERC-1404">ERC-1404 - Simple Restricted Token</option>
                            <option value="BSPT">BSPT (Blocksquare) - Real Estate Specific</option>
                            <option value="ERC-20">ERC-20 (Basic) - Low Compliance</option>
                        </select>
                    </div>
                    <div>
                         <label className="text-xs text-slate-500 font-bold block mb-2">Token Type</label>
                         <div className="flex flex-wrap gap-2">
                             {['Security', 'Utility', 'Governance', 'Revenue Share'].map(type => (
                                 <button
                                    key={type}
                                    onClick={() => updateBlueprint({ tokenType: type as any })}
                                    className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${blueprint.tokenType === type ? 'bg-purple-600 text-white border-purple-500' : 'bg-slate-800 text-slate-400 border-slate-700'}`}
                                 >
                                     {type}
                                 </button>
                             ))}
                         </div>
                    </div>
                </div>
            </div>

            <div className="bg-slate-900 border border-slate-700 p-6 rounded-xl">
                <h4 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <span className="text-xl">🔐</span> Permission Module
                </h4>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-slate-950 rounded-lg border border-slate-800">
                        <div>
                            <span className="block text-sm font-bold text-white">Pauseable</span>
                            <span className="text-[10px] text-slate-500">Emergency freeze capability</span>
                        </div>
                        <div className={`w-8 h-4 rounded-full relative ${blueprint.permissionConfig?.pauseable ? 'bg-emerald-500' : 'bg-slate-700'}`}>
                            <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${blueprint.permissionConfig?.pauseable ? 'left-4.5' : 'left-0.5'}`}></div>
                        </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-950 rounded-lg border border-slate-800">
                        <div>
                            <span className="block text-sm font-bold text-white">Force Transfer</span>
                            <span className="text-[10px] text-slate-500">Legal recovery mechanism</span>
                        </div>
                        <div className={`w-8 h-4 rounded-full relative ${blueprint.permissionConfig?.forceTransfer ? 'bg-emerald-500' : 'bg-slate-700'}`}>
                            <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${blueprint.permissionConfig?.forceTransfer ? 'left-4.5' : 'left-0.5'}`}></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );

  const renderCompliance = () => (
    <div className="space-y-6 animate-fadeIn">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900 border border-slate-700 p-6 rounded-xl">
                <h4 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-4">Compliance Module</h4>
                <div className="space-y-4">
                    <div>
                        <label className="text-xs text-slate-500 font-bold block mb-2">Transfer Restrictions</label>
                        <input 
                            value={blueprint.transferRestrictions}
                            onChange={e => updateBlueprint({ transferRestrictions: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white text-sm outline-none focus:border-emerald-500"
                        />
                    </div>
                    <div>
                        <label className="text-xs text-slate-500 font-bold block mb-2">Jurisdiction Rules</label>
                        <textarea 
                            value={blueprint.jurisdictionRules}
                            onChange={e => updateBlueprint({ jurisdictionRules: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white text-sm outline-none focus:border-emerald-500 h-24 resize-none"
                        />
                    </div>
                </div>
            </div>
            
            <div className="bg-slate-900 border border-slate-700 p-6 rounded-xl">
                 <h4 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-4">Risk Analysis (AI)</h4>
                 <div className="p-4 bg-amber-900/10 border border-amber-500/20 rounded-lg">
                     <p className="text-sm text-amber-200/90 leading-relaxed italic">
                         "{blueprint.riskAnalysisAi}"
                     </p>
                 </div>
                 <div className="mt-4 pt-4 border-t border-slate-800">
                     <div className="flex justify-between items-center text-xs text-slate-500 mb-1">
                         <span>Regulatory Friction</span>
                         <span className="text-white">High</span>
                     </div>
                     <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                         <div className="bg-red-500 h-full w-[75%]"></div>
                     </div>
                 </div>
            </div>
        </div>
    </div>
  );

  const renderProviderOutput = () => {
      const outputJson = {
          protocol: "PropertyDEX Enterprise",
          token_standard: blueprint.tokenStandard,
          compliance: {
              whitelist_rules: blueprint.complianceConfig,
              transfer_restrictions: blueprint.transferRestrictions,
              jurisdiction_rules: blueprint.jurisdictionRules
          },
          economics: {
              supply: blueprint.totalSupply,
              hard_cap: blueprint.hardCap,
              currency: blueprint.currency
          },
          distribution: blueprint.distributionPlan,
          rights: {
             economic: blueprint.economicRights,
             governance: blueprint.governanceRights
          }
      };

      return (
          <div className="animate-fadeIn h-full flex flex-col">
              <div className="flex justify-between items-center mb-4">
                  <h4 className="text-sm font-bold text-slate-300 uppercase tracking-widest">Provider Configuration Output</h4>
                  <Button className="text-xs py-1 px-3 bg-blue-600 hover:bg-blue-500">Send to Provider API</Button>
              </div>
              <div className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-4 overflow-auto custom-scrollbar">
                  <pre className="font-mono text-xs text-emerald-400 whitespace-pre-wrap">
                      {JSON.stringify(outputJson, null, 2)}
                  </pre>
              </div>
          </div>
      );
  };

  return (
    <div className="h-full flex flex-col space-y-6">
        
        {/* Token Classification Header */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg shrink-0">
             <div className="flex justify-between items-start mb-4">
                 <div>
                     <h2 className="text-2xl font-bold text-white font-display">{blueprint.tokenName}</h2>
                     <div className="flex items-center gap-2 mt-1">
                         <span className="text-xs font-mono text-slate-400 bg-slate-950 px-2 py-1 rounded border border-slate-800">{blueprint.tokenSymbol}</span>
                         <span className="text-xs text-purple-400 font-bold bg-purple-900/20 px-2 py-1 rounded border border-purple-500/20">{blueprint.tokenStandard}</span>
                     </div>
                 </div>
                 <div className="text-right">
                     <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Classification</span>
                     <div className="text-lg font-bold text-white">{blueprint.tokenType}</div>
                 </div>
             </div>

             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-950 rounded-xl border border-slate-800">
                 <div>
                     <span className="text-[10px] text-slate-500 uppercase block">Type</span>
                     <span className="text-sm text-white font-medium">{blueprint.tokenType}</span>
                 </div>
                 <div>
                     <span className="text-[10px] text-slate-500 uppercase block">Standard</span>
                     <span className="text-sm text-white font-medium">{blueprint.tokenStandard}</span>
                 </div>
                 <div>
                     <span className="text-[10px] text-slate-500 uppercase block">Restrictions</span>
                     <span className="text-sm text-white font-medium truncate" title={blueprint.transferRestrictions}>{blueprint.transferRestrictions}</span>
                 </div>
                 <div>
                     <span className="text-[10px] text-slate-500 uppercase block">Risk (AI)</span>
                     <span className="text-sm text-white font-medium truncate" title={blueprint.riskAnalysisAi}>{blueprint.riskAnalysisAi.split('.')[0]}</span>
                 </div>
             </div>
        </div>

        {/* Modules Tabs */}
        <div className="flex-1 flex flex-col min-h-0 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
             <div className="flex border-b border-slate-800 bg-slate-950 px-4 overflow-x-auto no-scrollbar">
                 {[
                     { id: 'ARCHITECTURE', label: '1. Standard & Tech' },
                     { id: 'COMPLIANCE', label: '2. Compliance & Perms' },
                     { id: 'ECONOMICS', label: '3. Core Economics' },
                     { id: 'DISTRIBUTION', label: '4. Distribution' },
                     { id: 'RIGHTS', label: '5. Rights Matrix' },
                     { id: 'PROVIDER_OUTPUT', label: '6. Provider JSON' },
                     { id: 'HANDOFF', label: '7. Deploy Handoff' }, // NEW TAB
                 ].map(tab => (
                     <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as ModuleTab)}
                        className={`px-6 py-4 text-xs font-bold uppercase tracking-wider transition-all border-b-2 whitespace-nowrap ${activeTab === tab.id ? 'border-purple-500 text-white bg-slate-900' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
                     >
                         {tab.label}
                     </button>
                 ))}
             </div>
             
             <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                 {activeTab === 'ARCHITECTURE' && renderArchitecture()}
                 {activeTab === 'COMPLIANCE' && renderCompliance()}
                 {activeTab === 'ECONOMICS' && <TokenEconomicsTab blueprint={blueprint} updateBlueprint={updateBlueprint} />}
                 {activeTab === 'DISTRIBUTION' && <TokenDistributionTab blueprint={blueprint} updateBlueprint={updateBlueprint} />}
                 {activeTab === 'RIGHTS' && <TokenRightsTab blueprint={blueprint} updateBlueprint={updateBlueprint} />}
                 {activeTab === 'PROVIDER_OUTPUT' && renderProviderOutput()}
                 {activeTab === 'HANDOFF' && <DeFiDeploymentHandoffTab blueprint={blueprint} updateBlueprint={updateBlueprint} />}
             </div>
        </div>

        <div className="flex justify-end pt-2">
            <button onClick={onExit} className="text-slate-500 hover:text-white text-xs uppercase font-bold tracking-wider">
                Exit Architect
            </button>
        </div>
    </div>
  );
};
