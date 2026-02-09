
'use client';
import React from 'react';
import { AppView, ChecklistType } from '../types.ts';

interface HomeProps {
  onNavigate: (view: AppView) => void;
  onStartEntry: (type: ChecklistType) => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate, onStartEntry }) => {
  return (
    <div className="space-y-10">
      <section>
        <h2 className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-4">Immediate Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => onStartEntry(ChecklistType.OPENING)}
            className="group relative bg-slate-900 border border-slate-800 hover:border-amber-600 p-8 rounded-2xl transition-all text-left flex items-center space-x-6 h-36 amber-glow"
          >
            <div className="bg-slate-800 group-hover:bg-amber-600 transition-colors rounded-xl p-4 flex-shrink-0">
              <SunIcon className="w-8 h-8 text-amber-500 group-hover:text-slate-950" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-black text-slate-100 group-hover:text-amber-500 tracking-tight">OPENING</h3>
              <p className="text-slate-500 text-sm font-medium">Morning Prep & Setup</p>
            </div>
          </button>

          <button
            onClick={() => onStartEntry(ChecklistType.CLOSING)}
            className="group relative bg-slate-900 border border-slate-800 hover:border-amber-600 p-8 rounded-2xl transition-all text-left flex items-center space-x-6 h-36 amber-glow"
          >
            <div className="bg-slate-800 group-hover:bg-amber-600 transition-colors rounded-xl p-4 flex-shrink-0">
              <MoonIcon className="w-8 h-8 text-amber-500 group-hover:text-slate-950" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-black text-slate-100 group-hover:text-amber-500 tracking-tight">CLOSING</h3>
              <p className="text-slate-500 text-sm font-medium">EOD Cleaning & Lockup</p>
            </div>
          </button>
        </div>
      </section>

      <section>
        <h2 className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-4">Maintenance & Review</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => onStartEntry(ChecklistType.MANAGERIAL)}
            className="group bg-slate-900 border border-slate-800 hover:border-slate-600 p-6 rounded-2xl transition-all text-left flex items-center space-x-4"
          >
            <div className="bg-slate-800 group-hover:bg-slate-700 transition-colors rounded-xl p-3 flex-shrink-0">
              <ShieldIcon className="w-6 h-6 text-slate-500" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-slate-100 text-sm uppercase">Managerial Log</h4>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Compliance Audit</p>
            </div>
          </button>

          <button
            onClick={() => onNavigate('log')}
            className="group bg-slate-800/50 border border-slate-700 hover:bg-slate-800 p-6 rounded-2xl transition-all text-left flex items-center space-x-4"
          >
            <div className="bg-slate-700 rounded-xl p-3 flex-shrink-0">
              <BookIcon className="w-6 h-6 text-slate-300" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-slate-100 text-sm uppercase">View Archives</h4>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">History & Audit Trail</p>
            </div>
            <ChevronRightIcon className="w-5 h-5 text-slate-600 group-hover:text-amber-500 flex-shrink-0" />
          </button>
        </div>
      </section>
    </div>
  );
};

const SunIcon = ({ className }: { className?: string }) => (
  <svg width="32" height="32" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" /></svg>
);
const MoonIcon = ({ className }: { className?: string }) => (
  <svg width="32" height="32" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
);
const ShieldIcon = ({ className }: { className?: string }) => (
  <svg width="24" height="24" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
);
const BookIcon = ({ className }: { className?: string }) => (
  <svg width="24" height="24" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
);
const ChevronRightIcon = ({ className }: { className?: string }) => (
  <svg width="20" height="20" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
);

export default Home;
