
import React, { useState } from 'react';

interface PinGateProps {
  onSuccess: (pin: string) => void;
}

const PinGate: React.FC<PinGateProps> = ({ onSuccess }) => {
  const [pin, setPin] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length > 0) {
      onSuccess(pin);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-20 px-6">
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl max-w-sm w-full amber-glow">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🔒</div>
          <h2 className="text-2xl font-black text-slate-100 tracking-tight">ACCESS RESTRICTED</h2>
          <p className="text-slate-500 text-xs font-black uppercase tracking-widest mt-2">Enter Distillery Access Pin</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="password"
            autoFocus
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-center text-3xl font-black text-amber-500 tracking-[0.5em] focus:border-amber-500 transition-all"
            placeholder="****"
          />
          <button
            type="submit"
            className="w-full whiskey-gradient text-slate-50 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:brightness-110 shadow-xl transition-all"
          >
            Authenticate
          </button>
        </form>
        
        <p className="text-[10px] text-slate-600 text-center mt-6 font-bold italic uppercase">
          Pin is required for secure logging.
        </p>
      </div>
    </div>
  );
};

export default PinGate;
