import { useState } from 'react';

import { useMutation } from '@tanstack/react-query';

import { profileApi } from '@/api/profileApi';
import type { CompleteProfileInfo } from '@/types/user';

interface UseProfileToggleProps {
  user: CompleteProfileInfo;
  enabled?: boolean;
  onSuccess?: (newPrivacyState: boolean) => void;
  onError?: (error: unknown) => void;
}

export const useProfileToggle = ({
  user,
  enabled = true, // 기본값은 활성화
  onSuccess,
  onError,
}: UseProfileToggleProps) => {
  const [isProfilePublic, setIsProfilePublic] = useState(user.isProfilePublic ?? true);
  const [isToggling, setIsToggling] = useState(false);

  const toggleMutation = useMutation({
    mutationFn: profileApi.togglePrivacy,
    onMutate: () => {
      setIsToggling(true);
    },
    onSuccess: data => {
      // 서버 응답의 실제 상태로 업데이트
      setIsProfilePublic(data.isPublic);
      setIsToggling(false);

      console.log('프로필 공개 상태 변경 성공:', data.isPublic ? '공개' : '비공개');

      onSuccess?.(data.isPublic);
    },
    onError: error => {
      setIsToggling(false);

      console.error('프로필 공개 상태 변경 실패:', error);

      // 에러 발생 시 원래 상태로 복구
      setIsProfilePublic(user.isProfilePublic ?? true);

      onError?.(error);
    },
  });

  const handleTogglePrivacy = async () => {
    // enabled가 false이거나 이미 진행 중이면 무시
    if (!enabled || isToggling) return;

    try {
      // 즉시 UI 변경
      const newState = !isProfilePublic;
      setIsProfilePublic(newState);

      // API 호출
      await toggleMutation.mutateAsync();
    } catch (error) {
      // 에러는 onError에서 처리됨
      console.error('토글 에러:', error);
    }
  };

  return {
    isProfilePublic,
    isToggling: enabled ? isToggling : false, // enabled가 false면 로딩 상태도 false
    handleTogglePrivacy,
    toggleError: toggleMutation.error,
    isError: enabled ? toggleMutation.isError : false, // enabled가 false면 에러도 false
  };
};
