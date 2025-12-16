
import React from 'react';
import { ComplianceEducationSection } from '../sections/ComplianceEducationSection';
import { Button } from '../../../../components/ui/Button';

interface Props {
  onNext: () => void;
}

export const EducationTab: React.FC<Props> = ({ onNext }) => {
  return (
    <div className="animate-fadeIn h-full flex flex-col space-y-6 pb-20">
        
        <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 mb-2">
            <h3 className="text-lg font-bold text-indigo-900">Step 4: Knowledge Base</h3>
            <p className="text-sm text-indigo-800/70">Essential concepts for compliant token issuance.</p>
        </div>

        <div className="flex-1">
            <ComplianceEducationSection />
        </div>

        <div className="flex justify-end">
             <Button 
                onClick={onNext}
                className="bg-slate-900 text-white hover:bg-slate-800 px-8 py-4 text-base font-bold shadow-xl"
            >
                Next: AI Verdict →
            </Button>
        </div>
    </div>
  );
};
