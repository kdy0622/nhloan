
import { RegionType, InterestRate, SmallDepositProtection, ApprovalAuthority, RTIRatio } from './types';

export const INTEREST_RATES: InterestRate[] = [
  { category: '주거용 아파트', rate: 4.80 },
  { category: '그 외 주택', rate: 4.90 },
  { category: '오피스텔, 상가(토지건물상가)', rate: 5.10 },
  { category: '집합상가, 그외담보', rate: 5.10 },
  { category: '임야', rate: 5.50 },
  { category: '교회 대출 (신규특판)', rate: 4.30 }
];

export const SMALL_DEPOSIT_PROTECTION: SmallDepositProtection[] = [
  { region: RegionType.SEOUL, housing: 55000000, commercial: 22000000, description: '서울특별시' },
  { region: RegionType.OVER_CONCENTRATED, housing: 48000000, commercial: 19000000, description: '과밀억제권역(세종, 용인, 화성, 김포 등)' },
  { region: RegionType.METROPOLITAN, housing: 28000000, commercial: 13000000, description: '광역시(인천 제외), 안산, 광주, 파주, 이천, 평택 등' },
  { region: RegionType.OTHERS, housing: 25000000, commercial: 10000000, description: '기타지역' }
];

export const APPROVAL_AUTHORITIES: ApprovalAuthority[] = [
  { id: 1, description: '고위험담보 (서울 외)', limit: '5억원 이하', authority: '지점장', remarks: '나대지, 농지 등' },
  { id: 2, description: '고위험담보 (서울 외)', limit: '5억원 초과', authority: '상임이사', remarks: '현행 동일' },
  { id: 3, description: '고위험담보 (서울)', limit: '10억원 이하', authority: '지점장', remarks: '전결권 조정' },
  { id: 4, description: '고위험담보 (서울)', limit: '10억원 초과', authority: '상임이사', remarks: '전결권 조정' },
  { id: 5, description: '예적금/일반담보 (서울 외)', limit: '10억원 이하', authority: '지점장', remarks: '현행 동일' },
  { id: 6, description: '예적금/일반담보 (서울 외)', limit: '10억원 초과', authority: '상임이사', remarks: '현행 동일' },
  { id: 7, description: '예적금/일반담보 (서울)', limit: '15억원 이하', authority: '지점장', remarks: '전결권 조정' },
  { id: 8, description: '예적금/일반담보 (서울)', limit: '15억원 초과', authority: '상임이사', remarks: '전결권 조정' }
];

export const RTI_RATIOS: RTIRatio[] = [
  { category: '주택 임대업', ratio: 1.25 },
  { category: '비주택 임대업', ratio: 1.50 },
  { category: '투기지역/과열지구 주택임대', ratio: 1.50, remarks: '1.5배 미만 취급불가' }
];

export const BRANCH_MANAGER_DISCOUNTS = [
  { category: '개인(소호CSS)', value: '0.7%' },
  { category: '주택, 오피스텔, 상가', value: '1.3%' },
  { category: '기타 담보', value: '1.0%' },
  { category: '법인/개인사업자(기업평가)', value: '2.0%' }
];

export const SENSITIVE_INDUSTRIES = [
  "건설업(41,42)", "숙박업(55101/55109)", "음식점(56)", "부동산업(68)", "욕탕업(96121)", 
  "가전/난방 도매(46521/466)", "주유소(47711)", "골프장(91121)", "일반병원(86102)",
  "건설기계임대(69310)", "과실채소도매(46311)", "화장품소매(47813)"
];

export const UPSCALING_GUIDELINES = [
  { title: "법원낙찰률", value: "10% 상향" },
  { title: "분할상환", value: "10% 상향" },
  { title: "주택", value: "최대 80% 가능" },
  { title: "상업지역(3층이상)", value: "5% 상향" },
  { title: "1층 집합상가", value: "5% 상향" }
];
