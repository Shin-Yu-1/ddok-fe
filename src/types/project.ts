// 프로젝트 모집글 관련 페이지들에서 사용되는 타입 모음 파일입니다.

// 나이대 범위
export interface PreferredAges {
  ageMin: number;
  ageMax: number;
}

// 프로젝트 모드
export type ProjectMode = 'ONLINE' | 'OFFLINE';

// 위치 정보
export interface Location {
  province: string;
  city: string;
}

// 프로젝트 생성 데이터 (폼 데이터 겸 API 요청 데이터)
export interface CreateProjectData {
  title: string;
  expectedStart: string;
  expectedMonth: number;
  mode: ProjectMode;
  location: Location | null;
  preferredAges: PreferredAges | null;
  capacity: number;
  traits: string[];
  positions: string[];
  leaderPosition: string;
  detail: string;
  bannerImage: File | null;
}

// 초기 폼 데이터
export const initialFormData: CreateProjectData = {
  title: '',
  expectedStart: '',
  expectedMonth: 1,
  mode: 'ONLINE',
  location: null,
  preferredAges: null,
  capacity: 2,
  traits: [],
  positions: [],
  leaderPosition: '',
  detail: '',
  bannerImage: null,
};
