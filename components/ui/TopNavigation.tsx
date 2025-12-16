
import React, { useState } from 'react';
import { Button } from './Button';

interface TopNavigationProps {
  onNavigate: (page: string) => void;
  onLogin: () => void;
  onStartSimulation: () => void;
  activePage?: string;
}

export const TopNavigation: React.FC<TopNavigationProps> = ({ onNavigate, onLogin, onStartSimulation, activePage }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const navLinks = [
    { id: 'MARKETPLACE', label: 'Marketplace' },
    { id: 'TRADING', label: 'Trading' },
    { id: 'SOLUTIONS', label: 'Solutions' },
    { id: 'EDUCATION', label: 'Education' },
    { id: 'PRICING', label: 'Pricing' },
  ];

  return (
    <>
      <nav className="h-20 md:h-24 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-4 md:px-8 sticky top-0 z-50 transition-all">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('HOME')}>
          <img 
            src="https://i.ibb.co/5g7gFLQz/Logo-PRDX.jpg" 
            alt="PropertyDEX Logo" 
            className="h-9 w-9 md:h-10 md:w-10 rounded-lg object-contain shadow-sm"
          />
          <span className="text-xl md:text-2xl font-bold font-display text-slate-900 tracking-tight">PropertyDEX</span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          {navLinks.map((link) => (
            <button 
              key={link.id}
              onClick={() => onNavigate(link.id)} 
              className={`transition-colors hover:text-prdx-blue ${activePage === link.id ? 'text-prdx-blue font-bold' : ''}`}
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          <button 
            onClick={onLogin}
            className="text-slate-600 font-bold text-sm hover:text-prdx-blue px-4 py-2 hover:bg-slate-50 rounded-xl transition-colors"
          >
            Log in
          </button>
          <Button onClick={onStartSimulation} className="bg-slate-900 hover:bg-slate-800 text-white text-sm px-6 py-2.5 shadow-lg shadow-slate-900/20 rounded-xl">
            Launch App
          </Button>
        </div>

        {/* Mobile Hamburger */}
        <button 
            onClick={toggleMenu}
            className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
        >
            {isMobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            ) : (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            )}
        </button>
      </nav>

      {/* Mobile Sidebar / Drawer */}
      <div className={`fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-sm transition-opacity duration-300 md:hidden ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={toggleMenu}></div>
      <div className={`fixed inset-y-0 right-0 z-50 w-[80%] max-w-xs bg-white shadow-2xl transform transition-transform duration-300 ease-out md:hidden ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="h-full flex flex-col p-6 pt-24 space-y-6">
              <div className="space-y-4">
                  {navLinks.map((link) => (
                    <button 
                      key={link.id}
                      onClick={() => { onNavigate(link.id); toggleMenu(); }} 
                      className={`block w-full text-left text-lg font-bold py-3 border-b border-slate-50 ${activePage === link.id ? 'text-prdx-blue' : 'text-slate-800 hover:text-prdx-blue'}`}
                    >
                      {link.label}
                    </button>
                  ))}
              </div>
              
              <div className="mt-auto space-y-3 pt-6 border-t border-slate-100">
                  <Button onClick={() => { onStartSimulation(); toggleMenu(); }} className="w-full py-4 text-lg bg-prdx-blue hover:bg-prdx-blue/90 text-white shadow-xl">
                      Start Building
                  </Button>
                  <Button onClick={() => { onLogin(); toggleMenu(); }} variant="outline" className="w-full py-4 text-lg border-slate-200 text-slate-600">
                      Sign In
                  </Button>
              </div>
          </div>
      </div>
    </>
  );
};
