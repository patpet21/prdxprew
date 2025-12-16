
import React from 'react';
import { DataRoomOrchestrator } from '../../../../enterprise/investor_package_builder/ui/data_room/DataRoomOrchestrator';

export const InvestorPackageBuilder: React.FC = () => {
  return (
    <div className="h-[calc(100vh-140px)]">
        <DataRoomOrchestrator />
    </div>
  );
};
