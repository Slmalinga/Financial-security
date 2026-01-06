import React, { useState } from 'react';
import { useStore } from '../store';
import { CategoryType } from '../types';
import { Check, Wallet } from 'lucide-react';

export const AddTransaction: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const { addTransaction, customCategories } = useStore();
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<CategoryType>('Need');
  const [category, setCategory] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount) return;

    addTransaction({
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      amount: parseFloat(amount),
      description,
      category: category || 'General',
      type
    });

    setDescription('');
    setAmount('');
    setCategory('');
    if (onComplete) onComplete();
  };

  const categories = type !== 'Income' ? customCategories[type as 'Need' | 'Want' | 'Saving'] : [];

  return (
    <div className="bg-[#1E1E1E] border border-white/10 p-8 md:p-10 rounded-xl max-w-xl mx-auto w-full shadow-2xl backdrop-blur-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#4AA3A3]/5 blur-[60px]"></div>
      
      <div className="flex items-center gap-5 mb-10">
        <div className="p-4 bg-[#1E2B58] text-white rounded-xl shadow-lg">
          <Wallet className="w-7 h-7" />
        </div>
        <div>
          <h2 className="font-display text-2xl font-bold text-white tracking-tight">Manual Entry</h2>
          <p className="text-[#C59D5F] font-bold text-[9px] uppercase tracking-[0.4em]">Accounting Module</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-3">
          <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 ml-1">Strategy Bucket</label>
          <div className="grid grid-cols-3 gap-2">
            {(['Need', 'Want', 'Saving'] as CategoryType[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => { setType(t); setCategory(''); }}
                className={`py-3.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all duration-300 border ${
                  type === t 
                  ? t === 'Need' ? 'border-[#1E2B58] bg-[#1E2B58] text-white shadow-md' 
                  : t === 'Want' ? 'border-[#C59D5F] bg-[#C59D5F] text-white shadow-md' 
                  : 'border-[#4AA3A3] bg-[#4AA3A3] text-white shadow-md'
                  : 'border-white/5 bg-white/5 text-slate-500 hover:border-white/10'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 ml-1">Classification Tag</label>
          <div className="flex flex-wrap gap-2 max-h-[120px] overflow-y-auto custom-scrollbar pr-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-xl text-[10px] font-bold border transition-all ${
                  category === cat 
                  ? 'bg-[#4AA3A3] border-[#4AA3A3] text-white shadow-md'
                  : 'bg-white/5 border-white/5 text-slate-400 hover:border-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Assign category..."
            className="w-full bg-black/20 border border-white/5 px-5 py-3 rounded-xl text-sm outline-none focus:border-[#4AA3A3] text-slate-300"
          />
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 ml-1">Memo</label>
          <input
            autoFocus
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Transaction description..."
            className="w-full bg-black/30 border border-white/10 p-5 rounded-xl focus:border-[#4AA3A3] outline-none transition-all text-lg font-bold placeholder:text-slate-800 text-white"
            required
          />
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 ml-1">Value ($)</label>
          <input
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full bg-black/40 border border-white/10 p-6 rounded-xl focus:border-[#4AA3A3] outline-none transition-all text-4xl font-bold text-[#4AA3A3] placeholder:text-slate-900 font-mono"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#4AA3A3] hover:bg-[#3D8A8A] hover:scale-[1.01] active:scale-[0.98] text-white font-bold py-6 rounded-xl transition-all shadow-xl shadow-[#4AA3A3]/20 flex items-center justify-center gap-3 text-sm tracking-[0.2em] uppercase"
        >
          <Check className="w-5 h-5" /> ARCHIVE TRANSACTION
        </button>
      </form>
    </div>
  );
};