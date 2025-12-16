
import React, { useEffect, useState } from 'react';
import { StepProps } from '../../../types';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { AssetAiPanel } from '../../../components/asset/AssetAiPanel';
import { autoFillAssetGeneral, getAssetAdvice, estimateAssetSpecs } from '../../../services/mockAiService';

export const Ent_AssetStep: React.FC<StepProps> = ({ data, updateData, onValidationChange }) => {
  const { property, projectInfo } = data;
  const [isAutoFillingGeneral, setIsAutoFillingGeneral] = useState(false);
  const [isAutoFillingSpecs, setIsAutoFillingSpecs] = useState(false);
  const [isAdvising, setIsAdvising] = useState(false);
  const [adviceResult, setAdviceResult] = useState<{ title: string, items: string[] } | null>(null);

  useEffect(() => {
    const hasBasic = Boolean(property.title && property.total_value > 0);
    onValidationChange(hasBasic);
  }, [property, onValidationChange]);

  const updateProp = (field: string, val: any) => updateData('property', { [field]: val });

  const handleAutoFillGeneral = async () => {
      setIsAutoFillingGeneral(true);
      // Cast to any because the mock service currently returns {} which causes type errors
      const result = await autoFillAssetGeneral(projectInfo, property.category) as any;
      if (result) {
          if(result.assetName) updateProp('title', result.assetName);
          if(result.valuation) updateProp('total_value', result.valuation);
          if(result.assetType) updateProp('asset_type', result.assetType);
          if(result.sqft) updateProp('interior_size_sqm', result.sqft);
          if(result.address) updateProp('address', result.address);
          if(result.description && !property.description) updateProp('description', result.description);
      }
      setIsAutoFillingGeneral(false);
  };

  const handleAutoFillSpecs = async () => {
      setIsAutoFillingSpecs(true);
      const result = await estimateAssetSpecs(property.category, property.asset_type || 'General', property.total_value);
      if (result) {
          updateProp('construction_year', result.construction_year);
          updateProp('total_units', result.total_units);
          updateProp('interior_size_sqm', result.interior_size_sqm);
          updateProp('building_class', result.building_class);
      }
      setIsAutoFillingSpecs(false);
  };

  const handleGetAdvice = async () => {
      if (!property.asset_type || !property.location) return;
      setIsAdvising(true);
      const result = await getAssetAdvice(property.category, property.asset_type, property.location);
      if (result) {
          setAdviceResult({
              title: `Strategic Tips for ${property.asset_type}`,
              items: [
                  `Valuation: ${result.valuationTip}`,
                  `Risk: ${result.riskWarning}`,
                  `Renovation: ${result.renovationAdvice}`
              ]
          });
      }
      setIsAdvising(false);
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12 text-white">
      <div>
           <h2 className="text-3xl font-bold font-display text-white">Asset Details & Specs</h2>
           <p className="text-slate-400">Define the physical characteristics, location, and value.</p>
      </div>

      <AssetAiPanel 
          title="Auto-Fill General Info"
          description="Extract details from your Project Vision."
          buttonText="✨ Auto-Fill"
          variant="autofill"
          isLoading={isAutoFillingGeneral}
          onAction={handleAutoFillGeneral}
      />

      <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-sm relative">
            <h3 className="font-bold text-slate-300 text-lg mb-6">Identification</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input 
                    id="title" label="Asset Title / Name" 
                    value={property.title} onChange={e => updateProp('title', e.target.value)}
                    className="md:col-span-2 bg-slate-950 border-slate-700 text-white"
                    placeholder="e.g. Progetto Como"
                />
                
                <Select 
                    id="ptype" label="Property Type"
                    options={[
                        {value: 'Residenziale', label: 'Residential'},
                        {value: 'Commerciale', label: 'Commercial'},
                        {value: 'Industriale', label: 'Industrial'},
                    ]}
                    value={property.property_type || ''} onChange={e => updateProp('property_type', e.target.value)}
                    className="bg-slate-950 border-slate-700 text-white"
                />

                <Input 
                    id="val" label="Total Asset Value (EUR)" type="number"
                    value={property.total_value || ''} onChange={e => updateProp('total_value', parseFloat(e.target.value))}
                    className="bg-slate-950 border-slate-700 text-white"
                />
            </div>
      </div>

      <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-sm">
            <div className="flex justify-between items-center mb-6">
                 <h3 className="font-bold text-slate-300 text-lg">Physical Specs</h3>
                 <button onClick={handleAutoFillSpecs} disabled={isAutoFillingSpecs} className="text-xs text-emerald-400 font-bold hover:text-emerald-300">
                    {isAutoFillingSpecs ? 'Estimating...' : '✨ Estimate with AI'}
                 </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Input 
                    id="year" label="Construction Year" type="number"
                    value={property.construction_year || ''} onChange={e => updateProp('construction_year', parseInt(e.target.value))}
                    className="bg-slate-950 border-slate-700 text-white"
                />
                <Input 
                    id="units" label="Total Units" type="number"
                    value={property.total_units || ''} onChange={e => updateProp('total_units', parseInt(e.target.value))}
                    className="bg-slate-950 border-slate-700 text-white"
                />
                <Input 
                    id="int_sqm" label="Interior Size (sqm)" type="number"
                    value={property.interior_size_sqm || ''} onChange={e => updateProp('interior_size_sqm', parseFloat(e.target.value))}
                    className="bg-slate-950 border-slate-700 text-white"
                />
            </div>
      </div>

       <AssetAiPanel 
            title="Strategic Advice"
            description="Ask AI for valuation drivers and risk factors."
            buttonText="Get Advice"
            variant="advice"
            isLoading={isAdvising}
            onAction={handleGetAdvice}
            result={adviceResult}
        />
    </div>
  );
};
