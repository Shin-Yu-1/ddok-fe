import type { CompleteProfileInfo, TechStack, ParticipationHistory } from '@/types/user';

import { getTemperatureLevel } from './temperatureUtils';

// profileApi.ts의 타입들
type ProfileApiResponse = {
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
  badges: Array<{
    type: 'complete' | 'leader_complete' | 'login';
    tier: 'bronze' | 'silver' | 'gold';
  }>;
  abandonBadge: {
    isGranted: boolean;
    count: number;
  };
  activeHours: {
    start: string;
    end: string;
  };
  traits: string[];
  content: string;
  portfolio: Array<{
    linkTitle: string;
    link: string;
  }>;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
};

type TechStackApiResponse = {
  pagination: {
    currentPage: number;
    pageSize: number;
    totalPages: number;
    totalItems: number;
  };
  items: Array<{
    techStack: string;
  }>;
};

type StudyApiResponse = {
  pagination: {
    currentPage: number;
    pageSize: number;
    totalPages: number;
    totalItems: number;
  };
  items: Array<{
    studyId: number;
    teamId: number;
    title: string;
    teamStatus: 'ONGOING' | 'CLOSED';
    location: {
      latitude: number;
      longitude: number;
      address: string;
    };
    period: {
      start: string;
      end: string | null;
    };
  }>;
};

type ProjectApiResponse = {
  pagination: {
    currentPage: number;
    pageSize: number;
    totalPages: number;
    totalItems: number;
  };
  items: Array<{
    projectId: number;
    teamId: number;
    title: string;
    teamStatus: 'ONGOING' | 'CLOSED';
    location: {
      latitude: number;
      longitude: number;
      address: string;
    };
    period: {
      start: string;
      end: string | null;
    };
  }>;
};

// 4개 API 응답을 CompleteProfileInfo로 변환
export const convertApiToProfile = (
  profileResponse: ProfileApiResponse,
  techStacksResponse: TechStackApiResponse,
  studiesResponse: StudyApiResponse,
  projectsResponse: ProjectApiResponse,
  isMine: boolean = false
): CompleteProfileInfo => {
  const techStacks: TechStack[] = techStacksResponse.items.map((item, index) => ({
    id: index + 1, // API에 id가 없으므로 인덱스 사용
    name: item.techStack,
  }));

  // 스터디 이력 변환
  const studies: ParticipationHistory[] = studiesResponse.items.map(study => ({
    id: study.studyId,
    teamId: study.teamId,
    title: study.title,
    type: 'study' as const,
    status: study.teamStatus,
    startDate: study.period.start,
    endDate: study.teamStatus === 'CLOSED' ? study.period.end : undefined,
  }));

  // 프로젝트 이력 변환
  const projects: ParticipationHistory[] = projectsResponse.items.map(project => ({
    id: project.projectId,
    teamId: project.teamId,
    title: project.title,
    type: 'project' as const,
    status: project.teamStatus,
    startDate: project.period.start,
    endDate: project.teamStatus === 'CLOSED' ? project.period.end : undefined,
  }));

  // CompleteProfileInfo 구성
  const completeProfile: CompleteProfileInfo = {
    // 기본 정보
    userId: profileResponse.userId,
    nickname: profileResponse.nickname,
    profileImage: profileResponse.profileImageUrl,
    ageGroup: profileResponse.ageGroup,
    introduction: profileResponse.content,

    // 권한 관련
    isMine: isMine,
    isProfilePublic: profileResponse.isPublic,
    chatRoomId: profileResponse.chatRoomId,
    dmRequestPending: profileResponse.dmRequestPending,

    // 온도와 레벨 (프론트에서 계산)
    temperature: profileResponse.temperature,
    temperatureLevel: getTemperatureLevel(profileResponse.temperature),

    // 뱃지
    badges: profileResponse.badges,
    abandonBadge: profileResponse.abandonBadge,

    // 포지션
    mainPosition: profileResponse.mainPosition,
    subPositions: profileResponse.subPositions,

    // 성향
    traits: profileResponse.traits,

    // 활동 시간
    activeHours: profileResponse.activeHours,

    // 포트폴리오
    portfolio: profileResponse.portfolio,

    // 위치
    location: profileResponse.location,

    // 별도 API 데이터들
    techStacks,
    projects,
    studies,
  };

  return completeProfile;
};
