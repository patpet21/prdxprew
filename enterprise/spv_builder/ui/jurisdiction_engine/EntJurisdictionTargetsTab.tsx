
import React, { useState } from 'react';
import { PRO_COUNTRIES, PRO_REGIONS } from '../../../../content/pro/proCountries';
import { ENTITY_LIBRARY } from '../../../../content/jurisdictionContent';
import { entJurisdictionService } from '../../services/ent_jurisdiction_service';

interface Props {
  data: any;
  updateData: (field: string, val: any) => void;
}

export const EntJurisdictionTargetsTab: React.FC<Props> = ({ data, updateData }) => {
  const jurisdiction = data.jurisdiction || {};
  const property = data.property || {};
  const projectInfo = data.projectInfo || {};
  
  const [activeRegion, setActiveRegion] = useState<string>('EU');
  const [isShortlisting, setIsShortlisting] = useState(false);
  const [shortlist, setShortlist] = useState<any>(null);

  const displayedCountries = PRO_COUNTRIES.filter(c => c.region === activeRegion);

  const handleCountrySelect = (code: string) => {
      const rawCode = code.split('-')[0];
      updateData('jurisdiction', { ...jurisdiction, country: rawCode, spvType: '' });
  };

  const handleSpvSelect = (id: string) => {
      updateData('jurisdiction', { ...jurisdiction, spvType: id });
  };

  const handleAiShortlist = async () => {
      setIsShortlisting(true);
      const result = await entJurisdictionService.generateShortlist(
          property.category || 'Asset',
          activeRegion,
          projectInfo.projectGoal || 'General'
      );
      setShortlist(result);
      setIsShortlisting(false);
  };

  return (
    <div className="animate-fadeIn space-y-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* LEFT COLUMN: SELECTION */}
            <div className="lg:col-span-5 space-y-6">
                
                {/* 1. Region Selector */}
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">1. Strategic Region</h4>
                        <button 
                            onClick={handleAiShortlist}
                            disabled={isShortlisting}
                            className="px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-600 text-white"
                        >
                            {isShortlisting ? 'Scanning...' : '✨ AI Analysis'}
                        </button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {PRO_REGIONS.map(region => (
                            <button
                                key={region}
                                onClick={() => setActiveRegion(region)}
                                className={`
                                    px-3 py-1.5 rounded-lg text-xs font-bold transition-all
                                    ${activeRegion === region 
                                        ? 'bg-amber-500 text-slate-900 shadow-md' 
                                        : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                                    }
                                `}
                            >
                                {region}
                            </button>
                        ))}
                    </div>
                </div>

                {/* AI RECOMMENDATION PODIUM */}
                {shortlist && (
                    <div className="animate-slideUp space-y-4">
                        <div className="p-3 bg-indigo-900/30 border border-indigo-500/20 rounded-lg">
                            <p className="text-xs text-indigo-300 font-medium italic leading-relaxed">
                                🤖 "{shortlist.summary}"
                            </p>
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                            {shortlist.recommendations.map((rec: any, i: number) => (
                                <div key={i} className="p-4 rounded-xl bg-slate-900 border border-slate-700 flex justify-between items-center">
                                    <div>
                                        <h5 className="font-bold text-sm text-white">{rec.name}</h5>
                                        <p className="text-xs text-slate-400">{rec.reason}</p>
                                    </div>
                                    <div className="text-emerald-400 font-bold text-xs">{rec.matchScore}% Match</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 2. Country Grid */}
                <div className="pt-6 border-t border-slate-800/50">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">2. Manual Selection</h4>
                    <div className="grid grid-cols-2 gap-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                        {displayedCountries.map((country) => {
                            const isSelected = jurisdiction?.country === country.code.split('-')[0];
                            const flagCode = country.code.split('-')[0].toLowerCase();
                            return (
                                <button
                                    key={country.code}
                                    onClick={() => handleCountrySelect(country.code)}
                                    className={`
                                        text-left p-3 rounded-xl border transition-all duration-200 group relative overflow-hidden
                                        ${isSelected 
                                            ? 'bg-slate-800 border-indigo-500 ring-1 ring-indigo-500 shadow-lg' 
                                            : 'bg-slate-900 border-slate-800 hover:border-indigo-500/50'
                                        }
                                    `}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <img src={`https://flagcdn.com/w40/${flagCode}.png`} alt={country.name} className="w-6 h-4 object-cover rounded-sm shadow-sm" />
                                    </div>
                                    <div className={`font-bold text-sm mb-0.5 ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                                        {country.name}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* 3. Legal Structure */}
                {jurisdiction?.country && (
                    <div className="animate-slideUp pt-6 border-t border-slate-800/20">
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">3. Structure Type</h4>
                        <div className="space-y-4">
                            {(ENTITY_LIBRARY[jurisdiction.country] || []).map((ent) => {
                                const isSelected = jurisdiction.spvType === ent.id;
                                return (
                                    <button
                                        key={ent.id}
                                        onClick={() => handleSpvSelect(ent.id)}
                                        className={`
                                            w-full text-left p-4 rounded-xl border-2 transition-all duration-300 relative group
                                            ${isSelected 
                                                ? 'bg-slate-800 border-indigo-500 shadow-xl' 
                                                : 'bg-slate-900 border-slate-800 hover:border-indigo-300'
                                            }
                                        `}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${ent.badgeColor}`}>
                                                {ent.badge}
                                            </span>
                                        </div>
                                        <span className={`block font-bold text-lg font-display mb-1 ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                                            {ent.name}
                                        </span>
                                        <div className="text-xs text-slate-500">{ent.bestFor}</div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* RIGHT COLUMN: Placeholder for Next Step */}
            <div className="lg:col-span-7 flex items-center justify-center bg-slate-900/50 rounded-2xl border-2 border-dashed border-slate-800">
                <div className="text-center p-8">
                    <div className="text-5xl mb-4 opacity-20 grayscale">🏗️</div>
                    <p className="text-slate-500 text-sm">Select Jurisdiction & Structure to proceed to SPV Design.</p>
                </div>
            </div>
        </div>
    </div>
  );
};
