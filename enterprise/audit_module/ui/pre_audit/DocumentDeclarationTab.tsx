
import React from 'react';
import { AuditConfigEntity } from '../../domain/audit_config.entity';
import { Button } from '../../../../../components/ui/Button';

interface Props {
  config: AuditConfigEntity;
  updateConfig: (updates: Partial<AuditConfigEntity>) => void;
  onNext: () => void;
}

export const DocumentDeclarationTab: React.FC<Props> = ({ config, updateConfig, onNext }) => {
  const { documents } = config;

  const updateDocStatus = (id: string, status: 'uploaded' | 'missing' | 'declared') => {
      const updated = documents.map(d => d.id === id ? { ...d, status } : d);
      updateConfig({ documents: updated });
  };

  return (
    <div className="space-y-8 animate-fadeIn">
        <div className="flex justify-between items-end border-b border-slate-800 pb-6">
            <div>
                <h3 className="text-2xl font-bold text-white font-display mb-2">Data Room Verification</h3>
                <p className="text-slate-400 text-sm">
                    Ensure the following documents are present in the project index. 
                    The Audit Engine scans these for specific clauses.
                </p>
            </div>
        </div>

        <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
            <div className="grid grid-cols-12 bg-slate-950 p-4 text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-800">
                <div className="col-span-6">Document Name</div>
                <div className="col-span-3 text-center">Availability</div>
                <div className="col-span-3 text-right">Action</div>
            </div>
            
            <div className="divide-y divide-slate-800">
                {documents.map(doc => (
                    <div key={doc.id} className="grid grid-cols-12 p-4 items-center hover:bg-slate-800/50 transition-colors">
                        <div className="col-span-6 flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg ${doc.status === 'uploaded' ? 'bg-emerald-500/20 text-emerald-400' : doc.status === 'declared' ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-800 text-slate-600'}`}>
                                📄
                            </div>
                            <span className="text-sm font-medium text-white">{doc.name}</span>
                        </div>
                        
                        <div className="col-span-3 flex justify-center">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                                doc.status === 'uploaded' 
                                    ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-500/30' 
                                    : doc.status === 'declared' 
                                        ? 'bg-blue-900/30 text-blue-400 border border-blue-500/30'
                                        : 'bg-red-900/30 text-red-400 border border-red-500/30'
                            }`}>
                                {doc.status}
                            </span>
                        </div>

                        <div className="col-span-3 flex justify-end gap-2">
                            {doc.status === 'missing' ? (
                                <>
                                    <button 
                                        onClick={() => updateDocStatus(doc.id, 'uploaded')}
                                        className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded border border-slate-700"
                                    >
                                        Upload
                                    </button>
                                    <button 
                                        onClick={() => updateDocStatus(doc.id, 'declared')}
                                        className="text-xs text-blue-400 hover:text-blue-300 px-2"
                                    >
                                        Mark Exists
                                    </button>
                                </>
                            ) : (
                                <button 
                                    onClick={() => updateDocStatus(doc.id, 'missing')}
                                    className="text-xs text-slate-500 hover:text-slate-300"
                                >
                                    Reset
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 border-dashed flex items-center justify-center gap-4 text-slate-500 cursor-pointer hover:bg-slate-800 hover:text-slate-300 transition-colors">
            <span className="text-2xl">+</span>
            <span className="text-sm font-bold">Add Supplemental Document</span>
        </div>

        <div className="flex justify-end pt-6">
            <Button onClick={onNext} className="bg-blue-600 hover:bg-blue-500 text-white px-8">
                Save & Configure Risk Profile →
            </Button>
        </div>
    </div>
  );
};
