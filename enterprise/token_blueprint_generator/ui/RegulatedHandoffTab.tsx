
import React, { useState } from 'react';
import { RegulatedHandoffPackage } from '../domain/token_blueprint.entity';
import { Button } from '../../../components/ui/Button';

interface Props {
  handoffData: RegulatedHandoffPackage;
  onSend: () => void;
  onSwitchToDeFi: () => void;
}

export const RegulatedHandoffTab: React.FC<Props> = ({ handoffData, onSend, onSwitchToDeFi }) => {
  const [isSending, setIsSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);
  
  const spv = JSON.parse(handoffData.spv_summary_json || '{}');
  const terms = JSON.parse(handoffData.offering_terms_json || '{}');
  const docs = handoffData.documents_required || [];

  const handleTransmit = () => {
      setIsSending(true);
      setTimeout(() => {
          setIsSending(false);
          setSentSuccess(true);
          onSend();
      }, 2500);
  };

  if (sentSuccess) {
      return (
          <div className="flex flex-col items-center justify-center h-[500px] animate-fadeIn text-center p-6">
              <div className="w-24 h-24 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center text-5xl mb-6 shadow-2xl shadow-emerald-500/20 animate-scaleIn">
                  🚀
              </div>
              <h2 className="text-3xl font-bold text-white font-display mb-4">Package Transmitted</h2>
              <p className="text-slate-400 max-w-md mx-auto mb-8 text-lg">
                  Your data room has been securely delivered to the provider via API. 
                  You will receive an email confirmation shortly with the counter-signed engagement letter.
              </p>
              
              <div className="flex gap-4">
                  <Button onClick={() => window.location.reload()} variant="outline" className="border-slate-700 text-slate-300">
                      Return to Dashboard
                  </Button>
                  <Button onClick={onSwitchToDeFi} className="bg-purple-900/40 text-purple-300 border border-purple-500/30 hover:bg-purple-900/60">
                      Enter DeFi Sandbox (Experimental)
                  </Button>
              </div>
          </div>
      );
  }

  return (
    <div className="space-y-8 animate-fadeIn h-full flex flex-col">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
            <div>
                <h4 className="text-xl font-bold text-white flex items-center gap-2">
                    <span className="text-2xl">📡</span> Provider Gateway
                </h4>
                <p className="text-slate-400 text-sm mt-1">
                    Review and confirm the data package before transmission to <strong>{handoffData.provider_id.toUpperCase()}</strong>.
                </p>
            </div>
            
            <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-slate-900 px-3 py-1 rounded border border-slate-800">
                    Status: {handoffData.status.toUpperCase()}
                </span>
            </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-6">
            
            {/* 1. Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-slate-900 p-5 rounded-xl border border-slate-800">
                    <h5 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-3">SPV Identity</h5>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-slate-500">Legal Name</span>
                            <span className="text-white font-medium">{spv.legal_name || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">Type</span>
                            <span className="text-white font-medium">{spv.entity_type || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">Jurisdiction</span>
                            <span className="text-white font-mono">{spv.jurisdiction || 'N/A'}</span>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900 p-5 rounded-xl border border-slate-800">
                    <h5 className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-3">Offering Terms</h5>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-slate-500">Regulation</span>
                            <span className="text-white font-medium">{terms.regulation || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">Lock-up</span>
                            <span className="text-white font-medium">{terms.lockup || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">Target</span>
                            <span className="text-white font-medium">{terms.investor_type || 'N/A'}</span>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 flex flex-col justify-center items-center text-center">
                    <div className="text-3xl mb-2">📄</div>
                    <h5 className="text-sm font-bold text-white mb-1">{docs.length} Documents</h5>
                    <p className="text-xs text-slate-500">Required for Onboarding</p>
                </div>
            </div>

            {/* 2. Document Checklist */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex justify-between items-center">
                    <h5 className="font-bold text-white text-sm">Document Checklist</h5>
                    <span className="text-xs text-slate-500">All must be uploaded</span>
                </div>
                <div className="p-4 space-y-2">
                    {docs.map((doc, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                            <div className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-xs text-slate-400 font-bold">
                                    {i+1}
                                </div>
                                <span className="text-sm text-slate-300">{doc.name}</span>
                            </div>
                            <button className="text-[10px] font-bold uppercase px-3 py-1.5 bg-blue-600/20 text-blue-400 rounded border border-blue-500/30 hover:bg-blue-600 hover:text-white transition-colors">
                                Upload
                            </button>
                        </div>
                    ))}
                    {docs.length === 0 && <div className="text-center py-4 text-slate-500 text-sm">No specific documents listed.</div>}
                </div>
            </div>

            {/* 3. JSON Preview */}
            <div className="bg-black/30 rounded-xl border border-slate-800 p-4">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-bold text-slate-500 uppercase font-mono">Payload Preview (Partial)</span>
                    <span className="text-[10px] text-emerald-500">Valid JSON</span>
                </div>
                <pre className="text-[10px] text-slate-400 font-mono overflow-x-auto">
                    {JSON.stringify(spv, null, 2)}
                </pre>
            </div>

        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 shrink-0">
            <div className="flex gap-4">
                <Button variant="secondary" className="text-xs border-slate-700">Download PDF Brief</Button>
                <button 
                    onClick={onSwitchToDeFi}
                    className="text-xs text-purple-400 hover:text-purple-300 font-bold underline decoration-purple-500/30 underline-offset-4"
                >
                    Switch to DeFi Sandbox
                </button>
            </div>
            
            <Button 
                onClick={handleTransmit}
                isLoading={isSending}
                className="w-full md:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-900/30"
            >
                {isSending ? 'Transmitting via API...' : `Transmit to ${handoffData.provider_id.toUpperCase()}`}
            </Button>
        </div>

    </div>
  );
};
