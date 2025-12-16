
import React, { useState, useEffect } from 'react';
import { GET_DOCUMENTS_FOR_JURISDICTION, SpvDocumentTemplate } from '../../data/document_logic';
import { Button } from '../../../../components/ui/Button';

interface Props {
  data: any;
  updateData: (field: string, val: any) => void;
}

type DocStatus = 'pending' | 'drafting' | 'uploaded' | 'verified';

interface DocState {
  id: string;
  status: DocStatus;
  file?: File | null;
}

export const EntDocumentToolsTab: React.FC<Props> = ({ data, updateData }) => {
  const jurisdiction = data.jurisdiction || {};
  const countryCode = jurisdiction.country || 'IT';
  
  const [docList, setDocList] = useState<SpvDocumentTemplate[]>([]);
  const [docStates, setDocStates] = useState<Record<string, DocState>>({});

  useEffect(() => {
      const templates = GET_DOCUMENTS_FOR_JURISDICTION(countryCode);
      setDocList(templates);
      
      // Initialize states if empty
      const initialStates: Record<string, DocState> = {};
      templates.forEach(doc => {
          initialStates[doc.id] = { id: doc.id, status: 'pending' };
      });
      setDocStates(initialStates);
  }, [countryCode]);

  const updateDocStatus = (id: string, status: DocStatus) => {
      setDocStates(prev => ({
          ...prev,
          [id]: { ...prev[id], status }
      }));
  };

  const handleUpload = (id: string) => {
      // Mock upload
      updateDocStatus(id, 'uploaded');
  };

  const getStatusColor = (status: DocStatus) => {
      switch(status) {
          case 'verified': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50';
          case 'uploaded': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
          case 'drafting': return 'bg-amber-500/20 text-amber-400 border-amber-500/50';
          default: return 'bg-slate-800 text-slate-500 border-slate-700';
      }
  };

  const progress = Object.values(docStates).filter((s: DocState) => s.status === 'uploaded' || s.status === 'verified').length;
  const total = docList.length;
  const percent = Math.round((progress / total) * 100) || 0;

  return (
    <div className="animate-fadeIn space-y-8 h-full flex flex-col">
        
        {/* Header & Progress */}
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-500/20 text-indigo-400 rounded-xl flex items-center justify-center text-2xl shadow-inner border border-indigo-500/30">
                    📁
                </div>
                <div>
                    <h3 className="text-lg font-bold text-white font-display">Legal Data Room</h3>
                    <p className="text-xs text-slate-400">
                        Document Roadmap for <strong>{jurisdiction.country} ({jurisdiction.spvType || 'Entity'})</strong>
                    </p>
                </div>
            </div>

            <div className="w-full md:w-1/3">
                <div className="flex justify-between text-xs font-bold text-slate-400 uppercase mb-2">
                    <span>Readiness</span>
                    <span className="text-white">{percent}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-500" style={{ width: `${percent}%` }}></div>
                </div>
            </div>
        </div>

        {/* Document Categories */}
        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-6">
            {['Formation', 'Governance', 'Tax', 'Banking'].map(cat => {
                const catDocs = docList.filter(d => d.category === cat);
                if (catDocs.length === 0) return null;

                return (
                    <div key={cat}>
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 ml-1">{cat} Documents</h4>
                        <div className="grid grid-cols-1 gap-3">
                            {catDocs.map(doc => {
                                const state = docStates[doc.id] || { status: 'pending' };
                                return (
                                    <div key={doc.id} className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4 group hover:border-slate-700 transition-colors">
                                        <div className="flex items-start gap-4 flex-1">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm border ${state.status === 'verified' ? 'bg-emerald-500 text-slate-900 border-emerald-500' : 'bg-slate-950 text-slate-500 border-slate-800'}`}>
                                                {state.status === 'verified' ? '✓' : (docList.indexOf(doc) + 1)}
                                            </div>
                                            <div>
                                                <h5 className="font-bold text-white text-sm">{doc.title}</h5>
                                                <p className="text-xs text-slate-500">{doc.description}</p>
                                                <div className="flex gap-2 mt-2">
                                                    <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400 border border-slate-700">
                                                        Required for: {doc.requiredFor.join(', ')}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${getStatusColor(state.status)}`}>
                                                {state.status}
                                            </div>
                                            
                                            <div className="flex gap-1">
                                                <button 
                                                    onClick={() => updateDocStatus(doc.id, 'drafting')}
                                                    className="p-2 bg-slate-800 hover:bg-indigo-600 hover:text-white rounded-lg text-slate-400 transition-colors" 
                                                    title="Generate Draft"
                                                >
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                                </button>
                                                <button 
                                                    onClick={() => handleUpload(doc.id)}
                                                    className="p-2 bg-slate-800 hover:bg-emerald-600 hover:text-white rounded-lg text-slate-400 transition-colors" 
                                                    title="Upload File"
                                                >
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>

        {/* Bulk Actions */}
        <div className="pt-4 border-t border-slate-800 flex justify-end gap-4">
            <Button variant="secondary" className="text-xs border-slate-700 text-slate-300">Download All Templates (.zip)</Button>
            <Button className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white">Export Data Room Link</Button>
        </div>

    </div>
  );
};
