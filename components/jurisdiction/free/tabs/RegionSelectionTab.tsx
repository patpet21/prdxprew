import React, { useState, useEffect } from 'react';
import { JurisdictionData, TokenizationCategory } from '../../../../types';
import { Button } from '../../../ui/Button';
import { getRegionRecommendations } from '../../../../services/mockAiService';
import { JURISDICTION_METADATA } from '../../../../content/jurisdictionContent';

interface Props {
  jurisdiction: JurisdictionData;
  category: TokenizationCategory;
  updateData: (field: string, val: any) => void;
  onNext: () => void;
}

export const RegionSelectionTab: React.FC<Props> = ({ jurisdiction, category, updateData, onNext }) => {
  const [regions, setRegions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const selectedMeta = JURISDICTION_METADATA.find(m => m.code === jurisdiction.country);

  useEffect(() => {
    if (jurisdiction.country) {
        setLoading(true);
        getRegionRecommendations(jurisdiction.country, category).then(res => {
            setRegions(res);
            setLoading(false);
        });
    }
  }, [jurisdiction.country, category]);

  return (
    <div className="space-y-8 animate-fadeIn">
        <div className="bg-white p-6 rounded-2xl border border-sim-border shadow-sm">
             <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">{selectedMeta?.flag}</span>
                <div>
                    <h3 className="text-xl font-bold text-slate-900">Select Domicile in {selectedMeta?.name}</h3>
                    <p className="text-sm text-slate-500">Where will the entity be registered?</p>
                </div>
             </div>

             {loading ? (
                 <div className="p-8 text-center text-slate-500 animate-pulse">Consulting legal database...</div>
             ) : (
                 <div className="space-y-6">
                     <div>
                         <label className="text-xs font-bold text-slate-400 uppercase block mb-3">AI Recommendations</label>
                         <div className="flex flex-wrap gap-3">
                             {regions.map(r => (
                                 <button
                                    key={r}
                                    onClick={() => updateData('entityDetails', { ...jurisdiction.entityDetails, registrationState: r })}
                                    className={`
                                        px-4 py-2 rounded-lg text-sm font-bold border transition-all
                                        ${jurisdiction.entityDetails.registrationState === r 
                                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' 
                                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-indigo-300'
                                        }
                                    `}
                                 >
                                     {r}
                                 </button>
                             ))}
                         </div>
                     </div>

                     <div>
                         <label className="text-xs font-bold text-slate-400 uppercase block mb-3">Or Type Custom</label>
                         <input 
                            type="text"
                            value={jurisdiction.entityDetails.registrationState || ''}
                            onChange={(e) => updateData('entityDetails', { ...jurisdiction.entityDetails, registrationState: e.target.value })}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="e.g. New York, Berlin, Zug..."
                         />
                     </div>
                 </div>
             )}
        </div>

        <div className="flex justify-end pt-4">
             <Button 
                variant="sim"
                onClick={onNext}
                disabled={!jurisdiction.entityDetails.registrationState}
                className="px-8 py-3 rounded-xl font-bold shadow-lg"
             >
                Save & Next: Structure →
             </Button>
        </div>
    </div>
  );
};