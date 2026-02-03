
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
  UserCheck,
  Lock
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import InternalGuidelines from './components/InternalGuidelines';
import LoanCalculator from './components/LoanCalculator';
import RealEstateTaxCalc from './components/RealEstateTaxCalc';
import AiInquiry from './components/AiInquiry';

type View = 'dashboard' | 'guidelines' | 'loan-calc' | 'tax-calc' | 'ai-inquiry';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isApproved, setIsApproved] = useState<boolean | null>(null);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const approvalStatus = localStorage.getItem('nh_pro_approved');
    if (approvalStatus === 'true') setIsApproved(true);
    else setIsApproved(false);
  }, []);

  const handleApproval = (e: React.FormEvent) => {
    e.preventDefault();
    // 실제 운영 시 관리자 DB 연동이 필요하나, 여기서는 시뮬레이션을 위해 즉시 승인 로직 제공
    if (userName.trim()) {
      localStorage.setItem('nh_pro_approved', 'true');
      setIsApproved(true);
    }
  };

  if (isApproved === false) {
    return (
      <div className="min-h-screen bg-[#f0f4f8] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-10 text-center border-4 border-[#008e46]/20">
          <div className="w-20 h-20 bg-[#00479d] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg border-2 border-[#ccdb00]">
            <Lock className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-2">접근 권한 제한</h1>
          <p className="text-slate-500 font-bold mb-8">본 앱은 농협 여신 실무자 전용입니다.<br/>관리자의 승인이 필요합니다.</p>
          
          <form onSubmit={handleApproval} className="space-y-4 text-left">
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">성함 / 사번</label>
              <input 
                type="text" 
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="예: 홍길동 (12345678)"
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 font-bold focus:ring-4 focus:ring-blue-100 outline-none transition-all mt-1"
                required
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-[#008e46] text-white py-5 rounded-2xl font-black text-lg hover:bg-[#007036] transition-all shadow-lg active:scale-95"
            >
              사용 권한 요청하기
            </button>
          </form>
          <p className="mt-6 text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Authorized Personnel Only</p>
        </div>
      </div>
    );
  }

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const navigation = [
    { name: '대시보드', icon: LayoutDashboard, view: 'dashboard' as View },
    { name: '여신 실무 지침', icon: Info, view: 'guidelines' as View },
    { name: '주담대 가능금액', icon: Calculator, view: 'loan-calc' as View },
    { name: '대출 규제 AI 문의', icon: MessageSquareText, view: 'ai-inquiry' as View },
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
    <div className="flex h-screen bg-[#f0f4f8] overflow-hidden">
      {isSidebarOpen && <div className="fixed inset-0 bg-black/50 z-20 md:hidden" onClick={toggleSidebar} />}

      <aside className={`fixed inset-y-0 left-0 z-30 w-72 bg-[#00479d] text-white transform transition-transform duration-300 md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between p-6 border-b border-blue-800">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-8 h-8 text-[#ccdb00]" />
              <span className="text-xl font-black tracking-tight">농협 여신 실무 PRO</span>
            </div>
            <span className="text-[10px] text-blue-200 mt-1 ml-10">by kimdaeyoon</span>
          </div>
          <button className="md:hidden" onClick={toggleSidebar}><X className="w-6 h-6" /></button>
        </div>

        <nav className="mt-8 px-4 space-y-2">
          {navigation.map((item) => (
            <button key={item.name} onClick={() => { setCurrentView(item.view); if (window.innerWidth < 768) setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl transition-all duration-200 ${currentView === item.view ? 'bg-[#008e46] text-white shadow-lg scale-105' : 'text-blue-100 hover:bg-blue-800 hover:text-white'}`}>
              <item.icon className="w-6 h-6" />
              <span className="font-bold text-base">{item.name}</span>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-6 border-t border-blue-800">
          <div className="flex items-center gap-3 text-blue-200 text-xs font-bold">
            <div className="w-2.5 h-2.5 rounded-full bg-[#ccdb00] animate-pulse"></div>
            <span>'26.02 최신 지침 반영</span>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0 shadow-sm z-10">
          <button className="md:hidden" onClick={toggleSidebar}><Menu className="w-8 h-8 text-slate-600" /></button>
          <div className="flex-1 flex justify-end items-center gap-6">
            <div className="hidden lg:flex items-center gap-4">
              <span className="text-sm font-black text-slate-800 uppercase tracking-wider tracking-tighter">최종 접속 권한자:</span>
              <span className="px-4 py-1.5 bg-[#ccdb00]/20 text-[#00479d] rounded-full font-black text-xs border border-[#ccdb00]">승인됨</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#00479d] flex items-center justify-center text-white font-black text-sm border-2 border-[#ccdb00] shadow-md">NH</div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-10 bg-[#f0f4f8]">
          <div className="max-w-6xl mx-auto">{renderView()}</div>
        </div>
      </main>
    </div>
  );
};

export default App;
