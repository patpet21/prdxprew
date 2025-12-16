
import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { TokenizationState } from '../../types';

interface Props {
  data: TokenizationState;
}

export const WhatHappensNextTab: React.FC<Props> = ({ data }) => {
  const [isDeploying, setIsDeploying] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [deployed, setDeployed] = useState(false);

  const handleDeploySim = () => {
    setIsDeploying(true);
    // Simulate API call to create record in assets_demo
    setTimeout(() => {
        setIsDeploying(false);
        setDeployed(true);
    }, 2000);
  };

  const handleExport = () => {
      setIsExporting(true);
      setTimeout(() => {
          setIsExporting(false);
          // Simulate download trigger
          alert("Project_Report_Full.pdf downloaded.");
      }, 1500);
  };

  const handleProUpgrade = () => {
      // In a real app, this would trigger the Stripe/Payment modal or navigate to pricing
      alert("Redirecting to Pro Upgrade flow...");
  };

  return (
    <div className="animate-fadeIn space-y-8 pb-12">
        
        <div className="text-center max-w-3xl mx-auto mb-8">
            <h3 className="text-3xl font-bold text-slate-900 font-display mb-3">Choose Your Path</h3>
            <p className="text-slate-500 text-lg">
                You have completed the configuration. How do you want to proceed?
            </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            
            {/* PATH A: DEPLOY SIMULATION */}
            <div className="bg-white rounded-3xl p-8 border-2 border-indigo-100 shadow-xl hover:shadow-2xl hover:border-indigo-300 transition-all flex flex-col relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full -mr-4 -mt-4 z-0 group-hover:bg-indigo-100 transition-colors"></div>
                <div className="relative z-10 flex-1 flex flex-col">
                    <div className="w-16 h-16 bg-indigo-600 text-white rounded-2xl flex items-center justify-center text-3xl shadow-lg mb-6">
                        🎮
                    </div>
                    <h4 className="text-2xl font-bold text-slate-900 mb-2">Deploy Simulation</h4>
                    <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold uppercase tracking-wider mb-6 w-fit">
                        Free Forever
                    </span>
                    <p className="text-slate-600 mb-6 leading-relaxed flex-1">
                        Publish this project to your <strong>Personal Portfolio</strong> and the <strong>Demo Marketplace</strong>. 
                        <br/><br/>
                        Visualizza come apparirebbe agli investitori reali, testa la UX e condividi il link "Read-Only".
                    </p>
                    
                    {deployed ? (
                        <div className="w-full py-4 bg-green-50 border border-green-200 text-green-700 rounded-xl font-bold text-center flex items-center justify-center gap-2">
                            <span>✓</span> Deployed to DemoNet
                        </div>
                    ) : (
                        <Button 
                            onClick={handleDeploySim} 
                            isLoading={isDeploying}
                            className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-200"
                        >
                            {isDeploying ? 'Minting Demo Assets...' : 'Publish to Portfolio'}
                        </Button>
                    )}
                </div>
            </div>

            {/* PATH B: REAL LAUNCH (HERO) */}
            <div className="bg-slate-900 rounded-3xl p-8 border-2 border-amber-500 shadow-2xl relative overflow-hidden transform hover:-translate-y-2 transition-all duration-300 flex flex-col">
                {/* Animated Background */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-slate-800/50 to-slate-900 pointer-events-none"></div>
                
                <div className="relative z-10 flex-1 flex flex-col text-center lg:text-left">
                    <div className="flex justify-between items-start mb-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-600 text-white rounded-2xl flex items-center justify-center text-3xl shadow-lg shadow-amber-500/20 animate-pulse">
                            🚀
                        </div>
                        <span className="px-3 py-1 bg-amber-500 text-slate-900 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg">
                            Recommended
                        </span>
                    </div>

                    <h4 className="text-3xl font-bold text-white mb-2 font-display">Real Launch</h4>
                    <span className="text-amber-400 font-bold text-sm uppercase tracking-widest mb-6 block">
                        Upgrade to Professional
                    </span>

                    <p className="text-slate-300 mb-8 leading-relaxed flex-1">
                        Trasforma la tua simulazione in un progetto reale. 
                        <br/><br/>
                        La versione PRO ti porta dal modello alla tokenizzazione effettiva:
                        <ul className="mt-4 space-y-2 text-left">
                            <li className="flex items-center gap-2"><span className="text-amber-500">✓</span> Costituzione SPV Reale</li>
                            <li className="flex items-center gap-2"><span className="text-amber-500">✓</span> Smart Contracts (ERC-3643)</li>
                            <li className="flex items-center gap-2"><span className="text-amber-500">✓</span> Onboarding KYC & Custodia</li>
                        </ul>
                    </p>

                    <Button 
                        onClick={handleProUpgrade} 
                        className="w-full py-5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-900 font-bold text-lg rounded-xl shadow-xl shadow-amber-900/30"
                    >
                        Unlock Real World Launch
                    </Button>
                </div>
            </div>

            {/* PATH C: EXPORT REPORT */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl hover:shadow-2xl transition-all flex flex-col relative group">
                <div className="absolute bottom-0 right-0 p-6 opacity-5 text-9xl pointer-events-none group-hover:scale-110 transition-transform">📄</div>
                <div className="relative z-10 flex-1 flex flex-col">
                    <div className="w-16 h-16 bg-slate-100 text-slate-600 rounded-2xl flex items-center justify-center text-3xl shadow-sm mb-6 border border-slate-200">
                        📥
                    </div>
                    <h4 className="text-2xl font-bold text-slate-900 mb-2">Export Report</h4>
                    <span className="inline-block px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-xs font-bold uppercase tracking-wider mb-6 w-fit">
                        PDF / DOCX
                    </span>
                    <p className="text-slate-600 mb-6 leading-relaxed flex-1">
                        Scarica un <strong>Whitepaper Professionale</strong> generato dai tuoi dati.
                        <br/><br/>
                        Perfetto da inviare a partner legali o co-founder. Include l'analisi di fattibilità e la roadmap normativa.
                    </p>

                    <Button 
                        onClick={handleExport} 
                        isLoading={isExporting}
                        variant="secondary"
                        className="w-full py-4 border-2 border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-900 font-bold rounded-xl"
                    >
                        {isExporting ? 'Generating PDF...' : 'Download Executive Report'}
                    </Button>
                </div>
            </div>

        </div>
        
        <div className="mt-12 text-center">
             <p className="text-xs text-slate-400">
                 By clicking "Unlock Real World", you agree to our Terms of Service for institutional issuance.
             </p>
        </div>
    </div>
  );
};
