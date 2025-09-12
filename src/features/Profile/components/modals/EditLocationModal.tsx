import { useState, useEffect } from 'react';

import Button from '@/components/Button/Button';
import BaseModal from '@/components/Modal/BaseModal';
import PostLocationSelector from '@/features/post/components/PostLocationSelector/PostLocationSelector';
import type { Location } from '@/types/project';
import type { CompleteProfileInfo } from '@/types/user';

import { useProfileMutations } from '../../hooks/useProfileMutations';

import styles from './EditLocationModal.module.scss';

interface EditLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: CompleteProfileInfo;
}

const EditLocationModal = ({ isOpen, onClose, user }: EditLocationModalProps) => {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  const { updateLocation, isUpdating } = useProfileMutations({
    userId: user.userId,
    onSuccess: () => {
      console.log('주활동지 수정 성공! 모달 닫기 및 새로고침');
      onClose();

      setTimeout(() => {
        window.location.reload();
      }, 300);
    },
    onError: error => {
      console.error('주활동지 수정 실패:', error);
      // TODO: 토스트 알림 등 에러 처리
    },
  });

  // 모달이 열릴 때 기존 데이터로 초기화
  useEffect(() => {
    if (isOpen && user.location) {
      const initialLocation: Location = {
        address: user.location.address || '',
        region1depthName: user.location.region1depthName || '',
        region2depthName: user.location.region2depthName || '',
        region3depthName: user.location.region3depthName || '',
        roadName: user.location.roadName || '',
        mainBuildingNo: user.location.mainBuildingNo || '',
        subBuildingNo: user.location.subBuildingNo || '',
        zoneNo: user.location.zoneNo || '',
        latitude: user.location.latitude,
        longitude: user.location.longitude,
      };

      setSelectedLocation(initialLocation);
      setHasChanges(false);
    }
  }, [isOpen, user.location]);

  // 변경사항 감지
  useEffect(() => {
    if (!selectedLocation || !user.location) {
      setHasChanges(false);
      return;
    }

    const hasChanged =
      selectedLocation.latitude !== user.location.latitude ||
      selectedLocation.longitude !== user.location.longitude ||
      selectedLocation.address !== user.location.address ||
      selectedLocation.region1depthName !== user.location.region1depthName ||
      selectedLocation.region2depthName !== user.location.region2depthName ||
      selectedLocation.region3depthName !== user.location.region3depthName ||
      selectedLocation.roadName !== user.location.roadName ||
      selectedLocation.mainBuildingNo !== user.location.mainBuildingNo ||
      selectedLocation.subBuildingNo !== user.location.subBuildingNo ||
      selectedLocation.zoneNo !== user.location.zoneNo;

    setHasChanges(hasChanged);
  }, [selectedLocation, user.location]);

  const handleLocationChange = (location: Location | null) => {
    setSelectedLocation(location);
  };

  const handleSubmit = async () => {
    if (!hasChanges || isUpdating || !selectedLocation) return;

    console.log('주활동지 수정 요청:', selectedLocation);

    try {
      await updateLocation.mutateAsync(selectedLocation);
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

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleCancel}
      title="주활동지를 설정해주세요"
      subtitle="프로젝트와 스터디를 주로 진행할 지역을 선택해주세요."
      footer={null}
      disableBackdropClose={hasChanges}
      disableEscapeClose={hasChanges}
    >
      <div className={styles.content}>
        <div className={styles.hiddenTitles}>
          <PostLocationSelector
            location={selectedLocation}
            onLocationChange={handleLocationChange}
          />
        </div>
        <div className={styles.buttonContainer}>
          <Button
            variant={hasChanges ? 'secondary' : 'ghost'}
            onClick={handleSubmit}
            disabled={!hasChanges || isUpdating || !selectedLocation}
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

export default EditLocationModal;
