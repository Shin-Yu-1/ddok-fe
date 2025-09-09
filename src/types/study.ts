// 스터디 모집글 관련 페이지들에서 사용되는 타입 모음 파일입니다.

import BadgeTier from '@/constants/enums/BadgeTier.enum';
import BadgeType from '@/constants/enums/BadgeType.enum';
import { STUDY_DETAIL_TEMPLATE } from '@/constants/studyTemplates';

// 배지 타입 정의
export interface MainBadge {
  type: BadgeType;
  tier: BadgeTier;
}

export interface AbandonBadge {
  isGranted: boolean;
  count: number;
}

// 나이대 범위
export interface PreferredAges {
  ageMin: number;
  ageMax: number;
}

// 스터디 모드
export type StudyMode = 'online' | 'offline';

// 스터디 진행 상태
export type TeamStatus = 'RECRUITING' | 'ONGOING' | 'CLOSED';

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
  teamStatus: TeamStatus;
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
    teamStatus: TeamStatus;
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
    teamStatus: TeamStatus;
    bannerImageUrl: string;
    traits: string[];
    capacity: number;
    applicantCount: number;
    mode: string;
    address: string | null;
    location?: Location | null;
    preferredAges: PreferredAges;
    expectedMonth: number;
    startDate: string;
    detail: string;
    studyType: string;
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
    teamStatus: TeamStatus;
    bannerImageUrl: string;
    traits: string[];
    capacity: number;
    applicantCount: number;
    mode: string;
    location: Location | null;
    preferredAges: PreferredAges;
    expectedMonth: number;
    startDate: string;
    detail: string;
    leader: {
      userId: number;
      nickname: string;
      profileImageUrl: string;
      mainPosition: string;
      mainBadge: MainBadge | null;
      abandonBadge: AbandonBadge | null;
      temperature: number | null;
      chatRoomId: number | null;
      isMine: boolean;
      dmRequestPending: boolean;
    };
    participants: Array<{
      userId: number;
      nickname: string;
      profileImageUrl: string;
      mainPosition: string;
      mainBadge: MainBadge | null;
      abandonBadge: AbandonBadge | null;
      temperature: number | null;
      chatRoomId: number | null;
      isMine: boolean;
      dmRequestPending: boolean;
    }>;
    participantsCount: number;
    isApplied: boolean;
    isApproved: boolean;
    isMine: boolean;
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
