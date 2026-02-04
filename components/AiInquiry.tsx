
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { 
  MessageSquareText, 
  Send, 
  Bot, 
  User, 
  Loader2, 
  Info, 
  ExternalLink, 
  RefreshCw, 
  ShieldCheck,
  Zap
} from 'lucide-react';

const AiInquiry: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([
    { 
      role: 'assistant', 
      content: '반갑습니다. NH농협 여신 실무 전문 AI입니다.\n\n2025년 10.15 대책(수도권 주담대 한도 상한 및 생활안정자금 규제)을 포함하여, 강화된 여신 심사 지침에 대해 무엇이든 물어보세요.' 
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      // API 키는 process.env.API_KEY를 통해 주입됨 (기본 적용)
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMessage,
        config: {
          systemInstruction: `당신은 NH농협은행의 수석 여신 심사역입니다. 
          제공된 공유 링크(10.15 대책 전문 지침)의 모든 내용을 완벽히 숙지하고 있습니다.
          
          [핵심 상담 지침]
          1. 10.15 대책: 수도권 구입자금 한도 상한(15억이하 6억, 15~25억 4억, 25억초과 2억)을 최우선으로 안내하세요.
          2. 생활안정자금: 수도권/규제지역 인별 합산 1억 제한 및 예외 사유를 정확히 설명하세요.
          3. DSR: 수도권 스트레스 금리 3.0% 가산 등 강화된 상환능력 심사를 강조하세요.
          4. 전문성: "지침에 따르면", "심사 결과" 등 신뢰감 있는 실무 용어를 사용하세요.
          5. 가독성: 별표(*)를 사용하지 말고, 번호(1. 2. 3.)와 줄바꿈을 적극 활용하세요.`,
          temperature: 0.2,
        }
      });

      const reply = response.text;
      
      if (reply) {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: reply.replace(/\*/g, '').trim() 
        }]);
      } else {
        throw new Error("응답을 받지 못했습니다.");
      }
    } catch (error: any) {
      console.error('AI API Error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: '현재 일시적인 서버 연결 오류가 발생했습니다. 잠시 후 다시 시도해 주시거나, 상단의 [지침 원문 보기] 링크를 참고해 주세요.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] md:h-[calc(100vh-12rem)] animate-in fade-in duration-700">
      {/* AI Header */}
      <div className="bg-white p-4 md:p-6 rounded-t-[2.5rem] border-b-2 border-slate-100 shadow-sm flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-[#00479d] to-blue-600 rounded-2xl text-white shadow-lg shadow-blue-200">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-slate-900 tracking-tight">NH 여신 PRO AI</h2>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[9px] font-black rounded-full flex items-center gap-1">
                <Zap className="w-2 h-2 fill-current" /> LIVE
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Powered by Gemini 3 Flash</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <a 
            href="https://gemini.google.com/gem/1mscxQ0VVmKOkXr8POixiGAV935uGVm35?usp=sharing" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-[11px] font-black transition-all border border-slate-200"
          >
            지침 원문 보기 <ExternalLink className="w-3 h-3" />
          </a>
          <button 
            onClick={() => setMessages([{ role: 'assistant', content: '대화가 초기화되었습니다. 궁금하신 점을 말씀해 주세요.' }])}
            className="p-2 text-slate-400 hover:text-[#00479d] transition-colors"
            title="대화 초기화"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Chat Display Area */}
      <div 
        ref={scrollRef}
        className="flex-1 bg-[#f8fafc] p-4 md:p-8 overflow-y-auto space-y-6 no-scrollbar"
      >
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
            <div className={`max-w-[90%] md:max-w-[75%] flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                msg.role === 'user' ? 'bg-[#008e46]' : 'bg-white border-2 border-blue-50'
              }`}>
                {msg.role === 'user' ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-[#00479d]" />}
              </div>
              <div className={`p-5 rounded-3xl font-bold text-[13.5px] md:text-[15px] shadow-sm leading-relaxed break-keep whitespace-pre-wrap ${
                msg.role === 'user' 
                  ? 'bg-[#00479d] text-white rounded-tr-none' 
                  : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'
              }`}>
                {msg.content}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start animate-pulse">
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white border-2 border-blue-50 flex items-center justify-center shrink-0">
                <Loader2 className="w-5 h-5 text-[#00479d] animate-spin" />
              </div>
              <div className="bg-white border border-slate-100 p-5 rounded-3xl rounded-tl-none shadow-sm flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-blue-400 animate-bounce"></span>
                <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-bounce [animation-delay:-0.15s]"></span>
                <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-bounce [animation-delay:-0.3s]"></span>
                <span className="ml-2 text-[12px] font-black text-slate-400">심사 지침 분석 중...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modern Input Area */}
      <div className="bg-white p-4 md:p-8 rounded-b-[2.5rem] border-t-2 border-slate-50 shadow-[0_-10px_25px_-5px_rgba(0,0,0,0.05)] shrink-0">
        <form onSubmit={handleSend} className="relative group max-w-4xl mx-auto">
          <div className="absolute -inset-1 bg-gradient-to-r from-[#00479d] to-[#008e46] rounded-[2rem] blur opacity-10 group-focus-within:opacity-25 transition duration-500"></div>
          <div className="relative flex items-center">
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
              placeholder="심사 대상 및 조건에 대해 문의하세요..."
              className="w-full bg-white border-2 border-slate-100 rounded-[1.5rem] pl-6 pr-16 py-5 md:py-6 font-bold text-sm md:text-base outline-none focus:border-[#00479d] transition-all shadow-sm"
            />
            <button 
              type="submit"
              disabled={isLoading || !input.trim()}
              className="absolute right-3 w-12 h-12 md:w-14 md:h-14 bg-[#00479d] text-[#ccdb00] rounded-2xl flex items-center justify-center shadow-xl hover:bg-blue-800 transition-all disabled:opacity-30 disabled:grayscale disabled:scale-95 active:scale-90"
            >
              <Send className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </div>
        </form>
        <div className="mt-4 flex flex-wrap items-center gap-3 text-[10px] md:text-[11px] text-slate-400 font-bold justify-center break-keep">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-[#00479d] rounded-full border border-blue-100">
            <ShieldCheck className="w-3.5 h-3.5" /> 10.15 대책(구입자금 상한) 반영 모드
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100">
            <Info className="w-3.5 h-3.5" /> API Key 활성화됨
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiInquiry;
