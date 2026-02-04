
import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Calculator, 
  Info, 
  ShieldCheck, 
  Menu,
  CircleDollarSign,
  MessageSquareText,
  Activity,
  FileSearch,
  ExternalLink
} from 'lucide-react';
import Dashboard from './components/Dashboard.tsx';
import InternalGuidelines from './components/InternalGuidelines.tsx';
import LoanCalculator from './components/LoanCalculator.tsx';
import RealEstateTaxCalc from './components/RealEstateTaxCalc.tsx';
import RegulationSummary1015 from './components/RegulationSummary1015.tsx';

type View = 'dashboard' | 'guidelines' | 'loan-calc' | 'tax-calc' | 'reg-1015';

const AI_GEMINI_URL = "https://gemini.google.com/gem/1mscxQ0VVmKOkXr8POixiGAV935uGVm35?usp=sharing";

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const navigation = [
    { name: '대시보드', icon: LayoutDashboard, view: 'dashboard' as View, external: false },
    { name: '10.15 규제요약', icon: FileSearch, view: 'reg-1015' as View, external: false },
    { name: '실무 통합 지침', icon: Info, view: 'guidelines' as View, external: false },
    { name: '주담대 한도계산', icon: Calculator, view: 'loan-calc' as View, external: false },
    { name: '규제 AI 문의', icon: MessageSquareText, view: null, external: true, url: AI_GEMINI_URL },
    { name: 'DSR/부동산 계산기', icon: CircleDollarSign, view: 'tax-calc' as View, external: false },
  ];

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard onViewChange={setCurrentView} />;
      case 'reg-1015': return <RegulationSummary1015 />;
      case 'guidelines': return <InternalGuidelines />;
      case 'loan-calc': return <LoanCalculator />;
      case 'tax-calc': return <RealEstateTaxCalc />;
      default: return <Dashboard onViewChange={setCurrentView} />;
    }
  };

  const handleNavClick = (item: any) => {
    if (item.external) {
      window.open(item.url, '_blank');
    } else {
      setCurrentView(item.view);
    }
    if (window.innerWidth < 768) setIsSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden">
      {isSidebarOpen && <div className="fixed inset-0 bg-black/40 z-20 md:hidden" onClick={toggleSidebar} />}

      <aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-[#00479d] text-white transform transition-transform duration-200 md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-5 border-b border-blue-800/50">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-[#ccdb00]" />
            <div className="flex flex-col">
              <span className="font-black text-lg tracking-tighter leading-tight">농협 여신 PRO</span>
              <span className="text-[10px] text-blue-200/60 font-bold">(by KIMDAEYOON)</span>
            </div>
          </div>
        </div>

        <nav className="mt-4 px-3 space-y-1 overflow-y-auto max-h-[calc(100vh-100px)]">
          {navigation.map((item) => (
            <button 
              key={item.name} 
              onClick={() => handleNavClick(item)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${currentView === item.view ? 'bg-[#008e46] text-white shadow-md' : 'text-blue-100 hover:bg-blue-800'}`}
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-5 h-5" />
                <span className="font-bold text-sm">{item.name}</span>
              </div>
              {item.external && <ExternalLink className="w-3 h-3 opacity-50" />}
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-14 bg-white border-b flex items-center justify-between px-6 shrink-0 z-10">
          <button className="md:hidden" onClick={toggleSidebar}><Menu className="w-6 h-6 text-slate-600" /></button>
          <div className="flex-1 flex justify-end items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-[11px] font-black text-slate-400">
               <Activity className="w-3 h-3 text-[#008e46]" /> 2026.02 지침 활성화됨
            </div>
            <div className="w-8 h-8 rounded-lg bg-[#00479d] flex items-center justify-center text-white font-black text-xs border border-[#ccdb00]">NH</div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-[#f8fafc]">
          <div className={currentView === 'tax-calc' ? "w-full h-full" : "max-w-5xl mx-auto"}>
            {renderView()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
