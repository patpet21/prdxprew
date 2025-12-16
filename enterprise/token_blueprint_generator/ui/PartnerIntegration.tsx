
import React, { useState } from 'react';
import { TOKENIZATION_PARTNERS, TokenizationPartner } from '../data/tokenization_partners';
import { Button } from '../../../components/ui/Button';

interface Props {
  jurisdictionCode: string; // e.g. "IT", "US-DE"
  onSelectPartner: (partner: TokenizationPartner) => void;
  onProvideLater: () => void; // NEW PROP
}

export const PartnerIntegration: React.FC<Props> = ({ jurisdictionCode, onSelectPartner, onProvideLater }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Determine region based on jurisdiction code
  const getRegion = (code: string) => {
    if (code.startsWith('US')) return 'US';
    if (['IT', 'DE', 'FR', 'ES', 'EE', 'LT', 'MT'].includes(code)) return 'EU';
    return 'Global';
  };

  const region = getRegion(jurisdictionCode);
  
  // Filter partners
  const recommendedPartners = TOKENIZATION_PARTNERS.filter(p => 
    p.regions.includes(region as any) || p.regions.includes('Global')
  );

  const activePartner = TOKENIZATION_PARTNERS.find(p => p.id === selectedId);

  return (
    <div className="h-full flex flex-col animate-fadeIn space-y-8 pb-12">
      
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-white font-display">Partner Network</h2>
          <p className="text-slate-400 text-sm mt-1">
            Showing providers authorized for <strong>{jurisdictionCode} ({region})</strong>.
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendedPartners.map(partner => {
          const isSelected = selectedId === partner.id;
          return (
            <div 
              key={partner.id}
              onClick={() => setSelectedId(partner.id)}
              className={`
                relative p-6 rounded-2xl border-2 cursor-pointer transition-all group flex flex-col
                ${isSelected 
                  ? 'bg-blue-900/20 border-blue-500 shadow-xl shadow-blue-900/20' 
                  : 'bg-slate-900 border-slate-800 hover:border-slate-600 hover:bg-slate-800'
                }
              `}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="text-4xl">{partner.logo}</div>
                {isSelected && (
                  <div className="bg-blue-500 text-white p-1 rounded-full shadow-lg">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  </div>
                )}
              </div>
              
              <h3 className="text-lg font-bold text-white mb-1">{partner.name}</h3>
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] text-slate-300 font-bold uppercase">
                   {partner.type}
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] text-slate-300 font-bold uppercase">
                   Min {partner.minAssetValue}
                </span>
              </div>
              
              <p className="text-xs text-slate-400 leading-relaxed mb-4 flex-1">
                {partner.description}
              </p>

              <div className="pt-4 border-t border-slate-700/50">
                <p className="text-[10px] text-blue-400 font-bold uppercase mb-1">License Framework</p>
                <p className="text-xs text-white">{partner.license}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Integration Details (Bottom Panel) */}
      {activePartner && (
        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 animate-slideUp">
           <div className="flex flex-col md:flex-row gap-8">
              
              <div className="flex-1">
                 <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                   <span>🚀</span> Integration Roadmap
                 </h3>
                 <div className="space-y-4">
                    {activePartner.integrationSteps.map((step, i) => (
                      <div key={i} className="flex gap-4 items-center p-3 bg-slate-950/50 rounded-xl border border-slate-800">
                         <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-500 font-bold text-xs border border-slate-700">
                           {i+1}
                         </div>
                         <span className="text-sm text-slate-300">{step}</span>
                      </div>
                    ))}
                 </div>
              </div>

              <div className="w-full md:w-80 bg-slate-950 p-6 rounded-xl border border-slate-800 flex flex-col justify-between">
                 <div>
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Next Step</h4>
                    <p className="text-sm text-white mb-6">
                      To proceed with <strong>{activePartner.name}</strong>, you need to configure their specific requirements.
                    </p>
                 </div>
                 <Button 
                   onClick={() => onSelectPartner(activePartner)}
                   className="w-full bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20"
                 >
                   Configure {activePartner.name}
                 </Button>
              </div>

           </div>
        </div>
      )}
      
      {/* Provide Later Option */}
      <div className="text-center pt-8 border-t border-slate-800">
          <p className="text-slate-500 text-sm mb-3">Not ready to commit to a partner?</p>
          <button 
            onClick={onProvideLater}
            className="text-slate-400 hover:text-white font-bold text-sm underline underline-offset-4 decoration-slate-600 hover:decoration-white transition-all"
          >
              Provide Data / Partner Details Later (Generic RFP)
          </button>
      </div>

    </div>
  );
};
