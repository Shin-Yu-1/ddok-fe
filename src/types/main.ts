// main 페이지에서 사용되는 타입 모음 파일입니다.

// 나이대 범위
export interface PreferredAges {
  ageMin: number;
  ageMax: number;
}

// 전체 리스트용 팀 상태 (모집부터 완료까지 모든 상태)
export type TeamStatus = 'RECRUITING' | 'ONGOING' | 'CLOSED';

// 사용자 참여용 팀 상태 (참여 후 상태만)
export type UserTeamStatus = 'ONGOING' | 'CLOSED';

// 스터디/프로젝트 모드
export type Mode = 'online' | 'offline';

// 위치 정보 (공통)
export interface Location {
  address: string;
  region1depthName?: string;
  region2depthName?: string;
  region3depthName?: string;
  roadName?: string;
  mainBuildingNo?: string;
  subBuildingNo?: string;
  zoneNo?: string;
  latitude: number;
  longitude: number;
}

// 스터디 아이템 타입 (전체 목록용)
export interface StudyItem {
  studyId: number;
  title: string;
  teamStatus: TeamStatus;
  bannerImageUrl: string;
  capacity: number;
  mode: Mode;
  address: string;
  studyType: string;
  preferredAges: PreferredAges | null;
  expectedMonth: number;
  startDate: string;
}

// 프로젝트 아이템 타입 (전체 목록용)
export interface ProjectItem {
  projectId: number;
  title: string;
  teamStatus: TeamStatus;
  bannerImageUrl: string;
  positions: string[];
  capacity: number;
  mode: Mode;
  address: string;
  preferredAges: PreferredAges | null;
  expectedMonth: number;
  startDate: string;
}

// 사용자 참여 스터디 아이템
export interface UserStudyItem {
  studyId: number;
  teamId: number;
  title: string;
  teamStatus: UserTeamStatus;
  location: Location;
  period: {
    start: string;
    end: string;
  };
}

// 사용자 참여 프로젝트 아이템
export interface UserProjectItem {
  projectId: number;
  teamId: number;
  title: string;
  teamStatus: UserTeamStatus;
  location: Location;
  period: {
    start: string;
    end: string;
  };
}

// 페이지네이션 정보
export interface Pagination {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
}

// 스터디 리스트 API 응답
export interface StudyListResponse {
  status: number;
  message: string;
  data: {
    pagination: Pagination;
    items: StudyItem[];
  };
}

// 프로젝트 리스트 API 응답
export interface ProjectListResponse {
  status: number;
  message: string;
  data: {
    pagination: Pagination;
    items: ProjectItem[];
  };
}

// 사용자 참여 스터디 API 응답
export interface UserStudiesResponse {
  status: number;
  message: string;
  data: {
    pagination: Pagination;
    items: UserStudyItem[];
  };
}

// 사용자 참여 프로젝트 API 응답
export interface UserProjectsResponse {
  status: number;
  message: string;
  data: {
    pagination: Pagination;
    items: UserProjectItem[];
  };
}

// 통합 카드 아이템 타입 (스터디와 프로젝트 공통)
export interface CardItem {
  id: number;
  type: 'study' | 'project';
  title: string;
  teamStatus: TeamStatus;
  bannerImageUrl: string;
  capacity?: number;
  mode: Mode;
  address: string;
  preferredAges?: PreferredAges | null;
  expectedMonth?: number;
  startDate: string;
  // 스터디 전용
  studyType?: string;
  // 프로젝트 전용
  positions?: string[];
}

// 사용자 참여 카드 아이템 (개인화 데이터용)
export interface UserCardItem {
  id: number;
  type: 'study' | 'project';
  title: string;
  teamStatus: UserTeamStatus;
  bannerImageUrl: string;
  mode: Mode;
  address: string;
  startDate: string;
  teamId: number;
  period: {
    start: string;
    end: string;
  };
}

// 메인 페이지 섹션별 데이터
export interface MainPageData {
  recentStudies: CardItem[];
  recentProjects: CardItem[];
  ongoingStudies: CardItem[];
  recruitingStudies: CardItem[];
  ongoingProjects: CardItem[];
  recruitingProjects: CardItem[];
  stats: {
    recruitingStudiesCount: number;
    recruitingProjectsCount: number;
    ongoingStudiesCount: number;
    ongoingProjectsCount: number;
  };
  // 사용자 개인화 데이터 (로그인 시)
  userOngoingStudies?: UserCardItem[];
  userOngoingProjects?: UserCardItem[];
}

// API 요청 파라미터
export interface ListParams {
  page?: number;
  size?: number;
}
