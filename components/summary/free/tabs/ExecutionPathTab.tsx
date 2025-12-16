
import React, { useState } from 'react';
import { Button } from '../../../../components/ui/Button';

interface Props {
  onNext?: () => void;
}

interface RoadmapItem {
    id: number;
    title: string;
    desc: string;
    isCompleted: boolean;
    isLocked: boolean;
}

export const ExecutionPathTab: React.FC<Props> = ({ onNext }) => {
  // Initial state with actionable items
  const [roadmap, setRoadmap] = useState<RoadmapItem[]>([
      { id: 1, title: "SPV Incorporation", desc: "Formation of the legal entity (LLC, S.r.l.) to hold the asset.", isCompleted: false, isLocked: false },
      { id: 2, title: "Corporate Resolutions", desc: "Board approval to tokenize asset and issue securities.", isCompleted: false, isLocked: false },
      { id: 3, title: "KYC/AML Onboarding", desc: "Setup of identity verification portal for investors.", isCompleted: false, isLocked: false },
      { id: 4, title: "Token Minting", desc: "Deployment of ERC-3643 Smart Contracts on mainnet.", isCompleted: false, isLocked: false },
      { id: 5, title: "Custody Setup", desc: "Configuration of wallets and digital asset custody.", isCompleted: false, isLocked: false },
      { id: 6, title: "Distribution Logic", desc: "Programming of yield, dividends, and redemption rules.", isCompleted: false, isLocked: false },
      { id: 7, title: "Regulatory Filings", desc: "Submission of Form D (US) or other local notifications.", isCompleted: false, isLocked: false },
      { id: 8, title: "Marketplace Listing", desc: "Integration with secondary market platforms.", isCompleted: false, isLocked: false },
      { id: 9, title: "Go-Live & Capital Raise", desc: "Opening the offering to investors.", isCompleted: false, isLocked: true }, // Locked until others done (simulated)
  ]);

  const toggleStep = (id: number) => {
      setRoadmap(prev => prev.map(item => {
          if (item.id === id && !item.isLocked) {
              return { ...item, isCompleted: !item.isCompleted };
          }
          return item;
      }));
  };

  // Calculate progress
  const completedCount = roadmap.filter(r => r.isCompleted).length;
  const progress = Math.round((completedCount / (roadmap.length - 1)) * 100); // Exclude locked step

  return (
    <div className="animate-fadeIn space-y-8 h-full flex flex-col">
        
        <div className="flex justify-between items-end border-b border-slate-200 pb-6">
            <div>
                <h3 className="text-3xl font-bold text-slate-900 font-display">Execution Roadmap</h3>
                <p className="text-slate-500 text-lg mt-1">Interactive checklist for your tokenization journey.</p>
            </div>
            <div className="flex flex-col items-end">
                <span className="text-3xl font-bold text-indigo-600 font-display">{progress}%</span>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ready to Launch</span>
            </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
            <div className="space-y-4">
                {roadmap.map((step, i) => (
                    <div 
                        key={step.id} 
                        onClick={() => toggleStep(step.id)}
                        className={`
                            relative flex items-start gap-6 p-6 rounded-2xl border-2 transition-all duration-200 group
                            ${step.isLocked 
                                ? 'bg-slate-50 border-slate-100 opacity-60 cursor-not-allowed' 
                                : 'bg-white cursor-pointer hover:shadow-md'
                            }
                            ${step.isCompleted ? 'border-emerald-200 bg-emerald-50/30' : 'border-slate-100 hover:border-indigo-200'}
                        `}
                    >
                        {/* Checkbox Visual */}
                        <div className={`
                            w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all mt-1
                            ${step.isCompleted 
                                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200 scale-110' 
                                : step.isLocked 
                                    ? 'bg-slate-200 text-slate-400' 
                                    : 'bg-white border-2 border-slate-200 text-transparent group-hover:border-indigo-300'
                            }
                        `}>
                            {step.isLocked ? '🔒' : '✓'}
                        </div>

                        <div className="flex-1">
                            <div className="flex justify-between items-center mb-1">
                                <h4 className={`font-bold text-lg ${step.isCompleted ? 'text-slate-800 line-through opacity-50' : 'text-slate-900'}`}>
                                    {step.title}
                                </h4>
                                {step.isCompleted && <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Done</span>}
                            </div>
                            <p className={`text-sm leading-relaxed ${step.isCompleted ? 'text-slate-400' : 'text-slate-500'}`}>
                                {step.desc}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {onNext && (
          <div className="mt-auto pt-8 flex justify-end border-t border-slate-100">
             <Button onClick={onNext} className="bg-slate-900 text-white hover:bg-slate-800 shadow-xl px-10 py-4 font-bold text-base">
                 Explore Enterprise Features →
             </Button>
          </div>
        )}
    </div>
  );
};
