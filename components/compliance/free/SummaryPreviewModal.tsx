
import React from 'react';
import { Button } from '../../ui/Button'; // Fixed import path
import { ComplianceData } from '../../../types';

interface Props {
  compliance: ComplianceData;
  onProceed: () => void;
  onClose: () => void;
}

export const SummaryPreviewModal: React.FC<Props> = ({ compliance, onProceed, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm animate-fadeIn p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-scaleIn">
            
            <div className="bg-slate-900 p-6 text-white text-center relative">
                <div className="absolute top-0 right-0 p-4 opacity-10 text-4xl">🛡️</div>
                <h3 className="text-2xl font-bold font-display mb-1">Strategy Locked</h3>
                <p className="text-slate-400 text-sm">Ready to proceed with this configuration?</p>
            </div>

            <div className="p-8 space-y-6">
                <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                    <span className="text-slate-500 text-sm font-bold uppercase tracking-wider">Framework</span>
                    <span className="text-indigo-600 font-bold text-lg">{compliance.regFramework}</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                    <span className="text-slate-500 text-sm font-bold uppercase tracking-wider">Target</span>
                    <span className="text-slate-900 font-medium">{compliance.targetInvestorType || 'General'}</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                    <span className="text-slate-500 text-sm font-bold uppercase tracking-wider">Min Ticket</span>
                    <span className="text-emerald-600 font-mono font-bold">${compliance.minInvestment?.toLocaleString() || 0}</span>
                </div>
                
                <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 text-amber-800 text-xs leading-relaxed">
                    <strong>Disclaimer:</strong> This blueprint is for educational simulation purposes. 
                    Real-world issuance requires legal validation.
                </div>

                <div className="flex gap-4 pt-2">
                    <Button variant="secondary" onClick={onClose} className="flex-1 border-slate-300">Edit</Button>
                    <Button onClick={onProceed} className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg">
                        Confirm & Proceed
                    </Button>
                </div>
            </div>

        </div>
    </div>
  );
};
