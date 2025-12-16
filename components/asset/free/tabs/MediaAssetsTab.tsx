
import React, { useState } from 'react';
import { Button } from '../../../ui/Button';
import { PropertyDatabaseSchema } from '../../../../types';
import { generateAssetImage } from '../../../../services/mockAiService';

interface Props {
  property: PropertyDatabaseSchema;
  updateProp: (field: string, val: any) => void;
  onNext: () => void;
}

export const MediaAssetsTab: React.FC<Props> = ({ property, updateProp, onNext }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
      setIsGenerating(true);
      const url = await generateAssetImage(property.property_type, property.location);
      updateProp('image_url', url);
      setIsGenerating(false);
  };

  const handlePlaceholder = () => {
      const url = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80"; // Generic Building
      updateProp('image_url', url);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 text-lg mb-6">Primary Cover Image</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Preview Area */}
                <div className="aspect-video bg-slate-100 rounded-xl border-2 border-dashed border-slate-300 flex items-center justify-center relative overflow-hidden group">
                    {property.image_url ? (
                        <>
                            <img src={property.image_url} alt="Asset" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => updateProp('image_url', '')} className="text-white text-xs font-bold uppercase border border-white px-3 py-1 rounded hover:bg-white hover:text-black">Remove</button>
                            </div>
                        </>
                    ) : (
                        <div className="text-slate-400 flex flex-col items-center">
                            <span className="text-4xl mb-2">🖼️</span>
                            <span className="text-sm">No Image Selected</span>
                        </div>
                    )}
                </div>

                {/* Controls */}
                <div className="flex flex-col justify-center gap-4">
                    <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
                        <div className="flex justify-between items-center mb-2">
                            <h5 className="font-bold text-indigo-900 text-sm">AI Generation</h5>
                            <span className="text-[10px] bg-white px-2 py-1 rounded text-indigo-600 font-bold uppercase">New</span>
                        </div>
                        <p className="text-xs text-indigo-700 mb-4">Create a photorealistic concept based on your location and asset type.</p>
                        <Button onClick={handleGenerate} isLoading={isGenerating} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white">
                            🎨 Generate Concept
                        </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                         <button 
                            className="py-3 border border-slate-300 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                            onClick={() => document.getElementById('upload-trigger')?.click()}
                         >
                             📁 Upload File
                         </button>
                         <button 
                            onClick={handlePlaceholder}
                            className="py-3 border border-slate-300 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                         >
                             🧩 Placeholder
                         </button>
                         {/* Mock hidden input */}
                         <input id="upload-trigger" type="file" className="hidden" onChange={() => alert("Upload simulation active.")} />
                    </div>
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
