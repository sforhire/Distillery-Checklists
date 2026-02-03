
'use client';
import React, { useState, useEffect } from 'react';
import { ChecklistType, Template, TemplateItem } from '../types';
import { apiService } from '../services/apiService';

interface TemplateEditorProps {
  onBack: () => void;
}

const TemplateEditor: React.FC<TemplateEditorProps> = ({ onBack }) => {
  const [selectedType, setSelectedType] = useState<ChecklistType>(ChecklistType.OPENING);
  const [template, setTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(true);
  const [newItemText, setNewItemText] = useState('');

  useEffect(() => {
    loadTemplate();
  }, [selectedType]);

  const loadTemplate = async () => {
    try {
      setLoading(true);
      const data = await apiService.getTemplate(selectedType);
      setTemplate(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const addItem = async () => {
    if (!newItemText || !template) return;
    try {
      const nextIdx = template.items.length;
      const newItem = await apiService.addTemplateItem(template.id, newItemText, nextIdx);
      setTemplate(prev => prev ? ({ ...prev, items: [...prev.items, newItem] }) : null);
      setNewItemText('');
    } catch (error) {
      alert('Failed to add item.');
    }
  };

  const deleteItem = async (id: string) => {
    if (!confirm('Warning: Deleting a template item only affects future logs. Continue?')) return;
    try {
      await apiService.deleteTemplateItem(id);
      setTemplate(prev => prev ? ({
        ...prev,
        items: prev.items.filter(i => i.id !== id)
      }) : null);
    } catch (error) {
      alert('Failed to delete.');
    }
  };

  const moveItem = async (index: number, direction: 'up' | 'down') => {
    if (!template) return;
    const newItems = [...template.items];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newItems.length) return;

    [newItems[index], newItems[targetIdx]] = [newItems[targetIdx], newItems[index]];
    const updatedOrder = newItems.map((item, idx) => ({ id: item.id, order_index: idx }));
    
    try {
      const remappedItems = newItems.map((item, idx) => ({ ...item, order_index: idx }));
      setTemplate({ ...template, items: remappedItems });
      await apiService.updateTemplateItemsOrder(updatedOrder);
    } catch (error) {
      alert('Failed to reorder.');
      loadTemplate();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-black text-slate-100">Master Templates</h2>
          <p className="text-slate-500 text-xs mt-1">Configure required procedures</p>
        </div>
        <button onClick={onBack} className="text-[10px] font-black text-amber-500 hover:text-amber-400 uppercase tracking-widest border-b border-amber-500/30">Exit Editor</button>
      </div>

      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Protocol Category</label>
        <div className="flex space-x-2">
          {Object.values(ChecklistType).map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-tighter transition-all ${
                selectedType === type ? 'bg-amber-600 text-slate-950' : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-4 bg-slate-950/50 border-b border-slate-800">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newItemText}
              onChange={(e) => setNewItemText(e.target.value)}
              placeholder="Define new requirement..."
              className="flex-1 bg-slate-800 border-none rounded-xl px-4 text-sm text-slate-200 focus:ring-1 focus:ring-amber-500"
              onKeyPress={(e) => e.key === 'Enter' && addItem()}
            />
            <button
              onClick={addItem}
              className="bg-amber-600 text-slate-950 px-6 py-2 rounded-xl font-black text-xs uppercase hover:bg-amber-500 transition-all"
            >
              Add
            </button>
          </div>
        </div>

        {loading ? (
          <div className="p-20 text-center text-slate-600 uppercase text-[10px] font-black tracking-widest">Loading Items...</div>
        ) : (
          <ul className="divide-y divide-slate-800">
            {template?.items.sort((a, b) => a.order_index - b.order_index).map((item, idx) => (
              <li key={item.id} className="p-4 flex items-center justify-between group bg-slate-900 hover:bg-slate-800/50">
                <div className="flex items-center space-x-4">
                  <div className="flex flex-col">
                    <button onClick={() => moveItem(idx, 'up')} className="text-slate-600 hover:text-amber-500 disabled:opacity-0" disabled={idx === 0}>
                      <ChevronUpIcon className="w-4 h-4" />
                    </button>
                    <button onClick={() => moveItem(idx, 'down')} className="text-slate-600 hover:text-amber-500 disabled:opacity-0" disabled={idx === template.items.length - 1}>
                      <ChevronDownIcon className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="font-bold text-slate-200 text-sm">{item.text}</span>
                </div>
                <button
                  onClick={() => deleteItem(item.id)}
                  className="text-slate-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 p-2"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </li>
            ))}
            {template?.items.length === 0 && (
              <li className="p-12 text-center text-slate-700 italic text-sm">Empty template. Add requirements above.</li>
            )}
          </ul>
        )}
      </div>

      <div className="bg-amber-900/10 border border-amber-900/20 p-4 rounded-xl text-[10px] text-amber-500 uppercase font-black tracking-widest flex items-start">
        <InfoIcon className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
        <p>Operational Snapshots: Modifications here only impact future log generation.</p>
      </div>
    </div>
  );
};

const TrashIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
);
const ChevronUpIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
);
const ChevronDownIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
);
const InfoIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
);

export default TemplateEditor;
