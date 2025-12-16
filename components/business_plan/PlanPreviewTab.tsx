
import React from 'react';
import { TokenizationState } from '../../types';
import { Button } from '../ui/Button';
import { downloadPDF } from '../../utils/pdfGenerator';

interface Props {
  data: TokenizationState;
  isLoggedIn: boolean;
  onLogin?: () => void;
}

const Section = ({ title, icon, children }: { title: string, icon: string, children?: React.ReactNode }) => (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center gap-3 mb-4 border-b border-slate-100 pb-3">
            <span className="text-2xl">{icon}</span>
            <h4 className="text-lg font-bold text-slate-900 font-display">{title}</h4>
        </div>
        <div className="space-y-3 text-sm text-slate-600">
            {children}
        </div>
    </div>
);

const DetailRow = ({ label, value }: { label: string, value: string | number | undefined }) => (
    <div className="flex justify-between items-start">
        <span className="text-slate-400 font-medium">{label}</span>
        <span className="text-slate-900 font-bold text-right max-w-[60%]">{value || '-'}</span>
    </div>
);

export const PlanPreviewTab: React.FC<Props> = ({ data, isLoggedIn, onLogin }) => {
  const { projectInfo, property, jurisdiction, compliance, tokenAllocation } = data;

  const handleDownload = () => {
    if (!isLoggedIn) {
        if (onLogin) onLogin();
        else alert("Please log in to download the full Business Plan.");
        return;
    }

    const businessPlanData = {
        ExecutiveSummary: {
            ProjectName: projectInfo.projectName,
            AssetClass: property.category,
            Goal: projectInfo.projectGoal,
            Jurisdiction: `${jurisdiction.country} (${jurisdiction.spvType})`
        },
        AssetOpportunity: {
            Type: property.property_type,
            Location: `${property.city}, ${property.country}`,
            Valuation: `€${property.total_value?.toLocaleString()}`,
            Description: projectInfo.description
        },
        FinancialModel: {
            RaiseTarget: `€${property.raise_amount?.toLocaleString()}`,
            TokenPrice: `€${property.token_price}`,
            TotalSupply: property.total_tokens?.toLocaleString(),
            AnnualYield: `${property.annual_yield}%`,
            ProjectedIRR: `${property.roi_target}%`
        },
        LegalCompliance: {
            Framework: compliance.regFramework,
            InvestorTarget: compliance.targetInvestorType,
            MinTicket: `$${compliance.minInvestment?.toLocaleString()}`,
            Restrictions: compliance.jurisdictionRestrictions.join(', ') || 'None'
        },
        CapTable: {
            PublicInvestors: `${tokenAllocation.investors}%`,
            SponsorTeam: `${tokenAllocation.founders}%`,
            Treasury: `${tokenAllocation.treasury}%`
        }
    };

    downloadPDF(`Business_Plan_${projectInfo.projectName.replace(/\s+/g, '_')}`, businessPlanData);
  };

  return (
    <div className="animate-fadeIn space-y-8 pb-12">
        <div className="text-center max-w-2xl mx-auto mb-8">
            <h3 className="text-3xl font-bold text-slate-900 font-display">Business Plan Preview</h3>
            <p className="text-slate-500 text-lg">
                A structured overview of your project ready for investor due diligence.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <Section title="Executive Summary" icon="💎">
                <DetailRow label="Project Name" value={projectInfo.projectName} />
                <DetailRow label="Asset Class" value={property.category} />
                <DetailRow label="Goal" value={projectInfo.projectGoal} />
                <DetailRow label="Legal Structure" value={`${jurisdiction.spvType} in ${jurisdiction.country}`} />
            </Section>

            <Section title="Asset & Market" icon="🏢">
                <DetailRow label="Type" value={property.property_type} />
                <DetailRow label="Location" value={`${property.city}, ${property.country}`} />
                <DetailRow label="Valuation" value={`€${property.total_value?.toLocaleString()}`} />
                <div className="mt-2 text-xs italic text-slate-500 bg-slate-50 p-2 rounded">
                    "{projectInfo.description?.substring(0, 120)}..."
                </div>
            </Section>

            <Section title="Financial & Token" icon="💰">
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-3 rounded-lg text-center">
                        <span className="block text-xs text-slate-400 uppercase font-bold">Raise</span>
                        <span className="block text-lg font-bold text-emerald-600">€{(property.raise_amount || 0).toLocaleString()}</span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg text-center">
                        <span className="block text-xs text-slate-400 uppercase font-bold">Yield</span>
                        <span className="block text-lg font-bold text-emerald-600">{property.annual_yield}%</span>
                    </div>
                </div>
                <DetailRow label="Token Price" value={`€${property.token_price}`} />
                <DetailRow label="Supply" value={property.total_tokens?.toLocaleString()} />
                <DetailRow label="Hard Cap" value={`€${property.hard_cap?.toLocaleString()}`} />
            </Section>

            <Section title="Legal & Compliance" icon="⚖️">
                <DetailRow label="Regime" value={compliance.regFramework} />
                <DetailRow label="Investor Target" value={compliance.targetInvestorType} />
                <div className="mt-2">
                    <span className="text-xs text-slate-400 font-bold uppercase">Blocked Regions</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                        {compliance.jurisdictionRestrictions.length > 0 ? (
                            compliance.jurisdictionRestrictions.map(r => (
                                <span key={r} className="px-2 py-0.5 bg-red-50 text-red-600 text-[10px] font-bold rounded border border-red-100">{r}</span>
                            ))
                        ) : (
                            <span className="text-xs text-slate-500">None</span>
                        )}
                    </div>
                </div>
            </Section>

        </div>

        {/* CTA Footer */}
        <div className="bg-slate-900 rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>

            <div className="relative z-10 max-w-2xl mx-auto">
                <h3 className="text-2xl md:text-3xl font-bold font-display mb-4">
                    Get the Professional PDF Report
                </h3>
                <p className="text-slate-400 mb-8 text-lg">
                    This comprehensive document aggregates all your simulation data into a bank-ready format.
                </p>

                {isLoggedIn ? (
                    <Button 
                        onClick={handleDownload}
                        className="px-10 py-4 bg-white text-slate-900 hover:bg-slate-100 font-bold text-lg shadow-xl"
                    >
                        📥 Download Full Business Plan (PDF)
                    </Button>
                ) : (
                    <div className="space-y-4">
                        <Button 
                            onClick={onLogin}
                            className="px-10 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-lg shadow-xl shadow-indigo-500/30"
                        >
                            🔐 Login to Download (Free)
                        </Button>
                        <p className="text-xs text-slate-500">
                            Create a free account to save your progress and access reports.
                        </p>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};
