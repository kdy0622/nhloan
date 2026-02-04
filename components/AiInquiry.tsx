
import React, { useEffect } from 'react';

// 이 컴포넌트는 더 이상 직접 렌더링되지 않으며, App.tsx에서 외부 링크로 연결됩니다.
const AiInquiry: React.FC = () => {
  useEffect(() => {
    window.location.href = "https://gemini.google.com/gem/1mscxQ0VVmKOkXr8POixiGAV935uGVm35?usp=sharing";
  }, []);

  return (
    <div className="flex items-center justify-center h-64 text-slate-400 font-bold">
      농협 전용 Gemini AI로 이동 중입니다...
    </div>
  );
};

export default AiInquiry;
