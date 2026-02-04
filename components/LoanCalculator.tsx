
import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  RefreshCcw, 
  ShieldCheck, 
  FileText, 
  ClipboardCheck, 
  AlertTriangle, 
  Home, 
  Info, 
  XCircle, 
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

type LoanPurpose = '구입자금' | '생활자금' | '';
type LoanRegion = '규제지역' | '수도권(비규제)' | '기타지역' | '';

const LoanCalculator: React.FC = () => {
  const [loanPurpose, setLoanPurpose] = useState<LoanPurpose>('');
  const [housePrice, setHousePrice] = useState<number>(0);
  const [loanAmount, setLoanAmount] = useState<number>(0);
  const [annualIncome, setAnnualIncome] = useState<number>(0);
  const [existingDebt, setExistingDebt] = useState<number>(0);
  const [dsrValue, setDsrValue] = useState<number>(0);
  const [loanRegion, setLoanRegion] = useState<LoanRegion>('');
  const [houseOwnership, setHouseOwnership] = useState<string>('');
  const [specialCondition, setSpecialCondition] = useState<string>('');

  const [ltvPercent, setLtvPercent] = useState<number>(0);
  const [ltvAmount, setLtvAmount] = useState<number>(0);
  const [actualLtv, setActualLtv] = useState<number>(0);
  const [maxLimit, setMaxLimit] = useState<number>(0);
  const [finalStatus, setFinalStatus] = useState<'idle' | 'success' | 'fail'>('idle');
  const [capApplied, setCapApplied] = useState<boolean>(false);
  const [capMessage, setCapMessage] = useState<string>('');
  const [alertMsg, setAlertMsg] = useState<string>('');
  const [failDetail, setFailDetail] = useState<string>('');
  const [obligations, setObligations] = useState<string[]>([]);

  const reset = () => {
    setLoanPurpose(''); setHousePrice(0); setLoanAmount(0); setAnnualIncome(0);
    setExistingDebt(0); setDsrValue(0); setLoanRegion(''); setHouseOwnership('');
    setSpecialCondition(''); setFailDetail(''); setFinalStatus('idle');
  };

  const getOwnershipOptions = () => {
    if (loanPurpose === '생활자금') {
      return [{ value: '1주택', label: '1주택' }, { value: '2주택이상', label: '2주택 이상' }];
    } else if (loanPurpose === '구입자금') {
      if (loanRegion === '기타지역') {
        return [{ value: '무주택', label: '무주택' }, { value: '1주택이상', label: '1주택 이상' }];
      } else {
        return [{ value: '무주택', label: '무주택' }, { value: '1주택(처분조건부)', label: '1주택 (처분 조건부)' }, { value: '2주택이상', label: '2주택 이상' }];
      }
    }
    return [{ value: '무주택', label: '무주택' }, { value: '1주택(처분조건부)', label: '1주택 (처분 조건부)' }, { value: '2주택이상', label: '2주택 이상' }];
  };

  useEffect(() => { calculate(); }, [loanPurpose, housePrice, loanAmount, annualIncome, existingDebt, dsrValue, loanRegion, houseOwnership, specialCondition]);

  const calculate = () => {
    if (!loanPurpose || !loanRegion || !houseOwnership) { setFinalStatus('idle'); return; }
    let lp = 0;
    if (loanPurpose === '구입자금') {
      if (loanRegion === '규제지역') {
        if (specialCondition === '생애최초') lp = 70;
        else if (specialCondition === '서민/실수요자') lp = 60;
        else if (houseOwnership === '무주택' || houseOwnership === '1주택(처분조건부)') lp = 40;
      } else if (loanRegion === '수도권(비규제)') {
        if (specialCondition === '생애최초') lp = 70;
        else if (houseOwnership === '무주택' || houseOwnership === '1주택(처분조건부)') lp = 70;
      } else if (loanRegion === '기타지역') {
        if (specialCondition === '생애최초') lp = 80;
        else if (houseOwnership === '무주택') lp = 70;
        else lp = 60;
      }
    } else if (loanPurpose === '생활자금') {
      const is1H = houseOwnership === '1주택' || houseOwnership === '1주택(처분조건부)';
      if (is1H) lp = loanRegion === '규제지역' ? 40 : 70;
      else lp = loanRegion === '규제지역' ? 30 : 60;
    }

    const calcLtvAmt = housePrice * (lp / 100);
    const calcActualLtv = housePrice > 0 ? (loanAmount / housePrice * 100) : 0;
    setLtvPercent(lp); setLtvAmount(calcLtvAmt); setActualLtv(calcActualLtv);

    let curMax = calcLtvAmt;
    let isCap = false;
    let capMsg = '';
    let capReason = '';

    if (loanPurpose === '구입자금' && (loanRegion === '규제지역' || loanRegion === '수도권(비규제)')) {
      let capLimit = housePrice <= 1500 ? 600 : housePrice <= 2500 ? 400 : 200;
      if (calcLtvAmt > capLimit) { curMax = capLimit; isCap = true; capMsg = `정책상한 적용: ${capLimit}백만`; capReason = `10.15 대책 가격별 상한선이 적용되었습니다.`; }
    }
    if (loanPurpose === '구입자금' && loanRegion === '기타지역' && specialCondition === '생애최초' && calcLtvAmt > 600) { curMax = 600; isCap = true; capMsg = '비수도권 생초상한: 6억'; }
    if (loanPurpose === '생활자금' && (loanRegion === '규제지역' || loanRegion === '수도권(비규제)') && (loanAmount + existingDebt > 100)) {
      curMax = Math.min(calcLtvAmt, Math.max(0, 100 - existingDebt));
      isCap = true; capMsg = '생활자금 합산한도 1억';
    }

    setMaxLimit(curMax); setCapApplied(isCap); setCapMessage(capMsg);

    let status: 'success' | 'fail' | 'idle' = 'idle';
    let detail = '';
    let obs: string[] = [];

    if (loanAmount <= 0) { status = 'idle'; }
    else if (lp === 0) { status = 'fail'; detail = '현 지침상 취급 불가 조건입니다.'; }
    else if (loanAmount > curMax) { status = 'fail'; detail = isCap ? capReason : `LTV 한도(${curMax.toLocaleString()}백만)를 초과하였습니다.`; }
    else if (dsrValue > 50) { status = 'fail'; detail = `DSR 기준(50%)을 초과(${dsrValue.toFixed(2)}%)하였습니다.`; }
    else {
      status = 'success'; detail = '규제 및 상한 기준을 충족합니다.';
      if (loanPurpose === '구입자금') {
        if (houseOwnership === '1주택(처분조건부)') obs.push('6개월 내 기존주택 처분/등기이전 의무');
        if (houseOwnership === '무주택' && loanRegion === '수도권(비규제)') obs.push('6개월 내 대상 주택 전입 의무');
      }
    }
    setFinalStatus(status); setAlertMsg(status === 'success' ? 'DSR 충족 확인됨' : '한도/DSR 미충족'); setFailDetail(detail); setObligations(obs);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-4 pb-10 font-sans text-slate-800">
      <header className="bg-[#00479d] rounded-2xl p-4 text-white shadow-md text-center">
        <h1 className="text-lg md:text-xl font-black flex items-center justify-center gap-2">
          <Home className="w-5 h-5" /> 주담대 가능여부 통합 검증
        </h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: Inputs */}
        <section className="bg-white rounded-2xl shadow-sm border p-4 space-y-3">
          <div className="flex items-center gap-2 border-b pb-2 mb-2">
             <FileText className="w-4 h-4 text-[#00479d]" />
             <h2 className="text-sm font-black">기본 정보 입력</h2>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500">용도 구분</label>
              <select value={loanPurpose} onChange={(e) => setLoanPurpose(e.target.value as LoanPurpose)}
                className="w-full bg-slate-50 border rounded-lg px-2 py-1.5 text-[13px] font-bold outline-none focus:border-[#00479d]">
                <option value="">선택</option>
                <option value="구입자금">구입자금</option>
                <option value="생활자금">생활자금</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500">대출 지역</label>
              <select value={loanRegion} onChange={(e) => setLoanRegion(e.target.value as LoanRegion)}
                className="w-full bg-slate-50 border rounded-lg px-2 py-1.5 text-[13px] font-bold outline-none focus:border-[#00479d]">
                <option value="">선택</option>
                <option value="규제지역">규제지역</option>
                <option value="수도권(비규제)">수도권 (비규제)</option>
                <option value="기타지역">비수도권 (비규제)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500">주택 가격 (백만)</label>
              <input type="number" value={housePrice || ''} onChange={(e) => setHousePrice(Number(e.target.value))}
                className="w-full bg-white border rounded-lg px-2 py-1.5 text-[13px] font-bold outline-none" placeholder="예: 500" />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500">신청 금액 (백만)</label>
              <input type="number" value={loanAmount || ''} onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="w-full bg-white border rounded-lg px-2 py-1.5 text-[13px] font-bold outline-none" placeholder="예: 300" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500">주택 보유 상태</label>
              <select value={houseOwnership} onChange={(e) => setHouseOwnership(e.target.value)}
                className="w-full bg-white border rounded-lg px-2 py-1.5 text-[13px] font-bold outline-none">
                <option value="">선택</option>
                {getOwnershipOptions().map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-bold text-slate-500">DSR (%)</label>
                <a href="https://xn--989a00af8jnslv3dba.com/DSR" target="_blank" className="text-[10px] text-blue-600 flex items-center gap-1">계산기 <ExternalLink className="w-2 h-2" /></a>
              </div>
              <input type="number" value={dsrValue || ''} onChange={(e) => setDsrValue(Number(e.target.value))}
                className="w-full bg-white border rounded-lg px-2 py-1.5 text-[13px] font-bold outline-none" placeholder="예: 45" step="0.01" />
            </div>
          </div>

          <div className={`space-y-1 ${loanPurpose !== '구입자금' && 'opacity-30'}`}>
            <label className="text-[11px] font-bold text-slate-500">특례 조건 (구입자금)</label>
            <select value={specialCondition} onChange={(e) => setSpecialCondition(e.target.value)} disabled={loanPurpose !== '구입자금'}
              className="w-full bg-white border rounded-lg px-2 py-1.5 text-[13px] font-bold outline-none">
              <option value="">해당없음</option>
              <option value="생애최초">생애최초</option>
              <option value="서민/실수요자">서민/실수요자</option>
              <option value="일반">일반</option>
            </select>
          </div>

          <button onClick={reset} className="w-full py-2 text-slate-400 font-bold text-[11px] border-t border-dashed mt-2">
            초기화
          </button>
        </section>

        {/* Right: Results & Reference Content from PDF */}
        <div className="space-y-4">
          <section className="bg-white rounded-2xl shadow-sm border p-4">
            <div className="flex items-center gap-2 border-b pb-2 mb-2">
              <ClipboardCheck className="w-4 h-4 text-[#00479d]" />
              <h2 className="text-sm font-black">계산 결과 요약</h2>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[12px] font-bold">
              <div className="p-2 bg-slate-50 rounded-lg">LTV 한도율: <span className="text-[#00479d]">{ltvPercent}%</span></div>
              <div className="p-2 bg-slate-50 rounded-lg">산출 한도: <span className="text-[#00479d]">{ltvAmount.toLocaleString()}M</span></div>
              <div className="p-2 bg-slate-50 rounded-lg col-span-2 text-center text-sm border-2 border-blue-100">
                최종 한도: <span className="text-[#00479d] font-black">{maxLimit.toLocaleString()} 백만원</span>
              </div>
            </div>
            {capApplied && <div className="mt-2 p-2 bg-amber-50 text-[11px] font-bold text-amber-700 rounded-lg border border-amber-100">{capMessage}</div>}
          </section>

          <section className="space-y-2">
            <div className={`p-4 rounded-xl text-center shadow-md ${
              finalStatus === 'success' ? 'bg-emerald-600 text-white' : finalStatus === 'fail' ? 'bg-rose-600 text-white' : 'bg-slate-200 text-slate-500'
            }`}>
              <h3 className="text-lg font-black">{finalStatus === 'success' ? '대출 가능' : finalStatus === 'fail' ? '대출 불가' : '입력 대기'}</h3>
            </div>
            {finalStatus === 'fail' && <div className="p-3 bg-rose-50 border border-rose-100 rounded-lg text-[12px] font-bold text-rose-800">{failDetail}</div>}
            {obligations.map((ob, idx) => (
              <div key={idx} className="p-2 bg-amber-50 border-l-4 border-amber-400 text-[11px] font-bold text-amber-800">{ob}</div>
            ))}
          </section>

          {/* New High-Density Reference Section from PDF */}
          <section className="bg-slate-50 rounded-2xl border p-4 space-y-4">
            <h3 className="text-xs font-black text-slate-900 border-b pb-2 flex items-center gap-2">
              <Info className="w-3 h-3" /> 실무 지침 참고자료 (PDF 내용 수록)
            </h3>
            
            <div className="grid grid-cols-1 gap-4">
               <div className="bg-white p-3 rounded-xl border">
                  <strong className="block text-[10px] text-blue-600 mb-2">📋 10.15 대책 주택가격별 상한</strong>
                  <table className="w-full text-[10px] text-left border-collapse">
                    <thead className="bg-slate-50">
                      <tr><th className="p-1 border">주택가격</th><th className="p-1 border">구입자금 상한</th></tr>
                    </thead>
                    <tbody className="font-bold">
                      <tr><td className="p-1 border">15억 이하</td><td className="p-1 border text-rose-600">최대 6억</td></tr>
                      <tr><td className="p-1 border">15~25억</td><td className="p-1 border text-rose-600">최대 4억</td></tr>
                      <tr><td className="p-1 border">25억 초과</td><td className="p-1 border text-rose-600">최대 2억</td></tr>
                    </tbody>
                  </table>
               </div>

               <div className="bg-white p-3 rounded-xl border">
                  <strong className="block text-[10px] text-emerald-600 mb-2">📋 주요 유의사항 및 의무</strong>
                  <ul className="text-[10px] font-bold space-y-1 text-slate-600">
                    <li>• 생활자금: 규제/수도권 인별 합산 1억 제한</li>
                    <li>• 처분조건: 6개월 내 처분 및 등기이전 필수</li>
                    <li>• 전입의무: 수도권 무주택자 6개월 내 전입</li>
                    <li>• 감정서: 주택 5년, 기타 3년 (최초사용 3월이내)</li>
                    <li>• 수입인지: 1억이하(7만), 10억이하(15만) [5:5 부담]</li>
                  </ul>
               </div>

               <div className="bg-white p-3 rounded-xl border">
                  <strong className="block text-[10px] text-[#00479d] mb-2">⭐ 영업점장 우대금리</strong>
                  <div className="grid grid-cols-2 gap-2 text-[10px] font-bold">
                    <div className="flex justify-between border-b p-1"><span>개인(CSS)</span><span className="text-blue-600">0.7%</span></div>
                    <div className="flex justify-between border-b p-1"><span>주택/상가</span><span className="text-blue-600">1.3%</span></div>
                    <div className="flex justify-between border-b p-1"><span>기타담보</span><span className="text-blue-600">1.0%</span></div>
                    <div className="flex justify-between border-b p-1"><span>기업평가</span><span className="text-blue-600">2.0%</span></div>
                  </div>
               </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default LoanCalculator;
