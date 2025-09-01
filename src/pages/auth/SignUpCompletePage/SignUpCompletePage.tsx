import { useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

import Button from '@/components/Button/Button';

import styles from './SignUpCompletePage.module.scss';

export default function SignUpCompletePage() {
  const navigate = useNavigate();

  // sessionStorage에서 회원가입 성공 플래그 확인
  useEffect(() => {
    const signUpSuccess = sessionStorage.getItem('signUpSuccess');

    // 회원가입을 거치지 않고 직접 접근하면 회원가입 페이지로 리다이렉트
    if (!signUpSuccess) {
      navigate('/auth/signup', { replace: true });
      return;
    }

    // 페이지 접근 후 플래그 제거 (일회성 접근)
    sessionStorage.removeItem('signUpSuccess');
  }, [navigate]);

  return (
    <div className={styles.inner}>
      <h1 className={styles.title}>거의 다 왔어요!! 🙌</h1>
      <div className={styles.text}>
        <p>계정이 생성되었습니다!</p>
        <p>가입하신 이메일로 보내드린 링크를 통해 인증을 완료해 주세요.</p>
      </div>

      <Button
        className={styles.Button}
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
