
import React, { useState } from 'react';

export const AiFixer: React.FC = () => {
  const [issue, setIssue] = useState("Validation failed: Description too short.");
  const [fixed, setFixed] = useState("");
  const [fixing, setFixing] = useState(false);

  const handleFix = () => {
      setFixing(true);
      setTimeout(() => {
          setFixed("Professional rewrite: This asset represents a prime opportunity in the luxury hospitality sector, targeting a 12% IRR through strategic renovations and operational efficiencies.");
          setFixing(false);
      }, 1500);
  };

  return (
    <div className="space-y-6">
        <div className="bg-red-900/10 border border-red-500/30 p-4 rounded-xl">
            <h5 className="text-xs font-bold text-red-400 uppercase mb-2">Identified Issue</h5>
            <p className="text-sm text-red-200">{issue}</p>
        </div>

        <div className="flex justify-center">
            <button 
                onClick={handleFix}
                disabled={fixing}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold text-xs uppercase tracking-wider shadow-lg shadow-indigo-900/20 transition-all"
            >
                {fixing ? 'AI Fixing...' : '✨ Auto-Fix with AI'}
            </button>
        </div>

        {fixed && (
            <div className="bg-emerald-900/10 border border-emerald-500/30 p-4 rounded-xl animate-slideUp">
                <h5 className="text-xs font-bold text-emerald-400 uppercase mb-2">Suggested Correction</h5>
                <p className="text-sm text-emerald-200 leading-relaxed">{fixed}</p>
                <div className="mt-4 flex gap-2">
                    <button className="text-xs bg-emerald-600 text-white px-3 py-1.5 rounded hover:bg-emerald-500">Apply Fix</button>
                    <button className="text-xs bg-slate-800 text-slate-400 px-3 py-1.5 rounded hover:text-white">Discard</button>
                </div>
            </div>
        )}
    </div>
  );
};
