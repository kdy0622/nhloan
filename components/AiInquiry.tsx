
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { MessageSquareText, Send, Bot, User, Loader2, Info } from 'lucide-react';

const AiInquiry: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([
    { role: 'assistant', content: 'NH농협 여신 실무 AI입니다.\n"주담대 1015 대책" 및 강화된 금융 규제 지침에 대해 궁금한 점을 물어보세요.' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isLoading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      // 1. 인스턴스 생성 (SDK 가이드 준수)
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // 2. 가장 안정적인 gemini-flash-latest 모델 사용 및 표준 구조 호출
      const response = await ai.models.generateContent({
        model: 'gemini-flash-latest',
        contents: { parts: [{ text: userMessage }] },
        config: {
          systemInstruction: `당신은 NH농협은행의 숙련된 여신 실무 전문가입니다. 
          10.15 대책(수도권 한도 6/4/2억 상한, 생활자금 1억 제한 등)을 바탕으로 전문적인 조언을 제공하세요. 
          답변 시 별표(*)를 절대 사용하지 마세요. 대신 번호(1. 2. 3.)와 줄바꿈을 사용하여 가독성을 높이세요.`,
          temperature: 0.1, // 안정성 극대화
          topP: 0.95,
        }
      });

      // 3. .text 속성으로 데이터 추출
      const reply = response.text;
      
      if (reply) {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: reply.replace(/\*/g, '').trim() 
        }]);
      } else {
        throw new Error("Empty response");
      }
    } catch (error) {
      console.error('AI API Error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: '현재 AI 서버 연결이 지연되고 있습니다.\n\n해결 방법:\n1. 잠시 후 다시 한 번 질문을 입력해 보세요.\n2. 네트워크 상태를 확인해 주세요.\n3. 계속 오류 발생 시 메인 화면의 [10.15 규제 요약] 메뉴를 직접 확인해 주세요.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] md:h-[calc(100vh-14rem)] animate-in fade-in duration-500">
      <div className="bg-white p-4 md:p-6 rounded-t-[2rem] border-2 border-slate-100 shadow-xl flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 md:p-3 bg-blue-100 rounded-2xl text-[#00479d]">
            <MessageSquareText className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-black text-slate-900 tracking-tight break-keep">규제 지침 AI 상담원</h2>
            <p className="text-[10px] md:text-xs text-slate-400 font-bold break-keep">10.15 대책 통합 가이드 (Stable Mode)</p>
          </div>
        </div>
        <div className="hidden sm:block bg-[#008e46]/10 px-4 py-2 rounded-xl text-[10px] font-black text-[#008e46] uppercase tracking-widest border border-[#008e46]/20">
          STABLE_CONNECTION: ON
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 bg-slate-50/50 p-4 md:p-6 overflow-y-auto space-y-6 border-x-2 border-slate-100"
      >
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[92%] md:max-w-[85%] flex gap-2 md:gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 md:w-10 md:h-10 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0 shadow-md ${msg.role === 'user' ? 'bg-[#008e46]' : 'bg-[#00479d]'}`}>
                {msg.role === 'user' ? <User className="w-4 h-4 md:w-5 md:h-5 text-white" /> : <Bot className="w-4 h-4 md:w-5 md:h-5 text-[#ccdb00]" />}
              </div>
              <div className={`p-4 md:p-5 rounded-2xl font-bold text-xs md:text-sm shadow-sm leading-relaxed break-keep whitespace-pre-wrap ${
                msg.role === 'user' 
                  ? 'bg-white text-slate-800 rounded-tr-none border border-emerald-100' 
                  : 'bg-[#00479d] text-white rounded-tl-none border border-blue-900'
              }`}>
                {msg.content}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex gap-3">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-[#00479d] flex items-center justify-center shrink-0 shadow-md">
                <Loader2 className="w-4 h-4 text-[#ccdb00] animate-spin" />
              </div>
              <div className="bg-slate-200 p-4 rounded-2xl rounded-tl-none animate-pulse text-slate-500 font-black text-[10px] md:text-xs">
                최신 여신 지침을 분석하여 답변을 생성하고 있습니다...
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white p-4 md:p-6 rounded-b-[2rem] border-2 border-slate-100 shadow-xl shrink-0">
        <form onSubmit={handleSend} className="relative">
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="상담 내용을 입력하세요..."
            className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl pl-5 pr-14 py-4 md:py-5 font-bold text-sm md:text-base focus:border-[#00479d] focus:ring-4 focus:ring-blue-100 outline-none transition-all"
          />
          <button 
            type="submit"
            disabled={isLoading || !input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-[#00479d] text-[#ccdb00] rounded-xl flex items-center justify-center shadow-lg hover:bg-blue-800 transition-all disabled:opacity-50 disabled:scale-95 active:scale-90"
          >
            <span className="sr-only">전송</span>
            <Send className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </form>
        <div className="mt-3 flex items-center gap-2 text-[9px] md:text-[10px] text-slate-400 font-bold justify-center break-keep">
          <Info className="w-3 h-3 text-[#008e46]" /> 2026.02 최신 규제 패치 및 'gemini-flash-latest' 안정 모드 작동 중
        </div>
      </div>
    </div>
  );
};

export default AiInquiry;
