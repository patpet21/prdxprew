
import React, { useState } from 'react';
import { Button } from '../components/ui/Button';

interface Props {
  onNavigate: (page: string) => void;
  onBack: () => void;
}

export const AccessRequestPage: React.FC<Props> = ({ onNavigate, onBack }) => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setIsSubmitted(true);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-md">
        
        {/* Back Button */}
        <button 
            onClick={onBack}
            className="absolute -top-16 left-0 text-slate-500 hover:text-white text-sm font-bold flex items-center gap-2 transition-colors"
        >
            ← Back
        </button>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
            
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-600 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6 shadow-lg shadow-amber-500/20">
                    🔒
                </div>
                <h1 className="text-2xl font-bold text-white font-display mb-2">Controlled Access</h1>
                <p className="text-slate-400 text-sm leading-relaxed">
                    The Pro and Enterprise simulators are currently in a private beta. Access is granted via personal invitation codes only.
                </p>
            </div>

            {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Join the Waitlist</label>
                        <input 
                            type="email" 
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="work@company.com"
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-amber-500 outline-none transition-colors"
                        />
                    </div>
                    
                    <Button 
                        type="submit" 
                        isLoading={loading}
                        className="w-full py-4 bg-white text-slate-900 hover:bg-slate-100 font-bold text-sm rounded-xl shadow-lg"
                    >
                        Request Access Code
                    </Button>
                </form>
            ) : (
                <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-xl p-6 text-center animate-fadeIn">
                    <div className="text-emerald-400 text-3xl mb-3">✓</div>
                    <h3 className="text-white font-bold mb-2">Request Received</h3>
                    <p className="text-emerald-200/80 text-sm">
                        You have been added to the priority list. We will email you a personal access code as soon as a slot opens.
                    </p>
                </div>
            )}

            <div className="mt-8 pt-6 border-t border-slate-800 text-center">
                <p className="text-slate-500 text-xs mb-3">Already have an invite code?</p>
                <button 
                    onClick={() => onNavigate('UNLOCK_ACCESS')}
                    className="text-amber-500 hover:text-amber-400 text-sm font-bold uppercase tracking-wider underline decoration-amber-500/30 hover:decoration-amber-400 transition-all"
                >
                    Enter Code Here
                </button>
            </div>

        </div>
      </div>
    </div>
  );
};
