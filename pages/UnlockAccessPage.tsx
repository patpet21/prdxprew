
import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { AccessControl } from '../services/accessControl';

interface Props {
  onUnlock: () => void;
  onNavigate: (page: string) => void;
}

export const UnlockAccessPage: React.FC<Props> = ({ onUnlock, onNavigate }) => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Simulate network delay for realism
    setTimeout(() => {
        const isValid = AccessControl.validateCode(email, code);

        if (isValid) {
            AccessControl.unlock('PRO'); // Default to Pro for this flow
            onUnlock(); // Trigger parent refresh/redirect
        } else {
            setError("Invalid Email or Access Code.");
            setLoading(false);
        }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
        
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-amber-900/20 via-slate-950 to-slate-950 pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
            
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6 border border-slate-700">
                    🔑
                </div>
                <h1 className="text-2xl font-bold text-white font-display mb-2">Unlock Access</h1>
                <p className="text-slate-400 text-sm">
                    Enter your personal code to activate the Professional Suite.
                </p>
            </div>

            {error && (
                <div className="mb-6 p-3 bg-red-900/20 border border-red-500/30 rounded-lg text-center">
                    <p className="text-red-400 text-sm font-bold">{error}</p>
                </div>
            )}

            <form onSubmit={handleUnlock} className="space-y-4">
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Registered Email</label>
                    <input 
                        type="email" 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="test@gmail.com"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-amber-500 outline-none transition-colors"
                    />
                </div>
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Access Code</label>
                    <input 
                        type="text" 
                        required
                        value={code}
                        onChange={(e) => setCode(e.target.value.toUpperCase())}
                        placeholder="PRDX..."
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white font-mono text-center tracking-widest focus:border-amber-500 outline-none transition-colors uppercase"
                    />
                </div>
                
                <Button 
                    type="submit" 
                    isLoading={loading}
                    className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-900 font-bold text-sm rounded-xl shadow-lg mt-4"
                >
                    Verify & Unlock
                </Button>
            </form>

            <div className="mt-6 text-center">
                <button 
                    onClick={() => onNavigate('ACCESS_REQUEST')}
                    className="text-slate-500 hover:text-slate-300 text-xs font-bold"
                >
                    Don't have a code? Request one here.
                </button>
            </div>

        </div>
      </div>
    </div>
  );
};
