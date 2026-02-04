
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
      // 최신 API 키를 사용하기 위해 호출 직전에 인스턴스 생성
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // 더 빠르고 안정적인 gemini-3-flash-preview 모델 사용 (연결 오류 해결을 위한 최적화)
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [{ role: 'user', parts: [{ text: userMessage }] }],
        config: {
          systemInstruction: `
            당신은 NH농협은행의 숙련된 여신 실무 전문가입니다. 다음의 '주담대 1015 대책' 핵심 지침을 바탕으로 사용자의 질문에 답변하십시오.

            [중요 출력 규칙]
            1. 모든 형태의 별표(*) 기호를 절대로 사용하지 마십시오.
            2. 대신 가독성이 좋도록 줄바꿈을 자주 사용하고, 숫자를 사용하여 목록을 만드십시오 (예: 1. 2. 3.).
            3. 답변은 전문적이면서도 친절한 실무자 어투를 사용하십시오.

            [핵심 지침 - 10.15 대책]
            1. 수도권 구입자금 대출 한도 상한:
               - 시가 15억 이하: 최대 6억 상한
               - 시가 15억 초과 ~ 25억 이하: 최대 4억 상한
               - 시가 25억 초과: 최대 2억 상한
            2. 생활안정자금: 규제/수도권 1주택자 합산 1억원 이내 제한.
            3. LTV: 규제지역 40% 적용 및 수도권 강화 지침 준수.
            4. 스트레스 DSR: 수도권/규제지역 주담대 3.0% 가산 필수 적용.
            5. 사후관리: 6개월 내 전입 및 기존주택 처분 의무 준수 확인.
            
            사용자의 질문에 대해 위 기준을 근거로 명확히 답변하세요.
          `
        }
      });

      // .text 속성을 통해 직접 텍스트 추출
      let reply = response.text || '죄송합니다. 답변을 생성할 수 없습니다.';
      reply = reply.replace(/\*/g, '').trim(); 
      
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch (error) {
      console.error('AI Inquiry Error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: '현재 서버 연결이 원활하지 않거나 할당량이 초과되었습니다. 잠시 후 다시 시도해 주시거나, 메인 화면의 규제 요약 지침을 참고해 주세요.' 
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
            <p className="text-[10px] md:text-xs text-slate-400 font-bold break-keep">10.15 대책 통합 가이드 (Fast-Flash)</p>
          </div>
        </div>
        <div className="hidden sm:block bg-slate-50 px-4 py-2 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest border border-slate-100">
          STABLE_MODE: ENABLED
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
                지침 데이터를 신속하게 분석 중입니다...
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
            placeholder="규제 상한액이나 의무사항 문의..."
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
          <Info className="w-3 h-3" /> Flash 모델 최적화 적용됨. 답변이 오지 않을 경우 인터넷 연결을 확인하세요.
        </div>
      </div>
    </div>
  );
};

export default AiInquiry;
