
import React from 'react';
import { Button } from '../components/ui/Button';
import { TopNavigation } from '../components/ui/TopNavigation';
import Footer from '../components/ui/Footer';
import { AccessControl } from '../services/accessControl';

interface HomePageProps {
  onStartSimulation: () => void;
  onLogin: () => void;
  onNavigate: (page: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onStartSimulation, onLogin, onNavigate }) => {
  const isUnlocked = AccessControl.isUnlocked();

  return (
    <div className="min-h-screen bg-slate-950 font-sans flex flex-col overflow-x-hidden selection:bg-indigo-500 selection:text-white">
      
      <TopNavigation 
        onNavigate={onNavigate} 
        onLogin={onLogin} 
        onStartSimulation={onStartSimulation}
        activePage="HOME" 
      />

      {/* --- HERO SECTION --- */}
      <section className="relative pt-24 pb-20 lg:pt-32 lg:pb-32 overflow-hidden">
        {/* Background Grid & Effects */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 pointer-events-none"></div>
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>

        <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10 text-center">
            
            {/* Disclaimer Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/80 border border-slate-800 text-slate-400 text-[10px] md:text-xs font-bold uppercase tracking-widest mb-8 shadow-lg backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                In Development • No Investment Offering • No Live Execution
            </div>

            <h1 className="text-4xl md:text-7xl font-black font-display text-white tracking-tight leading-[1.1] mb-6">
                PropertyDEX is an early-stage <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-blue-400 to-emerald-400">
                    framework for real estate tokenization.
                </span>
            </h1>

            <p className="text-lg md:text-2xl text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed font-light">
                It focuses on structure, logic, and decision-making — <br className="hidden md:block"/> 
                <span className="text-slate-200 font-medium">before execution, products, or investments.</span>
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-slideUp delay-200">
                <Button 
                    onClick={onStartSimulation} 
                    className="h-16 px-8 text-base md:text-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_30px_rgba(79,70,229,0.3)] rounded-2xl w-full sm:w-auto transform hover:-translate-y-1 transition-all border border-indigo-400/20"
                >
                    PropertyDEX – Tokenization Framework
                </Button>
                <button 
                    onClick={() => onNavigate('PRO_ACADEMY')}
                    className="h-16 px-8 text-base md:text-lg bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-300 font-bold rounded-2xl w-full sm:w-auto transition-all flex items-center justify-center gap-2 hover:text-white"
                >
                    PropertyDEX – Tokenization Foundations
                </button>
            </div>
      </section>

      {/* --- PHILOSOPHY SECTION (What It Is / Is Not) --- */}
      <section className="py-20 px-4 bg-slate-950 border-y border-slate-900">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
              
              <div className="bg-slate-900/50 p-8 rounded-3xl border border-slate-800/50">
                  <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                      <span className="text-emerald-500">✓</span> What PropertyDEX Is
                  </h3>
                  <ul className="space-y-4 text-slate-400 leading-relaxed">
                      <li>PropertyDEX helps professionals understand how real-world asset tokenization actually works.</li>
                      <li>It provides a structured way to explore jurisdictions, legal frameworks, asset structures, and token design.</li>
                      <li className="text-slate-200 font-medium">The goal is clarity, not speed.</li>
                  </ul>
              </div>

              <div className="bg-slate-900/50 p-8 rounded-3xl border border-slate-800/50">
                  <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                      <span className="text-red-500">✕</span> What PropertyDEX Is Not
                  </h3>
                  <ul className="space-y-4 text-slate-400 leading-relaxed">
                      <li>PropertyDEX is not an investment platform.</li>
                      <li>It does not offer tokens, financial products, or fundraising opportunities.</li>
                      <li className="text-slate-200 font-medium">It is not a finished commercial solution.</li>
                  </ul>
              </div>

          </div>
      </section>

      {/* --- ACCESS TIERS SECTION --- */}
      <section className="py-24 px-4 bg-slate-50 text-slate-900">
          <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                  <h2 className="text-3xl md:text-5xl font-bold font-display text-slate-900 mb-4">Access Levels</h2>
                  <p className="text-lg text-slate-500">PropertyDEX is being developed progressively.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  
                  {/* FREE CARD */}
                  <div className="p-8 rounded-[2rem] bg-white border border-slate-200 shadow-xl flex flex-col relative group hover:scale-[1.02] transition-transform duration-300">
                      <div className="mb-6">
                          <h3 className="text-2xl font-bold text-slate-900">Free Access</h3>
                          <div className="h-1 w-12 bg-indigo-500 mt-2 rounded-full"></div>
                      </div>
                      <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                          Free access allows users to explore the core tokenization framework. It includes foundational content and limited exploratory tools. This level is open to anyone who wants to understand the basics.
                      </p>
                      
                      <div className="mt-auto space-y-3">
                          <Button onClick={() => onNavigate('PRO_ACADEMY')} variant="secondary" className="w-full justify-center border-slate-200 text-slate-600 hover:text-slate-900">
                              Tokenization Foundations
                          </Button>
                          <Button onClick={onStartSimulation} className="w-full justify-center bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg">
                              Tokenization Framework
                          </Button>
                      </div>
                  </div>

                  {/* PRO CARD */}
                  <div className="p-8 rounded-[2rem] bg-slate-900 text-white border border-slate-800 shadow-2xl flex flex-col relative overflow-hidden transform md:-translate-y-4">
                      <div className="absolute top-0 right-0 p-4">
                          <span className="bg-amber-500 text-slate-900 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                              Early Access
                          </span>
                      </div>
                      
                      <div className="mb-6">
                          <h3 className="text-2xl font-bold text-amber-400">Professional</h3>
                          <div className="h-1 w-12 bg-amber-500 mt-2 rounded-full"></div>
                      </div>
                      
                      <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                          The Professional tier is currently in private development. Designed for developers, investors, and advisors who want to explore advanced structures. Access is granted selectively to early testers.
                      </p>
                      
                      <div className="mt-auto">
                           <p className="text-[10px] text-slate-500 mb-3 text-center">No payment required for Early Access.</p>
                           <Button 
                                onClick={() => onNavigate('ACCESS_REQUEST')} 
                                className="w-full justify-center bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold"
                            >
                                Request Early Access
                            </Button>
                      </div>
                  </div>

                  {/* ENTERPRISE CARD */}
                  <div className="p-8 rounded-[2rem] bg-white border border-slate-200 shadow-xl flex flex-col relative group hover:scale-[1.02] transition-transform duration-300">
                      <div className="absolute top-0 right-0 p-4">
                          <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                              Private Preview
                          </span>
                      </div>

                      <div className="mb-6">
                          <h3 className="text-2xl font-bold text-slate-900">Enterprise</h3>
                          <div className="h-1 w-12 bg-slate-900 mt-2 rounded-full"></div>
                      </div>

                      <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                          The Enterprise tier is intended for institutions and structured partners. It is available only through private evaluation and direct contact. There is no public access at this stage.
                      </p>
                      
                      <div className="mt-auto">
                          <Button onClick={() => onNavigate('ACCESS_REQUEST')} variant="secondary" className="w-full justify-center border-slate-300">
                              Request Private Preview
                          </Button>
                      </div>
                  </div>

              </div>
          </div>
      </section>

      {/* --- WHY SECTION --- */}
      <section className="bg-slate-900 py-24 px-6 border-t border-slate-800 text-center">
          <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-white font-display mb-6">Why This Project Exists</h2>
              <p className="text-lg text-slate-400 leading-relaxed">
                  Tokenization is often presented as simple, but the real complexity lies in the process.
                  <br/>
                  Without understanding structure and regulation, technology alone is not enough.
                  <br/><br/>
                  <strong className="text-white">PropertyDEX was created to make that process visible and understandable.</strong>
              </p>
          </div>
      </section>

      <Footer />
    </div>
  );
};
