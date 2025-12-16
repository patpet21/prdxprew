
import React, { useEffect, useState } from 'react';
import { TokenizationPartner } from '../data/tokenization_partners';
import { tokenBlueprintService } from '../services/token_blueprint_service';
import { Button } from '../../../components/ui/Button';
import { DynamicPartnerForm } from './forms/DynamicPartnerForm';
import { PARTNER_FORMS_DATA } from '../data/partner_forms.data';
import { RegulatedHandoffTab } from './RegulatedHandoffTab';
import { RegulatedHandoffPackage } from '../domain/token_blueprint.entity';

interface Props {
  partner: TokenizationPartner;
  projectContext: any;
  onBack: () => void;
  onComplete: () => void; // Used to switch to DeFi mode if requested
}

export const PartnerConfiguration: React.FC<Props> = ({ partner, projectContext, onBack, onComplete }) => {
  const [view, setView] = useState<'FORM' | 'HANDOFF'>('FORM');
  const [aiTips, setAiTips] = useState<string[]>([]);
  const [loadingAi, setLoadingAi] = useState(true);
  const [handoffPackage, setHandoffPackage] = useState<RegulatedHandoffPackage | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Load the schema for the selected partner
  const formSchema = PARTNER_FORMS_DATA[partner.id];

  useEffect(() => {
    const fetchAdvice = async () => {
      setLoadingAi(true);
      try {
        const tips = await tokenBlueprintService.generatePartnerAdvice(partner, projectContext);
        setAiTips(tips);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingAi(false);
      }
    };
    fetchAdvice();
  }, [partner]);

  const handleFormSubmit = async (formData: any) => {
      setIsGenerating(true);
      try {
          // Generate the Handoff Package via Service
          const result = await tokenBlueprintService.generateRegulatedHandoff(partner, projectContext, formData);
          setHandoffPackage(result);
          setView('HANDOFF');
      } catch (e) {
          console.error("Handoff Generation Failed", e);
          alert("Failed to generate handoff package. Please try again.");
      } finally {
          setIsGenerating(false);
      }
  };

  if (view === 'HANDOFF' && handoffPackage) {
      return (
          <RegulatedHandoffTab 
              handoffData={handoffPackage}
              onSend={() => { /* Finalize state */ }}
              onSwitchToDeFi={onComplete}
          />
      );
  }

  return (
    <div className="h-full flex flex-col md:flex-row gap-6 animate-fadeIn">
      
      {/* Left: Configuration Form */}
      <div className="flex-1 bg-slate-900/50 rounded-2xl border border-slate-800 p-6 overflow-y-auto custom-scrollbar relative">
        <div className="flex items-center gap-4 mb-8 border-b border-slate-800 pb-6 sticky top-0 bg-slate-950/90 backdrop-blur-sm z-10 -mt-6 -mx-6 pt-6 px-6">
           <div className="text-4xl">{partner.logo}</div>
           <div>
             <h3 className="text-2xl font-bold text-white font-display">Configure {partner.name}</h3>
             <p className="text-slate-400 text-sm">{partner.license}</p>
           </div>
        </div>

        {isGenerating ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <h4 className="text-white font-bold">Generating Handoff Package...</h4>
                <p className="text-slate-500 text-sm mt-1">Synthesizing SPV and Token Data.</p>
            </div>
        ) : formSchema ? (
            <DynamicPartnerForm 
                schema={formSchema} 
                onSubmit={handleFormSubmit} 
                onCancel={onBack} 
            />
        ) : (
            <div className="text-center py-12 text-slate-500">
                <p>No specific configuration form found for {partner.name}.</p>
                <Button onClick={() => handleFormSubmit({})} className="mt-4">Skip & Generate Package</Button>
            </div>
        )}
      </div>

      {/* Right: AI Insight Panel */}
      <div className="w-full md:w-80 bg-slate-900 rounded-2xl border border-slate-800 p-6 flex flex-col h-fit sticky top-0">
         <div className="flex items-center gap-2 mb-4 text-blue-400">
            <span className="text-lg">🤖</span>
            <h4 className="text-sm font-bold uppercase tracking-wider">Partner Advisor</h4>
         </div>
         
         {loadingAi ? (
            <div className="space-y-3 animate-pulse">
               <div className="h-20 bg-slate-800 rounded-xl"></div>
               <div className="h-20 bg-slate-800 rounded-xl"></div>
            </div>
         ) : (
            <div className="space-y-4 overflow-y-auto custom-scrollbar max-h-[600px]">
               {aiTips.map((tip, i) => (
                 <div key={i} className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                    <p className="text-sm text-slate-300 leading-relaxed">
                      <span className="text-blue-500 font-bold mr-2">Tip {i+1}:</span>
                      {tip}
                    </p>
                 </div>
               ))}
               <div className="p-4 bg-blue-900/20 border border-blue-500/20 rounded-xl mt-4">
                  <h5 className="text-xs font-bold text-blue-300 uppercase mb-2">Tech Requirement</h5>
                  <p className="text-xs text-blue-100/70">
                     {partner.aiHints}
                  </p>
               </div>
            </div>
         )}
      </div>

    </div>
  );
};
