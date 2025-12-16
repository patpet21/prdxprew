
import React, { useState } from 'react';
import { TokenBlueprintEntity } from '../../domain/token_blueprint.entity';
import { tokenBlueprintService } from '../../../services/token_blueprint_service';
import { Button } from '../../../../../components/ui/Button';
import { ConfirmationDialog } from '../../../../../../components/ui/ConfirmationDialog';

interface Props {
  blueprint: TokenBlueprintEntity;
  updateBlueprint: (updates: Partial<TokenBlueprintEntity>) => void;
}

export const DeFiDeploymentHandoffTab: React.FC<Props> = ({ blueprint, updateBlueprint }) => {
  const [isDeploying, setIsDeploying] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const handoff = blueprint.defiHandoff;

  const handleDeployClick = () => {
    setShowConfirm(true);
  };

  const executeDeploy = async () => {
      setIsDeploying(true);
      // Simulate AI processing time
      const result = await tokenBlueprintService.generateDeFiHandoff(blueprint, "Global");
      updateBlueprint({ defiHandoff: result });
      setIsDeploying(false);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
        
        <div className="flex justify-between items-center">
            <div>
                <h4 className="text-xl font-bold text-white flex items-center gap-2">
                    <span className="text-2xl">🚀</span> Deployment Command Center
                </h4>
                <p className="text-slate-400 text-sm mt-1">Generate the final technical package for mainnet deployment.</p>
            </div>
            
            {!handoff ? (
                <Button 
                    onClick={handleDeployClick} 
                    isLoading={isDeploying}
                    className="bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-900/30"
                >
                    {isDeploying ? 'Compiling Contract...' : 'Initiate Mock Deployment'}
                </Button>
            ) : (
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-900/30 border border-emerald-500/50 rounded-lg text-emerald-400 text-xs font-bold uppercase tracking-wider">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Deployed to {handoff.network}
                </div>
            )}
        </div>

        {handoff ? (
            <div className="animate-slideUp space-y-6">
                
                {/* Status Dashboard */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 relative overflow-hidden">
                         <div className="absolute top-0 right-0 p-4 opacity-10 text-4xl">🔗</div>
                         <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Contract Address</h5>
                         <div className="text-white font-mono text-sm truncate bg-slate-950 p-2 rounded border border-slate-800 mb-2">
                             {handoff.contract_address}
                         </div>
                         <button className="text-[10px] text-indigo-400 font-bold uppercase hover:text-indigo-300">View Explorer ↗</button>
                    </div>
                    
                    <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
                         <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Standard</h5>
                         <div className="text-xl font-bold text-white mb-1">{handoff.token_standard}</div>
                         <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded">Audited</span>
                    </div>

                    <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
                         <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Owner Wallet</h5>
                         <div className="text-sm font-mono text-slate-300 truncate mb-2">{handoff.deployer_wallet}</div>
                         <span className="text-[10px] text-slate-500">Multi-Sig Recommended</span>
                    </div>
                </div>

                {/* JSON Payload Viewer */}
                <div className="bg-slate-950 rounded-xl border border-slate-800 flex flex-col h-[400px]">
                    <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/50">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-400 uppercase">Handoff Package JSON</span>
                            <span className="text-[10px] text-emerald-500 bg-emerald-900/20 px-2 py-0.5 rounded border border-emerald-900/50">Valid</span>
                        </div>
                        <button className="text-xs text-slate-400 hover:text-white font-mono">Copy</button>
                    </div>
                    <div className="flex-1 overflow-auto p-4 custom-scrollbar">
                        <pre className="text-[10px] md:text-xs font-mono text-emerald-400/90 leading-relaxed whitespace-pre-wrap">
                            {JSON.stringify(handoff, null, 2)}
                        </pre>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="flex justify-end gap-4 pt-4 border-t border-slate-800">
                    <Button variant="secondary" className="text-xs">Download ABI</Button>
                    <Button className="bg-white text-slate-900 hover:bg-slate-200 text-xs font-bold shadow-lg">
                        Export Full Package (.zip)
                    </Button>
                </div>

            </div>
        ) : (
            <div className="flex flex-col items-center justify-center h-[400px] bg-slate-900 border border-slate-800 border-dashed rounded-xl">
                <div className="text-6xl mb-4 grayscale opacity-20">📦</div>
                <p className="text-slate-500 text-sm font-medium">Ready to package. Click "Initiate Mock Deployment" above.</p>
            </div>
        )}

        <ConfirmationDialog 
            isOpen={showConfirm}
            onClose={() => setShowConfirm(false)}
            onConfirm={executeDeploy}
            title="Deploy Contract Simulation"
            message="This will compile the smart contracts and generate the handoff artifacts. Confirm to proceed?"
            confirmText="Generate Package"
            variant="info"
        />

    </div>
  );
};
