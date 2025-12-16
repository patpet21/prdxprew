
import React, { useState } from 'react';
import { TokenizationState } from '../../types';
import { GET_ROADMAP_DATA, RoadmapStep, RoadmapStatus } from '../../content/pre_deployment/regulatoryRoadmapData';
import { Button } from '../ui/Button';

interface Props {
  data: TokenizationState;
}

export const RegulatoryRoadmapTab: React.FC<Props> = ({ data }) => {
  const steps = GET_ROADMAP_DATA(data);
  const [expandedStep, setExpandedStep] = useState<number | null>(1); // Default first open

  const toggleStep = (id: number) => {
    setExpandedStep(expandedStep === id ? null : id);
  };

  const getStatusColor = (status: RoadmapStatus) => {
      switch(status) {
          case 'READY': return 'bg-emerald-500 text-white';
          case 'PENDING': return 'bg-yellow-500 text-slate-900';
          case 'CONDITIONAL': return 'bg-orange-500 text-white';
          case 'LOCKED': return 'bg-slate-600 text-slate-300';
          default: return 'bg-slate-500';
      }
  };

  const getBorderColor = (status: RoadmapStatus) => {
      switch(status) {
          case 'READY': return 'border-emerald-500';
          case 'PENDING': return 'border-yellow-500';
          case 'CONDITIONAL': return 'border-orange-500';
          case 'LOCKED': return 'border-slate-700';
          default: return 'border-slate-500';
      }
  };

  return (
    <div className="animate-fadeIn pb-12">
        
        <div className="text-center mb-10 max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold text-slate-900 font-display mb-3">Regulatory Roadmap</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
                This roadmap visualizes the <strong>actual institutional process</strong> to bring a tokenized asset to market.
                <br/>The Free Simulator prepares the structure (Steps 1-2). PRO & Enterprise unlock execution.
            </p>
        </div>

        <div className="relative max-w-4xl mx-auto px-4">
            {/* Vertical Line */}
            <div className="absolute left-8 top-4 bottom-4 w-1 bg-slate-200 hidden md:block"></div>

            <div className="space-y-6">
                {steps.map((step) => {
                    const isOpen = expandedStep === step.id;
                    const borderColor = getBorderColor(step.status);
                    
                    return (
                        <div key={step.id} className="relative flex flex-col md:flex-row gap-6 group">
                            
                            {/* Number Bubble (Desktop) */}
                            <div className={`hidden md:flex flex-col items-center flex-shrink-0 z-10`}>
                                <div 
                                    className={`w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold border-4 transition-all duration-300 shadow-sm ${borderColor} ${step.status === 'LOCKED' ? 'bg-slate-100 text-slate-400' : 'bg-white text-slate-900'}`}
                                >
                                    {step.status === 'READY' ? '✓' : step.id}
                                </div>
                            </div>

                            {/* Card */}
                            <div 
                                onClick={() => toggleStep(step.id)}
                                className={`flex-1 bg-white rounded-2xl border-l-4 shadow-sm transition-all duration-300 cursor-pointer overflow-hidden ${borderColor} ${isOpen ? 'shadow-lg ring-1 ring-slate-200' : 'hover:shadow-md'}`}
                            >
                                {/* Header */}
                                <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <span className="md:hidden font-bold text-slate-400 text-lg">#{step.id}</span>
                                        <h4 className={`text-lg font-bold ${step.status === 'LOCKED' ? 'text-slate-500' : 'text-slate-900'}`}>
                                            {step.title}
                                        </h4>
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider self-start sm:self-center ${getStatusColor(step.status)}`}>
                                        {step.badgeText}
                                    </div>
                                </div>

                                {/* Body (Collapsible) */}
                                <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                    <div className="px-5 pb-5 border-t border-slate-100 pt-4 bg-slate-50/50">
                                        
                                        <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                                            {step.description}
                                        </p>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                            {step.details.map((detail, idx) => (
                                                <div key={idx}>
                                                    <h5 className="text-xs font-bold text-slate-400 uppercase mb-2 tracking-wider">{detail.label}</h5>
                                                    <ul className="space-y-1">
                                                        {detail.content.map((item, i) => (
                                                            <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                                                                <span className="text-slate-400 text-xs mt-1">●</span> {item}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            ))}
                                            
                                            {/* Output Box */}
                                            <div className="bg-slate-200/50 rounded-xl p-3 border border-slate-200">
                                                <h5 className="text-[10px] font-bold text-slate-500 uppercase mb-1">Expected Output</h5>
                                                <p className="text-xs text-slate-800 font-mono font-medium">{step.output}</p>
                                            </div>
                                        </div>

                                        {step.upsell && (
                                            <div className="flex justify-end">
                                                <Button size="sm" className={`text-xs ${step.status === 'READY' ? 'bg-slate-900 text-white' : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white border-none shadow-lg shadow-amber-500/20'}`}>
                                                    {step.status === 'READY' ? 'View Simulated Output' : 'Unlock in PRO Version'}
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Bottom Summary */}
            <div className="mt-12 bg-slate-900 rounded-3xl p-8 text-center text-white relative overflow-hidden shadow-2xl">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
                 <div className="relative z-10">
                     <p className="text-lg font-medium leading-relaxed max-w-2xl mx-auto">
                         "Questa roadmap ti mostra il percorso reale per portare un asset tokenizzato sul mercato.
                         <br/><span className="text-slate-400 text-base">Nella versione Free visualizzi la preparazione e la struttura generale. Con la PRO/Enterprise puoi completare i passaggi effettivi.</span>"
                     </p>
                 </div>
            </div>
        </div>
    </div>
  );
};
