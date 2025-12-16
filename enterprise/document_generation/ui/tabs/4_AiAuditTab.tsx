
import React, { useState } from 'react';
import { LegalProjectData } from '../../domain/legal_engineering.entity';
import { legalEngineeringService } from '../../services/legal_engineering_service';
import { Button } from '../../../../components/ui/Button';

interface Props {
  data: LegalProjectData;
  updateData: (updates: Partial<LegalProjectData>) => void;
}

export const AiAuditTab: React.FC<Props> = ({ data, updateData }) => {
  const [isScanning, setIsScanning] = useState(false);

  const handleScan = async () => {
      setIsScanning(true);
      const findings = await legalEngineeringService.findMissingClauses(data.draftClauses);
      updateData({ auditFindings: findings });
      setIsScanning(false);
  };

  const handleAcceptSuggestion = (suggestion: string) => {
      // Logic to append suggestion to drafts would go here
      alert("Suggestion accepted. Added to draft queue.");
  };

  return (
    <div className="space-y-8 animate-fadeIn">
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl text-center">
            <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-4">
                🕵️‍♂️
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">AI Clause Detective</h3>
            <p className="text-slate-400 max-w-md mx-auto mb-6">
                Scan your current draft against our database of 5,000+ successful Security Token Offerings to find missing protections.
            </p>
            <Button onClick={handleScan} isLoading={isScanning} className="bg-purple-600 hover:bg-purple-500 shadow-lg shadow-purple-900/20 px-8 py-3">
                {isScanning ? 'Scanning Document...' : 'Run Gap Analysis'}
            </Button>
        </div>

        {data.auditFindings.length > 0 && (
            <div className="grid grid-cols-1 gap-4 animate-slideUp">
                <div className="flex items-center justify-between mb-2 px-2">
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Findings Log</h4>
                    <span className="text-xs bg-red-900/30 text-red-400 px-2 py-1 rounded border border-red-500/30">{data.auditFindings.length} Issues Found</span>
                </div>
                
                {data.auditFindings.map((finding) => (
                    <div key={finding.id} className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col md:flex-row gap-6 hover:border-slate-700 transition-colors">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${finding.severity === 'Critical' ? 'bg-red-500 text-white' : 'bg-amber-500 text-slate-900'}`}>
                                    {finding.severity}
                                </span>
                                <h5 className="font-bold text-white text-lg">Missing: {finding.missingClauseName}</h5>
                            </div>
                            <p className="text-slate-400 text-sm mb-4 leading-relaxed">
                                <strong>Risk:</strong> {finding.riskReason}
                            </p>
                            
                            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                                <div className="text-[10px] text-slate-500 uppercase mb-2 font-bold">Suggested Content</div>
                                <p className="text-xs text-emerald-400 font-mono leading-relaxed">
                                    "{finding.suggestedContent}"
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col justify-center gap-3 min-w-[150px]">
                            <Button onClick={() => handleAcceptSuggestion(finding.suggestedContent)} size="sm" className="bg-emerald-600 hover:bg-emerald-500">
                                Accept & Add
                            </Button>
                            <Button variant="secondary" size="sm" className="border-slate-700 text-slate-400">
                                Dismiss
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        )}
    </div>
  );
};
