// 프로젝트 모집글 관련 페이지들에서 사용되는 타입 모음 파일입니다.
import BadgeTier from '@/constants/enums/BadgeTier.enum';
import BadgeType from '@/constants/enums/BadgeType.enum';
import { PROJECT_DETAIL_TEMPLATE } from '@/constants/projectTemplates';

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

// 프로젝트 모드
export type ProjectMode = 'online' | 'offline';

// 프로젝트 진행 상태
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

// 사용자 기본 정보 (공통으로 사용되는 부분)
export interface UserBasicInfo {
  userId: number;
  nickname: string;
  profileImageUrl: string;
  mainPosition: string;
  mainBadge: MainBadge | null;
  abandonBadge: AbandonBadge | null;
  temperature: number | null;
  chatRoomId: number | null;
  dmRequestPending: boolean;
  isMine: boolean;
}

// 참여자 정보
export interface ProjectParticipant extends UserBasicInfo {
  decidedPosition: string;
}

// 리더 정보
export interface ProjectLeader extends UserBasicInfo {
  decidedPosition: string;
}

// 포지션 정보 (상세 조회용)
export interface ProjectPosition {
  position: string;
  applied: number;
  confirmed: number;
  isApplied: boolean;
  isApproved: boolean;
  isAvailable: boolean;
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
  teamStatus: TeamStatus;
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
    teamStatus: TeamStatus;
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
    teamStatus: TeamStatus;
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

export interface DetailProjectResponse {
  status: number;
  message: string;
  data: {
    projectId: number;
    title: string;
    teamStatus: TeamStatus;
    bannerImageUrl: string;
    traits: string[];
    capacity: number;
    applicantCount: number;
    mode: string;
    location: Location | null;
    preferredAges: PreferredAges | null;
    expectedMonth: number;
    startDate: string;
    detail: string;
    positions: ProjectPosition[];
    leader: ProjectLeader;
    participants: ProjectParticipant[];
    isMine: boolean;
  };
}

// 프로젝트 참여 신청/취소 요청 타입
export interface ProjectJoinRequest {
  appliedPosition?: string; // 처음 신청할 때만 필수
}

// 프로젝트 참여 신청/취소 응답 타입
export interface ProjectJoinResponse {
  status: number;
  message: string;
  data: {
    isApplied: boolean;
    appliedPosition?: string;
  } | null;
}

// 초기 폼 데이터
export const initialFormData: CreateProjectData = {
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
  positions: [],
  leaderPosition: '',
  detail: PROJECT_DETAIL_TEMPLATE,
  bannerImage: null,
};
