import { useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import Button from '@/components/Button/Button';
import FormField from '@/features/Auth/components/FormField/FormField';
import PasswordInput from '@/features/Auth/components/Input/PasswordInput';
import { changePasswordSchema, type ChangePasswordFormValues } from '@/schemas/auth.schema';

import styles from './ResetPasswordPage.module.scss';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [reauthToken, setReauthToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // sessionStorage에서 reauthToken 가져오기
  useEffect(() => {
    // sessionStorage에서 비밀번호 찾기 성공 플래그 확인
    const findPasswordSuccess = sessionStorage.getItem('findPasswordSuccess');

    // sessionStorage에서 reauthToken 확인
    const token = sessionStorage.getItem('reauthToken');

    // 비밀번호 찾기를 거치지 않고 직접 접근하거나 토큰이 없으면 리다이렉트
    if (!findPasswordSuccess || !token) {
      navigate('/auth/findpassword', { replace: true });
      return;
    }

    setReauthToken(token);

    // 페이지 접근 후 플래그 제거 (일회성 접근)
    sessionStorage.removeItem('findPasswordSuccess');
  }, [navigate]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    mode: 'onChange',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const newPassword = watch('newPassword');
  const passwordCheck = watch('passwordCheck');

  // 폼 제출
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onSubmit = async (_data: ChangePasswordFormValues) => {
    if (!reauthToken) {
      setError('인증 토큰이 없습니다. 다시 시도해주세요.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // 목 데이터로 처리
      await new Promise(resolve => setTimeout(resolve, 1200));

      // sessionStorage에서 reauthToken 제거
      sessionStorage.removeItem('reauthToken');

      // 로그인 페이지로 이동
      navigate('/auth/signin', {
        state: { message: '비밀번호가 성공적으로 변경되었습니다.' },
      });
    } catch {
      setError('비밀번호 변경에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isButtonDisabled = isSubmitting || !newPassword || !passwordCheck;

  // 토큰이 아직 로드되지 않았으면 로딩 표시
  if (!reauthToken) {
    return (
      <div className={styles.container}>
        <div>토큰을 확인하는 중...</div>
      </div>
    );
  }

  return (
    <div className={styles.inner}>
      <h1 className={styles.title}>새 비밀번호 설정</h1>
      <p className={styles.text}>새로운 비밀번호를 입력하고 계정을 보호하세요!</p>

      {error && (
        <div style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <FormField
          label="새 비밀번호"
          htmlFor="newPassword"
          required
          error={errors.newPassword?.message}
        >
          <PasswordInput
            id="newPassword"
            {...register('newPassword')}
            placeholder="새 비밀번호를 입력하세요"
          />
        </FormField>

        <FormField
          label="비밀번호 확인"
          htmlFor="passwordCheck"
          required
          error={errors.passwordCheck?.message}
        >
          <PasswordInput
            id="passwordCheck"
            {...register('passwordCheck')}
            placeholder="비밀번호를 다시 입력하세요"
          />
        </FormField>

        <Button
          type="submit"
          className={styles.submitBtn}
          disabled={isButtonDisabled}
          variant={!isButtonDisabled ? 'secondary' : 'ghost'}
          radius="xsm"
          height="45px"
        >
          {isSubmitting ? '비밀번호 변경 중...' : '비밀번호 변경'}
        </Button>
      </form>
    </div>
  );
}
