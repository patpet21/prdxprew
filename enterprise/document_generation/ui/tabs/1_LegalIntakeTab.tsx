
import React from 'react';
import { LegalProjectData } from '../../domain/legal_engineering.entity';

interface Props {
  data: LegalProjectData;
  updateData: (updates: Partial<LegalProjectData>) => void;
}

export const LegalIntakeTab: React.FC<Props> = ({ data, updateData }) => {
  return (
    <div className="space-y-8 animate-fadeIn">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">📝</span>
                <div>
                    <h3 className="text-xl font-bold text-white">Project Legal Context</h3>
                    <p className="text-slate-400 text-sm">Define the governing parameters for the document engine.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-3">Applicable Law</label>
                    <select 
                        value={data.governingLaw}
                        onChange={(e) => updateData({ governingLaw: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                    >
                        <option value="Delaware">State of Delaware (US)</option>
                        <option value="New York">State of New York (US)</option>
                        <option value="England & Wales">England & Wales (UK)</option>
                        <option value="Italy">Italy (Civil Law)</option>
                        <option value="DIFC">DIFC (UAE Common Law)</option>
                        <option value="Singapore">Singapore</option>
                    </select>
                </div>

                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-3">Dispute Resolution</label>
                    <select 
                        value={data.disputeResolution}
                        onChange={(e) => updateData({ disputeResolution: e.target.value as any })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                    >
                        <option value="Arbitration">International Arbitration (Recommended)</option>
                        <option value="Court">Local Courts Litigation</option>
                        <option value="Smart Contract DAO">On-Chain DAO Resolution (Experimental)</option>
                    </select>
                </div>

                <div className="md:col-span-2">
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-3">Key Investor Rights</label>
                    <div className="flex flex-wrap gap-3">
                        {['Pro-rata Rights', 'Information Rights', 'Tag-Along', 'Drag-Along', 'Liquidation Preference', 'Board Seat'].map(right => {
                            const active = data.investorRights.includes(right);
                            return (
                                <button
                                    key={right}
                                    onClick={() => {
                                        const newRights = active 
                                            ? data.investorRights.filter(r => r !== right)
                                            : [...data.investorRights, right];
                                        updateData({ investorRights: newRights });
                                    }}
                                    className={`px-4 py-2 rounded-lg text-sm font-bold border transition-all ${
                                        active 
                                            ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg' 
                                            : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-500'
                                    }`}
                                >
                                    {right}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};
