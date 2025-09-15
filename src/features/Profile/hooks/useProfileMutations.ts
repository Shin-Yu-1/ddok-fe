import { useMutation, useQueryClient } from '@tanstack/react-query';

import { profileEditApi } from '@/api/profileApi';
import type { Location } from '@/types/project';
import type { CompleteProfileInfo } from '@/types/user';

interface UseProfileMutationsProps {
  userId: number;
  onSuccess?: (data?: UpdateProfileApiResponse | UpdateLocationApiResponse) => void;
  onError?: (error: unknown) => void;
}

// 일반 프로필 수정 API 응답 타입
interface UpdateProfileApiResponse {
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
    region1depthName?: string;
    region2depthName?: string;
    region3depthName?: string;
    roadName?: string;
    mainBuildingNo?: string;
    subBuildingNo?: string;
    zoneNo?: string;
  };
}

// 주활동지 수정 전용 API 응답 타입
interface UpdateLocationApiResponse {
  address: string;
  region1depthName: string;
  region2depthName: string;
  region3depthName: string;
  roadName: string;
  mainBuildingNo: string;
  subBuildingNo: string | null;
  zoneNo: string;
  latitude: number;
  longitude: number;
}

export const useProfileMutations = ({ userId, onSuccess, onError }: UseProfileMutationsProps) => {
  const queryClient = useQueryClient();

  // 프로필 데이터 업데이트 헬퍼 함수
  const updateProfileData = (updatedProfile: UpdateProfileApiResponse) => {
    // 기존 프로필 데이터 가져오기
    const existingData = queryClient.getQueryData(['profile', userId]) as CompleteProfileInfo;

    if (existingData) {
      // 업데이트된 기본 프로필 정보만 반영 (기술스택, 프로젝트, 스터디는 유지)
      const updatedData: CompleteProfileInfo = {
        ...existingData,
        nickname: updatedProfile.nickname,
        profileImage: updatedProfile.profileImageUrl,
        ageGroup: updatedProfile.ageGroup,
        introduction: updatedProfile.content,
        temperature: updatedProfile.temperature,
        temperatureLevel: existingData.temperatureLevel,
        badges: updatedProfile.badges,
        abandonBadge: updatedProfile.abandonBadge,
        mainPosition: updatedProfile.mainPosition,
        subPositions: updatedProfile.subPositions,
        traits: updatedProfile.traits,
        activeHours: updatedProfile.activeHours,
        portfolio: updatedProfile.portfolio,
        location: updatedProfile.location,
      };

      // 캐시 업데이트
      queryClient.setQueryData(['profile', userId], updatedData);
    }
  };

  // 자기소개 수정
  const updateContentMutation = useMutation({
    mutationFn: (content: string) => profileEditApi.updateContent({ content }),
    onSuccess: data => {
      updateProfileData(data);
      onSuccess?.();
    },
    onError,
  });

  // 포지션 수정
  const updatePositionsMutation = useMutation({
    mutationFn: ({
      mainPosition,
      subPositions,
    }: {
      mainPosition: string;
      subPositions: string[];
    }) => profileEditApi.updatePositions({ mainPosition, subPositions }),
    onSuccess: data => {
      updateProfileData(data);
      onSuccess?.();
    },
    onError,
  });

  // 성향 수정
  const updateTraitsMutation = useMutation({
    mutationFn: (traits: string[]) => profileEditApi.updateTraits({ traits }),
    onSuccess: data => {
      updateProfileData(data);
      onSuccess?.();
    },
    onError,
  });

  // 활동 시간 수정
  const updateHoursMutation = useMutation({
    mutationFn: ({ start, end }: { start: string; end: string }) =>
      profileEditApi.updateHours({ start, end }),
    onSuccess: data => {
      updateProfileData(data);
      onSuccess?.();
    },
    onError,
  });

  // 포트폴리오 수정
  const updatePortfolioMutation = useMutation({
    mutationFn: (portfolio: Array<{ linkTitle: string; link: string }>) =>
      profileEditApi.updatePortfolio({ portfolio }),
    onSuccess: data => {
      updateProfileData(data);
      onSuccess?.();
    },
    onError,
  });

  // 기술 스택 수정
  const updateStacksMutation = useMutation({
    mutationFn: (techStacks: string[]) => profileEditApi.updateStacks({ techStacks }),
    onSuccess: data => {
      updateProfileData(data);
      onSuccess?.();
    },
    onError,
  });

  // 주활동지 수정
  const updateLocationMutation = useMutation({
    mutationFn: (location: Location) => profileEditApi.updateLocation({ location }),
    onSuccess: data => {
      // location만 업데이트하므로 기존 프로필 데이터에 location만 변경
      const existingData = queryClient.getQueryData(['profile', userId]) as CompleteProfileInfo;
      if (existingData) {
        const updatedData: CompleteProfileInfo = {
          ...existingData,
          location: {
            latitude: data.latitude,
            longitude: data.longitude,
            address: data.address,
            region1depthName: data.region1depthName,
            region2depthName: data.region2depthName,
            region3depthName: data.region3depthName,
            roadName: data.roadName,
            mainBuildingNo: data.mainBuildingNo,
            subBuildingNo: data.subBuildingNo || '',
            zoneNo: data.zoneNo,
          },
        };
        queryClient.setQueryData(['profile', userId], updatedData);
      }
      onSuccess?.(data);
    },
    onError,
  });

  return {
    updateContent: updateContentMutation,
    updatePositions: updatePositionsMutation,
    updateTraits: updateTraitsMutation,
    updateHours: updateHoursMutation,
    updatePortfolio: updatePortfolioMutation,
    updateStacks: updateStacksMutation,
    updateLocation: updateLocationMutation,

    // 로딩 상태들
    isUpdating:
      updateContentMutation.isPending ||
      updatePositionsMutation.isPending ||
      updateTraitsMutation.isPending ||
      updateHoursMutation.isPending ||
      updatePortfolioMutation.isPending ||
      updateStacksMutation.isPending ||
      updateLocationMutation.isPending,
  };
};
