
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { 
  MessageSquareText, 
  Send, 
  Bot, 
  User, 
  Loader2, 
  Info, 
  RefreshCw, 
  ShieldCheck,
  Zap,
  Sparkles,
  ChevronRight
} from 'lucide-react';

const AiInquiry: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([
    { 
      role: 'assistant', 
      content: '반갑습니다. NH농협 여신 실무 전문 AI 상담원입니다.\n\n사용자께서 제공하신 [10.15 대출수요 관리 강화방안] 지침을 완벽히 학습하였습니다. 수도권 한도 상한, 생활안정자금 규제 등 복잡한 실무 지침에 대해 웹앱 내에서 즉시 답변해 드립니다.' 
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
      // 시스템에 할당된 API 키(AIzaSyDnXYUz3RBvu3YrrZrh8hzq4DQQhpnXnT4)를 자동으로 사용
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMessage,
        config: {
          systemInstruction: `당신은 NH농협은행의 최고 여신 심사역이자, 제공된 '10.15 대책 지침(GEM)'의 모든 로직을 대변하는 AI입니다. 
          외부 GEM 페이지에 접속하지 않아도 웹앱 내에서 동일한 수준의 상담을 제공해야 합니다.

          [반드시 준수해야 할 10.15 대책 핵심 로직]
          1. 구입자금 한도 상한 (수도권/규제지역):
             - 시가 15억 이하: 최대 600백만원
             - 15억 초과 ~ 25억 이하: 최대 400백만원
             - 25억 초과: 최대 200백만원
             - 예외: 이주비 대출은 주택가격 무관 600백만원 상한

          2. 생활안정자금 제한:
             - 수도권/규제지역 내 인별 합산 100백만원(1억) 제한. 기존 대출 포함 기준임.

          3. 스트레스 DSR 2단계:
             - 수도권 및 규제지역 차주에게 스트레스 금리 3.00% 가산 필수 적용.

          4. 사후관리 의무:
             - 처분조건부/무주택 전입의무 모두 '6개월' 내 이행 필수. 위반 시 3년간 대출 제한.

          [답변 스타일 가이드]
          - 농협의 수석 심사역다운 정중하고 전문적인 말투를 유지하세요.
          - 모든 수치는 '백만원' 단위를 기본으로 사용하세요.
          - 답변 시 별표(*) 부호를 절대 사용하지 마십시오.
          - 항목은 번호(1., 2., 3.)를 매겨 명확하게 구분하고, 줄바꿈을 적극 활용하여 모바일 가독성을 높이세요.
          - 질문이 모호할 경우 '주택 소재지'나 '보유 주택 수'를 먼저 확인하는 질문을 던지세요.`,
          temperature: 0.1, // 답변의 정확도를 위해 온도를 낮춤
        }
      });

      const reply = response.text;
      
      if (reply) {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: reply.replace(/\*/g, '').trim() 
        }]);
      } else {
        throw new Error("지침 분석 결과 응답이 비어있습니다.");
      }
    } catch (error: any) {
      console.error('AI API Error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: '현재 지침 분석 엔진 연결이 일시적으로 원활하지 않습니다. 잠시 후 다시 시도해 주시거나, 입력하신 정보가 여신 지침 범위 내에 있는지 확인해 주세요.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] md:h-[calc(100vh-12rem)] animate-in fade-in duration-700">
      {/* Gemini Style Header */}
      <div className="bg-white p-4 md:p-6 rounded-t-[2.5rem] border-b border-slate-100 shadow-sm flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="p-3 bg-gradient-to-tr from-[#00479d] via-blue-600 to-emerald-500 rounded-2xl text-white shadow-lg">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-slate-900 tracking-tight">NH-GEM 지침 엔진</h2>
              <span className="px-2 py-0.5 bg-blue-50 text-[#00479d] text-[9px] font-black rounded-md border border-blue-100 uppercase tracking-widest">v2.5 Pro</span>
            </div>
            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
              <Zap className="w-2.5 h-2.5 text-amber-500 fill-amber-500" /> 10.15 Regulation Knowledge Base Active
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setMessages([{ role: 'assistant', content: '지침 상담을 새로 시작합니다. 궁금하신 내용을 말씀해 주세요.' }])}
            className="flex items-center gap-1.5 px-3 py-2 text-slate-400 hover:text-[#00479d] hover:bg-slate-50 rounded-xl transition-all font-bold text-xs"
          >
            <RefreshCw className="w-4 h-4" /> 리셋
          </button>
        </div>
      </div>

      {/* Modern Chat Display Area */}
      <div 
        ref={scrollRef}
        className="flex-1 bg-[#fcfdfe] p-4 md:p-8 overflow-y-auto space-y-8 no-scrollbar scroll-smooth"
      >
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-4 duration-500`}>
            <div className={`max-w-[95%] md:max-w-[80%] flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                msg.role === 'user' ? 'bg-[#008e46]' : 'bg-white border border-slate-200'
              }`}>
                {msg.role === 'user' ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-[#00479d]" />}
              </div>
              <div className={`relative p-5 rounded-[2rem] font-bold text-[14px] md:text-[15.5px] shadow-sm leading-[1.7] break-keep whitespace-pre-wrap transition-all ${
                msg.role === 'user' 
                  ? 'bg-[#00479d] text-white rounded-tr-none' 
                  : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'
              }`}>
                {msg.content}
                {msg.role === 'assistant' && i === messages.length - 1 && !isLoading && (
                   <div className="mt-4 pt-4 border-t border-slate-50 flex items-center gap-3">
                     <span className="text-[10px] text-slate-300 uppercase tracking-widest font-black">Helpful?</span>
                     <div className="flex gap-2">
                        <button className="w-6 h-6 rounded-md bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-blue-50 hover:text-blue-500 transition-all text-[10px]">👍</button>
                        <button className="w-6 h-6 rounded-md bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-rose-50 hover:text-rose-500 transition-all text-[10px]">👎</button>
                     </div>
                   </div>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start animate-in fade-in duration-300">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shrink-0">
                <Loader2 className="w-5 h-5 text-[#00479d] animate-spin" />
              </div>
              <div className="bg-white border border-slate-100 p-6 rounded-[2rem] rounded-tl-none shadow-sm flex flex-col gap-3 min-w-[200px]">
                <div className="flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-200 animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce [animation-delay:-0.3s]"></div>
                </div>
                <p className="text-[12px] font-black text-slate-400 tracking-tight">10.15 대책 지침 데이터를 분석 중입니다...</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating Input Area (Gemini Style) */}
      <div className="p-4 md:p-10 bg-gradient-to-t from-white via-white/95 to-transparent shrink-0">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSend} className="relative group">
            {/* Input Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-[#00479d] via-blue-400 to-[#008e46] rounded-[2.5rem] blur opacity-10 group-focus-within:opacity-20 transition duration-1000"></div>
            
            <div className="relative flex items-center bg-white border-2 border-slate-100 rounded-[2rem] px-2 py-2 group-focus-within:border-[#00479d]/30 transition-all shadow-xl">
              <div className="pl-4 text-slate-300">
                <MessageSquareText className="w-5 h-5" />
              </div>
              <input 
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
                placeholder="심사 대상 주택 및 조건을 입력하면 10.15 지침 기반 한도를 안내합니다..."
                className="w-full bg-transparent border-none rounded-none pl-3 pr-14 py-4 md:py-5 font-bold text-sm md:text-base outline-none text-slate-800 placeholder:text-slate-300"
              />
              <button 
                type="submit"
                disabled={isLoading || !input.trim()}
                className="absolute right-2 w-12 h-12 md:w-14 md:h-14 bg-[#00479d] text-[#ccdb00] rounded-full flex items-center justify-center shadow-lg hover:shadow-blue-200 hover:scale-105 active:scale-95 transition-all disabled:opacity-20 disabled:grayscale disabled:scale-100"
              >
                <Send className="w-5 h-5 md:w-6 h-6" />
              </button>
            </div>
          </form>
          
          {/* Quick Suggestions */}
          {!input && messages.length < 3 && (
            <div className="flex flex-wrap justify-center gap-2 mt-6 animate-in fade-in slide-in-from-top-2 duration-1000 delay-500">
              {[
                "서울 20억 아파트 한도 얼마?",
                "수도권 생활자금 1주택 규제",
                "6개월 처분조건 상세 기준",
                "스트레스 DSR 2단계 적용 범위"
              ].map((s, idx) => (
                <button 
                  key={idx}
                  onClick={() => setInput(s)}
                  className="px-4 py-2 bg-white border border-slate-100 rounded-full text-[11px] font-black text-slate-500 hover:border-blue-200 hover:bg-blue-50 transition-all flex items-center gap-1.5 shadow-sm"
                >
                  {s} <ChevronRight className="w-3 h-3" />
                </button>
              ))}
            </div>
          )}
          
          <div className="mt-6 flex flex-wrap items-center gap-4 text-[10px] md:text-[11px] text-slate-400 font-bold justify-center">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-full border border-slate-100">
              <ShieldCheck className="w-3.5 h-3.5 text-[#008e46]" /> 
              <span>10.15 대책 전용 지침 엔진</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-full border border-slate-100">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>NH-PRO API Key Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiInquiry;
