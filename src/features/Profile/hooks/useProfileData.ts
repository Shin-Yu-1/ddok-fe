import { useState, useEffect, useCallback } from 'react';

import { profileApi } from '@/api/profileApi';
import { useAuthStore } from '@/stores/authStore';
import type { CompleteProfileInfo } from '@/types/user';

import { convertApiToProfile } from '../utils';

export const useProfileData = (userId?: string, isMine: boolean = false) => {
  const [profileData, setProfileData] = useState<CompleteProfileInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getUserInfo } = useAuthStore();

  const loadProfile = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      let targetUserId: number;

      if (isMine) {
        // 본인 프로필: authStore에서 사용자 ID 가져오기
        const currentUser = getUserInfo();
        if (!currentUser?.id) {
          throw new Error('로그인 정보가 없습니다.');
        }
        targetUserId = currentUser.id;
      } else {
        // 타인 프로필: URL 파라미터에서 사용자 ID 가져오기
        if (!userId) {
          throw new Error('사용자 ID가 없습니다.');
        }
        targetUserId = parseInt(userId, 10);
        if (isNaN(targetUserId)) {
          throw new Error('유효하지 않은 사용자 ID입니다.');
        }
      }

      // 4개 API 병렬 호출 - 기술 스택은 첫 8개만
      const [profileResponse, techStacksResponse, studiesResponse, projectsResponse] =
        await Promise.all([
          profileApi.getProfile(targetUserId),
          profileApi.getTechStacks(targetUserId, 0, 8),
          profileApi.getStudies(targetUserId),
          profileApi.getProjects(targetUserId),
        ]);

      // API 응답을 CompleteProfileInfo로 변환
      const completeProfile = convertApiToProfile(
        profileResponse,
        techStacksResponse,
        studiesResponse,
        projectsResponse,
        isMine
      );

      // 페이지네이션 정보 추가
      completeProfile.techStacksTotalItems = techStacksResponse.pagination.totalItems;
      completeProfile.studiesTotalItems = studiesResponse.pagination.totalItems;
      completeProfile.projectsTotalItems = projectsResponse.pagination.totalItems;
      completeProfile.techStacksTotalItems = techStacksResponse.pagination.totalItems;

      setProfileData(completeProfile);
    } catch (err) {
      console.error('프로필 로딩 에러:', err);
      setError(err instanceof Error ? err.message : '프로필을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [userId, isMine, getUserInfo]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  return {
    profileData,
    isLoading,
    error,
    setProfileData,
    refetch: loadProfile,
  };
};
