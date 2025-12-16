
import React, { useState } from 'react';
import { Button } from '../../../ui/Button';
import { valuationService, ProjectContext, FullValuationReport, ValuationAssumptions } from '../../../../enterprise/valuation_engine/services/valuation_service';
import { ProjectContextTab } from '../../../../enterprise/valuation_engine/ui/tabs/ProjectContextTab';
import { FinancialAssumptionsTab } from '../../../../enterprise/valuation_engine/ui/tabs/FinancialAssumptionsTab';
import { ValuationReportView } from '../../../../enterprise/valuation_engine/ui/tabs/ValuationReportView'; // Moved or check path
import { ProjectEconomicsTab } from '../../../../enterprise/valuation_engine/ui/tabs/ProjectEconomicsTab';
import { FeasibilityScoreTab } from '../../../../enterprise/valuation_engine/ui/tabs/FeasibilityScoreTab';
import { DeveloperNotesTab } from '../../../../enterprise/valuation_engine/ui/tabs/DeveloperNotesTab';

// Correcting path for reused component if needed, assuming we moved it or kept it compatible
import { ValuationReportView as LegacyReportView } from '../../../../enterprise/valuation_engine/ui/ValuationReportView';

type Screen = 'CONTEXT' | 'ASSUMPTIONS' | 'REPORT';

export const ValuationEngine: React.FC = () => {
  const [screen, setScreen] = useState<Screen>('CONTEXT');
  
  // State
  const [projectData, setProjectData] = useState<ProjectContext>({
    id: 'new-project',
    name: '',
    location: '',
    assetType: 'Income Property',
    status: 'Existing asset',
    financials: { grossIncome: 0, opex: 0 },
    description: ''
  });

  const [assumptions, setAssumptions] = useState<ValuationAssumptions | null>(null);
  const [report, setReport] = useState<FullValuationReport | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Navigation Handlers
  
  const handleContextNext = async () => {
      if (!projectData.name || !projectData.location) {
          alert("Please complete project details.");
          return;
      }
      setIsProcessing(true);
      try {
          const initialAssumptions = await valuationService.buildAssumptions(projectData);
          setAssumptions(initialAssumptions);
          setScreen('ASSUMPTIONS');
      } catch (e) {
          console.error(e);
          alert("Failed to generate assumptions.");
      } finally {
          setIsProcessing(false);
      }
  };

  const handleRunAnalysis = async () => {
      if (!assumptions) return;
      setIsProcessing(true);
      try {
          // Recalculate valuation first based on user tweaks
          const valResult = valuationService.runValuation(assumptions, projectData);
          
          // Run full AI suite
          const fullReport = await valuationService.runFullWorkflow(projectData);
          // Override the valuation part with user-tweaked numbers if necessary, 
          // but runFullWorkflow re-runs it. Better to pass assumptions to runFullWorkflow or creating a specific method.
          // For now, we assume runFullWorkflow re-uses the logic internally or we patch it.
          // Actually, runFullWorkflow generates its own assumptions. We should update it to accept existing ones.
          // Patching report with current assumptions & re-calc:
          
          const patchedReport = {
              ...fullReport,
              assumptions: assumptions,
              valuation: valResult
          };

          // Re-run economics based on NEW valuation numbers
          const economics = await valuationService.generateProjectEconomics(projectData, valResult);
          const feasibility = await valuationService.generateFeasibility(projectData, economics);
          
          setReport({
              ...patchedReport,
              economics,
              feasibility
          });
          
          setScreen('REPORT');
      } catch (e) {
          console.error(e);
      } finally {
          setIsProcessing(false);
      }
  };

  return (
    <div className="h-full flex flex-col animate-fadeIn">
      
      {/* Header / Breadcrumbs */}
      <div className="flex items-center justify-between mb-6 shrink-0">
          <div>
              <h2 className="text-2xl font-bold text-white font-display">Valuation Engine</h2>
              <p className="text-slate-400 text-sm">
                  {screen === 'CONTEXT' && "Step 1: Project Initialization"}
                  {screen === 'ASSUMPTIONS' && "Step 2: Financial Assumptions"}
                  {screen === 'REPORT' && "Step 3: Analysis Report"}
              </p>
          </div>
          <div className="flex gap-2">
              {['CONTEXT', 'ASSUMPTIONS', 'REPORT'].map((s, i) => (
                  <div key={s} className={`h-2 w-12 rounded-full transition-colors ${screen === s ? 'bg-indigo-500' : ['CONTEXT', 'ASSUMPTIONS', 'REPORT'].indexOf(screen) > i ? 'bg-emerald-500' : 'bg-slate-800'}`}></div>
              ))}
          </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pb-12">
          
          {screen === 'CONTEXT' && (
              <div className="max-w-4xl mx-auto">
                  <ProjectContextTab 
                      data={projectData} 
                      onChange={(updates) => setProjectData({...projectData, ...updates})} 
                  />
                  <div className="mt-8 flex justify-end">
                      <Button onClick={handleContextNext} isLoading={isProcessing} className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg">
                          Next: Financials →
                      </Button>
                  </div>
              </div>
          )}

          {screen === 'ASSUMPTIONS' && assumptions && (
              <div className="max-w-5xl mx-auto">
                  <FinancialAssumptionsTab 
                      assumptions={assumptions} 
                      projectData={projectData}
                      onChange={setAssumptions} 
                      onUpdateProject={(u) => setProjectData({...projectData, ...u})}
                  />
                  <div className="mt-8 flex justify-between">
                      <Button variant="secondary" onClick={() => setScreen('CONTEXT')}>← Back</Button>
                      <Button onClick={handleRunAnalysis} isLoading={isProcessing} className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg">
                          Run Full Analysis
                      </Button>
                  </div>
              </div>
          )}

          {screen === 'REPORT' && report && (
              <div className="max-w-6xl mx-auto space-y-8">
                  
                  {/* Green Screen: Valuation */}
                  <LegacyReportView report={report} />

                  {/* Yellow Section: Economics */}
                  <ProjectEconomicsTab economics={report.economics} />

                  {/* Red Section: Feasibility */}
                  <FeasibilityScoreTab report={report.feasibility} />

                  {/* Blue Section: Dev Notes */}
                  <DeveloperNotesTab notes={report.developerNotes} />

                  <div className="flex justify-start pt-8 border-t border-slate-800">
                      <Button variant="secondary" onClick={() => setScreen('ASSUMPTIONS')}>← Adjust Assumptions</Button>
                  </div>
              </div>
          )}

      </div>
    </div>
  );
};
