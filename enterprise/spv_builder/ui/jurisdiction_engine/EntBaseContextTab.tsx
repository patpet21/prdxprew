
import React from 'react';
import { JURISDICTION_METADATA } from '../../../../content/jurisdictionContent';

interface Props {
  data: any;
  updateData: (field: string, val: any) => void;
}

export const EntBaseContextTab: React.FC<Props> = ({ data, updateData }) => {
  const { baseContext, projectInfo } = data;

  const handleUpdate = (field: string, val: string) => {
    updateData('baseContext', { ...baseContext, [field]: val });
  };

  const currentAssetCountry = JURISDICTION_METADATA.find(c => c.code === baseContext?.assetCountry);
  const currentIssuerCountry = JURISDICTION_METADATA.find(c => c.code === baseContext?.issuerCountry);
  
  const getFlagUrl = (code: string | undefined) => {
      if (!code) return null;
      return `https://flagcdn.com/w80/${code.split('-')[0].toLowerCase()}.png`;
  };

  return (
    <div className="animate-fadeIn space-y-8">
      
      <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-slate-900 rounded-lg text-white border border-slate-700">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <h3 className="text-lg font-bold text-white">Geographic Nexus</h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Card 1: Asset Country */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden flex flex-col group hover:border-indigo-500 transition-colors">
              <div className="bg-slate-950 p-6 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl">📍</div>
                  <h4 className="text-sm font-bold uppercase tracking-widest text-indigo-400 mb-2">Asset Location</h4>
                  <p className="text-xs text-slate-400">Where is the physical collateral?</p>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                  {currentAssetCountry ? (
                      <div className="text-center mb-6">
                          <div className="mb-3 flex justify-center">
                              <img src={getFlagUrl(currentAssetCountry.code)!} alt={currentAssetCountry.name} className="w-16 h-10 object-cover rounded shadow-lg" />
                          </div>
                          <div className="font-bold text-xl text-white">{currentAssetCountry.name}</div>
                      </div>
                  ) : (
                      <div className="text-center mb-6 py-4 border-2 border-dashed border-slate-700 rounded-xl text-slate-500">
                          Select Country
                      </div>
                  )}
                  
                  <div className="mt-auto">
                      <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Select Territory</label>
                      <select 
                          className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-indigo-500"
                          value={baseContext?.assetCountry || ''}
                          onChange={(e) => handleUpdate('assetCountry', e.target.value)}
                      >
                          <option value="">Choose Country...</option>
                          {JURISDICTION_METADATA.map(c => (
                              <option key={c.code} value={c.code}>{c.flag} {c.name}</option>
                          ))}
                      </select>
                  </div>
              </div>
          </div>

          {/* Card 2: Issuer Country */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden flex flex-col group hover:border-emerald-500 transition-colors">
              <div className="bg-slate-950 p-6 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl">🏢</div>
                  <h4 className="text-sm font-bold uppercase tracking-widest text-emerald-400 mb-2">Issuer Domicile</h4>
                  <p className="text-xs text-slate-400">Where is the sponsor incorporated?</p>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                  {currentIssuerCountry ? (
                      <div className="text-center mb-6">
                          <div className="mb-3 flex justify-center">
                              <img src={getFlagUrl(currentIssuerCountry.code)!} alt={currentIssuerCountry.name} className="w-16 h-10 object-cover rounded shadow-lg" />
                          </div>
                          <div className="font-bold text-xl text-white">{currentIssuerCountry.name}</div>
                      </div>
                  ) : (
                      <div className="text-center mb-6 py-4 border-2 border-dashed border-slate-700 rounded-xl text-slate-500">
                          Select Country
                      </div>
                  )}
                  
                  <div className="mt-auto">
                      <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Select Territory</label>
                      <select 
                          className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-emerald-500"
                          value={baseContext?.issuerCountry || ''}
                          onChange={(e) => handleUpdate('issuerCountry', e.target.value)}
                      >
                          <option value="">Choose Country...</option>
                          {JURISDICTION_METADATA.map(c => (
                              <option key={c.code} value={c.code}>{c.flag} {c.name}</option>
                          ))}
                      </select>
                  </div>
              </div>
          </div>

          {/* Card 3: Strategic Intent (Read Only) */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-inner overflow-hidden flex flex-col">
              <div className="bg-slate-950 p-6 text-slate-400 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl">🎯</div>
                  <h4 className="text-sm font-bold uppercase tracking-widest mb-2">Strategic Intent</h4>
                  <p className="text-xs">Derived from Project Data</p>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-center text-center">
                  <div className="mb-4">
                      <div className="text-5xl mb-2">
                          {projectInfo?.geoIntent === 'Global' ? '🌍' : '🏘️'}
                      </div>
                      <div className="font-bold text-xl text-white">{projectInfo?.geoIntent || 'Global'} Reach</div>
                  </div>
                  <div className="text-xs text-slate-400 bg-slate-950 p-3 rounded-lg border border-slate-800">
                      This setting influences the recommended SPV structure. Global intent typically requires a Tax Neutral jurisdiction.
                  </div>
              </div>
          </div>

      </div>
    </div>
  );
};
