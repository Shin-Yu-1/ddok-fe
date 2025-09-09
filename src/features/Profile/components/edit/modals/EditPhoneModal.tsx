import { useState, useEffect } from 'react';

import Button from '@/components/Button/Button';
import Input from '@/components/Input/Input';
import BaseModal from '@/components/Modal/BaseModal';

import styles from './EditPhoneModal.module.scss';

interface EditPhoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (phoneNumber: string) => void | Promise<void>;
  isLoading?: boolean;
}

const EditPhoneModal = ({ isOpen, onClose, onSave, isLoading = false }: EditPhoneModalProps) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  // 모달이 열릴 때 초기화
  useEffect(() => {
    if (isOpen) {
      setPhoneNumber('');
      setVerificationCode('');
      setIsCodeSent(false);
      setIsVerified(false);
    }
  }, [isOpen]);

  // 전화번호 형식 검증
  const validatePhoneNumber = (phone: string): boolean => {
    const phoneRegex = /^010\d{8}$/;
    return phoneRegex.test(phone.replace(/-/g, ''));
  };

  // 전화번호 포맷팅 (010-1234-5678)
  const formatPhoneNumber = (value: string): string => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
  };

  const handleSendCode = async () => {
    if (!validatePhoneNumber(phoneNumber)) return;

    try {
      // TODO: 인증번호 발송 API 호출
      console.log('인증번호 발송:', phoneNumber);
      setIsCodeSent(true);
    } catch (error) {
      console.error('인증번호 발송 실패:', error);
    }
  };

  const handleVerifyCode = async () => {
    if (verificationCode.length !== 6) return;

    try {
      // TODO: 인증번호 확인 API 호출
      console.log('인증번호 확인:', verificationCode);
      setIsVerified(true);
    } catch (error) {
      console.error('인증번호 확인 실패:', error);
    }
  };

  const handleSave = async () => {
    if (!isVerified) return;

    try {
      await onSave(phoneNumber);
      onClose();
    } catch (error) {
      console.error('전화번호 저장 실패:', error);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  const isPhoneValid = validatePhoneNumber(phoneNumber);
  const canSendCode = isPhoneValid && !isCodeSent;
  const canVerifyCode = isCodeSent && verificationCode.length === 6 && !isVerified;
  const canSave = isVerified && !isLoading;

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleCancel}
      title="전화번호를 변경해주세요"
      subtitle="새로운 전화번호를 입력하고 인증을 완료해주세요."
    >
      <div className={styles.modalContent}>
        {/* 전화번호 입력 */}
        <div className={styles.inputGroup}>
          <label className={styles.inputLabel}>새 전화번호</label>
          <div className={styles.inputRow}>
            <Input
              type="tel"
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
              placeholder="010-1234-5678"
              width="100%"
              height="45px"
              border={
                isPhoneValid || !phoneNumber ? '1px solid var(--gray-3)' : '1px solid var(--red-1)'
              }
              focusBorder={
                isPhoneValid || !phoneNumber
                  ? '1px solid var(--yellow-1)'
                  : '1px solid var(--red-1)'
              }
              maxLength={13}
              disabled={isCodeSent || isLoading}
            />
            <Button
              variant="outline"
              onClick={handleSendCode}
              disabled={!canSendCode || isLoading}
              height="45px"
              padding="0 16px"
              className={styles.codeButton}
            >
              {isCodeSent ? '발송완료' : '인증번호 발송'}
            </Button>
          </div>
          {phoneNumber && !isPhoneValid && (
            <p className={styles.errorMessage}>올바른 전화번호 형식을 입력해주세요.</p>
          )}
        </div>

        {/* 인증번호 입력 */}
        {isCodeSent && (
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>인증번호</label>
            <div className={styles.inputRow}>
              <Input
                type="text"
                value={verificationCode}
                onChange={e => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                placeholder="6자리 인증번호"
                width="100%"
                height="45px"
                border="1px solid var(--gray-3)"
                focusBorder="1px solid var(--yellow-1)"
                maxLength={6}
                disabled={isVerified || isLoading}
              />
              <Button
                variant="outline"
                onClick={handleVerifyCode}
                disabled={!canVerifyCode || isLoading}
                height="45px"
                padding="0 16px"
                className={styles.codeButton}
              >
                {isVerified ? '인증완료' : '인증확인'}
              </Button>
            </div>
          </div>
        )}

        <div className={styles.modalButtons}>
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isLoading}
            width="48%"
            height="45px"
          >
            취소
          </Button>
          <Button
            variant="secondary"
            onClick={handleSave}
            disabled={!canSave}
            isLoading={isLoading}
            width="48%"
            height="45px"
          >
            저장
          </Button>
        </div>
      </div>
    </BaseModal>
  );
};

export default EditPhoneModal;
