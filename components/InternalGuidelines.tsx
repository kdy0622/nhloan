
import React, { useState } from 'react';
import { 
  ShieldCheck, 
  MapPin, 
  UserCheck, 
  Scaling, 
  BadgePercent,
  Info,
  ArrowRight,
  AlertTriangle,
  FileText,
  TrendingUp,
  Activity,
  Star
} from 'lucide-react';
import { 
  SMALL_DEPOSIT_PROTECTION, 
  APPROVAL_AUTHORITIES,
  INTEREST_RATES,
  RTI_RATIOS,
  SENSITIVE_INDUSTRIES,
  UPSCALING_GUIDELINES,
  BRANCH_MANAGER_DISCOUNTS
} from '../constants';

type TabType = 'rates' | 'authority' | 'deposits' | 'rti-upscale' | 'regulation';

// Fix: Make children optional to resolve TypeScript mismatch in some environments where JSX children are not correctly inferred
const TableHeader = ({ children, className = "" }: { children?: React.ReactNode, className?: string }) => (
  <th className={`px-4 py-2 font-black text-slate-500 uppercase tracking-wider text-[11px] border-b ${className}`}>{children}</th>
);

// Fix: Make children optional to resolve TypeScript mismatch in some environments where JSX children are not correctly inferred
const TableCell = ({ children, className = "" }: { children?: React.ReactNode, className?: string }) => (
  <td className={`px-4 py-2.5 text-[13px] border-b border-slate-50 ${className}`}>{children}</td>
);

const InternalGuidelines: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('rates');

  const tabs = [
    { id: 'rates', label: '금리/가산', icon: BadgePercent },
    { id: 'authority', label: '전결권', icon: UserCheck },
    { id: 'deposits', label: '임차보증금', icon: MapPin },
    { id: 'rti-upscale', label: 'RTI/상향', icon: Scaling },
    { id: 'regulation', label: '건전여신/업종', icon: Activity },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <header className="flex items-center justify-between border-b pb-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3 tracking-tight">
            <ShieldCheck className="w-8 h-8 text-[#008e46]" />
            NH 여신 실무 지침서 (2026.02)
          </h2>
          <p className="text-[11px] font-bold text-slate-500 mt-1">여신 최저금리 4.7% 기준 | 교회신규 특판 4.3%</p>
        </div>
        <div className="text-right hidden md:block">
           <span className="px-3 py-1 bg-blue-100 text-[#00479d] rounded-lg font-black text-[10px] border border-blue-200 uppercase">INTERNAL ONLY</span>
        </div>
      </header>

      {/* High Density Tabs */}
      <div className="flex p-1.5 bg-white rounded-2xl shadow-md border border-slate-200 overflow-x-auto no-scrollbar gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            className={`flex-1 min-w-[100px] flex items-center justify-center gap-2 py-2.5 rounded-xl font-black text-[13px] transition-all ${
              activeTab === tab.id 
                ? 'bg-[#00479d] text-white shadow-lg' 
                : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {activeTab === 'rates' && (
          <div className="space-y-6 animate-in zoom-in-95 duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Standard Rates */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="bg-slate-50 px-4 py-3 border-b flex justify-between items-center">
                  <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
                    <BadgePercent className="w-4 h-4 text-[#00479d]" /> 담보별 최저금리 (전부합산)
                  </h3>
                </div>
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50/50">
                      <TableHeader>여신 담보 항목</TableHeader>
                      <TableHeader>최저금리</TableHeader>
                    </tr>
                  </thead>
                  <tbody className="font-bold">
                    {INTEREST_RATES.map((rate, i) => (
                      <tr key={i} className="hover:bg-blue-50/30">
                        <TableCell className={rate.category.includes('교회') ? 'text-[#008e46]' : ''}>{rate.category}</TableCell>
                        <TableCell className={`text-right font-black ${rate.category.includes('교회') ? 'text-[#008e46]' : 'text-[#00479d]'}`}>{rate.rate.toFixed(2)}%</TableCell>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* 영업점장 우대금리 */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="bg-[#ccdb00]/20 px-4 py-3 border-b flex items-center gap-2">
                  <Star className="w-4 h-4 text-[#008e46]" />
                  <h3 className="text-sm font-black text-slate-800">영업점장 우대금리</h3>
                </div>
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50/50">
                      <TableHeader>우대 항목</TableHeader>
                      <TableHeader>우대폭</TableHeader>
                    </tr>
                  </thead>
                  <tbody className="font-bold">
                    {BRANCH_MANAGER_DISCOUNTS.map((disc, i) => (
                      <tr key={i} className="hover:bg-emerald-50/30">
                        <TableCell>{disc.category}</TableCell>
                        <TableCell className="text-right text-emerald-600 font-black">{disc.value}</TableCell>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Additional Add-on Rates */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="bg-slate-50 px-4 py-3 border-b">
                <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#008e46]" /> 가감산금리 및 수수료 지침
                </h3>
              </div>
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-[12px] font-bold">
                <div className="flex justify-between border-b pb-1"><span>1. 모집수수료 (법인 0.2%, 부동산 0.1%)</span><span className="text-[#008e46]">+0.1~0.2%</span></div>
                <div className="flex justify-between border-b pb-1"><span>2. MCI 가입 시</span><span className="text-[#008e46]">+0.1%</span></div>
                <div className="flex justify-between border-b pb-1"><span>3. 한도거래 대출 (마이너스통장)</span><span className="text-[#008e46]">+0.2%</span></div>
                <div className="flex justify-between border-b pb-1"><span>4. 비조합원 대출</span><span className="text-[#008e46]">+0.1%</span></div>
                <div className="flex justify-between border-b pb-1"><span>5. CSS 4~5등급 가산</span><span className="text-[#008e46]">+0.1%</span></div>
                <div className="flex justify-between border-b pb-1"><span>6. CSS 6~7등급 가산</span><span className="text-[#008e46]">+0.2%</span></div>
                <div className="flex justify-between border-b pb-1"><span>7. CSS 8등급 이상 가산</span><span className="text-[#008e46]">+0.3%</span></div>
                <div className="flex justify-between border-b pb-1"><span>8. 기업신용등급 (5B~6A 0.1, 6B 0.2)</span><span className="text-[#008e46]">+0.1~0.2%</span></div>
                <div className="flex justify-between border-b pb-1"><span>9. 중도상환(가계): 고정 1.08% / 변동 1.16%</span><span className="text-rose-500">2026.01.01</span></div>
                <div className="flex justify-between border-b pb-1"><span>10. 기업한도 약정수수료</span><span className="text-rose-500">0.5%</span></div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'authority' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in slide-in-from-right-5">
            <div className="bg-[#00479d] px-4 py-3 text-white font-black text-sm flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-[#ccdb00]" /> 직무범위규정 (전결권)
            </div>
            <table className="w-full text-left">
              <thead className="bg-slate-50">
                <tr>
                  <TableHeader>업무 내용 및 소재지</TableHeader>
                  <TableHeader>금액</TableHeader>
                  <TableHeader>전결권</TableHeader>
                </tr>
              </thead>
              <tbody className="font-bold">
                {APPROVAL_AUTHORITIES.map((auth, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <TableCell>
                      <span className="block text-slate-900">{auth.description}</span>
                      <span className="block text-[10px] text-slate-400">{auth.remarks}</span>
                    </TableCell>
                    <TableCell className="text-[#00479d]">{auth.limit}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-0.5 rounded-lg text-[10px] ${auth.authority === '지점장' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                        {auth.authority}
                      </span>
                    </TableCell>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'deposits' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in">
             <div className="bg-[#008e46] px-4 py-3 text-white font-black text-sm">지역별 소액임차보증금 (시행 2023.02.21)</div>
             <table className="w-full text-left">
               <thead>
                 <tr className="bg-slate-50">
                   <TableHeader>지역 구분</TableHeader>
                   <TableHeader className="text-center">주택</TableHeader>
                   <TableHeader className="text-center">상가</TableHeader>
                 </tr>
               </thead>
               <tbody className="font-bold">
                 {SMALL_DEPOSIT_PROTECTION.map((item, i) => (
                   <tr key={i} className="hover:bg-slate-50">
                     <TableCell>
                       <span className="block">{item.region}</span>
                       <span className="block text-[10px] text-slate-400">{item.description}</span>
                     </TableCell>
                     <TableCell className="text-center text-blue-600">{item.housing.toLocaleString()}원</TableCell>
                     <TableCell className="text-center text-emerald-600">{item.commercial.toLocaleString()}원</TableCell>
                   </tr>
                 ))}
               </tbody>
             </table>
             <div className="p-3 bg-slate-50 border-t text-[11px] text-slate-500 font-bold">
               * 수입인지: 5천~1억(7만), 10억이하(15만), 10억초과(35만) [50% 부담]
             </div>
          </div>
        )}

        {activeTab === 'rti-upscale' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in zoom-in-95">
            {/* RTI */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
               <h3 className="text-sm font-black text-[#00479d] mb-4 flex items-center gap-2">RTI 및 예외 규정</h3>
               <div className="space-y-2 mb-4">
                 {RTI_RATIOS.map((rti, i) => (
                   <div key={i} className="flex justify-between p-3 bg-slate-50 rounded-xl text-[13px] font-bold border">
                      <span>{rti.category}</span>
                      <span className="text-[#00479d] font-black">{rti.ratio.toFixed(2)}배</span>
                   </div>
                 ))}
               </div>
               <div className="p-3 bg-blue-50 rounded-xl text-[11px] font-bold text-blue-800 leading-relaxed">
                 <p>• RTI 배제: 1억 이하 소액, 상속/채권보전을 위한 인수</p>
                 <p>• 예외승인: 주택 1배, 비주택 1.2배 이상 시 소득증빙 가능할 경우 대심위 승인</p>
                 <p className="text-rose-600">• 투기/과열지구 주택임대 RTI 1.5배 미만 취급불가</p>
               </div>
            </div>
            {/* Upscaling */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
               <h3 className="text-sm font-black text-[#008e46] mb-4">담보상향 및 감정가 특례</h3>
               <div className="grid grid-cols-2 gap-2">
                 {UPSCALING_GUIDELINES.map((guide, i) => (
                   <div key={i} className="p-3 bg-emerald-50 rounded-xl text-center border border-emerald-100">
                      <p className="text-[10px] text-emerald-600 font-bold">{guide.title}</p>
                      <p className="text-[14px] text-emerald-900 font-black">{guide.value}</p>
                   </div>
                 ))}
               </div>
               <div className="mt-4 p-3 bg-slate-50 rounded-xl text-[11px] font-bold text-slate-500">
                 * 공동대출/미분양 상향불가 | 감정서 사용: 주택 5년, 기타 3년
               </div>
            </div>
          </div>
        )}

        {activeTab === 'regulation' && (
          <div className="space-y-6 animate-in slide-in-from-bottom-5">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
               <div className="bg-rose-50 px-4 py-3 border-b flex items-center gap-2">
                 <AlertTriangle className="w-4 h-4 text-rose-500" />
                 <h3 className="text-sm font-black text-rose-800">2026년 건전여신 규제 (서울 규제 강화)</h3>
               </div>
               <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-[12px] font-bold">
                 <div className="space-y-2">
                   <p className="flex items-center gap-2"><ArrowRight className="w-3 h-3 text-rose-500" /> 서울 외 LTV 상향 취급 불가</p>
                   <p className="flex items-center gap-2"><ArrowRight className="w-3 h-3 text-rose-500" /> 서울 소재 취급제한: 신축분양 집합상가, 지산, 임야</p>
                 </div>
                 <div className="space-y-2">
                   <p className="flex items-center gap-2"><ArrowRight className="w-3 h-3 text-rose-500" /> 비수도권 집합건물/임야 1억 초과 시 본점 승인</p>
                   <p className="flex items-center gap-2"><ArrowRight className="w-3 h-3 text-rose-500" /> 미분양 집합건물(신축포함) 예외승인 불가</p>
                 </div>
               </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
               <div className="bg-slate-50 px-4 py-3 border-b">
                 <h3 className="text-sm font-black text-slate-800">경기민감업종 (제한 및 유의 업종)</h3>
               </div>
               <div className="p-4 flex flex-wrap gap-2">
                 {SENSITIVE_INDUSTRIES.map((industry, i) => (
                   <span key={i} className="px-2 py-1 bg-slate-100 text-slate-600 rounded-lg text-[11px] font-bold border border-slate-200">
                     {industry}
                   </span>
                 ))}
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InternalGuidelines;
