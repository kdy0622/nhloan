
import React from 'react';
import { ExternalLink, RotateCcw, AlertCircle } from 'lucide-react';

const RealEstateTaxCalc: React.FC = () => {
  return (
    <div className="w-full h-[calc(100vh-10rem)] bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 flex flex-col animate-in zoom-in-95 duration-500">
      {/* Control Header */}
      <div className="bg-slate-50 px-4 py-3 border-b flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-[11px] font-black text-slate-500 uppercase tracking-tight">
            부동산계산기.com 외부 서비스 실시간 연결
          </span>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => window.location.reload()}
            className="flex items-center gap-1 text-[10px] font-black text-slate-400 hover:text-slate-600 transition-colors"
          >
            <RotateCcw className="w-3 h-3" /> 새로고침
          </button>
          <a 
            href="https://xn--989a00af8jnslv3dba.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#008e46] text-white rounded-lg text-[11px] font-black hover:bg-[#007036] transition-all shadow-sm"
          >
            외부 브라우저에서 열기 <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 relative bg-slate-100">
        <iframe 
          src="https://xn--989a00af8jnslv3dba.com/" 
          className="absolute inset-0 w-full h-full border-none"
          title="부동산 계산기 서비스"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
        
        {/* Fallback Overlay (shown briefly or if iframe is clearly empty/blocked) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 hover:opacity-100 transition-opacity">
          <div className="bg-white/90 backdrop-blur p-4 rounded-xl shadow-lg border flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-500" />
            <p className="text-xs font-bold text-slate-600">
              콘텐츠가 보이지 않을 경우 우측 상단 '외부 브라우저에서 열기'를 클릭하세요.
            </p>
          </div>
        </div>
      </div>
      
      {/* Footer Info */}
      <div className="px-4 py-2 bg-slate-50 border-t text-[10px] font-bold text-slate-400 flex justify-between items-center">
        <span>본 서비스는 외부 사이트(부동산계산기.com)의 정보를 활용합니다.</span>
        <span>NH 여신 실무 통합 도구</span>
      </div>
    </div>
  );
};

export default RealEstateTaxCalc;
