import { useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { resetPassword, getErrorMessage } from '@/api/auth';
import Button from '@/components/Button/Button';
import FormField from '@/features/Auth/components/FormField/FormField';
import PasswordInput from '@/features/Auth/components/Input/PasswordInput';
import { useAuthRedirect } from '@/hooks/auth/useAuthRedirect';
import { changePasswordSchema, type ChangePasswordFormValues } from '@/schemas/auth.schema';

import styles from './ResetPasswordPage.module.scss';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [reauthToken, setReauthToken] = useState<string | null>(null);
  const [apiErrors, setApiErrors] = useState<Record<string, string>>({});

  // 로그인된 사용자는 메인 페이지로 리다이렉트
  useAuthRedirect('/map');

  // sessionStorage에서 reauthToken 가져오기
  useEffect(() => {
    // 약간의 지연을 주어 sessionStorage 저장이 완료되도록 함
    const timer = setTimeout(() => {
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
    }, 100); // 100ms 지연

    return () => clearTimeout(timer);
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
  const onSubmit = async (data: ChangePasswordFormValues) => {
    if (!reauthToken) {
      setApiErrors({ general: '인증 토큰이 없습니다. 다시 시도해주세요.' });
      return;
    }

    setIsSubmitting(true);
    setApiErrors({});

    try {
      // 실제 API 호출
      await resetPassword(
        {
          newPassword: data.newPassword,
          passwordCheck: data.passwordCheck,
        },
        reauthToken
      );

      // sessionStorage에서 reauthToken 제거
      sessionStorage.removeItem('reauthToken');

      // 로그인 페이지로 이동
      navigate('/auth/signin', {
        state: { message: '비밀번호가 성공적으로 변경되었습니다.' },
      });
    } catch (error) {
      setApiErrors({ general: getErrorMessage(error) });
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

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <FormField
          label="새 비밀번호"
          htmlFor="newPassword"
          required
          error={errors.newPassword?.message || apiErrors.newPassword}
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
          error={errors.passwordCheck?.message || apiErrors.passwordCheck}
        >
          <PasswordInput
            id="passwordCheck"
            {...register('passwordCheck')}
            placeholder="비밀번호를 다시 입력하세요"
          />
        </FormField>

        {apiErrors.general && (
          <div style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>
            {apiErrors.general}
          </div>
        )}

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
