
import React, { useState } from 'react';
import { DeploymentData } from '../../types';
import { Button } from '../ui/Button';

interface Props {
  deployment: DeploymentData;
  updateDeployment: (field: keyof DeploymentData, value: any) => void;
}

export const SmartContractTab: React.FC<Props> = ({ deployment, updateDeployment }) => {
  const { smartContract } = deployment;
  const [isDeploying, setIsDeploying] = useState(false);
  const [mode, setMode] = useState<'SELF' | 'MANAGED'>('SELF');
  const [selectedProvider, setSelectedProvider] = useState<string>('');

  const providers = [
      { id: 'TokenForge', name: 'TokenForge', icon: '🔨', desc: 'No-code ERC-3643 factory.' },
      { id: 'Blocksquare', name: 'Blocksquare', icon: '🟦', desc: 'Real Estate tokenization protocol.' },
      { id: 'Tokeny', name: 'Tokeny', icon: '🦖', desc: 'Institutional grade compliance.' },
  ];

  const handleDeploySim = () => {
      setIsDeploying(true);
      setTimeout(() => {
          updateDeployment('smartContract', { 
              ...smartContract, 
              status: 'Deployed', 
              address: '0x71C...9A23',
              standard: mode === 'MANAGED' ? `${smartContract.standard} (via ${selectedProvider})` : smartContract.standard
          });
          setIsDeploying(false);
      }, 2000);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 text-white">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <span className="text-xl">⚡</span> Contract Configuration
            </h3>
            
            {/* Deployment Mode Toggle */}
            <div className="flex bg-slate-800 p-1 rounded-lg mb-8">
                <button 
                    onClick={() => setMode('SELF')}
                    className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${mode === 'SELF' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
                >
                    Self-Managed Deployment
                </button>
                <button 
                    onClick={() => setMode('MANAGED')}
                    className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${mode === 'MANAGED' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
                >
                    Partner Provider
                </button>
            </div>
            
            {mode === 'SELF' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 animate-fadeIn">
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Token Standard</label>
                        <div className="p-3 bg-slate-800 rounded-lg border border-slate-700 text-sm font-mono text-indigo-400">
                            {smartContract.standard} (Permissioned)
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Blockchain Network</label>
                        <div className="flex gap-2">
                            {['Polygon', 'Base', 'Avalanche'].map(chain => (
                                <button
                                    key={chain}
                                    onClick={() => updateDeployment('smartContract', { ...smartContract, chain })}
                                    className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all ${
                                        smartContract.chain === chain 
                                            ? 'bg-indigo-600 text-white border-indigo-500' 
                                            : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
                                    }`}
                                >
                                    {chain}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 animate-fadeIn">
                    {providers.map(prov => (
                        <div 
                            key={prov.id}
                            onClick={() => setSelectedProvider(prov.id)}
                            className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedProvider === prov.id ? 'bg-indigo-900/40 border-indigo-500 ring-1 ring-indigo-500' : 'bg-slate-800 border-slate-700 hover:border-slate-600'}`}
                        >
                            <div className="text-2xl mb-2">{prov.icon}</div>
                            <h4 className="font-bold text-white text-sm">{prov.name}</h4>
                            <p className="text-xs text-slate-400 mt-1">{prov.desc}</p>
                        </div>
                    ))}
                </div>
            )}

            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 mb-6 font-mono text-xs text-slate-400">
                <div className="flex justify-between mb-1"><span>Gas Estimate:</span> <span className="text-emerald-400">~0.02 MATIC</span></div>
                <div className="flex justify-between"><span>Compliance Module:</span> <span className="text-white">Enabled</span></div>
            </div>

            <Button 
                onClick={handleDeploySim} 
                isLoading={isDeploying}
                disabled={smartContract.status === 'Deployed' || (mode === 'MANAGED' && !selectedProvider)}
                className={`w-full py-4 font-bold ${smartContract.status === 'Deployed' ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-indigo-600 hover:bg-indigo-500'}`}
            >
                {smartContract.status === 'Deployed' 
                    ? 'Contract Deployed (Testnet)' 
                    : mode === 'SELF' ? 'Deploy to Testnet' : `Deploy via ${selectedProvider || 'Provider'}`}
            </Button>

            {smartContract.address && (
                <div className="mt-4 text-center text-xs text-slate-500">
                    Contract Address: <span className="text-indigo-400 font-mono">{smartContract.address}</span>
                </div>
            )}
        </div>
    </div>
  );
};
