import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { sendPhoneCode, verifyPhoneCode, findEmail, getErrorMessage } from '@/api/auth';
import Button from '@/components/Button/Button';
import FormField from '@/features/Auth/components/FormField/FormField';
import Input from '@/features/Auth/components/Input/Input';
import { findIdSchema } from '@/schemas/auth.schema';
import type { FindIdFormValues } from '@/schemas/auth.schema';

import styles from './FindIdForm.module.scss';

export default function FindIdForm() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FindIdFormValues>({
    resolver: zodResolver(findIdSchema),
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
  const [apiErrors, setApiErrors] = useState({
    phone: '',
    verify: '',
    submit: '',
  });

  // 폼 데이터 감시
  const username = watch('username');
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
    if (!phone || !username) {
      return;
    }

    setIsLoading(prev => ({ ...prev, phone: true }));
    setApiErrors(prev => ({ ...prev, phone: '' })); // 이전 에러 초기화

    try {
      const cleanPhoneNumber = phone.replace(/-/g, '');
      await sendPhoneCode(cleanPhoneNumber, username.trim(), 'FIND_ID');

      setCodeSent(true);
      startTimer();
    } catch (error) {
      console.error('인증번호 발송 실패:', getErrorMessage(error));
      setApiErrors(prev => ({ ...prev, phone: getErrorMessage(error) }));
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
    setApiErrors(prev => ({ ...prev, verify: '' })); // 이전 에러 초기화

    try {
      const cleanPhoneNumber = phone.replace(/-/g, '');
      const result = await verifyPhoneCode(cleanPhoneNumber, phoneCode.trim());

      if (result.verified) {
        setCodeVerified(true);
      } else {
        setApiErrors(prev => ({ ...prev, verify: '인증번호가 올바르지 않습니다.' }));
      }
    } catch (error) {
      console.error('인증번호 확인 실패:', getErrorMessage(error));
      setApiErrors(prev => ({ ...prev, verify: getErrorMessage(error) }));
    } finally {
      setIsLoading(prev => ({ ...prev, verify: false }));
    }
  };

  // 폼 제출
  const onSubmit = async (data: FindIdFormValues) => {
    if (!codeVerified) {
      return;
    }

    setIsLoading(prev => ({ ...prev, submit: true }));
    setApiErrors(prev => ({ ...prev, submit: '' })); // 이전 에러 초기화

    try {
      const findEmailData = {
        username: data.username,
        phoneNumber: data.phoneNumber.replace(/-/g, ''), // 하이픈 제거
        phoneCode: data.phoneCode,
      };

      const result = await findEmail(findEmailData);

      if (result.email) {
        // 아이디 찾기 성공 플래그를 sessionStorage에 저장
        sessionStorage.setItem('findIdSuccess', 'true');
        sessionStorage.setItem('findIdEmail', result.email);

        // 찾은 이메일과 함께 완료 페이지로 이동
        navigate(`/auth/findidcomplete?email=${encodeURIComponent(result.email)}`);
      }
    } catch (error) {
      console.error('이메일 찾기 실패:', getErrorMessage(error));
      setApiErrors(prev => ({ ...prev, submit: getErrorMessage(error) }));
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

      <FormField
        label="휴대폰 번호"
        htmlFor="phoneNumber"
        required
        error={errors.phoneNumber?.message || apiErrors.phone}
      >
        <div className={styles.fieldWithButton}>
          <Input id="phoneNumber" {...register('phoneNumber')} placeholder="01012345678" />
          <Button
            type="button"
            onClick={handleSendPhoneCode}
            disabled={!phone || !username || timer > 0 || isLoading.phone}
            variant={codeSent ? 'ghost' : 'secondary'}
            radius="xsm"
            height="45px"
          >
            {isLoading.phone ? '발송 중...' : timer > 0 ? `0:${timer}` : '인증번호 발송'}
          </Button>
        </div>
      </FormField>

      <FormField
        label="인증번호"
        htmlFor="phoneCode"
        required
        error={errors.phoneCode?.message || apiErrors.verify}
      >
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
        {isSubmitting ? '아이디 찾는 중...' : '아이디 찾기'}
      </Button>

      {apiErrors.submit && <div className={styles.errorMessage}>{apiErrors.submit}</div>}
    </form>
  );
}
