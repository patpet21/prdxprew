
import React, { useState, useEffect } from 'react';
import { Button } from '../../../../ui/Button';
import { generateExecutionMap } from '../../../../../services/mockAiService';

interface Phase {
    phaseName: string;
    durationWeeks: number;
    budgetRange: string;
    deliverables: string[];
    owners: string[];
    dependencies: string[];
    failureModes: string[];
    riskSeverity: number;
    coachTip: string;
    riskSimulator?: {
        budgetCut: string;
        acceleration: string;
        ignoredDependency: string;
    };
}

interface ExecutionMapResponse {
    education?: string[];
    executionTimeline: {
        phases: Phase[];
    };
    benchmarkComparison?: string[];
    recommendations?: { type: string, text: string }[];
    reasoningWhyThisStepExists?: string;
}

export const ExecutionMap: React.FC = () => {
    const [inputs, setInputs] = useState({
        timeHorizonMonths: 6,
        teamSize: 2,
        estimatedBudget: 50000,
        jurisdictionComplexity: 'Medium',
        preferredLaunchMode: 'private raise'
    });

    const [mapData, setMapData] = useState<ExecutionMapResponse | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [activePhaseIndex, setActivePhaseIndex] = useState<number | null>(null);

    // Load context if available
    useEffect(() => {
        const saved = localStorage.getItem('academyPro_reports');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (parsed.executionMap) {
                    setMapData(parsed.executionMap);
                }
            } catch (e) { console.error(e); }
        }
    }, []);

    const handleGenerate = async () => {
        setIsGenerating(true);
        const fullContext = JSON.parse(localStorage.getItem('pdx_simulator_state') || '{}');
        // Augment
        fullContext.proLegal = JSON.parse(localStorage.getItem('academyPro_spvModule') || '{}');
        
        const result = await generateExecutionMap(fullContext, inputs);
        
        if (result && result.executionTimeline) {
            setMapData(result);
            if (result.executionTimeline.phases?.length > 0) {
                setActivePhaseIndex(0);
            }
            
            // Auto Save
            const currentReports = JSON.parse(localStorage.getItem('academyPro_reports') || '{}');
            currentReports.executionMap = result;
            localStorage.setItem('academyPro_reports', JSON.stringify(currentReports));
        }
        
        setIsGenerating(false);
    };

    const getRiskColor = (severity: number) => {
        if (severity >= 4) return 'bg-red-500 text-white';
        if (severity === 3) return 'bg-amber-500 text-slate-900';
        return 'bg-emerald-500 text-white';
    };

    const activePhase = mapData?.executionTimeline?.phases?.[activePhaseIndex ?? -1];

    return (
        <div className="flex flex-col h-full bg-slate-50 rounded-xl overflow-hidden border border-slate-200">
            
            {/* CONFIG HEADER */}
            <div className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
                <div>
                    <h3 className="font-bold text-slate-900 text-lg">Execution Map</h3>
                    <p className="text-slate-500 text-xs">Plan the critical path to launch.</p>
                </div>
                <div className="flex gap-4 items-center">
                    <div className="flex items-center gap-2">
                        <label className="text-xs font-bold text-slate-400 uppercase">Timeline (Mo)</label>
                        <input 
                            type="number" 
                            value={inputs.timeHorizonMonths}
                            onChange={e => setInputs({...inputs, timeHorizonMonths: parseInt(e.target.value)})}
                            className="w-16 p-2 bg-slate-50 border border-slate-200 rounded text-sm font-bold"
                        />
                    </div>
                     <div className="flex items-center gap-2">
                        <label className="text-xs font-bold text-slate-400 uppercase">Budget ($)</label>
                        <input 
                            type="number" 
                            value={inputs.estimatedBudget}
                            onChange={e => setInputs({...inputs, estimatedBudget: parseInt(e.target.value)})}
                            className="w-24 p-2 bg-slate-50 border border-slate-200 rounded text-sm font-bold"
                        />
                    </div>
                    <Button onClick={handleGenerate} isLoading={isGenerating} className="bg-slate-900 text-white shadow-lg">
                        {mapData ? 'Regenerate Plan' : 'Build Roadmap'}
                    </Button>
                </div>
            </div>

            <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
                
                {/* LEFT: TIMELINE VISUALIZER */}
                <div className="w-full md:w-1/3 bg-white border-r border-slate-200 overflow-y-auto p-6">
                    {!mapData ? (
                        <div className="text-center text-slate-400 mt-20">
                            <span className="text-4xl block mb-2">🗺️</span>
                            Configure & Build to see phases.
                        </div>
                    ) : (
                        <div className="space-y-6 relative">
                            {/* Line */}
                            <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-slate-100"></div>

                            {mapData.executionTimeline?.phases?.map((phase, idx) => {
                                if (!phase) return null;
                                return (
                                <div 
                                    key={idx} 
                                    onClick={() => setActivePhaseIndex(idx)}
                                    className={`
                                        relative pl-10 cursor-pointer transition-all duration-300
                                        ${activePhaseIndex === idx ? 'opacity-100 scale-105' : 'opacity-60 hover:opacity-100'}
                                    `}
                                >
                                    <div className={`
                                        absolute left-2 top-0 w-4 h-4 rounded-full border-2 border-white shadow-sm z-10
                                        ${activePhaseIndex === idx ? 'bg-indigo-600 scale-125' : 'bg-slate-300'}
                                    `}></div>
                                    
                                    <div className={`p-4 rounded-xl border transition-all ${activePhaseIndex === idx ? 'bg-indigo-50 border-indigo-200 shadow-md' : 'bg-white border-slate-200'}`}>
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className="font-bold text-slate-900 text-sm">{phase.phaseName}</h4>
                                            <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${getRiskColor(phase.riskSeverity)}`}>
                                                Risk: {phase.riskSeverity}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-xs text-slate-500">
                                            <span>{phase.durationWeeks} Weeks</span>
                                            <span>{phase.budgetRange}</span>
                                        </div>
                                    </div>
                                </div>
                            )})}
                            {(!mapData.executionTimeline?.phases || mapData.executionTimeline.phases.length === 0) && (
                                <div className="text-center text-slate-400 p-4">No phases generated. Try regenerating.</div>
                            )}
                        </div>
                    )}
                </div>

                {/* RIGHT: PHASE DETAIL & RISK SIMULATOR */}
                <div className="flex-1 bg-slate-50 p-8 overflow-y-auto custom-scrollbar">
                    {mapData && activePhase ? (
                        <div className="max-w-3xl mx-auto space-y-8 animate-slideUp">
                            
                            {/* Detail Card */}
                            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center text-2xl font-bold">
                                        {(activePhaseIndex ?? 0) + 1}
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-slate-900 font-display">
                                            {activePhase.phaseName}
                                        </h2>
                                        <p className="text-slate-500 text-sm">
                                            Owner: <span className="font-bold">{activePhase.owners?.join(', ') || 'Team'}</span>
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Deliverables</h5>
                                        <ul className="space-y-2">
                                            {activePhase.deliverables?.map((item, i) => (
                                                <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                                                    <span className="text-emerald-500 font-bold">✓</span> {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Dependencies</h5>
                                        <ul className="space-y-2">
                                            {activePhase.dependencies?.map((item, i) => (
                                                <li key={i} className="flex items-start gap-2 text-sm text-slate-600 italic">
                                                    <span className="text-slate-300">↳</span> {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                <div className="mt-8 pt-6 border-t border-slate-100">
                                    <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg">
                                        <h5 className="text-xs font-bold text-amber-800 uppercase mb-1">Failure Modes</h5>
                                        <ul className="list-disc list-inside text-sm text-amber-900/80 space-y-1">
                                            {activePhase.failureModes?.map((m, i) => <li key={i}>{m}</li>)}
                                        </ul>
                                    </div>
                                </div>
                                
                                <div className="mt-4 flex items-center gap-2 text-xs text-indigo-600 bg-indigo-50 p-3 rounded-lg border border-indigo-100">
                                    <span className="text-lg">🎓</span>
                                    <strong>Coach Tip:</strong> {activePhase.coachTip}
                                </div>
                            </div>

                            {/* Risk Simulator */}
                            <div className="bg-slate-900 rounded-2xl p-8 border border-slate-800 text-white">
                                <h4 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                    <span className="text-red-500">⚡</span> Risk Simulator
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                                        <h5 className="text-xs font-bold text-red-400 uppercase mb-2">If Budget Cut 50%</h5>
                                        <p className="text-xs text-slate-300 leading-relaxed">
                                            {activePhase.riskSimulator?.budgetCut || "N/A"}
                                        </p>
                                    </div>
                                    <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                                        <h5 className="text-xs font-bold text-orange-400 uppercase mb-2">If Accelerated</h5>
                                        <p className="text-xs text-slate-300 leading-relaxed">
                                            {activePhase.riskSimulator?.acceleration || "N/A"}
                                        </p>
                                    </div>
                                    <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                                        <h5 className="text-xs font-bold text-purple-400 uppercase mb-2">If Dependency Skipped</h5>
                                        <p className="text-xs text-slate-300 leading-relaxed">
                                            {activePhase.riskSimulator?.ignoredDependency || "N/A"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center text-slate-400">
                            Select a phase to view details.
                        </div>
                    )}
                </div>
            </div>

            {/* FOOTER */}
            {mapData && (
                <div className="h-16 bg-white border-t border-slate-200 flex items-center justify-between px-6 shrink-0">
                    <div className="text-xs text-slate-500">
                        Total Duration: <strong className="text-slate-900">{mapData.executionTimeline?.phases?.reduce((acc, p) => acc + (p?.durationWeeks || 0), 0) || 0} Weeks</strong>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="secondary" onClick={() => alert("Saved!")}>Save Progress</Button>
                        <Button className="bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg">
                            Export Roadmap PDF
                        </Button>
                    </div>
                </div>
            )}

        </div>
    );
};
