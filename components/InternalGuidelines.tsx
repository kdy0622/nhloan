
import React, { useState } from 'react';
import { 
  ShieldCheck, 
  MapPin, 
  UserCheck, 
  Landmark, 
  Scaling, 
  CheckSquare,
  BadgePercent,
  Star,
  Zap,
  Info,
  Gift,
  ArrowRight
} from 'lucide-react';
import { 
  SMALL_DEPOSIT_PROTECTION, 
  APPROVAL_AUTHORITIES,
  INTEREST_RATES,
  SPECIAL_RATES_DATA,
  RTI_RATIOS,
  ADD_ON_RATES
} from '../constants';

type TabType = 'rates' | 'authority' | 'deposits' | 'rti';

const InternalGuidelines: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('rates');

  const tabs = [
    { id: 'rates', label: '적용 금리', icon: BadgePercent },
    { id: 'authority', label: '직무 전결권', icon: UserCheck },
    { id: 'deposits', label: '임차보증금', icon: MapPin },
    { id: 'rti', label: 'RTI/상향', icon: Scaling },
  ];

  return (
    <div className="space-y-10 animate-in slide-in-from-bottom-10 duration-700 pb-20 font-medium">
      <header className="flex items-center justify-between">
        <h2 className="text-4xl font-black text-slate-900 flex items-center gap-5 tracking-tight">
          <ShieldCheck className="w-12 h-12 text-[#008e46]" />
          NH 여신 실무 통합 지침 (2026.02)
        </h2>
        <div className="text-right hidden md:block">
           <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Update: 2026-02-05</p>
           <p className="text-sm font-black text-[#00479d]">신규 가산금리 지침 반영 완료</p>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex p-2.5 bg-white rounded-[2.5rem] shadow-2xl border-2 border-slate-100 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            className={`flex-1 min-w-[140px] flex items-center justify-center gap-3 py-5 rounded-[2rem] font-black text-base transition-all duration-300 ${
              activeTab === tab.id 
                ? 'bg-[#00479d] text-white shadow-xl scale-105' 
                : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <tab.icon className="w-6 h-6" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="space-y-10">
        {activeTab === 'rates' && (
          <div className="space-y-12 animate-in fade-in zoom-in-95 duration-500">
            {/* NH SPECIAL RATES - HIGHLIGHTED */}
            <div className="bg-gradient-to-br from-[#00479d] via-[#003a8c] to-[#002d6b] rounded-[3rem] p-12 text-white shadow-2xl border-[8px] border-[#ccdb00]/30 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-10 opacity-15 rotate-12">
                  <Gift className="w-56 h-56 text-[#ccdb00]" />
               </div>
               <div className="relative z-10">
                  <div className="flex items-center gap-6 mb-10">
                     <div className="p-5 bg-[#ccdb00] rounded-[2rem] shadow-2xl shadow-[#ccdb00]/40">
                        <Zap className="w-10 h-10 text-[#00479d] animate-pulse" />
                     </div>
                     <div>
                        <h3 className="text-4xl font-black tracking-tighter text-[#ccdb00] mb-1">★ NH 여신 최저/특판 금리 가이드 ★</h3>
                        <p className="text-blue-100 font-bold text-lg">실무자 최우선 확인: 서울주택/교회신규 한도 관리 필수</p>
                     </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {SPECIAL_RATES_DATA.map((rate, i) => (
                      <div key={i} className="bg-white/10 backdrop-blur-xl border-2 border-white/15 p-8 rounded-[2rem] hover:bg-white/20 transition-all group shadow-lg">
                         <p className="text-[#ccdb00] text-sm font-black mb-3 uppercase tracking-widest">{rate.name}</p>
                         <div className="flex items-baseline gap-1">
                            <span className="text-5xl font-black tracking-tighter text-white group-hover:scale-110 transition-transform inline-block">{rate.rate.toFixed(2)}</span>
                            <span className="text-2xl font-bold text-white/80">%</span>
                         </div>
                         <div className="mt-5 h-2 w-full bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-[#ccdb00] w-full shadow-[0_0_10px_#ccdb00]"></div>
                         </div>
                      </div>
                    ))}
                  </div>
               </div>
            </div>

            {/* Standard Rates */}
            <div className="bg-white rounded-[3rem] border-2 border-slate-100 shadow-xl overflow-hidden">
              <div className="bg-slate-50 p-8 border-b-2 border-slate-100">
                <h3 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                  <BadgePercent className="w-7 h-7 text-[#00479d]" /> 담보별 표준 고시 금리
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50">
                    <tr className="border-b border-slate-100">
                      <th className="p-8 font-black text-slate-500 uppercase tracking-widest text-sm">여신 담보 항목</th>
                      <th className="p-8 font-black text-slate-500 uppercase tracking-widest text-sm text-right">최저 적용 금리</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 font-bold">
                    {INTEREST_RATES.map((rate, i) => (
                      <tr key={i} className="hover:bg-blue-50/50 transition-colors">
                        <td className="p-8 text-xl text-slate-900">{rate.category}</td>
                        <td className="p-8 text-right text-3xl font-black text-[#00479d]">{rate.rate.toFixed(2)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'authority' && (
          <div className="bg-white rounded-[3rem] border-2 border-slate-100 shadow-2xl overflow-hidden animate-in slide-in-from-right-10">
            <div className="bg-[#00479d] p-8 text-white font-black text-2xl flex items-center gap-4">
              <UserCheck className="w-8 h-8 text-[#ccdb00]" /> 농협 여신 직무 전결권 규정
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50">
                  <tr className="border-b border-slate-200">
                    <th className="p-8 font-black text-slate-500 uppercase text-sm">업무 내용 및 지역</th>
                    <th className="p-8 font-black text-slate-500 uppercase text-sm">한도 금액</th>
                    <th className="p-8 font-black text-slate-500 uppercase text-sm text-center">전결권자</th>
                  </tr>
                </thead>
                <tbody className="font-bold">
                  {APPROVAL_AUTHORITIES.map((auth, i) => (
                    <tr key={i} className="border-b border-slate-50 hover:bg-blue-50">
                      <td className="p-8">
                        <p className="text-xl text-slate-900">{auth.description}</p>
                        <p className="text-xs text-slate-400 mt-1">{auth.remarks}</p>
                      </td>
                      <td className="p-8 text-2xl font-black text-[#00479d]">{auth.limit}</td>
                      <td className="p-8 text-center">
                        <span className={`px-5 py-2 rounded-xl text-sm ${auth.authority === '지점장' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                          {auth.authority}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'deposits' && (
          <div className="bg-white rounded-[3rem] border-2 border-slate-100 shadow-2xl overflow-hidden animate-in fade-in">
             <div className="bg-[#008e46] p-8 text-white font-black text-2xl flex items-center gap-4">
               <MapPin className="w-8 h-8 text-[#ccdb00]" /> 지역별 소액임차보증금 (방공제)
             </div>
             <div className="overflow-x-auto">
               <table className="w-full text-left">
                 <thead className="bg-slate-50 font-black text-slate-500">
                   <tr><th className="p-8">지역 구분</th><th className="p-8 text-center">주택 공제</th><th className="p-8 text-center">상가 공제</th></tr>
                 </thead>
                 <tbody className="font-bold">
                   {SMALL_DEPOSIT_PROTECTION.map((item, i) => (
                     <tr key={i} className="border-b border-slate-50">
                       <td className="p-8">
                         <p className="text-xl text-slate-900">{item.region}</p>
                         <p className="text-xs text-slate-400 mt-1">{item.description}</p>
                       </td>
                       <td className="p-8 text-center text-3xl font-black text-blue-600">{item.housing.toLocaleString()}</td>
                       <td className="p-8 text-center text-3xl font-black text-emerald-600">{item.commercial.toLocaleString()}</td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          </div>
        )}

        {activeTab === 'rti' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 animate-in zoom-in-95">
            <div className="bg-white rounded-[3rem] border-2 border-slate-100 shadow-2xl p-10">
               <h3 className="text-2xl font-black text-[#00479d] mb-10 flex items-center gap-4">
                 <Scaling className="w-8 h-8" /> RTI (임대업 이자상환비율)
               </h3>
               <div className="space-y-6">
                 {RTI_RATIOS.map((rti, i) => (
                   <div key={i} className="flex justify-between items-center p-8 bg-slate-50 rounded-[2rem] border">
                      <span className="text-xl font-black">{rti.category}</span>
                      <span className="text-4xl font-black text-[#00479d]">{rti.ratio.toFixed(2)}배</span>
                   </div>
                 ))}
               </div>
            </div>
            <div className="bg-emerald-50 rounded-[3rem] border-2 border-emerald-100 p-10 shadow-xl">
               <h3 className="text-2xl font-black text-[#008e46] mb-8">담보상향 및 예외규정</h3>
               <ul className="space-y-6 font-bold text-emerald-900 text-lg">
                 <li className="flex gap-4"><ArrowRight className="w-6 h-6 shrink-0" /> 법원 낙찰률 10% 상향 시 가계담보 상향 가능</li>
                 <li className="flex gap-4"><ArrowRight className="w-6 h-6 shrink-0" /> 분할상환 약정 시 LTV 10%P 추가 가능</li>
                 <li className="flex gap-4"><ArrowRight className="w-6 h-6 shrink-0" /> 상업지역 우량상가는 감정가 5% 추가 검토</li>
               </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InternalGuidelines;
