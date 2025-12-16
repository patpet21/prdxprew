
import React, { useState } from 'react';
import { Button } from '../../../../components/ui/Button';
import { ConfirmationDialog } from '../../../../../../components/ui/ConfirmationDialog';

export const FinalExportTab: React.FC = () => {
  const [status, setStatus] = useState<'IDLE' | 'PACKAGING' | 'DONE'>('IDLE');
  const [showConfirm, setShowConfirm] = useState(false);

  const handleExportClick = () => {
    setShowConfirm(true);
  };

  const executeExport = () => {
      setStatus('PACKAGING');
      setTimeout(() => {
          setStatus('DONE');
      }, 2500);
  };

  if (status === 'PACKAGING') {
      return (
          <div className="flex flex-col items-center justify-center h-[500px] bg-slate-900 rounded-2xl border border-slate-800">
              <div className="w-24 h-24 relative mb-8">
                  <div className="absolute inset-0 border-4 border-slate-800 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Compiling Legal Package...</h3>
              <div className="space-y-1 text-center text-sm text-slate-500 font-mono">
                  <p>Hashing content...</p>
                  <p>Applying timestamps...</p>
                  <p>Converting to PDF/DOCX...</p>
              </div>
          </div>
      );
  }

  if (status === 'DONE') {
      return (
          <div className="flex flex-col items-center justify-center h-[500px] bg-slate-900 rounded-2xl border border-emerald-500/30 relative overflow-hidden">
              <div className="absolute inset-0 bg-emerald-500/5"></div>
              <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center text-4xl mb-6 shadow-[0_0_30px_#10b981]">
                  📦
              </div>
              <h3 className="text-3xl font-bold text-white mb-2 font-display">Package Ready</h3>
              <p className="text-slate-400 mb-8">Your legal data room has been generated securely.</p>
              
              <div className="flex gap-4">
                  <Button className="bg-white text-slate-900 hover:bg-slate-200 px-8">Download ZIP</Button>
                  <Button variant="outline" className="border-slate-600 text-slate-300">Send to Email</Button>
              </div>
          </div>
      );
  }

  return (
    <div className="flex flex-col items-center justify-center h-[500px] space-y-8 animate-fadeIn">
        <div className="text-center max-w-md">
            <h3 className="text-2xl font-bold text-white mb-2">Ready to Export</h3>
            <p className="text-slate-400">
                You are about to generate the final legal package. This action will lock the current draft version and create a verifiable hash.
            </p>
        </div>
        <Button onClick={handleExportClick} className="bg-emerald-600 hover:bg-emerald-500 px-10 py-4 text-lg shadow-xl shadow-emerald-900/20">
            Generate Final Package
        </Button>

        <ConfirmationDialog 
            isOpen={showConfirm}
            onClose={() => setShowConfirm(false)}
            onConfirm={executeExport}
            title="Lock & Export Legal Package"
            message="This will finalize all draft documents and generate a timestamped audit trail. Edits will be disabled for this version. Continue?"
            confirmText="Lock & Export"
            variant="warning"
        />
    </div>
  );
};
