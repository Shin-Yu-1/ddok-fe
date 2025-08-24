import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import Button from '@/components/Button/Button';
import FormField from '@/features/Auth/components/FormField/FormField';
import Input from '@/features/Auth/components/Input/Input';
import {
  useFindPassword,
  useSendPhoneCodeForFindPassword,
  useVerifyPhoneCodeForFindPassword,
} from '@/hooks/auth/useFindPassword';
import { findPasswordSchema, type FindPasswordFormValues } from '@/schemas/auth.schema';
import type {
  FindPasswordURL,
  PhoneSendCodeURL,
  PhoneVerifyCodeURL,
} from '@/types/apiEndpoints.types';

import styles from './FindPasswordForm.module.scss';

// URL들 정의
const findPasswordURL: FindPasswordURL = '/api/auth/password/verify-user';
const phoneSendCodeURL: PhoneSendCodeURL = '/api/auth/phone/send-code';
const phoneVerifyCodeURL: PhoneVerifyCodeURL = '/api/auth/phone/verify-code';

export default function FindPasswordForm() {
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

  // 폼 데이터 감시
  const username = watch('username');
  const phone = watch('phoneNumber');
  const phoneCode = watch('phoneCode');

  // URL을 파라미터로 전달하는 훅들 사용
  const findPasswordMutation = useFindPassword(findPasswordURL);

  const sendPhoneCodeMutation = useSendPhoneCodeForFindPassword(phoneSendCodeURL, {
    onSuccess: () => {
      setCodeSent(true);
      startTimer();
    },
    onError: error => {
      console.error('인증번호 발송 실패:', error);
    },
  });

  const verifyPhoneCodeMutation = useVerifyPhoneCodeForFindPassword(phoneVerifyCodeURL, {
    onSuccess: data => {
      if (data.data.verified) {
        setCodeVerified(true);
      }
    },
    onError: () => {
      console.error('인증번호 확인에 실패했습니다.');
    },
  });

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
  const handleSendPhoneCode = () => {
    if (!phone || !username) {
      return;
    }

    const cleanPhoneNumber = phone.replace(/-/g, '');
    const requestData = {
      phoneNumber: cleanPhoneNumber,
      username: username.trim(),
    };

    console.log('비밀번호 찾기 - 인증번호 발송 요청 데이터:', requestData);
    sendPhoneCodeMutation.mutate(requestData);
  };

  // 인증번호 확인
  const handleVerifyPhoneCode = () => {
    if (!phoneCode || !phone) {
      return;
    }

    const cleanPhoneNumber = phone.replace(/-/g, '');
    const requestData = {
      phoneNumber: cleanPhoneNumber,
      phoneCode: phoneCode.trim(),
    };

    console.log('비밀번호 찾기 - 인증번호 확인 요청 데이터:', requestData);
    verifyPhoneCodeMutation.mutate(requestData);
  };

  // 폼 제출 - 사용자 검증 API 호출
  const onSubmit = (data: FindPasswordFormValues) => {
    if (!codeVerified) {
      return;
    }

    const verifyUserData = {
      username: data.username,
      email: data.email,
      phoneNumber: data.phoneNumber.replace(/-/g, ''), // 하이픈 제거
      phoneCode: data.phoneCode,
    };

    console.log('사용자 검증 요청 데이터:', verifyUserData);
    findPasswordMutation.mutate(verifyUserData);
  };

  const isSubmitting = findPasswordMutation.isPending;
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
            disabled={!phone || !username || timer > 0 || sendPhoneCodeMutation.isPending}
            variant={codeSent ? 'ghost' : 'secondary'}
            radius="xsm"
            height="45px"
          >
            {sendPhoneCodeMutation.isPending
              ? '발송 중...'
              : timer > 0
                ? `0:${timer}`
                : '인증번호 발송'}
          </Button>
        </div>
      </FormField>

      <FormField label="인증번호" htmlFor="phoneCode" required error={errors.phoneCode?.message}>
        <div className={styles.fieldWithButton}>
          <Input id="phoneCode" {...register('phoneCode')} placeholder="123456" />
          <Button
            type="button"
            onClick={handleVerifyPhoneCode}
            disabled={!phoneCode || codeVerified || verifyPhoneCodeMutation.isPending}
            variant={codeVerified ? 'ghost' : 'secondary'}
            radius="xsm"
            height="45px"
          >
            {verifyPhoneCodeMutation.isPending
              ? '확인 중...'
              : codeVerified
                ? '인증 완료'
                : '인증하기'}
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
