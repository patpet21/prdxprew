
import React, { useState } from 'react';
import { Button } from '../ui/Button';

type Category = 'ISSUANCE' | 'CUSTODY' | 'KYC';

const PROVIDERS_DATA = {
  ISSUANCE: [
    {
      id: 1,
      name: "TokenForge",
      compatibility: 95,
      reason: "Implementa ERC-3643 + compliance on-chain. Cap table dinamica e KYC integrato di default.",
      status: "locked"
    },
    {
      id: 2,
      name: "Blocksquare",
      compatibility: 87,
      reason: "Modello standardizzato per asset immobiliari. Token + SPV anchoring system. Perfect match per residenziale/commerciale.",
      status: "locked"
    }
  ],
  CUSTODY: [
    {
      id: 3,
      name: "CustodyX",
      compatibility: 92,
      reason: "Supporta token ERC-3643 e security tokens. Custodia segregata per asset immobiliari tokenizzati.",
      status: "locked"
    },
    {
      id: 4,
      name: "SafeCustodial",
      compatibility: 81,
      reason: "Offre escrow per fundraising immobiliari. Automazione dividendi e rimborsi. Custodia istituzionale (SOC2).",
      status: "locked"
    }
  ],
  KYC: [
    {
      id: 5,
      name: "IdentiSafe Global",
      compatibility: 89,
      reason: "Verifica automatica AML per 180+ paesi. Accredition check USA (Reg D) e UBO verification.",
      status: "locked"
    },
    {
      id: 6,
      name: "Verify365",
      compatibility: 82,
      reason: "Perfetto per onboarding investitori retail. Monitoring AML continuo e integrazione via API.",
      status: "locked"
    }
  ]
};

export const ProviderUnlockTab: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<Category>('ISSUANCE');

  return (
    <div className="animate-fadeIn space-y-8">
      
      {/* Category Navigation */}
      <div className="flex justify-center mb-6">
         <div className="inline-flex bg-slate-100 p-1 rounded-xl">
            {(['ISSUANCE', 'CUSTODY', 'KYC'] as Category[]).map(cat => (
                <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                        activeCategory === cat 
                        ? 'bg-slate-900 text-white shadow-md' 
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                >
                    {cat === 'ISSUANCE' ? 'Issuance' : cat === 'CUSTODY' ? 'Custody' : 'KYC / AML'}
                </button>
            ))}
         </div>
      </div>

      {/* Provider Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PROVIDERS_DATA[activeCategory].map((provider) => (
              <div key={provider.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xl relative overflow-hidden group">
                  
                  {/* Blurring Overlay */}
                  <div className="absolute top-6 left-6 z-20">
                      <div className="w-12 h-12 bg-slate-200 rounded-lg animate-pulse"></div>
                  </div>
                  <div className="absolute top-6 left-20 z-20">
                      <div className="h-6 w-32 bg-slate-200 rounded animate-pulse mb-2"></div>
                      <div className="h-4 w-20 bg-slate-100 rounded"></div>
                  </div>

                  {/* Header (Blurred Content) */}
                  <div className="flex items-start justify-between mb-6 filter blur-[6px] opacity-50 select-none pointer-events-none">
                      <div className="flex gap-4">
                          <div className="w-12 h-12 bg-indigo-100 rounded-lg"></div>
                          <div>
                              <h4 className="text-lg font-bold text-slate-900">{provider.name}</h4>
                              <p className="text-xs text-slate-500">Enterprise Solution</p>
                          </div>
                      </div>
                  </div>

                  {/* Visible Metrics */}
                  <div className="relative z-10 space-y-4">
                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                          <span className="text-xs font-bold text-slate-500 uppercase">Compatibilità</span>
                          <span className={`text-xl font-bold ${provider.compatibility > 90 ? 'text-emerald-500' : 'text-amber-500'}`}>
                              {provider.compatibility}%
                          </span>
                      </div>

                      <div>
                          <h5 className="text-[10px] font-bold text-slate-400 uppercase mb-2">Perché è consigliato</h5>
                          <p className="text-sm text-slate-600 leading-relaxed">
                              {provider.reason}
                          </p>
                      </div>

                      <div className="pt-4 mt-4 border-t border-slate-100">
                          <Button className="w-full bg-slate-900 text-white hover:bg-slate-800 flex items-center justify-center gap-2 shadow-lg">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                              Unlock in PRO
                          </Button>
                      </div>
                  </div>
              </div>
          ))}
      </div>

      {/* Persuasive Footer */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-900 rounded-2xl p-8 text-center text-white shadow-2xl border border-indigo-500/30">
          <h3 className="text-xl font-bold mb-3 font-display">Pronto per il mercato reale?</h3>
          <p className="text-indigo-200 text-sm max-w-2xl mx-auto leading-relaxed mb-6">
              In base alla tua struttura legale, alla giurisdizione e al modello token scelto, questi sono i provider più compatibili per portare il tuo progetto sul mercato.
              <br/><br/>
              Con la <strong>PRO Version</strong> puoi avviare la procedura completa: deploy dello smart contract, apertura KYC investitori, configurazione della custodia e integrazione marketplace.
          </p>
          <Button className="px-10 py-3 bg-white text-indigo-900 hover:bg-indigo-50 font-bold shadow-xl">
              Sblocca Partners & Deploy
          </Button>
      </div>

    </div>
  );
};
