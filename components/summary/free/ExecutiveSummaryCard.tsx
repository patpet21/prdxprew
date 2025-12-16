
import React from 'react';
import { TokenizationState } from '../../../../types';

interface Props {
  data: TokenizationState;
}

export const ExecutiveSummaryCard: React.FC<Props> = ({ data }) => {
  return (
    <div className="bg-slate-900 text-white rounded-[2rem] p-12 shadow-2xl relative overflow-hidden border border-slate-800 flex flex-col justify-center min-h-[500px] group">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none group-hover:bg-indigo-500/20 transition-colors duration-1000"></div>
        
        <div className="relative z-10">
            <div className="flex items-center gap-6 mb-8">
                <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-3xl shadow-inner border border-indigo-500/30">
                    💎
                </div>
                <div>
                    <h3 className="text-3xl font-bold font-display">Executive Summary</h3>
                    <p className="text-xs text-indigo-300 uppercase tracking-[0.2em] font-bold mt-1">AI Generated Investment Memo</p>
                </div>
            </div>

            <p className="text-lg md:text-2xl text-slate-300 leading-relaxed font-light max-w-5xl">
                <strong className="text-white font-bold">{data.projectInfo.projectName}</strong> represents fractional economic interest in a 
                <span className="text-white"> {data.property.property_type}</span> asset located in {data.property.city}. 
                The operation targets a <span className="text-emerald-400 font-bold">{data.property.annual_yield}% Yield</span> with 
                an estimated exit in <span className="text-white">Year 5</span>. 
                Structured via <span className="text-white">{data.jurisdiction.spvType}</span> in {data.jurisdiction.country}, 
                it complies with {data.compliance.regFramework} for {data.compliance.targetInvestorType} investors.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12 pt-12 border-t border-slate-800">
                <div>
                    <span className="text-xs text-slate-500 uppercase tracking-widest block mb-2 font-bold">Valuation</span>
                    <span className="text-3xl font-mono font-bold text-white">€{data.property.total_value?.toLocaleString()}</span>
                </div>
                <div>
                    <span className="text-xs text-slate-500 uppercase tracking-widest block mb-2 font-bold">Raise Target</span>
                    <span className="text-3xl font-mono font-bold text-emerald-400">€{data.property.raise_amount?.toLocaleString()}</span>
                </div>
                <div>
                    <span className="text-xs text-slate-500 uppercase tracking-widest block mb-2 font-bold">Token Price</span>
                    <span className="text-3xl font-mono font-bold text-white">€{data.property.token_price}</span>
                </div>
                 <div>
                    <span className="text-xs text-slate-500 uppercase tracking-widest block mb-2 font-bold">Strategy</span>
                    <span className="text-2xl font-mono font-bold text-white truncate">{data.projectInfo.projectGoal}</span>
                </div>
            </div>
        </div>
    </div>
  );
};
