import { useState, useEffect } from 'react';

import Button from '@/components/Button/Button';
import BaseModal from '@/components/Modal/BaseModal';
import type { CompleteProfileInfo } from '@/types/user';

import { useProfileMutations } from '../../hooks/useProfileMutations';

import styles from './EditIntroductionModal.module.scss';

interface EditIntroductionModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: CompleteProfileInfo;
}

const EditIntroductionModal = ({ isOpen, onClose, user }: EditIntroductionModalProps) => {
  const [content, setContent] = useState('');
  const [hasChanges, setHasChanges] = useState(false);

  const { updateContent, isUpdating } = useProfileMutations({
    userId: user.userId,
    onSuccess: () => {
      onClose();
      setTimeout(() => {
        window.location.reload();
      }, 300);
    },
    onError: error => {
      console.error('자기소개 수정 실패:', error);
      // TODO: 토스트 알림 등 에러 처리
    },
  });

  // 모달이 열릴 때 기존 데이터로 초기화
  useEffect(() => {
    if (isOpen) {
      const initialContent = user.introduction || '';
      setContent(initialContent);
      setHasChanges(false);
    }
  }, [isOpen, user.introduction]);

  // 내용 변경 감지
  useEffect(() => {
    const initialContent = user.introduction || '';
    setHasChanges(content !== initialContent);
  }, [content, user.introduction]);

  const handleSubmit = async () => {
    if (!hasChanges || isUpdating) return;

    try {
      await updateContent.mutateAsync(content);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      const confirmed = window.confirm('변경사항이 저장되지 않습니다. 정말 취소하시겠습니까?');
      if (!confirmed) return;
    }
    onClose();
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleCancel}
      title="자기 소개를 입력해주세요"
      subtitle="자신에 대해 간략하게 소개 해주세요! (최대 130자)"
      footer={null}
      disableBackdropClose={hasChanges}
      disableEscapeClose={hasChanges}
    >
      <div className={styles.content}>
        <div className={styles.textareaWrapper}>
          <textarea
            value={content}
            onChange={handleTextareaChange}
            placeholder="예) 저는 2년차 프론트엔드 개발자고, 많은 걸 배워가고 싶습니다!"
            className={styles.textarea}
            maxLength={130}
            disabled={isUpdating}
          />
          <div className={styles.charCount}>{content.length}/130</div>
        </div>

        {/* 내부에 버튼 추가 */}
        <div className={styles.buttonContainer}>
          <Button
            variant={hasChanges ? 'secondary' : 'ghost'}
            onClick={handleSubmit}
            disabled={!hasChanges || isUpdating}
            isLoading={isUpdating}
            fullWidth={true}
            height={48}
          >
            {isUpdating ? '저장 중...' : '저장'}
          </Button>
        </div>
      </div>
    </BaseModal>
  );
};

export default EditIntroductionModal;
