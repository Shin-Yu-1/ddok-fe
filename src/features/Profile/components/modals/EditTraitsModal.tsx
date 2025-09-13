import { useState, useEffect } from 'react';

import Button from '@/components/Button/Button';
import BaseModal from '@/components/Modal/BaseModal';
import { USER_TRAITS } from '@/constants/userTraits';
import PersonalitySelector from '@/features/Auth/components/PersonalitySelector/PersonalitySelector';
import { DDtoast } from '@/features/toast';
import type { CompleteProfileInfo } from '@/types/user';

import { useProfileMutations } from '../../hooks/useProfileMutations';

import styles from './EditTraitsModal.module.scss';

interface EditTraitsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: CompleteProfileInfo;
}

const EditTraitsModal = ({ isOpen, onClose, user }: EditTraitsModalProps) => {
  const [selectedPersonality, setSelectedPersonality] = useState<number[]>([]);
  const [hasChanges, setHasChanges] = useState(false);

  const { updateTraits, isUpdating } = useProfileMutations({
    userId: user.userId,
    onSuccess: () => {
      console.log('성향 수정 성공! 모달 닫기 및 새로고침');
      DDtoast({
        mode: 'custom',
        type: 'success',
        userMessage: '성향 수정에 성공했습니다.',
      });
      onClose();

      setTimeout(() => {
        window.location.reload();
      }, 300);
    },
    onError: error => {
      console.error('성향 수정 실패:', error);
      DDtoast({
        mode: 'custom',
        type: 'error',
        userMessage: '성향 수정에 실패하셨습니다. 다시 시도해주세요.',
      });
    },
  });

  // 성향 이름으로 ID 찾기
  const getPersonalityIdByName = (name: string): number | null => {
    const personality = USER_TRAITS.find(trait => trait.name === name);
    return personality ? personality.id : null;
  };

  // ID로 성향 이름 찾기
  const getPersonalityNameById = (id: number): string => {
    const personality = USER_TRAITS.find(trait => trait.id === id);
    return personality ? personality.name : '';
  };

  // 모달이 열릴 때 기존 데이터로 초기화
  useEffect(() => {
    if (isOpen) {
      const initialPersonalityIds = (user.traits || [])
        .map(trait => getPersonalityIdByName(trait))
        .filter((id): id is number => id !== null);

      setSelectedPersonality([...initialPersonalityIds]);
      setHasChanges(false);
    }
  }, [isOpen, user.traits]);

  // 변경사항 감지
  useEffect(() => {
    const currentTraitNames = selectedPersonality
      .map(id => getPersonalityNameById(id))
      .filter(name => name !== '');
    const initialTraits = user.traits || [];

    const hasChanged =
      currentTraitNames.length !== initialTraits.length ||
      currentTraitNames.some(name => !initialTraits.includes(name)) ||
      initialTraits.some(name => !currentTraitNames.includes(name));

    setHasChanges(hasChanged);
  }, [selectedPersonality, user.traits]);

  const handleSubmit = async () => {
    if (!hasChanges || selectedPersonality.length < 1 || isUpdating) return;

    const traitNames = selectedPersonality
      .map(id => getPersonalityNameById(id))
      .filter(name => name !== '');

    console.log('성향 수정 요청:', traitNames);

    try {
      await updateTraits.mutateAsync(traitNames);
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

  const handlePersonalityToggle = (personalityId: number) => {
    setSelectedPersonality(prev => {
      if (prev.includes(personalityId)) {
        return prev.filter(id => id !== personalityId);
      } else {
        // 최대 5개까지만 선택 가능 (PersonalitySelector 컴포넌트 subtitle 참고)
        if (prev.length >= 5) {
          return prev;
        }
        return [...prev, personalityId];
      }
    });
  };

  // 최소 1개 - 최대 5개 검증
  const isValidSelection = selectedPersonality.length >= 1 && selectedPersonality.length <= 5;

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleCancel}
      title="본인의 성향을 선택해주세요"
      subtitle="당신은 어떤 사람인가요? (최소 1개, 최대 5개)"
      footer={null}
      disableBackdropClose={hasChanges}
      disableEscapeClose={hasChanges}
    >
      <div className={styles.content}>
        <div className={styles.hiddenTitles}>
          <PersonalitySelector
            selectedPersonality={selectedPersonality}
            onPersonalityToggle={handlePersonalityToggle}
          />
        </div>

        {/* 버튼 추가 */}
        <div className={styles.buttonContainer}>
          <Button
            variant={hasChanges ? 'secondary' : 'ghost'}
            onClick={handleSubmit}
            disabled={!hasChanges || !isValidSelection || isUpdating}
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

export default EditTraitsModal;
