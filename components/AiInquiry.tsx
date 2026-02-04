
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { 
  Send, 
  Bot, 
  User, 
  Loader2, 
  RefreshCw, 
  ShieldCheck,
  Zap,
  Sparkles,
  AlertCircle,
  Key,
  ExternalLink
} from 'lucide-react';

const AiInquiry: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([
    { 
      role: 'assistant', 
      content: '반갑습니다. **NH-GEM 지침 엔진 v3.5**입니다.\n\n2025년 10.15 대책(수도권 한도 상한 및 생활안정자금 규제)이 완벽히 내장되어 있습니다. 무엇이든 물어보세요.' 
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [needsKey, setNeedsKey] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // API 키 선택 창 열기
  const handleOpenKeySelector = async () => {
    try {
      if (window.aistudio && window.aistudio.openSelectKey) {
        await window.aistudio.openSelectKey();
        setNeedsKey(false);
        // 키 선택 후 즉시 사용 가능하다고 가정 (레이스 컨디션 대응)
      }
    } catch (err) {
      console.error("Failed to open key selector", err);
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
    
    // 초기 키 체크
    const checkKey = async () => {
      if (window.aistudio && window.aistudio.hasSelectedApiKey) {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        if (!hasKey && !process.env.API_KEY) {
          setNeedsKey(true);
        }
      }
    };
    checkKey();
  }, [messages, isLoading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      // API 호출 직전에 새로운 인스턴스 생성 (최신 키 보장)
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMessage,
        config: {
          systemInstruction: `당신은 NH농협은행의 수석 여신 심사역이며, 사용자가 제공한 10.15 대책 지침을 완벽하게 숙지하고 있습니다.
          
          [핵심 상담 지침 - 10.15 대책]
          1. 수도권/규제지역 구입자금 한도 상한: 15억 이하(6억), 15~25억(4억), 25억 초과(2억). 이주비는 6억 고정 상한.
          2. 생활안정자금: 수도권/규제지역 인별 합산 1억(100백만원) 제한.
          3. DSR: 수도권 스트레스 금리 3.0% 가산 필수 적용.
          
          [답변 스타일]
          - Gemini(GEM)와 동일하게 깔끔하고 가독성 좋은 마크다운 형식을 사용하세요.
          - 별표(*) 기호 대신 번호와 단락 구분을 사용하세요.
          - 정중하지만 단호한 심사역의 말투를 유지하세요.`,
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
      if (error.message?.includes("API Key")) {
        setNeedsKey(true);
      }
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: '현재 지침 엔진과의 통신이 원활하지 않습니다. API 키가 만료되었거나 연동되지 않았을 수 있습니다.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] md:h-[calc(100vh-12rem)] animate-in fade-in duration-700 bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden">
      {/* Gemini Header */}
      <div className="p-5 border-b border-slate-50 flex items-center justify-between shrink-0 bg-white/50 backdrop-blur-xl z-20">
        <div className="flex items-center gap-4">
          <div className="p-2.5 bg-gradient-to-br from-[#00479d] to-blue-500 rounded-xl text-white shadow-lg">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-800 tracking-tight">NH-GEM 지침 엔진</h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`w-2 h-2 rounded-full ${needsKey ? 'bg-rose-500' : 'bg-emerald-500'}`}></span>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                {needsKey ? 'API Connection Required' : '10.15 Policy Engine Active'}
              </p>
            </div>
          </div>
        </div>
        
        <button onClick={() => window.location.reload()} className="p-2 text-slate-300 hover:text-blue-600 transition-colors">
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      {/* Chat Area */}
      <div ref={scrollRef} className="flex-1 bg-white p-4 md:p-10 overflow-y-auto space-y-10 no-scrollbar">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
            <div className={`max-w-[95%] md:max-w-[85%] flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border ${
                msg.role === 'user' ? 'bg-[#008e46] border-[#008e46]' : 'bg-white border-slate-100 shadow-sm'
              }`}>
                {msg.role === 'user' ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-[#00479d]" />}
              </div>
              <div className={`p-5 rounded-[2rem] font-medium text-[15px] md:text-[16px] leading-relaxed break-keep whitespace-pre-wrap ${
                msg.role === 'user' 
                  ? 'bg-slate-100 text-slate-800 rounded-tr-none' 
                  : 'bg-white text-slate-800 rounded-tl-none border border-slate-50'
              }`}>
                {msg.content}
              </div>
            </div>
          </div>
        ))}

        {needsKey && (
          <div className="flex justify-center p-6 animate-in zoom-in-95">
            <div className="bg-blue-50 border border-blue-100 p-8 rounded-[2.5rem] max-w-sm w-full text-center space-y-5 shadow-sm">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-sm text-blue-600">
                <Key className="w-7 h-7" />
              </div>
              <div>
                <h4 className="text-lg font-black text-blue-900 tracking-tight">API 키 연결이 필요합니다</h4>
                <p className="text-[12px] font-bold text-blue-700/70 mt-2 leading-relaxed">
                  배포된 환경에서 지침 엔진을 사용하려면<br/>유료 프로젝트의 API 키 선택이 필요합니다.
                </p>
              </div>
              <div className="space-y-3">
                <button 
                  onClick={handleOpenKeySelector}
                  className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-sm shadow-xl hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4 fill-current" /> 지금 API 키 연결하기
                </button>
                <a 
                  href="https://ai.google.dev/gemini-api/docs/billing" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[10px] font-black text-blue-400 hover:underline flex items-center justify-center gap-1"
                >
                  결제 및 빌링 문서 확인 <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
            </div>
          </div>
        )}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
              </div>
              <div className="bg-slate-50 p-5 rounded-[2rem] rounded-tl-none flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce [animation-delay:-0.3s]"></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-6 md:p-10 bg-white border-t border-slate-50 shrink-0">
        <form onSubmit={handleSend} className="max-w-4xl mx-auto relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-emerald-400 rounded-[2.5rem] blur opacity-0 group-focus-within:opacity-10 transition duration-1000"></div>
          <div className="relative flex items-center bg-slate-100 rounded-[2rem] px-6 py-2 group-focus-within:bg-white border-2 border-transparent group-focus-within:border-blue-100 transition-all">
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading || needsKey}
              placeholder={needsKey ? "API 키를 먼저 연결해 주세요" : "심사 지침에 대해 질문하세요..."}
              className="w-full bg-transparent border-none py-4 md:py-5 font-bold text-sm md:text-base outline-none text-slate-800 placeholder:text-slate-400"
            />
            <button 
              type="submit"
              disabled={isLoading || !input.trim() || needsKey}
              className="w-10 h-10 md:w-12 md:h-12 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-20"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AiInquiry;
