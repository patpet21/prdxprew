
import React, { useState, useEffect } from 'react';
import { runTokenSenseCheck } from '../../../../services/mockAiService';
import { Button } from '../../../ui/Button';

interface Props {
  raiseAmount: number;
  totalSupply: number;
  tokenPrice: number;
  onCorrect: (price: number, supply: number) => void;
}

export const AiSupplyValidator: React.FC<Props> = ({ raiseAmount, totalSupply, tokenPrice, onCorrect }) => {
  const [validation, setValidation] = useState<any>(null);
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
      // Debounce validation
      const timer = setTimeout(async () => {
          if (raiseAmount > 0 && totalSupply > 0) {
              setIsValidating(true);
              const res = await runTokenSenseCheck(raiseAmount, totalSupply, tokenPrice);
              setValidation(res);
              setIsValidating(false);
          }
      }, 1000);

      return () => clearTimeout(timer);
  }, [raiseAmount, totalSupply, tokenPrice]);

  if (isValidating) {
      return (
          <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-3">
              <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-xs text-slate-500 font-bold">AI Checking Math...</span>
          </div>
      );
  }

  if (validation && !validation.isReasonable) {
      return (
          <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-4 animate-slideUp">
              <div className="flex items-start gap-3">
                  <span className="text-xl">🤔</span>
                  <div className="flex-1">
                      <h5 className="text-sm font-bold text-amber-800 mb-1">Sense Check</h5>
                      <p className="text-xs text-amber-700 mb-3">{validation.issue}</p>
                      
                      {validation.suggestion && (
                          <div className="bg-white p-3 rounded-lg border border-amber-100 flex justify-between items-center">
                              <div className="text-xs text-slate-600">
                                  <span className="block font-bold">Suggestion:</span>
                                  Price ${validation.suggestion.price} • Supply {validation.suggestion.supply.toLocaleString()}
                              </div>
                              <Button 
                                onClick={() => onCorrect(validation.suggestion.price, validation.suggestion.supply)}
                                size="sm" 
                                className="bg-amber-500 hover:bg-amber-600 text-white text-[10px] h-7 px-3"
                              >
                                Auto-Fix
                              </Button>
                          </div>
                      )}
                  </div>
              </div>
          </div>
      );
  }

  if (validation && validation.isReasonable) {
      return (
          <div className="mt-4 flex items-center gap-2 text-emerald-600 text-xs font-bold animate-fadeIn px-2">
              <span>✓</span> Structure looks solid.
          </div>
      );
  }

  return null;
};
