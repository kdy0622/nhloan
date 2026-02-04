
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { MessageSquareText, Send, Bot, User, Loader2, Info, Key, AlertCircle, RefreshCw } from 'lucide-react';

const AiInquiry: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([
    { role: 'assistant', content: 'NH농협 여신 실무 전문 AI입니다. 10.15 대책(수도권 한도 상한 및 생활안정자금 규제)과 관련된 실무 지침을 상세히 답변해 드립니다.' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorStatus, setErrorStatus] = useState<'NONE' | 'KEY_REQUIRED' | 'ERROR'>('NONE');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isLoading]);

  // API 키 선택 창 호출 함수
  const handleSelectKey = async () => {
    if (window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
      await window.aistudio.openSelectKey();
      // 키 선택 후 상태 초기화
      setErrorStatus('NONE');
    } else {
      alert('API 키 선택 기능을 사용할 수 없는 환경입니다.');
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);
    setErrorStatus('NONE');

    try {
      // 매 호출 시 최신 API 키 반영을 위해 인스턴스 새로 생성
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMessage,
        config: {
          systemInstruction: `당신은 NH농협은행의 최고 여신 심사역입니다. 다음 지침을 엄격히 준수하여 답변하세요:
          1. 10.15 대책 핵심: 수도권 구입자금 상한액 (15억 이하 6억, 15~25억 4억, 25억 초과 2억)
          2. 생활안정자금: 수도권/규제지역 인별 합산 1억 제한
          3. DSR: 수도권 스트레스 금리 3.0% 가산 필수 적용
          4. 답변 형식: 별표(*)를 절대 사용하지 마십시오. 번호(1., 2.)와 줄바꿈을 사용하여 가독성 있게 설명하십시오.
          5. 전문성: 항상 농협 여신 업무 지침에 근거하여 신뢰감 있는 어조를 유지하십시오.`,
          temperature: 0.1, // 일관성 있는 전문 답변을 위해 온도를 낮춤
        }
      });

      const reply = response.text;
      
      if (reply) {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: reply.replace(/\*/g, '').trim() 
        }]);
      } else {
        throw new Error("Empty response");
      }
    } catch (error: any) {
      console.error('AI API Error:', error);
      const errorMsg = error.message || '';
      
      // "Requested entity was not found" 또는 404/401 에러 시 키 선택 유도
      if (errorMsg.includes('entity was not found') || errorMsg.includes('404') || errorMsg.includes('API_KEY')) {
        setErrorStatus('KEY_REQUIRED');
      } else {
        setErrorStatus('ERROR');
      }

      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: '요청을 처리하는 중에 오류가 발생했습니다. 상단의 [API 키 재설정] 버튼을 눌러 권한이 있는 API 키를 다시 선택해 주시기 바랍니다.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] md:h-[calc(100vh-14rem)] animate-in fade-in duration-500">
      {/* Header with Connection Status */}
      <div className="bg-white p-4 md:p-6 rounded-t-[2.5rem] border-2 border-slate-100 shadow-xl flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-100 rounded-2xl text-[#00479d]">
            <MessageSquareText className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight break-keep">규제 지침 AI 상담원</h2>
            <div className="flex items-center gap-2 mt-0.5">
               <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
               <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Gemini 3 Pro Engine Connected</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
           {errorStatus !== 'NONE' && (
             <button 
               onClick={handleSelectKey}
               className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-xl text-[11px] font-black hover:bg-rose-700 transition-all shadow-lg animate-pulse"
             >
               <Key className="w-4 h-4" /> API 키 재설정
             </button>
           )}
           <div className={`hidden sm:flex px-4 py-2 rounded-xl text-[10px] font-black items-center gap-2 border ${
             errorStatus === 'NONE' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'
           }`}>
             {errorStatus === 'NONE' ? 'STABLE_CONNECTION' : 'CONNECTION_LOST'}
           </div>
        </div>
      </div>

      {/* Message Area */}
      <div 
        ref={scrollRef}
        className="flex-1 bg-slate-50/50 p-4 md:p-8 overflow-y-auto space-y-6 border-x-2 border-slate-100 no-scrollbar"
      >
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
            <div className={`max-w-[92%] md:max-w-[80%] flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${msg.role === 'user' ? 'bg-[#008e46]' : 'bg-[#00479d]'}`}>
                {msg.role === 'user' ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-[#ccdb00]" />}
              </div>
              <div className={`p-5 rounded-3xl font-bold text-[13px] md:text-sm shadow-sm leading-relaxed break-keep whitespace-pre-wrap ${
                msg.role === 'user' 
                  ? 'bg-white text-slate-800 rounded-tr-none border border-emerald-100' 
                  : 'bg-[#00479d] text-white rounded-tl-none border border-blue-900'
              }`}>
                {msg.content}
              </div>
            </div>
          </div>
        ))}
        
        {errorStatus === 'KEY_REQUIRED' && (
          <div className="flex justify-center p-6">
            <div className="bg-white border-2 border-rose-100 p-6 rounded-3xl flex flex-col items-center gap-4 max-w-sm text-center shadow-2xl">
              <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-rose-500" />
              </div>
              <div>
                <h4 className="text-base font-black text-rose-900">서버 권한 인증이 필요합니다</h4>
                <p className="text-[12px] font-bold text-rose-700 mt-2 leading-relaxed">
                  현재 설정된 API 키의 할당량이 초과되었거나 유효하지 않습니다. 유료 프로젝트가 연결된 개인 API 키를 선택해 주세요.
                </p>
              </div>
              <button 
                onClick={handleSelectKey}
                className="w-full py-3.5 bg-rose-600 text-white rounded-2xl text-sm font-black shadow-xl hover:bg-rose-700 transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <Key className="w-5 h-5" /> API 키 선택하여 복구
              </button>
              <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="text-[11px] text-slate-400 underline font-bold hover:text-slate-600 transition-colors">
                구글 클라우드 빌링 설정 가이드
              </a>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="flex justify-start">
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#00479d] flex items-center justify-center shrink-0 shadow-lg">
                <Loader2 className="w-5 h-5 text-[#ccdb00] animate-spin" />
              </div>
              <div className="bg-slate-200/50 p-5 rounded-3xl rounded-tl-none animate-pulse text-slate-500 font-black text-xs">
                여신 지침 데이터베이스를 분석하고 있습니다...
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Field */}
      <div className="bg-white p-4 md:p-8 rounded-b-[2.5rem] border-2 border-slate-100 shadow-xl shrink-0">
        <form onSubmit={handleSend} className="relative group">
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading || errorStatus === 'KEY_REQUIRED'}
            placeholder={errorStatus === 'KEY_REQUIRED' ? "API 키를 먼저 설정해 주세요" : "예: 20억 아파트 주담대 한도 알려줘"}
            className={`w-full bg-slate-50 border-2 rounded-2xl pl-6 pr-16 py-5 md:py-6 font-bold text-sm md:text-base outline-none transition-all ${
              errorStatus !== 'NONE' 
                ? 'border-rose-100 focus:border-rose-300' 
                : 'border-slate-100 focus:border-[#00479d] focus:ring-8 focus:ring-blue-50'
            }`}
          />
          <button 
            type="submit"
            disabled={isLoading || !input.trim() || errorStatus === 'KEY_REQUIRED'}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 bg-[#00479d] text-[#ccdb00] rounded-2xl flex items-center justify-center shadow-2xl hover:bg-blue-800 transition-all disabled:opacity-50 disabled:scale-95 active:scale-90"
          >
            <Send className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </form>
        <div className="mt-4 flex items-center gap-3 text-[10px] md:text-[11px] text-slate-400 font-bold justify-center break-keep">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 rounded-full border border-slate-100">
            <Info className="w-3.5 h-3.5 text-blue-500" /> 10.15 대책(구입자금 상한) 자동 적용 상담 모드
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 rounded-full border border-slate-100 hover:bg-slate-100 transition-colors"
          >
            <RefreshCw className="w-3 h-3 text-emerald-500" /> 대화 리셋
          </button>
        </div>
      </div>
    </div>
  );
};

export default AiInquiry;
