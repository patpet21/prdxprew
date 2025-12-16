
import React, { useState, useEffect } from 'react';
import { Button } from '../../../../ui/Button';
import { Select } from '../../../../ui/Select';
import { generatePitchDeck } from '../../../../../services/mockAiService';

interface DeckSlide {
    id: string;
    type: 'Title' | 'Content';
    title: string;
    subtitle?: string;
    snapshot?: { target: string, return: string, horizon: string };
    mainText?: string;
    bullets?: string[];
    visualCue?: string;
    speakerNotes: string;
}

const SLIDE_LABELS: Record<string, string> = {
    'slide_1': 'Title Card',
    'slide_2': 'Problem',
    'slide_3': 'Solution',
    'slide_4': 'Structure',
    'slide_5': 'Market',
    'slide_6': 'Financials',
    'slide_7': 'Distribution',
    'slide_8': 'Risks',
    'slide_9': 'Roadmap',
    'slide_10': 'The Ask'
};

export const PitchDeckGenerator: React.FC = () => {
  const [inputs, setInputs] = useState({
      investorType: 'Institutional',
      deckStyle: 'Data-Driven',
      coreMessage: '',
      raiseAmount: 0
  });

  const [slides, setSlides] = useState<DeckSlide[]>([]);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const simState = JSON.parse(localStorage.getItem('pdx_simulator_state') || '{}');
    if (simState?.projectInfo) {
        setInputs(prev => ({
            ...prev,
            coreMessage: simState.projectInfo.description || '',
            raiseAmount: simState.projectInfo.targetRaiseAmount || 0
        }));
    }

    const savedReport = JSON.parse(localStorage.getItem('academyPro_reports') || '{}');
    if (savedReport.pitchDeck && savedReport.pitchDeck.slides) {
        setSlides(savedReport.pitchDeck.slides);
    }
  }, []);

  const handleGenerate = async () => {
      setIsGenerating(true);
      
      // Construct rich context for the AI
      const fullContext = JSON.parse(localStorage.getItem('pdx_simulator_state') || '{}');
      // Adding specific pro data if available for deeper context
      fullContext.proReports = JSON.parse(localStorage.getItem('academyPro_reports') || '{}');
      fullContext.proDistribution = JSON.parse(localStorage.getItem('academyPro_distribution') || '{}');
      fullContext.proPayout = JSON.parse(localStorage.getItem('academyPro_payout') || '{}');
      
      // We pass the context as the first argument, inputs as second
      // The updated service signature handles this properly
      const result = await generatePitchDeck(fullContext, inputs);
      
      if (result && result.slides) {
          const slides = result.slides as DeckSlide[];
          setSlides(slides);
          handleSaveLocally(slides);
      }
      setIsGenerating(false);
  };

  const handleSaveLocally = (slidesToSave: DeckSlide[]) => {
      const currentReports = JSON.parse(localStorage.getItem('academyPro_reports') || '{}');
      currentReports.pitchDeck = { slides: slidesToSave };
      localStorage.setItem('academyPro_reports', JSON.stringify(currentReports));
  };

  const handleManualSave = () => {
      setIsSaving(true);
      handleSaveLocally(slides);
      setTimeout(() => {
          setIsSaving(false);
          alert("Deck saved successfully.");
      }, 500);
  };

  const updateSlide = (index: number, field: keyof DeckSlide, value: any) => {
      const newSlides = [...slides];
      newSlides[index] = { ...newSlides[index], [field]: value };
      setSlides(newSlides);
  };

  const renderSlideEditor = (slide: DeckSlide, index: number) => {
      if (slide.type === 'Title') {
          return (
              <div className="space-y-6">
                  <div className="bg-slate-900 text-white p-8 rounded-xl shadow-2xl relative overflow-hidden aspect-video flex flex-col justify-center">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                      <div className="relative z-10 text-center">
                          <input 
                              value={slide.title}
                              onChange={(e) => updateSlide(index, 'title', e.target.value)}
                              className="bg-transparent text-4xl font-bold font-display text-center w-full outline-none placeholder:text-slate-600"
                              placeholder="Project Title"
                          />
                          <input 
                              value={slide.subtitle}
                              onChange={(e) => updateSlide(index, 'subtitle', e.target.value)}
                              className="bg-transparent text-lg text-slate-400 text-center w-full outline-none mt-2"
                              placeholder="Subtitle"
                          />
                          
                          <div className="mt-8 flex justify-center gap-8 text-left">
                              <div className="bg-white/10 p-3 rounded-lg border border-white/10 w-32">
                                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Target</span>
                                  <span className="text-sm font-bold">{slide.snapshot?.target}</span>
                              </div>
                              <div className="bg-white/10 p-3 rounded-lg border border-white/10 w-32">
                                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Return</span>
                                  <span className="text-sm font-bold text-emerald-400">{slide.snapshot?.return}</span>
                              </div>
                              <div className="bg-white/10 p-3 rounded-lg border border-white/10 w-32">
                                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Horizon</span>
                                  <span className="text-sm font-bold">{slide.snapshot?.horizon}</span>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          );
      }

      return (
          <div className="space-y-6">
              <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-xl aspect-video flex flex-col relative">
                  <div className="mb-6 border-b border-slate-100 pb-4">
                      <input 
                          value={slide.title}
                          onChange={(e) => updateSlide(index, 'title', e.target.value)}
                          className="text-3xl font-bold text-slate-900 font-display w-full outline-none"
                      />
                  </div>
                  
                  <div className="flex-1 flex gap-8">
                      <div className="w-1/2">
                          <textarea 
                              value={slide.mainText}
                              onChange={(e) => updateSlide(index, 'mainText', e.target.value)}
                              className="w-full h-40 text-sm text-slate-600 leading-relaxed outline-none resize-none"
                          />
                          <div className="mt-4 space-y-2">
                              {slide.bullets?.map((bullet, bIdx) => (
                                  <div key={bIdx} className="flex gap-2">
                                      <span className="text-indigo-500 font-bold">•</span>
                                      <input 
                                          value={bullet}
                                          onChange={(e) => {
                                              const newBullets = [...(slide.bullets || [])];
                                              newBullets[bIdx] = e.target.value;
                                              updateSlide(index, 'bullets', newBullets);
                                          }}
                                          className="flex-1 text-sm text-slate-700 outline-none border-b border-transparent focus:border-slate-200"
                                      />
                                  </div>
                              ))}
                          </div>
                      </div>
                      
                      <div className="w-1/2 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center text-center p-4">
                          <div>
                              <span className="text-4xl mb-2 block opacity-30">🖼️</span>
                              <span className="text-xs font-bold text-slate-400 uppercase">Visual Suggestion</span>
                              <p className="text-xs text-slate-500 mt-2 italic">"{slide.visualCue}"</p>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      );
  };

  const activeSlide = slides[activeSlideIndex];

  return (
    <div className="flex flex-col h-full bg-slate-50 rounded-xl overflow-hidden border border-slate-200">
        
        {/* TOP: CONFIGURATION */}
        <div className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-600 rounded-lg text-white">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>
                </div>
                <div>
                    <h3 className="font-bold text-slate-900 text-lg">Pitch Deck Architect</h3>
                    <p className="text-slate-500 text-xs">AI-Optimized for Investment Committees</p>
                </div>
            </div>

            <div className="flex gap-2 items-center">
                 <Select 
                    label="" 
                    value={inputs.investorType} 
                    onChange={e => setInputs({...inputs, investorType: e.target.value})}
                    options={[
                        { value: 'Retail', label: 'Retail (Crowd)' },
                        { value: 'Accredited', label: 'Accredited Angels' },
                        { value: 'Institutional', label: 'Institutional (Funds)' }
                    ]}
                    className="w-48 text-sm"
                 />
                 <Button onClick={handleGenerate} isLoading={isGenerating} className="bg-slate-900 text-white shadow-lg">
                    {slides.length > 0 ? 'Regenerate All' : 'Generate Full Deck'}
                 </Button>
            </div>
        </div>

        {/* MAIN WORKSPACE */}
        <div className="flex-1 flex overflow-hidden">
            
            {/* LEFT: SLIDE NAV */}
            <div className="w-64 bg-slate-50 border-r border-slate-200 overflow-y-auto p-2 hidden md:block shrink-0">
                <div className="space-y-1">
                    {slides.length > 0 ? slides.map((slide, idx) => (
                        <button
                            key={slide.id}
                            onClick={() => setActiveSlideIndex(idx)}
                            className={`
                                w-full text-left px-3 py-3 rounded-lg text-sm font-medium transition-all flex items-center gap-3
                                ${activeSlideIndex === idx 
                                    ? 'bg-white text-indigo-600 shadow-sm border border-slate-200' 
                                    : 'text-slate-500 hover:bg-slate-100'
                                }
                            `}
                        >
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${activeSlideIndex === idx ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-200 text-slate-500'}`}>
                                {idx + 1}
                            </span>
                            <span className="truncate">{SLIDE_LABELS[slide.id] || slide.title}</span>
                        </button>
                    )) : (
                        <div className="text-center p-4 text-xs text-slate-400">
                            No slides generated yet.
                        </div>
                    )}
                </div>
            </div>

            {/* CENTER: SLIDE EDITOR */}
            <div className="flex-1 bg-slate-100 p-4 md:p-8 overflow-y-auto custom-scrollbar flex flex-col items-center">
                {activeSlide ? (
                    <div className="w-full max-w-5xl space-y-6">
                        {renderSlideEditor(activeSlide, activeSlideIndex)}
                        
                        {/* Speaker Notes */}
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                            <h4 className="text-xs font-bold text-amber-600 uppercase mb-2 flex items-center gap-2">
                                <span>🎙️</span> Speaker Notes
                            </h4>
                            <textarea 
                                value={activeSlide.speakerNotes}
                                onChange={(e) => updateSlide(activeSlideIndex, 'speakerNotes', e.target.value)}
                                className="w-full bg-transparent text-sm text-slate-700 leading-relaxed outline-none resize-none h-20"
                                placeholder="Notes for your presentation script..."
                            />
                        </div>

                        {/* Navigation Footer */}
                        <div className="flex justify-between pt-4">
                            <Button variant="secondary" disabled={activeSlideIndex === 0} onClick={() => setActiveSlideIndex(p => p - 1)}>
                                Previous Slide
                            </Button>
                            <div className="flex gap-2">
                                <Button variant="secondary" onClick={handleManualSave} disabled={isSaving}>
                                    {isSaving ? 'Saving...' : 'Save Progress'}
                                </Button>
                                <Button disabled={activeSlideIndex === slides.length - 1} onClick={() => setActiveSlideIndex(p => p + 1)}>
                                    Next Slide
                                </Button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center mt-20 text-slate-400">
                        <span className="text-6xl block mb-4 opacity-20">📊</span>
                        Generate your deck to start editing.
                    </div>
                )}
            </div>

        </div>

    </div>
  );
};