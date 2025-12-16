import React from 'react';

export const VestingEducationTab: React.FC = () => {
  
  const cards = [
      {
          title: "Che cos'è il Lock-up?",
          icon: "🔒",
          desc: "Un periodo di tempo in cui i token NON possono essere venduti o trasferiti.",
          detail: "Serve a prevenire che i fondatori o i primi investitori vendano subito (dump), facendo crollare il prezzo per gli altri.",
          color: "bg-red-50 border-red-100 text-red-800"
      },
      {
          title: "Che cos'è il Vesting?",
          icon: "⏳",
          desc: "Il rilascio graduale dei token nel tempo.",
          detail: "Esempio: Invece di ricevere il 100% dei token subito, un fondatore ne riceve il 25% ogni anno per 4 anni. Questo garantisce impegno a lungo termine.",
          color: "bg-blue-50 border-blue-100 text-blue-800"
      },
      {
          title: "La Treasury",
          icon: "🏦",
          desc: "Una riserva di token non distribuiti.",
          detail: "Viene usata per finanziare sviluppi futuri, pagare partnership o fornire liquidità al mercato quando necessario. È il 'tesoretto' del progetto.",
          color: "bg-amber-50 border-amber-100 text-amber-800"
      },
      {
          title: "Sponsor Allocation",
          icon: "🏗️",
          desc: "La percentuale trattenuta da chi crea il progetto.",
          detail: "Gli investitori vogliono vedere 'Skin in the Game' (solitamente 10-20%), ma se è troppo alta (>50%) pensano che lo sponsor voglia solo arricchirsi.",
          color: "bg-emerald-50 border-emerald-100 text-emerald-800"
      }
  ];

  return (
    <div className="animate-fadeIn space-y-6">
        <div className="text-center mb-4">
            <h3 className="text-2xl font-bold text-slate-900">Concetti Chiave</h3>
            <p className="text-slate-500 text-sm">Capire la terminologia della distribuzione.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cards.map((card, i) => (
                <div key={i} className={`p-6 rounded-2xl border ${card.color} transition-all hover:shadow-md`}>
                    <div className="flex items-center gap-3 mb-3">
                        <span className="text-3xl">{card.icon}</span>
                        <h4 className="font-bold text-lg">{card.title}</h4>
                    </div>
                    <p className="font-bold text-sm mb-2 opacity-90">{card.desc}</p>
                    <p className="text-sm opacity-75 leading-relaxed">{card.detail}</p>
                </div>
            ))}
        </div>
    </div>
  );
};