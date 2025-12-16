
import React from 'react';

export const ComplianceEducationSection: React.FC = () => {
  const items = [
      {
          title: "Cos’è un compliance framework?",
          content: "Una serie di regole che determinano chi può investire, come puoi raccogliere fondi e cosa puoi promettere."
      },
      {
          title: "Perché servono limiti geografici?",
          content: "Perché ogni Paese ha regole diverse su cosa è considerato una security. Evita sanzioni internazionali."
      },
      {
          title: "Cosa NON è incluso?",
          content: "Consulenza legale formale. Questo è un blueprint realistico per iniziare, ma serve un avvocato per il lancio."
      }
  ];

  return (
    <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
       <div className="flex items-center gap-2 mb-6">
        <div className="w-6 h-6 rounded bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold">6</div>
        <h3 className="font-bold text-slate-700 text-lg">What You Should Know</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((item, i) => (
              <div key={i} className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
                  <h5 className="text-xs font-bold text-indigo-600 uppercase mb-2">{item.title}</h5>
                  <p className="text-sm text-slate-600 leading-relaxed">
                      {item.content}
                  </p>
              </div>
          ))}
      </div>

      <div className="mt-6 p-4 bg-indigo-900/5 border border-indigo-200 rounded-lg flex items-start gap-4">
          <span className="text-2xl">💡</span>
          <div>
              <h5 className="text-xs font-bold text-indigo-800 uppercase mb-1">Esempio Reale</h5>
              <p className="text-sm text-indigo-900/80 leading-relaxed">
                  <strong>Scenario:</strong> Asset negli USA + Investitori Globali.<br/>
                  <strong>Soluzione:</strong> Reg D (per Accredited US) + Reg S (per investitori non-US). Nessuna offerta retail in Europa senza prospetto.
              </p>
          </div>
      </div>
    </div>
  );
};
