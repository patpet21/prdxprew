
import React from 'react';
import { Input } from '../../../../components/ui/Input';
import { Select } from '../../../../components/ui/Select';
import { Button } from '../../../../components/ui/Button';
import { PropertyDatabaseSchema } from '../../../../types';

interface Props {
  property: PropertyDatabaseSchema;
  updateProp: (field: string, val: any) => void;
  onNext: () => void;
}

export const PhysicalSpecsTab: React.FC<Props> = ({ property, updateProp, onNext }) => {
  const type = property.property_type || 'Residential';
  
  let metricLabel = "Interior Size (m²)";
  if (type === 'Land') metricLabel = "Land Area (m² / acres)";
  if (type === 'Hospitality') metricLabel = "Total Guests / Beds";

  let unitsLabel = "Total Units";
  if (type === 'Hospitality') unitsLabel = "Total Rooms";
  if (type === 'Land') unitsLabel = "Sub-divisible Lots";

  return (
    <div className="space-y-6 animate-fadeIn">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <Input 
                    id="metric" label={metricLabel} type="number"
                    placeholder="e.g. 4200"
                    value={property.interior_size_sqm || ''} onChange={e => updateProp('interior_size_sqm', parseFloat(e.target.value))}
                />

                <Input 
                    id="units" label={unitsLabel} type="number"
                    placeholder="e.g. 40"
                    value={property.total_units || ''} onChange={e => updateProp('total_units', parseInt(e.target.value))}
                />

                <div className="md:col-span-2">
                    <Select 
                        id="condition" label="Current Condition"
                        options={[
                            {value: 'New', label: 'New Construction / Mint'},
                            {value: 'Good', label: 'Good Condition'},
                            {value: 'Renovate', label: 'Needs Renovation'},
                            {value: 'Raw', label: 'Raw Land / Shell'}
                        ]}
                        value={property.renovated_status || ''} onChange={e => updateProp('renovated_status', e.target.value)}
                    />
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
