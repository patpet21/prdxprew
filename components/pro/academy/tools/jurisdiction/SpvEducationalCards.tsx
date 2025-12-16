
import React from 'react';

interface Props {
  cards?: { question: string, answer: string }[];
}

export const SpvEducationalCards: React.FC<Props> = ({ cards }) => {
  if (!cards || !Array.isArray(cards)) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slideUp">
        {cards.map((card, i) => (
            <div 
                key={i} 
                className="bg-white p-6 rounded-2xl border border-sim-border shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl group-hover:scale-110 transition-transform">🎓</div>
                
                <h5 className="font-bold text-sim-blue text-sm mb-3 pr-8 leading-snug">
                    {card.question}
                </h5>
                <p className="text-xs text-slate-600 leading-relaxed">
                    {card.answer}
                </p>
                
                <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">AI Insight</span>
                </div>
            </div>
        ))}
    </div>
  );
};
