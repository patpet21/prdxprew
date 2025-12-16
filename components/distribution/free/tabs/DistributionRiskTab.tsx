

import React, { useState, useEffect } from 'react';
import { DistributionData } from '../../../../types';
import { assessDistributionRisk } from '../../../../services/mockAiService';

interface Props {
  distribution: DistributionData;
  updateData: (field: string, val: any) => void;
  onNext: () => void;
}

export const DistributionRiskTab: React.FC<Props> = ({ distribution, updateData, onNext }) => {
  const [riskReport, setRiskReport] = useState<any>(distribution.riskAssessment || null);
  const [scanning, setScanning] = useState(!distribution.riskAssessment);

  useEffect(() => {
      if (!riskReport) {
          const scan = async () => {
              setScanning(true);
              const report = await assessDistributionRisk(distribution);
              setRiskReport(report);
              updateData('riskAssessment', report); // Persist
              setScanning(false);
          };
          scan();
      }
  }, [distribution]);

  return (
    <div className="space-y-8 animate-fadeIn h-full flex flex-col">
        <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 text-center relative overflow-hidden flex-1 flex flex-col justify-center">
            {scanning ? (
                <div className="flex flex-col items-center">
                    <div className="w-16 h-16 border-4 border-slate-700 border-t-red-500 rounded-full animate-spin mb-4"></div>
                    <h3 className="text-xl font-bold text-white animate-pulse">Scanning Distribution Logic...</h3>
                </div>
            ) : (
                <div className="animate-scaleIn relative z-10">
                    <div className="text-6xl mb-4">
                        {riskReport?.riskLevel === 'High' ? '🚨' : riskReport?.riskLevel === 'Medium' ? '⚠️' : '✅'}
                    </div>
                    <h3 className="text-3xl font-bold text-white font-display mb-2">
                        Risk Level: <span className={riskReport?.riskLevel === 'High' ? 'text-red-500' : riskReport?.riskLevel === 'Medium' ? 'text-amber-500' : 'text-emerald-500'}>{riskReport?.riskLevel}</span>
                    </h3>
                    <p className="text-slate-400 max-w-md mx-auto text-lg leading-relaxed">
                        {riskReport?.riskSummary}
                    </p>
                </div>
            )}
            
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
        </div>

        <div className="flex justify-end pt-4">
             <button onClick={onNext} className="bg-sim-cta hover:bg-sim-cta-hover text-white px-8 py-3 rounded-xl font-bold shadow-lg transition-all">
                View Summary →
             </button>
        </div>
    </div>
  );
};