import { useQuery } from '@tanstack/react-query';

import api from '@/api/api';
import { useAuthStore } from '@/stores/authStore';
import type {
  StudyListResponse,
  ProjectListResponse,
  UserStudiesResponse,
  UserProjectsResponse,
  TeamCountResponse,
  CardItem,
  UserCardItem,
  StudyItem,
  ProjectItem,
  UserStudyItem,
  UserProjectItem,
  MainPageData,
  StatsData,
} from '@/types/main';

// 메인 페이지 데이터 조회 개수 상수
const MAIN_PAGE_LIMITS = {
  USER_STUDIES: 2, // 사용자 스터디 조회 개수
  USER_PROJECTS: 2, // 사용자 프로젝트 조회 개수
  DISPLAY_LIMIT_LOGGED_IN: 3, // 로그인 시 각 섹션별 표시 개수
  DISPLAY_LIMIT_LOGGED_OUT: 4, // 비로그인 시 각 섹션별 표시 개수
} as const;

// 스터디 아이템을 카드 아이템으로 변환
const transformStudyToCard = (study: StudyItem): CardItem => ({
  id: study.studyId,
  type: 'study',
  title: study.title,
  teamStatus: study.teamStatus,
  bannerImageUrl: study.bannerImageUrl,
  capacity: study.capacity,
  mode: study.mode,
  address: study.address,
  preferredAges: study.preferredAges,
  expectedMonth: study.expectedMonth,
  startDate: study.startDate,
  studyType: study.studyType,
});

// 프로젝트 아이템을 카드 아이템으로 변환
const transformProjectToCard = (project: ProjectItem): CardItem => ({
  id: project.projectId,
  type: 'project',
  title: project.title,
  teamStatus: project.teamStatus,
  bannerImageUrl: project.bannerImageUrl,
  capacity: project.capacity,
  mode: project.mode,
  address: project.address,
  preferredAges: project.preferredAges,
  expectedMonth: project.expectedMonth,
  startDate: project.startDate,
  positions: project.positions,
});

// 사용자 스터디를 카드 아이템으로 변환
const transformUserStudyToCard = (study: UserStudyItem): UserCardItem => ({
  id: study.studyId,
  type: 'study',
  title: study.title,
  teamStatus: study.teamStatus,
  bannerImageUrl: '', //NOTE: 현재 API에서 제공하지 않음
  mode: study.location.latitude && study.location.longitude ? 'offline' : 'online',
  address: study.location.address,
  startDate: study.period.start,
  teamId: study.teamId,
  period: study.period,
});

// 사용자 프로젝트를 카드 아이템으로 변환
const transformUserProjectToCard = (project: UserProjectItem): UserCardItem => ({
  id: project.projectId,
  type: 'project',
  title: project.title,
  teamStatus: project.teamStatus,
  bannerImageUrl: '', //NOTE: 현재 API에서 제공하지 않음
  mode: project.location.latitude && project.location.longitude ? 'offline' : 'online',
  address: project.location.address,
  startDate: project.period.start,
  teamId: project.teamId,
  period: project.period,
});

// 팀 카운트 조회
const fetchTeamCount = async (): Promise<StatsData> => {
  const { data } = await api.get<TeamCountResponse>('/api/teams/count');

  return {
    recruitingStudiesCount: data.data.studyCount,
    recruitingProjectsCount: data.data.projectCount,
    ongoingTeamsCount: data.data.teamCount,
  };
};

// 모집중인 스터디 조회
const fetchRecruitingStudies = async (size: number): Promise<CardItem[]> => {
  const { data } = await api.get<StudyListResponse>('/api/studies/search', {
    params: {
      status: 'RECRUITING',
      page: 0,
      size,
    },
  });

  return (data.data.items || []).map(transformStudyToCard);
};

// 진행중인 스터디 조회
const fetchOngoingStudies = async (size: number): Promise<CardItem[]> => {
  const { data } = await api.get<StudyListResponse>('/api/studies/search', {
    params: {
      status: 'ONGOING',
      page: 0,
      size,
    },
  });

  return (data.data.items || []).map(transformStudyToCard);
};

// 모집중인 프로젝트 조회
const fetchRecruitingProjects = async (size: number): Promise<CardItem[]> => {
  const { data } = await api.get<ProjectListResponse>('/api/projects/search', {
    params: {
      status: 'RECRUITING',
      page: 0,
      size,
    },
  });

  return (data.data.items || []).map(transformProjectToCard);
};

// 진행중인 프로젝트 조회
const fetchOngoingProjects = async (size: number): Promise<CardItem[]> => {
  const { data } = await api.get<ProjectListResponse>('/api/projects/search', {
    params: {
      status: 'ONGOING',
      page: 0,
      size,
    },
  });

  return (data.data.items || []).map(transformProjectToCard);
};

// 최근 스터디 조회 (전체 상태)
const fetchRecentStudies = async (size: number): Promise<CardItem[]> => {
  const { data } = await api.get<StudyListResponse>('/api/studies/search', {
    params: {
      page: 0,
      size,
    },
  });

  return (data.data.items || []).map(transformStudyToCard);
};

// 최근 프로젝트 조회 (전체 상태)
const fetchRecentProjects = async (size: number): Promise<CardItem[]> => {
  const { data } = await api.get<ProjectListResponse>('/api/projects/search', {
    params: {
      page: 0,
      size,
    },
  });

  return (data.data.items || []).map(transformProjectToCard);
};

// 표시용 데이터 조회
const fetchDisplayData = async (displayLimit: number) => {
  const [
    recruitingStudies,
    ongoingStudies,
    recruitingProjects,
    ongoingProjects,
    recentStudies,
    recentProjects,
  ] = await Promise.all([
    fetchRecruitingStudies(displayLimit),
    fetchOngoingStudies(displayLimit),
    fetchRecruitingProjects(displayLimit),
    fetchOngoingProjects(displayLimit),
    fetchRecentStudies(displayLimit),
    fetchRecentProjects(displayLimit),
  ]);

  return {
    recruitingStudies,
    ongoingStudies,
    recruitingProjects,
    ongoingProjects,
    recentStudies,
    recentProjects,
  };
};

// 사용자 참여 스터디 조회
const fetchUserStudies = async (userId: number): Promise<UserStudiesResponse> => {
  try {
    const { data } = await api.get<UserStudiesResponse>(`/api/players/${userId}/profile/studies`, {
      params: { page: 0, size: MAIN_PAGE_LIMITS.USER_STUDIES },
    });
    return data;
  } catch (error: unknown) {
    // 404는 정상 상황이므로 빈 응답 반환
    if (error && typeof error === 'object' && 'status' in error && error.status === 404) {
      return {
        status: 200,
        message: 'No studies found',
        data: {
          pagination: { currentPage: 0, pageSize: 0, totalPages: 0, totalItems: 0 },
          items: [],
        },
      };
    }
    throw error;
  }
};

// 사용자 참여 프로젝트 조회
const fetchUserProjects = async (userId: number): Promise<UserProjectsResponse> => {
  try {
    const { data } = await api.get<UserProjectsResponse>(
      `/api/players/${userId}/profile/projects`,
      {
        params: { page: 0, size: MAIN_PAGE_LIMITS.USER_PROJECTS },
      }
    );
    return data;
  } catch (error: unknown) {
    // 404는 정상 상황이므로 빈 응답 반환
    if (error && typeof error === 'object' && 'status' in error && error.status === 404) {
      return {
        status: 200,
        message: 'No projects found',
        data: {
          pagination: { currentPage: 0, pageSize: 0, totalPages: 0, totalItems: 0 },
          items: [],
        },
      };
    }
    throw error;
  }
};

// 메인 페이지 데이터 훅
export const useMainData = () => {
  const { isLoggedIn, user } = useAuthStore();

  // 로그인 상태에 따른 표시 개수 결정
  const displayLimit = isLoggedIn
    ? MAIN_PAGE_LIMITS.DISPLAY_LIMIT_LOGGED_IN
    : MAIN_PAGE_LIMITS.DISPLAY_LIMIT_LOGGED_OUT;

  // 팀 카운트 조회 (통계용)
  const {
    data: statsData,
    isLoading: isLoadingStats,
    error: statsError,
  } = useQuery({
    queryKey: ['team-count'],
    queryFn: fetchTeamCount,
  });

  // 표시용 데이터 조회
  const {
    data: displayData,
    isLoading: isLoadingDisplayData,
    error: displayDataError,
  } = useQuery({
    queryKey: ['display-data', displayLimit],
    queryFn: () => fetchDisplayData(displayLimit),
  });

  // 사용자 참여 스터디 조회 (로그인한 경우에만)
  const {
    data: userStudiesResponse,
    isLoading: isLoadingUserStudies,
    error: userStudiesError,
  } = useQuery({
    queryKey: ['user-studies', user?.id],
    queryFn: () => fetchUserStudies(user!.id),
    enabled: isLoggedIn && !!user?.id,
  });

  // 사용자 참여 프로젝트 조회 (로그인한 경우에만)
  const {
    data: userProjectsResponse,
    isLoading: isLoadingUserProjects,
    error: userProjectsError,
  } = useQuery({
    queryKey: ['user-projects', user?.id],
    queryFn: () => fetchUserProjects(user!.id),
    enabled: isLoggedIn && !!user?.id,
  });

  // 사용자 개인 데이터 변환
  const userStudies: UserCardItem[] =
    userStudiesResponse?.data.items.map(transformUserStudyToCard) || [];
  const userProjects: UserCardItem[] =
    userProjectsResponse?.data.items.map(transformUserProjectToCard) || [];

  // 사용자 개인 데이터에서 진행중인 것만 필터링
  const userOngoingStudies = userStudies.filter(study => study.teamStatus === 'ONGOING');
  const userOngoingProjects = userProjects.filter(project => project.teamStatus === 'ONGOING');

  // 메인 페이지 데이터 구성
  const mainPageData: MainPageData = {
    // 표시용 데이터
    recentStudies: displayData?.recentStudies || [],
    recentProjects: displayData?.recentProjects || [],
    ongoingStudies: displayData?.ongoingStudies || [],
    recruitingStudies: displayData?.recruitingStudies || [],
    ongoingProjects: displayData?.ongoingProjects || [],
    recruitingProjects: displayData?.recruitingProjects || [],
    // 통계 데이터 (API에서 받아온 값 사용)
    stats: statsData || {
      recruitingStudiesCount: 0,
      recruitingProjectsCount: 0,
      ongoingTeamsCount: 0,
    },
    // 로그인한 경우 개인 데이터 포함
    ...(isLoggedIn && {
      userOngoingStudies,
      userOngoingProjects,
    }),
  };

  // 로딩 상태 계산
  const isLoading =
    isLoadingStats ||
    isLoadingDisplayData ||
    (isLoggedIn && (isLoadingUserStudies || isLoadingUserProjects));

  // 에러 상태 계산
  const error = statsError || displayDataError || userStudiesError || userProjectsError;

  return {
    data: mainPageData,
    isLoading,
    error,
    // 개별 상태들
    isLoadingStats,
    isLoadingDisplayData,
    isLoadingUserStudies,
    isLoadingUserProjects,
    statsError,
    displayDataError,
    userStudiesError,
    userProjectsError,
  };
};
