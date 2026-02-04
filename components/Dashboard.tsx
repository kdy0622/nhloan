
import React from 'react';
import { 
  ArrowRight, 
  Calculator, 
  Landmark, 
  TrendingUp,
  ShieldCheck,
  AlertTriangle,
  Info
} from 'lucide-react';

interface DashboardProps {
  onViewChange: (view: any) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onViewChange }) => {
  return (
    <div className="space-y-4 animate-in fade-in duration-500 pb-10">
      <header className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">여신 실무 PRO</h1>
          <p className="text-slate-500 text-[11px] font-bold">2026.02 통합 지침 및 10.15 대책 반영</p>
        </div>
        <div className="bg-[#ccdb00] px-3 py-1 rounded-lg border border-[#008e46] text-[#00479d] font-black text-[10px]">
           UPDATE: 2026.02.05
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
          <div key={i} className="bg-white p-3 rounded-2xl border shadow-sm flex flex-col items-center">
            <m.icon className={`w-4 h-4 mb-1 opacity-20`} />
            <p className="text-[10px] font-black text-slate-400 uppercase">{m.label}</p>
            <h3 className={`text-lg font-black ${m.color}`}>{m.val}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Navigation Buttons */}
        <div className="space-y-3">
          <button onClick={() => onViewChange('loan-calc')}
            className="w-full flex items-center justify-between p-4 rounded-2xl bg-emerald-50 border border-emerald-100 hover:bg-emerald-100 transition-all group">
            <div className="flex items-center gap-3">
              <Calculator className="w-5 h-5 text-emerald-600" />
              <div className="text-left"><p className="font-black text-sm text-emerald-800">주담대 가능금액</p><p className="text-[10px] text-emerald-600 font-bold">실시간 규제 상한 적용</p></div>
            </div>
            <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-all" />
          </button>
          <button onClick={() => onViewChange('guidelines')}
            className="w-full flex items-center justify-between p-4 rounded-2xl bg-blue-50 border border-blue-100 hover:bg-blue-100 transition-all group">
            <div className="flex items-center gap-3">
              <Info className="w-5 h-5 text-blue-600" />
              <div className="text-left"><p className="font-black text-sm text-blue-800">실무 지침 가이드</p><p className="text-[10px] text-blue-600 font-bold">방공제/RTI/전결권</p></div>
            </div>
            <ArrowRight className="w-4 h-4 text-blue-400 group-hover:translate-x-1 transition-all" />
          </button>
        </div>

        {/* Notices */}
        <section className="bg-white rounded-2xl border p-4">
          <h2 className="font-black text-xs text-slate-900 mb-3 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-amber-500" /> 주요 유의사항</h2>
          <div className="space-y-2">
             <div className="p-2 bg-rose-50 rounded-lg border border-rose-100 text-[11px] font-bold text-rose-900">
               10.15 대책: 규제/수도권 생활안정자금 합산 1억 제한
             </div>
             <div className="p-2 bg-blue-50 rounded-lg border border-blue-100 text-[11px] font-bold text-blue-900">
               처분/전입 의무: 6개월 내 이행 필수 (미이행 시 제한)
             </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
