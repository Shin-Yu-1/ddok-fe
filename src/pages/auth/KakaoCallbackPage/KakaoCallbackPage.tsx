import { useEffect, useRef } from 'react';

import { useNavigate, useSearchParams } from 'react-router-dom';

import { signInWithKakao, getErrorMessage } from '@/api/auth';
import { useAuthStore } from '@/stores/authStore';

import styles from './KakaoCallbackPage.module.scss';

export default function KakaoCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setAuthSocialLogin } = useAuthStore();
  const hasProcessed = useRef(false);

  useEffect(() => {
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const code = searchParams.get('code');
    const error = searchParams.get('error');

    const processKey = code ? `kakao_cb_processed_${code}` : null;
    if (processKey && sessionStorage.getItem(processKey) === '1') {
      return;
    }
    if (processKey) {
      sessionStorage.setItem(processKey, '1');
    }

    const cleanUrl = `${window.location.origin}${window.location.pathname}`;
    window.history.replaceState({}, document.title, cleanUrl);

    if (error || !code) {
      navigate('/auth/signin', {
        replace: true,
        state: { message: '카카오 로그인에 실패했습니다.' },
      });
      return;
    }

    (async () => {
      try {
        const redirectUri = `${window.location.origin}/auth/kakao/callback`;

        const result = await signInWithKakao({
          authorizationCode: code,
          redirectUri,
        });

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
            isSocial: result.user.isSocial,
            location: result.user.location as {
              latitude: number;
              longitude: number;
              address: string;
              region1depthName: string; // "전북"
              region2depthName: string; // "익산시"
              region3depthName: string; // "부송동"
              roadName: string; // "망산길"
              mainBuildingNo: string; // "11"
              subBuildingNo: string; // "17"
              zoneNo: string; // "54547"
            } | null,
          },
        });

        navigate(result.user.isPreference ? '/map' : '/personalization', {
          replace: true,
        });
      } catch (apiError) {
        if (processKey) {
          sessionStorage.removeItem(processKey);
        }
        navigate('/auth/signin', {
          replace: true,
          state: { message: getErrorMessage(apiError) },
        });
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.loading}>
        <p>카카오 로그인 중...</p>
      </div>
    </div>
  );
}
