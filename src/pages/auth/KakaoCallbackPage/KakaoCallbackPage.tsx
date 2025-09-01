import { useEffect } from 'react';

import { useNavigate, useSearchParams } from 'react-router-dom';

import { signInWithKakao, getErrorMessage } from '@/api/auth';
import { useAuthStore } from '@/stores/authStore';

import styles from './KakaoCallbackPage.module.scss';

export default function KakaoCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setAuthSocialLogin } = useAuthStore();

  useEffect(() => {
    const handleKakaoCallback = async () => {
      console.log('카카오 콜백 페이지 진입');
      console.log('현재 URL:', window.location.href);

      const code = searchParams.get('code');
      const error = searchParams.get('error');

      console.log('인증 코드:', code);
      console.log('에러:', error);

      // 에러가 있거나 코드가 없으면 로그인 페이지로 리다이렉트
      if (error || !code) {
        console.error('카카오 로그인 에러:', error);
        navigate('/auth/signin', {
          replace: true,
          state: { message: '카카오 로그인에 실패했습니다.' },
        });
        return;
      }

      try {
        console.log('카카오 로그인 API 호출 시작');
        // 카카오 로그인 API 호출
        const result = await signInWithKakao({
          authorizationCode: code,
          redirectUri: `${window.location.origin}/auth/kakao/callback`,
        });

        console.log('카카오 로그인 성공:', result);

        // 로그인 성공 - authStore에 사용자 정보 설정
        setAuthSocialLogin({
          accessToken: result.accessToken,
          user: {
            id: result.user.id,
            username: result.user.username,
            email: result.user.email,
            nickname: result.user.nickname || null,
            profileImageUrl: result.user.profileImageUrl || null,
            isPreference: result.user.isPreference,
            mainPosition: result.user.mainPosition as string | null,
            location: result.user.location as {
              latitude: number;
              longitude: number;
              address: string;
            } | null,
          },
        });

        console.log('인증 정보 저장 완료');

        // 개인화 설정 완료 여부에 따라 리다이렉트
        if (!result.user.isPreference) {
          console.log('개인화 설정 페이지로 리다이렉트');
          navigate('/personalization', { replace: true });
        } else {
          console.log('메인 페이지로 리다이렉트');
          navigate('/map', { replace: true });
        }
      } catch (apiError) {
        console.error('카카오 로그인 API 에러:', getErrorMessage(apiError));
        navigate('/auth/signin', {
          replace: true,
          state: { message: getErrorMessage(apiError) },
        });
      }
    };

    handleKakaoCallback();
  }, [searchParams, navigate, setAuthSocialLogin]);

  return (
    <div className={styles.container}>
      <div className={styles.loading}>
        <p>카카오 로그인 중...</p>
      </div>
    </div>
  );
}
