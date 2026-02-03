
import React, { useState } from 'react';
import { CircleDollarSign, Info, Building2, ArrowRight } from 'lucide-react';

const RealEstateTaxCalc: React.FC = () => {
  const [dealAmount, setDealAmount] = useState<number>(0);
  const [propertyType, setPropertyType] = useState<'house' | 'other'>('house');
  
  const acquisitionTaxRate = propertyType === 'house' 
    ? (dealAmount <= 600000000 ? 0.01 : dealAmount <= 900000000 ? 0.02 : 0.03)
    : 0.04;
  
  const tax = dealAmount * acquisitionTaxRate;
  const brokerageFee = dealAmount * 0.004;

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in zoom-in-95 duration-700 pb-20 font-medium">
      <div className="bg-white p-12 rounded-[2.5rem] shadow-2xl border-2 border-slate-100">
        <h2 className="text-3xl font-black text-slate-900 mb-10 flex items-center gap-4">
          <CircleDollarSign className="w-10 h-10 text-[#008e46]" />
          부동산 세금 및 중개보수 간이 계산
        </h2>

        <div className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-4">
              <label className="block text-xs font-black text-slate-500 uppercase tracking-widest">거래 금액 (원)</label>
              <input 
                type="number"
                value={dealAmount || ''}
                onChange={(e) => setDealAmount(Number(e.target.value))}
                placeholder="매매가 또는 보증금"
                className="w-full px-8 py-5 bg-slate-50 rounded-[1.5rem] border-2 border-transparent focus:border-[#008e46] focus:ring-4 focus:ring-emerald-50 text-2xl font-black transition-all outline-none"
              />
            </div>
            <div className="space-y-4">
              <label className="block text-xs font-black text-slate-500 uppercase tracking-widest">부동산 유형</label>
              <div className="flex p-2 bg-slate-100 rounded-[1.5rem] h-[74px]">
                <button 
                  onClick={() => setPropertyType('house')}
                  className={`flex-1 py-3 rounded-[1.25rem] font-black text-lg transition-all ${propertyType === 'house' ? 'bg-white text-[#008e46] shadow-md scale-105' : 'text-slate-500 hover:bg-white/50'}`}
                >
                  주택
                </button>
                <button 
                  onClick={() => setPropertyType('other')}
                  className={`flex-1 py-3 rounded-[1.25rem] font-black text-lg transition-all ${propertyType === 'other' ? 'bg-white text-[#008e46] shadow-md scale-105' : 'text-slate-500 hover:bg-white/50'}`}
                >
                  비주택
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
            <div className="p-8 bg-slate-50 rounded-[2rem] border-2 border-slate-100 shadow-sm text-center">
              <p className="text-slate-500 text-xs mb-2 font-black uppercase tracking-[0.2em]">예상 취득세 ({ (acquisitionTaxRate * 100).toFixed(1) }%)</p>
              <h4 className="text-3xl font-black text-slate-900">{tax.toLocaleString()} <span className="text-sm">원</span></h4>
              <p className="text-[10px] text-slate-400 mt-4 font-bold">지방교육세, 농어촌특별세 별도 산출 필요</p>
            </div>

            <div className="p-8 bg-slate-50 rounded-[2rem] border-2 border-slate-100 shadow-sm text-center">
              <p className="text-slate-500 text-xs mb-2 font-black uppercase tracking-[0.2em]">최대 중개보수</p>
              <h4 className="text-3xl font-black text-slate-900">{brokerageFee.toLocaleString()} <span className="text-sm">원</span></h4>
              <p className="text-[10px] text-slate-400 mt-4 font-bold">부가가치세 별도, 상한 요율 기준</p>
            </div>
          </div>

          <div className="bg-emerald-50 p-8 rounded-[2rem] border-2 border-emerald-100 flex gap-6 items-center">
            <Info className="w-10 h-10 text-[#008e46] shrink-0" />
            <div className="text-sm text-emerald-900 leading-relaxed font-bold">
              <p className="text-lg font-black mb-2">계산 결과 유의사항</p>
              <p>위 산출액은 법령상 기본 요율을 적용한 간이 결과입니다. 생애최초 감면, 다주택자 중과세 등 상세 세액은 전문 부동산 사이트를 통해 확인하시기 바랍니다.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-[#00479d] to-[#003575] rounded-[2.5rem] p-12 text-white shadow-2xl overflow-hidden relative">
        <div className="absolute bottom-0 right-0 p-8 opacity-10">
           <Building2 className="w-48 h-48" />
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">
          <div className="text-center md:text-left space-y-4">
            <h3 className="text-3xl font-black flex items-center gap-3 justify-center md:justify-start">
              <Building2 className="w-10 h-10 text-[#ccdb00]" />
              전문 부동산 계산기 활용
            </h3>
            <p className="text-blue-200 text-lg font-bold">양도세, 증여세, 보유세 등 정밀한 세금 시뮬레이션이 가능합니다.</p>
          </div>
          <a 
            href="https://xn--989a00af8jnslv3dba.com/#google_vignette" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group relative bg-white text-[#00479d] px-12 py-6 rounded-3xl font-black text-2xl hover:bg-[#ccdb00] hover:text-[#00479d] transition-all shadow-2xl flex items-center gap-4 active:scale-95 whitespace-nowrap"
          >
            부동산계산기.com 이동
            <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default RealEstateTaxCalc;
