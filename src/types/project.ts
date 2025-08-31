// 프로젝트 모집글 관련 페이지들에서 사용되는 타입 모음 파일입니다.
import { PROJECT_DETAIL_TEMPLATE } from '@/constants/projectTemplates';

// 나이대 범위
export interface PreferredAges {
  ageMin: number;
  ageMax: number;
}

// 프로젝트 모드
export type ProjectMode = 'ONLINE' | 'OFFLINE';

// 위치 정보
export interface Location {
  latitude: number;
  longitude: number;
  address: string;
}

// 프로젝트 생성 데이터
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
  bannerImage?: File | null;
}

// 프로젝트 수정 데이터 (수정 API용)
export interface UpdateProjectData extends CreateProjectData {
  teamStatus: 'RECRUITING' | 'ONGOING' | 'CLOSED';
  bannerImageUrl?: string; // 기존 이미지 URL
}

// API 응답 타입들
export interface CreateProjectResponse {
  status: number;
  message: string;
  data: {
    projectId: number;
    userId: number;
    nickname: string;
    leaderPosition: string;
    title: string;
    teamStatus: 'RECRUITING' | 'ONGOING' | 'CLOSED';
    expectedStart: string;
    expectedMonth: number;
    mode: string;
    location: Location | 'online';
    preferredAges: PreferredAges | null;
    capacity: number;
    bannerImageUrl: string;
    traits: string[];
    positions: string[];
    detail: string;
  };
}

// 수정 페이지 조회 응답 타입
export interface EditProjectResponse {
  status: number;
  message: string;
  data: {
    title: string;
    teamStatus: 'RECRUITING' | 'ONGOING' | 'CLOSED';
    bannerImageUrl: string;
    traits: string[];
    capacity: number;
    applicantCount: number;
    mode: string;
    address: string;
    preferredAges: PreferredAges;
    expectedMonth: number;
    startDate: string;
    detail: string;
    leaderPosition: string;
    positions: Array<{
      position: string;
      applied: number;
      confirmed: number;
    }>;
  };
}

// 초기 폼 데이터
export const initialFormData: CreateProjectData = {
  title: '',
  expectedStart: '',
  expectedMonth: 1,
  mode: 'OFFLINE',
  location: null,
  preferredAges: null,
  capacity: 1,
  traits: [],
  positions: [],
  leaderPosition: '',
  detail: PROJECT_DETAIL_TEMPLATE,
  bannerImage: null,
};
