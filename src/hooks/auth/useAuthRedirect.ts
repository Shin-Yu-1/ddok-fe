import { useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

import { useAuthStore } from '@/stores/authStore';

/**
 * 로그인된 사용자가 인증 페이지에 접근하려 할 때 리다이렉트하는 훅
 * @param redirectTo - 리다이렉트할 경로 (기본값: '/map')
 */
export const useAuthRedirect = (redirectTo: string = '/map') => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuthStore();

  useEffect(() => {
    if (isLoggedIn) {
      navigate(redirectTo, { replace: true });
    }
  }, [isLoggedIn, navigate, redirectTo]);
};
