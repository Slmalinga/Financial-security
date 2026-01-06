import React, { useState } from 'react';
import { useStore } from '../store';
import { Download, Upload, Copy, Check, ShieldCheck, AlertCircle, FileJson, Share2 } from 'lucide-react';

export const SyncModule: React.FC = () => {
  const { transactions, monthlyIncome, plannedItems, budgetAllocation, importData } = useStore();
  const [showCopySuccess, setShowCopySuccess] = useState(false);
  const [importText, setImportText] = useState('');
  const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

  const getFullData = () => {
    return JSON.stringify({
      transactions,
      monthlyIncome,
      plannedItems,
      budgetAllocation,
      exportDate: new Date().toISOString(),
      version: "2.0"
    }, null, 2);
  };

  const handleExport = () => {
    const data = getFullData();
    navigator.clipboard.writeText(data);
    setShowCopySuccess(true);
    setTimeout(() => setShowCopySuccess(false), 2000);
  };

  const handleDownload = () => {
    const data = getFullData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `finsight-full-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    if (importData(importText)) {
      setStatus({ type: 'success', msg: 'Tactical data restored successfully!' });
      setImportText('');
    } else {
      setStatus({ type: 'error', msg: 'Invalid signature detected. Restoration aborted.' });
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="bg-[#1E1E1E] border border-white/5 p-8 rounded-xl shadow-card">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-4 bg-[#4AA3A3]/10 rounded-xl text-[#4AA3A3]">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <h2 className="font-display text-xl font-bold">Encrypted Local Vault</h2>
            <p className="text-[10px] text-[#C59D5F] font-bold uppercase tracking-widest">Security Layer</p>
          </div>
        </div>
        
        <p className="text-slate-400 mb-10 leading-relaxed text-sm font-medium">
          Since FinSight prioritizes <span className="text-[#4AA3A3] font-bold">Local-First</span> intelligence, your data never leaves this environment. 
          Use this hub to manually sync or migrate your encrypted financial blueprints.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={handleExport}
            className="flex flex-col items-center justify-center gap-4 p-8 bg-[#1E2B58]/20 border border-white/5 rounded-xl hover:bg-[#1E2B58]/40 transition-all group"
          >
            <div className="p-3 bg-white/5 rounded-xl group-hover:bg-[#1E2B58] transition-all">
              {showCopySuccess ? <Check className="w-6 h-6 text-[#4AA3A3]" /> : <Copy className="w-6 h-6 text-white" />}
            </div>
            <span className="font-bold text-xs uppercase tracking-widest">{showCopySuccess ? 'Archived to Clip' : 'Copy Vault Data'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="flex flex-col items-center justify-center gap-4 p-8 bg-black/20 border border-white/5 rounded-xl hover:bg-black/40 transition-all group"
          >
            <div className="p-3 bg-white/5 rounded-xl group-hover:bg-[#C59D5F]/20 transition-all">
              <Download className="w-6 h-6 text-[#C59D5F]" />
            </div>
            <span className="font-bold text-xs uppercase tracking-widest">Download .JSON</span>
          </button>
        </div>
      </div>

      <div className="bg-[#1E1E1E] border border-white/5 p-8 rounded-xl shadow-card">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-4 bg-[#1E2B58] rounded-xl text-white">
            <Upload className="w-7 h-7" />
          </div>
          <h2 className="font-display text-xl font-bold">Vault Restoration</h2>
        </div>
        
        {status && (
          <div className={`p-5 rounded-xl mb-8 flex items-center gap-3 animate-in fade-in slide-in-from-top-2 ${
            status.type === 'success' ? 'bg-[#4AA3A3]/10 text-[#4AA3A3] border border-[#4AA3A3]/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
          }`}>
            {status.type === 'success' ? <Check className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <span className="text-xs font-bold uppercase tracking-wider">{status.msg}</span>
          </div>
        )}

        <div className="relative">
          <textarea
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            placeholder='Paste vault signature (starts with {"transactions": ...)'
            className="w-full bg-black/40 border border-white/10 p-6 rounded-xl h-44 focus:border-[#4AA3A3] outline-none text-slate-300 font-mono text-[10px] mb-4 resize-none placeholder:text-slate-800"
          />
          <div className="absolute top-4 right-4 opacity-10">
            <FileJson className="w-10 h-10" />
          </div>
        </div>

        <button
          onClick={handleImport}
          disabled={!importText}
          className="w-full bg-[#4AA3A3] hover:bg-[#3D8A8A] disabled:opacity-20 text-white font-bold py-6 rounded-xl transition-all shadow-xl shadow-[#4AA3A3]/20 flex items-center justify-center gap-3 text-sm tracking-[0.2em] uppercase"
        >
          <Upload className="w-5 h-5" />
          Restore Vault Integrity
        </button>
      </div>

      <div className="p-6 border-2 border-dashed border-white/5 rounded-xl flex items-center justify-center gap-4 text-slate-600 text-[10px] font-bold uppercase tracking-[0.2em]">
        <Share2 className="w-4 h-4" />
        <span>Vault signatures are device-agnostic</span>
      </div>
    </div>
  );
};