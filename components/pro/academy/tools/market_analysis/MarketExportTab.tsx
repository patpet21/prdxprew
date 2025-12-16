
import React, { useState, useEffect } from 'react';
import { Button } from '../../../../ui/Button';
import { AcademyPdfService } from '../../../../../services/academyPdfService';

const LOCAL_STORAGE_KEY = 'academyPro_assetMarket';

export const MarketExportTab: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
      const saved = localStorage.getItem('pdx_academy_state');
      if (saved) {
          try {
              const parsed = JSON.parse(saved);
              if (parsed.assetMarket) {
                  setData(parsed.assetMarket);
              }
          } catch (e) {
              console.error("Failed to load market data", e);
          }
      }
  }, []);

  const handleExport = () => {
      if (!data) return;
      setIsExporting(true);
      
      // Save metadata
      const existing = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '{}');
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({
          ...existing,
          export: { lastRun: new Date().toISOString() }
      }));

      setTimeout(() => {
          AcademyPdfService.generateMarketSnapshotPDF(data);
          setIsExporting(false);
      }, 1000);
  };

  const getStatus = (section: string) => {
      if (data && data[section]) return { label: 'Ready', color: 'text-emerald-400' };
      return { label: 'Missing', color: 'text-red-400' };
  };

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-8 animate-fadeIn text-center p-8 bg-slate-900 border border-slate-800 rounded-2xl">
        <div className="w-24 h-24 bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-amber-500 rounded-full flex items-center justify-center text-5xl shadow-xl shadow-amber-500/20">
            📦
        </div>
        
        <div className="max-w-md">
            <h3 className="text-2xl font-bold text-white font-display mb-2">Market Analysis Package</h3>
            <p className="text-slate-400">
                You have analyzed the asset ecosystem. Aggregate your Local, Global, Macro, and Forecast models into a single snapshot.
            </p>
        </div>

        <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 w-full max-w-lg text-left">
            <h5 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 border-b border-slate-800 pb-2">Manifest</h5>
            <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                    <span className="text-slate-400">Local Market Context</span>
                    <span className={`font-bold ${getStatus('localMarket').color}`}>{getStatus('localMarket').label}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-slate-400">Global Benchmarks</span>
                    <span className={`font-bold ${getStatus('globalBenchmark').color}`}>{getStatus('globalBenchmark').label}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-slate-400">Macro Risk Assessment</span>
                    <span className={`font-bold ${getStatus('macroRisks').color}`}>{getStatus('macroRisks').label}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-slate-400">Financial Forecast</span>
                    <span className={`font-bold ${getStatus('forecastSim').color}`}>{getStatus('forecastSim').label}</span>
                </div>
            </div>
        </div>

        <div className="flex gap-4 w-full max-w-lg">
            <Button onClick={handleExport} isLoading={isExporting} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg py-4">
                Download Market Snapshot (PDF)
            </Button>
            <Button variant="secondary" onClick={() => {}} className="border-slate-700 text-slate-400 hover:text-white">
                Save Draft
            </Button>
        </div>
        
        <p className="text-xs text-slate-600 max-w-sm mx-auto">
            This snapshot is generated for educational simulation purposes.
        </p>
    </div>
  );
};
