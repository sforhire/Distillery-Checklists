
'use client';
import React, { useState, useEffect } from 'react';
import { Entry } from '../types';
import { apiService } from '../services/apiService';

interface LogViewProps {
  onViewDetail: (id: string) => void;
  onBack: () => void;
}

const LogView: React.FC<LogViewProps> = ({ onViewDetail, onBack }) => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      setLoading(true);
      const data = await apiService.getEntries();
      setEntries(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center p-20 text-slate-600 uppercase text-[10px] font-black tracking-widest animate-pulse">Scanning Archives...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-black text-slate-100">Historical Logs</h2>
          <p className="text-slate-500 text-xs mt-1">Audit trail of distillery operations</p>
        </div>
        <button onClick={onBack} className="text-[10px] font-black text-amber-500 hover:text-amber-400 uppercase tracking-widest border-b border-amber-500/30">Dashboard</button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        {entries.length === 0 ? (
          <div className="p-20 text-center">
            <div className="text-slate-700 text-4xl mb-4">📭</div>
            <p className="text-slate-500 text-sm font-medium">No records found for this period.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-950/50 border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Entry Date</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Type</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Staff</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {entries.map((entry) => (
                  <tr 
                    key={entry.id} 
                    onClick={() => onViewDetail(entry.id)}
                    className="hover:bg-amber-600/5 cursor-pointer transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-200 text-sm">{new Date(entry.created_at).toLocaleDateString()}</div>
                      <div className="text-[10px] font-mono text-slate-500 uppercase">{new Date(entry.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="capitalize font-black text-amber-500 text-xs">{entry.type}</span>
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-sm">{entry.created_by_name || 'Anonymous'}</td>
                    <td className="px-6 py-4 text-right">
                      {entry.completed_at ? (
                        <span className="bg-emerald-500/10 text-emerald-500 text-[10px] px-2 py-1 rounded border border-emerald-500/20 font-black uppercase">Sealed</span>
                      ) : (
                        <span className="bg-amber-500/10 text-amber-500 text-[10px] px-2 py-1 rounded border border-amber-500/20 font-black uppercase italic">Open</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default LogView;
