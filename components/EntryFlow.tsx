
'use client';
import React, { useState, useEffect } from 'react';
import { ChecklistType, Entry, EntryItem } from '../types';
import { apiService } from '../services/apiService';

interface EntryFlowProps {
  initialType?: ChecklistType | null;
  entryId?: string;
  onBack: () => void;
  onComplete: () => void;
}

const EntryFlow: React.FC<EntryFlowProps> = ({ initialType, entryId: initialEntryId, onBack, onComplete }) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [entry, setEntry] = useState<Entry | null>(null);

  useEffect(() => {
    let isMounted = true;

    const initialize = async () => {
      try {
        setLoading(true);
        if (initialEntryId) {
          const data = await apiService.getEntryDetail(initialEntryId);
          if (isMounted) setEntry(data);
        } else if (initialType) {
          const newEntry = await apiService.createEntry(initialType, 'Staff');
          if (isMounted) setEntry(newEntry);
        }
      } catch (error) {
        console.error("Failed to initialize EntryFlow:", error);
        if (isMounted) {
          alert('Could not load checklist. Returning to dashboard.');
          onBack();
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    initialize();
    return () => { isMounted = false; };
  }, [initialEntryId, initialType, onBack]);

  const toggleItem = async (item: EntryItem) => {
    if (!entry || entry.completed_at) return;
    const newChecked = !item.checked;
    
    // Optimistic Update
    setEntry(prev => {
      if (!prev) return null;
      return {
        ...prev,
        items: prev.items?.map(i => i.id === item.id ? { ...i, checked: newChecked } : i)
      };
    });

    try {
      await apiService.updateEntryItem(entry.id, item.id, { checked: newChecked });
    } catch (error) {
      console.error("Failed to sync toggle:", error);
      // Revert on failure
      setEntry(prev => {
        if (!prev) return null;
        return {
          ...prev,
          items: prev.items?.map(i => i.id === item.id ? { ...i, checked: !newChecked } : i)
        };
      });
    }
  };

  const updateItemNotes = (item: EntryItem, notes: string) => {
    if (!entry || entry.completed_at) return;
    setEntry(prev => {
      if (!prev) return null;
      return {
        ...prev,
        items: prev.items?.map(i => i.id === item.id ? { ...i, item_notes: notes } : i)
      };
    });
  };

  const persistItemNotes = async (item: EntryItem) => {
    if (!entry || entry.completed_at) return;
    try {
      await apiService.updateEntryItem(entry.id, item.id, { item_notes: item.item_notes });
    } catch (error) {
      console.error("Failed to sync notes:", error);
    }
  };

  const handleSubmit = async () => {
    if (!entry) return;
    try {
      setSaving(true);
      await apiService.submitEntry(entry.id, entry.entry_notes || '');
      onComplete();
    } catch (error) {
      alert('Failed to submit. Please check your connection.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-6">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-amber-500/10 border-t-amber-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center text-xl">🥃</div>
        </div>
        <div className="text-center">
          <p className="text-amber-500 font-black text-[10px] uppercase tracking-[0.3em] animate-pulse">Initializing Protocol</p>
          <p className="text-slate-600 text-[10px] mt-1 font-bold italic uppercase tracking-widest">Loading Items...</p>
        </div>
      </div>
    );
  }

  if (!entry) return null;

  const isCompleted = !!entry.completed_at;

  return (
    <div className="space-y-6 pb-20 max-w-2xl mx-auto">
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-2xl relative overflow-hidden amber-glow">
        <div className="flex justify-between items-start relative z-10">
          <div>
            <span className="text-amber-500 text-[10px] font-black uppercase tracking-widest mb-1 block">Procedure Control</span>
            <h2 className="text-3xl font-black capitalize text-slate-100 tracking-tight">{entry.type} Checklist</h2>
          </div>
          {isCompleted ? (
            <div className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-inner">Archived Entry</div>
          ) : (
            <div className="bg-amber-500/10 text-amber-500 border border-amber-500/20 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter animate-pulse shadow-inner">Active Session</div>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-6 pt-6 mt-6 border-t border-slate-800/50">
          <div>
            <label className="text-[10px] font-black uppercase text-slate-500 block mb-1.5 tracking-widest">Operator</label>
            <input 
              type="text"
              readOnly={isCompleted}
              value={entry.created_by_name || ''}
              onChange={(e) => setEntry(prev => prev ? ({...prev, created_by_name: e.target.value}) : null)}
              className="bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-2 text-sm w-full text-slate-100 font-bold focus:ring-1 focus:ring-amber-500 transition-all"
              placeholder="Enter name..."
            />
          </div>
          <div className="text-right">
            <label className="text-[10px] font-black uppercase text-slate-500 block mb-1.5 tracking-widest">Shift Start</label>
            <p className="text-slate-400 text-sm font-mono uppercase font-bold">
              {new Date(entry.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
        <div className="bg-slate-950/30 px-6 py-3 border-b border-slate-800 flex justify-between items-center">
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Verification Steps</span>
          <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">
            {entry.items?.filter(i => i.checked).length} / {entry.items?.length} Complete
          </span>
        </div>
        <ul className="divide-y divide-slate-800/30">
          {entry.items?.sort((a,b) => a.order_index - b.order_index).map((item) => (
            <li key={item.id} className={`p-5 transition-all ${item.checked ? 'bg-slate-950/60' : 'bg-slate-900 hover:bg-slate-800/20'}`}>
              <div className="flex items-start space-x-5">
                <button
                  disabled={isCompleted}
                  onClick={() => toggleItem(item)}
                  className={`mt-1 w-9 h-9 rounded-2xl flex-shrink-0 flex items-center justify-center border-2 transition-all ${
                    item.checked ? 'bg-amber-600 border-amber-600 text-slate-950 shadow-lg' : 'border-slate-700 bg-slate-800 hover:border-amber-500/50'
                  }`}
                >
                  {item.checked && <CheckIcon className="w-6 h-6" />}
                </button>
                <div className="flex-1">
                  <span className={`text-slate-100 font-bold block mb-1.5 leading-tight text-[15px] transition-all ${item.checked ? 'opacity-20 line-through' : ''}`}>
                    {item.item_text_snapshot}
                  </span>
                  {!isCompleted && (
                    <input
                      type="text"
                      placeholder="Add specific observations..."
                      value={item.item_notes || ''}
                      onChange={(e) => updateItemNotes(item, e.target.value)}
                      onBlur={() => persistItemNotes(item)}
                      className="w-full text-[10px] font-bold uppercase tracking-widest bg-transparent border-none p-0 text-slate-600 focus:text-amber-500 focus:outline-none placeholder-slate-700 transition-colors"
                    />
                  )}
                  {isCompleted && item.item_notes && (
                    <p className="text-xs text-amber-500/70 mt-1 italic leading-relaxed bg-amber-500/5 p-2 rounded-lg border border-amber-500/10">Note: {item.item_notes}</p>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {!isCompleted && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
            <label className="text-[10px] font-black uppercase text-slate-500 block mb-3 tracking-widest">Shift Summary & Incident Reporting</label>
            <textarea
              className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl p-5 text-sm text-slate-200 focus:ring-1 focus:ring-amber-500 min-h-[140px] placeholder-slate-700 transition-all"
              placeholder="Report any damages, inventory requirements, or safety incidents encountered during the procedure..."
              value={entry.entry_notes || ''}
              onChange={(e) => setEntry(prev => prev ? ({ ...prev, entry_notes: e.target.value }) : null)}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4 sticky bottom-6">
            <button 
              onClick={onBack}
              className="px-6 py-5 bg-slate-900 border border-slate-800 text-slate-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 hover:text-slate-200 transition-all shadow-xl"
            >
              Exit Portal
            </button>
            <button 
              onClick={handleSubmit}
              disabled={saving}
              className="px-6 py-5 whiskey-gradient text-slate-50 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:brightness-110 transition-all shadow-xl active:scale-[0.98] disabled:opacity-50"
            >
              {saving ? 'Sealing Records...' : 'Seal Checklist Log'}
            </button>
          </div>
        </div>
      )}

      {isCompleted && (
        <button 
          onClick={onBack}
          className="w-full bg-slate-900 border border-slate-800 text-amber-500 font-black py-5 rounded-2xl hover:bg-slate-800 transition-all uppercase text-[10px] tracking-[0.2em] shadow-xl"
        >
          Return to Archives
        </button>
      )}
    </div>
  );
};

const CheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
);

export default EntryFlow;
