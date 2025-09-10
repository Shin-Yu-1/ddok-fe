import { useState, useEffect } from 'react';

import Button from '@/components/Button/Button';
import BaseModal from '@/components/Modal/BaseModal';
import { POSITIONS } from '@/constants/positions';
import PositionSelector from '@/features/Auth/components/PositionSelector/PositionSelector';
import type { CompleteProfileInfo } from '@/types/user';

import { useProfileMutations } from '../../hooks/useProfileMutations';

import styles from './EditPositionModal.module.scss';

interface EditPositionModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: CompleteProfileInfo;
}

const EditPositionModal = ({ isOpen, onClose, user }: EditPositionModalProps) => {
  const [selectedMainPosition, setSelectedMainPosition] = useState<number | null>(null);
  const [selectedInterestPositions, setSelectedInterestPositions] = useState<number[]>([]);
  const [hasChanges, setHasChanges] = useState(false);

  const { updatePositions, isUpdating } = useProfileMutations({
    userId: user.userId,
    onSuccess: () => {
      console.log('포지션 수정 성공! 모달 닫기 및 새로고침');
      onClose();

      setTimeout(() => {
        window.location.reload();
      }, 300);
    },
    onError: error => {
      console.error('포지션 수정 실패:', error);
      // TODO: 토스트 알림 등 에러 처리
    },
  });

  // 포지션 이름으로 ID 찾기
  const getPositionIdByName = (name: string): number | null => {
    const position = POSITIONS.find(pos => pos.name === name);
    return position ? position.id : null;
  };

  // ID로 포지션 이름 찾기
  const getPositionNameById = (id: number): string => {
    const position = POSITIONS.find(pos => pos.id === id);
    return position ? position.name : '';
  };

  // 모달이 열릴 때 기존 데이터로 초기화
  useEffect(() => {
    if (isOpen) {
      const mainPositionId = user.mainPosition ? getPositionIdByName(user.mainPosition) : null;
      const interestPositionIds = user.subPositions
        .map(pos => getPositionIdByName(pos))
        .filter((id): id is number => id !== null);

      setSelectedMainPosition(mainPositionId);
      setSelectedInterestPositions(interestPositionIds);
      setHasChanges(false);
    }
  }, [isOpen, user.mainPosition, user.subPositions]);

  // 변경사항 감지
  useEffect(() => {
    const currentMainName = selectedMainPosition ? getPositionNameById(selectedMainPosition) : '';
    const currentInterestNames = selectedInterestPositions
      .map(id => getPositionNameById(id))
      .filter(name => name !== '');

    const hasMainChanged = currentMainName !== user.mainPosition;
    const hasInterestChanged =
      currentInterestNames.length !== user.subPositions.length ||
      currentInterestNames.some(name => !user.subPositions.includes(name)) ||
      user.subPositions.some(name => !currentInterestNames.includes(name));

    setHasChanges(hasMainChanged || hasInterestChanged);
  }, [selectedMainPosition, selectedInterestPositions, user.mainPosition, user.subPositions]);

  const handleSubmit = async () => {
    if (!hasChanges || !selectedMainPosition || isUpdating) return;

    const mainPosition = getPositionNameById(selectedMainPosition);
    const subPositions = selectedInterestPositions
      .map(id => getPositionNameById(id))
      .filter(name => name !== '');

    console.log('포지션 수정 요청:', { mainPosition, subPositions });

    try {
      await updatePositions.mutateAsync({
        mainPosition,
        subPositions,
      });
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

  const handleMainPositionSelect = (positionId: number) => {
    setSelectedMainPosition(positionId);

    // 메인 포지션이 관심 포지션에 있으면 제거
    if (selectedInterestPositions.includes(positionId)) {
      setSelectedInterestPositions(prev => prev.filter(id => id !== positionId));
    }
  };

  const handleInterestPositionToggle = (positionId: number) => {
    setSelectedInterestPositions(prev => {
      if (prev.includes(positionId)) {
        return prev.filter(id => id !== positionId);
      } else {
        // 최대 2개까지만 선택 가능
        if (prev.length >= 2) {
          return prev;
        }
        return [...prev, positionId];
      }
    });
  };

  const isValidPosition = !!selectedMainPosition;

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleCancel}
      title="포지션를 입력해주세요"
      subtitle="대표 포지션과 관심 포지션을 설정해주세요! (대표 포지션 필수)"
      footer={null}
      disableBackdropClose={hasChanges}
      disableEscapeClose={hasChanges}
    >
      <div className={styles.content}>
        <div className={styles.hiddenTitles}>
          <PositionSelector
            selectedMainPosition={selectedMainPosition}
            selectedInterestPositions={selectedInterestPositions}
            onMainPositionSelect={handleMainPositionSelect}
            onInterestPositionToggle={handleInterestPositionToggle}
          />
        </div>

        {/* 버튼 추가 */}
        <div className={styles.buttonContainer}>
          <Button
            variant={hasChanges ? 'secondary' : 'ghost'}
            onClick={handleSubmit}
            disabled={!hasChanges || !isValidPosition || isUpdating}
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

export default EditPositionModal;
