
import React, { useState } from 'react';
import { DataRoomProject } from '../../../domain/data_room.entity';
import { Button } from '../../../../../../components/ui/Button';
import { dataRoomService } from '../../../services/data_room_service';

interface Props {
  data: DataRoomProject;
  update: (field: keyof DataRoomProject, val: any) => void;
}

export const PackageBuilderTab: React.FC<Props> = ({ data, update }) => {
  const { package: pkg } = data;
  const [isBuilding, setIsBuilding] = useState(false);

  const build = async () => {
      setIsBuilding(true);
      const res = await dataRoomService.buildPackage(data);
      update('package', { ...pkg, deckSlides: res.slides || [], faq: res.faq || [] });
      setIsBuilding(false);
  };

  const slides = pkg?.deckSlides || [];
  const faqs = pkg?.faq || [];

  return (
    <div className="animate-fadeIn space-y-8">
        <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-white">Investor Material Generator</h3>
            <Button onClick={build} isLoading={isBuilding} className="bg-teal-600 hover:bg-teal-500">
                Assemble Materials
            </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Deck Outline */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h4 className="text-sm font-bold text-teal-400 uppercase mb-4">Pitch Deck Outline</h4>
                <div className="space-y-3">
                    {slides.map((slide, i) => (
                        <div key={i} className="p-3 bg-slate-950 rounded border border-slate-800">
                            <div className="flex justify-between text-xs text-slate-500 mb-1">
                                <span>Slide {i+1}</span>
                            </div>
                            <h5 className="text-white font-bold text-sm">{slide.title}</h5>
                            <p className="text-xs text-slate-400 mt-1 line-clamp-2">{slide.content}</p>
                        </div>
                    ))}
                    {slides.length === 0 && <p className="text-slate-500 text-sm">No slides generated.</p>}
                </div>
            </div>

            {/* FAQ & Memo */}
            <div className="space-y-6">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <h4 className="text-sm font-bold text-teal-400 uppercase mb-4">Investor FAQ</h4>
                    <div className="space-y-3">
                        {faqs.map((item, i) => (
                            <div key={i} className="p-3 bg-slate-950 rounded border border-slate-800">
                                <p className="text-xs font-bold text-white mb-1">Q: {item.q}</p>
                                <p className="text-xs text-slate-400">A: {item.a}</p>
                            </div>
                        ))}
                         {faqs.length === 0 && <p className="text-slate-500 text-sm">No FAQs generated.</p>}
                    </div>
                </div>
            </div>

        </div>
    </div>
  );
};
