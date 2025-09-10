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
  STUDIES: 3, // 전체 스터디 조회 개수
  PROJECTS: 3, // 전체 프로젝트 조회 개수
  USER_STUDIES: 4, // 사용자 스터디 조회 개수
  USER_PROJECTS: 4, // 사용자 프로젝트 조회 개수
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

// 전체 스터디 리스트 조회
const fetchStudies = async (
  page = 0,
  size = MAIN_PAGE_LIMITS.STUDIES
): Promise<StudyListResponse> => {
  const { data } = await api.get<StudyListResponse>('/api/studies', {
    params: { page, size },
  });
  return data;
};

// 전체 프로젝트 리스트 조회
const fetchProjects = async (
  page = 0,
  size = MAIN_PAGE_LIMITS.PROJECTS
): Promise<ProjectListResponse> => {
  const { data } = await api.get<ProjectListResponse>('/api/projects', {
    params: { page, size },
  });
  return data;
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

  // 전체 스터디 조회
  const {
    data: studiesResponse,
    isLoading: isLoadingStudies,
    error: studiesError,
  } = useQuery({
    queryKey: ['studies', 'main'],
    queryFn: () => fetchStudies(0, MAIN_PAGE_LIMITS.STUDIES),
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
  });

  // 전체 프로젝트 조회
  const {
    data: projectsResponse,
    isLoading: isLoadingProjects,
    error: projectsError,
  } = useQuery({
    queryKey: ['projects', 'main'],
    queryFn: () => fetchProjects(0, MAIN_PAGE_LIMITS.PROJECTS),
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

  // 전체 데이터 변환
  const allStudies: CardItem[] = studiesResponse?.data.items.map(transformStudyToCard) || [];
  const allProjects: CardItem[] = projectsResponse?.data.items.map(transformProjectToCard) || [];

  // 전체 데이터에서 상태별 분류
  const ongoingStudies = allStudies.filter(study => study.teamStatus === 'ONGOING');
  const recruitingStudies = allStudies.filter(study => study.teamStatus === 'RECRUITING');
  const ongoingProjects = allProjects.filter(project => project.teamStatus === 'ONGOING');
  const recruitingProjects = allProjects.filter(project => project.teamStatus === 'RECRUITING');

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
    recentStudies: allStudies,
    recentProjects: allProjects,
    ongoingStudies,
    recruitingStudies,
    ongoingProjects,
    recruitingProjects,
    // 로그인한 경우 개인 데이터 포함
    ...(isLoggedIn && {
      userOngoingStudies,
      userOngoingProjects,
    }),
  };

  // 로딩 상태 계산
  const isLoading =
    isLoadingStudies ||
    isLoadingProjects ||
    (isLoggedIn && (isLoadingUserStudies || isLoadingUserProjects));

  // 에러 상태 계산
  const error = studiesError || projectsError || userStudiesError || userProjectsError;

  return {
    data: mainPageData,
    isLoading,
    error,
    // 개별 상태들
    isLoadingStudies,
    isLoadingProjects,
    isLoadingUserStudies,
    isLoadingUserProjects,
    studiesError,
    projectsError,
    userStudiesError,
    userProjectsError,
  };
};
