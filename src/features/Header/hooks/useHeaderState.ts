import { useMemo } from 'react';

import { useLocation } from 'react-router-dom';

import { useAuthStore } from '@/stores/authStore';
import type { UserInfo } from '@/types/user';

interface HeaderState {
  variant: 'logo-only' | 'guest' | 'user';
  user?: UserInfo;
  isLoggedIn: boolean;
}

export const useHeaderState = (): HeaderState => {
  const { isLoggedIn, user } = useAuthStore();
  const location = useLocation();

  const headerState = useMemo(() => {
    // logo-only 모드가 필요한 경로들
    const logoOnlyRoutes = [
      '/auth/', // 모든 인증 관련 페이지
      '/intro', // 인트로 페이지
      '/personalization', // 개인화 설정 페이지
    ];

    // 현재 경로가 logo-only 경로인지 확인
    const shouldShowLogoOnly = logoOnlyRoutes.some(route => location.pathname.startsWith(route));

    if (shouldShowLogoOnly) {
      return {
        variant: 'logo-only' as const,
        user: undefined,
        isLoggedIn,
      };
    }

    // 일반 페이지에서 로그인 상태에 따른 variant 결정
    if (isLoggedIn && user) {
      return {
        variant: 'user' as const,
        user: {
          id: user.id,
          nickname: user.nickname || '사용자',
          profileImageUrl: user.profileImageUrl || '/src/assets/images/avatar.png',
          email: user.email,
        } as UserInfo,
        isLoggedIn,
      };
    }

    return {
      variant: 'guest' as const,
      user: undefined,
      isLoggedIn,
    };
  }, [isLoggedIn, user, location.pathname]);

  return headerState;
};
