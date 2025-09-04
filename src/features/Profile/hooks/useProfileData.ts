import { useState, useEffect } from 'react';

import { mockMyProfile, mockOtherProfile } from '@/mocks/mockProfile';
import type { CompleteProfileInfo } from '@/types/user';

export const useProfileData = (userId?: string, isMine: boolean = false) => {
  const [profileData, setProfileData] = useState<CompleteProfileInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      if (!userId && !isMine) {
        setError('사용자 ID가 없습니다.');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // API 호출 시뮬레이션
        setTimeout(
          () => {
            if (isMine) {
              // 본인 프로필 로딩
              setProfileData(mockMyProfile);
            } else {
              // 타인 프로필 로딩
              if (userId === '1') {
                setProfileData(mockOtherProfile);
              } else {
                // 다른 사용자 ID의 경우 목 데이터 변형
                setProfileData({
                  ...mockOtherProfile,
                  userId: parseInt(userId!, 10),
                  nickname: `사용자${userId}`,
                });
              }
            }
            setIsLoading(false);
          },
          isMine ? 1000 : 1200
        );
      } catch {
        setError('프로필을 불러오는 중 오류가 발생했습니다.');
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [userId, isMine]);

  return { profileData, isLoading, error, setProfileData };
};
