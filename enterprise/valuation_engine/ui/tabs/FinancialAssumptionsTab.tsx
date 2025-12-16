
import React from 'react';
import { ValuationAssumptions, ProjectContext } from '../../services/valuation_service';

interface Props {
  assumptions: ValuationAssumptions;
  projectData: ProjectContext;
  onChange: (newAssumptions: ValuationAssumptions) => void;
  onUpdateProject: (updates: Partial<ProjectContext>) => void;
}

export const FinancialAssumptionsTab: React.FC<Props> = ({ assumptions, projectData, onChange }) => {
  
  const handleChange = (field: keyof ValuationAssumptions, value: any) => {
    onChange({ ...assumptions, [field]: value });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl animate-fadeIn">
      <div className="flex justify-between items-center mb-8">
         <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-400 border border-orange-500/30 text-2xl">
                🧮
            </div>
            <div>
                <h3 className="text-white font-bold text-xl font-display">Financial Assumptions</h3>
                <p className="text-slate-500 text-sm">Input the core drivers for a realistic valuation model.</p>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* SECTION 1: INCOME / STABILIZED PERFORMANCE */}
          <div className="space-y-6">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2 mb-4">
                  <span className="text-lg">📈</span>
                  <h4 className="text-sm font-bold text-white uppercase tracking-widest">Income / Stabilized Performance</h4>
              </div>
              
              <div>
                  <label className="text-xs font-bold text-slate-400 mb-2 block">
                      1. Stabilized Net Income (NOI) <span className="text-emerald-500 font-bold text-[10px] ml-2">ANNUAL</span>
                  </label>
                  <div className="relative group">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500 font-bold">$</span>
                      <input 
                          type="number"
                          value={assumptions.estimatedNOI || ''}
                          onChange={(e) => handleChange('estimatedNOI', parseFloat(e.target.value))}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl py-4 pl-8 pr-4 text-white font-mono text-lg outline-none focus:border-emerald-500 transition-all placeholder:text-slate-600"
                          placeholder="Inserisci il reddito annuo previsto a regime (es. 165,000 €)"
                      />
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block w-64 p-2 bg-slate-800 text-xs text-slate-300 rounded border border-slate-700 shadow-xl z-10">
                          Per asset esistenti usa il NOI attuale; per progetti di sviluppo usa il NOI previsto dopo stabilizzazione.
                      </div>
                  </div>
              </div>

              <div>
                  <div className="flex justify-between text-xs mb-3">
                      <span className="text-slate-400 font-bold">2. Vacancy Rate</span>
                      <span className="text-white font-mono bg-slate-800 px-2 py-1 rounded border border-slate-700">{assumptions.vacancyRate}%</span>
                  </div>
                  <input 
                      type="range" min="0" max="30" step="0.5"
                      value={assumptions.vacancyRate}
                      onChange={(e) => handleChange('vacancyRate', parseFloat(e.target.value))}
                      className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
              </div>

              <div>
                  <div className="flex justify-between text-xs mb-3">
                      <span className="text-slate-400 font-bold">3. Income Growth Rate</span>
                      <span className="text-white font-mono bg-slate-800 px-2 py-1 rounded border border-slate-700">{assumptions.growthRateIncome}%</span>
                  </div>
                  <input 
                      type="range" min="0" max="10" step="0.1"
                      value={assumptions.growthRateIncome}
                      onChange={(e) => handleChange('growthRateIncome', parseFloat(e.target.value))}
                      className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
              </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-8">
              
              {/* SECTION 2: MARKET PARAMETERS */}
              <div className="space-y-6">
                  <div className="flex items-center gap-2 border-b border-slate-800 pb-2 mb-4">
                      <span className="text-lg">🌐</span>
                      <h4 className="text-sm font-bold text-white uppercase tracking-widest">Market Parameters</h4>
                  </div>

                  <div>
                      <div className="flex justify-between text-xs mb-3">
                          <span className="text-slate-400 font-bold">4. Market Cap Rate</span>
                          <span className="text-orange-400 font-mono bg-slate-800 px-2 py-1 rounded border border-slate-700">{assumptions.marketCapRate}%</span>
                      </div>
                      <input 
                          type="range" min="2" max="15" step="0.1"
                          value={assumptions.marketCapRate}
                          onChange={(e) => handleChange('marketCapRate', parseFloat(e.target.value))}
                          className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
                      />
                      <p className="text-[10px] text-slate-500 mt-2">Lower Cap Rate = Higher Valuation. Prime Assets: 4-6%.</p>
                  </div>

                  <div>
                      <div className="flex justify-between text-xs mb-3">
                          <span className="text-slate-400 font-bold">5. Holding Period</span>
                          <span className="text-white font-mono bg-slate-800 px-2 py-1 rounded border border-slate-700">{assumptions.holdingPeriod} Years</span>
                      </div>
                      <input 
                          type="range" min="3" max="20" step="1"
                          value={assumptions.holdingPeriod}
                          onChange={(e) => handleChange('holdingPeriod', parseFloat(e.target.value))}
                          className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                      />
                  </div>
              </div>

              {/* SECTION 3: PROJECT COSTS */}
              <div className="space-y-6">
                  <div className="flex items-center gap-2 border-b border-slate-800 pb-2 mb-4">
                      <span className="text-lg">🏗️</span>
                      <h4 className="text-sm font-bold text-white uppercase tracking-widest">Project Costs</h4>
                  </div>

                  <div>
                      <label className="text-xs font-bold text-slate-400 mb-2 block">
                          6. Total Project Cost <span className="text-slate-500 font-normal">(CapEx + Soft Costs)</span>
                      </label>
                      <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                          <input 
                              type="number"
                              value={assumptions.totalProjectCost || ''}
                              onChange={(e) => handleChange('totalProjectCost', parseFloat(e.target.value))}
                              className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 pl-8 pr-4 text-white font-mono outline-none focus:border-blue-500 transition-all placeholder:text-slate-600"
                              placeholder="Somma totale del progetto"
                          />
                      </div>
                  </div>

                  <div>
                      <label className="text-xs font-bold text-slate-400 mb-2 block">
                          7. Land / Acquisition Cost <span className="text-slate-600 text-[10px] uppercase ml-2 border border-slate-700 px-1 rounded">Optional</span>
                      </label>
                      <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                          <input 
                              type="number"
                              value={assumptions.landCost || ''}
                              onChange={(e) => handleChange('landCost', parseFloat(e.target.value))}
                              className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 pl-8 pr-4 text-white font-mono outline-none focus:border-blue-500 transition-all placeholder:text-slate-600"
                              placeholder="Costo del terreno o dell’immobile"
                          />
                      </div>
                  </div>
              </div>

          </div>

      </div>
    </div>
  );
};
