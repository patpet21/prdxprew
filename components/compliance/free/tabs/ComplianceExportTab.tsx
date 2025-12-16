
import React from 'react';
import { Button } from '../../../../components/ui/Button';
import { ComplianceData } from '../../../../types';
import { downloadPDF } from '../../../../utils/pdfGenerator';

interface Props {
  compliance: ComplianceData;
  onNextStep?: () => void;
}

const DetailRow = ({ label, value }: { label: string, value: string | number | undefined | null }) => (
    <div className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0">
        <span className="text-slate-500 text-sm">{label}</span>
        <span className="text-slate-900 font-bold text-sm text-right max-w-[200px] truncate">{value || '-'}</span>
    </div>
);

export const ComplianceExportTab: React.FC<Props> = ({ compliance, onNextStep }) => {

  const handleDownload = () => {
    const reportData = {
        RegulatoryStrategy: {
            Framework: compliance.regFramework,
            InvestorTarget: compliance.targetInvestorType,
            MinTicket: `$${compliance.minInvestment?.toLocaleString() || 0}`,
            MaxTicket: compliance.maxInvestment ? `$${compliance.maxInvestment.toLocaleString()}` : 'Unlimited'
        },
        RiskControls: {
            KYC_Mandatory: "Yes (All Investors)",
            AML_Screening: compliance.amlCheckEnabled ? "Enabled" : "Disabled",
            AccreditationCheck: compliance.accreditationRequired ? "Required" : "Not Required"
        },
        Geofencing: {
            BlockedRegions: compliance.jurisdictionRestrictions.length > 0 ? compliance.jurisdictionRestrictions.join(', ') : 'None',
            GlobalAccess: compliance.jurisdictionRestrictions.includes('US') ? 'Non-US Only (Reg S)' : 'Global'
        },
        Notes: {
            Summary: "Compliance strategy defined for pre-deployment review."
        }
    };

    downloadPDF(`Compliance_Strategy_Report`, reportData);
  };

  return (
    <div className="animate-fadeIn space-y-8 pb-12">
        
        <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-slate-900 font-display mb-2">Compliance Passport</h3>
            <p className="text-slate-500 max-w-lg mx-auto">
                Your regulatory strategy is configured and ready for the token design phase.
            </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl max-w-3xl mx-auto relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 to-indigo-500"></div>
            
            <div className="flex justify-between items-start mb-8">
                <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Strategy Status</span>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        <h4 className="text-xl font-bold text-slate-900">Ready for Review</h4>
                    </div>
                </div>
                <div className="text-4xl">⚖️</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                <div>
                    <h5 className="text-xs font-bold text-indigo-600 uppercase mb-4 border-b border-indigo-100 pb-2">Framework</h5>
                    <DetailRow label="Primary Reg" value={compliance.regFramework} />
                    <DetailRow label="Investor Profile" value={compliance.targetInvestorType} />
                    <DetailRow label="Min. Investment" value={`$${compliance.minInvestment?.toLocaleString()}`} />
                </div>
                <div>
                    <h5 className="text-xs font-bold text-indigo-600 uppercase mb-4 border-b border-indigo-100 pb-2">Restrictions</h5>
                    <DetailRow label="Blocked Regions" value={compliance.jurisdictionRestrictions.length > 0 ? `${compliance.jurisdictionRestrictions.length} Selected` : 'None'} />
                    <DetailRow label="KYC Requirement" value="Mandatory" />
                    <DetailRow label="Accreditation" value={compliance.accreditationRequired ? 'Yes' : 'No'} />
                </div>
            </div>

            <div className="mt-8 bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-start gap-3">
                <div className="text-xl">🛡️</div>
                <div>
                    <h5 className="text-xs font-bold text-slate-700 uppercase mb-1">Risk Mitigation</h5>
                    <p className="text-xs text-slate-500 leading-relaxed">
                        Smart contract will automatically enforce the selected geo-blocking and whitelist rules. 
                        Investors must pass KYC before depositing capital.
                    </p>
                </div>
            </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto">
            <Button variant="secondary" onClick={handleDownload} className="flex-1 border-slate-300 bg-white">
                📥 Download Compliance Brief
            </Button>
            {onNextStep && (
                <Button onClick={onNextStep} className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20">
                    💾 Save & Continue to Tokenomics →
                </Button>
            )}
        </div>
    </div>
  );
};
