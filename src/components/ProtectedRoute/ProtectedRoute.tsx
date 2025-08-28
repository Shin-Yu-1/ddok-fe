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
    console.log('ProtectedRoute - 현재 경로:', location.pathname);
    console.log('ProtectedRoute - isLoggedIn:', isLoggedIn);
    console.log('ProtectedRoute - user:', user);
    console.log('ProtectedRoute - requirePreference:', requirePreference);

    // 로그인하지 않은 경우
    if (!isLoggedIn || !user) {
      console.log('ProtectedRoute - 로그인 안됨, /auth/signin으로 이동');
      navigate('/auth/signin', { replace: true });
      return;
    }

    // 개인화 설정이 필요한 페이지인데 완료되지 않은 경우
    if (requirePreference && user.isPreference === false) {
      // 현재 페이지가 개인화 설정 페이지가 아닌 경우에만 리다이렉트
      if (location.pathname !== '/personalization') {
        console.log('ProtectedRoute - 개인화 설정 미완료, /personalization으로 이동');
        navigate('/personalization', { replace: true });
        return;
      }
    }

    console.log('ProtectedRoute - 통과, 현재 페이지 렌더링');
  }, [isLoggedIn, user, navigate, location.pathname, requirePreference]);

  // 로그인하지 않은 경우 렌더링하지 않음
  if (!isLoggedIn || !user) {
    return null;
  }

  // 개인화 설정이 필요한데 완료되지 않은 경우, 개인화 설정 페이지가 아니라면 렌더링하지 않음
  if (
    requirePreference &&
    user.isPreference === false &&
    location.pathname !== '/personalization'
  ) {
    return null;
  }

  return <>{children}</>;
}
