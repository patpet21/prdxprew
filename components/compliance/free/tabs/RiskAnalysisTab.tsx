
import React from 'react';
import { ComplianceData } from '../../../../types';
import { RiskFlagsSection } from '../sections/RiskFlagsSection';
import { Button } from '../../../../components/ui/Button';

interface Props {
  compliance: ComplianceData;
  updateData: (field: string, val: any) => void;
  onNext: () => void;
}

export const RiskAnalysisTab: React.FC<Props> = ({ compliance, updateData, onNext }) => {
  return (
    <div className="animate-fadeIn h-full flex flex-col space-y-6 pb-20">
        
        <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 mb-2">
            <h3 className="text-lg font-bold text-orange-900">Step 2: Risk Detection</h3>
            <p className="text-sm text-orange-800/70">Our engine scans your parameters for regulatory conflicts.</p>
        </div>

        <div className="flex-1 min-h-[500px]">
            <RiskFlagsSection compliance={compliance} updateData={updateData} />
        </div>

        <div className="flex justify-end">
             <Button 
                onClick={onNext}
                className="bg-slate-900 text-white hover:bg-slate-800 px-8 py-4 text-base font-bold shadow-xl"
            >
                Save & Next: Strategy →
            </Button>
        </div>
    </div>
  );
};
