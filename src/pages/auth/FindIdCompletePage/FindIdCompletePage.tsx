import { useEffect } from 'react';

import { useNavigate, useSearchParams } from 'react-router-dom';

import Button from '@/components/Button/Button';
import { useAuthRedirect } from '@/hooks/auth/useAuthRedirect';

import styles from './FindIdCompletePage.module.scss';

export default function FindIdCompletePage() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';
  const navigate = useNavigate();

  // 로그인된 사용자는 메인 페이지로 리다이렉트
  useAuthRedirect('/map');

  useEffect(() => {
    // sessionStorage에서 아이디 찾기 성공 플래그 확인
    const findIdSuccess = sessionStorage.getItem('findIdSuccess');
    const storedEmail = sessionStorage.getItem('findIdEmail');

    // 아이디 찾기를 거치지 않고 직접 접근하거나, 이메일이 일치하지 않으면 리다이렉트
    if (!findIdSuccess || !email || email !== storedEmail) {
      navigate('/auth/findid', { replace: true });
      return;
    }

    // 페이지 접근 후 플래그 제거 (일회성 접근)
    sessionStorage.removeItem('findIdSuccess');
    sessionStorage.removeItem('findIdEmail');
  }, [email, navigate]);

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
