// 스터디 모집글 관련 페이지들에서 사용되는 타입 모음 파일입니다.

import { STUDY_DETAIL_TEMPLATE } from '@/constants/studyTemplates';

// 나이대 범위
export interface PreferredAges {
  ageMin: number;
  ageMax: number;
}

// 스터디 모드
export type StudyMode = 'online' | 'offline';

// 위치 정보
export interface Location {
  address?: string; // 전체 주소
  region1depthName?: string; // 시도 (예: 부산광역시)
  region2depthName?: string; // 구군 (예: 해운대구)
  region3depthName?: string; // 동면 (예: 우동)
  roadName?: string; // 도로명 (예: 센텀중앙로)
  mainBuildingNo?: string; // 주번지 (예: 90)
  subBuildingNo?: string; // 부번지 (예: '')
  zoneNo?: string; // 우편번호 (예: 48058)
  latitude: number;
  longitude: number;
}

// 스터디 생성 데이터
export interface CreateStudyData {
  title: string;
  expectedStart: string;
  expectedMonth: number;
  mode: StudyMode;
  location: Location | null;
  preferredAges: PreferredAges | null;
  capacity: number;
  traits: string[];
  studyType: string;
  detail: string;
  bannerImage?: File | null;
}

// 스터디 수정 데이터 (수정 API용)
export interface UpdateStudyData extends CreateStudyData {
  teamStatus: 'RECRUITING' | 'ONGOING' | 'CLOSED';
  bannerImageUrl?: string; // 기존 이미지 URL
}

// API 응답 타입들
export interface CreateStudyResponse {
  status: number;
  message: string;
  data: {
    studyId: number;
    userId: number;
    nickname: string;
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
    studyType: string;
    detail: string;
  };
}

// 수정 페이지 조회 응답 타입
export interface EditStudyResponse {
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
  };
}

// 스터디 상세 조회 응답 타입
export interface DetailStudyResponse {
  status: number;
  message: string;
  data: {
    studyId: number;
    title: string;
    studyType: string;
    isMine: boolean;
    isApplied: boolean;
    isApproved: boolean;
    teamStatus: 'RECRUITING' | 'ONGOING' | 'CLOSED';
    bannerImageUrl: string;
    traits: string[];
    capacity: number;
    applicantCount: number;
    mode: string;
    address: string | null;
    preferredAges: PreferredAges;
    expectedMonth: number;
    startDate: string;
    detail: string;
    leader: {
      userId: number;
      nickname: string;
      profileImageUrl: string;
      mainPosition: string;
      mainBadge: {
        type: string;
        tier: string;
      };
      abandonBadge: {
        isGranted: boolean;
        count: number;
      };
      temperature: number;
      isMine: boolean;
      chatRoomId: number | null;
      dmRequestPending: boolean;
    };
    participants: Array<{
      userId: number;
      nickname: string;
      profileImageUrl: string;
      mainPosition: string;
      mainBadge: {
        type: string;
        tier: string;
      };
      abandonBadge: {
        isGranted: boolean;
        count: number;
      };
      temperature: number;
      isMine: boolean;
      chatRoomId: number | null;
      dmRequestPending: boolean;
    }>;
    participantsCount: number;
  };
}

// 초기 폼 데이터
export const initialFormData: CreateStudyData = {
  title: '',
  expectedStart: (() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const year = tomorrow.getFullYear();
    const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const day = String(tomorrow.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  })(),
  expectedMonth: 1,
  mode: 'offline',
  location: null,
  preferredAges: null,
  capacity: 1,
  traits: [],
  studyType: '',
  detail: STUDY_DETAIL_TEMPLATE,
  bannerImage: null,
};
