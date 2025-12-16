
import React from 'react';
import { StatsCard } from '../StatsCard';
import { PortfolioAllocationChart, IncomeHistoryChart } from './PortfolioCharts';
import { Project, Investment, UserProfile } from '../../types';
import { RegulatoryTimelineCard, FinancialSnapshotCard, NextStepsSection, AiAnalystFeed } from './FreeDashboardWidgets';

interface OverviewTabProps {
  userProfile: UserProfile | null;
  investments: Investment[];
  projects: Project[];
  totalValue: number;
  onViewAllAssets: () => void;
  onIssueNew: () => void;
  onSelectProject: (project: Project) => void;
  onContinueSimulation: () => void;
  onDownloadSnapshot: () => void;
  onViewRoadmap: () => void;
  onNavigateToAcademy: () => void; // New Prop
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ 
  userProfile, 
  investments, 
  projects, 
  totalValue,
  onViewAllAssets,
  onIssueNew,
  onSelectProject,
  onContinueSimulation,
  onDownloadSnapshot,
  onViewRoadmap,
  onNavigateToAcademy
}) => {
  
  const allocationData = investments.map(inv => {
    const proj = projects.find(p => p.id === inv.property_id);
    return {
      label: proj?.title || 'Unknown Asset',
      value: inv.investment_amount,
      color: proj?.category === 'Real Estate' ? '#0ea5e9' : 
             proj?.category === 'Business' ? '#6366f1' : 
             proj?.category === 'Art' ? '#f43f5e' : '#94a3b8'
    };
  });
  
  const chartData = allocationData.length > 0 ? allocationData : [
    { label: 'Cash (Demo)', value: 100, color: '#94a3b8' },
  ];

  const activeProject = projects.length > 0 ? projects[0] : undefined;

  return (
    <div className="h-full w-full pb-4">
      {/* BENTO GRID LAYOUT */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-12 gap-4 h-full auto-rows-min">
      
        {/* 1. HERO CARD (Wide) - Top Left */}
        <div className="col-span-1 md:col-span-4 lg:col-span-8 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-[24px] p-6 lg:p-8 text-white relative overflow-hidden shadow-lg flex flex-col justify-between min-h-[220px] border border-slate-800">
             <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
             <div className="relative z-10">
                 <div className="flex items-center gap-2 mb-3">
                     <span className="bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border border-indigo-500/30">
                         Simulator Active
                     </span>
                     <span className="text-slate-400 text-[10px]">v2.4.0</span>
                 </div>
                 <h2 className="text-2xl lg:text-4xl font-bold font-display mb-2 leading-tight">
                     Welcome back, {userProfile?.full_name?.split(' ')[0] || 'Builder'}.
                 </h2>
                 <p className="text-indigo-200 text-sm max-w-lg leading-relaxed mb-6">
                     PropertyDEX is an early-stage tokenization framework. You have <strong>{investments.length} active assets</strong> in your draft pipeline.
                 </p>
                 
                 <div className="flex flex-wrap gap-3 mt-auto">
                     <button 
                         onClick={onContinueSimulation} 
                         className="bg-white text-indigo-900 hover:bg-indigo-50 px-5 py-2.5 rounded-xl text-xs font-bold shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
                     >
                         PropertyDEX – Tokenization Framework <span>→</span>
                     </button>
                     <button 
                         onClick={onNavigateToAcademy}
                         className="bg-indigo-800/50 hover:bg-indigo-800 border border-indigo-500/30 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all"
                     >
                         PropertyDEX – Tokenization Foundations
                     </button>
                 </div>
             </div>
        </div>

        {/* 2. STATS COLUMN - Top Right */}
        <div className="col-span-1 md:col-span-4 lg:col-span-4 grid grid-cols-2 gap-4">
            <StatsCard 
              title="Total Value" 
              value={`$${totalValue.toLocaleString()}`} 
              trend="+12%" 
              trendUp={true} 
              icon={<svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
              colorClass="bg-indigo-600 text-white"
            />
            <StatsCard 
              title="Est. Income" 
              value={`$${(totalValue * 0.08 / 12).toFixed(0)}`} 
              trend="+5%" 
              trendUp={true} 
              icon={<svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
              colorClass="bg-emerald-50"
            />
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col justify-center">
                 <div className="flex justify-between items-center mb-1">
                     <span className="text-[10px] font-bold text-slate-400 uppercase">Readiness</span>
                     <span className="text-xs font-bold text-indigo-600">72%</span>
                 </div>
                 <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                     <div className="bg-indigo-500 h-full w-[72%]"></div>
                 </div>
            </div>
            <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 shadow-sm flex flex-col justify-center text-center cursor-pointer hover:bg-slate-800 transition-colors" onClick={onViewRoadmap}>
                 <span className="text-[10px] font-bold text-slate-500 uppercase">Next Milestone</span>
                 <span className="text-sm font-bold text-white mt-1">SPV Incorporation</span>
            </div>
        </div>

        {/* 3. PORTFOLIO CHART (Bento Square) - Mid Left */}
        <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-white p-5 rounded-[24px] border border-slate-200 shadow-sm flex flex-col">
             <h3 className="font-bold text-slate-900 text-sm mb-4">Allocation</h3>
             <div className="flex-1 flex items-center justify-center">
                 <PortfolioAllocationChart data={chartData} />
             </div>
             <div className="mt-4 flex flex-wrap gap-2 justify-center">
                 {chartData.slice(0,2).map((item, i) => (
                     <div key={i} className="flex items-center gap-1.5 text-[10px] text-slate-500 bg-slate-50 px-2 py-1 rounded-full">
                         <span className="w-1.5 h-1.5 rounded-full" style={{backgroundColor: item.color}}></span>
                         {item.label}
                     </div>
                 ))}
             </div>
        </div>

        {/* 4. FINANCIAL SNAPSHOT - Mid Center */}
        <div className="col-span-1 md:col-span-2 lg:col-span-6 min-h-[250px]">
             <FinancialSnapshotCard project={activeProject} />
        </div>

        {/* 5. AI FEED - Mid Right */}
        <div className="col-span-1 md:col-span-4 lg:col-span-3 bg-slate-900 rounded-[24px] border border-slate-800 p-5 overflow-hidden flex flex-col">
             <div className="flex items-center gap-2 mb-4">
                 <span className="text-xl">🤖</span>
                 <h3 className="font-bold text-white text-sm">AI Analyst</h3>
             </div>
             <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
                 <div className="space-y-3 text-xs text-slate-400">
                     <p className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
                         "Market cap rates for {activeProject?.category || 'Real Estate'} are compressing. Your valuation looks conservative."
                     </p>
                     <p className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
                         "Compliance Check: Reg D 506(c) allows general solicitation but requires strict accredited verification."
                     </p>
                     <p className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
                         "Suggestion: Add a 12-month lockup clause to your tokenomics for better regulatory safety."
                     </p>
                 </div>
             </div>
        </div>

        {/* 6. NEXT STEPS (Bottom Strip) */}
        <div className="col-span-1 md:col-span-4 lg:col-span-12">
            <div className="bg-white rounded-[24px] p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                    <h3 className="font-bold text-slate-900 text-base">Execution Roadmap</h3>
                    <p className="text-xs text-slate-500">Your path to mainnet deployment.</p>
                </div>
                <div className="flex-1 w-full md:w-auto overflow-x-auto no-scrollbar px-4">
                     <div className="flex items-center gap-2 min-w-max">
                         {['Concept', 'Struct.', 'Legal', 'Tech', 'Launch'].map((step, i) => (
                             <div key={i} className="flex items-center gap-2">
                                 <div className={`px-3 py-1.5 rounded-lg text-xs font-bold ${i < 2 ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>
                                     {step}
                                 </div>
                                 {i < 4 && <div className="w-4 h-0.5 bg-slate-200"></div>}
                             </div>
                         ))}
                     </div>
                </div>
                <button onClick={onViewRoadmap} className="text-xs font-bold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-xl hover:bg-indigo-100 transition-colors whitespace-nowrap">
                    View Full Map
                </button>
            </div>
        </div>

      </div>
    </div>
  );
};
