import React from 'react';
import { ComplianceData } from '../../../../types';
import { RegulatorySection } from '../sections/RegulatorySection';
import { InvestorEligibilitySection } from '../sections/InvestorEligibilitySection';
import { GeoRestrictionsSection } from '../sections/GeoRestrictionsSection';
import { Button } from '../../../../components/ui/Button';

interface Props {
  compliance: ComplianceData;
  updateData: (field: string, val: any) => void;
  onNext: () => void;
}

export const FrameworkConfigTab: React.FC<Props> = ({ compliance, updateData, onNext }) => {
  return (
    <div className="space-y-6 animate-fadeIn pb-24 relative h-full flex flex-col">
        
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-2">
            <h3 className="text-lg font-bold text-slate-900">Step 1: Define Parameters</h3>
            <p className="text-sm text-slate-500">Configure the legal boundaries of your digital asset.</p>
        </div>

        {/* TOP ROW: Regulatory (Full Width) */}
        <div className="w-full">
            <RegulatorySection compliance={compliance} updateData={updateData} />
        </div>

        {/* BOTTOM ROW: 2 Columns */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 flex-1">
            <div className="h-full min-h-[400px]">
                <InvestorEligibilitySection compliance={compliance} updateData={updateData} />
            </div>
            <div className="h-full min-h-[400px]">
                <GeoRestrictionsSection compliance={compliance} updateData={updateData} />
            </div>
        </div>

        {/* Sticky Footer Action Bar */}
        <div className="fixed bottom-0 left-0 w-full lg:absolute lg:w-full lg:bottom-0 lg:left-0 p-4 lg:p-0 z-20 pointer-events-none flex justify-end">
             <div className="pointer-events-auto shadow-2xl shadow-indigo-900/20 rounded-2xl overflow-hidden">
                <Button 
                    variant="sim"
                    onClick={onNext}
                    className="px-8 py-4 text-base font-bold flex items-center justify-center gap-3 transform transition-all active:scale-95"
                >
                    <span>Save & Next: Risk Analysis</span>
                    <span className="bg-white/20 px-2 py-0.5 rounded text-xs">→</span>
                </Button>
             </div>
        </div>
        
    </div>
  );
};