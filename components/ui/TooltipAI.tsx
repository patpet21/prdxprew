
import React, { useState } from 'react';

// Hardcoded fallback for immediate UI rendering, simulates AI response
const TOOLTIP_DB: Record<string, string> = {
    'Escrow': 'A neutral 3rd party holding funds until deal terms are met.',
    'Custodial': 'A service (like a bank) holds your keys and assets for you.',
    'Non-Custodial': 'You hold your own keys. You are your own bank.',
    'RWA': 'Real World Asset. Physical items (homes, gold) brought on-chain.',
    'KYC': 'ID Check. Verifying who you are (Passport/Selfie).',
    'AML': 'Checks to ensure money isn\'t from illegal sources.',
    'Transfer Agent': 'Official record keeper of who owns the securities.',
    'ATS': 'A regulated marketplace for trading security tokens.',
    'Lock-up': 'Period where you cannot sell your tokens.',
    'Whitelisting': 'Approving a wallet address to hold/trade the token.',
    'Reg D': 'US rule: Raise unlimited funds from rich (accredited) investors.',
    'Reg D 506(c)': 'Permits general solicitation (public ads) but requires verifying that all investors are Accredited.',
    'Reg S': 'US rule: Raise funds from non-US investors only.',
    'MiCA': 'EU law regulating crypto-assets and service providers.',
    'CASP': 'Crypto-Asset Service Provider license in Europe.',
    'VASP': 'Virtual Asset Service Provider license (Global term).'
};

interface Props {
  term: string;
}

export const TooltipAI: React.FC<Props> = ({ term }) => {
  const [show, setShow] = useState(false);
  const def = TOOLTIP_DB[term] || "AI Definition loading...";

  return (
    <span 
        className="relative inline-block ml-1 cursor-help group z-50"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onClick={(e) => { e.stopPropagation(); setShow(!show); }}
    >
        <span className="text-slate-400 hover:text-indigo-500 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
        </span>
        
        {/* Tooltip Popover */}
        <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 bg-slate-900 text-white text-[10px] leading-snug rounded-xl shadow-xl z-50 pointer-events-none transition-all duration-200 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
            <span className="font-bold block mb-1 text-indigo-400">{term}</span>
            {def}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900"></div>
        </div>
    </span>
  );
};
