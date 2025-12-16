
import React from 'react';
import { Button } from '../../../../ui/Button';

interface Props {
  onNext: () => void;
}

export const EducationalCards: React.FC<Props> = ({ onNext }) => {
  const cards = [
      { 
          title: "Liquidity Premium", 
          icon: "💧", 
          desc: "Tokenized assets often trade at a premium because they are easier to buy/sell than physical paper deeds." 
      },
      { 
          title: "Fractionalization", 
          icon: "🍰", 
          desc: "Splitting a high-value asset (e.g. $10M Hotel) into affordable shares (e.g. $100 Tokens) to democratize access." 
      },
      { 
          title: "Legal Wrapper (SPV)", 
          icon: "🏛️", 
          desc: "Tokens don't hold walls. Tokens hold shares in a company (SPV) that owns the walls. This link is critical." 
      },
      { 
          title: "NOI vs ROI", 
          icon: "📈", 
          desc: "NOI is income from operations (Rent - Opex). ROI includes appreciation and leverage effects." 
      }
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
        <div className="text-center">
            <h3 className="text-xl font-bold text-slate-900">3. Key Concepts</h3>
            <p className="text-slate-500 text-sm">Understand the mechanics before building the model.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cards.map((card, i) => (
                <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
                    <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl group-hover:scale-110 transition-transform">{card.icon}</span>
                        <h4 className="font-bold text-indigo-900">{card.title}</h4>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">{card.desc}</p>
                </div>
            ))}
        </div>

        <div className="flex justify-end">
            <Button onClick={onNext} className="bg-slate-900 text-white">Next: Revenue Sim →</Button>
        </div>
    </div>
  );
};
