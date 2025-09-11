import { useState, useEffect } from 'react';

import Button from '@/components/Button/Button';
import Input from '@/components/Input/Input';
import BaseModal from '@/components/Modal/BaseModal';

import { useNicknameValidator } from '../../../hooks/useNicknameValidator';

import styles from './EditNicknameModal.module.scss';

interface EditNicknameModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentNickname: string;
  onSave: (nickname: string) => void | Promise<void>;
  isLoading?: boolean;
}

const EditNicknameModal = ({
  isOpen,
  onClose,
  currentNickname,
  onSave,
  isLoading = false,
}: EditNicknameModalProps) => {
  const [tempNickname, setTempNickname] = useState('');
  const { isValid, errorMessage } = useNicknameValidator(tempNickname);

  // 모달이 열릴 때 현재 닉네임으로 초기화
  useEffect(() => {
    if (isOpen) {
      setTempNickname(currentNickname);
    }
  }, [isOpen, currentNickname]);

  const isChanged = tempNickname.trim() !== currentNickname;
  const canSave = isValid && isChanged && !isLoading;

  const handleSave = async () => {
    if (!canSave) return;

    try {
      await onSave(tempNickname.trim());
      onClose();
    } catch (error) {
      console.error('닉네임 저장 실패:', error);
    }
  };

  const handleCancel = () => {
    if (isChanged && !isLoading) {
      const confirmed = window.confirm('변경사항이 저장되지 않습니다. 정말 취소하시겠습니까?');
      if (!confirmed) return;
    }
    setTempNickname(currentNickname);
    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleCancel}
      title="닉네임을 변경해주세요"
      subtitle="2~12자, 한/영/숫자/밑줄(_)만 사용 가능하며, 단어 사이 공백은 1칸만 허용됩니다."
      disableBackdropClose={isChanged}
      disableEscapeClose={isChanged}
    >
      <div className={styles.modalContent}>
        <Input
          type="text"
          value={tempNickname}
          onChange={e => setTempNickname(e.target.value)}
          placeholder="닉네임을 입력해주세요"
          width="100%"
          height="40px"
          border={isValid ? '1px solid var(--gray-3)' : '1px solid var(--red-1)'}
          focusBorder={isValid ? '1px solid var(--yellow-1)' : '1px solid var(--red-1)'}
          maxLength={12}
          disabled={isLoading}
        />

        {!isValid && tempNickname && <p className={styles.errorMessage}>{errorMessage}</p>}

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
            disabled={!canSave}
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

export default EditNicknameModal;
