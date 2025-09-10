// main 페이지에서 사용되는 타입 모음 파일입니다.

// 나이대 범위
export interface PreferredAges {
  ageMin: number;
  ageMax: number;
}

// 팀 상태
export type TeamStatus = 'RECRUITING' | 'ONGOING' | 'CLOSED';

// 스터디/프로젝트 모드
export type Mode = 'online' | 'offline';

// 스터디 아이템 타입
export interface StudyItem {
  studyId: number;
  title: string;
  teamStatus: TeamStatus;
  bannerImageUrl: string;
  capacity: number;
  mode: Mode;
  address: string;
  studyType: string;
  preferredAges: PreferredAges;
  expectedMonth: number;
  startDate: string;
}

// 프로젝트 아이템 타입
export interface ProjectItem {
  projectId: number;
  title: string;
  teamStatus: TeamStatus;
  bannerImageUrl: string;
  positions: string[];
  capacity: number;
  mode: Mode;
  address: string;
  preferredAges: PreferredAges;
  expectedMonth: number;
  startDate: string;
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

// 통합 카드 아이템 타입 (스터디와 프로젝트 공통)
export interface CardItem {
  id: number;
  type: 'study' | 'project';
  title: string;
  teamStatus: TeamStatus;
  bannerImageUrl: string;
  capacity: number;
  mode: Mode;
  address: string;
  preferredAges: PreferredAges;
  expectedMonth: number;
  startDate: string;
  // 스터디 전용
  studyType?: string;
  // 프로젝트 전용
  positions?: string[];
}

// 메인 페이지 섹션별 데이터
export interface MainPageData {
  recentStudies: CardItem[];
  recentProjects: CardItem[];
  ongoingStudies: CardItem[];
  recruitingStudies: CardItem[];
  ongoingProjects: CardItem[];
  recruitingProjects: CardItem[];
}

// API 요청 파라미터
export interface ListParams {
  page?: number;
  size?: number;
}
