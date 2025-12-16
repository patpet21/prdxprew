
import React, { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/Button';
import { businessPlanService } from '../services/business_plan_service';
import { BusinessPlanEntity } from '../domain/business_plan.entity';

export const BusinessPlanView: React.FC = () => {
  const [plan, setPlan] = useState<BusinessPlanEntity | null>(null);
  const [activeChapter, setActiveChapter] = useState<keyof BusinessPlanEntity>('executiveSummary');
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Mock Context (In a real app, this comes from the Redux store or API)
  const mockContext = {
      project: { name: "Skyline Tower", assetType: "Real Estate", goal: "Liquidity", location: "New York, NY" },
      spv: { country: "US-DE", legalForm: "Series LLC" },
      valuation: { valueCentral: "$25,000,000", currency: "USD", metrics: { irr: "14.5%", grossYield: "8.2%" } },
      token: { tokenSymbol: "SKY", tokenPrice: "$50", tokenStandard: "ERC-1400" }
  };

  // Initialize empty plan if none exists
  useEffect(() => {
    const init = async () => {
        if (!plan) {
            const emptyPlan = await businessPlanService.generatePlan(null, null, null, null);
            setPlan(emptyPlan);
        }
    };
    init();
  }, []);

  const handleGenerateChapter = async () => {
    if (!plan) return;
    setIsGenerating(true);
    
    try {
        const content = await businessPlanService.generateChapter(activeChapter, mockContext);
        const updatedPlan = await businessPlanService.updateChapter(plan, activeChapter, content);
        setPlan(updatedPlan);
        setLastSaved(new Date());
    } catch (e) {
        console.error(e);
        alert("AI generation failed. Please try again.");
    } finally {
        setIsGenerating(false);
    }
  };

  const handleContentChange = (text: string) => {
      if (!plan) return;
      setPlan({ ...plan, [activeChapter]: text });
      // In a real app, you'd debounce save this
  };

  const chapters = [
    { id: 'executiveSummary', label: 'Executive Summary', icon: '💎' },
    { id: 'marketAnalysis', label: 'Market Analysis', icon: '📊' },
    { id: 'assetAndStrategy', label: 'Asset & Strategy', icon: '🏢' },
    { id: 'spvAndTokenStructure', label: 'Structure & Token', icon: '⚖️' },
    { id: 'financialPlan', label: 'Financial Plan', icon: '💰' },
    { id: 'operationsAndGovernance', label: 'Ops & Governance', icon: '⚙️' },
    { id: 'goToMarket', label: 'Go-To-Market', icon: '🚀' },
    { id: 'riskAndMitigation', label: 'Risk Management', icon: '🛡️' },
    { id: 'exitStrategy', label: 'Exit Strategy', icon: '🚪' },
  ];

  if (!plan) return <div className="p-12 text-center text-slate-500">Initializing Business Plan Engine...</div>;

  const activeChapterConfig = chapters.find(c => c.id === activeChapter);
  const content = plan[activeChapter] as string;

  return (
    <div className="h-full flex flex-col bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 animate-fadeIn">
        
        {/* Top Bar */}
        <div className="h-16 bg-slate-900 border-b border-slate-800 flex justify-between items-center px-4 md:px-6 shrink-0">
            <div className="flex items-center gap-3">
                <span className="text-2xl hidden md:inline">💼</span>
                <div>
                    <h2 className="font-bold text-white text-base md:text-lg leading-tight">{mockContext.project.name}</h2>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">Business Plan</span>
                        {lastSaved && <span className="text-[10px] text-emerald-500">Saved {lastSaved.toLocaleTimeString()}</span>}
                    </div>
                </div>
            </div>
            <div className="flex gap-3">
                <button className="text-slate-400 hover:text-white text-xs md:text-sm font-bold flex items-center gap-2 px-3 py-1.5 rounded hover:bg-slate-800 transition-colors border border-slate-700">
                    <span className="hidden md:inline">Export</span> PDF
                </button>
            </div>
        </div>

        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            
            {/* Sidebar (Desktop) / Topbar (Mobile) */}
            <div className="w-full md:w-64 bg-slate-900 border-b md:border-b-0 md:border-r border-slate-800 flex md:flex-col overflow-x-auto md:overflow-y-auto custom-scrollbar shrink-0">
                <div className="p-2 md:p-4 flex md:flex-col gap-1 md:gap-2">
                    {chapters.map((chapter) => (
                        <button
                            key={chapter.id}
                            onClick={() => setActiveChapter(chapter.id as any)}
                            className={`
                                flex-shrink-0 md:flex-shrink w-auto text-left px-4 py-3 rounded-xl text-xs md:text-sm font-medium transition-all flex items-center gap-3
                                ${activeChapter === chapter.id 
                                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/20' 
                                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                                }
                            `}
                        >
                            <span className="text-lg">{chapter.icon}</span>
                            <span className="whitespace-nowrap">{chapter.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Editor Area */}
            <div className="flex-1 bg-slate-950 overflow-y-auto custom-scrollbar relative flex flex-col">
                
                {/* Chapter Toolbar */}
                <div className="sticky top-0 z-20 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h3 className="text-xl font-bold text-white font-display flex items-center gap-2">
                            {activeChapterConfig?.icon} {activeChapterConfig?.label}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1">
                            AI Context: {activeChapter === 'financialPlan' ? `Valuation ($${mockContext.valuation.valueCentral})` : activeChapter === 'spvAndTokenStructure' ? `Legal (${mockContext.spv.legalForm})` : `Project Data`}
                        </p>
                    </div>
                    
                    <Button 
                        onClick={handleGenerateChapter} 
                        isLoading={isGenerating}
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-900/20 px-6 py-2 text-xs uppercase tracking-wider w-full sm:w-auto"
                    >
                        {isGenerating ? 'AI Writing...' : content ? '✨ Regenerate' : '✨ Draft with AI'}
                    </Button>
                </div>

                {/* Editor Canvas */}
                <div className="flex-1 p-4 md:p-8 lg:p-12 max-w-4xl mx-auto w-full">
                    <div className="bg-white rounded-xl shadow-2xl min-h-[600px] p-8 md:p-12 relative">
                        {/* Paper Watermark */}
                        <div className="absolute top-6 right-6 opacity-5 pointer-events-none">
                            <div className="text-4xl font-display font-bold text-slate-900">DRAFT</div>
                        </div>

                        {/* Text Area */}
                        <textarea 
                            value={content || ''}
                            onChange={(e) => handleContentChange(e.target.value)}
                            placeholder={`Click "Draft with AI" to generate the ${activeChapterConfig?.label} section based on your project data...`}
                            className="w-full h-[600px] resize-none outline-none text-slate-800 text-base md:text-lg leading-relaxed font-serif placeholder:text-slate-300 placeholder:font-sans"
                        />
                    </div>
                    
                    {/* Helper Tip */}
                    <div className="mt-6 flex items-center justify-center gap-2 text-slate-500 text-xs">
                        <span className="text-lg">💡</span>
                        <p>You can edit this text manually or use AI to rewrite specific parts.</p>
                    </div>
                </div>

            </div>

        </div>
    </div>
  );
};
