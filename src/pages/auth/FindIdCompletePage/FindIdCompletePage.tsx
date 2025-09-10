import { useEffect } from 'react';

import { useNavigate, useSearchParams } from 'react-router-dom';

import Button from '@/components/Button/Button';
import { useAuthRedirect } from '@/hooks/auth/useAuthRedirect';

import styles from './FindIdCompletePage.module.scss';

declare global {
  interface Window {
    __findIdPageValidated__?: boolean;
  }
}

export default function FindIdCompletePage() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';
  const navigate = useNavigate();

  // 로그인된 사용자는 메인 페이지로 리다이렉트
  useAuthRedirect('/map');

  useEffect(() => {
    if (window.__findIdPageValidated__) {
      return;
    }

    // sessionStorage에서 아이디 찾기 성공 플래그 확인
    const findIdSuccess = sessionStorage.getItem('findIdSuccess');
    const storedEmail = sessionStorage.getItem('findIdEmail');

    const isValidEmail = email && email.includes('@');

    if (!isValidEmail) {
      navigate('/auth/findid', { replace: true });
      return;
    }

    if (findIdSuccess && storedEmail === email) {
      sessionStorage.removeItem('findIdSuccess');
      sessionStorage.removeItem('findIdEmail');
    }

    window.__findIdPageValidated__ = true;
  }, [email, navigate]);

  useEffect(() => {
    return () => {
      delete window.__findIdPageValidated__;
      sessionStorage.removeItem('findIdSuccess');
      sessionStorage.removeItem('findIdEmail');
    };
  }, []);

  // 이메일이 없으면 FindId 페이지로 리다이렉트
  if (!email) {
    return null;
  }

  return (
    <div className={styles.inner}>
      <h1 className={styles.title}>당신의 이메일은!</h1>
      <div className={styles.email}>
        <span>{email}</span>
      </div>
      <Button
        className={styles.submitBtn}
        variant="secondary"
        type="button"
        onClick={() => navigate('/auth/signin')}
        radius="xsm"
        height="45px"
      >
        로그인으로
      </Button>
    </div>
  );
}
