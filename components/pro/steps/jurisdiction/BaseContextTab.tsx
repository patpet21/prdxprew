
import React from 'react';
import { TokenizationState } from '../../../../types';
import { JURISDICTION_METADATA } from '../../../../content/jurisdictionContent';

interface Props {
  data: TokenizationState;
  updateData: (section: keyof TokenizationState, payload: any) => void;
}

export const BaseContextTab: React.FC<Props> = ({ data, updateData }) => {
  const { jurisdiction, projectInfo } = data;
  const baseContext = jurisdiction.baseContext || {};

  const handleUpdate = (field: string, val: string) => {
    updateData('jurisdiction', { 
        baseContext: { ...baseContext, [field]: val } 
    });
  };

  const currentAssetCountry = JURISDICTION_METADATA.find(c => c.code === baseContext.assetCountry);
  const currentIssuerCountry = JURISDICTION_METADATA.find(c => c.code === baseContext.issuerCountry);
  
  const getFlagUrl = (code: string | undefined) => {
      if (!code) return null;
      return `https://flagcdn.com/w80/${code.split('-')[0].toLowerCase()}.png`;
  };

  return (
    <div className="animate-fadeIn space-y-8">
      
      <div className="flex items-center gap-3 mb-6 p-4 bg-blue-50/50 rounded-xl border border-blue-100">
          <div className="p-2 bg-blue-600 rounded-lg text-white shadow-sm">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <div>
              <h3 className="text-base font-bold text-slate-900">Geographic Nexus</h3>
              <p className="text-xs text-slate-500">Determine the cross-border relationships between asset, issuer, and investors.</p>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Card 1: Asset Country */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden flex flex-col group hover:border-indigo-500 transition-all duration-300 hover:shadow-xl">
              <div className="bg-slate-900 p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl pointer-events-none">📍</div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-2">Asset Location</h4>
                  <p className="text-xs text-slate-400">Where is the physical collateral located?</p>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                  {currentAssetCountry ? (
                      <div className="text-center mb-8 mt-2">
                          <div className="mb-4 flex justify-center transform group-hover:scale-110 transition-transform duration-500">
                               <img src={getFlagUrl(currentAssetCountry.code)!} alt={currentAssetCountry.name} className="w-20 h-14 object-cover rounded-md shadow-md" />
                          </div>
                          <div className="font-bold text-2xl text-slate-900 font-display">{currentAssetCountry.name}</div>
                          <span className="text-xs text-slate-500 font-mono bg-slate-100 px-2 py-1 rounded mt-2 inline-block">{currentAssetCountry.code}</span>
                      </div>
                  ) : (
                      <div className="text-center mb-8 py-8 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 bg-slate-50">
                          <span className="text-4xl block mb-2 opacity-50">🏳️</span>
                          Select Country
                      </div>
                  )}
                  
                  <div className="mt-auto">
                      <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Select Territory</label>
                      <div className="relative">
                          <select 
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 pl-4 pr-10 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer transition-colors hover:bg-white"
                              value={baseContext.assetCountry || ''}
                              onChange={(e) => handleUpdate('assetCountry', e.target.value)}
                          >
                              <option value="">Choose Country...</option>
                              {JURISDICTION_METADATA.map(c => (
                                  <option key={c.code} value={c.code}>{c.name}</option>
                              ))}
                          </select>
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">▼</div>
                      </div>
                  </div>
              </div>
          </div>

          {/* Card 2: Issuer Country */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden flex flex-col group hover:border-emerald-500 transition-all duration-300 hover:shadow-xl">
              <div className="bg-slate-900 p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl pointer-events-none">🏢</div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-2">Issuer Domicile</h4>
                  <p className="text-xs text-slate-400">Where is the SPV/Company incorporated?</p>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                  {currentIssuerCountry ? (
                      <div className="text-center mb-8 mt-2">
                           <div className="mb-4 flex justify-center transform group-hover:scale-110 transition-transform duration-500">
                               <img src={getFlagUrl(currentIssuerCountry.code)!} alt={currentIssuerCountry.name} className="w-20 h-14 object-cover rounded-md shadow-md" />
                          </div>
                          <div className="font-bold text-2xl text-slate-900 font-display">{currentIssuerCountry.name}</div>
                          <span className="text-xs text-slate-500 font-mono bg-slate-100 px-2 py-1 rounded mt-2 inline-block">{currentIssuerCountry.code}</span>
                      </div>
                  ) : (
                      <div className="text-center mb-8 py-8 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 bg-slate-50">
                          <span className="text-4xl block mb-2 opacity-50">🏳️</span>
                          Select Country
                      </div>
                  )}
                  
                  <div className="mt-auto">
                      <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Select Territory</label>
                      <div className="relative">
                          <select 
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 pl-4 pr-10 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500 appearance-none cursor-pointer transition-colors hover:bg-white"
                              value={baseContext.issuerCountry || ''}
                              onChange={(e) => handleUpdate('issuerCountry', e.target.value)}
                          >
                              <option value="">Choose Country...</option>
                              {JURISDICTION_METADATA.map(c => (
                                  <option key={c.code} value={c.code}>{c.name}</option>
                              ))}
                          </select>
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">▼</div>
                      </div>
                  </div>
              </div>
          </div>

          {/* Card 3: Strategic Intent (Read Only) */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 shadow-inner overflow-hidden flex flex-col opacity-90">
              <div className="bg-slate-200 p-6 text-slate-600 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl pointer-events-none">🎯</div>
                  <h4 className="text-xs font-bold uppercase tracking-widest mb-2">Strategic Intent</h4>
                  <p className="text-xs opacity-70">Derived from Vision & Goals</p>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-center text-center">
                  <div className="mb-6">
                      <div className="text-6xl mb-4 animate-pulse">
                          {projectInfo.geoIntent === 'Global' ? '🌍' : projectInfo.geoIntent === 'National' ? '🇺🇸' : '🏘️'}
                      </div>
                      <div className="font-bold text-2xl text-slate-900 font-display">{projectInfo.geoIntent || 'Global'} Reach</div>
                  </div>
                  <div className="text-xs text-slate-500 bg-white p-4 rounded-xl border border-slate-200 leading-relaxed shadow-sm">
                      <span className="font-bold block mb-1 text-slate-700">Advisory:</span>
                      This setting influences the recommended SPV structure. Global intent typically requires a Tax Neutral jurisdiction (e.g. UK, UAE, or Delaware).
                  </div>
              </div>
          </div>

      </div>

      {/* AI Comparison Hint */}
      {baseContext.assetCountry && baseContext.issuerCountry && baseContext.assetCountry !== baseContext.issuerCountry && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 flex flex-col md:flex-row gap-5 items-start animate-slideUp shadow-sm">
              <div className="bg-amber-100 p-3 rounded-xl text-2xl">⚖️</div>
              <div>
                  <h5 className="font-bold text-amber-800 text-sm uppercase tracking-wide mb-1">Cross-Border Structuring Detected</h5>
                  <p className="text-sm text-amber-700/80 leading-relaxed">
                      You have selected <strong>{currentAssetCountry?.name}</strong> for the asset and <strong>{currentIssuerCountry?.name}</strong> for the issuer. 
                      This usually requires a <strong>Double SPV Structure</strong> (Asset Co + Holding Co) to optimize tax leakage and separate liability.
                  </p>
              </div>
          </div>
      )}

    </div>
  );
};
