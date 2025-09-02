import { useState, useEffect, useRef } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { checkEmail, sendPhoneCode, verifyPhoneCode, signUp, getErrorMessage } from '@/api/auth';
import Button from '@/components/Button/Button';
import FormField from '@/features/Auth/components/FormField/FormField';
import Input from '@/features/Auth/components/Input/Input';
import PasswordInput from '@/features/Auth/components/Input/PasswordInput';
import { signUpSchema } from '@/schemas/auth.schema';
import type { SignUpFormValues } from '@/schemas/auth.schema';

import styles from './SignUpForm.module.scss';

export default function SignUpForm() {
  const {
    register,
    handleSubmit,
    watch,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    mode: 'onChange',
  });

  const navigate = useNavigate();

  // 상태 관리
  const [emailVerified, setEmailVerified] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [codeVerified, setCodeVerified] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isLoading, setIsLoading] = useState({
    email: false,
    phone: false,
    verify: false,
    submit: false,
  });

  // 이전 이메일 값 추적을 위한 ref
  const prevEmailRef = useRef<string>('');

  // 폼 데이터 감시
  const email = watch('email');
  const username = watch('username');
  const phone = watch('phoneNumber');
  const phoneCode = watch('phoneCode');

  // 이메일이 변경되면 중복확인 상태 초기화
  useEffect(() => {
    if (prevEmailRef.current && prevEmailRef.current !== email && emailVerified) {
      setEmailVerified(false);
    }
    prevEmailRef.current = email;
  }, [email, emailVerified]);

  // 타이머 로직
  const startTimer = () => {
    setTimer(59);
    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // 이메일 중복 확인
  const handleCheckEmail = async () => {
    if (!email) {
      return;
    }

    setIsLoading(prev => ({ ...prev, email: true }));
    clearErrors('email');

    try {
      const result = await checkEmail(email.trim());
      if (result.isAvailable) {
        setEmailVerified(true);
      }
    } catch (apiError) {
      setError('email', {
        type: 'manual',
        message: getErrorMessage(apiError),
      });
    } finally {
      setIsLoading(prev => ({ ...prev, email: false }));
    }
  };

  // 인증번호 발송
  const handleSendPhoneCode = async () => {
    if (!phone || !username) {
      return;
    }

    setIsLoading(prev => ({ ...prev, phone: true }));
    clearErrors('phoneNumber');

    try {
      const cleanPhoneNumber = phone.replace(/-/g, '');
      const result = await sendPhoneCode(cleanPhoneNumber, username.trim());

      if (result.expiresIn) {
        setCodeSent(true);
        startTimer();
      }
    } catch (apiError) {
      setError('phoneNumber', {
        type: 'manual',
        message: getErrorMessage(apiError),
      });
    } finally {
      setIsLoading(prev => ({ ...prev, phone: false }));
    }
  };

  // 인증번호 확인
  const handleVerifyPhoneCode = async () => {
    if (!phoneCode || !phone) {
      return;
    }

    setIsLoading(prev => ({ ...prev, verify: true }));
    clearErrors('phoneCode');

    try {
      const cleanPhoneNumber = phone.replace(/-/g, '');
      const result = await verifyPhoneCode(cleanPhoneNumber, phoneCode.trim());

      if (result.verified) {
        setCodeVerified(true);
      } else {
        setError('phoneCode', {
          type: 'manual',
          message: '인증번호가 일치하지 않습니다.',
        });
      }
    } catch (apiError) {
      setError('phoneCode', {
        type: 'manual',
        message: getErrorMessage(apiError),
      });
    } finally {
      setIsLoading(prev => ({ ...prev, verify: false }));
    }
  };

  // 폼 제출
  const onSubmit = async (data: SignUpFormValues) => {
    if (!emailVerified) {
      setError('email', {
        type: 'manual',
        message: '이메일 중복 확인을 완료해주세요.',
      });
      return;
    }

    if (!codeVerified) {
      setError('phoneCode', {
        type: 'manual',
        message: '휴대폰 인증을 완료해주세요.',
      });
      return;
    }

    setIsLoading(prev => ({ ...prev, submit: true }));
    clearErrors('root');

    try {
      const signUpData = {
        ...data,
        phoneNumber: data.phoneNumber.replace(/-/g, ''), // 하이픈 제거
      };

      const result = await signUp(signUpData);

      if (result.id) {
        // 회원가입 성공 플래그를 sessionStorage에 저장
        sessionStorage.setItem('signUpSuccess', 'true');

        // 회원가입 성공 시 회원가입 완료 페이지로 이동
        navigate('/auth/signupcomplete', { replace: true });
      } else {
        setError('root', {
          type: 'manual',
          message: '회원가입 처리 중 오류가 발생했습니다.',
        });
      }
    } catch (apiError) {
      setError('root', {
        type: 'manual',
        message: getErrorMessage(apiError),
      });
    } finally {
      setIsLoading(prev => ({ ...prev, submit: false }));
    }
  };

  const isSubmitting = isLoading.submit;
  const hasErrors = Object.keys(errors).some(
    key => key !== 'root' && errors[key as keyof typeof errors]
  );
  const isButtonDisabled = isSubmitting || !emailVerified || !codeVerified || hasErrors;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      {errors.root && <div className={styles.errorMessage}>{errors.root.message}</div>}

      <FormField label="이메일" htmlFor="email" required error={errors.email?.message}>
        <div className={styles.fieldWithButton}>
          <Input
            id="email"
            {...register('email')}
            placeholder="user@goorm.com"
            disabled={emailVerified}
          />
          <Button
            type="button"
            onClick={handleCheckEmail}
            disabled={
              !email ||
              emailVerified ||
              isLoading.email ||
              (!!errors.email && errors.email.type !== 'manual')
            }
            variant={emailVerified ? 'ghost' : 'secondary'}
            radius="xsm"
            height="45px"
          >
            {isLoading.email ? '확인 중...' : emailVerified ? '중복 확인 완료' : '중복 확인'}
          </Button>
        </div>
      </FormField>

      <FormField label="이름" htmlFor="username" required error={errors.username?.message}>
        <Input id="username" {...register('username')} placeholder="구름" />
      </FormField>

      <FormField label="비밀번호" htmlFor="password" required error={errors.password?.message}>
        <PasswordInput id="password" {...register('password')} placeholder="********" />
      </FormField>

      <FormField
        label="비밀번호 확인"
        htmlFor="passwordCheck"
        required
        error={errors.passwordCheck?.message}
      >
        <PasswordInput id="passwordCheck" {...register('passwordCheck')} placeholder="********" />
      </FormField>

      <FormField
        label="휴대폰 번호"
        htmlFor="phoneNumber"
        required
        error={errors.phoneNumber?.message}
      >
        <div className={styles.fieldWithButton}>
          <Input id="phoneNumber" {...register('phoneNumber')} placeholder="01012345678" />
          <Button
            type="button"
            onClick={handleSendPhoneCode}
            disabled={
              !phone ||
              !username ||
              timer > 0 ||
              isLoading.phone ||
              (!!errors.phoneNumber && errors.phoneNumber.type !== 'manual') ||
              (!!errors.username && errors.username.type !== 'manual')
            }
            variant={codeSent ? 'ghost' : 'secondary'}
            radius="xsm"
            height="45px"
          >
            {isLoading.phone ? '발송 중...' : timer > 0 ? `0:${timer}` : '인증번호 발송'}
          </Button>
        </div>
      </FormField>

      <FormField label="인증번호" htmlFor="phoneCode" required error={errors.phoneCode?.message}>
        <div className={styles.fieldWithButton}>
          <Input id="phoneCode" {...register('phoneCode')} placeholder="123456" />
          <Button
            type="button"
            onClick={handleVerifyPhoneCode}
            disabled={
              !phoneCode ||
              codeVerified ||
              isLoading.verify ||
              (!!errors.phoneCode && errors.phoneCode.type !== 'manual')
            }
            variant={codeVerified ? 'ghost' : 'secondary'}
            radius="xsm"
            height="45px"
          >
            {isLoading.verify ? '확인 중...' : codeVerified ? '인증 완료' : '인증하기'}
          </Button>
        </div>
      </FormField>

      <Button
        type="submit"
        className={styles.submitBtn}
        disabled={isButtonDisabled}
        variant={emailVerified && codeVerified ? 'secondary' : 'ghost'}
        radius="xsm"
        height="45px"
      >
        {isSubmitting ? '회원가입 중...' : '회원가입'}
      </Button>
    </form>
  );
}
