
import React from 'react';
import { ProjectContext } from '../../services/valuation_service';
import { Input } from '../../../../components/ui/Input';

interface Props {
  data: ProjectContext;
  onChange: (updates: Partial<ProjectContext>) => void;
}

export const ProjectContextTab: React.FC<Props> = ({ data, onChange }) => {
  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="text-center mb-8">
         <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 text-white text-3xl mb-4 shadow-lg shadow-blue-500/30">
            🏗️
         </div>
         <h3 className="text-2xl font-bold text-white font-display">Initialize Project</h3>
         <p className="text-slate-400 text-sm">Define the core parameters of the asset.</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-3xl mx-auto shadow-xl">
          <div className="space-y-6">
              
              {/* 1. Name */}
              <div>
                  <label className="text-xs font-bold text-blue-400 uppercase block mb-2 ml-1">Project Name</label>
                  <input 
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 text-white outline-none focus:border-blue-500 transition-all placeholder:text-slate-600"
                      value={data.name}
                      onChange={e => onChange({ name: e.target.value })}
                      placeholder="Es. Alpha Resort, Penthouse 12A, Terreno Lago..."
                  />
              </div>

              {/* 2. Location */}
              <div>
                  <label className="text-xs font-bold text-blue-400 uppercase block mb-2 ml-1">Location</label>
                  <input 
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 text-white outline-none focus:border-blue-500 transition-all placeholder:text-slate-600"
                      value={data.location}
                      onChange={e => onChange({ location: e.target.value })}
                      placeholder="Inserisci Paese e città (es. Italy – Milano)"
                  />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* 3. Asset Type */}
                  <div>
                      <label className="text-xs font-bold text-slate-500 uppercase block mb-2 ml-1">Asset Type</label>
                      <div className="relative">
                          <select 
                              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 text-white outline-none focus:border-blue-500 appearance-none cursor-pointer"
                              value={data.assetType}
                              onChange={e => onChange({ assetType: e.target.value as any })}
                          >
                              <option value="Income Property">Income Property</option>
                              <option value="Land / Development">Land / Development</option>
                              <option value="Mixed-Use">Mixed-Use</option>
                              <option value="Hospitality / Resort">Hospitality / Resort</option>
                              <option value="Industrial / Warehouse">Industrial / Warehouse</option>
                              <option value="Other">Other</option>
                          </select>
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">▼</div>
                      </div>
                  </div>

                  {/* 4. Stage */}
                  <div>
                      <label className="text-xs font-bold text-slate-500 uppercase block mb-2 ml-1">Stage</label>
                      <div className="relative">
                          <select 
                              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 text-white outline-none focus:border-blue-500 appearance-none cursor-pointer"
                              value={data.status}
                              onChange={e => onChange({ status: e.target.value as any })}
                          >
                              <option value="Existing asset">Existing asset</option>
                              <option value="Under renovation">Under renovation</option>
                              <option value="Ground-up development">Ground-up development</option>
                              <option value="Concept phase">Concept phase</option>
                              <option value="Conversion / Change of use">Conversion / Change of use</option>
                          </select>
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">▼</div>
                      </div>
                  </div>
              </div>

              {/* 5. Description */}
              <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-2 ml-1">Project Overview (Optional)</label>
                  <textarea 
                      className="w-full h-32 bg-slate-950 border border-slate-700 rounded-xl p-4 text-white outline-none focus:border-blue-500 transition-all placeholder:text-slate-600 resize-none leading-relaxed"
                      value={data.description || ''}
                      onChange={e => onChange({ description: e.target.value })}
                      placeholder="Descrivi il progetto in 1–2 frasi."
                  />
              </div>

          </div>
      </div>
    </div>
  );
};
