
import React, { useState } from 'react';
import { TokenBlueprintEntity } from '../../domain/token_blueprint.entity';
import { tokenBlueprintService } from '../../../services/token_blueprint_service';
import { Button } from '../../../../../components/ui/Button';

interface Props {
  blueprint: TokenBlueprintEntity;
  updateBlueprint: (updates: Partial<TokenBlueprintEntity>) => void;
}

export const TokenRightsTab: React.FC<Props> = ({ blueprint, updateBlueprint }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [rightsData, setRightsData] = useState<any>(null);

  const handleAiGenerate = async () => {
      setIsGenerating(true);
      const data = await tokenBlueprintService.generateTokenRights(blueprint, "US-DE"); // Mock jurisdiction context
      setRightsData(data);
      // Map back to entity simple strings for storage
      if (data) {
          const eco = data.economic_rights.filter((r: any) => r.enabled).map((r: any) => r.label);
          const gov = data.governance_rights.filter((r: any) => r.enabled).map((r: any) => r.label);
          updateBlueprint({ 
              economicRights: eco, 
              governanceRights: gov,
              transferRestrictions: data.transfer_restrictions.join(', ')
          });
      }
      setIsGenerating(false);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
        
        <div className="flex justify-between items-center">
            <div>
                <h4 className="text-xl font-bold text-white flex items-center gap-2">
                    <span className="text-2xl">⚖️</span> Token Rights Matrix
                </h4>
                <p className="text-slate-400 text-sm mt-1">Define the legal claims attached to the token.</p>
            </div>
            <Button 
                onClick={handleAiGenerate} 
                isLoading={isGenerating}
                className="bg-purple-600 hover:bg-purple-500 text-xs uppercase tracking-wider"
            >
                {isGenerating ? 'Analyzing Law...' : 'AI Define Rights'}
            </Button>
        </div>

        {rightsData ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Economic Rights */}
                <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
                    <h5 className="text-sm font-bold text-emerald-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <span>💰</span> Economic Rights
                    </h5>
                    <div className="space-y-3">
                        {rightsData.economic_rights.map((right: any, i: number) => (
                            <div key={i} className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${right.enabled ? 'bg-emerald-900/20 border-emerald-500/50' : 'bg-slate-950 border-slate-800 opacity-60'}`}>
                                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs border ${right.enabled ? 'bg-emerald-500 border-emerald-500 text-slate-900' : 'border-slate-600 text-slate-600'}`}>
                                    {right.enabled && '✓'}
                                </div>
                                <div>
                                    <span className={`block text-sm font-bold ${right.enabled ? 'text-white' : 'text-slate-400'}`}>{right.label}</span>
                                    <span className="text-[10px] text-slate-500">{right.description}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Governance Rights */}
                <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
                    <h5 className="text-sm font-bold text-purple-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <span>🗳️</span> Governance Rights
                    </h5>
                    <div className="space-y-3">
                        {rightsData.governance_rights.map((right: any, i: number) => (
                            <div key={i} className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${right.enabled ? 'bg-purple-900/20 border-purple-500/50' : 'bg-slate-950 border-slate-800 opacity-60'}`}>
                                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs border ${right.enabled ? 'bg-purple-500 border-purple-500 text-white' : 'border-slate-600 text-slate-600'}`}>
                                    {right.enabled && '✓'}
                                </div>
                                <div>
                                    <span className={`block text-sm font-bold ${right.enabled ? 'text-white' : 'text-slate-400'}`}>{right.label}</span>
                                    <span className="text-[10px] text-slate-500">{right.description}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Liquidity & Restrictions */}
                <div className="md:col-span-2 bg-slate-900 border border-slate-700 rounded-xl p-6 flex flex-col md:flex-row gap-6">
                    <div className="flex-1">
                        <label className="text-xs text-slate-500 font-bold uppercase block mb-2">Liquidation Priority</label>
                        <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono text-sm">
                            {rightsData.liquidation_priority}
                        </div>
                    </div>
                    <div className="flex-1">
                        <label className="text-xs text-slate-500 font-bold uppercase block mb-2">Transfer Restrictions</label>
                        <div className="flex flex-wrap gap-2">
                            {rightsData.transfer_restrictions.map((res: string, i: number) => (
                                <span key={i} className="px-2 py-1 bg-red-900/20 border border-red-500/30 text-red-300 text-xs rounded">
                                    {res}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        ) : (
            <div className="flex flex-col items-center justify-center h-64 bg-slate-900 border border-slate-800 border-dashed rounded-xl text-slate-500">
                <span className="text-4xl mb-4 grayscale opacity-20">📜</span>
                <p>Run AI Analysis to determine rights based on Jurisdiction.</p>
            </div>
        )}
    </div>
  );
};
