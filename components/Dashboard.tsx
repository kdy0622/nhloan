
import React from 'react';
import { 
  ArrowRight, 
  Info, 
  Calculator, 
  Landmark, 
  TrendingUp,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';

interface DashboardProps {
  onViewChange: (view: any) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onViewChange }) => {
  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">여신 실무 대시보드</h1>
          <p className="text-slate-500 mt-2 text-lg font-medium">NH농협 여신 실무자를 위한 10.15 대책 통합 가이드</p>
        </div>
        <div className="bg-[#ccdb00] px-6 py-2 rounded-xl border-2 border-[#008e46] text-[#00479d] font-black text-sm shadow-md animate-bounce">
           전산 적용 완료: '25.10.29
        </div>
      </header>

      {/* Hero Stats - Nonghyup Themed */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 hover:shadow-xl transition-all group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-black text-[#00479d] mb-2 uppercase tracking-widest">수도권 구입자금</p>
              <h3 className="text-4xl font-black text-slate-900">최대 6억</h3>
              <p className="text-sm text-rose-500 font-bold mt-3">시가 15억 이하 기준 상한</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-2xl group-hover:bg-[#00479d] group-hover:text-white transition-colors">
              <Landmark className="w-8 h-8 text-[#00479d] group-hover:text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 hover:shadow-xl transition-all group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-black text-[#008e46] mb-2 uppercase tracking-widest">스트레스 DSR</p>
              <h3 className="text-4xl font-black text-slate-900">3.0% <span className="text-lg text-slate-400">적용</span></h3>
              <p className="text-sm text-amber-600 font-bold mt-3">수도권·규제지역 주담대</p>
            </div>
            <div className="p-4 bg-emerald-50 rounded-2xl group-hover:bg-[#008e46] group-hover:text-white transition-colors">
              <TrendingUp className="w-8 h-8 text-[#008e46] group-hover:text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 hover:shadow-xl transition-all group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-black text-slate-400 mb-2 uppercase tracking-widest">규제지역 LTV</p>
              <h3 className="text-4xl font-black text-slate-900">40% <span className="text-lg text-slate-400">강화</span></h3>
              <p className="text-sm text-slate-500 font-bold mt-3">무주택·처분조건부 1주택</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl group-hover:bg-slate-900 group-hover:text-white transition-colors">
              <ShieldCheck className="w-8 h-8 text-slate-600 group-hover:text-white" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <h2 className="font-black text-xl text-slate-900">핵심 기능 바로가기</h2>
          </div>
          <div className="p-6 space-y-4">
            <button 
              onClick={() => onViewChange('guidelines')}
              className="w-full flex items-center justify-between p-6 rounded-2xl hover:bg-blue-50 border border-transparent hover:border-blue-100 transition-all group"
            >
              <div className="flex items-center gap-5">
                <div className="p-3 bg-blue-100 rounded-xl text-[#00479d] group-hover:bg-[#00479d] group-hover:text-white transition-all">
                  <Info className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <p className="font-black text-lg text-slate-900">여신 실무 지침</p>
                  <p className="text-sm text-slate-500 font-medium">10.15 대책 및 지역별 한도 요약</p>
                </div>
              </div>
              <ArrowRight className="w-6 h-6 text-slate-300 group-hover:text-[#00479d] group-hover:translate-x-1 transition-all" />
            </button>

            <button 
              onClick={() => onViewChange('loan-calc')}
              className="w-full flex items-center justify-between p-6 rounded-2xl hover:bg-emerald-50 border border-transparent hover:border-emerald-100 transition-all group"
            >
              <div className="flex items-center gap-5">
                <div className="p-3 bg-emerald-100 rounded-xl text-[#008e46] group-hover:bg-[#008e46] group-hover:text-white transition-all">
                  <Calculator className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <p className="font-black text-lg text-slate-900">주담대 가능금액 계산</p>
                  <p className="text-sm text-slate-500 font-medium">강화된 LTV·DSR 기반 한도 산출</p>
                </div>
              </div>
              <ArrowRight className="w-6 h-6 text-slate-300 group-hover:text-[#008e46] group-hover:translate-x-1 transition-all" />
            </button>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 flex flex-col">
          <h2 className="font-black text-xl text-slate-900 mb-6 flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-amber-500" />
            주요 유의사항
          </h2>
          <div className="flex-1 space-y-4">
             <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100">
               <p className="text-xs font-black text-rose-800 uppercase mb-1">생활안정자금</p>
               <p className="text-sm text-rose-900 font-medium leading-relaxed">규제지역 및 수도권 1주택자 합산 1억원 초과 불가 (예외 대심위 승인)</p>
             </div>
             <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
               <p className="text-xs font-black text-blue-800 uppercase mb-1">처분/전입 의무</p>
               <p className="text-sm text-blue-900 font-medium leading-relaxed">규제지역/수도권 6개월 내 이행 필수. 미이행 시 기한이익 상실.</p>
             </div>
             <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
               <p className="text-xs font-black text-slate-500 uppercase mb-1">경과규정</p>
               <p className="text-sm text-slate-700 font-medium leading-relaxed">'25.10.15 이전 전산접수 또는 입주자 모집공고 시 종전 규정 적용.</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
