
import React from 'react';
import { ComplianceData } from '../../../../types';
import { ComplianceNotesSection } from '../sections/ComplianceNotesSection';
import { Button } from '../../../../components/ui/Button';

interface Props {
  compliance: ComplianceData;
  updateData: (field: string, val: any) => void;
  onNext: () => void;
}

export const StrategyNotesTab: React.FC<Props> = ({ compliance, updateData, onNext }) => {
  return (
    <div className="animate-fadeIn h-full flex flex-col space-y-6 pb-20">
        
        <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 mb-2">
            <h3 className="text-lg font-bold text-purple-900">Step 3: Strategic Blueprint</h3>
            <p className="text-sm text-purple-800/70">AI-generated summary of your compliance posture for legal review.</p>
        </div>

        <div className="flex-1 min-h-[500px]">
            <ComplianceNotesSection compliance={compliance} updateData={updateData} />
        </div>

        <div className="flex justify-end">
             <Button 
                onClick={onNext}
                className="bg-slate-900 text-white hover:bg-slate-800 px-8 py-4 text-base font-bold shadow-xl"
            >
                Save & Next: Education →
            </Button>
        </div>
    </div>
  );
};
