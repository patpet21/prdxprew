
import React, { useState } from 'react';
import { Button } from '../../../../ui/Button';

interface Props {
  onNavigate?: (page: string) => void;
}

export const ExportFinal: React.FC<Props> = ({ onNavigate }) => {
  const [status, setStatus] = useState<'IDLE' | 'PACKAGING' | 'READY'>('IDLE');
  const [logs, setLogs] = useState<string[]>([]);

  const handleDownload = () => {
      const payload = {
          project_id: "PRJ-ACADEMY-101",
          status: "VALIDATED",
          timestamp: new Date().toISOString(),
          artifacts: ["dna", "legal", "token", "financial"]
      };
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = "project_export_bundle.json";
      a.click();
  };

  const handleTransfer = () => {
      setStatus('PACKAGING');
      setLogs([]);
      
      const steps = [
          "Encrypting Asset Data...",
          "Bundling Legal Structures...",
          "Verifying Tokenomics Checksum...",
          "Connecting to Enterprise Core...",
          "Handshake Established."
      ];

      let step = 0;
      const interval = setInterval(() => {
          setLogs(prev => [...prev, steps[step]]);
          step++;
          if (step >= steps.length) {
              clearInterval(interval);
              setTimeout(() => {
                  setStatus('READY');
                  // Auto-redirect optional, but let's make user click the final button
              }, 800);
          }
      }, 600);
  };

  const handleLaunch = () => {
      if (onNavigate) {
          onNavigate('ENTERPRISE_SIMULATOR');
      } else {
          alert("Enterprise Module not linked in this environment.");
      }
  };

  if (status === 'PACKAGING' || status === 'READY') {
      return (
          <div className="flex flex-col items-center justify-center min-h-[400px] space-y-8 bg-slate-950 rounded-2xl border border-emerald-500/30 p-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-emerald-500/5 animate-pulse"></div>
              
              {/* Terminal View */}
              <div className="w-full max-w-lg bg-black rounded-xl border border-slate-800 font-mono text-xs p-4 h-48 overflow-y-auto custom-scrollbar shadow-2xl z-10">
                  <div className="text-emerald-500 font-bold mb-2">root@propertydex:~/export# ./transfer_to_enterprise.sh</div>
                  <div className="space-y-1 text-slate-300">
                      {logs.map((log, i) => (
                          <div key={i} className="animate-slideUp">
                              <span className="text-slate-500 mr-2">[{new Date().toLocaleTimeString()}]</span>
                              {log}
                          </div>
                      ))}
                      {status === 'READY' && (
                          <div className="text-emerald-400 font-bold animate-pulse mt-2">
                              >>> TRANSFER COMPLETE. SYSTEM READY.
                          </div>
                      )}
                  </div>
              </div>

              {status === 'READY' && (
                  <div className="z-10 animate-scaleIn">
                      <Button onClick={handleLaunch} className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold text-lg shadow-[0_0_30px_rgba(16,185,129,0.4)]">
                          🚀 Launch Enterprise Environment
                      </Button>
                  </div>
              )}
          </div>
      );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left: Manifest */}
        <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
            
            <h3 className="text-2xl font-bold text-white font-display mb-2">Project Manifest</h3>
            <p className="text-slate-400 text-sm mb-6">The following modules will be compiled into your final export package.</p>
            
            <div className="space-y-3 flex-1">
                {[
                    { id: 'DNA', label: 'Asset DNA & Strategy', size: '24KB', status: 'Ready' },
                    { id: 'LEGAL', label: 'Jurisdiction & SPV', size: '156KB', status: 'Ready' },
                    { id: 'TOKEN', label: 'Tokenomics Blueprint', size: '89KB', status: 'Ready' },
                    { id: 'FIN', label: 'Financial Models', size: '342KB', status: 'Validated' },
                    { id: 'DOCS', label: 'Legal Templates (Drafts)', size: '1.2MB', status: 'Ready' },
                ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-slate-950/50 rounded-lg border border-slate-800">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center text-slate-500 font-bold text-xs border border-slate-700">
                                {item.id}
                            </div>
                            <span className="text-sm font-bold text-slate-300">{item.label}</span>
                        </div>
                        <div className="text-right">
                            <div className="text-xs text-emerald-400 font-bold">{item.status}</div>
                            <div className="text-[10px] text-slate-600">{item.size}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Right: Action Center */}
        <div className="space-y-6">
            <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 text-center flex flex-col items-center justify-center h-full relative overflow-hidden">
                <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-5xl mb-6 shadow-2xl shadow-indigo-500/20 relative z-10">
                    📦
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2">Ready for Deployment</h3>
                <p className="text-slate-400 text-sm max-w-xs mx-auto mb-8">
                    Your project structure has been validated. You can now transfer this state to the Enterprise Engine for execution.
                </p>

                <div className="flex flex-col w-full gap-3 max-w-xs relative z-10">
                    <Button onClick={handleTransfer} className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-900/20">
                        Initiate Enterprise Transfer
                    </Button>
                    
                    <Button onClick={handleDownload} variant="secondary" className="w-full border-slate-700 text-slate-400 hover:text-white">
                        Download Archive (.zip)
                    </Button>
                </div>
                
                {/* Grid Overlay */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] opacity-5 pointer-events-none"></div>
            </div>
        </div>
    </div>
  );
};
