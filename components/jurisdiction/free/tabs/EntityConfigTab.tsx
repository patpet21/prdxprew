import React, { useState } from 'react';
import { JurisdictionData } from '../../../../types';
import { Button } from '../../../ui/Button';
import { Input } from '../../../ui/Input';
import { generateEntityDetails } from '../../../../services/mockAiService';

interface Props {
  jurisdiction: JurisdictionData;
  assetName: string;
  updateData: (field: string, val: any) => void;
  onNext: () => void;
}

export const EntityConfigTab: React.FC<Props> = ({ jurisdiction, assetName, updateData, onNext }) => {
  const { entityDetails } = jurisdiction;
  const [isAutoFilling, setIsAutoFilling] = useState(false);

  const handleAutoFill = async () => {
      setIsAutoFilling(true);
      const details = await generateEntityDetails(
          jurisdiction.country, 
          entityDetails.registrationState || jurisdiction.country, 
          jurisdiction.spvType, 
          assetName
      );
      if (details) {
          updateData('entityDetails', { ...entityDetails, ...details });
      }
      setIsAutoFilling(false);
  };

  const handleChange = (field: string, val: any) => {
      updateData('entityDetails', { ...entityDetails, [field]: val });
  };

  const handleDirectorAdd = (name: string) => {
      if(!name) return;
      handleChange('directors', [...(entityDetails.directors || []), name]);
  };

  const handleDirectorRemove = (idx: number) => {
      const newDirs = [...(entityDetails.directors || [])];
      newDirs.splice(idx, 1);
      handleChange('directors', newDirs);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-900">Entity Configuration</h3>
                <Button size="sm" onClick={handleAutoFill} isLoading={isAutoFilling} variant="secondary">
                    ✨ Auto-Fill with AI
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input 
                    id="compName" label="Company Name"
                    value={entityDetails.companyName} onChange={e => handleChange('companyName', e.target.value)}
                    placeholder="e.g. Asset HoldCo LLC"
                />
                <Input 
                    id="agent" label="Formation Agent"
                    value={entityDetails.formationAgent || ''} onChange={e => handleChange('formationAgent', e.target.value)}
                    placeholder="e.g. Corporate Services Inc."
                />
                <Input 
                    id="address" label="Registered Address"
                    value={entityDetails.registeredAddress} onChange={e => handleChange('registeredAddress', e.target.value)}
                    className="md:col-span-2"
                />
                
                <div className="md:col-span-2">
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-2 ml-1">Directors / Managers</label>
                    <div className="flex flex-wrap gap-2 mb-2 p-2 bg-slate-50 rounded-xl border border-slate-200 min-h-[50px]">
                        {(entityDetails.directors || []).map((d, i) => (
                            <span key={i} className="bg-white px-3 py-1 rounded-lg border border-slate-200 text-sm font-medium flex items-center gap-2 text-slate-700 shadow-sm">
                                {d}
                                <button onClick={() => handleDirectorRemove(i)} className="text-red-400 hover:text-red-600">×</button>
                            </span>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <input 
                            id="dirInput"
                            type="text" 
                            placeholder="Add Director Name" 
                            className="flex-1 p-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                            onKeyDown={e => {
                                if (e.key === 'Enter') {
                                    handleDirectorAdd((e.target as HTMLInputElement).value);
                                    (e.target as HTMLInputElement).value = '';
                                }
                            }}
                        />
                        <Button onClick={() => {
                            const el = document.getElementById('dirInput') as HTMLInputElement;
                            handleDirectorAdd(el.value);
                            el.value = '';
                        }} variant="secondary">Add</Button>
                    </div>
                </div>

                <Input 
                    id="cap" label="Share Capital" type="number"
                    value={entityDetails.shareCapital || ''} onChange={e => handleChange('shareCapital', parseFloat(e.target.value))}
                />
            </div>
        </div>

        <div className="flex justify-end pt-4">
             <Button 
                onClick={onNext}
                className="bg-slate-900 text-white hover:bg-slate-800 px-8 py-3 rounded-xl font-bold shadow-lg"
             >
                Save & Generate Report →
             </Button>
        </div>
    </div>
  );
};