
import React, { useState } from 'react';
import { Button } from '../../../../ui/Button';
import { generateComplianceMatrix } from '../../../../../services/mockAiService';

export const ComplianceRiskAssessment: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [matrix, setMatrix] = useState<any>(null);

  const handleScan = async () => {
      setIsScanning(true);
      // Pass dummy data representing the current "Legal Wrapper" state
      const result = await generateComplianceMatrix({ jurisdiction: 'US', asset: 'Real Estate', structure: 'LLC' });
      setMatrix(result);
      setIsScanning(false);
  };

  return (
      <div className="space-y-6">
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 flex flex-col items-center justify-center text-center">
              <h3 className="text-xl font-bold text-white mb-2">Red Flag Detector</h3>
              <p className="text-slate-400 text-sm max-w-md mb-6">
                  Analyze your current configuration for regulatory gaps, sanctioned jurisdiction risks, and structural weaknesses.
              </p>
              <Button onClick={handleScan} isLoading={isScanning} className="bg-red-600 hover:bg-red-500 shadow-lg shadow-red-900/20">
                  {isScanning ? 'Scanning Protocols...' : 'Run Compliance Audit'}
              </Button>
          </div>

          {matrix && (
              <div className="animate-fadeIn grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
                      <h4 className="text-sm font-bold text-red-400 uppercase tracking-widest mb-4">Critical Flags</h4>
                      <ul className="space-y-3">
                          {(matrix.redFlags || []).map((flag: string, i: number) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                                  <span className="text-red-500 font-bold">!</span> {flag}
                              </li>
                          ))}
                      </ul>
                  </div>
                  <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
                       <div className="flex justify-between items-center mb-4">
                           <h4 className="text-sm font-bold text-emerald-400 uppercase tracking-widest">Safety Score</h4>
                           <span className="text-2xl font-bold text-white">{matrix.score}/100</span>
                       </div>
                       <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-4">
                           <div className={`h-full ${matrix.score > 80 ? 'bg-emerald-500' : matrix.score > 50 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${matrix.score}%` }}></div>
                       </div>
                       <div className="p-3 bg-indigo-900/20 border border-indigo-500/20 rounded-lg">
                           <span className="text-xs font-bold text-indigo-400 block mb-1">AI Fix Recommendation</span>
                           <p className="text-xs text-slate-300">{matrix.fixSuggestion}</p>
                       </div>
                  </div>
              </div>
          )}
      </div>
  );
};
