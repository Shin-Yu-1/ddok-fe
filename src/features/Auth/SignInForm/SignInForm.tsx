import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { signIn, getErrorMessage } from '@/api/auth';
import kakaoIcon from '@/assets/icons/kakao-icon.svg';
import Button from '@/components/Button/Button';
import FormField from '@/features/Auth/components/FormField/FormField';
import Input from '@/features/Auth/components/Input/Input';
import PasswordInput from '@/features/Auth/components/Input/PasswordInput';
import { signInSchema } from '@/schemas/auth.schema';
import type { SignInFormValues } from '@/schemas/auth.schema';
import { useAuthStore } from '@/stores/authStore';

import styles from './SignInForm.module.scss';

export default function SignInForm() {
  const {
    register,
    handleSubmit,
    watch,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    mode: 'onChange',
  });

  const { setLoggedIn } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const email = watch('email');
  const password = watch('password');

  const onSubmit = async (data: SignInFormValues) => {
    setIsLoading(true);
    clearErrors('root');

    try {
      const result = await signIn(data);

      if (result.accessToken && result.user) {
        console.log('SignInForm - API 응답:', result);
        console.log('SignInForm - isPreference:', result.user.isPreference);

        // 로그인 성공 - authStore에 사용자 정보 설정
        setLoggedIn(
          {
            id: result.user.id,
            username: result.user.username,
            email: result.user.email,
            nickname: result.user.nickname || '',
            profileImageUrl: result.user.profileImageUrl || '',
            isPreference: result.user.isPreference, // 개인화 설정 완료 여부 저장
          },
          result.accessToken
        );

        // 리다이렉트는 SignInPage의 useEffect에서 처리됨
        console.log('SignInForm - authStore 업데이트 완료, 리다이렉트는 SignInPage에서 처리');
      }
    } catch (apiError) {
      setError('root', {
        type: 'manual',
        message: getErrorMessage(apiError),
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 기존 useEffect는 제거하거나 수정
  // useEffect(() => {
  //   if (isLoggedIn) navigate('/map');
  // }, [isLoggedIn, navigate]);

  const hasErrors = Object.keys(errors).some(
    key => key !== 'root' && errors[key as keyof typeof errors]
  );
  const isButtonDisabled = isLoading || !email || !password || hasErrors;

  const handleKakaoLogin = () => {
    // 카카오 로그인 구현
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <FormField label="이메일" htmlFor="email" required error={errors.email?.message}>
        <Input id="email" placeholder="user@goorm.com" {...register('email')} />
      </FormField>

      <FormField
        label="비밀번호"
        htmlFor="password"
        required
        error={errors.password?.message || errors.root?.message}
      >
        <PasswordInput id="password" placeholder="********" {...register('password')} />
      </FormField>

      <Button
        variant={isButtonDisabled ? 'ghost' : 'secondary'}
        radius="xsm"
        className={styles.loginBtn}
        type="submit"
        disabled={isButtonDisabled}
        height="45px"
      >
        {isLoading ? '로그인 중...' : '로그인'}
      </Button>

      <Button
        variant="outline"
        radius="xsm"
        className={styles.kakaoLoginBtn}
        type="button"
        onClick={handleKakaoLogin}
        backgroundColor="#FEE500"
        textColor="#000000"
        fullWidth
        leftIcon={<img src={kakaoIcon} alt="카카오" className={styles.kakaoIcon} />}
        height="45px"
      >
        카카오 로그인
      </Button>
    </form>
  );
}
