
import React, { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/Button';
import { investorPackageService } from '../services/investor_package_service';
import { InvestorPackageEntity, DeckSlide, FAQItem } from '../domain/investor_package.entity';
import { InvestorDeckPreview } from './InvestorDeckPreview';

export const InvestorPackageWizard: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [packageData, setPackageData] = useState<InvestorPackageEntity | null>(null);
  const [activeTab, setActiveTab] = useState<'OUTLINE' | 'NARRATIVE' | 'FAQ' | 'PREVIEW'>('OUTLINE');

  // Mock Inputs (In real app, these come from props/context)
  const mockProject = { name: "Skyline Tower", assetType: "Real Estate", location: "New York" };
  const mockSpv = { legalForm: "Delaware LLC", jurisdictionCode: "US-DE" };
  const mockValuation = { valueCentral: "$15M", metrics: { irr: "14%", grossYield: "8%" } };
  const mockToken = { tokenPrice: "$50", hardCap: "$15M", tokenStandard: "ERC-1400" };

  const handleGenerate = async () => {
      setIsGenerating(true);
      try {
          const result = await investorPackageService.generatePackage(mockProject, mockSpv, mockValuation, mockToken);
          setPackageData(result);
          setIsGenerating(false);
      } catch (e) {
          console.error(e);
          setIsGenerating(false);
      }
  };

  const updateSlide = (idx: number, field: keyof DeckSlide, val: any) => {
      if (!packageData) return;
      const newOutline = [...packageData.deckOutline];
      newOutline[idx] = { ...newOutline[idx], [field]: val };
      setPackageData({ ...packageData, deckOutline: newOutline });
  };

  const updateNarrative = (val: string) => {
      if (!packageData) return;
      setPackageData({ ...packageData, narrativeMarkdown: val });
  };

  if (!packageData) {
      return (
          <div className="h-full flex flex-col items-center justify-center bg-slate-900 rounded-2xl border border-slate-800 p-12 text-center">
              <div className="w-20 h-20 bg-indigo-500/20 text-indigo-400 rounded-3xl flex items-center justify-center text-4xl mb-6 shadow-lg shadow-indigo-500/10">
                  📦
              </div>
              <h2 className="text-3xl font-bold text-white font-display mb-4">Data Room Architect</h2>
              <p className="text-slate-400 max-w-lg mx-auto mb-10 text-lg">
                  Turn your SPV, Valuation, and Token structures into a professional investor package automatically.
                  Generates Deck Outline, Investment Memo, and FAQs.
              </p>
              <Button 
                onClick={handleGenerate} 
                isLoading={isGenerating}
                className="px-10 py-4 text-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-900/20"
              >
                  {isGenerating ? 'Architecting Deal...' : 'Generate Investor Package'}
              </Button>
          </div>
      );
  }

  return (
    <div className="h-full flex flex-col animate-fadeIn space-y-6">
        
        {/* Header */}
        <div className="flex justify-between items-center shrink-0">
            <div className="flex items-center gap-4">
                <h2 className="text-2xl font-bold text-white font-display">Deal Architect</h2>
                <span className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold border border-emerald-500/20">Package Ready</span>
            </div>
            <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800">
                {['OUTLINE', 'NARRATIVE', 'FAQ', 'PREVIEW'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`px-4 py-2 rounded-md text-xs font-bold transition-all ${activeTab === tab ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
            
            {/* OUTLINE TAB */}
            {activeTab === 'OUTLINE' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-slideUp">
                    {packageData.deckOutline.map((slide, i) => (
                        <div key={slide.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-indigo-500/50 transition-colors group">
                            <div className="flex justify-between items-center mb-3">
                                <div className="flex items-center gap-3">
                                    <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center text-xs font-bold">{i+1}</span>
                                    <input 
                                        value={slide.slideTitle}
                                        onChange={(e) => updateSlide(i, 'slideTitle', e.target.value)}
                                        className="bg-transparent text-white font-bold outline-none border-b border-transparent focus:border-indigo-500 transition-colors"
                                    />
                                </div>
                                <span className="text-[10px] text-slate-600 uppercase font-bold group-hover:text-indigo-400">Slide</span>
                            </div>
                            <div className="pl-9 space-y-2">
                                {slide.keyPoints.map((pt, j) => (
                                    <div key={j} className="flex items-start gap-2 text-sm text-slate-400">
                                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-600"></span>
                                        <span className="flex-1">{pt}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 pl-9 pt-4 border-t border-slate-800">
                                <p className="text-xs text-indigo-400 italic">
                                    <span className="font-bold not-italic text-slate-500">Visual: </span> 
                                    {slide.visualSuggestion}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* NARRATIVE TAB */}
            {activeTab === 'NARRATIVE' && (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-1 animate-slideUp h-full flex flex-col">
                    <div className="bg-slate-950 px-4 py-2 rounded-t-xl border-b border-slate-800 flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Investment Memo Editor</span>
                        <span className="text-xs text-slate-500">Markdown Supported</span>
                    </div>
                    <textarea 
                        value={packageData.narrativeMarkdown}
                        onChange={(e) => updateNarrative(e.target.value)}
                        className="flex-1 w-full bg-slate-900 p-6 text-slate-300 leading-relaxed outline-none resize-none font-sans text-base rounded-b-xl focus:ring-2 focus:ring-indigo-900/20"
                    />
                </div>
            )}

            {/* FAQ TAB */}
            {activeTab === 'FAQ' && (
                <div className="space-y-4 animate-slideUp">
                    {packageData.faq.map((item, i) => (
                        <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-all">
                            <div className="flex items-start gap-4">
                                <div className="text-2xl opacity-50">❓</div>
                                <div className="flex-1">
                                    <input 
                                        value={item.question}
                                        onChange={() => {}} // Add handler
                                        className="w-full bg-transparent text-white font-bold text-lg outline-none mb-2"
                                    />
                                    <textarea 
                                        value={item.answer}
                                        onChange={() => {}} // Add handler
                                        className="w-full bg-slate-950/50 rounded-lg p-3 text-slate-400 text-sm border border-slate-800 outline-none focus:border-indigo-500 transition-colors h-24 resize-none"
                                    />
                                    <div className="mt-3 flex justify-end">
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-800 px-2 py-1 rounded">
                                            {item.category}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    <button className="w-full py-4 border-2 border-dashed border-slate-800 rounded-xl text-slate-500 hover:text-white hover:border-slate-600 hover:bg-slate-800/50 transition-all font-bold text-sm">
                        + Add Custom FAQ
                    </button>
                </div>
            )}

            {/* PREVIEW TAB */}
            {activeTab === 'PREVIEW' && (
                <div className="animate-slideUp pb-10">
                    <InvestorDeckPreview pkg={packageData} />
                    <div className="flex justify-center gap-4 mt-8">
                        <Button className="bg-white text-slate-900 hover:bg-slate-200 shadow-xl">Download PDF</Button>
                        <Button variant="outline" className="border-slate-600 text-slate-300 hover:text-white">Share Link</Button>
                    </div>
                </div>
            )}

        </div>
    </div>
  );
};
