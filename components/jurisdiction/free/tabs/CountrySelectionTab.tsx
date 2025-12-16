import React, { useState } from 'react';
import { JurisdictionData, TokenizationCategory } from '../../../../types';
import { JURISDICTION_METADATA } from '../../../../content/jurisdictionContent';
import { JurisdictionGuidedFlow } from '../../JurisdictionGuidedFlow';
import { Button } from '../../../ui/Button';

interface Props {
  jurisdiction: JurisdictionData;
  category: TokenizationCategory;
  updateData: (field: string, val: any) => void;
  onNext: () => void;
}

export const CountrySelectionTab: React.FC<Props> = ({ jurisdiction, category, updateData, onNext }) => {

  const handleGuidedSelect = (code: string) => {
    const countryCode = code.split('-')[0];
    updateData('country', countryCode);
    updateData('spvType', ''); 
    
    // Pre-map region if specific code provided
    if (code.includes('-')) {
        const map: Record<string, string> = { 'US-DE': 'Delaware', 'US-WY': 'Wyoming', 'AE-DIFC': 'DIFC' };
        if (map[code]) {
            updateData('entityDetails', { ...jurisdiction.entityDetails, registrationState: map[code] });
        }
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
        <div className="bg-white p-6 rounded-2xl border border-sim-border shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Select Country</h3>
            
            {/* Guided Flow */}
            <JurisdictionGuidedFlow onSelect={handleGuidedSelect} />

            <div className="mt-8">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Manual Selection</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {JURISDICTION_METADATA.map(meta => (
                        <button
                            key={meta.code}
                            onClick={() => {
                                updateData('country', meta.code);
                                updateData('spvType', '');
                            }}
                            className={`
                                relative p-4 rounded-xl border-2 transition-all duration-300 group text-left flex flex-col items-center justify-center
                                ${jurisdiction.country === meta.code 
                                    ? 'bg-slate-900 border-slate-900 shadow-xl z-10 scale-105' 
                                    : 'bg-white border-slate-100 hover:border-brand-400 hover:shadow-lg'
                                }
                            `}
                        >
                            <span className="text-3xl mb-2">{meta.flag}</span>
                            <span className={`font-bold text-sm ${jurisdiction.country === meta.code ? 'text-white' : 'text-slate-900'}`}>{meta.name}</span>
                            {jurisdiction.country === meta.code && <div className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full"></div>}
                        </button>
                    ))}
                </div>
            </div>
        </div>
        
        <div className="flex justify-end pt-4">
             <Button 
                variant="sim"
                onClick={onNext}
                disabled={!jurisdiction.country}
                className="px-8 py-3 rounded-xl font-bold shadow-lg"
             >
                Save & Next: Region →
             </Button>
        </div>
    </div>
  );
};