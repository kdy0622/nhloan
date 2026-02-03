
import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  RefreshCcw, 
  ExternalLink,
  ShieldCheck,
  FileText,
  MapPin,
  ClipboardCheck,
  AlertTriangle,
  Info,
  ArrowRightCircle,
  Library,
  ChevronRight,
  Home
} from 'lucide-react';

type LoanPurpose = '구입자금' | '생활자금' | '';
type LoanRegion = '규제지역' | '수도권(비규제)' | '기타지역' | '';

const LoanCalculator: React.FC = () => {
  // Inputs
  const [loanPurpose, setLoanPurpose] = useState<LoanPurpose>('');
  const [housePrice, setHousePrice] = useState<number>(0);
  const [loanAmount, setLoanAmount] = useState<number>(0);
  const [annualIncome, setAnnualIncome] = useState<number>(0);
  const [existingDebt, setExistingDebt] = useState<number>(0);
  const [dsrValue, setDsrValue] = useState<number>(0);
  const [loanRegion, setLoanRegion] = useState<LoanRegion>('');
  const [houseOwnership, setHouseOwnership] = useState<string>('');
  const [specialCondition, setSpecialCondition] = useState<string>('');

  // Results
  const [ltvPercent, setLtvPercent] = useState<number>(0);
  const [ltvAmount, setLtvAmount] = useState<number>(0);
  const [actualLtv, setActualLtv] = useState<number>(0);
  const [maxLimit, setMaxLimit] = useState<number>(0);
  const [finalStatus, setFinalStatus] = useState<'idle' | 'success' | 'fail'>('idle');
  const [capApplied, setCapApplied] = useState<boolean>(false);
  const [capMessage, setCapMessage] = useState<string>('');
  const [alertMsg, setAlertMsg] = useState<string>('');
  const [obligations, setObligations] = useState<string[]>([]);

  // Reset function
  const reset = () => {
    setLoanPurpose(''); setHousePrice(0); setLoanAmount(0); setAnnualIncome(0);
    setExistingDebt(0); setDsrValue(0); setLoanRegion(''); setHouseOwnership('');
    setSpecialCondition('');
  };

  // Logic: Update Ownership Options (Sync with Legacy HTML)
  const getOwnershipOptions = () => {
    if (loanPurpose === '생활자금') {
      return [
        { value: '1주택', label: '1주택' },
        { value: '2주택이상', label: '2주택 이상' }
      ];
    } else if (loanPurpose === '구입자금') {
      if (loanRegion === '기타지역') {
        return [
          { value: '무주택', label: '무주택' },
          { value: '1주택이상', label: '1주택 이상' }
        ];
      } else {
        return [
          { value: '무주택', label: '무주택' },
          { value: '1주택(처분조건부)', label: '1주택 (처분 조건부)' },
          { value: '2주택이상', label: '2주택 이상' }
        ];
      }
    }
    return [
      { value: '무주택', label: '무주택' },
      { value: '1주택(처분조건부)', label: '1주택 (처분 조건부)' },
      { value: '2주택이상', label: '2주택 이상' }
    ];
  };

  useEffect(() => {
    calculate();
  }, [loanPurpose, housePrice, loanAmount, annualIncome, existingDebt, dsrValue, loanRegion, houseOwnership, specialCondition]);

  const calculate = () => {
    // DSR 값이 입력되지 않았거나 필수 항목이 누락된 경우 '입력 대기중' 유지
    if (!loanPurpose || !loanRegion || !houseOwnership || dsrValue <= 0 || loanAmount <= 0) {
      setFinalStatus('idle');
      
      // 하지만 LTV 계산은 시각적으로 보여줌 (사용자 편의)
      let tempLp = 0;
      if (loanPurpose === '구입자금') {
        if (loanRegion === '규제지역') {
          if (specialCondition === '생애최초') tempLp = 70;
          else if (specialCondition === '서민/실수요자') tempLp = 60;
          else if (houseOwnership === '무주택') tempLp = 40;
          else if (houseOwnership === '1주택(처분조건부)') tempLp = 40;
        } else if (loanRegion === '수도권(비규제)') {
          if (specialCondition === '생애최초') tempLp = 70;
          else if (houseOwnership === '무주택') tempLp = 70;
          else if (houseOwnership === '1주택(처분조건부)') tempLp = 70;
        } else if (loanRegion === '기타지역') {
          if (specialCondition === '생애최초') tempLp = 80;
          else if (houseOwnership === '무주택') tempLp = 70;
          else tempLp = 60;
        }
      }
      setLtvPercent(tempLp);
      setLtvAmount(housePrice * (tempLp / 100));
      return;
    }

    let lp = 0;
    
    // 1. Base LTV Percentage Logic
    if (loanPurpose === '구입자금') {
      if (loanRegion === '규제지역') {
        if (specialCondition === '생애최초') lp = 70;
        else if (specialCondition === '서민/실수요자') lp = 60;
        else if (houseOwnership === '무주택') lp = 40;
        else if (houseOwnership === '1주택(처분조건부)') lp = 40;
        else if (houseOwnership === '2주택이상') lp = 0;
      } else if (loanRegion === '수도권(비규제)') {
        if (specialCondition === '생애최초') lp = 70;
        else if (houseOwnership === '무주택') lp = 70;
        else if (houseOwnership === '1주택(처분조건부)') lp = 70;
        else if (houseOwnership === '2주택이상') lp = 0;
      } else if (loanRegion === '기타지역') {
        if (specialCondition === '생애최초') lp = 80;
        else if (houseOwnership === '무주택') lp = 70;
        else lp = 60;
      }
    } else if (loanPurpose === '생활자금') {
      if (houseOwnership === '1주택' || houseOwnership === '1주택(처분조건부)') {
        if (loanRegion === '규제지역') lp = 40;
        else lp = 70;
      } else if (houseOwnership === '2주택이상') {
        if (loanRegion === '규제지역') lp = 30;
        else lp = 60;
      }
    }

    setLtvPercent(lp);
    const calculatedLtvAmount = housePrice * (lp / 100);
    setLtvAmount(calculatedLtvAmount);
    setActualLtv(housePrice > 0 ? (loanAmount / housePrice) * 100 : 0);

    // 2. Cap Logic (10.15 Measure)
    let currentMaxLimit = calculatedLtvAmount;
    let isCapApplied = false;
    let currentCapMsg = '';

    if (loanPurpose === '구입자금' && (loanRegion === '규제지역' || loanRegion === '수도권(비규제)')) {
      let capLimit = 0;
      if (housePrice <= 1500) { capLimit = 600; currentCapMsg = '15억 이하: 최대 6억'; }
      else if (housePrice <= 2500) { capLimit = 400; currentCapMsg = '15~25억: 최대 4억'; }
      else { capLimit = 200; currentCapMsg = '25억 초과: 최대 2억'; }
      
      if (calculatedLtvAmount > capLimit) {
        currentMaxLimit = capLimit;
        isCapApplied = true;
      }
    }

    if (loanPurpose === '구입자금' && loanRegion === '기타지역' && specialCondition === '생애최초') {
      if (calculatedLtvAmount > 600) {
        currentMaxLimit = 600;
        isCapApplied = true;
        currentCapMsg = '비수도권 생애최초: 최대 6억';
      }
    }

    if (loanPurpose === '생활자금' && (loanRegion === '규제지역' || loanRegion === '수도권(비규제)')) {
      const totalLifeFund = loanAmount + existingDebt;
      if (totalLifeFund > 100) {
        currentMaxLimit = Math.min(calculatedLtvAmount, Math.max(0, 100 - existingDebt));
        isCapApplied = true;
        currentCapMsg = '합산 한도 초과 (최대 1억)';
      }
    }

    setMaxLimit(currentMaxLimit);
    setCapApplied(isCapApplied);
    setCapMessage(currentCapMsg);

    // 3. Final Judgment
    let status: 'success' | 'fail' | 'idle' = 'idle';
    let msg = '';
    let obs: string[] = [];

    if (lp === 0) {
      status = 'fail'; msg = '해당 조건 불가';
    } else if (loanAmount > currentMaxLimit) {
      status = 'fail'; msg = `한도 초과 (최대: ${currentMaxLimit.toFixed(0)}백만)`;
    } else if (dsrValue > 50) {
      status = 'fail'; msg = 'DSR 50% 초과 불가';
    } else {
      status = 'success'; msg = '대출 가능';
      if (loanPurpose === '구입자금' && houseOwnership === '1주택(처분조건부)') {
        obs.push('6개월 내 기존주택 처분 및 이전등기 의무 (미이행 시 기한이익 상실)');
      }
      if (loanPurpose === '구입자금' && houseOwnership === '무주택' && loanRegion === '수도권(비규제)') {
        obs.push('6개월 내 대상 주택 전입 신고 의무 (미이행 시 기한이익 상실)');
      }
    }

    setFinalStatus(status);
    setAlertMsg(msg);
    setObligations(obs);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-24 font-sans text-[#333]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#667eea] to-[#764ba2] rounded-3xl p-10 text-white shadow-xl text-center">
        <h1 className="text-3xl font-black flex items-center justify-center gap-3">
          <Home className="w-10 h-10" />
          주택담보대출 가능여부 검증
        </h1>
        <p className="mt-3 text-white/80 font-medium text-sm">정보를 입력하시면 실시간으로 대출 가능 여부를 확인할 수 있습니다</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left: Inputs */}
        <div className="space-y-8">
          <section className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
            <h2 className="text-lg font-black text-slate-800 flex items-center gap-2 mb-8 border-b-2 border-[#667eea] pb-3">
              <FileText className="w-6 h-6 text-[#667eea]" />
              📝 기본 정보 입력
            </h2>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-500">용도 구분 (먼저 선택)</label>
                <select value={loanPurpose} onChange={(e) => setLoanPurpose(e.target.value as LoanPurpose)}
                  className="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-3.5 font-bold focus:border-[#667eea] outline-none transition-all">
                  <option value="">선택하세요</option>
                  <option value="구입자금">구입자금 (주택구입)</option>
                  <option value="생활자금">생활자금 (생활안정자금)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-500">주택 가격 (시가)</label>
                <div className="relative">
                  <input type="number" value={housePrice || ''} onChange={(e) => setHousePrice(Number(e.target.value))}
                    className="w-full bg-white border-2 border-slate-200 rounded-xl pl-4 pr-16 py-3.5 font-bold outline-none focus:border-[#667eea]" placeholder="예: 500" />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">백만원</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-500">대출 요청 금액</label>
                <div className="relative">
                  <input type="number" value={loanAmount || ''} onChange={(e) => setLoanAmount(Number(e.target.value))}
                    className="w-full bg-white border-2 border-slate-200 rounded-xl pl-4 pr-16 py-3.5 font-bold outline-none focus:border-[#667eea]" placeholder="예: 300" />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">백만원</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-500">부부 합산 연소득</label>
                <div className="relative">
                  <input type="number" value={annualIncome || ''} onChange={(e) => setAnnualIncome(Number(e.target.value))}
                    className="w-full bg-white border-2 border-slate-200 rounded-xl pl-4 pr-16 py-3.5 font-bold outline-none focus:border-[#667eea]" placeholder="예: 80" />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">백만원</span>
                </div>
              </div>

              {loanPurpose === '생활자금' && (
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-500">기존 생활자금 대출 잔액</label>
                  <div className="relative">
                    <input type="number" value={existingDebt || ''} onChange={(e) => setExistingDebt(Number(e.target.value))}
                      className="w-full bg-white border-2 border-slate-200 rounded-xl pl-4 pr-16 py-3.5 font-bold outline-none focus:border-[#667eea]" placeholder="0" />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">백만원</span>
                  </div>
                </div>
              )}

              {/* DSR Input Section */}
              <div className="bg-[#f0f4ff] border-2 border-[#667eea] rounded-2xl p-6 space-y-4 shadow-sm">
                <h3 className="text-sm font-black text-[#667eea] flex items-center gap-2">💰 DSR 입력</h3>
                <p className="text-[11px] text-slate-500 font-bold">외부 계산기로 산출한 DSR을 수기로 입력하세요</p>
                <a href="https://xn--989a00af8jnslv3dba.com/DSR" target="_blank" className="block w-full bg-gradient-to-r from-[#f093fb] to-[#f5576c] text-white text-center py-3 rounded-xl font-bold text-xs shadow-md hover:scale-[1.02] transition-transform">
                   🔗 DSR 계산기 열기
                </a>
                <div className="space-y-2 mt-4">
                   <label className="text-[11px] font-bold text-slate-500 uppercase">DSR (%) 입력</label>
                   <div className="relative">
                     <input type="number" value={dsrValue || ''} onChange={(e) => setDsrValue(Number(e.target.value))}
                       className="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-3.5 font-bold text-lg outline-none focus:border-[#667eea]" placeholder="예: 45.5" />
                     <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-slate-300">%</span>
                   </div>
                   <p className="text-[10px] text-[#667eea] font-black mt-1 flex items-center gap-1">
                     <Info className="w-3 h-3" /> DSR 계산기로 산출된 값을 수기로 입력하세요.
                   </p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-500">대출 지역 (먼저 선택)</label>
                <select value={loanRegion} onChange={(e) => setLoanRegion(e.target.value as LoanRegion)}
                  className="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-3.5 font-bold text-slate-800 focus:border-[#667eea] outline-none">
                  <option value="">선택하세요</option>
                  <option value="규제지역">규제지역</option>
                  <option value="수도권(비규제)">수도권 (비규제)</option>
                  <option value="기타지역">비수도권 (비규제)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-500">주택 보유 상태</label>
                <select value={houseOwnership} onChange={(e) => setHouseOwnership(e.target.value)}
                  className="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-3.5 font-bold text-slate-800 focus:border-[#667eea] outline-none">
                  <option value="">선택하세요</option>
                  {getOwnershipOptions().map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div className={`space-y-2 transition-opacity ${loanPurpose === '구입자금' ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
                <label className="text-sm font-bold text-slate-500">특례 조건 (구입자금만)</label>
                <select value={specialCondition} onChange={(e) => setSpecialCondition(e.target.value)}
                  className="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-3.5 font-bold text-slate-800 focus:border-[#667eea] outline-none">
                  <option value="">선택하세요</option>
                  <option value="생애최초">생애최초</option>
                  <option value="서민/실수요자">서민/실수요자</option>
                  <option value="일반">일반</option>
                </select>
              </div>
            </div>
            
            <button onClick={reset} className="w-full mt-10 flex items-center justify-center gap-2 py-4 text-slate-400 font-bold hover:text-slate-600 transition-all border-t">
              <RefreshCcw className="w-4 h-4" /> 전체 데이터 초기화
            </button>
          </section>
        </div>

        {/* Right: Results & References */}
        <div className="space-y-8">
          <section className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
            <h2 className="text-lg font-black text-slate-800 flex items-center gap-2 mb-8 border-b-2 border-[#667eea] pb-3">
              <ClipboardCheck className="w-6 h-6 text-[#667eea]" />
              📊 계산 결과
            </h2>
            <div className="space-y-4 font-bold text-slate-600 text-sm">
              <div className="flex justify-between items-center py-3 border-b border-slate-50">
                <span>LTV 한도</span>
                <span className="text-slate-900 font-black">{ltvPercent}%</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-slate-50">
                <span>한도 금액</span>
                <span className="text-slate-900 font-black">{ltvAmount.toLocaleString()} 백만원</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-slate-50">
                <span>신청액 LTV</span>
                <span className="text-slate-900 font-black">{actualLtv.toFixed(2)}%</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span>최종 한도</span>
                <span className="text-[#667eea] text-xl font-black">{maxLimit.toLocaleString()} 백만원</span>
              </div>
            </div>

            {capApplied && (
              <div className="mt-6 bg-[#fff3cd] border-l-4 border-[#ffc107] p-4 rounded-lg text-xs font-bold text-slate-700 animate-in zoom-in-95">
                <p className="flex items-center gap-2 mb-1"><AlertTriangle className="w-4 h-4 text-[#ffc107]" /> <strong>규제 상한 적용</strong></p>
                {capMessage} (최종 한도: {maxLimit.toLocaleString()} 백만원)
              </div>
            )}
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-black text-slate-800 flex items-center gap-2 ml-2">✅ 최종 판단</h2>
            <div className={`p-10 rounded-2xl text-center shadow-lg transition-all ${
              finalStatus === 'success' ? 'bg-gradient-to-r from-[#11998e] to-[#38ef7d] text-white shadow-[#38ef7d]/20' :
              finalStatus === 'fail' ? 'bg-gradient-to-r from-[#eb3349] to-[#f45c43] text-white shadow-[#f45c43]/20' :
              'bg-slate-200 text-slate-400'
            }`}>
              <h3 className="text-3xl font-black tracking-tighter">
                {finalStatus === 'success' ? '✅ 대출 가능' : 
                 finalStatus === 'fail' ? '❌ 대출 불가' : '입력 대기중'}
              </h3>
            </div>
            
            {/* DSR 미입력 시 안내 배너 */}
            {dsrValue <= 0 && loanAmount > 0 && (
               <div className="p-4 rounded-xl bg-blue-50 text-[#00479d] border-2 border-blue-100 text-center font-black text-xs animate-pulse">
                 ⚠️ 정확한 판단을 위해 DSR 수치를 입력해 주세요.
               </div>
            )}

            {alertMsg && finalStatus !== 'idle' && (
              <div className={`p-4 rounded-xl text-center font-bold text-xs ${finalStatus === 'fail' ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>
                {alertMsg}
              </div>
            )}
            {obligations.map((ob, idx) => (
              <div key={idx} className="bg-[#fff8dc] border-l-4 border-[#ff9800] p-4 rounded-lg text-xs font-black text-amber-900 flex items-start gap-3">
                <ShieldCheck className="w-4 h-4 text-[#ff9800] mt-0.5" />
                <span>{ob}</span>
              </div>
            ))}
          </section>

          {/* Reference Materials */}
          <section className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 space-y-10">
            <h2 className="text-lg font-black text-slate-800 flex items-center gap-2 border-b-2 border-[#667eea] pb-3">
              <Library className="w-6 h-6 text-[#667eea]" />
              📚 참고자료
            </h2>

            <div className="space-y-4">
               <h3 className="text-[12px] font-black text-slate-700 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  ⚠️ 10.15 대책: 대출한도 상한 (규제지역 + 수도권 비규제 구입자금)
               </h3>
               <div className="overflow-hidden border border-slate-100 rounded-xl">
                 <table className="w-full text-[11px] text-left border-collapse">
                   <thead className="bg-[#667eea] text-white">
                     <tr><th className="p-3 border-r">주택가격 (시가)</th><th className="p-3">대출한도 상한</th></tr>
                   </thead>
                   <tbody className="font-bold text-slate-600">
                     <tr className="border-t">
                       <td className="p-3 border-r">15억원 이하</td>
                       <td className="p-3 text-[#d63384]">최대 6억원</td>
                     </tr>
                     <tr className="border-t">
                       <td className="p-3 border-r">15억 초과 ~ 25억 이하</td>
                       <td className="p-3 text-[#d63384]">최대 4억원</td>
                     </tr>
                     <tr className="border-t">
                       <td className="p-3 border-r">25억원 초과</td>
                       <td className="p-3 text-[#d63384]">최대 2억원</td>
                     </tr>
                   </tbody>
                 </table>
               </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-[12px] font-black text-slate-700 flex items-center gap-2">
                 <FileText className="w-4 h-4 text-blue-500" />
                 📋 구입자금 LTV 기준
              </h3>
              <div className="overflow-x-auto border border-slate-100 rounded-xl">
                <table className="w-full text-[10px] text-center border-collapse">
                  <thead className="bg-[#667eea] text-white">
                    <tr>
                      <th className="p-2.5 border-r">주택보유</th>
                      <th className="p-2.5 border-r">규제지역</th>
                      <th className="p-2.5 border-r">수도권(비규제)</th>
                      <th className="p-2.5">비수도권(비규제)</th>
                    </tr>
                  </thead>
                  <tbody className="font-bold text-slate-600">
                    <tr className="border-t">
                      <td className="p-2.5 border-r text-left">생애최초</td>
                      <td className="p-2.5 border-r">70%</td>
                      <td className="p-2.5 border-r">70%</td>
                      <td className="p-2.5">80% (최대 6억)</td>
                    </tr>
                    <tr className="border-t">
                      <td className="p-2.5 border-r text-left">서민실수요자</td>
                      <td className="p-2.5 border-r">60%</td>
                      <td className="p-2.5 border-r">-</td>
                      <td className="p-2.5">-</td>
                    </tr>
                    <tr className="border-t">
                      <td className="p-2.5 border-r text-left">무주택</td>
                      <td className="p-2.5 border-r">40%</td>
                      <td className="p-2.5 border-r">70%</td>
                      <td className="p-2.5">70%</td>
                    </tr>
                    <tr className="border-t">
                      <td className="p-2.5 border-r text-left">1주택(처분조건부)</td>
                      <td className="p-2.5 border-r">40%</td>
                      <td className="p-2.5 border-r">70%</td>
                      <td className="p-2.5" rowSpan={2}>60%</td>
                    </tr>
                    <tr className="border-t">
                      <td className="p-2.5 border-r text-left">2주택 이상</td>
                      <td className="p-2.5 border-r">0%</td>
                      <td className="p-2.5 border-r">0%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-[12px] font-black text-slate-700 flex items-center gap-2">
                 <FileText className="w-4 h-4 text-emerald-500" />
                 📋 생활자금 LTV 기준
              </h3>
              <div className="overflow-x-auto border border-slate-100 rounded-xl">
                <table className="w-full text-[10px] text-center border-collapse">
                  <thead className="bg-[#667eea] text-white">
                    <tr>
                      <th className="p-2.5 border-r">주택보유</th>
                      <th className="p-2.5 border-r">규제지역</th>
                      <th className="p-2.5 border-r">수도권</th>
                      <th className="p-2.5">비수도권</th>
                    </tr>
                  </thead>
                  <tbody className="font-bold text-slate-600">
                    <tr className="border-t">
                      <td className="p-2.5 border-r text-left">1주택</td>
                      <td className="p-2.5 border-r">40% (합산 1억)</td>
                      <td className="p-2.5 border-r">70% (합산 1억)</td>
                      <td className="p-2.5">70%</td>
                    </tr>
                    <tr className="border-t">
                      <td className="p-2.5 border-r text-left">2주택 이상</td>
                      <td className="p-2.5 border-r">30~40%* (합산 1억)</td>
                      <td className="p-2.5 border-r">60~70%* (합산 1억)</td>
                      <td className="p-2.5">60~70%*</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-[9px] text-slate-400 font-bold px-1">* 대심위 승인 시 상향 가능</p>
            </div>

            <div className="space-y-4 pt-4 border-t">
              <h3 className="text-[12px] font-black text-slate-700 flex items-center gap-2 px-1">
                <AlertTriangle className="w-4 h-4 text-rose-500" /> 주요 유의사항
              </h3>
              <ul className="space-y-2 text-[11px] font-bold text-slate-600 leading-relaxed list-none">
                <li>• <strong>구입자금:</strong> 2주택 이상은 비수도권 제외 원칙적 불가</li>
                <li>• <strong>생활자금:</strong> 1주택/2주택 이상 모두 가능하나 LTV 한도 차이 있음</li>
                <li className="text-[#d63384]">• 규제지역 및 수도권 구입자금은 주택가격별 상한 적용</li>
                <li className="text-[#d63384]">• 규제지역 및 수도권 생활자금은 기존+신규 합산 최대 1억원</li>
                <li className="text-[#d63384]">• 비수도권 생애최초는 LTV 80% + 최대 6억원</li>
                <li className="text-[#d63384]">• 비수도권은 1주택 이상부터 60% LTV</li>
                <li>• DSR 50% 이하 충족 필요</li>
                <li>• 처분/전입 의무 약정 미이행 시 기한이익 상실 및 3년 주담대 제한</li>
                <li>• 모든 금액 단위는 백만원 (예: 5억원 = 500)</li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default LoanCalculator;
