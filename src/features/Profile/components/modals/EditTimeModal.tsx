import { useState, useEffect } from 'react';

import Button from '@/components/Button/Button';
import BaseModal from '@/components/Modal/BaseModal';
import ActiveTimeSelector from '@/features/Auth/components/ActiveTimeSelector/ActiveTimeSelector';
import type { CompleteProfileInfo } from '@/types/user';

import { useProfileMutations } from '../../hooks/useProfileMutations';

import styles from './EditTimeModal.module.scss';

interface EditTimeModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: CompleteProfileInfo;
}

const EditTimeModal = ({ isOpen, onClose, user }: EditTimeModalProps) => {
  const [activeHours, setActiveHours] = useState({ start: '', end: '' });
  const [initialActiveHours, setInitialActiveHours] = useState({ start: '', end: '' });
  const [hasChanges, setHasChanges] = useState(false);

  const { updateHours, isUpdating } = useProfileMutations({
    userId: user.userId,
    onSuccess: () => {
      console.log('활동 시간 수정 성공! 모달 닫기 및 새로고침');
      onClose();

      setTimeout(() => {
        window.location.reload();
      }, 300);
    },
    onError: error => {
      console.error('활동 시간 수정 실패:', error);
      // TODO: 토스트 알림 등 에러 처리
    },
  });

  // 시간 포맷 변환 함수 (HH:mm 형식으로)
  const formatTimeForDisplay = (hour: string): string => {
    if (!hour) return '00:00';
    const hourNum = parseInt(hour, 10);
    if (isNaN(hourNum)) return '00:00';
    return `${hourNum.toString().padStart(2, '0')}:00`;
  };

  // 시간 포맷 변환 함수 (API용 - '04' 형태로)
  const formatTimeForApi = (timeString: string): string => {
    if (!timeString) return '00';
    const [hour] = timeString.split(':');
    const hourNum = parseInt(hour, 10);
    if (isNaN(hourNum)) return '00';
    return hourNum.toString().padStart(2, '0'); // '04' 형태로 변환
  };

  // 모달이 열릴 때 기존 데이터로 초기화
  useEffect(() => {
    if (isOpen) {
      const initialHours = {
        start: formatTimeForDisplay(user.activeHours.start),
        end: formatTimeForDisplay(user.activeHours.end),
      };

      setActiveHours(initialHours);
      setInitialActiveHours(initialHours);
      setHasChanges(false);
    }
  }, [isOpen, user.activeHours]);

  // 변경사항 감지
  useEffect(() => {
    if (!isOpen) return; // 모달이 닫힌 상태에서는 비교하지 않음

    const hasChanged =
      activeHours.start !== initialActiveHours.start || activeHours.end !== initialActiveHours.end;

    setHasChanges(hasChanged);
  }, [activeHours, initialActiveHours, isOpen]);

  const handleSubmit = async () => {
    if (!hasChanges || isUpdating) return;

    const startHour = formatTimeForApi(activeHours.start);
    const endHour = formatTimeForApi(activeHours.end);

    console.log('시간 API 전송 데이터:', { start: startHour, end: endHour });

    try {
      await updateHours.mutateAsync({
        start: startHour,
        end: endHour,
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

  const handleActiveHoursChange = (hours: { start: string; end: string }) => {
    setActiveHours(hours);
  };

  const isValidTime = activeHours.start && activeHours.end;

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleCancel}
      title="활동 시간을 입력해주세요"
      subtitle="주로 활동하는 시간대를 설정해주세요!"
      footer={null}
      disableBackdropClose={hasChanges}
      disableEscapeClose={hasChanges}
    >
      <div className={styles.content}>
        <div className={styles.hiddenTitles}>
          <ActiveTimeSelector
            activeHours={activeHours}
            onActiveHoursChange={handleActiveHoursChange}
            title="주로 활동하는 시간대를 설정해주세요"
          />
        </div>
        {/* 버튼 추가 */}
        <div className={styles.buttonContainer}>
          <Button
            variant={hasChanges ? 'secondary' : 'ghost'}
            onClick={handleSubmit}
            disabled={!hasChanges || !isValidTime || isUpdating}
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

export default EditTimeModal;
