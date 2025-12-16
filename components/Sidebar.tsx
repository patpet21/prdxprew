
import React from 'react';
import { DashboardTab } from '../types';

interface SidebarProps {
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
  onLogout: () => void;
  isOpen: boolean;
  onClose: () => void;
  onGoHome: () => void;
  onGoToTrading: () => void;
  onNavigateToSimulator?: () => void;
  onNavigateToAcademy?: () => void;
  variant?: 'default' | 'pro'; 
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  onTabChange, 
  onLogout, 
  isOpen, 
  onClose, 
  onGoHome, 
  onNavigateToSimulator,
  onNavigateToAcademy,
  variant = 'default' 
}) => {
  const isPro = variant === 'pro';

  const menuItems: { id: DashboardTab; label: string; icon: string }[] = [
    { id: 'OVERVIEW', label: 'Command Center', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
    { id: 'ASSETS', label: 'Portfolio Assets', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
    { id: 'TRADING', label: 'Secondary Market', icon: 'M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z' },
    { id: 'WALLET', label: 'Web3 Wallet', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
    { id: 'STAKING', label: 'Yield & Staking', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { id: 'DOCS', label: 'Data Room', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { id: 'TASKS', label: 'Tasks', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
    { id: 'SETTINGS', label: 'Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
  ];

  // Colors based on variant
  const bgClass = isPro ? 'bg-slate-950 border-slate-800' : 'bg-slate-900 border-slate-800';
  const textClass = isPro ? 'text-slate-400' : 'text-slate-300';
  
  // New "Bento-style" active class
  const activeItemClass = isPro 
    ? 'bg-gradient-to-r from-amber-600/20 to-amber-900/10 text-amber-400 border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.1)]' 
    : 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-500/30 border border-indigo-400/50';
    
  const hoverItemClass = isPro 
    ? 'hover:bg-white/5 hover:text-white hover:border-slate-700' 
    : 'hover:bg-slate-800 hover:text-white hover:border-slate-700';

  return (
    <>
      {/* Mobile Backdrop */}
      <div 
        className={`fixed inset-0 bg-slate-950/80 backdrop-blur-md z-40 transition-opacity duration-300 lg:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Sidebar Container */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-72 ${bgClass} ${textClass} flex flex-col border-r transition-transform duration-300 cubic-bezier(0.4, 0, 0.2, 1) lg:translate-x-0 shadow-2xl ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-24 flex items-center px-6 border-b border-white/5 shrink-0 bg-slate-950/50 backdrop-blur-sm">
          <div className="flex items-center gap-3">
             <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg ${isPro ? 'bg-gradient-to-br from-amber-400 to-orange-600' : 'bg-gradient-to-br from-indigo-500 to-blue-600'}`}>
                P
             </div>
             <div className="flex flex-col">
                <span className="text-white font-display font-bold text-lg tracking-tight leading-none">PropertyDEX</span>
                <span className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${isPro ? 'text-amber-500' : 'text-indigo-400'}`}>
                    {isPro ? 'Enterprise OS' : 'Core Platform'}
                </span>
             </div>
          </div>
          {/* Close button for mobile */}
          <button onClick={onClose} className="ml-auto lg:hidden text-slate-500 hover:text-white p-1">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* --- Primary Actions --- */}
        <div className="px-4 pt-6 pb-2 space-y-3">
            <p className="px-2 text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-1">Launchpad</p>
            
            <button
                onClick={() => { if(onNavigateToSimulator) onNavigateToSimulator(); onClose(); }}
                className="w-full text-left px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white text-xs font-bold shadow-lg shadow-indigo-900/20 transition-all border border-indigo-400/20 flex items-center gap-3 group relative overflow-hidden"
            >
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <span className="text-lg relative z-10 group-hover:scale-110 transition-transform">🏗️</span>
                <div className="relative z-10">
                    <span className="block opacity-70 text-[9px] uppercase tracking-wider">Simulator</span>
                    <span className="block text-sm">Framework</span>
                </div>
            </button>

            <button
                onClick={() => { if(onNavigateToAcademy) onNavigateToAcademy(); onClose(); }}
                className="w-full text-left px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold shadow-md transition-all border border-slate-700 flex items-center gap-3 group"
            >
                 <span className="text-lg group-hover:scale-110 transition-transform">🎓</span>
                 <div>
                    <span className="block opacity-70 text-[9px] uppercase tracking-wider">Academy</span>
                    <span className="block text-sm">Foundations</span>
                </div>
            </button>
        </div>
        
        <div className="mx-6 my-4 h-px bg-white/5"></div>

        {/* --- Navigation Tabs --- */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
          <p className="px-2 text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-2">Workspace</p>
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id);
                  onClose();
                }}
                className={`w-full flex items-center px-4 py-3.5 rounded-xl transition-all duration-200 group border border-transparent ${
                  isActive ? activeItemClass : hoverItemClass
                }`}
              >
                <svg className={`w-5 h-5 mr-3 transition-colors ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-white'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                </svg>
                <span className={`font-medium text-sm ${isActive ? 'font-bold' : ''}`}>{item.label}</span>
                {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_5px_white] animate-pulse"></div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-white/5 shrink-0 space-y-2 bg-slate-950/50 backdrop-blur-sm">
          <button onClick={onGoHome} className="w-full flex items-center justify-center px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-white hover:bg-white/5 rounded-xl transition-colors border border-transparent hover:border-white/10">
             <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
             Exit Dashboard
          </button>

          <button onClick={onLogout} className="w-full flex items-center justify-center px-4 py-3 text-xs font-bold uppercase tracking-wider text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-colors">
             Log Out
          </button>
        </div>
      </aside>
    </>
  );
};
