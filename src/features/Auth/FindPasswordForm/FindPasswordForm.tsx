import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { sendPhoneCode, verifyPhoneCode, findPassword, getErrorMessage } from '@/api/auth';
import Button from '@/components/Button/Button';
import FormField from '@/features/Auth/components/FormField/FormField';
import Input from '@/features/Auth/components/Input/Input';
import { findPasswordSchema, type FindPasswordFormValues } from '@/schemas/auth.schema';

import styles from './FindPasswordForm.module.scss';

export default function FindPasswordForm() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FindPasswordFormValues>({
    resolver: zodResolver(findPasswordSchema),
    mode: 'onChange',
  });

  // 상태 관리
  const [codeSent, setCodeSent] = useState(false);
  const [codeVerified, setCodeVerified] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isLoading, setIsLoading] = useState({
    phone: false,
    verify: false,
    submit: false,
  });

  // 폼 데이터 감시
  const username = watch('username');
  const email = watch('email');
  const phone = watch('phoneNumber');
  const phoneCode = watch('phoneCode');

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

  // 인증번호 발송
  const handleSendPhoneCode = async () => {
    if (!phone || !username || !email) {
      return;
    }

    setIsLoading(prev => ({ ...prev, phone: true }));

    try {
      await sendPhoneCode(phone, username, 'FIND_PASSWORD');
      setCodeSent(true);
      startTimer();
    } catch (error) {
      console.error('인증번호 발송 실패:', getErrorMessage(error));
      // 에러 처리 로직 추가
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

    try {
      const result = await verifyPhoneCode(phone, phoneCode);

      if (result.verified) {
        setCodeVerified(true);
      } else {
        console.error('인증번호가 올바르지 않습니다.');
        // 에러 처리 로직 추가
      }
    } catch (error) {
      console.error('인증번호 확인 실패:', getErrorMessage(error));
      // 에러 처리 로직 추가
    } finally {
      setIsLoading(prev => ({ ...prev, verify: false }));
    }
  };

  // 폼 제출 - 비밀번호 찾기 API 호출
  const onSubmit = async (data: FindPasswordFormValues) => {
    if (!codeVerified) {
      return;
    }

    setIsLoading(prev => ({ ...prev, submit: true }));

    try {
      const result = await findPassword({
        username: data.username,
        email: data.email,
        phoneNumber: data.phoneNumber,
        phoneCode: data.phoneCode,
      });

      // reauthToken을 localStorage에 저장
      localStorage.setItem('reauthToken', result.reauthToken);

      // 비밀번호 찾기 성공 플래그를 sessionStorage에 저장
      sessionStorage.setItem('findPasswordSuccess', 'true');

      // ResetPasswordPage로 이동
      navigate('/auth/resetpassword');
    } catch (error) {
      console.error('비밀번호 찾기 실패:', getErrorMessage(error));
      // 에러 처리 로직 추가
    } finally {
      setIsLoading(prev => ({ ...prev, submit: false }));
    }
  };

  const isSubmitting = isLoading.submit;
  const isButtonDisabled = isSubmitting || !codeVerified;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <FormField label="이름" htmlFor="username" required error={errors.username?.message}>
        <Input id="username" {...register('username')} placeholder="구름" />
      </FormField>

      <FormField label="이메일" htmlFor="email" required error={errors.email?.message}>
        <Input id="email" {...register('email')} placeholder="user@goorm.com" />
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
            disabled={!phone || !username || !email || timer > 0 || isLoading.phone}
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
            disabled={!phoneCode || codeVerified || isLoading.verify}
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
        variant={codeVerified ? 'secondary' : 'ghost'}
        radius="xsm"
        height="45px"
      >
        {isSubmitting ? '확인 중...' : '비밀번호 찾기'}
      </Button>
    </form>
  );
}
