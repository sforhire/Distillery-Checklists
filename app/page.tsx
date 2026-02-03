
'use client';

import React, { useState } from 'react';
import { AppView, ChecklistType } from '../types';
import Home from '../components/Home';
import EntryFlow from '../components/EntryFlow';
import LogView from '../components/LogView';
import TemplateEditor from '../components/TemplateEditor';

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);
  const [newEntryType, setNewEntryType] = useState<ChecklistType | null>(null);

  const handleNavigate = (view: AppView, id?: string) => {
    if (id) {
      setSelectedEntryId(id);
      setNewEntryType(null);
    } else {
      setSelectedEntryId(null);
      setNewEntryType(null);
    }
    setCurrentView(view);
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
  };

  const handleStartNewEntry = (type: ChecklistType) => {
    setNewEntryType(type);
    setSelectedEntryId(null);
    setCurrentView('new-entry');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pb-24 min-h-screen">
      <header className="mb-10 flex justify-between items-center border-b border-slate-800 pb-6">
        <div>
          <h1 
            className="text-3xl font-black tracking-tighter text-amber-500 cursor-pointer flex items-center"
            onClick={() => handleNavigate('home')}
          >
            <span className="mr-2">🥃</span>
            DISTILLERY CHECKLISTS
          </h1>
          <p className="text-slate-500 text-[10px] uppercase tracking-widest font-black mt-1">Quality & Safety Controls</p>
        </div>
        <button 
          onClick={() => handleNavigate('template-editor')}
          className="bg-slate-900 border border-slate-700 text-slate-400 hover:text-amber-500 hover:border-amber-500 px-4 py-2 rounded-lg text-xs font-bold transition-all"
        >
          TEMPLATES
        </button>
      </header>

      <main>
        {currentView === 'home' && (
          <Home onNavigate={handleNavigate} onStartEntry={handleStartNewEntry} />
        )}
        {currentView === 'new-entry' && (
          <EntryFlow 
            initialType={newEntryType}
            onBack={() => handleNavigate('home')} 
            onComplete={() => handleNavigate('log')}
          />
        )}
        {currentView === 'log' && (
          <LogView 
            onViewDetail={(id) => handleNavigate('entry-detail', id)}
            onBack={() => handleNavigate('home')}
          />
        )}
        {currentView === 'entry-detail' && selectedEntryId && (
          <EntryFlow 
            entryId={selectedEntryId}
            onBack={() => handleNavigate('log')}
            onComplete={() => handleNavigate('log')}
          />
        )}
        {currentView === 'template-editor' && (
          <TemplateEditor 
            onBack={() => handleNavigate('home')} 
          />
        )}
      </main>

      {currentView !== 'home' && (
        <nav className="fixed bottom-0 left-0 right-0 bg-slate-950 border-t border-slate-800 p-4 flex justify-around items-center shadow-2xl md:hidden z-50">
          <button 
            onClick={() => handleNavigate('home')}
            className="flex flex-col items-center transition-colors text-slate-500 hover:text-amber-500"
          >
            <HomeIcon className="w-6 h-6" />
            <span className="text-[10px] uppercase font-bold mt-1">Home</span>
          </button>
          <button 
            onClick={() => handleNavigate('log')}
            className={`flex flex-col items-center transition-colors ${currentView === 'log' ? 'text-amber-500' : 'text-slate-500'}`}
          >
            <ListIcon className="w-6 h-6" />
            <span className="text-[10px] uppercase font-bold mt-1">Logs</span>
          </button>
        </nav>
      )}
    </div>
  );
}

const HomeIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
);
const ListIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
);
