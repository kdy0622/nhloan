
import React from 'react';
// Added Calculator to the imported icons to fix the 'Cannot find name' error
import { CircleDollarSign, Info, Building2, ArrowRight, ExternalLink, Calculator } from 'lucide-react';

const RealEstateTaxCalc: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in zoom-in-95 duration-700 pb-20 font-medium">
      <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl border-2 border-slate-100 text-center">
        <div className="w-20 h-20 bg-emerald-100 text-[#008e46] rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
          <CircleDollarSign className="w-12 h-12" />
        </div>
        <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-6 break-keep">
          부동산 세금 및 정밀 계산기
        </h2>
        <p className="text-slate-500 font-bold text-lg mb-10 leading-relaxed break-keep">
          취득세, 양도세, 증여세 및 중개보수 등<br/>
          정밀한 부동산 관련 계산을 위해 전문 도구를 이용하세요.
        </p>

        <div className="grid grid-cols-1 gap-6">
          <a 
            href="https://xn--989a00af8jnslv3dba.com/#google_vignette" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group relative bg-gradient-to-br from-[#008e46] to-[#007036] text-white p-8 rounded-[2rem] font-black text-xl md:text-2xl hover:scale-105 transition-all shadow-2xl flex flex-col items-center gap-4 active:scale-95"
          >
            <div className="flex items-center gap-4">
              <Building2 className="w-10 h-10" />
              <span>부동산 계산기 (외부 사이트) 바로가기</span>
              <ExternalLink className="w-8 h-8 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </div>
          </a>
        </div>

        <div className="mt-12 p-8 bg-slate-50 rounded-[2rem] border-2 border-slate-100 text-left">
          <h3 className="text-xl font-black text-slate-800 mb-4 flex items-center gap-2">
            <Info className="w-6 h-6 text-[#00479d]" /> 이용 안내
          </h3>
          <ul className="space-y-4 text-slate-600 font-bold text-sm md:text-base">
            <li className="flex gap-3 items-start">
              <ArrowRight className="w-5 h-5 shrink-0 text-[#008e46] mt-0.5" />
              <span>외부 부동산 계산기 사이트(부동산 계산기.com)로 연결됩니다.</span>
            </li>
            <li className="flex gap-3 items-start">
              <ArrowRight className="w-5 h-5 shrink-0 text-[#008e46] mt-0.5" />
              <span>복잡한 취득세, 양도세, 증여세 등을 상세하게 계산할 수 있습니다.</span>
            </li>
            <li className="flex gap-3 items-start">
              <ArrowRight className="w-5 h-5 shrink-0 text-[#008e46] mt-0.5" />
              <span>결과값은 참고용으로만 활용하시고, 정확한 세액은 세무 상담을 권장합니다.</span>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="flex justify-center">
        <div className="flex items-center gap-2 text-slate-400 font-bold text-xs">
          <Calculator className="w-4 h-4" />
          <span>NH 여신 실무 도우미 - 부가 도구</span>
        </div>
      </div>
    </div>
  );
};

// Fix: Add default export to resolve the error in App.tsx on line 18
export default RealEstateTaxCalc;
