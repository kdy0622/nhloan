
import React from 'react';
import { 
  AlertTriangle, 
  // Fix: Added missing AlertCircle import
  AlertCircle,
  ClipboardList, 
  Home, 
  BadgePercent, 
  ShieldAlert, 
  Info,
  ChevronRight,
  TrendingUp,
  Landmark
} from 'lucide-react';

const RegulationSummary1015: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <header className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-4 mb-3">
          <div className="p-3 bg-rose-100 rounded-2xl text-rose-600">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tighter leading-tight">10.15 대출수요 관리 강화방안 요약</h2>
            <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">Mortgage Demand Management Strengthening Plan (2025.10.29 시행)</p>
          </div>
        </div>
        <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0" />
          <p className="text-[13px] font-black text-rose-900">본 지침은 수도권 및 규제지역의 가계대출 쏠림 현상을 방지하기 위한 강화된 심사 기준입니다.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Category 1: Purchase Fund Limits */}
        <section className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col h-full">
          <div className="flex items-center gap-2 mb-4 text-[#00479d] border-b pb-3">
            <Landmark className="w-5 h-5" />
            <h3 className="text-base font-black">1. 주택구입자금 대출한도 상한</h3>
          </div>
          <div className="flex-1 space-y-4">
            <p className="text-[12px] font-bold text-slate-500">• 대상지역: 수도권 및 규제지역 (서울, 과천, 성남, 하남 등)</p>
            <div className="grid grid-cols-1 gap-2">
              <div className="flex justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 items-center">
                <span className="text-[13px] font-black text-slate-700">시가 15억원 이하</span>
                <span className="text-rose-600 font-black text-base">최대 600백만원</span>
              </div>
              <div className="flex justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 items-center">
                <span className="text-[13px] font-black text-slate-700">15억 초과 ~ 25억 이하</span>
                <span className="text-rose-600 font-black text-base">최대 400백만원</span>
              </div>
              <div className="flex justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 items-center">
                <span className="text-[13px] font-black text-slate-700">시가 25억원 초과</span>
                <span className="text-rose-600 font-black text-base">최대 200백만원</span>
              </div>
            </div>
            <div className="p-3 bg-blue-50/50 rounded-xl text-[11px] font-bold text-blue-800">
               ※ 단, 이주비 대출은 주택가격 관계없이 600백만원 적용
            </div>
          </div>
        </section>

        {/* Category 2: Living Fund Limits */}
        <section className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col h-full">
          <div className="flex items-center gap-2 mb-4 text-[#008e46] border-b pb-3">
            <Home className="w-5 h-5" />
            <h3 className="text-base font-black">2. 생활안정자금 대출 제한</h3>
          </div>
          <div className="flex-1 space-y-4">
            <p className="text-[12px] font-bold text-slate-500">• 대상: 수도권 및 규제지역 내 1주택/다주택 차주</p>
            <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-100 text-center space-y-2">
               <p className="text-[11px] font-black text-emerald-600 uppercase tracking-widest">인별 합산 한도</p>
               <h4 className="text-3xl font-black text-emerald-900">100백만원 상한</h4>
               <p className="text-[10px] font-bold text-emerald-600">기존 생활자금 대출 잔액을 포함한 합산 금액 기준</p>
            </div>
            <ul className="text-[11px] font-bold text-slate-600 space-y-2">
              <li className="flex items-start gap-2"><ChevronRight className="w-3 h-3 text-emerald-500 mt-1 shrink-0" /> 2주택 이상 보유 세대는 원칙적 취급 불가</li>
              <li className="flex items-start gap-2"><ChevronRight className="w-3 h-3 text-emerald-500 mt-1 shrink-0" /> 예외 승인 시에만 LTV 30~40% 적용 가능</li>
            </ul>
          </div>
        </section>

        {/* Category 3: LTV Strengthening */}
        <section className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-2 mb-4 text-amber-600 border-b pb-3">
            <BadgePercent className="w-5 h-5" />
            <h3 className="text-base font-black">3. 지역별 LTV 강화 지침</h3>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-100 text-center">
                <p className="text-[10px] font-black text-amber-600">규제지역 무주택</p>
                <p className="text-xl font-black text-amber-900">40% 적용</p>
              </div>
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-100 text-center">
                <p className="text-[10px] font-black text-amber-600">규제지역 서민실수요</p>
                <p className="text-xl font-black text-amber-900">60% 적용</p>
              </div>
            </div>
            <div className="overflow-x-auto rounded-xl border border-slate-100">
               <table className="w-full text-[11px] font-bold text-left border-collapse">
                 <thead className="bg-slate-50 text-slate-400">
                   <tr><th className="p-2 border-b">지역구분</th><th className="p-2 border-b">생애최초</th><th className="p-2 border-b">일반</th></tr>
                 </thead>
                 <tbody>
                   <tr><td className="p-2 border-b bg-slate-50/30">규제지역</td><td className="p-2 border-b text-blue-600">70%</td><td className="p-2 border-b">40%</td></tr>
                   <tr><td className="p-2 border-b bg-slate-50/30">수도권(비규제)</td><td className="p-2 border-b text-blue-600">70%</td><td className="p-2 border-b">70%</td></tr>
                   <tr><td className="p-2 border-b bg-slate-50/30">기타지역</td><td className="p-2 border-b text-blue-600">80%</td><td className="p-2 border-b">70%</td></tr>
                 </tbody>
               </table>
            </div>
          </div>
        </section>

        {/* Category 4: Stress DSR */}
        <section className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4 text-indigo-600 border-b pb-3">
              <TrendingUp className="w-5 h-5" />
              <h3 className="text-base font-black">4. 스트레스 DSR 2단계 시행</h3>
            </div>
            <div className="space-y-4">
               <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[12px] font-black text-indigo-900">수도권 및 규제지역</span>
                    <span className="text-lg font-black text-indigo-700">3.00% 가산</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[12px] font-black text-slate-500">비수도권 (종전 기준)</span>
                    <span className="text-sm font-black text-slate-600">1.50% 가산</span>
                  </div>
               </div>
               <p className="text-[11px] font-bold text-slate-500 leading-relaxed">
                 ※ 변동금리/혼합형/주기형 등 모든 상환방식에 스트레스 금리 차등 적용하여 차주 상환능력 심사 강화
               </p>
            </div>
          </div>
          <div className="mt-4 p-3 bg-slate-900 rounded-2xl text-white flex items-center justify-between">
            <span className="text-[10px] font-black opacity-70">시행일: 2025.10.29 (전산 적용)</span>
            <span className="text-[10px] font-black text-[#ccdb00]">DSR 50% 必 충족</span>
          </div>
        </section>
      </div>

      {/* Mandatory Duties Summary */}
      <section className="bg-[#00479d] p-6 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none">
          <ClipboardList className="w-32 h-32" />
        </div>
        <div className="relative z-10">
          <h3 className="text-lg font-black flex items-center gap-2 mb-4">
             <Info className="w-5 h-5 text-[#ccdb00]" /> 실수요자 의무 및 사후관리
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="p-4 bg-white/10 rounded-2xl border border-white/20">
                <p className="text-[11px] font-black text-[#ccdb00] mb-1">처분 조건부</p>
                <p className="text-[13px] font-bold">대출 실행 후 6개월 내 기존 주택 처분 및 등기이전 완료</p>
              </div>
              <div className="p-4 bg-white/10 rounded-2xl border border-white/20">
                <p className="text-[11px] font-black text-[#ccdb00] mb-1">전입 의무</p>
                <p className="text-[13px] font-bold">수도권 무주택자 구입자금 시 6개월 내 대상 주택 전입</p>
              </div>
            </div>
            <div className="bg-rose-500/20 p-5 rounded-2xl border border-rose-500/30 flex items-center gap-4">
               <AlertCircle className="w-10 h-10 text-rose-300 shrink-0" />
               <div>
                  <p className="text-[12px] font-black text-rose-100">위반 시 제재</p>
                  <p className="text-[13px] font-bold text-white">즉시 기한이익 상실(상환 청구) 및 향후 3년간 주택관련대출 취급 제한</p>
               </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RegulationSummary1015;
