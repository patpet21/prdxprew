
import React from 'react';

interface AcademySidebarProps {
  activeModule: string;
  onSelect: (id: string) => void;
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (page: string) => void;
}

export const AcademySidebar: React.FC<AcademySidebarProps> = ({ activeModule, onSelect, isOpen, onClose, onNavigate }) => {
  
  const fundamentals = [
    { id: 'basics', label: 'Tokenization 101', icon: '📚' },
    { id: 'assets', label: 'Asset Classes', icon: '💎' },
    { id: 'legal', label: 'Legal Structures', icon: '⚖️' },
    { id: 'lifecycle', label: 'Asset Lifecycle', icon: '🔄' },
  ];

  const curriculum = [
    { id: 'onboarding_theory', label: '01. Onboarding & Asset Logic', icon: '🚀' },
    { id: 'vision_goals_theory', label: '02. Vision & Goals', icon: '👁️' },
    { id: 'regulation_licenses_101', label: '03. Regulation & Licenses', icon: '📜' },
    { id: 'jurisdiction_spv_theory', label: '04. Jurisdiction & SPV', icon: '🏛️' },
    { id: 'asset_market_theory', label: '05. Asset & Market', icon: '🏗️' },
    { id: 'financials_roi_theory', label: '06. Financials & ROI', icon: '📊' },
    { id: 'legal_compliance_theory', label: '07. Legal & Compliance', icon: '🛡️' },
    { id: 'token_design_theory', label: '08. Token Design', icon: '🪙' },
    { id: 'distribution_theory', label: '09. Distribution Strategy', icon: '📢' },
    { id: 'payout_treasury_theory', label: '10. Payout & Treasury', icon: '💸' },
    { id: 'reports_roadmap_theory', label: '11. Reports & Roadmap', icon: '🗺️' },
    { id: 'compare_choices_theory', label: '12. Compare Choices', icon: '⚖️' },
    { id: 'build_real_project_theory', label: '13. Build Real Project', icon: '🏗️' },
    { id: 'final_exam', label: '🏆 Final Exam', icon: '🎓' },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      <div 
        className={`fixed inset-0 bg-prdx-blue/50 backdrop-blur-sm z-40 lg:hidden transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 transform 
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 border-b border-slate-100 bg-white flex items-center gap-3">
           <img 
              src="https://i.ibb.co/5g7gFLQz/Logo-PRDX.jpg" 
              alt="PropertyDEX Logo" 
              className="h-10 w-10 rounded-lg object-contain"
           />
           <div>
               <h2 className="text-sm font-bold font-display text-prdx-blue tracking-tight leading-tight">
                 PropertyDEX <br/> <span className="text-slate-500 font-sans font-normal normal-case">Tokenization Insights</span>
               </h2>
           </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
            
            {/* Section 1: Fundamentals */}
            <div>
                <h3 className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                    Fundamentals
                </h3>
                <div className="space-y-1">
                    {fundamentals.map((item) => {
                        const isActive = activeModule === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => { onSelect(item.id); onClose(); }}
                                className={`
                                    w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all group border
                                    ${isActive 
                                        ? 'bg-prdx-cyan/10 text-prdx-blue border-prdx-cyan/20' 
                                        : 'text-slate-500 border-transparent hover:text-prdx-cyan hover:bg-slate-50'
                                    }
                                `}
                            >
                                <span className={`text-base ${isActive ? 'text-prdx-cyan' : 'text-slate-400'}`}>{item.icon}</span>
                                <span className="truncate">{item.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Section 2: Pro Masterclass */}
            <div>
                <h3 className="px-3 text-[10px] font-bold text-prdx-purple uppercase tracking-widest mb-2">
                    Architect
                </h3>
                <div className="space-y-1">
                    {curriculum.map((item) => {
                        const isActive = activeModule === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => { onSelect(item.id); onClose(); }}
                                className={`
                                    w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all group border
                                    ${isActive 
                                        ? 'bg-prdx-orange/10 text-prdx-orange border-prdx-orange/20 shadow-sm' 
                                        : 'text-slate-500 border-transparent hover:text-prdx-orange hover:bg-orange-50/50'
                                    }
                                `}
                            >
                                <span className={`text-base transition-transform group-hover:scale-110 ${isActive ? 'text-prdx-orange scale-110' : 'text-slate-400'}`}>{item.icon}</span>
                                <span className="truncate">{item.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

        </div>

        <div className="p-4 bg-white border-t border-slate-100">
            <div className="bg-gradient-to-r from-prdx-blue to-prdx-deep-purple rounded-xl p-4 text-center text-white shadow-lg">
                <p className="text-xs font-bold mb-3 opacity-90">Start Building?</p>
                <button 
                    onClick={() => { if(onNavigate) onNavigate('SIM_INTRO'); }} 
                    className="w-full py-2.5 bg-white text-prdx-blue hover:text-prdx-deep-purple text-xs font-bold uppercase rounded-lg transition-colors shadow-sm"
                >
                    Launch Free Simulator
                </button>
            </div>
        </div>
      </aside>
    </>
  );
};
