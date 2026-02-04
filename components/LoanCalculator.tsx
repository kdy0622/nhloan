
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
  ExternalLink,
  TrendingUp,
  Landmark,
  BadgePercent,
  AlertCircle
} from 'lucide-react';

type LoanPurpose = '구입자금' | '생활자금' | '';
type LoanRegion = '규제지역' | '수도권(비규제)' | '기타지역' | '';

interface FailReason {
  title: string;
  detail: string;
}

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
  const [maxLimit, setMaxLimit] = useState<number>(0);
  const [finalStatus, setFinalStatus] = useState<'idle' | 'success' | 'fail'>('idle');
  const [capApplied, setCapApplied] = useState<boolean>(false);
  const [capMessage, setCapMessage] = useState<string>('');
  const [failReasons, setFailReasons] = useState<FailReason[]>([]);
  const [obligations, setObligations] = useState<string[]>([]);

  const reset = () => {
    setLoanPurpose(''); setHousePrice(0); setLoanAmount(0); setAnnualIncome(0);
    setExistingDebt(0); setDsrValue(0); setLoanRegion(''); setHouseOwnership('');
    setSpecialCondition(''); setFailReasons([]); setFinalStatus('idle');
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
    // DSR 값이 입력되기 전(0 이하)에는 상태를 'idle'로 유지하여 가능/불가 여부를 보이지 않게 함
    if (!loanPurpose || !loanRegion || !houseOwnership || dsrValue <= 0) { 
      setFinalStatus('idle'); 
      return; 
    }
    
    let lp = 0;
    if (loanPurpose === '구입자금') {
      if (loanRegion === '규제지역') {
        if (specialCondition === '생애최초') lp = 70;
        else if (specialCondition === '서민/실수요자') lp = 60;
        else if (houseOwnership === '무주택' || houseOwnership === '1주택(처분조건부)') lp = 40;
        else if (houseOwnership === '2주택이상') lp = 0;
      } else if (loanRegion === '수도권(비규제)') {
        if (specialCondition === '생애최초') lp = 70;
        else if (houseOwnership === '무주택' || houseOwnership === '1주택(처분조건부)') lp = 70;
        else if (houseOwnership === '2주택이상') lp = 0;
      } else if (loanRegion === '기타지역') {
        if (specialCondition === '생애최초') lp = 80;
        else if (houseOwnership === '무주택') lp = 70;
        else lp = 60; // 1주택이상
      }
    } else if (loanPurpose === '생활자금') {
      if (houseOwnership === '1주택') {
        lp = (loanRegion === '규제지역') ? 40 : 70;
      } else if (houseOwnership === '2주택이상') {
        lp = (loanRegion === '규제지역') ? 30 : 60;
      }
    }

    const calcLtvAmt = housePrice * (lp / 100);
    setLtvPercent(lp); setLtvAmount(calcLtvAmt);

    let curMax = calcLtvAmt;
    let isCap = false;
    let capMsg = '';
    let reasons: FailReason[] = [];

    // 정책 상한 체크 (10.15 대책)
    if (loanPurpose === '구입자금' && (loanRegion === '규제지역' || loanRegion === '수도권(비규제)')) {
      let capLimit = 0;
      if (housePrice <= 1500) capLimit = 600;
      else if (housePrice <= 2500) capLimit = 400;
      else capLimit = 200;

      if (calcLtvAmt > capLimit) {
        curMax = capLimit;
        isCap = true;
        capMsg = `10.15 대책 정책상한 적용 (${capLimit}백만원)`;
      }
    }

    // 비수도권 생초 상한
    if (loanPurpose === '구입자금' && loanRegion === '기타지역' && specialCondition === '생애최초' && calcLtvAmt > 600) {
      curMax = 600;
      isCap = true;
      capMsg = '비수도권 생애최초 정책상한 (600백만원) 적용';
    }

    // 생활자금 합산 한도 (1억)
    if (loanPurpose === '생활자금' && (loanRegion === '규제지역' || loanRegion === '수도권(비규제)')) {
      const remainingLimit = 100 - existingDebt;
      if (loanAmount + existingDebt > 100) {
        curMax = Math.min(calcLtvAmt, Math.max(0, remainingLimit));
        isCap = true;
        capMsg = '생활안정자금 인별 합산 100백만원 상한 적용';
      }
    }

    setMaxLimit(curMax); setCapApplied(isCap); setCapMessage(capMsg);

    let status: 'success' | 'fail' | 'idle' = 'idle';
    let obs: string[] = [];

    // 불가 사유 분석
    if (lp === 0 && loanAmount > 0) {
      reasons.push({ title: '규제 대상', detail: '해당 지역 및 주택 보유 수 기준, 현 지침상 주담대 취급이 원칙적으로 불가합니다.' });
    }
    if (loanAmount > curMax) {
      if (isCap) {
        reasons.push({ title: '정책 상한 초과', detail: `10.15 대책 등에 따른 가격별/용도별 정책 상한액(${curMax.toLocaleString()}백만원)을 초과하였습니다.` });
      } else {
        reasons.push({ title: 'LTV 한도 초과', detail: `담보인정비율(LTV)에 따른 산출 한도(${curMax.toLocaleString()}백만원)를 초과하였습니다.` });
      }
    }
    if (dsrValue > 50) {
      reasons.push({ title: 'DSR 기준 초과', detail: `차주 상환능력 심사(DSR) 기준 50%를 초과(${dsrValue.toFixed(2)}%)하였습니다.` });
    }

    if (loanAmount <= 0) {
      status = 'idle';
    } else if (reasons.length > 0) {
      status = 'fail';
    } else {
      status = 'success';
      if (loanPurpose === '구입자금') {
        if (houseOwnership === '1주택(처분조건부)') obs.push('6개월 내 기존주택 처분 및 등기이전 완료 의무');
        if (houseOwnership === '무주택' && (loanRegion === '규제지역' || loanRegion === '수도권(비규제)')) obs.push('대출 실행 후 6개월 내 대상 주택 전입 의무');
      }
    }

    setFinalStatus(status); setFailReasons(reasons); setObligations(obs);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-4 pb-10 font-sans text-slate-800 animate-in fade-in duration-500">
      <header className="bg-[#00479d] rounded-2xl p-5 text-white shadow-md text-center border-b-4 border-[#ccdb00]">
        <h1 className="text-xl md:text-2xl font-black flex items-center justify-center gap-3 tracking-tighter">
          <Home className="w-6 h-6 text-[#ccdb00]" /> 주택담보대출 가능여부 통합 검증
        </h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: 심사 정보 입력 */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 space-y-4 h-fit">
          <div className="flex items-center gap-2 border-b border-slate-50 pb-3 mb-2">
             <FileText className="w-5 h-5 text-[#00479d]" />
             <h2 className="text-base font-black text-slate-700">심사 정보 입력</h2>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider">용도 구분</label>
              <select value={loanPurpose} onChange={(e) => setLoanPurpose(e.target.value as LoanPurpose)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[14px] font-bold outline-none focus:border-[#00479d] focus:ring-2 focus:ring-blue-50 transition-all">
                <option value="">용도 선택</option>
                <option value="구입자금">구입자금</option>
                <option value="생활자금">생활자금</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider">대출 지역</label>
              <select value={loanRegion} onChange={(e) => setLoanRegion(e.target.value as LoanRegion)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[14px] font-bold outline-none focus:border-[#00479d] focus:ring-2 focus:ring-blue-50 transition-all">
                <option value="">지역 선택</option>
                <option value="규제지역">규제지역</option>
                <option value="수도권(비규제)">수도권 (비규제)</option>
                <option value="기타지역">기타지역 (비수도권)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider">주택 가격 (백만원)</label>
              <input type="number" value={housePrice || ''} onChange={(e) => setHousePrice(Number(e.target.value))}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-[14px] font-black outline-none focus:ring-2 focus:ring-blue-50" placeholder="예: 500" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider">신청 금액 (백만원)</label>
              <input type="number" value={loanAmount || ''} onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-[14px] font-black outline-none focus:ring-2 focus:ring-blue-50" placeholder="예: 300" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider">주택 보유 상태</label>
              <select value={houseOwnership} onChange={(e) => setHouseOwnership(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-[14px] font-bold outline-none transition-all focus:ring-2 focus:ring-blue-50">
                <option value="">상태 선택</option>
                {getOwnershipOptions().map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider">DSR (%)</label>
                <a href="https://xn--989a00af8jnslv3dba.com/DSR" target="_blank" className="text-[10px] text-blue-600 flex items-center gap-1 font-black hover:underline transition-all">DSR 계산기 <ExternalLink className="w-2.5 h-2.5" /></a>
              </div>
              <input type="number" value={dsrValue || ''} onChange={(e) => setDsrValue(Number(e.target.value))}
                className="w-full bg-blue-50/30 border border-blue-100 rounded-xl px-3 py-2 text-[14px] font-black outline-none focus:ring-2 focus:ring-blue-100" placeholder="0.00" step="0.01" />
            </div>
          </div>

          {loanPurpose === '생활자금' && (
            <div className="space-y-1.5 animate-in slide-in-from-top-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider">기존 생활자금 대출 잔액 (백만원)</label>
              <input type="number" value={existingDebt || ''} onChange={(e) => setExistingDebt(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[14px] font-bold outline-none" placeholder="0" />
              <p className="text-[10px] text-slate-400 font-bold">* 규제/수도권 합산 최대 100백만원</p>
            </div>
          )}

          <div className={`space-y-1.5 ${loanPurpose !== '구입자금' && 'opacity-30'}`}>
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider">특례 조건 (구입자금용)</label>
            <select value={specialCondition} onChange={(e) => setSpecialCondition(e.target.value)} disabled={loanPurpose !== '구입자금'}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-[14px] font-bold outline-none transition-all">
              <option value="">해당없음 (일반)</option>
              <option value="생애최초">생애최초</option>
              <option value="서민/실수요자">서민/실수요자</option>
            </select>
          </div>

          <button onClick={reset} className="w-full py-3 text-slate-400 font-bold text-[11px] border-t border-dashed mt-4 hover:text-slate-600 transition-colors flex items-center justify-center gap-2 uppercase tracking-widest">
            <RefreshCcw className="w-3 h-3" /> 모든 항목 초기화
          </button>
        </section>

        {/* Right: Results & Reference Content */}
        <div className="space-y-4">
          <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
            <div className="flex items-center gap-2 border-b border-slate-50 pb-3 mb-3">
              <ClipboardCheck className="w-5 h-5 text-[#00479d]" />
              <h2 className="text-base font-black text-slate-700">LTV 한도 산출 결과</h2>
            </div>
            <div className="grid grid-cols-2 gap-3 text-[13px] font-bold mb-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="block text-[10px] text-slate-400 mb-1">적용 LTV 비율</span>
                <span className="text-[#00479d] text-lg font-black">{ltvPercent}%</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="block text-[10px] text-slate-400 mb-1">단순 산출 금액</span>
                <span className="text-[#00479d] text-lg font-black">{ltvAmount.toLocaleString()} 백만원</span>
              </div>
              <div className="p-4 bg-blue-50/50 rounded-xl col-span-2 text-center border-2 border-blue-100 shadow-sm">
                <span className="block text-[11px] text-[#00479d] mb-1 font-black uppercase tracking-wider">최종 정책 한도 (규제 상한 반영)</span>
                <span className="text-[#00479d] font-black text-3xl">{maxLimit.toLocaleString()} <span className="text-sm">백만원</span></span>
              </div>
            </div>
            {capApplied && (
              <div className="p-3.5 bg-amber-50 text-[11px] font-bold text-amber-700 rounded-xl border border-amber-100 flex items-start gap-2 animate-in slide-in-from-top-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{capMessage}</span>
              </div>
            )}
          </section>

          {/* DSR 입력 후에만 노출되는 최종 결과 영역 */}
          <section className="space-y-2">
            {finalStatus === 'idle' ? (
               <div className="p-8 rounded-3xl bg-slate-50 border-2 border-dashed border-slate-200 text-center space-y-3 shadow-inner">
                  <Calculator className="w-8 h-8 text-slate-300 mx-auto" />
                  <div>
                    <p className="text-[13px] font-black text-slate-400">DSR 값을 입력하십시오.</p>
                    <p className="text-[10px] font-bold text-slate-300 mt-1 uppercase tracking-tight">Financial Eligibility Result</p>
                  </div>
               </div>
            ) : (
              <div className="animate-in zoom-in-95 duration-300 space-y-3">
                <div className={`p-5 rounded-3xl text-center shadow-lg border-4 ${
                  finalStatus === 'success' ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-rose-600 border-rose-500 text-white'
                }`}>
                  <div className="flex items-center justify-center gap-2 mb-1">
                    {finalStatus === 'success' ? <CheckCircle2 className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
                    <h3 className="text-2xl font-black">{finalStatus === 'success' ? '최종 대출 가능' : '최종 대출 불가'}</h3>
                  </div>
                  <p className="text-[11px] opacity-80 font-bold">{finalStatus === 'success' ? '지침 및 한도 규정을 충족합니다.' : '현행 지침상 취급이 제한되는 사유가 발견되었습니다.'}</p>
                </div>
                
                {finalStatus === 'fail' && (
                  <div className="space-y-2 animate-in slide-in-from-top-2">
                    {failReasons.map((reason, idx) => (
                      <div key={idx} className="p-4 bg-rose-50 border border-rose-100 rounded-2xl shadow-sm flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-[13px] font-black text-rose-900">{reason.title}</p>
                          <p className="text-[11px] font-bold text-rose-700 leading-relaxed mt-0.5">{reason.detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {finalStatus === 'success' && obligations.length > 0 && (
                  <div className="space-y-2 animate-in slide-in-from-top-2">
                    {obligations.map((ob, idx) => (
                      <div key={idx} className="p-3.5 bg-blue-50 border-l-4 border-blue-500 text-[11px] font-black text-blue-900 rounded-r-2xl shadow-sm flex items-center gap-3">
                        <ShieldCheck className="w-4 h-4 text-blue-500" />
                        <span>{ob}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </section>

          {/* 통합 참고자료 섹션 (완벽 복구 및 보강) */}
          <section className="bg-white rounded-3xl border border-slate-100 p-6 space-y-6 shadow-sm">
            <div className="flex items-center gap-2 border-b border-slate-50 pb-3">
              <Info className="w-5 h-5 text-[#00479d]" />
              <h3 className="text-sm font-black text-slate-800 tracking-tight">📚 실무 통합 참고자료 (10.15 지침 반영)</h3>
            </div>
            
            <div className="space-y-6">
               {/* 10.15 대책 상한표 */}
               <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-2 mb-3">
                    <Landmark className="w-4 h-4 text-rose-600" />
                    <strong className="text-[11px] text-rose-800 font-black">⚠️ 10.15 대책: 수도권/규제지역 주택가격별 상한</strong>
                  </div>
                  <table className="w-full text-[11px] text-left border-collapse bg-white rounded-xl overflow-hidden shadow-sm">
                    <thead className="bg-rose-50/50">
                      <tr>
                        <th className="p-2 border-b border-rose-100 text-rose-900 font-black">주택가격 (시가 기준)</th>
                        <th className="p-2 border-b border-rose-100 text-rose-900 font-black text-right">구입자금 상한액</th>
                      </tr>
                    </thead>
                    <tbody className="font-bold text-slate-700">
                      <tr className="hover:bg-slate-50"><td className="p-2 border-b border-slate-50">15억 이하</td><td className="p-2 border-b border-slate-50 text-right text-rose-600 font-black">600백만원</td></tr>
                      <tr className="hover:bg-slate-50"><td className="p-2 border-b border-slate-50">15억 초과 ~ 25억</td><td className="p-2 border-b border-slate-50 text-right text-rose-600 font-black">400백만원</td></tr>
                      <tr className="hover:bg-slate-50"><td className="p-2 border-b border-slate-50">25억 초과</td><td className="p-2 border-b border-slate-50 text-right text-rose-600 font-black">200백만원</td></tr>
                    </tbody>
                  </table>
               </div>

               {/* 구입자금 LTV 상세표 */}
               <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <BadgePercent className="w-4 h-4 text-blue-600" />
                    <strong className="text-[11px] text-blue-800 font-black">📋 구입자금 LTV 기준표</strong>
                  </div>
                  <div className="overflow-x-auto rounded-xl border border-slate-100 shadow-sm">
                    <table className="w-full text-[10px] md:text-[11px] text-left border-collapse bg-white">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="p-2 border text-slate-500 font-black">구분</th>
                          <th className="p-2 border text-slate-500 font-black">규제지역</th>
                          <th className="p-2 border text-slate-500 font-black">수도권</th>
                          <th className="p-2 border text-slate-500 font-black">비수도권</th>
                        </tr>
                      </thead>
                      <tbody className="font-bold">
                        <tr><td className="p-2 border bg-blue-50/30">생애최초</td><td className="p-2 border">70%</td><td className="p-2 border">70%</td><td className="p-2 border">80% (6억한도)</td></tr>
                        <tr><td className="p-2 border bg-blue-50/30">서민/실수요</td><td className="p-2 border">60%</td><td className="p-2 border">-</td><td className="p-2 border">-</td></tr>
                        <tr><td className="p-2 border bg-blue-50/30">무주택</td><td className="p-2 border">40%</td><td className="p-2 border">70%</td><td className="p-2 border">70%</td></tr>
                        <tr><td className="p-2 border bg-blue-50/30">1주택(처분)</td><td className="p-2 border">40%</td><td className="p-2 border">70%</td><td className="p-2 border">60%</td></tr>
                        <tr><td className="p-2 border bg-blue-50/30">2주택 이상</td><td className="p-2 border text-rose-600">취급불가</td><td className="p-2 border text-rose-600">취급불가</td><td className="p-2 border">60%</td></tr>
                      </tbody>
                    </table>
                  </div>
               </div>

               {/* 생활자금 및 기타 유의사항 */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-emerald-50/30 p-4 rounded-2xl border border-emerald-100/50">
                    <div className="flex items-center gap-2 mb-3">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <strong className="text-[11px] text-emerald-800 font-black">📋 주요 실무 유의사항</strong>
                    </div>
                    <ul className="text-[10px] font-bold space-y-2 text-slate-600">
                      <li className="flex items-start gap-1.5">• <span>생활자금: 수도권 인별 합산 <span className="text-rose-600">100백만원</span> 제한</span></li>
                      <li className="flex items-start gap-1.5">• <span>처분조건: <span className="text-blue-600">6개월</span> 내 처분 및 등기이전 필수</span></li>
                      <li className="flex items-start gap-1.5">• <span>전입의무: 수도권 무주택 <span className="text-blue-600">6개월</span> 내 전입 필수</span></li>
                      <li className="flex items-start gap-1.5">• <span>DSR 기준: 가계 50% 이하 필수 충족</span></li>
                    </ul>
                  </div>

                  <div className="bg-slate-900 p-4 rounded-2xl text-white shadow-inner">
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp className="w-4 h-4 text-[#ccdb00]" />
                      <strong className="text-[11px] font-black tracking-tight">⭐ 영업점장 우대금리 (중요)</strong>
                    </div>
                    <div className="grid grid-cols-1 gap-1.5 text-[10px] font-bold opacity-90">
                      <div className="flex justify-between border-b border-white/10 pb-1"><span>개인(소호/CSS)</span><span className="text-[#ccdb00]">0.7%</span></div>
                      <div className="flex justify-between border-b border-white/10 pb-1"><span>주택/오피/상가</span><span className="text-[#ccdb00]">1.3%</span></div>
                      <div className="flex justify-between border-b border-white/10 pb-1"><span>기업평가(B등급↑)</span><span className="text-[#ccdb00]">2.0%</span></div>
                      <div className="flex justify-between pt-1"><span>최저 가이드 금리</span><span className="text-[#ccdb00] font-black">4.70%~</span></div>
                    </div>
                  </div>
               </div>

               <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-[10px] font-bold text-slate-500 leading-relaxed">
                  <p className="flex items-center gap-2 mb-1"><Info className="w-3 h-3 text-[#00479d]" /> 감정서 유효기간: 주택 5년, 기타 3년 (발행 3개월 내 사용)</p>
                  <p className="flex items-center gap-2"><Info className="w-3 h-3 text-[#00479d]" /> 수입인지: 1억 이하(7만), 10억 이하(15만) [은행:고객 50% 부담]</p>
               </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default LoanCalculator;
