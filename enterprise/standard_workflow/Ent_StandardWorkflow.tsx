import React, { useState, useCallback } from 'react';
import { TokenizationState } from '../../types';
import { Button } from '../../components/ui/Button';
import { 
  Ent_ProjectInitiationStep,
  Ent_JurisdictionStep, 
  Ent_AssetStep, 
  Ent_ComplianceStep, 
  Ent_TokenomicsStep, 
  Ent_DistributionStep, 
  Ent_SummaryStep 
} from './steps';

// Initial State identical to free simulator
const INITIAL_STATE: TokenizationState = {
  projectInfo: {
    projectName: '',
    projectGoal: 'Capital Raise',
    assetClass: 'Real Estate',
    targetRaiseAmount: 0,
    description: '',
    website: ''
  },
  jurisdiction: { 
    country: '', 
    region: '', 
    spvType: '', 
    regulatoryRegime: '',
    entityDetails: { companyName: '', directors: [], shareholders: [], shareCapital: 0, registeredAddress: '' }
  },
  property: {
    title: '',
    description: '',
    location: '',
    image_url: '',
    total_value: 0,
    token_price: 50,
    total_tokens: 0,
    available_tokens: 0,
    min_invest_tokens: 1,
    annual_yield: 0,
    gross_profit: 0,
    soft_cap: 0,
    hard_cap: 0,
    raise_amount: 0,
    total_costs: 0,
    property_type: 'Residenziale',
    category: 'Real Estate',
    status: 'draft',
    visibility: 'private',
    featured: false,
    is_user_created: true,
    risk_score: 3.0,
    occupancy_rate: 0,
    appreciation_rate: 0,
    leverage_ratio: 0,
    loan_interest_rate: 0,
    total_units: 1,
    bedrooms: 0,
    bathrooms: 0,
    interior_size_sqm: 0,
    exterior_size_sqm: 0,
    heating_type: '',
    building_class: '',
    renovated_status: '',
    platform_fees: 0,
    mediator_fees: 0,
    management_fee_percentage: 0,
    investor_share_percentage: 0,
    sponsor_commitment_eur: 0,
    rent_type: '',
    rent_subsidy: false,
    payout_type: '',
    distribution_frequency: 'Quarterly',
    lockup_months: 12,
    income_start_date: ''
  },
  compliance: { 
    kycProvider: '', 
    accreditationRequired: false, 
    amlCheckEnabled: true, 
    jurisdictionRestrictions: [],
    regFramework: 'None',
    retentionPolicy: '5 Years',
    whitelistingMode: 'Pre-Trade'
  },
  tokenAllocation: {
    founders: 0,
    investors: 0,
    treasury: 0,
    advisors: 0
  },
  distribution: { targetInvestorType: 'Accredited', minInvestment: 5000, maxInvestment: 0, marketingChannels: [] }
};

const STEPS = [
  { title: "Initiation", component: Ent_ProjectInitiationStep, desc: "Vision & Goals" },
  { title: "Jurisdiction", component: Ent_JurisdictionStep, desc: "Legal Entity & Region" },
  { title: "Asset Details", component: Ent_AssetStep, desc: "Valuation & Specs" },
  { title: "Compliance", component: Ent_ComplianceStep, desc: "KYC/AML Rules" },
  { title: "Tokenomics", component: Ent_TokenomicsStep, desc: "Supply & Price" },
  { title: "Distribution", component: Ent_DistributionStep, desc: "Investor Targeting" },
  { title: "Summary", component: Ent_SummaryStep, desc: "Review & Deploy" }
];

export const Ent_StandardWorkflow: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<TokenizationState>(INITIAL_STATE);
  const [isStepValid, setIsStepValid] = useState(false);

  const updateData = useCallback((section: keyof TokenizationState, payload: any) => {
    setData(prev => {
        const prevValue = prev[section];
        if (typeof prevValue === 'object' && prevValue !== null && !Array.isArray(prevValue) && typeof payload === 'object' && payload !== null && !Array.isArray(payload)) {
             return { ...prev, [section]: { ...(prevValue as any), ...payload } };
        }
        return { ...prev, [section]: payload };
    });
  }, []);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
      setIsStepValid(false);
    } else {
      // Deploy logic or final alert
      alert("Enterprise Standard Deployment Initiated.");
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      setIsStepValid(true);
    }
  };

  const CurrentStepComponent = STEPS[currentStep].component;
  const progressPercent = ((currentStep + 1) / STEPS.length) * 100;

  return (
    <div className="flex flex-col animate-fadeIn bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 h-full min-h-[600px]">
      
      {/* Header / Progress */}
      <div className="h-20 bg-slate-950 border-b border-slate-800 flex items-center justify-between px-8 shrink-0">
         <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">S</div>
            <div>
                <h2 className="text-lg font-bold text-white font-display leading-tight">Standard Workflow</h2>
                <p className="text-xs text-slate-400">Step {currentStep + 1} of {STEPS.length}: {STEPS[currentStep].title}</p>
            </div>
         </div>
         <div className="w-64 h-2 bg-slate-800 rounded-full overflow-hidden hidden md:block">
            <div className="h-full bg-indigo-500 transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
         </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-8 bg-slate-950">
         <div className="max-w-5xl mx-auto">
            <CurrentStepComponent 
                data={data} 
                updateData={updateData} 
                onValidationChange={setIsStepValid} 
            />
         </div>
      </div>

      {/* Footer Navigation */}
      <div className="h-20 bg-slate-900 border-t border-slate-800 flex items-center justify-between px-8 shrink-0">
          <Button 
            variant="secondary" 
            onClick={handleBack} 
            disabled={currentStep === 0}
            className="border-slate-700 text-slate-400 hover:text-white"
          >
             ← Back
          </Button>

          <div className="flex items-center gap-4">
              <div className={`hidden md:block text-xs font-bold px-3 py-1 rounded-full border ${isStepValid ? 'bg-emerald-900/30 border-emerald-500/50 text-emerald-400' : 'bg-amber-900/30 border-amber-500/50 text-amber-400'}`}>
                  {isStepValid ? 'Step Valid' : 'Complete Fields'}
              </div>
              <Button 
                onClick={handleNext} 
                className={`px-8 shadow-lg ${isStepValid ? 'bg-indigo-600 hover:bg-indigo-500 text-white' : 'bg-slate-700 text-slate-500 cursor-not-allowed'}`}
                disabled={!isStepValid}
              >
                 {currentStep === STEPS.length - 1 ? 'Deploy Project' : 'Next Step →'}
              </Button>
          </div>
      </div>

    </div>
  );
};