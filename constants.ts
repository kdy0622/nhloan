
import { RegionType, InterestRate, SmallDepositProtection, ApprovalAuthority, RTIRatio } from './types';

export const INTEREST_RATES: InterestRate[] = [
  { category: '주거용 아파트', rate: 4.80 },
  { category: '그 외 주택', rate: 4.90 },
  { category: '오피스텔, 상가(토지건물상가)', rate: 5.10 },
  { category: '집합상가, 그외담보', rate: 5.10 },
  { category: '임야', rate: 5.50 }
];

export const SPECIAL_RATES_DATA = [
  { name: '서울주택 (고정)', rate: 4.30 },
  { name: '서울주택 (변동)', rate: 4.50 },
  { name: '교회 신규', rate: 4.30 },
  { name: '여신 최저금리', rate: 4.70 }
];

export const SMALL_DEPOSIT_PROTECTION: SmallDepositProtection[] = [
  { region: RegionType.SEOUL, housing: 55000000, commercial: 22000000, description: '서울특별시' },
  { region: RegionType.OVER_CONCENTRATED, housing: 48000000, commercial: 19000000, description: '과밀억제권역 (세종, 용인, 화성, 김포 등)' },
  { region: RegionType.METROPOLITAN, housing: 28000000, commercial: 13000000, description: '광역시(인천 제외), 안산, 광주, 파주 등' },
  { region: RegionType.OTHERS, housing: 25000000, commercial: 10000000, description: '기타지역' }
];

export const APPROVAL_AUTHORITIES: ApprovalAuthority[] = [
  { id: 1, description: '고위험담보 (서울 외)', limit: '5억원 이하', authority: '지점장', remarks: '나대지, 잡종지, 농지 등' },
  { id: 2, description: '고위험담보 (서울 외)', limit: '5억원 초과', authority: '상임이사', remarks: '현행과 동일' },
  { id: 3, description: '고위험담보 (서울)', limit: '10억원 이하', authority: '지점장', remarks: '전결권 조정 대상' },
  { id: 4, description: '고위험담보 (서울)', limit: '10억원 초과', authority: '상임이사', remarks: '전결권 조정 대상' },
  { id: 5, description: '일반담보 (서울 외)', limit: '10억원 이하', authority: '지점장', remarks: '현행과 동일' },
  { id: 6, description: '일반담보 (서울 외)', limit: '10억원 초과', authority: '상임이사', remarks: '현행과 동일' },
  { id: 7, description: '일반담보 (서울)', limit: '15억원 이하', authority: '지점장', remarks: '전결권 조정 대상' },
  { id: 8, description: '일반담보 (서울)', limit: '15억원 초과', authority: '상임이사', remarks: '전결권 조정 대상' }
];

export const RTI_RATIOS: RTIRatio[] = [
  { category: '주택 임대업', ratio: 1.25 },
  { category: '비주택 임대업', ratio: 1.50 },
  { category: '투기지역/과열지구 주택임대', ratio: 1.50, remarks: 'RTI 1.5배 미만 취급불가' }
];

export const ADD_ON_RATES = {
  MCI: 0.1,
  LIMIT_LOAN: 0.2,
  NON_MEMBER: 0.1,
  CSS_4_5: 0.1,
  CSS_6_7: 0.2,
  CSS_8_UP: 0.3
};
