import { useQuery } from '@tanstack/react-query';

import api from '@/api/api';
import { useAuthStore } from '@/stores/authStore';
import type {
  StudyListResponse,
  ProjectListResponse,
  UserStudiesResponse,
  UserProjectsResponse,
  CardItem,
  UserCardItem,
  StudyItem,
  ProjectItem,
  UserStudyItem,
  UserProjectItem,
  MainPageData,
} from '@/types/main';

// 메인 페이지 데이터 조회 개수 상수
const MAIN_PAGE_LIMITS = {
  ALL_DATA: 100, // 전체 데이터 조회 개수 (통계 + 표시용)
  DISPLAY_LIMIT: 3, // 각 섹션별 표시 개수
  USER_STUDIES: 2, // 사용자 스터디 조회 개수
  USER_PROJECTS: 2, // 사용자 프로젝트 조회 개수
} as const;

// 통계 데이터 타입
interface StatsData {
  recruitingStudiesCount: number;
  recruitingProjectsCount: number;
  ongoingStudiesCount: number;
  ongoingProjectsCount: number;
}

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

// 전체 데이터 조회 (통계 + 표시용 통합)
const fetchAllData = async () => {
  const [studiesResponse, projectsResponse] = await Promise.all([
    api.get<StudyListResponse>('/api/studies', {
      params: { page: 0, size: MAIN_PAGE_LIMITS.ALL_DATA },
    }),
    api.get<ProjectListResponse>('/api/projects', {
      params: { page: 0, size: MAIN_PAGE_LIMITS.ALL_DATA },
    }),
  ]);

  // API 응답 구조에 따라 데이터 추출
  const studies = studiesResponse.data.data.items || [];
  const projects = projectsResponse.data.data.items || [];

  // 스터디와 프로젝트를 CardItem으로 변환
  const allStudies: CardItem[] = studies.map(transformStudyToCard);
  const allProjects: CardItem[] = projects.map(transformProjectToCard);

  // 상태별 분류
  const recruitingStudies = allStudies.filter(study => study.teamStatus === 'RECRUITING');
  const ongoingStudies = allStudies.filter(study => study.teamStatus === 'ONGOING');
  const recruitingProjects = allProjects.filter(project => project.teamStatus === 'RECRUITING');
  const ongoingProjects = allProjects.filter(project => project.teamStatus === 'ONGOING');

  // 통계 데이터
  const stats: StatsData = {
    recruitingStudiesCount: recruitingStudies.length,
    recruitingProjectsCount: recruitingProjects.length,
    ongoingStudiesCount: ongoingStudies.length,
    ongoingProjectsCount: ongoingProjects.length,
  };

  // 표시용 데이터 (각각 제한된 개수만)
  const displayData = {
    recruitingStudies: recruitingStudies.slice(0, MAIN_PAGE_LIMITS.DISPLAY_LIMIT),
    ongoingStudies: ongoingStudies.slice(0, MAIN_PAGE_LIMITS.DISPLAY_LIMIT),
    recruitingProjects: recruitingProjects.slice(0, MAIN_PAGE_LIMITS.DISPLAY_LIMIT),
    ongoingProjects: ongoingProjects.slice(0, MAIN_PAGE_LIMITS.DISPLAY_LIMIT),
    recentStudies: allStudies.slice(0, MAIN_PAGE_LIMITS.DISPLAY_LIMIT),
    recentProjects: allProjects.slice(0, MAIN_PAGE_LIMITS.DISPLAY_LIMIT),
  };

  return {
    stats,
    displayData,
  };
};

// 사용자 참여 스터디 조회
const fetchUserStudies = async (userId: number): Promise<UserStudiesResponse> => {
  const { data } = await api.get<UserStudiesResponse>(`/api/players/${userId}/profile/studies`, {
    params: { page: 0, size: MAIN_PAGE_LIMITS.USER_STUDIES },
  });
  return data;
};

// 사용자 참여 프로젝트 조회
const fetchUserProjects = async (userId: number): Promise<UserProjectsResponse> => {
  const { data } = await api.get<UserProjectsResponse>(`/api/players/${userId}/profile/projects`, {
    params: { page: 0, size: MAIN_PAGE_LIMITS.USER_PROJECTS },
  });
  return data;
};

// 메인 페이지 데이터 훅
export const useMainData = () => {
  const { isLoggedIn, user } = useAuthStore();

  // 전체 데이터 조회 (통계 + 표시용 통합)
  const {
    data: allData,
    isLoading: isLoadingAllData,
    error: allDataError,
  } = useQuery({
    queryKey: ['main-data'],
    queryFn: fetchAllData,
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
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
    staleTime: 3 * 60 * 1000, // 3분
    gcTime: 10 * 60 * 1000, // 10분
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
    staleTime: 3 * 60 * 1000, // 3분
    gcTime: 10 * 60 * 1000, // 10분
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
    recentStudies: allData?.displayData.recentStudies || [],
    recentProjects: allData?.displayData.recentProjects || [],
    ongoingStudies: allData?.displayData.ongoingStudies || [],
    recruitingStudies: allData?.displayData.recruitingStudies || [],
    ongoingProjects: allData?.displayData.ongoingProjects || [],
    recruitingProjects: allData?.displayData.recruitingProjects || [],
    // 통계 데이터
    stats: allData?.stats || {
      recruitingStudiesCount: 0,
      recruitingProjectsCount: 0,
      ongoingStudiesCount: 0,
      ongoingProjectsCount: 0,
    },
    // 로그인한 경우 개인 데이터 포함
    ...(isLoggedIn && {
      userOngoingStudies,
      userOngoingProjects,
    }),
  };

  // 로딩 상태 계산
  const isLoading =
    isLoadingAllData || (isLoggedIn && (isLoadingUserStudies || isLoadingUserProjects));

  // 에러 상태 계산
  const error = allDataError || userStudiesError || userProjectsError;

  return {
    data: mainPageData,
    isLoading,
    error,
    // 개별 상태들
    isLoadingAllData,
    isLoadingUserStudies,
    isLoadingUserProjects,
    allDataError,
    userStudiesError,
    userProjectsError,
  };
};
