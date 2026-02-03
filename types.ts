
export enum RegionType {
  SEOUL = '서울',
  OVER_CONCENTRATED = '과밀억제권역',
  METROPOLITAN = '광역시',
  OTHERS = '기타지역'
}

export interface InterestRate {
  category: string;
  rate: number;
}

export interface SmallDepositProtection {
  region: RegionType;
  housing: number;
  commercial: number;
  description: string;
}

export interface ApprovalAuthority {
  id: number;
  description: string;
  limit: string;
  authority: string;
  remarks: string;
}

export interface RTIRatio {
  category: string;
  ratio: number;
  remarks?: string;
}
