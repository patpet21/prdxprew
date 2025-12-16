
import React from 'react';
import { Input } from '../../../../components/ui/Input';
import { Button } from '../../../../components/ui/Button';
import { PropertyDatabaseSchema } from '../../../../types';

interface Props {
  property: PropertyDatabaseSchema;
  updateProp: (field: string, val: any) => void;
  onNext: () => void;
}

export const PartnersTeamTab: React.FC<Props> = ({ property, updateProp, onNext }) => {
  return (
    <div className="space-y-6 animate-fadeIn">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="grid grid-cols-1 gap-6">
                <Input 
                    id="sponsor" label="Sponsor / Developer" 
                    placeholder="e.g. ABC Development LLC"
                    value={property.sponsor || ''} onChange={e => updateProp('sponsor', e.target.value)}
                />
                
                <Input 
                    id="partners" label="Key Partners (Optional)" 
                    placeholder="Architect, Construction Firm, Property Manager..."
                    value={property.property_manager || ''} onChange={e => updateProp('property_manager', e.target.value)}
                />
                
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-2 ml-1">Experience Highlight</label>
                    <textarea 
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 outline-none focus:ring-2 focus:ring-brand-500 transition-all h-24 resize-none"
                        placeholder='e.g. "20+ years in sector, $150M AUM, 10 exits."'
                        // Mapping to a generic description field if no specific field exists, using a placeholder logic for now.
                        // Ideally this would be a specific field like 'experience_summary' in the DB.
                    />
                    <p className="text-[10px] text-slate-400 mt-1 ml-1">Brief credibility statement for the pitch deck.</p>
                </div>
            </div>
        </div>

        <div className="flex justify-end pt-6">
            <Button onClick={onNext} className="bg-slate-900 text-white hover:bg-slate-800 shadow-lg px-8 py-3">
                Save & Next →
            </Button>
        </div>
    </div>
  );
};
