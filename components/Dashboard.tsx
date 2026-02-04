
import React from 'react';
import { 
  ArrowRight, 
  Calculator, 
  Landmark, 
  TrendingUp,
  ShieldCheck,
  AlertTriangle,
  Info,
  MessageSquareText,
  CircleDollarSign,
  FileSearch,
  ShieldAlert,
  ExternalLink
} from 'lucide-react';

interface DashboardProps {
  onViewChange: (view: any) => void;
}

const AI_GEMINI_URL = "https://gemini.google.com/gem/1mscxQ0VVmKOkXr8POixiGAV935uGVm35?usp=sharing";

const Dashboard: React.FC<DashboardProps> = ({ onViewChange }) => {
  return (
    <div className="space-y-4 animate-in fade-in duration-500 pb-10">
      <header className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex flex-col">
          <h1 className="text-4xl font-black text-[#00479d] tracking-tighter leading-none">농협여신PRO</h1>
          <span className="text-[13px] font-bold text-slate-400 mt-2 tracking-tight block ml-1">(by KIMDAEYOON)</span>
          <p className="text-slate-500 text-[11px] font-bold mt-4 bg-slate-50 self-start px-2 py-1 rounded-md border border-slate-100">
            2026.02 통합 지침 및 10.15 대책 완벽 반영
          </p>
        </div>
        <div className="hidden sm:block bg-[#ccdb00]/20 px-3 py-2 rounded-xl border border-[#008e46]/30 text-[#00479d] font-black text-[10px] shadow-sm">
           LATEST UPDATE: 2026.02.05
        </div>
      </header>

      {/* Grid: Main Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: '수도권 상한', val: '6억', icon: Landmark, color: 'text-blue-600' },
          { label: '스트레스 DSR', val: '3.0%', icon: TrendingUp, color: 'text-emerald-600' },
          { label: '규제지역 LTV', val: '40%', icon: ShieldCheck, color: 'text-slate-600' },
          { label: '최저 금리', val: '4.7%', icon: Calculator, color: 'text-rose-600' }
        ].map((m, i) => (
          <div key={i} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center group hover:border-blue-200 transition-all">
            <m.icon className={`w-4 h-4 mb-2 opacity-30 group-hover:opacity-100 transition-opacity`} />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{m.label}</p>
            <h3 className={`text-xl font-black ${m.color}`}>{m.val}</h3>
          </div>
        ))}
      </div>

      {/* 10.15 Regulation Special Card */}
      <div 
        onClick={() => onViewChange('reg-1015')}
        className="bg-gradient-to-r from-rose-600 to-rose-500 rounded-3xl p-6 text-white shadow-lg cursor-pointer group hover:scale-[1.01] transition-all border-b-4 border-rose-800"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-2xl">
              <ShieldAlert className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-black flex items-center gap-2">
                10.15 대출수요 관리 강화방안 <span className="text-[10px] bg-rose-700 px-2 py-0.5 rounded-full">HOT</span>
              </h2>
              <p className="text-sm font-bold opacity-80 mt-1">수도권 한도 상한 및 생활안정자금 규제 핵심 요약 보기</p>
            </div>
          </div>
          <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Navigation Buttons Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button onClick={() => onViewChange('loan-calc')}
            className="flex items-center justify-between p-5 rounded-2xl bg-emerald-50 border border-emerald-100 hover:bg-emerald-100 transition-all group shadow-sm">
            <div className="flex items-center gap-3">
              <Calculator className="w-6 h-6 text-emerald-600" />
              <div className="text-left"><p className="font-black text-base text-emerald-800">주담대 한도계산</p><p className="text-[10px] text-emerald-600 font-bold">10.15 규제 상한 자동 적용</p></div>
            </div>
            <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-all" />
          </button>
          
          <button onClick={() => onViewChange('guidelines')}
            className="flex items-center justify-between p-5 rounded-2xl bg-blue-50 border border-blue-100 hover:bg-blue-100 transition-all group shadow-sm">
            <div className="flex items-center gap-3">
              <Info className="w-6 h-6 text-blue-600" />
              <div className="text-left"><p className="font-black text-base text-blue-800">실무 지침 가이드</p><p className="text-[10px] text-blue-600 font-bold">전결권/방공제/가산금리</p></div>
            </div>
            <ArrowRight className="w-4 h-4 text-blue-400 group-hover:translate-x-1 transition-all" />
          </button>

          <button onClick={() => window.open(AI_GEMINI_URL, '_blank')}
            className="flex items-center justify-between p-5 rounded-2xl bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 transition-all group shadow-sm relative">
            <div className="flex items-center gap-3">
              <MessageSquareText className="w-6 h-6 text-indigo-600" />
              <div className="text-left">
                <p className="font-black text-base text-indigo-800 flex items-center gap-1.5">
                  규제 AI 문의 <ExternalLink className="w-3 h-3 text-indigo-400" />
                </p>
                <p className="text-[10px] text-indigo-600 font-bold">농협 지침 학습 Gemini 열기</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-indigo-400 group-hover:translate-x-1 transition-all" />
          </button>

          <button onClick={() => onViewChange('tax-calc')}
            className="flex items-center justify-between p-5 rounded-2xl bg-amber-50 border border-amber-100 hover:bg-amber-100 transition-all group shadow-sm">
            <div className="flex items-center gap-3">
              <CircleDollarSign className="w-6 h-6 text-amber-600" />
              <div className="text-left"><p className="font-black text-base text-amber-800">DSR/부동산 계산기</p><p className="text-[10px] text-amber-600 font-bold">DSR 및 통합 금융계산기</p></div>
            </div>
            <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-all" />
          </button>

          <button onClick={() => onViewChange('reg-1015')}
            className="flex items-center justify-between p-5 rounded-2xl bg-rose-50 border border-rose-100 hover:bg-rose-100 transition-all group shadow-sm sm:col-span-2">
            <div className="flex items-center gap-3">
              <FileSearch className="w-6 h-6 text-rose-600" />
              <div className="text-left"><p className="font-black text-base text-rose-800">10.15 규제 상세 분석</p><p className="text-[10px] text-rose-600 font-bold">수도권 상한액/DSR/의무사항 통합 정리</p></div>
            </div>
            <ArrowRight className="w-4 h-4 text-rose-400 group-hover:translate-x-1 transition-all" />
          </button>
        </div>

        {/* Notices */}
        <section className="bg-white rounded-2xl border border-slate-100 p-5 h-fit shadow-sm">
          <h2 className="font-black text-xs text-slate-900 mb-4 flex items-center gap-2 tracking-tight">
            <AlertTriangle className="w-4 h-4 text-amber-500" /> 
            실무 핵심 체크리스트
          </h2>
          <div className="space-y-2.5">
             <div className="p-3 bg-rose-50 rounded-xl border border-rose-100 text-[11px] font-bold text-rose-900 leading-relaxed">
               10.15 대책: 규제/수도권 생활안정자금 합산 1억 제한 (예외 승인 프로세스 확인 필수)
             </div>
             <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 text-[11px] font-bold text-blue-900 leading-relaxed">
               의무 이행: 6개월 내 처분/전입 등기 증빙 미제출 시 즉시 기한이익 상실
             </div>
             <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-[11px] font-bold text-emerald-900 leading-relaxed">
               스트레스 DSR: 2단계 (수도권 3.0% 가산) 적용. 상환여력 심사 강화
             </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
