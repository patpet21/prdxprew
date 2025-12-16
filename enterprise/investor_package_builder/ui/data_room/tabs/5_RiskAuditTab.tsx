
import React, { useState } from 'react';
import { DataRoomProject } from '../../../domain/data_room.entity';
import { Button } from '../../../../../../components/ui/Button';
import { dataRoomService } from '../../../services/data_room_service';

interface Props {
  data: DataRoomProject;
  update: (field: keyof DataRoomProject, val: any) => void;
}

export const RiskAuditTab: React.FC<Props> = ({ data, update }) => {
  const { audit } = data;
  const [isAuditing, setIsAuditing] = useState(false);

  const runAudit = async () => {
      setIsAuditing(true);
      const result = await dataRoomService.runAudit(data);
      update('audit', { ...audit, score: result.score, flags: result.flags || [], status: 'Passed' });
      setIsAuditing(false);
  };

  const flags = audit?.flags || [];

  return (
    <div className="animate-fadeIn space-y-8">
        <div className="flex items-center justify-between">
            <div>
                <h3 className="text-xl font-bold text-white">Pre-Publication Audit</h3>
                <p className="text-slate-400 text-sm">Verify data room integrity before investors see it.</p>
            </div>
            <Button onClick={runAudit} isLoading={isAuditing} className="bg-red-600 hover:bg-red-500">
                Run Auto-Check
            </Button>
        </div>

        <div className="flex items-center justify-center p-8 bg-slate-900 rounded-2xl border border-slate-800">
            <div className="text-center">
                <div className="text-6xl font-bold text-white mb-2">{audit?.score || 0}/100</div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${(audit?.score || 0) > 80 ? 'bg-emerald-500 text-slate-900' : 'bg-amber-500 text-slate-900'}`}>
                    Readiness Score
                </span>
            </div>
        </div>

        <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
             <div className="p-4 bg-slate-950 border-b border-slate-800 font-bold text-sm text-slate-400 uppercase tracking-wider">
                 Audit Log
             </div>
             <div className="p-4 space-y-2">
                 {flags.length === 0 ? (
                     <p className="text-center text-slate-500 italic py-4">No flags detected. System ready.</p>
                 ) : (
                     flags.map((flag, i) => (
                         <div key={i} className="flex items-center justify-between p-3 rounded bg-slate-800/50 border border-slate-700">
                             <div className="flex items-center gap-3">
                                 <span className={`w-2 h-2 rounded-full ${flag.severity === 'high' ? 'bg-red-500' : 'bg-amber-500'}`}></span>
                                 <span className="text-sm text-slate-200">{flag.issue}</span>
                             </div>
                             <span className="text-xs text-slate-500 uppercase">{flag.area}</span>
                         </div>
                     ))
                 )}
             </div>
        </div>
    </div>
  );
};
