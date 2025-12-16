
import React, { useState } from 'react';
import { ProjectWizard } from '../../../../enterprise/client_projects/ui/ProjectWizard';
import { ProjectList } from '../../../../enterprise/client_projects/ui/ProjectList';
import { ProjectDetail } from '../../../../enterprise/client_projects/ui/ProjectDetail';
import { Ent_StandardWorkflow } from '../../../../enterprise/standard_workflow/Ent_StandardWorkflow';

type ViewState = 'LIST' | 'SELECT_TYPE' | 'CREATE_ENTERPRISE' | 'RUN_STANDARD' | 'DETAIL';

interface ClientProjectsProps {
    onNavigate?: (page: string) => void;
}

export const ClientProjects: React.FC<ClientProjectsProps> = ({ onNavigate }) => {
  const [view, setView] = useState<ViewState>('LIST');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const handleCreateComplete = () => {
    setView('LIST');
  };

  const handleSelectProject = (id: string) => {
    setSelectedProjectId(id);
    setView('DETAIL');
  };

  // --- VIEWS ---

  // 1. Standard Simulator Wrapper
  if (view === 'RUN_STANDARD') {
    return (
        <div className="space-y-4 h-full flex flex-col animate-fadeIn">
            <div className="flex items-center justify-between shrink-0 bg-slate-900 p-4 rounded-xl border border-slate-800">
                <button onClick={() => setView('LIST')} className="text-slate-400 hover:text-white text-sm flex items-center gap-2 font-bold">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    Back to Project List
                </button>
                <div className="flex items-center gap-3">
                    <span className="text-slate-500 text-xs uppercase font-bold tracking-wider">Running Mode:</span>
                    <div className="px-3 py-1 bg-indigo-500/20 border border-indigo-500/50 rounded-full text-indigo-300 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                        Standard Simulator
                    </div>
                </div>
            </div>
            <div className="flex-1 overflow-hidden rounded-2xl border border-slate-800 shadow-2xl">
                <Ent_StandardWorkflow />
            </div>
        </div>
    );
  }

  // 2. Enterprise Creator (Wizard)
  if (view === 'CREATE_ENTERPRISE') {
    return <ProjectWizard onComplete={handleCreateComplete} onCancel={() => setView('LIST')} />;
  }

  // 3. Project Detail View (The Enterprise Hub)
  if (view === 'DETAIL' && selectedProjectId) {
    return <ProjectDetail projectId={selectedProjectId} onBack={() => setView('LIST')} />;
  }

  // 4. Selection Screen ("New Project")
  if (view === 'SELECT_TYPE') {
      return (
          <div className="h-full flex flex-col animate-fadeIn">
              <div className="mb-8 flex items-center gap-4">
                  <button onClick={() => setView('LIST')} className="bg-slate-800 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                  </button>
                  <div>
                    <h2 className="text-3xl font-bold text-white font-display">Select Workflow Engine</h2>
                    <p className="text-slate-400 text-lg">Choose the simulation depth that fits your project needs.</p>
                  </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto w-full items-stretch h-[500px]">
                  
                  {/* Option A: Standard */}
                  <button 
                    onClick={() => setView('RUN_STANDARD')}
                    className="group relative bg-slate-900 rounded-3xl p-10 border-2 border-slate-800 hover:border-indigo-500 text-left transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-900/20 overflow-hidden flex flex-col"
                  >
                      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-indigo-500/20 transition-colors"></div>
                      
                      <div className="relative z-10 flex flex-col h-full">
                          <div className="w-20 h-20 bg-indigo-500/20 rounded-2xl flex items-center justify-center text-5xl mb-8 group-hover:scale-110 transition-transform border border-indigo-500/30 shadow-lg">
                              🚀
                          </div>
                          <h3 className="text-3xl font-bold text-white mb-3 group-hover:text-indigo-400 transition-colors font-display">Standard Simulator</h3>
                          <div className="flex gap-2 mb-6">
                              <span className="px-3 py-1 rounded-full bg-indigo-900/50 border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase">Beginner Friendly</span>
                              <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-400 text-xs font-bold uppercase">Linear Flow</span>
                          </div>
                          <p className="text-slate-400 text-base mb-8 leading-relaxed flex-1">
                              A guided, 7-step linear wizard perfect for first-time issuers. 
                              Quickly model your asset, check basic compliance, and generate a summary report.
                          </p>
                          <span className="w-full text-center py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-colors shadow-lg text-sm uppercase tracking-wider">
                              Launch Standard Mode
                          </span>
                      </div>
                  </button>

                  {/* Option B: Enterprise */}
                  <button 
                    onClick={() => setView('CREATE_ENTERPRISE')}
                    className="group relative bg-slate-900 rounded-3xl p-10 border-2 border-slate-800 hover:border-amber-500 text-left transition-all duration-300 hover:shadow-2xl hover:shadow-amber-900/20 overflow-hidden flex flex-col"
                  >
                      <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-amber-500/20 transition-colors"></div>
                      
                      <div className="relative z-10 flex flex-col h-full">
                          <div className="w-20 h-20 bg-amber-500/20 rounded-2xl flex items-center justify-center text-5xl mb-8 group-hover:scale-110 transition-transform border border-amber-500/30 shadow-lg">
                              🏗️
                          </div>
                          <h3 className="text-3xl font-bold text-white mb-3 group-hover:text-amber-400 transition-colors font-display">Enterprise Architect</h3>
                          <div className="flex gap-2 mb-6">
                              <span className="px-3 py-1 rounded-full bg-amber-900/50 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase">Professional</span>
                              <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-400 text-xs font-bold uppercase">Modular</span>
                          </div>
                          <p className="text-slate-400 text-base mb-8 leading-relaxed flex-1">
                              The full power of PropertyDEX. Deep-dive modules for SPV structuring, DCF Valuation, Token Engineering, and Data Room generation.
                          </p>
                          <span className="w-full text-center py-4 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold rounded-xl transition-colors shadow-lg text-sm uppercase tracking-wider">
                              Launch Enterprise Mode
                          </span>
                      </div>
                  </button>

              </div>
          </div>
      );
  }

  // 5. Default List View
  return (
    <div className="space-y-8 animate-fadeIn h-full flex flex-col">
      <div className="flex justify-between items-center shrink-0 bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-lg">
        <div>
          <h2 className="text-3xl font-bold text-white font-display">Client Projects</h2>
          <p className="text-slate-400 text-sm mt-1">Manage your active deal pipeline and simulations.</p>
        </div>
        <button 
          onClick={() => setView('SELECT_TYPE')}
          className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-900 px-8 py-3 rounded-xl text-sm font-bold shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2 hover:-translate-y-0.5"
        >
          <span className="text-lg font-bold">+</span> New Project
        </button>
      </div>

      <div className="flex-1 overflow-hidden">
        <ProjectList onSelectProject={handleSelectProject} />
      </div>
    </div>
  );
};
