
import React from 'react';
import { DataRoomProject } from '../../../domain/data_room.entity';
import { Button } from '../../../../../../components/ui/Button';

interface Props {
  data: DataRoomProject;
  update: (field: keyof DataRoomProject, val: any) => void;
}

export const ExportSyncTab: React.FC<Props> = ({ data, update }) => {
  const providers = ['Securitize', 'Tokeny', 'Fleap', 'Blocksquare'];

  return (
    <div className="animate-fadeIn space-y-8 h-full flex flex-col justify-center max-w-2xl mx-auto">
        
        <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-6 shadow-2xl">
                🚀
            </div>
            <h2 className="text-3xl font-bold text-white font-display mb-2">Launch Data Room</h2>
            <p className="text-slate-400 text-lg">
                Your deal package is audit-passed and ready for distribution.
            </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
            {providers.map(p => (
                <button 
                    key={p}
                    className={`p-4 rounded-xl border transition-all ${data.sync.provider === p ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-600'}`}
                    onClick={() => update('sync', { ...data.sync, provider: p })}
                >
                    <span className="font-bold">{p}</span>
                </button>
            ))}
        </div>

        <div className="flex flex-col gap-4">
            <Button className="w-full py-4 text-lg bg-emerald-600 hover:bg-emerald-500">
                Sync to {data.sync.provider}
            </Button>
            <Button variant="secondary" className="w-full border-slate-700">
                Download White-Label ZIP
            </Button>
        </div>

    </div>
  );
};
