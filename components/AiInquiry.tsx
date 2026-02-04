
import { GoogleGenAI } from "@google/genai";
import { 
  AlertCircle, 
  Bot, 
  ChevronRight, 
  Key, 
  Loader2, 
  MessageSquare, 
  RefreshCw, 
  Send, 
  ShieldCheck, 
  User, 
  Zap 
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

const AiInquiry: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([
    { 
      role: 'assistant', 
      content: '안녕하십니까, 농협 여신 담당자님. **농협 여신 실무 지원 AI**입니다.\n\n현장에서 혼선이 많은 **10.15 대출수요 관리 강화방안**을 비롯하여, 주택구입자금 한도 상한 및 생활안정자금 규제 지침을 완벽히 숙지하고 있습니다.\n\n상담이 필요하신 대출 조건이나 규제 해석에 대해 문의해 주시면 즉시 가이드를 제공해 드리겠습니다.' 
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [needsKey, setNeedsKey] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 로컬 저장소 또는 환경 변수에서 키 확인
  useEffect(() => {
    const checkKeyStatus = async () => {
      const hasEnvKey = !!process.env.API_KEY;
      let hasSelectedKey = false;
      
      if (window.aistudio?.hasSelectedApiKey) {
        hasSelectedKey = await window.aistudio.hasSelectedApiKey();
      }

      if (!hasEnvKey && !hasSelectedKey) {
        setNeedsKey(true);
      } else {
        setNeedsKey(false);
      }
    };
    checkKeyStatus();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleConnectKey = async () => {
    if (window.aistudio?.openSelectKey) {
      await window.aistudio.openSelectKey();
      // 키 선택 후 즉시 사용 가능하도록 상태 업데이트
      setNeedsKey(false);
    } else {
      alert("API 키 연동 기능을 지원하지 않는 환경입니다. 관리자에게 문의하세요.");
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      // 매 호출마다 새로운 인스턴스를 생성하여 최신 선택된 키를 반영
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMessage,
        config: {
          systemInstruction: `당신은 농협은행의 수석 여신 심사역입니다. 
          농협 여신 담당자님들에게 10.15 대책을 포함한 대출 지침을 정확하고 전문적으로 안내하는 역할을 수행합니다.

          [실무 핵심 지침 - 10.15 대책]
          1. 수도권/규제지역 구입자금 상한: 시가 15억 이하(6억), 15~25억(4억), 25억 초과(2억). 이주비는 가격 무관 6억 상한.
          2. 생활안정자금: 수도권/규제지역 인별 합산 1억(100백만원) 제한. 2주택 이상 세대는 원칙적 취급 불가.
          3. DSR: 수도권/규제지역 스트레스 금리 2단계(3.0% 가산) 적용 필수.
          4. 사후관리: 처분/전입 의무 6개월 내 이행 여부 점검 필수.

          [답변 스타일 가이드]
          - 답변은 첫 줄부터 핵심 내용이 나오도록 군더더기 없이 작성하세요.
          - "농협 여신 담당자님" 호칭을 사용하고 정중한 전문 용어를 사용하세요.
          - 모든 수치는 명확하게 단위를 표기하고 가독성 있게 줄바꿈을 활용하세요.`,
          temperature: 0.1,
        }
      });

      const reply = response.text;
      if (reply) {
        setMessages(prev => [...prev, { role: 'assistant', content: reply.replace(/\*/g, '').trim() }]);
      } else {
        throw new Error("EMPTY_RESPONSE");
      }
    } catch (error: any) {
      console.error('AI Error:', error);
      if (error.message?.includes("entity was not found") || error.message?.includes("API Key")) {
        setNeedsKey(true);
      }
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: '현재 지침 엔진과의 통신이 원활하지 않습니다. 하단의 [API 키 연결하기] 버튼을 통해 키를 다시 연동해 주십시오.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] md:h-[calc(100vh-12rem)] animate-in fade-in duration-700 bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-slate-50 flex items-center justify-between shrink-0 bg-white/80 backdrop-blur-xl z-20">
        <div className="flex items-center gap-4">
          <div className="p-2.5 bg-[#00479d] rounded-xl text-white shadow-lg">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-800 tracking-tight">농협 여신 실무 지원 AI</h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`w-2 h-2 rounded-full ${needsKey ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500 animate-pulse'}`}></span>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                {needsKey ? 'API DISCONNECTED' : '10.15 Regulation Guide Active'}
              </p>
            </div>
          </div>
        </div>
        
        <button 
          onClick={() => setMessages([{ role: 'assistant', content: '문의 내용을 다시 입력해 주시면 상담을 시작합니다.' }])} 
          className="p-2 text-slate-300 hover:text-blue-600 transition-colors"
          title="대화 초기화"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      {/* Chat Area */}
      <div ref={scrollRef} className="flex-1 bg-[#fcfdfe] p-4 md:p-8 overflow-y-auto space-y-6 no-scrollbar scroll-smooth">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
            <div className={`max-w-[95%] md:max-w-[85%] flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border shadow-sm ${
                msg.role === 'user' ? 'bg-[#008e46] border-[#008e46]' : 'bg-white border-slate-100'
              }`}>
                {msg.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-[#00479d]" />}
              </div>
              <div className={`relative px-5 py-3.5 pt-3 rounded-[1.25rem] font-bold text-[15px] md:text-[16px] leading-relaxed break-keep shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-[#00479d] text-white rounded-tr-none' 
                  : 'bg-white text-slate-700 rounded-tl-none border border-slate-100'
              }`}>
                <div className="whitespace-pre-wrap">{msg.content}</div>
                {msg.role === 'assistant' && i === messages.length - 1 && !isLoading && (
                   <div className="mt-3 pt-3 border-t border-slate-50 flex items-center justify-between">
                     <span className="text-[9px] text-slate-300 font-bold uppercase tracking-tighter">NH 여신 실무 통합 지원</span>
                     <div className="flex gap-1">
                        <span className="px-1.5 py-0.5 bg-slate-50 text-slate-400 text-[8px] rounded border">10.15 지침</span>
                        <span className="px-1.5 py-0.5 bg-slate-50 text-slate-400 text-[8px] rounded border">LTV/DSR</span>
                     </div>
                   </div>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {needsKey && (
          <div className="flex justify-center p-4 animate-in zoom-in-95">
            <div className="bg-white border-2 border-dashed border-blue-200 p-8 rounded-[2rem] max-w-sm w-full text-center space-y-4 shadow-sm">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto text-blue-600">
                <Key className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-black text-slate-800">API 키 연동이 필요합니다</h4>
                <p className="text-[11px] font-bold text-slate-400 mt-1 leading-relaxed">
                  배포 환경의 보안 정책으로 인해<br/>최초 1회 API 키를 연결해야 합니다.
                </p>
              </div>
              <button 
                onClick={handleConnectKey}
                className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-black text-xs shadow-lg hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4 fill-current" /> 지금 API 키 연결하기
              </button>
              <p className="text-[9px] text-slate-300 font-bold">한 번 연결하면 다음 접속부터 자동으로 인식됩니다.</p>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="flex justify-start">
            <div className="flex gap-3">
              <div className="w-9 h-9 rounded-xl bg-white border border-slate-100 flex items-center justify-center shrink-0 shadow-sm">
                <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
              </div>
              <div className="bg-white border border-slate-50 p-4 rounded-[1.25rem] rounded-tl-none shadow-sm flex flex-col gap-2">
                <div className="flex gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce [animation-delay:-0.3s]"></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 md:p-8 bg-white border-t border-slate-50 shrink-0">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSend} className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#00479d] to-[#008e46] rounded-[2rem] blur opacity-10 group-focus-within:opacity-20 transition duration-1000"></div>
            <div className="relative flex items-center bg-slate-50 rounded-[1.5rem] px-5 py-1.5 group-focus-within:bg-white border-2 border-transparent group-focus-within:border-blue-100 transition-all shadow-inner">
              <MessageSquare className="w-5 h-5 text-slate-300 shrink-0" />
              <input 
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading || needsKey}
                placeholder={needsKey ? "상단의 [API 키 연결하기] 버튼을 눌러주세요" : "상담하실 조건이나 규제 내용을 입력하십시오..."}
                className="w-full bg-transparent border-none py-4 md:py-5 px-4 font-bold text-sm md:text-base outline-none text-slate-800 placeholder:text-slate-300"
              />
              <button 
                type="submit"
                disabled={isLoading || !input.trim() || needsKey}
                className="w-10 h-10 md:w-12 md:h-12 bg-[#00479d] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-20"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>
          
          {/* Quick Shortcuts */}
          {!input && messages.length < 3 && !needsKey && (
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {['서울 15억 이하 한도', '생활자금 1억 제한', '6개월 전입의무'].map((s, i) => (
                <button key={i} onClick={() => setInput(s)} className="px-3 py-1.5 bg-white border border-slate-100 rounded-full text-[11px] font-bold text-slate-400 hover:text-blue-600 hover:border-blue-100 transition-all flex items-center gap-1 shadow-sm">
                  {s} <ChevronRight className="w-3 h-3" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AiInquiry;
