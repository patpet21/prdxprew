
import React, { useState } from 'react';
import { GLOSSARY_DATA, LICENSING_DATA } from '../../../../content/compliance/glossaryData';
import { TooltipAI } from '../../../../components/ui/TooltipAI';
import { Button } from '../../../../components/ui/Button';

type Category = 'legal' | 'corporate' | 'blockchain' | 'finance' | 'ops' | 'licensing';

interface Props {
    onNext?: () => void;
}

export const KnowledgeCenterTab: React.FC<Props> = ({ onNext }) => {
  const [activeCategory, setActiveCategory] = useState<Category>('legal');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
      { id: 'legal', label: 'Compliance & Legal', icon: '⚖️' },
      { id: 'corporate', label: 'Corporate / SPV', icon: '🏢' },
      { id: 'blockchain', label: 'Blockchain & Tech', icon: '🔗' },
      { id: 'finance', label: 'Finance & Tokenomics', icon: '📊' },
      { id: 'ops', label: 'Operational Terms', icon: '⚙️' },
      { id: 'licensing', label: 'Provider Licenses', icon: '📜' },
  ];

  // Filter Logic
  const filteredTerms = GLOSSARY_DATA.filter(item => 
      (item.category === activeCategory) && 
      (item.term.toLowerCase().includes(searchTerm.toLowerCase()) || item.definition.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="h-full flex flex-col lg:flex-row gap-8 animate-fadeIn pb-12">
        
        {/* Sidebar Navigation */}
        <div className="w-full lg:w-72 flex-shrink-0">
            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 sticky top-24 shadow-xl">
                <h3 className="text-white font-bold text-lg mb-6 px-2 font-display border-b border-slate-800 pb-4">Knowledge Base</h3>
                
                <div className="relative mb-6">
                    <input 
                        type="text" 
                        placeholder="Search terms..." 
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 px-4 text-sm text-white focus:border-indigo-500 outline-none transition-all placeholder:text-slate-600"
                    />
                    <span className="absolute right-4 top-3 text-slate-500 text-sm">🔍</span>
                </div>

                <div className="space-y-2">
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => { setActiveCategory(cat.id as Category); setSearchTerm(''); }}
                            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-3 border ${activeCategory === cat.id ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg transform scale-105' : 'bg-transparent text-slate-400 border-transparent hover:bg-slate-800 hover:text-white'}`}
                        >
                            <span className="text-lg">{cat.icon}</span>
                            {cat.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
            <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                 <div>
                     <h2 className="text-3xl font-bold text-slate-900 font-display tracking-tight">
                         {categories.find(c => c.id === activeCategory)?.label}
                     </h2>
                     <p className="text-slate-500 text-base mt-2">
                         Essential definitions and strategic importance for your project.
                     </p>
                 </div>
                 {onNext && (
                    <Button 
                        onClick={onNext}
                        className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 shadow-lg text-sm"
                    >
                        Continue to Finish →
                    </Button>
                )}
            </div>

            {/* Special Layout for Licensing */}
            {activeCategory === 'licensing' ? (
                <div className="grid grid-cols-1 gap-6">
                    {LICENSING_DATA.map((region, idx) => (
                        <div key={idx} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                                <h3 className="font-bold text-slate-800 text-lg">{region.jurisdiction}</h3>
                                <span className="text-xs bg-white border border-slate-300 px-2 py-1 rounded text-slate-600 font-mono font-bold">
                                    {region.jurisdiction.substring(0,3).toUpperCase()}
                                </span>
                            </div>
                            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {region.licenses.map((lic, i) => (
                                    <div key={i} className="p-5 rounded-xl border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/30 transition-colors group">
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                                            <h4 className="font-bold text-slate-900 text-base group-hover:text-indigo-700 transition-colors">{lic.name} <TooltipAI term={lic.name} /></h4>
                                        </div>
                                        <p className="text-sm text-slate-600 mb-4 leading-relaxed">{lic.description}</p>
                                        <div className="flex items-center gap-2 mt-auto">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Provider:</span>
                                            <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-700 font-medium">{lic.holder}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                /* Standard Glossary Grid */
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {filteredTerms.length > 0 ? filteredTerms.map((item, i) => (
                        <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group h-full flex flex-col">
                            <div className="flex justify-between items-start mb-3">
                                <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                                    {item.term}
                                </h3>
                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${item.category === 'legal' ? 'bg-blue-50 text-blue-700 border-blue-100' : item.category === 'finance' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-50 text-slate-600 border-slate-100'}`}>
                                    {item.category}
                                </span>
                            </div>
                            
                            <p className="text-sm text-slate-700 font-medium mb-4 leading-relaxed flex-1">
                                {item.definition}
                            </p>

                            <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-100 mb-4">
                                <p className="text-xs text-slate-600 leading-snug">
                                    <strong className="text-slate-900 block mb-1 uppercase text-[10px] tracking-wider">Importance</strong> {item.importance}
                                </p>
                            </div>

                            <div className="flex items-center gap-2 text-xs text-slate-400 mt-auto pt-2 border-t border-slate-50">
                                <span className="text-lg">💡</span>
                                <span className="italic text-slate-500 font-medium">"{item.example}"</span>
                            </div>
                        </div>
                    )) : (
                        <div className="col-span-full text-center py-16 bg-white rounded-3xl border-2 border-dashed border-slate-200 text-slate-400">
                            <div className="text-4xl mb-4 opacity-30">🔍</div>
                            <p className="text-lg font-medium">No terms found for "{searchTerm}"</p>
                            <p className="text-sm">Try a different search or category.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    </div>
  );
};
