
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Calculator, 
  Info, 
  ShieldCheck, 
  Menu,
  X,
  CircleDollarSign,
  MessageSquareText,
  Lock,
  Loader2,
  Activity
} from 'lucide-react';
import Dashboard from './components/Dashboard.tsx';
import InternalGuidelines from './components/InternalGuidelines.tsx';
import LoanCalculator from './components/LoanCalculator.tsx';
import RealEstateTaxCalc from './components/RealEstateTaxCalc.tsx';
import AiInquiry from './components/AiInquiry.tsx';

type View = 'dashboard' | 'guidelines' | 'loan-calc' | 'tax-calc' | 'ai-inquiry';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isApproved, setIsApproved] = useState<boolean | null>(null);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const approvalStatus = localStorage.getItem('nh_pro_approved');
    if (approvalStatus === 'true') {
      setIsApproved(true);
    } else {
      setIsApproved(false);
    }
  }, []);

  const handleApproval = (e: React.FormEvent) => {
    e.preventDefault();
    if (userName.trim()) {
      localStorage.setItem('nh_pro_approved', 'true');
      setIsApproved(true);
    }
  };

  if (isApproved === null) {
    return (
      <div className="min-h-screen bg-[#f0f4f8] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#00479d] animate-spin" />
      </div>
    );
  }

  if (isApproved === false) {
    return (
      <div className="min-h-screen bg-[#f0f4f8] flex items-center justify-center p-4">
        <div className="max-w-sm w-full bg-white rounded-3xl shadow-xl p-8 text-center border-2 border-[#008e46]/10">
          <div className="w-16 h-16 bg-[#00479d] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-xl font-black text-slate-900 mb-1">접근 권한 제한</h1>
          <p className="text-slate-500 font-bold text-sm mb-6">농협 여신 실무자 인증이 필요합니다.</p>
          <form onSubmit={handleApproval} className="space-y-3 text-left">
            <input 
              type="text" 
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="성함 (사번)"
              className="w-full bg-slate-50 border rounded-xl px-4 py-3 font-bold text-sm outline-none focus:ring-2 focus:ring-blue-200"
              required
            />
            <button type="submit" className="w-full bg-[#008e46] text-white py-3 rounded-xl font-black text-sm hover:bg-[#007036] shadow-md">
              권한 요청
            </button>
          </form>
        </div>
      </div>
    );
  }

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const navigation = [
    { name: '대시보드', icon: LayoutDashboard, view: 'dashboard' as View },
    { name: '실무 통합 지침', icon: Info, view: 'guidelines' as View },
    { name: '주담대 한도계산', icon: Calculator, view: 'loan-calc' as View },
    { name: '규제 AI 문의', icon: MessageSquareText, view: 'ai-inquiry' as View },
    { name: '부동산 계산기', icon: CircleDollarSign, view: 'tax-calc' as View },
  ];

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard onViewChange={setCurrentView} />;
      case 'guidelines': return <InternalGuidelines />;
      case 'loan-calc': return <LoanCalculator />;
      case 'tax-calc': return <RealEstateTaxCalc />;
      case 'ai-inquiry': return <AiInquiry />;
      default: return <Dashboard onViewChange={setCurrentView} />;
    }
  };

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden">
      {isSidebarOpen && <div className="fixed inset-0 bg-black/40 z-20 md:hidden" onClick={toggleSidebar} />}

      <aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-[#00479d] text-white transform transition-transform duration-200 md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-5 border-b border-blue-800/50 flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-[#ccdb00]" />
              <span className="font-black text-lg tracking-tighter">농협 여신 PRO</span>
            </div>
            <span className="text-[10px] text-blue-200/60 font-bold ml-8">by KIMDAEYOON</span>
          </div>
          <button className="md:hidden" onClick={toggleSidebar}><X className="w-5 h-5" /></button>
        </div>

        <nav className="mt-4 px-3 space-y-1">
          {navigation.map((item) => (
            <button key={item.name} onClick={() => { setCurrentView(item.view); if (window.innerWidth < 768) setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${currentView === item.view ? 'bg-[#008e46] text-white shadow-md' : 'text-blue-100 hover:bg-blue-800'}`}>
              <item.icon className="w-5 h-5" />
              <span className="font-bold text-sm">{item.name}</span>
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
          <div className="max-w-5xl mx-auto">{renderView()}</div>
        </div>
      </main>
    </div>
  );
};

export default App;
