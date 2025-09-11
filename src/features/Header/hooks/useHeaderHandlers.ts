import { useNavigate } from 'react-router-dom';

import { signOut } from '@/api/auth';
import { useAuthStore } from '@/stores/authStore';

export const useHeaderHandlers = () => {
  const navigate = useNavigate();
  const { setLoggedOut } = useAuthStore();

  const handleSignIn = () => {
    navigate('/auth/signin');
  };

  const handleSignUp = () => {
    navigate('/auth/signup');
  };

  const handleLogout = async () => {
    try {
      // 실제 로그아웃 API 호출
      await signOut();

      // 스토어에서 로그아웃 처리 (토큰 및 사용자 정보 삭제)
      setLoggedOut();

      // 홈으로 이동
      navigate('/');

      console.log('로그아웃 성공');
    } catch (error) {
      console.error('로그아웃 실패:', error);

      // API 실패해도 로컬 상태는 초기화 (네트워크 문제일 수 있으므로)
      setLoggedOut();
      navigate('/');
    }
  };

  const handleProfileClick = () => {
    navigate('/profile/my');
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  return {
    handleSignIn,
    handleSignUp,
    handleLogout,
    handleProfileClick,
    handleLogoClick,
  };
};
