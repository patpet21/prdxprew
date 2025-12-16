
import React, { useState, useEffect } from 'react';
import { StepProps } from '../types';
import { LegalCorporateTab } from '../components/final_deploy/LegalCorporateTab';
import { SmartContractTab } from '../components/final_deploy/SmartContractTab';
import { CustodyTab } from '../components/final_deploy/CustodyTab';
import { KycOnboardingTab } from '../components/final_deploy/KycOnboardingTab';
import { MarketplaceTab } from '../components/final_deploy/MarketplaceTab';
import { GoLiveTab } from '../components/final_deploy/GoLiveTab';

type DeployTab = 'LEGAL' | 'CONTRACT' | 'CUSTODY' | 'KYC' | 'LISTING' | 'GOLIVE';

// Augment StepProps to include onDeploy if it's passed from WizardPage
interface FinalDeployStepProps extends StepProps {
    onDeploy?: () => void;
}

export const FinalDeployStep: React.FC<FinalDeployStepProps> = ({ data, updateData, activeTabId, onTabChange, onValidationChange, onDeploy }) => {
  const [activeTab, setActiveTab] = useState<DeployTab>('LEGAL');

  // Sync with parent sidebar
  useEffect(() => {
    if (activeTabId) setActiveTab(activeTabId as DeployTab);
  }, [activeTabId]);

  // Always valid for now as user moves freely in this step
  useEffect(() => {
    onValidationChange(true);
  }, [onValidationChange]);

  const handleTabClick = (tab: DeployTab) => {
    setActiveTab(tab);
    if (onTabChange) onTabChange(tab);
  };

  // Initialize deployment state if missing
  useEffect(() => {
      if (!data.deployment) {
          updateData('deployment', {
              legal: { spvName: data.jurisdiction.entityDetails.companyName || '', documentsStatus: { termSheet: 'Pending', offeringMemo: 'Pending', operatingAgreement: 'Pending' }, status: 'Pending' },
              smartContract: { chain: 'Polygon', standard: 'ERC-3643', status: 'Pending' },
              custody: { provider: '', coldStorage: true, status: 'Pending' },
              kyc: { regimes: ['Reg D'], status: 'Pending' },
              marketplace: { eligibilityChecks: {}, listingStatus: 'Draft' },
              goLive: { isLive: false }
          });
      }
  }, []);

  if (!data.deployment) return <div className="p-8 text-center text-slate-500">Initializing Deployment Module...</div>;

  const updateDeployment = (field: string, value: any) => {
      updateData('deployment', { ...data.deployment, [field]: value });
  };

  const renderContent = () => {
      switch (activeTab) {
          case 'LEGAL': return <LegalCorporateTab deployment={data.deployment!} updateDeployment={updateDeployment} />;
          case 'CONTRACT': return <SmartContractTab deployment={data.deployment!} updateDeployment={updateDeployment} />;
          case 'CUSTODY': return <CustodyTab deployment={data.deployment!} updateDeployment={updateDeployment} />;
          case 'KYC': return <KycOnboardingTab deployment={data.deployment!} updateDeployment={updateDeployment} />;
          case 'LISTING': return <MarketplaceTab deployment={data.deployment!} updateDeployment={updateDeployment} />;
          case 'GOLIVE': return <GoLiveTab deployment={data.deployment!} updateDeployment={updateDeployment} onDeploy={onDeploy} />;
          default: return null;
      }
  };

  return (
    <div className="h-full flex flex-col animate-fadeIn pb-12">
        
        <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-600 text-white text-xs font-bold uppercase tracking-widest mb-4 shadow-lg shadow-indigo-500/30">
                <span className="animate-pulse">🚀</span> Phase 3: Deployment
            </div>
            <h2 className="text-4xl font-bold font-display text-slate-900 mb-2">Final Launch Configuration</h2>
            <p className="text-slate-500 text-lg">PRO / Enterprise</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-10">
            <div className="bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm inline-flex overflow-x-auto max-w-full no-scrollbar">
                {[
                    { id: 'LEGAL', label: '1. Legal', icon: '🏛️' },
                    { id: 'CONTRACT', label: '2. Contract', icon: '⚡' },
                    { id: 'CUSTODY', label: '3. Custody', icon: '🔐' },
                    { id: 'KYC', label: '4. KYC', icon: '🆔' },
                    { id: 'LISTING', label: '5. Listing', icon: '📢' },
                    { id: 'GOLIVE', label: '6. Go Live', icon: '🚀' },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => handleTabClick(tab.id as DeployTab)}
                        className={`
                            px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap
                            ${activeTab === tab.id 
                                ? 'bg-slate-900 text-white shadow-md' 
                                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                            }
                        `}
                    >
                        <span className="text-base">{tab.icon}</span>
                        {tab.label}
                    </button>
                ))}
            </div>
        </div>

        <div className="flex-1 min-h-[500px]">
            {renderContent()}
        </div>

    </div>
  );
};
