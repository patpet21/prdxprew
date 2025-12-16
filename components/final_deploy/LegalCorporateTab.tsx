
import React from 'react';
import { DeploymentData } from '../../types';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';

interface Props {
  deployment: DeploymentData;
  updateDeployment: (field: keyof DeploymentData, value: any) => void;
}

export const LegalCorporateTab: React.FC<Props> = ({ deployment, updateDeployment }) => {
  const { legal } = deployment;

  const updateLegal = (field: string, val: any) => {
    updateDeployment('legal', { ...legal, [field]: val });
  };

  const updateDocStatus = (doc: keyof typeof legal.documentsStatus, status: any) => {
      updateDeployment('legal', { 
          ...legal, 
          documentsStatus: { ...legal.documentsStatus, [doc]: status }
      });
  }

  return (
    <div className="space-y-8 animate-fadeIn">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Entity & Structure</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input 
                    id="spvName" 
                    label="SPV Legal Name" 
                    value={legal.spvName} 
                    onChange={(e) => updateLegal('spvName', e.target.value)}
                    placeholder="e.g. Project Alpha LLC"
                />
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Incorporation Status</label>
                    <select 
                        value={legal.status}
                        onChange={(e) => updateLegal('status', e.target.value)}
                        className="w-full p-3 border border-slate-200 rounded-xl outline-none bg-white"
                    >
                        <option value="Pending">Pending Filing</option>
                        <option value="Ready">Incorporated (Ready)</option>
                    </select>
                </div>
            </div>
        </div>

        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Document Readiness</h3>
            <div className="space-y-4">
                {[
                    { key: 'termSheet', label: 'Term Sheet' },
                    { key: 'offeringMemo', label: 'Offering Memorandum (OM)' },
                    { key: 'operatingAgreement', label: 'Operating Agreement' }
                ].map((doc) => (
                    <div key={doc.key} className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                        <span className="text-sm font-medium text-slate-700">{doc.label}</span>
                        <div className="flex gap-2">
                            {['Pending', 'Draft', 'Ready'].map(status => (
                                <button
                                    key={status}
                                    onClick={() => updateDocStatus(doc.key as any, status)}
                                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all border ${
                                        legal.documentsStatus[doc.key as keyof typeof legal.documentsStatus] === status
                                            ? status === 'Ready' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' 
                                            : status === 'Draft' ? 'bg-amber-100 text-amber-700 border-amber-200'
                                            : 'bg-slate-100 text-slate-600 border-slate-200'
                                            : 'bg-transparent text-slate-400 border-transparent hover:bg-slate-50'
                                    }`}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
};
