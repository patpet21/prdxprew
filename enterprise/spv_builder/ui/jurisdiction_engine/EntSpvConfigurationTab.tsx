
import React from 'react';
import { SpvFormContainer } from '../../../../components/pro/steps/spv_form/SpvFormContainer';
import { PRO_COUNTRIES } from '../../../../content/pro/proCountries';

interface Props {
  data: any;
  updateData: (section: string, payload: any) => void;
}

export const EntSpvConfigurationTab: React.FC<Props> = ({ data, updateData }) => {
  const jurisdiction = data.jurisdiction || {};

  if (!jurisdiction.spvType || !jurisdiction.country) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] bg-slate-900/50 border-2 border-dashed border-slate-800 rounded-2xl text-center p-8">
        <div className="text-5xl mb-4 opacity-30 grayscale">🏗️</div>
        <h3 className="text-xl font-bold text-white mb-2">Configuration Locked</h3>
        <p className="text-slate-400 max-w-md">
          Please select a <strong>Target Jurisdiction</strong> and a <strong>Legal Structure</strong> in the previous tabs to unlock the SPV Architect.
        </p>
      </div>
    );
  }

  // Lookup Flag
  const countryCode = jurisdiction.country ? jurisdiction.country.split('-')[0].toLowerCase() : '';

  return (
    <div className="animate-fadeIn h-full">
      <div className="mb-6 flex items-center justify-between">
        <div>
            <h3 className="text-xl font-bold text-white font-display">SPV Architect</h3>
            <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                <span className="bg-slate-800 px-2 py-0.5 rounded border border-slate-700 text-white flex items-center gap-1">
                    {countryCode ? (
                        <img src={`https://flagcdn.com/w20/${countryCode}.png`} alt={jurisdiction.country} className="w-4 h-3 object-cover rounded-[1px]" />
                    ) : (
                        <span>🏳️</span>
                    )}
                    {jurisdiction.country}
                </span>
                <span>/</span>
                <span className="bg-slate-800 px-2 py-0.5 rounded border border-slate-700 text-white">{jurisdiction.spvType}</span>
            </div>
        </div>
        <div className="hidden md:block px-3 py-1 bg-indigo-900/30 border border-indigo-500/30 rounded-full text-[10px] font-bold text-indigo-300 uppercase tracking-wider">
            Enterprise Mode
        </div>
      </div>

      {/* Render the Pro Component with full functionality */}
      <div className="h-[600px]">
        <SpvFormContainer 
            data={data} 
            updateData={updateData}
            onClose={() => console.log("Configuration Step Completed")} 
        />
      </div>
    </div>
  );
};
