
import React, { useState, useEffect } from 'react';
import { Button } from '../../../ui/Button';
import { Input } from '../../../ui/Input';
import { Select } from '../../../ui/Select';
import { 
    buildProjectSnapshot, 
    buildAssetLogic, 
    buildCapitalStack,
    buildTokenomics,
    buildValueMatrix,
    buildRiskReality,
    buildExecutionReality,
    buildReadinessScore,
    buildNextActions,
    buildFinalNarrative
} from '../../../../services/mockAiService';
import { AcademyPdfService } from '../../../../services/academyPdfService';

// --- ICONS & ASSETS ---
const ICONS = {
    snapshot: "🧬",
    asset: "🏙️",
    stack: "🥞",
    token: "🪙",
    value: "⚖️",
    risk: "🚩",
    exec: "⚙️",
    score: "🏆",
    action: "🚀"
};

// --- TYPES & CONFIG ---
type StepId = 'SNAPSHOT' | 'ASSET' | 'STACK' | 'TOKEN' | 'VALUE' | 'RISK' | 'EXECUTION' | 'READINESS' | 'ACTIONS';

const STEPS: { id: StepId; label: string; desc: string; icon: string }[] = [
    { id: 'SNAPSHOT', label: 'Project DNA', desc: 'Core concept & identity', icon: ICONS.snapshot },
    { id: 'ASSET', label: 'Asset Logic', desc: 'Why tokenize this?', icon: ICONS.asset },
    { id: 'STACK', label: 'Capital Stack', desc: 'Financial structure', icon: ICONS.stack },
    { id: 'TOKEN', label: 'Tokenomics', desc: 'Supply & Pricing', icon: ICONS.token },
    { id: 'VALUE', label: 'Value Matrix', desc: 'Investor vs Sponsor', icon: ICONS.value },
    { id: 'RISK', label: 'Risk Reality', desc: 'Critical flaws check', icon: ICONS.risk },
    { id: 'EXECUTION', label: 'Execution', desc: 'Timeline & Ops', icon: ICONS.exec },
    { id: 'READINESS', label: 'Scorecard', desc: 'Go/No-Go verdict', icon: ICONS.score },
    { id: 'ACTIONS', label: 'Next Steps', desc: 'Operational plan', icon: ICONS.action }
];

// --- SUB-COMPONENTS (THEORY & AI TOOLS) ---

// 1. SNAPSHOT
const StepSnapshot = ({ data, onSave }: any) => {
    const [inputs, setInputs] = useState(data?.inputs || { projectName: '', objective: 'Liquidity', description: '', personalStory: '' });
    const [aiResult, setAiResult] = useState<any>(data?.result || null);
    const [loading, setLoading] = useState(false);

    const handleAnalyze = async () => {
        setLoading(true);
        const res = await buildProjectSnapshot(inputs);
        setAiResult(res);
        setLoading(false);
        onSave({ inputs, result: res });
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
            <div className="space-y-6">
                <div className="bg-slate-900/80 backdrop-blur-md p-6 rounded-3xl border border-slate-700/50 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-[50px] -mr-16 -mt-16 pointer-events-none group-hover:bg-indigo-500/30 transition-colors"></div>
                    <h4 className="text-indigo-400 font-bold uppercase text-xs tracking-widest mb-6 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
                        Input Context
                    </h4>
                    <div className="space-y-5">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase">Project Name</label>
                            <input 
                                value={inputs.projectName} 
                                onChange={e => setInputs({...inputs, projectName: e.target.value})} 
                                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-600"
                                placeholder="e.g. Skyline Alpha"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase">Primary Objective</label>
                            <select 
                                value={inputs.objective} 
                                onChange={e => setInputs({...inputs, objective: e.target.value})} 
                                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none appearance-none cursor-pointer"
                            >
                                <option value="Liquidity">Liquidity</option>
                                <option value="Capital">Capital Raise</option>
                                <option value="Community">Community</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase block mb-2">Project Vision (Rough Draft)</label>
                            <textarea 
                                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 text-white h-32 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none resize-none leading-relaxed placeholder:text-slate-600" 
                                value={inputs.description} 
                                onChange={e => setInputs({...inputs, description: e.target.value})} 
                                placeholder="Describe your asset, your goal, and what makes it special..." 
                            />
                        </div>
                    </div>
                    <div className="mt-8">
                        <Button onClick={handleAnalyze} isLoading={loading} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 py-4 text-lg font-bold rounded-xl">
                            {loading ? 'Processing DNA...' : '✨ Generate Professional Snapshot'}
                        </Button>
                    </div>
                </div>
            </div>
            
            <div className="flex flex-col h-full">
                {aiResult ? (
                    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 rounded-3xl border border-indigo-500/30 flex-1 flex flex-col relative overflow-hidden shadow-2xl animate-scaleIn">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px] -ml-20 -mb-20 pointer-events-none"></div>
                        
                        <div className="relative z-10 flex items-center justify-between mb-8">
                            <h4 className="text-white font-display text-2xl">Institutional Profile</h4>
                            <div className="px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-wider">
                                AI Generated
                            </div>
                        </div>
                        
                        <div className="space-y-6 relative z-10">
                            <div className="p-6 bg-slate-950/50 rounded-2xl border border-white/5 shadow-inner">
                                <span className="text-xs text-indigo-400 uppercase font-bold block mb-3">Professional Summary</span>
                                <p className="text-slate-200 text-base leading-loose font-light">"{aiResult.professionalSummary}"</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-5 bg-slate-950/50 rounded-2xl border border-white/5">
                                    <span className="text-xs text-slate-500 uppercase font-bold block mb-1">Phase</span>
                                    <span className="text-emerald-400 font-bold text-lg">{aiResult.phaseAnalysis}</span>
                                </div>
                                <div className="p-5 bg-slate-950/50 rounded-2xl border border-white/5">
                                    <span className="text-xs text-slate-500 uppercase font-bold block mb-1">Core Driver</span>
                                    <span className="text-blue-400 font-bold text-lg">{aiResult.coreObjective}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 bg-slate-900/30 rounded-3xl border-2 border-dashed border-slate-800 flex flex-col items-center justify-center text-slate-600 gap-4">
                        <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center animate-pulse">
                            <span className="text-4xl">🧬</span>
                        </div>
                        <span className="text-sm font-medium">Awaiting Input Analysis...</span>
                    </div>
                )}
            </div>
        </div>
    );
};

// 2. ASSET LOGIC
const StepAssetLogic = ({ data, onSave }: any) => {
    const [inputs, setInputs] = useState(data?.inputs || { assetType: 'Real Estate', location: '', uniqueValue: '' });
    const [aiResult, setAiResult] = useState<any>(data?.result || null);
    const [loading, setLoading] = useState(false);

    const handleAnalyze = async () => {
        setLoading(true);
        const res = await buildAssetLogic(inputs);
        setAiResult(res);
        setLoading(false);
        onSave({ inputs, result: res });
    };

    return (
        <div className="space-y-8 animate-fadeIn">
            <div className="bg-slate-900/80 backdrop-blur-md p-8 rounded-3xl border border-slate-700/50 shadow-xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-400 uppercase">Asset Type</label>
                        <input value={inputs.assetType} onChange={e => setInputs({...inputs, assetType: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-400 uppercase">Location</label>
                        <input value={inputs.location} onChange={e => setInputs({...inputs, location: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none" />
                    </div>
                    <div className="md:col-span-2 space-y-1">
                        <label className="text-xs font-bold text-slate-400 uppercase">Why this asset?</label>
                        <textarea className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 text-white h-32 focus:border-indigo-500 outline-none resize-none leading-relaxed" 
                            value={inputs.uniqueValue} onChange={e => setInputs({...inputs, uniqueValue: e.target.value})} placeholder="e.g. Below market price, high yield potential..." />
                    </div>
                </div>
                <div className="mt-8 flex justify-end">
                    <Button onClick={handleAnalyze} isLoading={loading} className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg px-8 py-3 rounded-xl font-bold">
                        {loading ? 'Validating...' : 'Validate Asset Logic'}
                    </Button>
                </div>
            </div>

            {aiResult && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-slideUp">
                    <div className="bg-blue-900/20 border border-blue-500/30 p-8 rounded-3xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-6 opacity-20 text-6xl">💡</div>
                        <h5 className="text-blue-400 font-bold uppercase text-xs tracking-widest mb-4">Tokenization Logic</h5>
                        <p className="text-blue-100 text-base leading-relaxed">{aiResult.tokenizationLogic}</p>
                    </div>
                    <div className="bg-emerald-900/20 border border-emerald-500/30 p-8 rounded-3xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-6 opacity-20 text-6xl">📈</div>
                        <h5 className="text-emerald-400 font-bold uppercase text-xs tracking-widest mb-4">Value Creation Thesis</h5>
                        <p className="text-emerald-100 text-base leading-relaxed">{aiResult.valueCreationThesis}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

// 3. CAPITAL STACK
const StepCapitalStack = ({ data, onSave }: any) => {
    const [inputs, setInputs] = useState(data?.inputs || { assetValue: 1000000, raiseAmount: 500000, equityPercent: 50, targetReturn: 8, horizon: 5 });
    const [aiResult, setAiResult] = useState<any>(data?.result || null);
    const [loading, setLoading] = useState(false);

    const handleAnalyze = async () => {
        setLoading(true);
        const res = await buildCapitalStack(inputs);
        setAiResult(res);
        setLoading(false);
        onSave({ inputs, result: res });
    };

    // Calculate Stack
    const sponsorEquity = inputs.assetValue - inputs.raiseAmount;
    const sponsorPct = (sponsorEquity / inputs.assetValue) * 100;
    const raisePct = (inputs.raiseAmount / inputs.assetValue) * 100;

    return (
        <div className="space-y-8 animate-fadeIn">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Visual Stack */}
                <div className="bg-slate-900/80 backdrop-blur-md p-8 rounded-3xl border border-slate-700/50 flex flex-col justify-center items-center shadow-xl">
                    <h5 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">Stack Visualization</h5>
                    <div className="w-32 h-80 bg-slate-950 rounded-2xl flex flex-col-reverse overflow-hidden relative border-2 border-slate-800 shadow-inner">
                        <div style={{ height: `${sponsorPct}%` }} className="bg-indigo-600 w-full flex items-center justify-center text-[10px] text-white font-bold transition-all duration-1000 border-t border-indigo-400/30">
                            {sponsorPct > 10 && `Sponsor ${sponsorPct.toFixed(0)}%`}
                        </div>
                        <div style={{ height: `${raisePct}%` }} className="bg-emerald-500 w-full flex items-center justify-center text-[10px] text-slate-900 font-bold transition-all duration-1000">
                            {raisePct > 10 && `Investors ${raisePct.toFixed(0)}%`}
                        </div>
                    </div>
                    <div className="mt-6 text-center">
                        <p className="text-xs text-slate-500 uppercase font-bold">Total Value</p>
                        <p className="text-2xl font-bold text-white font-display tracking-tight">${inputs.assetValue.toLocaleString()}</p>
                    </div>
                </div>

                {/* Inputs */}
                <div className="lg:col-span-2 bg-slate-900/80 backdrop-blur-md p-8 rounded-3xl border border-slate-700/50 shadow-xl">
                    <h4 className="text-white font-bold mb-6 text-lg">Stack Configuration</h4>
                    <div className="grid grid-cols-2 gap-6 mb-8">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">Asset Value ($)</label>
                            <input type="number" value={inputs.assetValue} onChange={e => setInputs({...inputs, assetValue: parseFloat(e.target.value)})} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">Raise Amount ($)</label>
                            <input type="number" value={inputs.raiseAmount} onChange={e => setInputs({...inputs, raiseAmount: parseFloat(e.target.value)})} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">Equity Offered (%)</label>
                            <input type="number" value={inputs.equityPercent} onChange={e => setInputs({...inputs, equityPercent: parseFloat(e.target.value)})} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">Target Return (%)</label>
                            <input type="number" value={inputs.targetReturn} onChange={e => setInputs({...inputs, targetReturn: parseFloat(e.target.value)})} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none" />
                        </div>
                    </div>
                    <Button onClick={handleAnalyze} isLoading={loading} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-xl font-bold shadow-lg">Analyze Alignment</Button>
                </div>
            </div>

            {aiResult && (
                <div className="bg-slate-800/80 backdrop-blur-md p-8 rounded-3xl border border-slate-700 text-white animate-slideUp relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-[80px] -mr-16 -mt-16 pointer-events-none"></div>
                    <h5 className="font-bold text-amber-400 mb-4 uppercase tracking-widest text-sm flex items-center gap-2">
                        <span className="text-xl">⚖️</span> Incentive Check
                    </h5>
                    <p className="text-base text-slate-300 mb-6 leading-relaxed border-l-4 border-amber-500/50 pl-6">"{aiResult.alignmentAnalysis}"</p>
                    
                    {aiResult.conflictPoints?.length > 0 && (
                        <div className="bg-red-900/20 p-6 rounded-2xl border border-red-500/30">
                            <span className="text-xs font-bold text-red-400 uppercase block mb-3">Conflicts Detected</span>
                            <ul className="space-y-2">
                                {aiResult.conflictPoints.map((c: string, i: number) => (
                                    <li key={i} className="flex items-center gap-3 text-sm text-red-200">
                                        <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> {c}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

// 4. TOKENOMICS
const StepTokenomics = ({ data, onSave }: any) => {
    const [inputs, setInputs] = useState(data?.inputs || { tokenPrice: 50, supply: 10000, distribution: 'Primary' });
    const [aiResult, setAiResult] = useState<any>(data?.result || null);
    const [loading, setLoading] = useState(false);

    const handleAnalyze = async () => {
        setLoading(true);
        const res = await buildTokenomics(inputs);
        setAiResult(res);
        setLoading(false);
        onSave({ inputs, result: res });
    };

    return (
        <div className="space-y-8 animate-fadeIn">
            <div className="bg-slate-900/80 backdrop-blur-md p-8 rounded-3xl border border-slate-700/50 shadow-xl">
                <div className="flex justify-between items-center mb-8 border-b border-slate-700 pb-6">
                    <h4 className="text-white font-bold text-xl">Unit Economics</h4>
                    <div className="text-right">
                        <span className="text-xs text-slate-500 uppercase block font-bold tracking-wider mb-1">Implied Market Cap</span>
                        <span className="text-3xl font-mono text-emerald-400 font-bold tracking-tight">${(inputs.tokenPrice * inputs.supply).toLocaleString()}</span>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-2">
                         <label className="text-xs font-bold text-slate-500 uppercase">Target Price ($)</label>
                         <input type="number" value={inputs.tokenPrice} onChange={e => setInputs({...inputs, tokenPrice: parseFloat(e.target.value)})} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-4 text-white font-mono text-2xl outline-none focus:border-purple-500" />
                         <p className="text-[10px] text-purple-400 font-medium ml-1">Typical: $50 - $1000 for Regulated Assets</p>
                     </div>
                     <div className="space-y-2">
                         <label className="text-xs font-bold text-slate-500 uppercase">Total Supply</label>
                         <input type="number" value={inputs.supply} onChange={e => setInputs({...inputs, supply: parseFloat(e.target.value)})} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-4 text-white font-mono text-2xl outline-none focus:border-purple-500" />
                     </div>
                </div>
                <div className="mt-8">
                    <Button onClick={handleAnalyze} isLoading={loading} className="w-full bg-purple-600 hover:bg-purple-500 text-white py-4 rounded-xl font-bold shadow-lg shadow-purple-900/30">Simulate Psychology</Button>
                </div>
            </div>

            {aiResult && (
                 <div className="bg-gradient-to-r from-purple-900/20 to-slate-900 p-8 rounded-3xl border border-purple-500/30 animate-slideUp relative overflow-hidden">
                     <div className="absolute top-0 left-0 w-1 h-full bg-purple-500"></div>
                     <h5 className="font-bold text-purple-400 mb-4 uppercase tracking-widest text-sm">Psychology Check</h5>
                     <p className="text-base text-purple-100/90 mb-6 leading-relaxed">{aiResult.psychologyCheck}</p>
                     <div className="bg-slate-950/80 p-4 rounded-xl text-sm text-slate-300 font-mono border border-slate-800">
                         > {aiResult.liquiditySimulation}
                     </div>
                 </div>
            )}
        </div>
    );
};

// 5. VALUE MATRIX
const StepValueMatrix = ({ data, onSave }: any) => {
    const [inputs, setInputs] = useState(data?.inputs || { compromises: '' });
    const [aiResult, setAiResult] = useState<any>(data?.result || null);
    const [loading, setLoading] = useState(false);

    const handleAnalyze = async () => {
        setLoading(true);
        const res = await buildValueMatrix(inputs);
        setAiResult(res);
        setLoading(false);
        onSave({ inputs, result: res });
    };

    return (
        <div className="h-full flex flex-col space-y-8 animate-fadeIn">
            <div className="bg-slate-900/80 backdrop-blur-md p-8 rounded-3xl border border-slate-700/50 shadow-xl">
                <label className="text-xs font-bold text-slate-400 uppercase block mb-4 tracking-widest">Trade-off Strategy</label>
                <textarea 
                    className="w-full p-6 bg-slate-950 border border-slate-700 rounded-2xl text-white h-40 focus:border-indigo-500 outline-none resize-none leading-relaxed placeholder:text-slate-600" 
                    placeholder="What compromises are you willing to make? (e.g. Higher yield for less control, or lock-up for discount)..."
                    value={inputs.compromises}
                    onChange={e => setInputs({...inputs, compromises: e.target.value})}
                />
                <Button onClick={handleAnalyze} isLoading={loading} className="w-full mt-6 bg-indigo-600 hover:bg-indigo-500 py-4 rounded-xl font-bold shadow-lg">Generate Matrix</Button>
            </div>

            {aiResult && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
                    <div className="bg-emerald-900/20 p-8 rounded-3xl border border-emerald-500/20 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-6 opacity-10 text-6xl">🤑</div>
                        <h5 className="font-bold text-emerald-500 uppercase text-xs tracking-widest mb-6">Investor Gets</h5>
                        <ul className="space-y-4">
                            {aiResult.investorBenefits?.map((b: string, i: number) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-emerald-100/90 font-medium">
                                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs mt-0.5">✓</span> {b}
                                </li>
                            ))}
                        </ul>
                    </div>
                     <div className="bg-blue-900/20 p-8 rounded-3xl border border-blue-500/20 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-6 opacity-10 text-6xl">🏗️</div>
                        <h5 className="font-bold text-blue-500 uppercase text-xs tracking-widest mb-6">Sponsor Gets</h5>
                        <ul className="space-y-4">
                            {aiResult.sponsorBenefits?.map((b: string, i: number) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-blue-100/90 font-medium">
                                    <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs mt-0.5">✓</span> {b}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

// 6. RISK REALITY
const StepRisk = ({ data, onSave }: any) => {
    const [inputs, setInputs] = useState(data?.inputs || { perceivedRisks: '' });
    const [result, setResult] = useState<any>(data?.result || null);
    const [loading, setLoading] = useState(false);
    const handle = async () => { 
        setLoading(true);
        const res = await buildRiskReality(inputs); 
        setResult(res); 
        setLoading(false);
        onSave({ inputs, result: res }); 
    };

    return (
        <div className="space-y-8 animate-fadeIn">
             <div className="bg-slate-900/80 backdrop-blur-md p-8 rounded-3xl border border-slate-700/50 shadow-xl">
                 <h4 className="text-white font-bold mb-4 text-lg">Risk Self-Assessment</h4>
                 <textarea className="w-full p-6 bg-slate-950 border border-slate-700 rounded-2xl text-white h-40 focus:border-red-500 outline-none resize-none leading-relaxed placeholder:text-slate-600" placeholder="What keeps you up at night regarding this project?" value={inputs.perceivedRisks} onChange={e => setInputs({perceivedRisks: e.target.value})} />
                 <Button onClick={handle} isLoading={loading} className="mt-6 w-full bg-red-600 hover:bg-red-500 py-4 rounded-xl font-bold shadow-lg shadow-red-900/20">Run Reality Check</Button>
             </div>
             
             <div className="grid grid-cols-1 gap-4">
                 {result?.realRisks?.map((r: any, i: number) => (
                     <div key={i} className="bg-slate-800 p-6 rounded-2xl border-l-4 border-red-500 animate-slideUp shadow-lg">
                         <div className="flex justify-between items-center mb-2">
                             <span className="font-bold text-base text-white">{r.risk}</span>
                             <span className={`px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider ${r.impact === 'High' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'}`}>{r.impact} Impact</span>
                         </div>
                         <div className="flex gap-2 items-start mt-2">
                             <span className="text-lg">🛡️</span>
                             <p className="text-sm text-slate-300 leading-relaxed"><span className="text-slate-500 uppercase text-xs font-bold tracking-wider mr-2">Mitigation:</span> {r.mitigation}</p>
                         </div>
                     </div>
                 ))}
             </div>
        </div>
    );
};

// 7. EXECUTION
const StepExecution = ({ data, onSave }: any) => {
    const [inputs, setInputs] = useState(data?.inputs || { resources: '' });
    const [result, setResult] = useState<any>(data?.result || null);
    const [loading, setLoading] = useState(false);
    const handle = async () => { 
        setLoading(true);
        const res = await buildExecutionReality(inputs); 
        setResult(res); 
        setLoading(false);
        onSave({ inputs, result: res }); 
    };
    
    return (
        <div className="space-y-8 animate-fadeIn">
             <div className="bg-slate-900/80 backdrop-blur-md p-8 rounded-3xl border border-slate-700/50 shadow-xl">
                 <h4 className="text-white font-bold mb-4 text-lg">Operational Resources</h4>
                 <textarea className="w-full p-6 bg-slate-950 border border-slate-700 rounded-2xl text-white h-40 focus:border-amber-500 outline-none resize-none leading-relaxed placeholder:text-slate-600" placeholder="List your team, legal partners, and available budget..." value={inputs.resources} onChange={e => setInputs({resources: e.target.value})} />
                 <Button onClick={handle} isLoading={loading} className="mt-6 w-full bg-amber-600 hover:bg-amber-500 text-white py-4 rounded-xl font-bold shadow-lg">Check Feasibility</Button>
             </div>
             {result && (
                 <div className="bg-amber-900/20 p-8 rounded-3xl border border-amber-500/30 text-center animate-slideUp relative overflow-hidden">
                     <div className="absolute top-0 left-0 w-full h-1 bg-amber-500"></div>
                     <p className="text-xs text-amber-500 uppercase font-bold tracking-[0.2em] mb-4">Primary Bottleneck</p>
                     <h3 className="text-3xl md:text-4xl text-white font-bold mb-6 font-display">{result.bottleneck}</h3>
                     <div className="inline-block px-6 py-3 bg-slate-900 rounded-xl border border-amber-500/20 shadow-lg">
                         <span className="text-slate-400 text-xs uppercase mr-3 font-bold">Real Timeline</span>
                         <span className="text-white font-mono font-bold text-lg">{result.realTimeline}</span>
                     </div>
                 </div>
             )}
        </div>
    );
};

// 8. READINESS
const StepReadiness = ({ data, onSave }: any) => {
    const [inputs, setInputs] = useState(data?.inputs || { priorities: '' });
    const [result, setResult] = useState<any>(data?.result || null);
    const [loading, setLoading] = useState(false);
    const handle = async () => { 
        setLoading(true);
        const res = await buildReadinessScore(inputs); 
        setResult(res); 
        setLoading(false);
        onSave({ inputs, result: res }); 
    };

    const getScoreColor = (s: number) => {
        if(s >= 80) return 'text-emerald-500';
        if(s >= 60) return 'text-amber-500';
        return 'text-red-500';
    };

    return (
        <div className="h-full flex flex-col justify-center items-center space-y-12 animate-fadeIn">
             {!result ? (
                 <div className="text-center">
                     <div className="text-8xl mb-8 opacity-20 grayscale">🎯</div>
                     <Button onClick={handle} isLoading={loading} className="px-12 py-6 text-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-2xl shadow-indigo-500/30 rounded-2xl font-bold transition-transform hover:-translate-y-1">
                         Calculate Readiness Score
                     </Button>
                 </div>
             ) : (
                 <div className="bg-slate-900 p-12 rounded-[3rem] border border-slate-800 text-center relative overflow-hidden w-full max-w-xl shadow-2xl animate-scaleIn group">
                     <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none group-hover:bg-indigo-500/20 transition-colors duration-1000"></div>
                     <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px] -ml-20 -mb-20 pointer-events-none"></div>
                     
                     <div className="relative z-10">
                        <h5 className="text-sm font-bold text-slate-500 uppercase tracking-[0.3em] mb-6">Final Verdict</h5>
                        <div className={`text-9xl font-display font-black mb-6 drop-shadow-2xl ${getScoreColor(result.score)}`}>
                            {result.score}
                        </div>
                        <div className="text-2xl font-bold text-white mb-8 uppercase tracking-wide bg-slate-800/50 inline-block px-6 py-2 rounded-xl border border-slate-700/50 backdrop-blur-md">
                            {result.verdict}
                        </div>
                        <p className="text-slate-400 text-base leading-relaxed max-w-sm mx-auto font-light">
                            {result.explanation}
                        </p>
                     </div>
                 </div>
             )}
        </div>
    );
};

// 9. NEXT ACTIONS
const StepNextActions = ({ data, onSave }: any) => {
    const [inputs, setInputs] = useState(data?.inputs || { commitment: '' });
    const [result, setResult] = useState<any>(data?.result || null);
    const [loading, setLoading] = useState(false);
    const handle = async () => { 
        setLoading(true);
        const res = await buildNextActions(inputs); 
        setResult(res); 
        setLoading(false);
        onSave({ inputs, result: res }); 
    };

    return (
        <div className="space-y-8 animate-fadeIn h-full flex flex-col justify-center">
             {!result && (
                 <div className="text-center py-12">
                     <Button onClick={handle} isLoading={loading} className="bg-emerald-600 hover:bg-emerald-500 text-white px-10 py-5 text-xl font-bold rounded-2xl shadow-xl shadow-emerald-900/20">
                         Generate Execution Checklist
                     </Button>
                 </div>
             )}
             
             {result && (
                 <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xl animate-slideUp max-w-3xl mx-auto w-full">
                     <div className="bg-slate-50 px-8 py-6 border-b border-slate-200 flex justify-between items-center">
                         <h4 className="font-bold text-slate-900 text-lg">Operational Checklist</h4>
                         <span className="text-xs bg-white border border-slate-300 px-3 py-1 rounded-full text-slate-500 font-bold uppercase tracking-wider">High Priority</span>
                     </div>
                     <div className="divide-y divide-slate-100">
                         {result.actions?.map((a: any, i: number) => (
                             <div key={i} className="p-6 flex items-center gap-6 hover:bg-slate-50 transition-colors group cursor-pointer">
                                 <div className="w-8 h-8 rounded-full border-2 border-slate-300 flex items-center justify-center text-white group-hover:border-emerald-500 group-hover:bg-emerald-500 transition-all font-bold shadow-sm">
                                     {i+1}
                                 </div>
                                 <div className="flex-1">
                                     <p className="text-slate-800 font-bold text-base mb-1">{a.step}</p>
                                     <p className="text-xs text-slate-500 uppercase tracking-wider">Owner: <span className="font-bold text-indigo-600">{a.owner}</span></p>
                                 </div>
                                 <div className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400">
                                     ➔
                                 </div>
                             </div>
                         ))}
                     </div>
                 </div>
             )}
        </div>
    );
};


// --- MAIN ORCHESTRATOR ---

interface Props {
    onNavigate?: (page: string) => void;
}

export const BuildRealProjectTheory: React.FC<Props> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<StepId>('SNAPSHOT');
  const [projectData, setProjectData] = useState<any>({});
  const [isExporting, setIsExporting] = useState(false);

  // Load persistence
  useEffect(() => {
      const saved = localStorage.getItem('academyPro_buildReal');
      if (saved) setProjectData(JSON.parse(saved));
  }, []);

  const saveSection = (section: string, data: any) => {
      const newData = { ...projectData, [section]: data };
      setProjectData(newData);
      localStorage.setItem('academyPro_buildReal', JSON.stringify(newData));
  };

  const handleNext = () => {
      const idx = STEPS.findIndex(t => t.id === activeTab);
      if (idx < STEPS.length - 1) {
          setActiveTab(STEPS[idx + 1].id as StepId);
      }
  };

  const handleGeneratePDF = async () => {
      setIsExporting(true);
      const narrative = await buildFinalNarrative(projectData);
      AcademyPdfService.generateBuildProjectRealPDF(projectData, narrative);
      setIsExporting(false);
  };

  const renderContent = () => {
      const props = (key: string) => ({
          data: projectData[key],
          onSave: (d: any) => saveSection(key, d)
      });

      switch(activeTab) {
          case 'SNAPSHOT': return <StepSnapshot {...props('snapshot')} />;
          case 'ASSET': return <StepAssetLogic {...props('assetLogic')} />;
          case 'STACK': return <StepCapitalStack {...props('capitalStack')} />;
          case 'TOKEN': return <StepTokenomics {...props('tokenomics')} />;
          case 'VALUE': return <StepValueMatrix {...props('valueMatrix')} />;
          case 'RISK': return <StepRisk {...props('riskReality')} />;
          case 'EXECUTION': return <StepExecution {...props('execution')} />;
          case 'READINESS': return <StepReadiness {...props('readiness')} />;
          case 'ACTIONS': return <StepNextActions {...props('nextActions')} />;
          default: return null;
      }
  };

  // Progress Calc
  const activeIndex = STEPS.findIndex(s => s.id === activeTab);
  const progressPercent = Math.round(((activeIndex) / (STEPS.length - 1)) * 100);

  return (
    <div className="flex h-screen w-full bg-slate-950 overflow-hidden animate-fadeIn text-slate-200">
      
      {/* LEFT SIDEBAR: NAVIGATION */}
      <aside className="w-80 bg-slate-950/50 border-r border-slate-800 flex flex-col shrink-0 z-20 backdrop-blur-sm relative">
          <div className="p-8 border-b border-slate-800/50">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Module 13</div>
              <h2 className="text-2xl font-bold text-white font-display tracking-tight">Project Builder</h2>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
              {STEPS.map((step, idx) => {
                  const isActive = activeTab === step.id;
                  const isCompleted = !!projectData[step.id === 'SNAPSHOT' ? 'snapshot' : step.id === 'ASSET' ? 'assetLogic' : step.id === 'STACK' ? 'capitalStack' : step.id === 'TOKEN' ? 'tokenomics' : step.id === 'VALUE' ? 'valueMatrix' : step.id === 'RISK' ? 'riskReality' : step.id === 'EXECUTION' ? 'execution' : step.id === 'READINESS' ? 'readiness' : 'nextActions']?.result;

                  return (
                      <button
                          key={step.id}
                          onClick={() => setActiveTab(step.id)}
                          className={`
                              w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all text-left group relative overflow-hidden
                              ${isActive 
                                  ? 'bg-indigo-600/20 text-white shadow-lg shadow-indigo-900/20 border border-indigo-500/30' 
                                  : 'text-slate-500 hover:bg-slate-900/50 hover:text-slate-300'
                              }
                          `}
                      >
                          <div className={`
                              w-8 h-8 rounded-lg flex items-center justify-center text-base shrink-0 transition-all duration-300
                              ${isActive ? 'bg-indigo-500 text-white scale-110 shadow-lg' : isCompleted ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-800/50 text-slate-600'}
                          `}>
                              {isCompleted && !isActive ? '✓' : step.icon}
                          </div>
                          <div>
                              <span className={`block text-sm font-bold ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-300'}`}>{step.label}</span>
                              {isActive && <span className="text-[10px] text-indigo-300 animate-fadeIn">{step.desc}</span>}
                          </div>
                          
                          {/* Active Indicator Bar */}
                          {isActive && <div className="absolute left-0 top-3 bottom-3 w-1 bg-indigo-500 rounded-r-full shadow-[0_0_10px_#6366f1]"></div>}
                      </button>
                  );
              })}
          </div>

          <div className="p-6 border-t border-slate-800/50 bg-slate-900/30">
               <div className="flex justify-between text-xs mb-3 text-slate-400">
                   <span className="font-bold uppercase tracking-wider">Completion</span>
                   <span className="text-white font-mono">{Math.round((Object.keys(projectData).length / 9) * 100)}%</span>
               </div>
               <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                   <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-700 ease-out" style={{width: `${(Object.keys(projectData).length / 9) * 100}%`}}></div>
               </div>
          </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col h-full relative bg-slate-950 overflow-hidden">
          
          {/* Cosmic Background */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none"></div>
          <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>
          <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[120px] pointer-events-none"></div>

          {/* Header */}
          <header className="h-24 border-b border-slate-800/50 flex items-center justify-between px-10 bg-slate-950/60 backdrop-blur-xl sticky top-0 z-10 shrink-0">
              <div>
                  <h1 className="text-3xl font-bold text-white font-display tracking-tight drop-shadow-md">{STEPS.find(s => s.id === activeTab)?.label}</h1>
                  <p className="text-sm text-slate-400 mt-1 font-medium">{STEPS.find(s => s.id === activeTab)?.desc}</p>
              </div>
              
              <div className="flex gap-4">
                   {activeTab === 'ACTIONS' ? (
                       <Button onClick={handleGeneratePDF} isLoading={isExporting} className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-xl shadow-emerald-900/30 px-8 py-3 rounded-xl font-bold text-base transform hover:scale-105 transition-all">
                           📥 Download Strategic Advisory PDF
                       </Button>
                   ) : (
                       <Button onClick={handleNext} className="bg-white text-slate-900 hover:bg-indigo-50 px-8 py-3 font-bold shadow-xl rounded-xl text-base transform hover:scale-105 transition-all">
                           Save & Next Step →
                       </Button>
                   )}
              </div>
          </header>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-10 custom-scrollbar relative z-0">
              <div className="max-w-6xl mx-auto min-h-full pb-20">
                  {renderContent()}
              </div>
          </div>

      </main>

    </div>
  );
};
