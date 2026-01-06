
import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { AddTransaction } from './components/AddTransaction';
import { SyncModule } from './components/SyncModule';
import { BudgetPlanner } from './components/BudgetPlanner';
import { useStore } from './store';
import { Settings, User, Wallet, Bell, Database, RefreshCw, Trash2, Shield } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { monthlyIncome, setMonthlyIncome } = useStore();

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'budget':
        return <BudgetPlanner />;
      case 'add':
        return <AddTransaction onComplete={() => setActiveTab('dashboard')} />;
      case 'sync':
        return <SyncModule />;
      case 'settings':
        return (
          <div className="space-y-6 max-w-2xl mx-auto pb-12">
            <div className="bg-[#1E2B58]/30 border border-white/10 p-10 rounded-2xl backdrop-blur-xl shadow-2xl">
              <h2 className="text-3xl font-black mb-10 tracking-tight leading-none">System Settings</h2>
              
              <div className="space-y-8">
                <div className="flex items-center justify-between p-6 bg-white/5 rounded-xl border border-white/5 group hover:border-[#4AA3A3]/20 transition-all">
                  <div className="flex items-center gap-5">
                    <div className="p-3 bg-[#4AA3A3]/10 rounded-xl text-[#4AA3A3]">
                      <Wallet className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold text-lg">Income Engine Goal</p>
                      <p className="text-xs text-slate-500 font-medium">Used for strategic calculations</p>
                    </div>
                  </div>
                  <input
                    type="number"
                    value={monthlyIncome}
                    onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                    className="bg-black/40 border border-white/10 px-6 py-3 rounded-xl w-36 text-right font-black text-2xl text-[#4AA3A3] focus:border-[#4AA3A3] outline-none transition-all font-mono"
                  />
                </div>

                <div className="flex items-center justify-between p-6 bg-white/5 rounded-xl border border-white/5">
                  <div className="flex items-center gap-5">
                    <div className="p-3 bg-slate-800 rounded-xl text-slate-400">
                      <Bell className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold text-lg">Push Alerts</p>
                      <p className="text-xs text-slate-500 font-medium">Coming soon to 2.0</p>
                    </div>
                  </div>
                  <div className="w-14 h-8 bg-black/40 rounded-full relative p-1 cursor-not-allowed">
                    <div className="w-6 h-6 bg-slate-700 rounded-full" />
                  </div>
                </div>

                <div className="pt-10 border-t border-white/5">
                  <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-6">Data Architecture</h3>
                  <div className="space-y-4">
                    <button 
                      onClick={() => setActiveTab('sync')}
                      className="w-full flex items-center justify-between p-6 bg-[#1E2B58]/40 border border-white/5 rounded-xl hover:bg-[#1E2B58]/60 transition-all group"
                    >
                      <div className="flex items-center gap-4">
                        <RefreshCw className="w-6 h-6 text-[#4AA3A3] group-hover:rotate-180 transition-transform duration-700" />
                        <span className="font-bold text-lg">Encrypted Sync Hub</span>
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Access Console</span>
                    </button>
                    
                    <div className="p-6 bg-[#4AA3A3]/5 border border-[#4AA3A3]/10 rounded-xl flex items-start gap-4 shadow-inner">
                      <Shield className="w-6 h-6 text-[#4AA3A3] shrink-0 mt-1" />
                      <p className="text-sm text-slate-400 leading-relaxed">
                        FinSight prioritizes <span className="text-white font-bold italic">Local-First</span> privacy. Your financial map is etched into this browser's secure cache. <strong>Always archive a physical backup via Sync Hub.</strong>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-5 border-t border-white/5 pt-10 mt-6">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#1E2B58] to-[#4AA3A3] flex items-center justify-center shadow-lg">
                    <User className="text-white w-8 h-8" />
                  </div>
                  <div>
                    <p className="font-black text-xl leading-none mb-2 tracking-tight">System Operator</p>
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] flex items-center gap-2">
                      <Database className="w-3 h-3" /> Core Storage: Operational
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-rose-950/10 border border-rose-500/20 p-10 rounded-2xl group transition-all hover:bg-rose-950/20">
              <div className="flex items-center gap-4 mb-4">
                <Trash2 className="w-6 h-6 text-rose-500" />
                <h3 className="text-rose-500 font-black text-xl tracking-tight">Purge Protocol</h3>
              </div>
              <p className="text-rose-400/60 text-sm mb-8 leading-relaxed font-medium">Executing this action will irreversibly incinerate all local financial records and tactical plans from this device environment.</p>
              <button 
                onClick={() => {
                  if(confirm('PURGE WARNING: This protocol will erase all local data. Continue?')) {
                    localStorage.removeItem('finsight-storage');
                    window.location.reload();
                  }
                }}
                className="w-full sm:w-auto px-10 py-4 bg-rose-500/10 hover:bg-rose-600 text-rose-500 hover:text-white border border-rose-500/30 rounded-xl transition-all font-black uppercase tracking-widest text-xs shadow-xl shadow-rose-950/30"
              >
                Execute Local Data Purge
              </button>
            </div>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </Layout>
  );
};

export default App;
