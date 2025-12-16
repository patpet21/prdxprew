
import React from 'react';
import { DeveloperNotes } from '../../services/valuation_service';

interface Props {
  notes?: DeveloperNotes;
}

export const DeveloperNotesTab: React.FC<Props> = ({ notes }) => {
  if (!notes) return null;

  return (
    <div className="animate-slideUp bg-blue-900/10 border border-blue-500/30 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-blue-400 mb-6 flex items-center gap-2">
            <span className="text-2xl">🟦</span> Developer Notes (AI)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900/50 p-4 rounded-xl border border-blue-500/20">
                <h4 className="text-xs font-bold text-blue-300 uppercase mb-2">Construction Risk</h4>
                <p className="text-sm text-slate-300">{notes.constructionRisk}</p>
            </div>
            <div className="bg-slate-900/50 p-4 rounded-xl border border-blue-500/20">
                <h4 className="text-xs font-bold text-blue-300 uppercase mb-2">Estimated Timeline</h4>
                <p className="text-sm text-slate-300">{notes.timelineAssessment}</p>
            </div>
            <div className="bg-slate-900/50 p-4 rounded-xl border border-blue-500/20">
                <h4 className="text-xs font-bold text-blue-300 uppercase mb-2">Permitting</h4>
                <p className="text-sm text-slate-300">{notes.permittingNotes}</p>
            </div>
            <div className="bg-slate-900/50 p-4 rounded-xl border border-blue-500/20">
                <h4 className="text-xs font-bold text-blue-300 uppercase mb-2">Capex Recs</h4>
                <ul className="space-y-1">
                    {notes.capexRecommendations.map((rec, i) => (
                        <li key={i} className="text-sm text-slate-300">• {rec}</li>
                    ))}
                </ul>
            </div>
        </div>
    </div>
  );
};
