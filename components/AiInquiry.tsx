
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { 
  MessageSquareText, 
  Send, 
  Bot, 
  User, 
  Loader2, 
  RefreshCw, 
  ShieldCheck,
  Zap,
  Sparkles,
  ChevronRight,
  AlertCircle,
  HelpCircle
} from 'lucide-react';

const AiInquiry: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([
    { 
      role: 'assistant', 
      content: '반갑습니다. 농협 여신 실무자를 위한 **NH-GEM 지침 엔진**입니다.\n\n사용자께서 요청하신 [10.15 대출수요 관리 강화방안] 및 수도권 구입자금 상한 지침이 본 엔진에 완벽히 탑재되었습니다. 외부 GEM 페이지로 이동하지 않고도 이곳에서 즉시 전문 상담이 가능합니다.' 
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorDetail, setErrorDetail] = useState<string | null>(null);
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
    setErrorDetail(null);
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      // API 키는 시스템에서 제공된 AIzaSyDnXYUz3RBvu3YrrZrh8hzq4DQQhpnXnT4를 사용함
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMessage,
        config: {
          systemInstruction: `당신은 농협은행의 수석 여신 심사역이며, 구글 Gemini(GEM)와 동일한 지식을 가진 전문 AI입니다. 
          웹앱 외부로 나가지 않아도 사용자가 GEM 공유 링크의 내용을 그대로 경험할 수 있도록 다음 지침을 반드시 따르세요.

          [10.15 대출수요 관리 강화방안 핵심 지침]
          1. 수도권/규제지역 구입자금 상한: 
             - 시가 15억 이하: 최대 6억(600백만원)
             - 15억 초과 ~ 25억 이하: 최대 4억(400백만원)
             - 25억 초과: 최대 2억(200백만원)
             - 예외: 이주비 대출은 가격 무관 6억 상한
          2. 생활안정자금: 수도권/규제지역 인별 합산 1억(100백만원) 상한. 기존 대출 포함.
          3. 스트레스 DSR 2단계: 수도권/규제지역 차주에게 3.0% 가산 금리 적용 필수.
          4. 사후관리: 처분/전입 의무 6개월 내 이행 필수. 위반 시 3년간 대출 금지.

          [답변 스타일]
          - 정중하고 명확한 어조를 사용하세요.
          - 모든 수치는 '백만원' 단위를 병기하세요.
          - 답변 시 별표(*) 부호를 절대 사용하지 마십시오. 번호와 줄바꿈만 사용하세요.
          - 질문이 모호하면 주택 소재지와 보유 주택 수를 먼저 확인하세요.`,
          temperature: 0.1,
        }
      });

      const reply = response.text;
      
      if (reply) {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: reply.replace(/\*/g, '').trim() 
        }]);
      } else {
        throw new Error("EMPTY_RESPONSE");
      }
    } catch (error: any) {
      console.error('AI API Error:', error);
      setErrorDetail(error.message || 'Unknown Connection Error');
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: '죄송합니다. 지침 분석 엔진과의 연결이 원활하지 않습니다. API 키가 활성화되지 않았거나 서버 일시 오류일 수 있습니다. 하단의 [엔진 재시작] 버튼을 눌러주세요.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] md:h-[calc(100vh-12rem)] animate-in fade-in duration-700 bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden">
      {/* GEM-Style Header */}
      <div className="bg-white/80 backdrop-blur-md p-4 md:p-6 border-b border-slate-50 flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-4">
          <div className="relative group">
            <div className="p-3 bg-gradient-to-tr from-[#00479d] via-blue-500 to-[#ccdb00] rounded-2xl text-white shadow-lg transition-transform group-hover:rotate-12">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full animate-pulse"></div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-slate-800 tracking-tight">NH-GEM 지침 엔진</h2>
              <span className="px-2 py-0.5 bg-blue-50 text-[#00479d] text-[9px] font-black rounded-md border border-blue-100">PRO v3.0</span>
            </div>
            <p className="text-[11px] text-slate-400 font-bold flex items-center gap-1 mt-0.5">
              <ShieldCheck className="w-3 h-3 text-emerald-500" /> 10.15 Regulation Knowledge Base Active
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => window.location.reload()}
            className="flex items-center gap-1.5 px-3 py-2 text-slate-400 hover:text-[#00479d] hover:bg-slate-50 rounded-xl transition-all font-bold text-xs"
          >
            <RefreshCw className="w-4 h-4" /> 엔진 재시작
          </button>
        </div>
      </div>

      {/* Message Display Area */}
      <div 
        ref={scrollRef}
        className="flex-1 bg-white p-4 md:p-10 overflow-y-auto space-y-10 no-scrollbar"
      >
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-4 duration-500`}>
            <div className={`max-w-[95%] md:max-w-[85%] flex gap-5 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-all ${
                msg.role === 'user' ? 'bg-[#008e46] shadow-emerald-100' : 'bg-slate-50 border border-slate-100 shadow-slate-50'
              }`}>
                {msg.role === 'user' ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-[#00479d]" />}
              </div>
              <div className={`relative p-6 rounded-[2.5rem] font-bold text-[14.5px] md:text-[16px] leading-[1.8] break-keep whitespace-pre-wrap ${
                msg.role === 'user' 
                  ? 'bg-[#00479d] text-white rounded-tr-none shadow-xl shadow-blue-50' 
                  : 'bg-white text-slate-700 rounded-tl-none border border-slate-50'
              }`}>
                {msg.content}
                {msg.role === 'assistant' && i === messages.length - 1 && !isLoading && !errorDetail && (
                   <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between">
                     <div className="flex items-center gap-4 text-[11px] text-slate-300 font-black uppercase tracking-widest">
                        Helpful?
                        <div className="flex gap-2">
                          <button className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-blue-50 hover:text-blue-500 transition-all flex items-center justify-center">👍</button>
                          <button className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-rose-50 hover:text-rose-500 transition-all flex items-center justify-center">👎</button>
                        </div>
                     </div>
                     <span className="text-[10px] text-slate-300 font-bold">NH-GEM v3.0 Internal Engine</span>
                   </div>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start animate-in fade-in duration-300">
            <div className="flex gap-5">
              <div className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 shadow-sm">
                <Loader2 className="w-5 h-5 text-[#00479d] animate-spin" />
              </div>
              <div className="bg-white border border-slate-50 p-6 rounded-[2.5rem] rounded-tl-none shadow-sm flex flex-col gap-3 min-w-[260px]">
                <div className="flex gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-200 animate-bounce"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-bounce [animation-delay:-0.3s]"></div>
                </div>
                <p className="text-[13px] font-black text-slate-400 tracking-tight">10.15 대책 지침 및 GEM 로직 분석 중...</p>
              </div>
            </div>
          </div>
        )}

        {errorDetail && (
          <div className="flex justify-center p-4">
             <div className="bg-rose-50 border-2 border-rose-100 p-6 rounded-3xl max-w-md w-full text-center space-y-4 shadow-lg animate-in shake duration-500">
                <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
                   <AlertCircle className="w-6 h-6" />
                </div>
                <div>
                   <h4 className="text-base font-black text-rose-900">엔진 연결 오류 발생</h4>
                   <p className="text-[12px] font-bold text-rose-700 mt-2 leading-relaxed">
                      API 호출 중 오류({errorDetail})가 발생했습니다.<br/>사용자님의 API 키 권한을 확인하거나 네트워크 상태를 점검해 주세요.
                   </p>
                </div>
                <button 
                  onClick={() => window.location.reload()}
                  className="w-full py-3 bg-rose-600 text-white rounded-2xl font-black text-sm shadow-xl hover:bg-rose-700 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" /> 엔진 즉시 재시작
                </button>
             </div>
          </div>
        )}
      </div>

      {/* Floating Input Area (GEM Clone) */}
      <div className="px-4 py-6 md:px-12 md:py-10 bg-gradient-to-t from-white via-white to-white/90 border-t border-slate-50 shrink-0">
        <div className="max-w-4xl mx-auto space-y-4">
          <form onSubmit={handleSend} className="relative group">
            {/* GEM-Style Input Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-[#00479d] via-blue-400 to-[#ccdb00] rounded-[2.5rem] blur-xl opacity-10 group-focus-within:opacity-20 transition duration-1000"></div>
            
            <div className="relative flex items-center bg-white border-2 border-slate-100 rounded-[2rem] p-2 group-focus-within:border-[#00479d]/30 transition-all shadow-xl">
              <input 
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
                placeholder="심사 대상 및 조건에 대해 무엇이든 물어보세요..."
                className="w-full bg-transparent border-none rounded-none pl-6 pr-14 py-4 md:py-5 font-bold text-sm md:text-base outline-none text-slate-800 placeholder:text-slate-300"
              />
              <button 
                type="submit"
                disabled={isLoading || !input.trim()}
                className="absolute right-2 w-12 h-12 md:w-14 md:h-14 bg-[#00479d] text-[#ccdb00] rounded-full flex items-center justify-center shadow-lg hover:shadow-blue-200 hover:scale-105 active:scale-90 transition-all disabled:opacity-20 disabled:grayscale disabled:scale-100"
              >
                <Send className="w-5 h-5 md:w-6 h-6" />
              </button>
            </div>
          </form>
          
          <div className="flex flex-wrap items-center justify-center gap-6 text-[11px] font-black text-slate-300 uppercase tracking-widest">
             <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 rounded-full border border-slate-100">
               <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> 10.15 Policy Engine
             </div>
             <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 rounded-full border border-slate-100">
               <Zap className="w-3.5 h-3.5 text-amber-500" /> NH-PRO API Active
             </div>
             <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 rounded-full border border-slate-100">
               <HelpCircle className="w-3.5 h-3.5 text-blue-500" /> NH-GEM Internal v3.0
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiInquiry;
