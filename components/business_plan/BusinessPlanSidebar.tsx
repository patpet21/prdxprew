
import React from 'react';

export interface PlanSection {
    id: string;
    label: string;
}

export const PLAN_SECTIONS: PlanSection[] = [
    { id: 'projectIdentification', label: 'Project Identification' },
    { id: 'executiveSummary', label: 'Executive Summary' },
    { id: 'assetOverview', label: 'Asset Overview' },
    { id: 'projectStatusTimeline', label: 'Project Status & Timeline' },
    { id: 'marketLocationAnalysis', label: 'Market & Location Analysis' },
    { id: 'businessModel', label: 'Business Model' },
    { id: 'legalStructureSpv', label: 'Legal Structure & SPV Setup' },
    { id: 'regulatoryCompliance', label: 'Regulatory & Compliance' },
    { id: 'tokenModelDefinition', label: 'Token Model Definition' },
    { id: 'tokenomicsPricing', label: 'Tokenomics & Pricing' },
    { id: 'capitalStructure', label: 'Capital Structure' },
    { id: 'useOfFunds', label: 'Use of Funds' },
    { id: 'revenueStreams', label: 'Revenue Streams' },
    { id: 'costStructure', label: 'Cost Structure' },
    { id: 'financialProjections', label: 'Financial Projections' },
    { id: 'investorReturns', label: 'Investor Returns' },
    { id: 'payoutDistribution', label: 'Payout & Distribution' },
    { id: 'treasuryManagement', label: 'Treasury Management' },
    { id: 'riskAnalysis', label: 'Risk Analysis' },
    { id: 'mitigationStrategies', label: 'Mitigation Strategies' },
    { id: 'operationalManagement', label: 'Operational & Management' },
    { id: 'technologyInfrastructure', label: 'Technology & Infrastructure' },
    { id: 'roadmapMilestones', label: 'Roadmap & Milestones' },
    { id: 'exitScenarios', label: 'Exit Scenarios' },
    { id: 'projectReadinessScore', label: 'Project Readiness Score' },
    { id: 'keyAssumptions', label: 'Key Assumptions' },
    { id: 'finalReview', label: 'Final Review & Validation' },
    { id: 'exportPdf', label: 'Business Plan Export (PDF)' }
];

interface Props {
    activeSection: string;
    onSelect: (id: string) => void;
    planData: any;
}

export const BusinessPlanSidebar: React.FC<Props> = ({ activeSection, onSelect, planData }) => {
    return (
        <div className="w-80 bg-slate-50 border-r border-slate-200 h-full flex flex-col shrink-0">
            <div className="p-6 border-b border-slate-200 bg-white">
                <h3 className="font-bold text-slate-900 text-lg font-display">Plan Builder</h3>
                <p className="text-xs text-slate-500 mt-1">28 Institutional Sections</p>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
                {PLAN_SECTIONS.map(section => {
                    const hasData = !!planData[section.id] && section.id !== 'exportPdf';
                    const isActive = activeSection === section.id;
                    
                    return (
                        <button
                            key={section.id}
                            onClick={() => onSelect(section.id)}
                            className={`
                                w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all flex items-center justify-between group
                                ${isActive 
                                    ? 'bg-indigo-600 text-white shadow-md' 
                                    : 'text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                                }
                            `}
                        >
                            <span className="truncate">{section.label}</span>
                            {hasData && (
                                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isActive ? 'bg-indigo-500 text-indigo-100' : 'bg-emerald-100 text-emerald-600'}`}>
                                    ✓
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
