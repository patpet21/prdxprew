
import React from 'react';
import { DataRoomProject } from '../../../domain/data_room.entity';
import { Input } from '../../../../../../components/ui/Input';
import { Select } from '../../../../../../components/ui/Select';

interface Props {
  data: DataRoomProject;
  update: (field: keyof DataRoomProject, val: any) => void;
}

export const DealOverviewTab: React.FC<Props> = ({ data, update }) => {
  const { overview } = data;

  const handleChange = (f: string, v: any) => {
    update('overview', { ...overview, [f]: v });
  };

  return (
    <div className="animate-fadeIn space-y-8">
        <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl">📋</span>
                <div>
                    <h3 className="text-xl font-bold text-white">Deal Configuration</h3>
                    <p className="text-slate-400 text-sm">Set the fundamental parameters for the Investor Package.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Deal Name</label>
                    <input 
                        value={overview.dealName}
                        onChange={e => handleChange('dealName', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:border-indigo-500 outline-none"
                        placeholder="e.g. Project Alpha Tower"
                    />
                </div>
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Asset Category</label>
                    <select 
                        value={overview.assetType}
                        onChange={e => handleChange('assetType', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:border-indigo-500 outline-none"
                    >
                        <option>Real Estate</option>
                        <option>Corporate Equity</option>
                        <option>Private Debt</option>
                        <option>Infrastructure</option>
                    </select>
                </div>
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Primary Goal</label>
                    <select 
                        value={overview.dealGoal}
                        onChange={e => handleChange('dealGoal', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:border-indigo-500 outline-none"
                    >
                        <option>Capital Raise</option>
                        <option>Liquidity</option>
                        <option>Refinancing</option>
                    </select>
                </div>
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Target Raise ($)</label>
                    <input 
                        type="number"
                        value={overview.targetRaise}
                        onChange={e => handleChange('targetRaise', parseFloat(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:border-indigo-500 outline-none font-mono"
                        placeholder="0.00"
                    />
                </div>
                 <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Min Ticket ($)</label>
                    <input 
                        type="number"
                        value={overview.minTicket}
                        onChange={e => handleChange('minTicket', parseFloat(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:border-indigo-500 outline-none font-mono"
                    />
                </div>
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-2">SPV Structure</label>
                    <input 
                        value={overview.spvStructure}
                        onChange={e => handleChange('spvStructure', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:border-indigo-500 outline-none"
                        placeholder="e.g. Delaware Series LLC"
                    />
                </div>
            </div>
        </div>
    </div>
  );
};
