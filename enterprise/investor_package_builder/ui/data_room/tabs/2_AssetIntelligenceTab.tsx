
import React, { useState } from 'react';
import { DataRoomProject } from '../../../domain/data_room.entity';
import { Button } from '../../../../../../components/ui/Button';
import { dataRoomService } from '../../../services/data_room_service';

interface Props {
  data: DataRoomProject;
  update: (field: keyof DataRoomProject, val: any) => void;
}

export const AssetIntelligenceTab: React.FC<Props> = ({ data, update }) => {
  const { asset, overview } = data;
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const runAnalysis = async () => {
      setIsAnalyzing(true);
      const result = await dataRoomService.generateAssetIntelligence({ 
          assetType: overview.assetType, 
          location: asset.location,
          assetCondition: asset.assetCondition 
      });
      
      update('asset', { 
          ...asset, 
          description: result?.technicalDescription || '',
          marketHighlights: result?.marketHighlights || []
      });
      setIsAnalyzing(false);
  };

  const highlights = asset?.marketHighlights || [];

  return (
    <div className="animate-fadeIn space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Config Column */}
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 space-y-6">
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Location / Address</label>
                    <input 
                        value={asset.location}
                        onChange={e => update('asset', {...asset, location: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white outline-none"
                        placeholder="e.g. 123 Wall St, NY"
                    />
                </div>
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Asset Stage</label>
                    <select 
                        value={asset.assetCondition}
                        onChange={e => update('asset', {...asset, assetCondition: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white outline-none"
                    >
                        <option>Stabilized</option>
                        <option>Value Add</option>
                        <option>Ground Up</option>
                    </select>
                </div>
                <Button onClick={runAnalysis} isLoading={isAnalyzing} className="w-full bg-indigo-600">
                    Generate Intelligence
                </Button>
            </div>

            {/* AI Output Column */}
            <div className="lg:col-span-2 space-y-6">
                <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                    <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-4">Technical Description</h4>
                    <textarea 
                        value={asset.description}
                        onChange={e => update('asset', {...asset, description: e.target.value})}
                        className="w-full h-40 bg-slate-950 border border-slate-700 rounded-lg p-4 text-slate-300 text-sm leading-relaxed outline-none resize-none"
                        placeholder="AI will generate a professional asset description here..."
                    />
                </div>

                <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                    <h4 className="text-sm font-bold text-emerald-400 uppercase tracking-widest mb-4">Market Highlights</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {(highlights.length > 0 ? highlights : ['Pending Analysis', 'Pending Analysis', 'Pending Analysis']).map((hl, i) => (
                            <div key={i} className="p-3 bg-emerald-900/20 border border-emerald-500/30 rounded-lg">
                                <span className="text-emerald-500 font-bold block mb-1">0{i+1}</span>
                                <p className="text-xs text-emerald-100">{hl}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};
