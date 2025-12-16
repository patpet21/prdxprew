
import React, { useState, useEffect } from 'react';
import { getProvidersForSpv, SpvProviderOption } from '../../data/provider_logic';
import { Button } from '../../../../components/ui/Button';
import { ConfirmationDialog } from '../../../../../../components/ui/ConfirmationDialog';

interface Props {
  data: any;
}

export const EntSpvProviderAction: React.FC<Props> = ({ data }) => {
  const jurisdiction = data.jurisdiction || {};
  const spv = jurisdiction.detailedSpv || {};
  const [providers, setProviders] = useState<SpvProviderOption[]>([]);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  
  // Confirmation State
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingProvider, setPendingProvider] = useState<{id: string, name: string} | null>(null);

  useEffect(() => {
    if (jurisdiction.country) {
      const list = getProvidersForSpv(jurisdiction.country, jurisdiction.spvType, spv.spvRoleType);
      setProviders(list);
    }
  }, [jurisdiction.country, jurisdiction.spvType, spv.spvRoleType]);

  const handleActionClick = (providerId: string, providerName: string) => {
      setPendingProvider({ id: providerId, name: providerName });
      setShowConfirm(true);
  };

  const executeAction = () => {
    if (!pendingProvider) return;
    setIsProcessing(pendingProvider.id);
    setTimeout(() => {
      alert(`Package sent securely to ${pendingProvider.name} via API gateway.`);
      setIsProcessing(null);
      setPendingProvider(null);
    }, 2000);
  };

  if (!jurisdiction.country) {
    return <div className="text-slate-500 p-8 text-center">Please select a jurisdiction first.</div>;
  }

  return (
    <div className="animate-fadeIn space-y-8">
      
      <div className="bg-gradient-to-r from-emerald-900/40 to-teal-900/40 border border-emerald-500/30 p-8 rounded-3xl relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
         <div className="relative z-10">
             <h3 className="text-2xl font-bold text-white font-display mb-2">Execution & Formation</h3>
             <p className="text-slate-300 text-sm max-w-2xl">
                Your SPV structure for <strong>{spv.spvLegalNameHint || 'Project Entity'}</strong> is ready. 
                Select an authorized provider below to initiate incorporation or download the legal package.
             </p>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {providers.map(provider => (
              <div 
                key={provider.id}
                className={`
                    flex flex-col p-6 rounded-2xl border transition-all group relative overflow-hidden
                    ${provider.isRecommended 
                        ? 'bg-slate-900 border-amber-500 shadow-xl shadow-amber-900/20' 
                        : 'bg-slate-900 border-slate-800 hover:border-slate-600'
                    }
                `}
              >
                  {provider.isRecommended && (
                      <div className="absolute top-0 right-0 bg-amber-500 text-slate-900 text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                          Best Fit
                      </div>
                  )}

                  <div className="flex items-start justify-between mb-4">
                      <div className="w-14 h-14 rounded-xl bg-slate-800 flex items-center justify-center text-3xl shadow-inner border border-slate-700/50">
                          {provider.logo}
                      </div>
                      {provider.costEstimate && (
                          <div className="text-right">
                              <p className="text-[10px] text-slate-500 uppercase font-bold">Est. Cost</p>
                              <p className="text-white font-mono font-bold">{provider.costEstimate}</p>
                          </div>
                      )}
                  </div>

                  <h4 className="text-lg font-bold text-white mb-1">{provider.name}</h4>
                  <span className="text-[10px] font-bold uppercase text-slate-500 mb-3 block">{provider.type}</span>
                  
                  <p className="text-sm text-slate-400 leading-relaxed mb-6 flex-1">
                      {provider.description}
                  </p>

                  <div className="space-y-3 mt-auto">
                      <Button 
                        onClick={() => handleActionClick(provider.id, provider.name)}
                        isLoading={isProcessing === provider.id}
                        className={`w-full py-3 text-xs uppercase tracking-wider font-bold ${provider.isRecommended ? 'bg-amber-500 hover:bg-amber-400 text-slate-900' : 'bg-indigo-600 hover:bg-indigo-500 text-white'}`}
                      >
                          {isProcessing === provider.id ? 'Transmitting...' : provider.primaryAction}
                      </Button>
                      
                      {provider.secondaryAction && (
                          <button className="w-full py-2 text-xs font-bold text-slate-400 hover:text-white border border-slate-700 hover:border-slate-500 rounded-lg transition-colors">
                              {provider.secondaryAction}
                          </button>
                      )}
                  </div>
              </div>
          ))}
      </div>

      {/* Data Room Summary */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-xl">📦</span> Package Contents
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center gap-3">
                  <span className="text-emerald-500">✓</span>
                  <span className="text-xs text-slate-300">SPV Bylaws Draft</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center gap-3">
                  <span className="text-emerald-500">✓</span>
                  <span className="text-xs text-slate-300">Cap Table (JSON)</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center gap-3">
                  <span className="text-emerald-500">✓</span>
                  <span className="text-xs text-slate-300">Governance Rules</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center gap-3">
                  <span className="text-emerald-500">✓</span>
                  <span className="text-xs text-slate-300">KYC/AML Policy</span>
              </div>
          </div>
      </div>

      <ConfirmationDialog 
          isOpen={showConfirm}
          onClose={() => setShowConfirm(false)}
          onConfirm={executeAction}
          title="Transmit Legal Package"
          message={`You are about to securely transmit sensitive corporate data to ${pendingProvider?.name}. This will initiate the formal onboarding process. Do you wish to proceed?`}
          confirmText="Transmit Data"
          variant="info"
      />

    </div>
  );
};
