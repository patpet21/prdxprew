
import { useState, useEffect, useCallback } from 'react';
import { storageUtils } from '../utils/storageUtils';
import { FreeBusinessPlan, TokenizationState } from '../types';

const STORAGE_KEY = 'pdx_free_business_plan_data';

export const useFreeBusinessPlan = (initialData: TokenizationState) => {
  const [plan, setPlan] = useState<FreeBusinessPlan>({});

  // Initialize or Load
  useEffect(() => {
    const saved = storageUtils.load<FreeBusinessPlan>(STORAGE_KEY, {});
    
    // Check if we need to pre-fill from main simulation state
    // We only pre-fill if the specific field in the plan is empty to avoid overwriting user edits
    const newPlan = { ...saved };
    let hasUpdates = false;

    // Helper to fill if empty
    const fill = (key: string, value: string | undefined) => {
        if (!newPlan[key] && value) {
            newPlan[key] = value;
            hasUpdates = true;
        }
    };

    // Mapping logic
    fill('projectIdentification', `Project: ${initialData.projectInfo.projectName}\nGoal: ${initialData.projectInfo.projectGoal}`);
    fill('assetOverview', `${initialData.property.title} (${initialData.property.property_type})\nLocation: ${initialData.property.city}, ${initialData.property.country}\nValue: €${initialData.property.total_value}`);
    fill('legalStructureSpv', `${initialData.jurisdiction.spvType} in ${initialData.jurisdiction.country}`);
    fill('regulatoryCompliance', `${initialData.compliance.regFramework} targeting ${initialData.compliance.targetInvestorType}`);
    fill('tokenomicsPricing', `Supply: ${initialData.property.total_tokens}\nPrice: €${initialData.property.token_price}\nYield: ${initialData.property.annual_yield}%`);
    fill('capitalStructure', `Investors: ${initialData.tokenAllocation.investors}%\nSponsor: ${initialData.tokenAllocation.founders}%\nTreasury: ${initialData.tokenAllocation.treasury}%`);
    fill('distributionChannels', initialData.distribution.marketingChannels.join(', '));
    fill('executiveSummary', initialData.projectInfo.description);

    if (hasUpdates) {
        setPlan(newPlan);
        storageUtils.save(STORAGE_KEY, newPlan);
    } else {
        setPlan(saved);
    }
  }, []); // Run once on mount

  const updateSection = useCallback((section: string, content: string) => {
      setPlan(prev => {
          const updated = { ...prev, [section]: content };
          storageUtils.save(STORAGE_KEY, updated);
          return updated;
      });
  }, []);

  return {
      plan,
      updateSection
  };
};
