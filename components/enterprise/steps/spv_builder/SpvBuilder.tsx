import React from 'react';
import { SPVWizard } from '../../../../enterprise/spv_builder/ui/SPVWizard';

export const SpvBuilder: React.FC = () => {
  return (
    <div className="space-y-6 h-[calc(100vh-140px)]">
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-white font-display">SPV Structuring Engine</h2>
          <p className="text-slate-400 text-sm">Design the legal wrapper for your asset.</p>
        </div>
      </div>
      <SPVWizard />
    </div>
  );
};