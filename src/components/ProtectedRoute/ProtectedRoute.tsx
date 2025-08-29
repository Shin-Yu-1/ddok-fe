import { useEffect } from 'react';

import { useNavigate, useLocation } from 'react-router-dom';

import { useAuthStore } from '@/stores/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requirePreference?: boolean; // 개인화 설정 완료 필요 여부
}

export default function ProtectedRoute({
  children,
  requirePreference = true,
}: ProtectedRouteProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, user } = useAuthStore();

  useEffect(() => {
    // 로그인한 사용자에 대해서만 개인화 설정 체크
    if (isLoggedIn && user && requirePreference && user.isPreference === false) {
      // 현재 페이지가 개인화 설정 페이지가 아닌 경우에만 리다이렉트
      if (location.pathname !== '/personalization') {
        navigate('/personalization', { replace: true });
        return;
      }
    }
  }, [isLoggedIn, user, navigate, location.pathname, requirePreference]);

  // 로그인한 사용자 중 개인화 설정이 필요한데 완료되지 않은 경우, 개인화 설정 페이지가 아니라면 렌더링하지 않음
  if (
    isLoggedIn &&
    user &&
    requirePreference &&
    user.isPreference === false &&
    location.pathname !== '/personalization'
  ) {
    return null;
  }

  return <>{children}</>;
}
