
import React, { useState, useEffect, useRef } from 'react';
import { DeploymentData } from '../../types';
import { Button } from '../ui/Button';
import { ConfirmationDialog } from '../ui/ConfirmationDialog';

interface Props {
  deployment: DeploymentData;
  updateDeployment: (field: keyof DeploymentData, value: any) => void;
  onDeploy?: () => void;
}

export const GoLiveTab: React.FC<Props> = ({ deployment, updateDeployment, onDeploy }) => {
  const [isLaunching, setIsLaunching] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const executeLaunch = () => {
      setIsLaunching(true);
      const steps = [
          "Initializing secure connection to PropertyDEX Protocol...",
          "Verifying User Signature...",
          "Checking SPV Integrity... [OK]",
          "Compiling ERC-3643 Smart Contracts...",
          "Deploying Identity Registry...",
          "Deploying Token Contract...",
          "Minting Governance Supply...",
          "Setting Compliance Rules (Reg D / Reg S)...",
          "Registering Asset on Marketplace...",
          "Finalizing Deployment...",
          "SUCCESS: Asset is LIVE on Mainnet."
      ];

      let delay = 0;
      steps.forEach((step, index) => {
          delay += Math.random() * 800 + 400; // Random delay between 400ms and 1200ms
          setTimeout(() => {
              setLogs(prev => [...prev, `> ${step}`]);
              if (index === steps.length - 1) {
                  setTimeout(() => {
                      updateDeployment('goLive', { isLive: true, launchDate: new Date().toISOString() });
                      setIsLaunching(false);
                      if (onDeploy) onDeploy();
                  }, 1000);
              }
          }, delay);
      });
  };

  const handleLaunchClick = () => {
      setShowConfirm(true);
  };

  if (isLaunching) {
      return (
          <div className="h-[500px] bg-black rounded-2xl border border-emerald-500/50 p-6 font-mono text-xs md:text-sm overflow-hidden shadow-2xl relative">
              <div className="absolute top-0 left-0 w-full h-8 bg-emerald-900/20 border-b border-emerald-500/30 flex items-center px-4">
                  <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                      <div className="w-3 h-3 rounded-full bg-amber-500/50"></div>
                      <div className="w-3 h-3 rounded-full bg-emerald-500/50"></div>
                  </div>
                  <span className="ml-4 text-emerald-500/50">deploy_mainnet.sh</span>
              </div>
              <div className="mt-8 h-full overflow-y-auto pb-8 custom-scrollbar" ref={scrollRef}>
                  {logs.map((log, i) => (
                      <div key={i} className="mb-1 text-emerald-400 animate-slideUp">
                          {log}
                      </div>
                  ))}
                  <div className="w-2 h-4 bg-emerald-500 animate-pulse inline-block align-middle ml-1"></div>
              </div>
          </div>
      );
  }

  if (deployment.goLive.isLive) {
      return (
          <div className="flex flex-col items-center justify-center py-12 animate-scaleIn text-center">
              <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-5xl mb-6 shadow-2xl shadow-emerald-500/20">
                  🚀
              </div>
              <h2 className="text-4xl font-bold text-slate-900 mb-4 font-display">Project Live!</h2>
              <p className="text-slate-500 max-w-md mx-auto text-lg mb-8">
                  Your asset has been successfully tokenized and listed. Redirecting to Marketplace...
              </p>
              <Button className="bg-slate-900 text-white px-8 py-3 shadow-lg" onClick={() => window.location.href = "/projects"}>
                  Go to Marketplace
              </Button>
          </div>
      );
  }

  return (
    <div className="flex flex-col items-center justify-center py-8 animate-fadeIn">
         <div className="bg-gradient-to-b from-slate-900 to-indigo-950 text-white rounded-3xl p-10 md:p-14 max-w-2xl w-full text-center shadow-2xl border border-indigo-500/30 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none"></div>
             <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none -mr-20 -mt-20"></div>
             
             <div className="relative z-10">
                 <h3 className="text-3xl font-bold font-display mb-6">Ready for Liftoff?</h3>
                 <p className="text-indigo-200 text-lg mb-10 leading-relaxed">
                     Il tuo progetto diventerà visibile agli investitori qualificati.
                     <br/>Sarà possibile sottoscrivere token, ricevere yield e partecipare al mercato secondario.
                 </p>
                 
                 <Button 
                    onClick={handleLaunchClick}
                    className="w-full py-5 text-xl font-bold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white shadow-xl shadow-emerald-900/40 transform hover:-translate-y-1 transition-all rounded-xl"
                 >
                     LAUNCH ON MARKETPLACE
                 </Button>
                 
                 <p className="text-xs text-slate-500 mt-6 uppercase tracking-widest font-bold flex items-center justify-center gap-2">
                     <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
                     Live Mainnet Transaction
                 </p>
             </div>
         </div>

         <ConfirmationDialog 
            isOpen={showConfirm}
            onClose={() => setShowConfirm(false)}
            onConfirm={executeLaunch}
            title="Confirm Mainnet Deployment"
            message="You are about to deploy this asset to the live network. This action is irreversible and will incur gas fees. Are you sure you want to proceed?"
            confirmText="Yes, Deploy Now"
            variant="danger"
         />
    </div>
  );
};
