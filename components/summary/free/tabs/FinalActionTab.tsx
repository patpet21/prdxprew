
import React from 'react';
import { Button } from '../../../../components/ui/Button';

// Mock tier for simulation - in real app this comes from context/auth
const USER_TIER = 'FREE' as 'FREE' | 'PRO' | 'ENTERPRISE'; 

export const FinalActionTab: React.FC = () => {
  
  const renderContent = () => {
    switch (USER_TIER) {
        case 'FREE':
            return (
                <div className="text-center max-w-2xl mx-auto">
                    <div className="text-6xl mb-6 animate-bounce">🚀</div>
                    <h3 className="text-3xl font-bold text-slate-900 mb-4 font-display">Ready to build for real?</h3>
                    <p className="text-slate-500 mb-8 text-lg">
                        Upgrade to Pro to generate your comprehensive Project File, legal templates, and access the structural simulator.
                    </p>
                    <Button className="px-10 py-4 text-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-500/30 rounded-xl w-full md:w-auto">
                        Upgrade to PRO: Generate Real Project File
                    </Button>
                </div>
            );
        case 'PRO':
            return (
                <div className="text-center max-w-2xl mx-auto">
                    <div className="text-6xl mb-6">📡</div>
                    <h3 className="text-3xl font-bold text-slate-900 mb-4 font-display">Submit for Review</h3>
                    <p className="text-slate-500 mb-8 text-lg">
                        Your project file is complete. Submit it to our Enterprise Partners for final compliance review and onboarding.
                    </p>
                    <Button className="px-10 py-4 text-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl shadow-emerald-500/30 rounded-xl w-full md:w-auto">
                        Submit to Provider (Enterprise Mode)
                    </Button>
                </div>
            );
        case 'ENTERPRISE':
            return (
                <div className="text-center max-w-2xl mx-auto">
                    <div className="text-6xl mb-6">⚡</div>
                    <h3 className="text-3xl font-bold text-slate-900 mb-4 font-display">Ready for Deployment</h3>
                    <p className="text-slate-500 mb-8 text-lg">
                        Your structure is validated. Proceed to the deployment dashboard to mint your tokens on mainnet.
                    </p>
                    <Button className="px-10 py-4 text-lg bg-slate-900 hover:bg-slate-800 text-white shadow-xl rounded-xl w-full md:w-auto">
                        Proceed to Deployment Dashboard
                    </Button>
                </div>
            );
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center animate-scaleIn bg-slate-50 rounded-2xl border-2 border-slate-100 p-8">
        {renderContent()}
    </div>
  );
};
