import React, { ReactNode } from 'react';
import { LayoutDashboard, PlusCircle, RefreshCw, Settings, Target } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'budget', label: 'Budget', icon: Target },
    { id: 'add', label: 'Entry', icon: PlusCircle },
    { id: 'sync', label: 'Sync', icon: RefreshCw },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Desktop Header */}
      <header className="hidden md:flex items-center justify-between px-8 py-6 sticky top-0 z-50 bg-[#121212]/80 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-xl p-1.5 shadow-lg flex items-center justify-center overflow-hidden">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCBvxk0cTdzsj-IeFDgLL5SU0MuOAL0ZCPNOJP5E_QQP3f2pYvlOVx2DkBxpfRYNBvOrwsvj_hv18mDNYSoGc8ZRyG1FDbTuknJyYl8D9DVesX9sRoIMtXSk9IdjWbdFL7fvE59NC0pWNH3y1dlzaGpKzLg6siny3AWWS2Cqk4KZWGqKTq30AX7yD9ID1khsU9lRf4QuP0UAPe-mawotelGxY9YJmO5xlvIRq8kvuUVo515_1qqRky0T9QEepHRBsV4LlU05KRCZ5Y" 
              alt="FinSight Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h1 className="font-display font-bold text-2xl tracking-tight text-white">
              FinS<span className="text-[#4AA3A3]">1</span>ght
            </h1>
            <p className="text-[10px] text-[#C59D5F] font-bold uppercase tracking-[0.2em] -mt-1">Brand Strategy 2.0</p>
          </div>
        </div>

        <nav className="flex items-center gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-300 flex items-center gap-2 ${
                activeTab === tab.id 
                ? 'bg-[#1E2B58] text-white shadow-lg shadow-[#1E2B58]/20' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 pb-24 md:pb-12 p-4 md:p-8 max-w-6xl mx-auto w-full animate-in fade-in zoom-in-95 duration-700">
        {children}
      </main>

      {/* Mobile Navigation - Matching BrandKit Surface/Action styles */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#1e1e1e]/95 backdrop-blur-md border-t border-white/5 flex justify-around items-center px-4 pt-3 pb-8 safe-bottom z-50">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center p-2 rounded-2xl transition-all duration-300 ${
                isActive ? 'text-[#4AA3A3]' : 'text-slate-500'
              }`}
            >
              <Icon className={`w-6 h-6 mb-1 ${isActive ? 'scale-110' : 'scale-100'}`} />
              <span className="text-[10px] font-bold tracking-tight uppercase">{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};