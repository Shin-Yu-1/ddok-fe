import { useState, useEffect } from 'react';

import Button from '@/components/Button/Button';
import Input from '@/components/Input/Input';
import BaseModal from '@/components/Modal/BaseModal';
import { changePasswordSchema } from '@/schemas/auth.schema';

import styles from './EditPasswordModal.module.scss';

interface EditPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newPassword: string) => void | Promise<void>;
  isLoading?: boolean;
}

const EditPasswordModal = ({
  isOpen,
  onClose,
  onSave,
  isLoading = false,
}: EditPasswordModalProps) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{
    newPassword?: string;
    passwordCheck?: string;
  }>({});

  // 모달이 열릴 때 초기화
  useEffect(() => {
    if (isOpen) {
      setNewPassword('');
      setConfirmPassword('');
      setErrors({});
    }
  }, [isOpen]);

  // Zod 스키마로 유효성 검사
  const validateForm = (newPass: string, confirmPass: string) => {
    try {
      changePasswordSchema.parse({
        newPassword: newPass,
        passwordCheck: confirmPass,
      });
      setErrors({});
      return true;
    } catch (error) {
      if (error && typeof error === 'object' && 'issues' in error) {
        const zodError = error as { issues: Array<{ path: string[]; message: string }> };
        const newErrors: { newPassword?: string; passwordCheck?: string } = {};

        zodError.issues.forEach(issue => {
          const field = issue.path[0] as 'newPassword' | 'passwordCheck';
          if (field === 'newPassword' || field === 'passwordCheck') {
            newErrors[field] = issue.message;
          }
        });

        setErrors(newErrors);
      }
      return false;
    }
  };

  // 새 비밀번호 변경 핸들러
  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewPassword(value);

    // 실시간 검증
    if (value || confirmPassword) {
      validateForm(value, confirmPassword);
    }
  };

  // 비밀번호 확인 변경 핸들러
  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setConfirmPassword(value);

    // 실시간 검증
    if (newPassword || value) {
      validateForm(newPassword, value);
    }
  };

  const handleSave = async () => {
    // 최종 유효성 검사
    if (!validateForm(newPassword, confirmPassword)) {
      return;
    }

    try {
      await onSave(newPassword);
      onClose();
    } catch (error) {
      console.error('비밀번호 변경 실패:', error);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  const isFormValid =
    newPassword && confirmPassword && !errors.newPassword && !errors.passwordCheck;

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleCancel}
      title="새 비밀번호를 입력해주세요"
      subtitle="새로운 비밀번호를 입력해주세요. (8자 이상, 대소문자/숫자/특수문자 포함)"
    >
      <div className={styles.modalContent}>
        {/* 새 비밀번호 */}
        <div className={styles.inputGroup}>
          <label className={styles.inputLabel}>새 비밀번호</label>
          <Input
            type="password"
            value={newPassword}
            onChange={handleNewPasswordChange}
            placeholder="새 비밀번호를 입력해주세요"
            width="100%"
            height="40px"
            border={errors.newPassword ? '1px solid var(--red-1)' : '1px solid var(--gray-3)'}
            focusBorder={
              errors.newPassword ? '1px solid var(--red-1)' : '1px solid var(--yellow-1)'
            }
            disabled={isLoading}
          />
          {errors.newPassword && <p className={styles.errorMessage}>{errors.newPassword}</p>}
        </div>

        {/* 비밀번호 확인 */}
        <div className={styles.inputGroup}>
          <label className={styles.inputLabel}>비밀번호 확인</label>
          <Input
            type="password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            placeholder="비밀번호를 다시 입력해주세요"
            width="100%"
            height="40px"
            border={errors.passwordCheck ? '1px solid var(--red-1)' : '1px solid var(--gray-3)'}
            focusBorder={
              errors.passwordCheck ? '1px solid var(--red-1)' : '1px solid var(--yellow-1)'
            }
            disabled={isLoading}
          />
          {errors.passwordCheck && <p className={styles.errorMessage}>{errors.passwordCheck}</p>}
        </div>

        <div className={styles.modalButtons}>
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isLoading}
            width="48%"
            height="40px"
            radius="xsm"
          >
            취소
          </Button>
          <Button
            variant="secondary"
            onClick={handleSave}
            disabled={!isFormValid || isLoading}
            isLoading={isLoading}
            width="48%"
            height="40px"
            radius="xsm"
          >
            저장
          </Button>
        </div>
      </div>
    </BaseModal>
  );
};

export default EditPasswordModal;
