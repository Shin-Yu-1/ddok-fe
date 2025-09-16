export interface UserInfo {
  profileImageUrl?: string;
  nickname?: string;
  id?: number;
  email?: string;
}

// 개별 뱃지 정보
export interface Badge {
  type: 'complete' | 'leader_complete' | 'login';
  tier: 'bronze' | 'silver' | 'gold';
}

// 포기 뱃지 정보
export interface AbandonBadge {
  isGranted: boolean;
  count: number;
}

// 활동 시간
export interface ActiveHours {
  start: string;
  end: string;
}

// 포트폴리오 링크
export interface PortfolioItem {
  linkTitle: string;
  link: string;
}

// 위치 정보
export interface LocationInfo {
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

// 온도 구간 타입
export type TemperatureLevel =
  | 'freezing' // 0-10
  | 'cold' // 11-29
  | 'cool' // 30-49
  | 'warm' // 50-69
  | 'hot' // 70-89
  | 'burning'; // 90-100

// 기술 스택 (별도 API)
export interface TechStack {
  id: number;
  name: string;
}

// 프로젝트/스터디 참여 이력 (별도 API)
export interface ParticipationHistory {
  id: number;
  teamId: number;
  title: string;
  type: 'project' | 'study';
  status: 'ONGOING' | 'CLOSED';
  role?: string;
  startDate: string;
  endDate?: string | null;
  imageUrl?: string;
  description?: string;
}

// 백엔드 API 응답 프로필 데이터 (실제 API 구조 그대로)
export interface ProfileData {
  userId: number;
  isMine: boolean;
  chatRoomId: number | null;
  dmRequestPending: boolean;
  isPublic: boolean;
  profileImageUrl: string;
  nickname: string;
  temperature: number;
  ageGroup: string;
  mainPosition: string;
  subPositions: string[];
  badges: Badge[];
  abandonBadge: AbandonBadge;
  activeHours: ActiveHours;
  traits: string[];
  content: string;
  portfolio: PortfolioItem[];
  location: LocationInfo;
}

// 프로필 API 응답
export interface ProfileApiResponse {
  status: number;
  message: string;
  data: ProfileData;
}

// 프론트엔드에서 실제 사용할 프로필 정보
export interface ProfileInfo {
  // 기본 정보
  userId: number;
  nickname: string;
  profileImage: string;
  ageGroup: string;
  introduction: string;

  // 권한 관련
  isMine: boolean;
  isProfilePublic: boolean;
  chatRoomId: number | null;
  dmRequestPending: boolean;

  // 온도와 레벨
  temperature: number;
  temperatureLevel: TemperatureLevel; // 프론트에서 계산

  // 뱃지
  badges: Badge[];
  abandonBadge: AbandonBadge;

  // 포지션
  mainPosition: string;
  subPositions: string[];

  // 성향
  traits: string[];

  // 활동 시간
  activeHours: ActiveHours;

  // 포트폴리오
  portfolio: PortfolioItem[];

  // 위치
  location: LocationInfo;
}

// 모든 API 데이터가 통합된 완전한 프로필 정보
export interface CompleteProfileInfo extends ProfileInfo {
  // 별도 API로 조회되는 데이터들
  techStacks?: TechStack[];
  techStacksTotalItems?: number;
  projects?: ParticipationHistory[];
  projectsTotalItems?: number;
  studies?: ParticipationHistory[];
  studiesTotalItems?: number;
}

// API 응답 타입들
export interface TechStackApiResponse {
  status: number;
  message: string;
  data: TechStack[];
}

export interface ParticipationHistoryApiResponse {
  status: number;
  message: string;
  data: ParticipationHistory[];
}

// 프로필 섹션 타입
export type ProfileSectionType =
  | 'userInfo'
  | 'location'
  | 'position'
  | 'traits'
  | 'time'
  | 'portfolio'
  | 'techStack'
  | 'projects'
  | 'studies';

// 컴포넌트 Props 타입들
export interface ProfileViewProps {
  user: CompleteProfileInfo;
  isEditable?: boolean;
  onEdit?: (sectionType: ProfileSectionType) => void;
  isLoading?: boolean;
  className?: string;
}

export interface ProfileSectionProps {
  user: CompleteProfileInfo;
  isEditable?: boolean;
  onEdit?: (sectionType: ProfileSectionType) => void;
  isPrivate?: boolean; // 비공개 상태 표시를 위한 prop
}
