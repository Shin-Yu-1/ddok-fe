// 프로젝트 모집글 관련 페이지들에서 사용되는 타입 모음 파일입니다.

export interface Location {
  latitude: number;
  longitude: number;
  address: string;
}

export interface PreferredAges {
  ageMin: number;
  ageMax: number;
}

export type ProjectMode = 'ONLINE' | 'OFFLINE';

export interface CreateProjectRequest {
  title: string;
  expectedStart: string; // YYYY-MM-DD 형식
  expectedMonth: number;
  mode: ProjectMode;
  location?: Location; // OFFLINE일 때만 필요
  preferredAges: PreferredAges;
  capacity: number;
  traits: string[];
  positions: string[];
  leaderPosition: string;
  detail: string;
  bannerImage?: File; // 파일 업로드용
}

export interface CreateProjectFormData {
  title: string;
  expectedStart: string;
  expectedMonth: number;
  mode: ProjectMode;
  location: Location | null;
  preferredAges: PreferredAges;
  capacity: number;
  traits: string[];
  positions: string[];
  leaderPosition: string;
  detail: string;
  bannerImage: File | null;
}

// NOTE: 초기값 정의
export const initialFormData: CreateProjectFormData = {
  title: '',
  expectedStart: '',
  expectedMonth: 1,
  mode: 'OFFLINE',
  location: null,
  preferredAges: {
    ageMin: 20,
    ageMax: 30,
  },
  capacity: 2,
  traits: [],
  positions: [],
  leaderPosition: '',
  detail: '',
  bannerImage: null,
};
