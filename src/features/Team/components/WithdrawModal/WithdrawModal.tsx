import { useState } from 'react';

import { X } from '@phosphor-icons/react';

import Button from '@/components/Button/Button';
import Input from '@/components/Input/Input';

import styles from './WithdrawModal.module.scss';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (confirmText: string) => void;
  isLoading?: boolean;
}

const WithdrawModal = ({ isOpen, onClose, onConfirm, isLoading = false }: WithdrawModalProps) => {
  const [confirmText, setConfirmText] = useState('');

  const handleSubmit = () => {
    if (confirmText === '하차합니다.') {
      onConfirm(confirmText);
    }
  };

  const handleClose = () => {
    setConfirmText('');
    onClose();
  };

  const isConfirmEnabled = confirmText === '하차합니다.';

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && handleClose()}>
      <div className={styles.modal}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <h2 className={styles.title}>정말로 하차하시겠습니까?</h2>
            <Button
              backgroundColor="transparent"
              width={24}
              height={24}
              padding="0px"
              onClick={handleClose}
              style={{ flexShrink: 0 }}
            >
              <X size={24} weight="light" color="var(--black-1)" />
            </Button>
          </div>
          <p className={styles.subtitle}>중도 하차할 경우, 탈주자 뱃지를 부여 받습니다.</p>
        </div>

        {/* Content */}
        <div className={styles.content}>
          <p className={styles.inputLabel}>'하차합니다.'를 입력해주세요</p>
          <Input
            value={confirmText}
            onChange={e => setConfirmText(e.target.value)}
            placeholder="하차합니다."
            width="540px"
            height={37}
            radius={10}
            border="1px solid var(--gray-3)"
            focusBorder="1px solid var(--gray-3)"
            padding="0 18px"
            textColor={confirmText ? 'var(--black-1)' : 'var(--gray-4)'}
          />
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <Button
            backgroundColor={isConfirmEnabled ? 'var(--red-1)' : 'var(--gray-3)'}
            textColor="var(--white-3)"
            width={540}
            height={45}
            radius="xsm"
            fontSize="var(--fs-small)"
            fontWeight="500"
            onClick={handleSubmit}
            disabled={!isConfirmEnabled || isLoading}
            isLoading={isLoading}
          >
            하차하기
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WithdrawModal;
