import React, { useMemo, useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useStore } from '../store';
import { TrendingUp, TrendingDown, Wallet, Sparkles, ArrowUpRight, LayoutGrid } from 'lucide-react';
import { getFinancialAdvice } from '../geminiService';

export const Dashboard: React.FC = () => {
  const { transactions, monthlyIncome } = useStore();
  const [advice, setAdvice] = useState<string | null>(null);
  const [loadingAdvice, setLoadingAdvice] = useState(false);

  // BrandKit Official Palette
  const COLORS = {
    Need: '#1E2B58',   // Midnight Navy
    Want: '#C59D5F',   // Prestige Gold
    Saving: '#4AA3A3', // Growth Teal
  };

  const stats = useMemo(() => {
    const totals = transactions.reduce((acc, t) => {
      acc[t.type] = (acc[t.type] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

    const categoryBreakdown = transactions.reduce((acc, t) => {
      if (!acc[t.category]) acc[t.category] = { amount: 0, type: t.type };
      acc[t.category].amount += t.amount;
      return acc;
    }, {} as Record<string, { amount: number, type: string }>);

    const breakdownData = (Object.entries(categoryBreakdown) as [string, { amount: number, type: string }][])
      .map(([name, data]) => ({ name, value: data.amount, type: data.type }))
      .sort((a, b) => b.value - a.value);

    const totalSpent = (totals.Need || 0) + (totals.Want || 0) + (totals.Saving || 0);
    const balance = monthlyIncome - totalSpent;

    const pieData = [
      { name: 'Needs', value: totals.Need || 0, color: COLORS.Need },
      { name: 'Wants', value: totals.Want || 0, color: COLORS.Want },
      { name: 'Savings', value: totals.Saving || 0, color: COLORS.Saving },
    ].filter(d => d.value > 0);

    return { totals, totalSpent, balance, pieData, breakdownData };
  }, [transactions, monthlyIncome]);

  useEffect(() => {
    const fetchAdvice = async () => {
      if (transactions.length > 0) {
        setLoadingAdvice(true);
        const res = await getFinancialAdvice(transactions, monthlyIncome);
        setAdvice(res);
        setLoadingAdvice(false);
      }
    };
    fetchAdvice();
  }, [transactions.length, monthlyIncome]);

  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#1E1E1E] border border-white/5 p-6 rounded-xl relative overflow-hidden group shadow-card">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#4AA3A3]/5 blur-3xl group-hover:bg-[#4AA3A3]/10 transition-all"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-[#4AA3A3]/10 rounded-lg text-[#4AA3A3]">
              <Wallet className="w-6 h-6" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-600 group-hover:text-[#4AA3A3] transition-colors" />
          </div>
          <h3 className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Safe Portfolio</h3>
          <p className="font-display text-3xl font-bold text-white mt-1">${stats.balance.toLocaleString()}</p>
        </div>

        <div className="bg-[#1E1E1E] border border-white/5 p-6 rounded-xl relative overflow-hidden group shadow-card">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#1E2B58]/10 blur-3xl transition-all"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-[#1E2B58]/50 rounded-lg text-white">
              <TrendingDown className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Total Outflow</h3>
          <p className="font-display text-3xl font-bold text-white mt-1">${stats.totalSpent.toLocaleString()}</p>
        </div>

        <div className="bg-[#1E1E1E] border border-white/5 p-6 rounded-xl relative overflow-hidden group shadow-card">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#C59D5F]/5 blur-3xl transition-all"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-[#C59D5F]/10 rounded-lg text-[#C59D5F]">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Target Income</h3>
          <p className="font-display text-3xl font-bold text-white mt-1">${monthlyIncome.toLocaleString()}</p>
        </div>
      </div>

      {/* Hero AI Block */}
      {advice && (
        <div className="bg-gradient-to-r from-[#1E2B58] to-[#4AA3A3] p-8 rounded-xl shadow-lg flex gap-6 relative overflow-hidden">
          <div className="shrink-0 w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-md">
            <Sparkles className="w-6 h-6 text-[#C59D5F]" />
          </div>
          <div>
            <h4 className="text-white/80 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">Intelligence Protocol</h4>
            <p className="text-white text-lg font-medium leading-relaxed italic">"{advice}"</p>
          </div>
        </div>
      )}

      {/* Secondary Row: Charts & Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#1E1E1E] border border-white/5 p-8 rounded-xl shadow-soft">
          <h3 className="font-display font-bold text-lg mb-6">Allocation Analytics</h3>
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats.pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1E1E1E', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#1E1E1E] border border-white/5 p-8 rounded-xl shadow-soft flex flex-col">
          <h3 className="font-display font-bold text-lg mb-6 flex items-center gap-2">
            <LayoutGrid className="w-5 h-5 text-[#4AA3A3]" /> Classification
          </h3>
          <div className="flex-1 overflow-y-auto pr-2 space-y-4 max-h-[260px] custom-scrollbar">
            {stats.breakdownData.length === 0 ? (
              <p className="text-slate-600 text-sm italic">Empty ledger stream.</p>
            ) : (
              stats.breakdownData.map((item, idx) => (
                <div key={idx} className="bg-white/5 p-4 rounded-xl border border-white/5">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-slate-300">{item.name}</span>
                    <span className="text-sm font-bold text-white">${item.value.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-black/30 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-700"
                      style={{ 
                        width: `${(item.value / stats.totalSpent) * 100}%`,
                        backgroundColor: item.type === 'Need' ? '#1E2B58' : item.type === 'Want' ? '#C59D5F' : '#4AA3A3'
                      }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* History */}
      <div className="bg-[#1E1E1E] border border-white/5 p-8 rounded-xl">
        <h3 className="font-display font-bold text-lg mb-6">Execution Log</h3>
        <div className="space-y-3">
          {transactions.slice(0, 5).map((t) => (
            <div key={t.id} className="flex items-center justify-between p-5 bg-white/5 rounded-xl border border-white/5 hover:border-[#4AA3A3]/30 transition-all group">
              <div className="flex items-center gap-4">
                <div className={`w-2 h-8 rounded-full ${
                  t.type === 'Need' ? 'bg-[#1E2B58]' : t.type === 'Want' ? 'bg-[#C59D5F]' : 'bg-[#4AA3A3]'
                }`} />
                <div>
                  <p className="font-bold text-white text-sm">{t.description}</p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">
                    {t.category} • {new Date(t.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <p className="font-display font-bold text-white">-${t.amount.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};