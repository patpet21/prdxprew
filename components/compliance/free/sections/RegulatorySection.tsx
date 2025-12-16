
import React from 'react';
import { ComplianceData } from '../../../../types';
import { TooltipAI } from '../../../ui/TooltipAI';

interface Props {
  compliance: ComplianceData;
  updateData: (field: string, val: any) => void;
}

export const RegulatorySection: React.FC<Props> = ({ compliance, updateData }) => {
  
  const frameworks = [
      { 
          id: 'Reg D', 
          label: 'US – Reg D 506(c)', 
          desc: 'General solicitation allowed. Accredited Investors only. Unlimited raise.',
          icon: '🇺🇸',
          tooltip: 'Reg D 506(c)'
      },
      { 
          id: 'Reg S', 
          label: 'International – Reg S', 
          desc: 'Non-US investors only. No SEC registration required.',
          icon: '🌍',
          tooltip: 'Reg S'
      },
      { 
          id: 'MiCA', 
          label: 'EU – MiCA / Prospectus', 
          desc: 'European standard. Strict consumer protection & whitepaper rules.',
          icon: '🇪🇺',
          tooltip: 'MiCA'
      },
      { 
          id: 'Institutional', 
          label: 'Institutional / Wholesale', 
          desc: 'High ticket sizes only. Professional investors. Lower friction.',
          icon: '🏛️'
      },
      { 
          id: 'Simulation', 
          label: 'Simulation Mode', 
          desc: 'Educational sandbox. No constraints applied.',
          icon: '🎮'
      }
  ];

  const getAiLogicMessage = (framework: string) => {
    switch (framework) {
      case 'Reg D': return "AI Analysis: Enables public marketing in the US but enforces strict KYC/Accreditation checks (Rule 506c).";
      case 'Reg S': return "AI Analysis: Strictly excludes US persons. Requires IP geoblocking and 'Non-US Person' declaration.";
      case 'MiCA': return "AI Analysis: Triggers ESMA reporting obligations. Whitepaper must be approved by a local authority (e.g. AMF/BaFin).";
      case 'Institutional': return "AI Analysis: Exempt from most prospectus requirements due to high minimum investment threshold.";
      case 'Simulation': return "AI Analysis: Sandbox active. Regulatory checks disabled for learning purposes.";
      default: return "Select a framework to run AI regulatory analysis.";
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center text-lg font-bold shadow-lg shadow-blue-600/20">1</div>
            <div>
                <h3 className="font-bold text-slate-900 text-lg leading-tight">Regulatory Framework</h3>
                <p className="text-slate-500 text-xs">Select the legal lane for your offering.</p>
            </div>
          </div>
          {compliance.regFramework && (
             <span className="text-xs font-bold bg-blue-50 text-blue-600 px-3 py-1 rounded-full border border-blue-100 hidden sm:inline-block">
                 {compliance.regFramework} Active
             </span>
          )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
          {frameworks.map((fw) => (
              <button
                  key={fw.id}
                  onClick={() => updateData('regFramework', fw.id)}
                  className={`
                      relative p-4 rounded-xl border-2 text-left transition-all duration-200 flex flex-col h-full group
                      ${compliance.regFramework === fw.id 
                          ? 'bg-slate-900 border-slate-900 shadow-xl scale-[1.02]' 
                          : 'bg-white border-slate-200 hover:border-blue-400 hover:shadow-md'
                      }
                  `}
              >
                  <div className="flex justify-between items-start mb-3">
                      <span className="text-2xl">{fw.icon}</span>
                      {compliance.regFramework === fw.id && <span className="text-emerald-400 text-lg">✔</span>}
                  </div>
                  <div className={`font-bold text-sm mb-2 flex items-center flex-wrap gap-1 ${compliance.regFramework === fw.id ? 'text-white' : 'text-slate-900'}`}>
                      {fw.label}
                      {fw.tooltip && <TooltipAI term={fw.tooltip} />}
                  </div>
                  <p className={`text-xs leading-relaxed ${compliance.regFramework === fw.id ? 'text-slate-400' : 'text-slate-500'}`}>
                      {fw.desc}
                  </p>
              </button>
          ))}
      </div>

      {/* AI Logic Box */}
      <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex gap-4 items-center mt-auto">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-xl shrink-0">
             🤖
          </div>
          <div>
              <p className="text-sm text-slate-700 font-medium leading-snug">
                  {getAiLogicMessage(compliance.regFramework)}
              </p>
          </div>
      </div>
    </div>
  );
};
