
import React from 'react';
import { Button } from '../../../../ui/Button';
import { AcademyPdfService } from '../../../../../services/academyPdfService';

interface Props {
  data: any;
}

export const AssetBlueprintExport: React.FC<Props> = ({ data }) => {
  return (
    <div className="bg-slate-900 text-white p-8 rounded-3xl border border-slate-800 text-center animate-scaleIn">
        <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-6 shadow-lg shadow-amber-500/20">
            🏗️
        </div>
        <h2 className="text-3xl font-bold font-display mb-4">Asset Blueprint Ready</h2>
        <p className="text-slate-400 max-w-lg mx-auto mb-8">
            You have successfully mapped the DNA of <strong>{data.identity.assetName}</strong>. 
            Download your strategic brief below.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mb-10 text-left">
            <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
                <span className="text-[10px] text-slate-500 uppercase block">Asset</span>
                <span className="font-bold text-sm">{data.identity.assetType}</span>
            </div>
            <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
                <span className="text-[10px] text-slate-500 uppercase block">Est. Yield</span>
                <span className="font-bold text-emerald-400 text-sm">{data.revenue.yield.toFixed(2)}%</span>
            </div>
            <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
                <span className="text-[10px] text-slate-500 uppercase block">Structure</span>
                <span className="font-bold text-sm truncate">{data.legal.structure}</span>
            </div>
            <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
                <span className="text-[10px] text-slate-500 uppercase block">Scoring</span>
                <span className="font-bold text-amber-400 text-sm">{data.score?.finalScore}/100</span>
            </div>
        </div>

        <Button 
            onClick={() => AcademyPdfService.generateBlueprintPDF(data)}
            className="px-10 py-4 bg-white text-slate-900 hover:bg-slate-200 font-bold shadow-xl rounded-xl"
        >
            📥 Download Blueprint PDF
        </Button>
    </div>
  );
};
