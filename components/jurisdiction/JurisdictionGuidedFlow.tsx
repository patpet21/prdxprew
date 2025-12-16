
import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { JurisdictionGuideService } from '../../services/jurisdictionGuideService';

interface Props {
  onSelect: (countryCode: string) => void;
}

type Mode = 'SELECT_MODE' | 'ADVISOR' | 'COMPARE' | 'DECIDED';

export const JurisdictionGuidedFlow: React.FC<Props> = ({ onSelect }) => {
  const [mode, setMode] = useState<Mode>('SELECT_MODE');
  const [loading, setLoading] = useState(false);
  
  // Advisor State
  const [advisorPrefs, setAdvisorPrefs] = useState({ priority: 'Protection', investorType: 'Accredited', assetType: 'Real Estate', region: 'Global' });
  const [recommendation, setRecommendation] = useState<any>(null);

  // Compare State
  const [c1, setC1] = useState('US-DE');
  const [c2, setC2] = useState('IT');
  const [comparison, setComparison] = useState<any>(null);

  const handleAdvice = async () => {
      setLoading(true);
      const res = await JurisdictionGuideService.getRecommendation(advisorPrefs);
      setRecommendation(res);
      setLoading(false);
  };

  const handleCompare = async () => {
      setLoading(true);
      const res = await JurisdictionGuideService.compareCountries(c1, c2);
      setComparison(res);
      setLoading(false);
  };

  const renderModeSelector = () => (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <button onClick={() => setMode('ADVISOR')} className="p-6 bg-indigo-50 border-2 border-indigo-100 rounded-2xl hover:border-indigo-500 hover:shadow-lg transition-all text-left group">
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">🤷‍♂️</div>
              <h4 className="font-bold text-indigo-900">Don't know anything</h4>
              <p className="text-xs text-indigo-600 mt-1">Let AI analyze your needs and suggest the best fit.</p>
          </button>
          
          <button onClick={() => setMode('DECIDED')} className="p-6 bg-emerald-50 border-2 border-emerald-100 rounded-2xl hover:border-emerald-500 hover:shadow-lg transition-all text-left group">
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">📍</div>
              <h4 className="font-bold text-emerald-900">I have a country</h4>
              <p className="text-xs text-emerald-600 mt-1">Skip advice and select your jurisdiction directly.</p>
          </button>

          <button onClick={() => setMode('COMPARE')} className="p-6 bg-amber-50 border-2 border-amber-100 rounded-2xl hover:border-amber-500 hover:shadow-lg transition-all text-left group">
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">⚖️</div>
              <h4 className="font-bold text-amber-900">Compare Two</h4>
              <p className="text-xs text-amber-600 mt-1">Battle-test two nations to see pros/cons.</p>
          </button>
      </div>
  );

  return (
    <div className="mb-10 animate-fadeIn">
        <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-900 font-display">Where should I structure?</h3>
            {mode !== 'SELECT_MODE' && (
                <button onClick={() => setMode('SELECT_MODE')} className="text-sm text-slate-500 hover:text-indigo-600 font-bold">
                    ← Back
                </button>
            )}
        </div>

        {mode === 'SELECT_MODE' && renderModeSelector()}

        {mode === 'DECIDED' && (
            <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl text-center">
                <p className="text-emerald-800 font-medium mb-4">Great! Proceed to the manual selection grid below.</p>
                <span className="text-3xl animate-bounce block">👇</span>
            </div>
        )}

        {mode === 'ADVISOR' && (
            <div className="bg-white border border-indigo-100 p-6 rounded-2xl shadow-sm">
                {!recommendation ? (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Priority</label>
                                <select className="w-full p-2 border rounded" onChange={e => setAdvisorPrefs({...advisorPrefs, priority: e.target.value as any})}>
                                    <option>Protection</option>
                                    <option>Speed</option>
                                    <option>Cost</option>
                                    <option>Tax</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Investor</label>
                                <select className="w-full p-2 border rounded" onChange={e => setAdvisorPrefs({...advisorPrefs, investorType: e.target.value as any})}>
                                    <option>Accredited</option>
                                    <option>Retail</option>
                                    <option>Institutional</option>
                                </select>
                            </div>
                        </div>
                        <Button onClick={handleAdvice} isLoading={loading} className="w-full bg-indigo-600">Get Advice</Button>
                    </div>
                ) : (
                    <div className="animate-slideUp">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-indigo-100 rounded-xl text-indigo-600 text-2xl">🤖</div>
                            <div>
                                <h4 className="font-bold text-lg text-indigo-900">Recommended: {recommendation.country}</h4>
                                <span className={`text-xs px-2 py-0.5 rounded font-bold uppercase ${recommendation.riskLevel === 'Low' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                    Risk: {recommendation.riskLevel}
                                </span>
                            </div>
                        </div>
                        <p className="text-sm text-slate-600 italic mb-6">"{recommendation.reasoning}"</p>
                        <Button onClick={() => onSelect(recommendation.country.split(' ')[0])} className="w-full bg-indigo-600">
                            Select {recommendation.country}
                        </Button>
                    </div>
                )}
            </div>
        )}

        {mode === 'COMPARE' && (
             <div className="bg-white border border-amber-100 p-6 rounded-2xl shadow-sm">
                {!comparison ? (
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <select value={c1} onChange={e => setC1(e.target.value)} className="p-2 border rounded flex-1">
                                <option value="US-DE">Delaware</option>
                                <option value="IT">Italy</option>
                                <option value="UK">UK</option>
                                <option value="AE">Dubai</option>
                            </select>
                            <span className="font-bold text-slate-400">VS</span>
                            <select value={c2} onChange={e => setC2(e.target.value)} className="p-2 border rounded flex-1">
                                <option value="AE">Dubai</option>
                                <option value="IT">Italy</option>
                                <option value="UK">UK</option>
                                <option value="US-DE">Delaware</option>
                            </select>
                        </div>
                        <Button onClick={handleCompare} isLoading={loading} className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900">Fight!</Button>
                    </div>
                ) : (
                    <div className="animate-slideUp">
                        <h4 className="font-bold text-center mb-4">Winner: <span className="text-amber-600">{comparison.winner}</span></h4>
                        <div className="space-y-2 mb-6">
                            {comparison.comparison.map((row: any, i: number) => (
                                <div key={i} className="flex justify-between text-sm border-b pb-2">
                                    <span className="text-slate-500">{row.metric}</span>
                                    <div className="flex gap-4 font-medium">
                                        <span className={row.c1_val === 'High' || row.c1_val === 'Slow' ? 'text-red-500' : 'text-slate-800'}>{row.c1_val}</span>
                                        <span className="text-slate-300">|</span>
                                        <span className={row.c2_val === 'High' || row.c2_val === 'Slow' ? 'text-red-500' : 'text-slate-800'}>{row.c2_val}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <p className="text-xs text-slate-500 italic text-center mb-4">{comparison.verdict}</p>
                        <div className="flex gap-2">
                            <Button onClick={() => onSelect(c1)} variant="secondary" className="flex-1">Choose {c1}</Button>
                            <Button onClick={() => onSelect(c2)} className="flex-1 bg-amber-500 text-slate-900">Choose {c2}</Button>
                        </div>
                    </div>
                )}
             </div>
        )}
    </div>
  );
};
