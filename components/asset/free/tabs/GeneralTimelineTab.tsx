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

export const GeneralTimelineTab: React.FC<Props> = ({ property, updateProp, onNext }) => {
  return (
    <div className="space-y-6 animate-fadeIn">
        <div className="bg-white p-6 rounded-xl border border-sim-border shadow-sm">
            <h3 className="font-bold text-slate-900 text-lg mb-6">Core Identity</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input 
                    id="name" label="Asset Name" 
                    placeholder="e.g. Green Valley Resort & Spa"
                    value={property.title} onChange={e => updateProp('title', e.target.value)}
                    className="md:col-span-2"
                />
                
                <Select 
                    id="type" label="Asset Type"
                    options={[
                        {value: 'Residential', label: 'Residential'},
                        {value: 'Commercial', label: 'Commercial'},
                        {value: 'Mixed-Use', label: 'Mixed-Use'},
                        {value: 'Hospitality', label: 'Hospitality / Hotel'},
                        {value: 'Industrial', label: 'Industrial'},
                        {value: 'Land', label: 'Land / Development'},
                        {value: 'Other', label: 'Other'}
                    ]}
                    value={property.property_type || ''} onChange={e => updateProp('property_type', e.target.value)}
                />

                <Select 
                    id="stage" label="Project Stage"
                    options={[
                        {value: 'Existing asset', label: 'Stabilized / Existing'},
                        {value: 'Under renovation', label: 'Value-Add / Renovation'},
                        {value: 'Ground-up development', label: 'New Development'},
                        {value: 'Concept phase', label: 'Concept / Land Only'}
                    ]}
                    value={property.status === 'draft' ? '' : property.status} // Mapping simplified for UI
                    onChange={e => updateProp('status', e.target.value)}
                />
            </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-sim-border shadow-sm">
            <h3 className="font-bold text-slate-900 text-lg mb-6">Location</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input 
                    id="city" label="City" 
                    placeholder="e.g. New York"
                    value={property.city || ''} onChange={e => updateProp('city', e.target.value)}
                />
                <Input 
                    id="country" label="Country" 
                    placeholder="e.g. USA"
                    value={property.country || ''} onChange={e => updateProp('country', e.target.value)}
                />
            </div>
        </div>

        <div className="bg-slate-50 p-6 rounded-xl border border-sim-border">
            <h3 className="font-bold text-slate-900 text-lg mb-6">Timeline</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input 
                    id="start" label="Est. Start Date" type="date"
                    value={property.expected_start_date || ''} onChange={e => updateProp('expected_start_date', e.target.value)}
                />
                <Input 
                    id="end" label="Est. Stabilization / Completion" type="date"
                    value={property.completion_date || ''} onChange={e => updateProp('completion_date', e.target.value)}
                />
            </div>
        </div>

        <div className="flex justify-end pt-6">
            <Button variant="sim" onClick={onNext} className="shadow-lg px-8 py-3">
                Save & Next →
            </Button>
        </div>
    </div>
  );
};