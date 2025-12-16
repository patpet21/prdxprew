
import React from 'react';
import { TokenizationState } from '../../types';
import { Button } from '../ui/Button';

interface Props {
  data: TokenizationState;
}

export const FinancialSnapshotTab: React.FC<Props> = ({ data }) => {
  const { property } = data;

  // Mock Calculation Logic for Demo
  const price = property.token_price || 0;
  const supply = property.total_tokens || 0;
  const hardCap = property.hard_cap || (price * supply) || 0;
  
  const baseYield = property.annual_yield || 0;
  const yieldLow = (baseYield * 0.9).toFixed(1);
  const yieldHigh = (baseYield * 1.1).toFixed(1);
  
  const roi = property.roi_target || 0;
  const riskScore = Math.max(0, Math.min(100, 100 - ((property.risk_score || 3) * 10))); // Convert 1-5 scale to 0-100 inverse

  // Simple SVG Chart Data Generation
  const generateChartPath = () => {
    const points = [];
    const width = 100;
    const height = 50;
    const steps = 12;
    
    for (let i = 0; i <= steps; i++) {
        const x = (i / steps) * width;
        // Simulate growth curve based on ROI
        const growthFactor = (i / steps) * (roi / 100); 
        // Invert Y because SVG 0 is top
        const y = height - (height * 0.2) - (growthFactor * height * 0.6); 
        points.push(`${x},${y}`);
    }
    return points.join(' ');
  };

  return (
    <div className="animate-fadeIn space-y-8 pb-12">
        
        <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 shadow-2xl overflow-hidden relative text-white">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] opacity-10 pointer-events-none"></div>
            
            <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-2xl shadow-lg shadow-emerald-900/20">
                            📈
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold font-display">Financial Snapshot</h3>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                                <span className="text-xs text-amber-500 font-mono uppercase tracking-widest">Demo Mode</span>
                            </div>
                        </div>
                    </div>
                    <div className="text-right hidden sm:block">
                        <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">Projected Valuation</div>
                        <div className="text-2xl font-mono font-bold text-emerald-400">€{property.total_value?.toLocaleString()}</div>
                    </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                    <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 hover:border-slate-600 transition-colors">
                        <p className="text-xs text-slate-400 uppercase font-bold mb-1">Token Price</p>
                        <p className="text-xl font-mono font-bold text-white">€{price.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
                    </div>
                    <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 hover:border-slate-600 transition-colors">
                        <p className="text-xs text-slate-400 uppercase font-bold mb-1">Total Supply</p>
                        <p className="text-xl font-mono font-bold text-white">{supply.toLocaleString()}</p>
                    </div>
                    <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 hover:border-slate-600 transition-colors">
                        <p className="text-xs text-slate-400 uppercase font-bold mb-1">Hard Cap</p>
                        <p className="text-xl font-mono font-bold text-white">€{hardCap.toLocaleString()}</p>
                    </div>
                    <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 hover:border-slate-600 transition-colors">
                        <p className="text-xs text-slate-400 uppercase font-bold mb-1">Expected Yield</p>
                        <p className="text-xl font-mono font-bold text-emerald-400">{yieldLow}% – {yieldHigh}%</p>
                    </div>
                    <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 hover:border-slate-600 transition-colors">
                        <p className="text-xs text-slate-400 uppercase font-bold mb-1">12-Month ROI (Sim)</p>
                        <p className="text-xl font-mono font-bold text-emerald-400">+{roi}%</p>
                    </div>
                    <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 hover:border-slate-600 transition-colors">
                        <p className="text-xs text-slate-400 uppercase font-bold mb-1">Risk Score (AI Lite)</p>
                        <div className="flex items-center gap-2">
                             <p className={`text-xl font-mono font-bold ${riskScore > 80 ? 'text-emerald-400' : riskScore > 50 ? 'text-amber-400' : 'text-red-400'}`}>
                                 {riskScore}/100
                             </p>
                        </div>
                    </div>
                </div>

                {/* Simulation Chart */}
                <div className="bg-slate-950/50 rounded-2xl border border-slate-800 p-6 relative overflow-hidden">
                    <div className="flex justify-between items-center mb-4">
                        <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Simulated Growth Curve</h4>
                        <span className="text-xs bg-slate-800 text-slate-400 px-2 py-1 rounded">12 Months</span>
                    </div>
                    
                    <div className="h-48 w-full relative">
                         <svg viewBox="0 0 100 50" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                             {/* Grid Lines */}
                             <line x1="0" y1="40" x2="100" y2="40" stroke="#334155" strokeWidth="0.2" strokeDasharray="2 2" />
                             <line x1="0" y1="20" x2="100" y2="20" stroke="#334155" strokeWidth="0.2" strokeDasharray="2 2" />
                             
                             {/* Area */}
                             <path d={`M 0,50 L 0,${50 - (50*0.2)} ${generateChartPath()} L 100,50 Z`} fill="rgba(16, 185, 129, 0.1)" />
                             
                             {/* Line */}
                             <path d={`M 0,${50 - (50*0.2)} ${generateChartPath()}`} fill="none" stroke="#10b981" strokeWidth="0.8" strokeLinecap="round" />
                             
                             {/* End Dot */}
                             <circle cx="100" cy={50 - (50*0.2) - ((12/12) * (roi/100) * 50 * 0.6)} r="1" fill="#10b981" className="animate-pulse" />
                         </svg>
                         
                         {/* Labels */}
                         <div className="flex justify-between text-[10px] text-slate-500 mt-2">
                             <span>Day 1</span>
                             <span>Month 6</span>
                             <span>Month 12</span>
                         </div>
                    </div>
                </div>

            </div>
        </div>

        {/* Educational / PRO Banner */}
        <div className="bg-white rounded-2xl p-8 border-l-8 border-l-amber-500 shadow-xl flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
                <h4 className="text-xl font-bold text-slate-900 mb-2 font-display">⚠️ Reality Check</h4>
                <p className="text-slate-600 text-sm leading-relaxed">
                    Questi valori sono <strong>simulati</strong> basandosi su euristiche di base.
                    <br/>
                    Nella versione <strong>PRO</strong>, il motore finanziario calcola rendimenti reali utilizzando:
                </p>
                <ul className="mt-3 grid grid-cols-2 gap-2 text-xs font-bold text-slate-500">
                    <li className="flex items-center gap-2"><span className="text-amber-500">✓</span> Rental Income (NOI)</li>
                    <li className="flex items-center gap-2"><span className="text-amber-500">✓</span> DSCR & Debt Service</li>
                    <li className="flex items-center gap-2"><span className="text-amber-500">✓</span> Market Cap Rate</li>
                    <li className="flex items-center gap-2"><span className="text-amber-500">✓</span> Sensitivity Analysis</li>
                </ul>
            </div>
            <Button className="whitespace-nowrap bg-slate-900 text-white hover:bg-slate-800 px-8 py-4 shadow-lg shadow-slate-900/20">
                Upgrade Financial Engine
            </Button>
        </div>

    </div>
  );
};
