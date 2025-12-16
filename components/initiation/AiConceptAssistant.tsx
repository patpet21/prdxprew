import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { InitiationService, ConceptRefinement } from '../../services/initiationService';

interface Props {
  onRefined: (data: ConceptRefinement) => void;
}

export const AiConceptAssistant: React.FC<Props> = ({ onRefined }) => {
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [hasRun, setHasRun] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<ConceptRefinement | null>(null);

  const handleMagic = async () => {
    if (!input.trim()) return;
    setIsThinking(true);
    try {
      const result = await InitiationService.refineConcept(input);
      setGeneratedResult(result);
      setHasRun(true);
    } catch (e) {
      console.error(e);
    } finally {
      setIsThinking(false);
    }
  };

  const handleApply = () => {
      if (generatedResult) {
          onRefined(generatedResult);
      }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-900 rounded-2xl p-1 shadow-2xl border border-indigo-500/30 overflow-hidden">
      <div className="bg-slate-950/80 backdrop-blur-md rounded-xl p-6 md:p-8">
        
        {/* Header */}
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center text-2xl border border-indigo-500/40 shadow-[0_0_15px_rgba(99,102,241,0.3)]">
            <span className="text-sim-ai">✨</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white font-display">AI Concept Refiner</h3>
            <p className="text-slate-400 text-sm mt-1 max-w-lg">
              Descrivi la tua azienda in linguaggio naturale. L'AI estrarrà i dati chiave e genererà un profilo istituzionale.
            </p>
          </div>
        </div>

        {/* Examples / Instructions */}
        {!hasRun && (
            <div className="mb-4 p-4 bg-indigo-900/20 border border-indigo-500/20 rounded-lg">
                <p className="text-xs text-indigo-300 uppercase font-bold mb-2">Cosa scrivere nell'input:</p>
                <ul className="text-sm text-slate-300 space-y-1 list-disc list-inside">
                    <li>Tipo di asset (es. Hotel, Terreno, Startup)</li>
                    <li>Valore stimato o Obiettivo di raccolta</li>
                    <li>Posizione (Città, Paese)</li>
                    <li>Strategia (es. Ristrutturazione, Vendita, Dividendi)</li>
                </ul>
            </div>
        )}

        {/* Interaction Area */}
        <div className="relative">
           <textarea
             value={input}
             onChange={(e) => setInput(e.target.value)}
             disabled={isThinking}
             placeholder="Esempio: Possiedo un Boutique Hotel a Firenze del valore di 5M. Voglio raccogliere 1M per ristrutturarlo e offrire il 10% di rendimento annuo agli investitori..."
             className="w-full h-32 bg-slate-900 border border-slate-700 rounded-xl p-4 text-white placeholder-slate-600 focus:ring-2 focus:ring-sim-ai focus:border-transparent outline-none resize-none transition-all text-sm leading-relaxed"
           />
           
           <div className="absolute bottom-4 right-4">
             <Button 
                onClick={handleMagic} 
                isLoading={isThinking}
                className="bg-sim-cta hover:bg-sim-cta-hover text-white shadow-lg shadow-indigo-900/40 px-6 py-2 h-auto text-xs uppercase tracking-wider font-bold"
             >
                {isThinking ? 'Analizzando...' : 'Genera Template'}
             </Button>
           </div>
        </div>

        {hasRun && generatedResult && (
           <div className="mt-6 animate-slideUp">
              <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 mb-4">
                  <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Anteprima Generata</h4>
                  <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                          <span className="text-[10px] text-slate-500 block">Titolo</span>
                          <span className="text-white font-bold text-sm">{generatedResult.suggestedTitle}</span>
                      </div>
                      <div>
                          <span className="text-[10px] text-slate-500 block">Asset Class</span>
                          <span className="text-white font-bold text-sm">{generatedResult.assetClass}</span>
                      </div>
                  </div>
                  <div>
                      <span className="text-[10px] text-slate-500 block">Descrizione</span>
                      <p className="text-slate-300 text-sm leading-relaxed">{generatedResult.professionalDescription}</p>
                  </div>
              </div>

              <Button onClick={handleApply} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg">
                  Usa questo Template & Compila Dettagli →
              </Button>
           </div>
        )}

      </div>
    </div>
  );
};