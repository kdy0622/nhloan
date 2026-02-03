
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { MessageSquareText, Send, Bot, User, Loader2, Info } from 'lucide-react';

const AiInquiry: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([
    { role: 'assistant', content: 'NH농협 여신 실무 AI입니다. "주담대 1015 대책" 및 강화된 금융 규제 지침에 대해 궁금한 점을 물어보세요.' }
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
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMessage,
        config: {
          systemInstruction: `
            당신은 NH농협은행의 숙련된 여신 실무 전문가입니다. 다음의 '주담대 1015 대책' 핵심 지침을 바탕으로 사용자의 질문에 정확하고 전문적으로 답변하십시오.

            [주요 학습 지침 - 10.15 대책]
            1. 수도권(규제지역 포함) 구입자금 대출 한도 상한 적용:
               - 시가 15억 이하: 최대 6억 상한
               - 시가 15억 초과 ~ 25억 이하: 최대 4억 상한
               - 시가 25억 초과: 최대 2억 상한
            2. 생활안정자금(생활자금):
               - 규제지역/수도권 1주택자 합산 1억원 이내로 제한 (기존 대출 포함)
               - 대심위 승인 시 상향 가능하나 원칙적 제한.
            3. LTV/DTI 강화:
               - 규제지역(서울 4개구) LTV 40% 적용.
               - 서민실수요자/생애최초 특례 적용 시 LTV 60-70% 수준이나 10.15 상한제 금액을 넘을 수 없음.
            4. 스트레스 DSR: 
               - 수도권/규제지역 주담대 전산 적용 시 기본 3.0% 스트레스 금리 반영 필수.
            5. 의무사항:
               - 규제지역/수도권 무주택자 또는 1주택 처분조건부의 경우 6개월 내 전입 및 기존주택 처분/등기이전 필수.
            
            사용자가 계산 결과나 규제에 대해 물으면 위 기준을 근거로 친절하면서도 단호하게 농협 실무 지침대로 답변하세요. 금액 단위는 '백만원' 혹은 '억원'을 사용하세요.
          `
        }
      });

      setMessages(prev => [...prev, { role: 'assistant', content: response.text || '죄송합니다. 답변을 생성할 수 없습니다.' }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', content: '서버 연결 중 오류가 발생했습니다. 나중에 다시 시도해주세요.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-14rem)] animate-in fade-in duration-500">
      <div className="bg-white p-6 rounded-t-[2rem] border-2 border-slate-100 shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-100 rounded-2xl">
            <MessageSquareText className="w-6 h-6 text-[#00479d]" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">규제 지침 AI 상담원</h2>
            <p className="text-xs text-slate-400 font-bold">10.15 대책 전문 가이드</p>
          </div>
        </div>
        <div className="hidden sm:block bg-slate-50 px-4 py-2 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest border border-slate-100">
          Knowledge Base: 1015_Guideline.pdf
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 bg-slate-50/50 p-6 overflow-y-auto space-y-6 border-x-2 border-slate-100"
      >
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-md ${msg.role === 'user' ? 'bg-[#008e46]' : 'bg-[#00479d]'}`}>
                {msg.role === 'user' ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-[#ccdb00]" />}
              </div>
              <div className={`p-5 rounded-[1.5rem] font-bold text-sm shadow-sm leading-relaxed ${
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
              <div className="w-10 h-10 rounded-2xl bg-[#00479d] flex items-center justify-center shrink-0 shadow-md">
                <Loader2 className="w-5 h-5 text-[#ccdb00] animate-spin" />
              </div>
              <div className="bg-slate-200 p-5 rounded-[1.5rem] rounded-tl-none animate-pulse text-slate-500 font-black text-xs">
                지침서를 분석하여 답변을 생성 중입니다...
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white p-6 rounded-b-[2rem] border-2 border-slate-100 shadow-xl">
        <form onSubmit={handleSend} className="relative">
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="상한제 금액 기준이나 6개월 의무 사항에 대해 물어보세요..."
            className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl pl-6 pr-16 py-5 font-bold focus:border-[#00479d] focus:ring-4 focus:ring-blue-100 outline-none transition-all"
          />
          <button 
            type="submit"
            disabled={isLoading || !input.trim()}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 bg-[#00479d] text-[#ccdb00] rounded-xl flex items-center justify-center shadow-lg hover:bg-blue-800 transition-all disabled:opacity-50 disabled:scale-95 active:scale-90"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
        <div className="mt-4 flex items-center gap-2 text-[10px] text-slate-400 font-bold justify-center">
          <Info className="w-3 h-3" /> AI 답변은 참고용이며 최종 여신 승인은 관련 지침 원본을 재확인하십시오.
        </div>
      </div>
    </div>
  );
};

export default AiInquiry;
