import { useState, useEffect } from 'react';

import Button from '@/components/Button/Button';
import BaseModal from '@/components/Modal/BaseModal';
import TechStackSelector from '@/features/Auth/components/TechStackSelector/TechStackSelector';
import { DDtoast } from '@/features/toast';
import type { CompleteProfileInfo } from '@/types/user';

import { useProfileMutations } from '../../hooks/useProfileMutations';

import styles from './EditTechStackModal.module.scss';

interface EditTechStackModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: CompleteProfileInfo;
}

const EditTechStackModal = ({ isOpen, onClose, user }: EditTechStackModalProps) => {
  const [selectedTechStack, setSelectedTechStack] = useState<string[]>([]);
  const [hasChanges, setHasChanges] = useState(false);

  const { updateStacks, isUpdating } = useProfileMutations({
    userId: user.userId,
    onSuccess: () => {
      console.log('기술 스택 수정 성공! 모달 닫기 및 새로고침');
      DDtoast({
        mode: 'custom',
        type: 'success',
        userMessage: '기술 스택 수정에 성공했습니다.',
      });
      onClose();

      setTimeout(() => {
        window.location.reload();
      }, 300);
    },
    onError: error => {
      console.error('기술 스택 수정 실패:', error);
      DDtoast({
        mode: 'custom',
        type: 'error',
        userMessage: '기술 스택 수정에 실패했습니다. 다시 시도해주세요.',
      });
    },
  });

  // 모달이 열릴 때 기존 데이터로 초기화
  useEffect(() => {
    if (isOpen) {
      // API 응답 구조에 따라 기술 스택 이름 배열을 직접 사용
      const initialStacks = user.techStacks?.map(stack => stack.name) || [];
      console.log('기존 기술 스택:', initialStacks);
      setSelectedTechStack([...initialStacks]);
      setHasChanges(false);
    }
  }, [isOpen, user.techStacks]);

  // 변경사항 감지
  useEffect(() => {
    const initialStacks = user.techStacks?.map(stack => stack.name) || [];

    // 배열 비교 (순서 무관)
    const hasChanged =
      selectedTechStack.length !== initialStacks.length ||
      selectedTechStack.some(stack => !initialStacks.includes(stack)) ||
      initialStacks.some(stack => !selectedTechStack.includes(stack));

    console.log('변경사항 감지:', {
      current: selectedTechStack,
      initial: initialStacks,
      hasChanged,
    });

    setHasChanges(hasChanged);
  }, [selectedTechStack, user.techStacks]);

  const handleSubmit = async () => {
    if (!hasChanges || isUpdating) return;

    console.log('전송할 기술 스택:', selectedTechStack);

    try {
      // API 응답 구조에 따라 문자열 배열 그대로 전송
      await updateStacks.mutateAsync(selectedTechStack);
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

  const handleTechStackToggle = (techName: string) => {
    console.log('기술 스택 토글:', techName);

    setSelectedTechStack(prev => {
      const newSelection = prev.includes(techName)
        ? prev.filter(name => name !== techName)
        : [...prev, techName];

      console.log('새로운 선택:', newSelection);
      return newSelection;
    });
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleCancel}
      title="기술 스택을 입력해주세요"
      subtitle="보유하고 있는 기술 스택을 입력 후 선택해주세요!"
      footer={null}
      disableBackdropClose={hasChanges}
      disableEscapeClose={hasChanges}
    >
      <div className={styles.content}>
        <div className={styles.hiddenTitles}>
          <TechStackSelector
            selectedTechStack={selectedTechStack}
            onTechStackToggle={handleTechStackToggle}
          />
        </div>
        {/* 버튼 추가 */}
        <div className={styles.buttonContainer}>
          <Button
            variant={hasChanges ? 'secondary' : 'ghost'}
            onClick={handleSubmit}
            disabled={!hasChanges || isUpdating}
            isLoading={isUpdating}
            fullWidth={true}
            radius="xsm"
            height={48}
          >
            {isUpdating ? '저장 중...' : '저장'}
          </Button>
        </div>
      </div>
    </BaseModal>
  );
};

export default EditTechStackModal;
