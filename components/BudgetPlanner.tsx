import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useStore } from '../store';
import { Target, Check, Plus, Trash2, Wallet, Tag, X, PlusCircle, Sparkles } from 'lucide-react';

export const BudgetPlanner: React.FC = () => {
  const { 
    monthlyIncome, 
    setMonthlyIncome, 
    budgetAllocation, 
    setBudgetAllocation, 
    plannedItems, 
    addPlannedItem, 
    removePlannedItem,
    customCategories,
    addCategory,
    removeCategory
  } = useStore();
  
  const [localAllocation, setLocalAllocation] = useState(budgetAllocation);
  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemAmount, setNewItemAmount] = useState('');
  const [newItemType, setNewItemType] = useState<'Need' | 'Want' | 'Saving' | null>(null);
  
  const [newCatName, setNewCatName] = useState('');
  const [addingCatType, setAddingCatType] = useState<'Need' | 'Want' | 'Saving' | null>(null);
  const addCatInputRef = useRef<HTMLInputElement>(null);
  
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (addingCatType && addCatInputRef.current) {
      addCatInputRef.current.focus();
    }
  }, [addingCatType]);

  const totalAllocatedPercent = localAllocation.needs + localAllocation.wants + localAllocation.savings;
  const isAllocationValid = totalAllocatedPercent === 100;

  const plannedTotals = useMemo(() => {
    return plannedItems.reduce((acc, item) => {
      acc[item.type] = (acc[item.type] || 0) + item.amount;
      return acc;
    }, { Need: 0, Want: 0, Saving: 0 } as Record<string, number>);
  }, [plannedItems]);

  const handleUpdatePercent = (key: keyof typeof localAllocation, value: string) => {
    const num = parseInt(value) || 0;
    setLocalAllocation(prev => ({ ...prev, [key]: num }));
    setSaved(false);
  };

  const handleSaveAllocation = () => {
    if (isAllocationValid) {
      setBudgetAllocation(localAllocation);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const handleAddPlannedItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemDesc || !newItemAmount || !newItemType) return;

    const parsedAmount = parseFloat(newItemAmount);
    if (!Number.isFinite(parsedAmount)) return;

    addPlannedItem({
      id: crypto.randomUUID(),
      description: newItemDesc,
      amount: parsedAmount,
      type: newItemType
    });
    
    setNewItemDesc('');
    setNewItemAmount('');
    setNewItemType(null);
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim() || !addingCatType) return;
    addCategory(addingCatType, newCatName.trim());
    setNewCatName('');
    setAddingCatType(null);
  };

  const getLimit = (type: 'Need' | 'Want' | 'Saving') => {
    const percent = type === 'Need' ? localAllocation.needs : type === 'Want' ? localAllocation.wants : localAllocation.savings;
    return (monthlyIncome * (percent / 100));
  };

  const renderPlannedList = (type: 'Need' | 'Want' | 'Saving') => {
    const items = plannedItems.filter(i => i.type === type);
    const limit = getLimit(type);
    const totalPlanned = plannedTotals[type];
    const isOver = totalPlanned > limit;
    
    const colors = {
      Need: { text: 'text-indigo-400', border: 'border-indigo-500/10', bg: 'bg-[#1E2B58]/5', tag: 'bg-[#1E2B58]/40 border-indigo-500/20 text-indigo-100' },
      Want: { text: 'text-[#C59D5F]', border: 'border-[#C59D5F]/10', bg: 'bg-[#C59D5F]/5', tag: 'bg-[#C59D5F]/10 border-[#C59D5F]/20 text-[#C59D5F]' },
      Saving: { text: 'text-[#4AA3A3]', border: 'border-[#4AA3A3]/10', bg: 'bg-[#4AA3A3]/5', tag: 'bg-[#4AA3A3]/10 border-[#4AA3A3]/20 text-[#4AA3A3]' }
    }[type];

    return (
      <div className={`mt-6 p-6 rounded-xl ${colors.bg} border ${colors.border} flex-1 flex flex-col`}>
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className={`text-[10px] font-bold uppercase tracking-[0.2em] ${colors.text} flex items-center gap-2`}>
              <Tag className="w-3 h-3" /> Categorization
            </h4>
            <button 
              onClick={() => setAddingCatType(type)}
              className="p-1 hover:bg-white/10 rounded-lg transition-colors text-slate-400"
            >
              <PlusCircle className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-2 min-h-[30px]">
            {customCategories[type].map(cat => (
              <div key={cat} className={`flex items-center gap-2 px-3 py-1.5 border rounded-lg text-[10px] font-bold ${colors.tag}`}>
                <span>{cat}</span>
                <button onClick={() => removeCategory(type, cat)} className="hover:text-rose-500 transition-colors">
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            
            {addingCatType === type && (
              <form onSubmit={handleAddCategory} className="flex items-center gap-2 animate-in fade-in duration-300 w-full">
                <input
                  ref={addCatInputRef}
                  className="flex-1 bg-black/30 border border-white/10 rounded-lg px-3 py-1.5 text-[10px] outline-none focus:border-[#4AA3A3] text-white"
                  placeholder="New tag..."
                  value={newCatName}
                  onChange={e => setNewCatName(e.target.value)}
                  onBlur={() => !newCatName && setAddingCatType(null)}
                />
              </form>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center mb-6 pt-5 border-t border-white/5">
          <h4 className={`text-[10px] font-bold uppercase tracking-[0.2em] ${colors.text}`}>Allocated</h4>
          <span className={`text-[11px] font-bold font-mono px-2 py-0.5 rounded-lg ${isOver ? 'bg-rose-500/10 text-rose-500' : 'bg-black/20 text-slate-500'}`}>
            ${totalPlanned.toLocaleString()} / ${limit.toLocaleString()}
          </span>
        </div>
        
        <div className="space-y-3 mb-6 flex-1 max-h-[200px] overflow-y-auto custom-scrollbar pr-1">
          {items.map(item => (
            <div key={item.id} className="flex items-center justify-between text-sm bg-black/20 p-4 rounded-xl border border-white/5 group hover:border-[#4AA3A3]/20 transition-all">
              <span className="text-slate-300 font-bold">{item.description}</span>
              <div className="flex items-center gap-4">
                <span className="font-bold text-white tracking-tight">${item.amount.toLocaleString()}</span>
                <button onClick={() => removePlannedItem(item.id)} className="text-slate-600 hover:text-rose-500 transition-all">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {newItemType === type ? (
          <form onSubmit={handleAddPlannedItem} className="flex flex-col gap-2 p-3 bg-black/40 rounded-xl border border-white/5 animate-in zoom-in-95">
            <div className="flex items-center gap-2 px-1 mb-1">
              <Sparkles className="w-3 h-3 text-teal-400" />
              <p className="text-[9px] font-bold text-slate-500 uppercase">Map to strategic goal</p>
            </div>
            <input 
              autoFocus
              className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#4AA3A3] text-white"
              placeholder="Description"
              value={newItemDesc}
              onChange={e => setNewItemDesc(e.target.value)}
            />
            <div className="flex gap-2">
              <input 
                type="number"
                className="flex-1 bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-sm outline-none text-white font-mono"
                placeholder="Amount ($)"
                value={newItemAmount}
                onChange={e => setNewItemAmount(e.target.value)}
              />
              <button type="submit" className="px-5 bg-[#4AA3A3] text-white rounded-lg hover:bg-[#3D8A8A] font-bold text-xs uppercase tracking-widest">
                ADD
              </button>
            </div>
          </form>
        ) : (
          <button 
            onClick={() => setNewItemType(type)}
            className="w-full py-4 border-2 border-dashed border-white/5 rounded-xl text-slate-600 text-[10px] font-bold uppercase tracking-[0.2em] hover:border-[#4AA3A3]/30 hover:text-[#4AA3A3] transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" /> Commit Item
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Portfolio Engine Block */}
      <div className="bg-[#1E2B58] p-10 rounded-xl relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#4AA3A3]/10 blur-[120px] -z-10"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 relative z-10">
          <div className="flex items-center gap-8">
            <div className="p-6 bg-white rounded-xl text-[#1E2B58] shadow-2xl flex items-center justify-center">
              <Wallet className="w-10 h-10" />
            </div>
            <div>
              <h2 className="font-display text-4xl font-bold text-white tracking-tighter leading-none mb-2">Portfolio Engine</h2>
              <p className="text-[#C59D5F] font-bold text-[10px] uppercase tracking-[0.4em]">Monthly Capital Strategy</p>
            </div>
          </div>
          <div className="relative group self-end md:self-auto">
            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-[#4AA3A3] font-bold text-3xl opacity-50">$</span>
            <input
              type="number"
              value={monthlyIncome}
              onChange={(e) => setMonthlyIncome(Number(e.target.value) || 0)}
              className="w-full md:w-96 bg-black/20 border border-white/10 p-8 pl-16 rounded-xl text-5xl font-bold focus:border-[#4AA3A3] outline-none transition-all text-right pr-10 text-white font-mono shadow-inner"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        <div className="bg-[#1E1E1E] border border-white/5 p-8 rounded-xl shadow-soft flex flex-col group">
          <div className="flex justify-between items-start mb-6">
            <div>
              <label className="text-indigo-400 font-bold uppercase tracking-[0.2em] text-[9px] block mb-2 opacity-50">Foundation Pillar</label>
              <h3 className="font-display text-xl font-bold text-white">Needs</h3>
            </div>
            <div className="relative w-24">
              <input
                type="number"
                value={localAllocation.needs}
                onChange={(e) => handleUpdatePercent('needs', e.target.value)}
                className="w-full bg-black/30 border border-indigo-500/10 p-3 rounded-xl text-center font-bold text-xl focus:border-indigo-500 outline-none pr-6 text-indigo-300"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-[10px]">%</span>
            </div>
          </div>
          {renderPlannedList('Need')}
        </div>

        <div className="bg-[#1E1E1E] border border-white/5 p-8 rounded-xl shadow-soft flex flex-col group">
          <div className="flex justify-between items-start mb-6">
            <div>
              <label className="text-[#C59D5F] font-bold uppercase tracking-[0.2em] text-[9px] block mb-2 opacity-50">Lifestyle Layer</label>
              <h3 className="font-display text-xl font-bold text-white">Wants</h3>
            </div>
            <div className="relative w-24">
              <input
                type="number"
                value={localAllocation.wants}
                onChange={(e) => handleUpdatePercent('wants', e.target.value)}
                className="w-full bg-black/30 border border-[#C59D5F]/10 p-3 rounded-xl text-center font-bold text-xl focus:border-[#C59D5F] outline-none pr-6 text-[#C59D5F]"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-[10px]">%</span>
            </div>
          </div>
          {renderPlannedList('Want')}
        </div>

        <div className="bg-[#1E1E1E] border border-white/5 p-8 rounded-xl shadow-soft flex flex-col group">
          <div className="flex justify-between items-start mb-6">
            <div>
              <label className="text-[#4AA3A3] font-bold uppercase tracking-[0.2em] text-[9px] block mb-2 opacity-50">Wealth Base</label>
              <h3 className="font-display text-xl font-bold text-white">Savings</h3>
            </div>
            <div className="relative w-24">
              <input
                type="number"
                value={localAllocation.savings}
                onChange={(e) => handleUpdatePercent('savings', e.target.value)}
                className="w-full bg-black/30 border border-[#4AA3A3]/10 p-3 rounded-xl text-center font-bold text-xl focus:border-[#4AA3A3] outline-none pr-6 text-[#4AA3A3]"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-[10px]">%</span>
            </div>
          </div>
          {renderPlannedList('Saving')}
        </div>
      </div>

      <div className="bg-[#1E1E1E]/95 border border-white/10 p-10 rounded-xl sticky bottom-4 md:relative md:bottom-0 shadow-2xl z-40 backdrop-blur-md">
        <div className="flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex items-center gap-8">
            <div className={`w-20 h-20 rounded-xl border-2 flex flex-col items-center justify-center font-bold text-2xl ${
              isAllocationValid ? 'border-[#4AA3A3] text-[#4AA3A3] shadow-[0_0_20px_rgba(74,163,163,0.2)] bg-[#4AA3A3]/5' : 'border-rose-500/50 text-rose-500'
            }`}>
              <span>{totalAllocatedPercent}</span>
              <span className="text-[10px] opacity-50">%</span>
            </div>
            <div>
              <p className={`font-display text-2xl font-bold tracking-tight leading-none mb-1 ${isAllocationValid ? 'text-[#4AA3A3]' : 'text-rose-500'}`}>
                {isAllocationValid ? 'Strategy Balanced' : 'Allocation Imbalance'}
              </p>
              <p className="text-slate-500 text-[9px] font-bold uppercase tracking-[0.3em]">Deployment Status: {isAllocationValid ? 'READY' : 'INVALID'}</p>
            </div>
          </div>

          <button
            onClick={handleSaveAllocation}
            disabled={!isAllocationValid || saved}
            className={`w-full md:w-auto px-16 py-6 rounded-full font-bold tracking-widest transition-all duration-300 flex items-center justify-center gap-4 text-sm ${
              saved 
              ? 'bg-[#4AA3A3] text-white shadow-xl scale-95 opacity-90' 
              : 'bg-[#1E2B58] hover:bg-[#253568] hover:scale-[1.02] active:scale-95 text-white disabled:opacity-20 shadow-lg shadow-[#1E2B58]/20'
            }`}
          >
            {saved ? <Check className="w-6 h-6" /> : <Target className="w-6 h-6" />}
            {saved ? 'COMMIT SUCCESS' : 'EXECUTE ARCHITECTURE'}
          </button>
        </div>
      </div>
    </div>
  );
};