import { useState } from 'react';

import Button from '@/components/Button/Button';
import BaseModal from '@/components/Modal/BaseModal';
import PasswordInput from '@/features/Auth/components/Input/PasswordInput';

import styles from './PasswordConfirmModal.module.scss';

interface PasswordConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (password: string) => void | Promise<void>;
  isLoading?: boolean;
  title?: string;
  subtitle?: string;
}

const PasswordConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  title = '비밀번호를 입력해주세요',
  subtitle = '개인정보 보호를 위해 현재 비밀번호를 다시 한번 입력해주세요.',
}: PasswordConfirmModalProps) => {
  const [password, setPassword] = useState('');

  const handleConfirm = async () => {
    if (!password.trim() || isLoading) return;

    try {
      await onConfirm(password);
      setPassword('');
      onClose();
    } catch (error) {
      console.error('비밀번호 확인 실패:', error);
    }
  };

  const handleCancel = () => {
    setPassword('');
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && password.trim() && !isLoading) {
      handleConfirm();
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={handleCancel} title={title} subtitle={subtitle}>
      <div className={styles.modalContent}>
        <div className={styles.inputWrapper}>
          <PasswordInput
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="현재 비밀번호를 입력해주세요"
            disabled={isLoading}
            autoFocus
          />
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
            onClick={handleConfirm}
            disabled={!password.trim() || isLoading}
            isLoading={isLoading}
            width="48%"
            height="40px"
            radius="xsm"
          >
            확인
          </Button>
        </div>
      </div>
    </BaseModal>
  );
};

export default PasswordConfirmModal;
