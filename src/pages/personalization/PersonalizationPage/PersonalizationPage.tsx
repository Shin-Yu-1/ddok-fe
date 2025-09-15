import { useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

import PersonalizationForm from '@/features/Auth/PersonalizationForm/PersonalizationForm';
import { useAuthStore } from '@/stores/authStore';

import styles from './PersonalizationPage.module.scss';

const PersonalizationPage = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuthStore();

  useEffect(() => {
    // 로그인하지 않은 사용자는 로그인 페이지로 리다이렉트
    if (!isLoggedIn) {
      navigate('/auth/signin', { replace: true });
      return;
    }

    // 이미 개인화 설정을 완료한 사용자는 메인 페이지로 리다이렉트
    if (user?.isPreference) {
      navigate('/map', { replace: true });
      return;
    }
  }, [isLoggedIn, user, navigate]);

  return (
    <div className={styles.inner}>
      <p className={styles.text}>
        편리한 서비스 이용을 위해 아래 정보가 필요합니다.
        <br />
        해당 정보는 명시된 목적 외에는 이용되지 않습니다.
      </p>
      <PersonalizationForm />
    </div>
  );
};

export default PersonalizationPage;
