import { useQuery } from '@tanstack/react-query';

import api from '@/api/api';
import type {
  StudyListResponse,
  ProjectListResponse,
  CardItem,
  StudyItem,
  ProjectItem,
  MainPageData,
} from '@/types/main';

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

// 스터디 리스트 조회
const fetchStudies = async (page = 0, size = 4): Promise<StudyListResponse> => {
  const { data } = await api.get<StudyListResponse>('/api/studies', {
    params: { page, size },
  });
  return data;
};

// 프로젝트 리스트 조회
const fetchProjects = async (page = 0, size = 4): Promise<ProjectListResponse> => {
  const { data } = await api.get<ProjectListResponse>('/api/projects', {
    params: { page, size },
  });
  return data;
};

// 메인 페이지 데이터 훅
export const useMainData = () => {
  // 최근 스터디 조회
  const {
    data: studiesResponse,
    isLoading: isLoadingStudies,
    error: studiesError,
  } = useQuery({
    queryKey: ['studies', 'main', { page: 0, size: 4 }],
    queryFn: () => fetchStudies(0, 4),
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
  });

  // 최근 프로젝트 조회
  const {
    data: projectsResponse,
    isLoading: isLoadingProjects,
    error: projectsError,
  } = useQuery({
    queryKey: ['projects', 'main', { page: 0, size: 4 }],
    queryFn: () => fetchProjects(0, 4),
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
  });

  // 데이터 변환 및 상태별 분류
  const allStudies: CardItem[] = studiesResponse?.data.items.map(transformStudyToCard) || [];

  const allProjects: CardItem[] = projectsResponse?.data.items.map(transformProjectToCard) || [];

  // 상태별로 분류
  const ongoingStudies = allStudies.filter(study => study.teamStatus === 'ONGOING');
  const recruitingStudies = allStudies.filter(study => study.teamStatus === 'RECRUITING');

  const ongoingProjects = allProjects.filter(project => project.teamStatus === 'ONGOING');
  const recruitingProjects = allProjects.filter(project => project.teamStatus === 'RECRUITING');

  const mainPageData: MainPageData = {
    recentStudies: allStudies,
    recentProjects: allProjects,
    ongoingStudies,
    recruitingStudies,
    ongoingProjects,
    recruitingProjects,
  };

  return {
    data: mainPageData,
    isLoading: isLoadingStudies || isLoadingProjects,
    error: studiesError || projectsError,
    isLoadingStudies,
    isLoadingProjects,
    studiesError,
    projectsError,
  };
};

// 개별 스터디 리스트 훅 (전체보기 페이지용)
export const useStudies = (page = 0, size = 20) => {
  return useQuery({
    queryKey: ['studies', 'list', { page, size }],
    queryFn: () => fetchStudies(page, size),
    staleTime: 3 * 60 * 1000, // 3분
    gcTime: 10 * 60 * 1000, // 10분
  });
};

// 개별 프로젝트 리스트 훅 (전체보기 페이지용)
export const useProjects = (page = 0, size = 20) => {
  return useQuery({
    queryKey: ['projects', 'list', { page, size }],
    queryFn: () => fetchProjects(page, size),
    staleTime: 3 * 60 * 1000, // 3분
    gcTime: 10 * 60 * 1000, // 10분
  });
};
