
import React, { useEffect, useState } from 'react';
import { ProjectEntity } from '../domain/project.entity';
import { projectService } from '../services/project_service';
import { SPVWizard as SpvBuilder } from '../../spv_builder/ui/SPVWizard';
import { ValuationEngine } from '../../../components/enterprise/steps/valuation_engine/ValuationEngine';
import { TokenBlueprintGenerator } from '../../../components/enterprise/steps/token_blueprint/TokenBlueprintGenerator';
import { InvestorPackageBuilder } from '../../../components/enterprise/steps/investor_package/InvestorPackageBuilder';
import { BusinessPlanView } from '../../business_plan/ui/BusinessPlanView';
import { AuditModule } from '../../../components/enterprise/steps/audit_module/AuditModule';

interface Props {
  projectId: string;
  onBack: () => void;
}

export const ProjectDetail: React.FC<Props> = ({ projectId, onBack }) => {
  const [project, setProject] = useState<ProjectEntity | null>(null);
  const [activeTab, setActiveTab] = useState('Overview');
  
  useEffect(() => {
    projectService.getProject(projectId).then(p => {
      if (p) setProject(p);
    });
  }, [projectId]);

  if (!project) return <div className="p-8 text-slate-500 flex items-center justify-center h-full animate-pulse">Loading Project Data...</div>;

  const tabs = ['Overview', 'SPV Structuring', 'Valuation', 'Token Blueprint', 'Business Plan', 'Investor Package', 'Audit'];

  return (
    <div className="animate-fadeIn h-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4 shrink-0">
        <div className="flex items-start gap-4">
          <button onClick={onBack} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors mt-1">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          </button>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white font-display leading-tight">{project.name}</h2>
            <div className="flex flex-wrap items-center gap-2 md:gap-3 text-sm text-slate-500 mt-1">
              <span className={`uppercase tracking-wider font-bold text-[10px] px-2 py-0.5 rounded ${project.status.includes('intake') ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800 text-slate-300'}`}>
                  {project.status.replace(/_/g, ' ')}
              </span>
              <span className="hidden md:inline">•</span>
              <span className="flex items-center gap-1"><span className="md:hidden">📍</span> {project.intake.location}</span>
              <span className="hidden md:inline">•</span>
              <span className="flex items-center gap-1"><span className="md:hidden">💰</span> <span className="text-emerald-500 font-mono font-bold">${(project.intake.targetRaise / 1000000).toFixed(1)}M</span></span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs - Scrollable on mobile */}
      <div className="mb-6 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 custom-scrollbar shrink-0">
        <div className="flex gap-2 w-max">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap border ${
                activeTab === tab 
                  ? 'bg-amber-500 text-slate-900 border-amber-500 shadow-md' 
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content Container */}
      <div className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl p-4 md:p-8 overflow-y-auto custom-scrollbar shadow-inner">
        
        {activeTab === 'Overview' && (
          <div className="space-y-8 max-w-5xl mx-auto animate-slideUp">
            <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
              
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2 relative z-10">
                <span className="text-2xl">💎</span> Executive Summary
                <span className="text-[10px] font-bold text-slate-500 ml-auto uppercase tracking-widest bg-slate-900 px-2 py-1 rounded border border-slate-800">AI Generated</span>
              </h3>
              <p className="text-slate-300 leading-relaxed mb-8 text-base md:text-lg font-light relative z-10">
                {project.summary?.executiveSummary || project.intake.description || "Summary pending generation..."}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
                <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 flex flex-col">
                  <span className="block text-[10px] font-bold text-slate-500 uppercase mb-2 tracking-wider">Structure</span>
                  <span className="text-emerald-400 font-medium text-sm leading-tight">{project.summary?.recommendedStructure || 'Pending Analysis'}</span>
                </div>
                <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 flex flex-col">
                  <span className="block text-[10px] font-bold text-slate-500 uppercase mb-2 tracking-wider">Feasibility</span>
                  <div className="flex items-baseline gap-1 mt-auto">
                    <span className="text-amber-400 font-mono font-bold text-2xl">{project.summary?.feasibilityScore || 0}</span>
                    <span className="text-slate-600 text-xs font-bold">/ 100</span>
                  </div>
                </div>
                <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 flex flex-col">
                   <span className="block text-[10px] font-bold text-slate-500 uppercase mb-2 tracking-wider">Asset Class</span>
                   <span className="text-white font-medium text-lg mt-auto">{project.intake.assetType}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  Key Risks Detected
              </h4>
              <ul className="space-y-3">
                {project.summary?.keyRisks?.map((risk, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-300 bg-red-950/20 p-4 rounded-xl border border-red-500/10">
                    <span className="text-red-500 font-bold mt-0.5">•</span>
                    {risk}
                  </li>
                )) || <li className="text-slate-500 italic p-4 border border-dashed border-slate-800 rounded-xl text-center">No risks detected yet.</li>}
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'SPV Structuring' && (
             <div className="h-full">
                 <SpvBuilder /> 
             </div>
        )}

        {activeTab === 'Valuation' && (
          <div className="h-full">
             <ValuationEngine />
          </div>
        )}

        {activeTab === 'Token Blueprint' && (
          <div className="h-full">
            <TokenBlueprintGenerator />
          </div>
        )}

        {activeTab === 'Business Plan' && (
          <div className="h-full">
            <BusinessPlanView />
          </div>
        )}

        {activeTab === 'Investor Package' && (
          <div className="h-full">
            <InvestorPackageBuilder />
          </div>
        )}
        
        {activeTab === 'Audit' && (
          <div className="h-full">
            <AuditModule />
          </div>
        )}

      </div>
    </div>
  );
};
