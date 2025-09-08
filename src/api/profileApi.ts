import api from '@/api/api';
import type { ApiResponse } from '@/types/api';

// API 응답 타입들
interface ProfileApiResponse {
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
}

interface TechStackApiResponse {
  pagination: {
    currentPage: number;
    pageSize: number;
    totalPages: number;
    totalItems: number;
  };
  items: Array<{
    techStack: string;
  }>;
}

interface StudyApiResponse {
  pagination: {
    currentPage: number;
    pageSize: number;
    totalPages: number;
    totalItems: number;
  };
  items: Array<{
    studyId: number;
    title: string;
    teamStatus: 'ONGOING' | 'CLOSED';
    location: {
      latitude: number;
      longitude: number;
      address: string;
    };
    period: {
      start: string;
      end: string;
    };
  }>;
}

interface ProjectApiResponse {
  pagination: {
    currentPage: number;
    pageSize: number;
    totalPages: number;
    totalItems: number;
  };
  items: Array<{
    projectId: number;
    title: string;
    teamStatus: 'ONGOING' | 'CLOSED';
    location: {
      latitude: number;
      longitude: number;
      address: string;
    };
    period: {
      start: string;
      end: string;
    };
  }>;
}

// 프로필 수정 요청 타입들
interface UpdateContentRequest {
  content: string;
}

interface UpdatePositionsRequest {
  mainPosition: string;
  subPositions: string[];
}

interface UpdateTraitsRequest {
  traits: string[];
}

interface UpdateHoursRequest {
  start: string;
  end: string;
}

interface UpdatePortfolioRequest {
  portfolio: Array<{
    linkTitle: string;
    link: string;
  }>;
}

interface UpdateStacksRequest {
  techStacks: string[];
}

// 프로필 수정 응답 타입
interface UpdateProfileResponse {
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
}

export const profileApi = {
  // 프로필 상세 조회
  getProfile: async (userId: number): Promise<ProfileApiResponse> => {
    const response = await api.get<ApiResponse<ProfileApiResponse>>(
      `/api/players/${userId}/profile`
    );
    return response.data.data;
  },

  // 기술 스택 조회
  getTechStacks: async (userId: number, page = 0, size = 20): Promise<TechStackApiResponse> => {
    const response = await api.get<ApiResponse<TechStackApiResponse>>(
      `/api/players/${userId}/profile/stacks?page=${page}&size=${size}`
    );
    return response.data.data;
  },

  // 참여 스터디 목록 조회
  getStudies: async (userId: number, page = 0, size = 4): Promise<StudyApiResponse> => {
    const response = await api.get<ApiResponse<StudyApiResponse>>(
      `/api/players/${userId}/profile/studies?page=${page}&size=${size}`
    );
    return response.data.data;
  },

  // 참여 프로젝트 목록 조회
  getProjects: async (userId: number, page = 0, size = 3): Promise<ProjectApiResponse> => {
    const response = await api.get<ApiResponse<ProjectApiResponse>>(
      `/api/players/${userId}/profile/projects?page=${page}&size=${size}`
    );
    return response.data.data;
  },
};

export const profileEditApi = {
  // 자기소개 수정
  updateContent: async (data: UpdateContentRequest): Promise<UpdateProfileResponse> => {
    const response = await api.patch<ApiResponse<{ profile: UpdateProfileResponse }>>(
      '/api/players/profile/content',
      data
    );
    return response.data.data.profile;
  },

  // 포지션 수정
  updatePositions: async (data: UpdatePositionsRequest): Promise<UpdateProfileResponse> => {
    const response = await api.patch<ApiResponse<{ profile: UpdateProfileResponse }>>(
      '/api/players/profile/positions',
      data
    );
    return response.data.data.profile;
  },

  // 성향 수정
  updateTraits: async (data: UpdateTraitsRequest): Promise<UpdateProfileResponse> => {
    const response = await api.patch<ApiResponse<{ profile: UpdateProfileResponse }>>(
      '/api/players/profile/traits',
      data
    );
    return response.data.data.profile;
  },

  // 활동 시간 수정
  updateHours: async (data: UpdateHoursRequest): Promise<UpdateProfileResponse> => {
    const response = await api.patch<ApiResponse<{ profile: UpdateProfileResponse }>>(
      '/api/players/profile/hours',
      data
    );
    return response.data.data.profile;
  },

  // 포트폴리오 수정
  updatePortfolio: async (data: UpdatePortfolioRequest): Promise<UpdateProfileResponse> => {
    const response = await api.patch<ApiResponse<{ profile: UpdateProfileResponse }>>(
      '/api/players/profile/portfolio',
      data
    );
    return response.data.data.profile;
  },

  // 기술 스택 수정
  updateStacks: async (data: UpdateStacksRequest): Promise<UpdateProfileResponse> => {
    const response = await api.patch<ApiResponse<{ profile: UpdateProfileResponse }>>(
      '/api/players/profile/stacks',
      data
    );
    return response.data.data.profile;
  },
};
