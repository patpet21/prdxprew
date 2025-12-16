import React, { useState } from 'react';
import { Button } from '../../../ui/Button';
import { PropertyDatabaseSchema } from '../../../../types';
import { refineAssetDescription } from '../../../../services/mockAiService';

interface Props {
  property: PropertyDatabaseSchema;
  updateProp: (field: string, val: any) => void;
  onNext: () => void;
}

export const AiDescriptionTab: React.FC<Props> = ({ property, updateProp, onNext }) => {
  const [isRefining, setIsRefining] = useState(false);

  const handleRefine = async () => {
      if (!property.description) return;
      setIsRefining(true);
      const polished = await refineAssetDescription(property.description, property.property_type, property.title);
      updateProp('description', polished);
      setIsRefining(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
        <div className="bg-white p-6 rounded-xl border border-sim-border shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <label className="text-xs font-bold text-slate-500 uppercase">Project Description & Strategy</label>
                <Button 
                    size="sm" 
                    onClick={handleRefine} 
                    isLoading={isRefining}
                    disabled={!property.description || property.description.length < 10}
                    className="bg-sim-ai hover:bg-purple-600 text-white text-xs"
                >
                    {isRefining ? 'Polishing...' : '✨ Improve with AI'}
                </Button>
            </div>
            
            <textarea 
                value={property.description}
                onChange={e => updateProp('description', e.target.value)}
                className="w-full h-64 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none leading-relaxed text-slate-700"
                placeholder="Describe the asset, the business model, and why it is interesting for investors..."
            />
            
            <p className="text-xs text-slate-400 mt-2">
                The AI will rewrite your draft into a professional institutional format suitable for a pitch deck.
            </p>
        </div>

        <div className="flex justify-end pt-6">
            <Button variant="sim" onClick={onNext} className="shadow-lg px-8 py-3">
                Save & Next →
            </Button>
        </div>
    </div>
  );
};