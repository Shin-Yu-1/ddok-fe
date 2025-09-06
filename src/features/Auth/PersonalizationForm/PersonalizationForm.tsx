import { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { submitPersonalization, getErrorMessage } from '@/api/auth';
import Button from '@/components/Button/Button';
import { POSITIONS } from '@/constants/positions';
import { USER_TRAITS } from '@/constants/userTraits';
import ActiveTimeSelector from '@/features/Auth/components/ActiveTimeSelector/ActiveTimeSelector';
import BirthDateInput from '@/features/Auth/components/BirthDateInput/BirthDateInput';
import LocationSelector from '@/features/Auth/components/LocationSelector/LocationSelector';
import PersonalitySelector from '@/features/Auth/components/PersonalitySelector/PersonalitySelector';
import PositionSelector from '@/features/Auth/components/PositionSelector/PositionSelector';
import TechStackSelector from '@/features/Auth/components/TechStackSelector/TechStackSelector';
import { useAuthStore } from '@/stores/authStore';
import type { Location } from '@/types/project';

import styles from './PersonalizationForm.module.scss';

const PersonalizationForm = () => {
  const navigate = useNavigate();
  const { updateUserInfo } = useAuthStore();
  const [selectedMainPosition, setSelectedMainPosition] = useState<number | null>(null);

  const [selectedInterestPositions, setSelectedInterestPositions] = useState<number[]>([]);
  const [selectedTechStack, setSelectedTechStack] = useState<string[]>([]);
  const [locationSearch, setLocationSearch] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [selectedPersonality, setSelectedPersonality] = useState<number[]>([]);
  const [birthDate, setBirthDate] = useState<string>('');
  const [activeHours, setActiveHours] = useState<{ start: string; end: string }>({
    start: '00:00',
    end: '00:00',
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // 대표 포지션 선택 핸들러
  const handleMainPositionSelect = (positionId: number) => {
    setSelectedMainPosition(positionId);

    // 대표 포지션으로 선택된 항목이 관심 포지션에 있다면 제거
    setSelectedInterestPositions(prev => prev.filter(id => id !== positionId));
  };

  // 관심 포지션 토글 핸들러 (최대 2개)
  const handleInterestPositionToggle = (positionId: number) => {
    setSelectedInterestPositions(prev => {
      if (prev.includes(positionId)) {
        return prev.filter(id => id !== positionId);
      } else if (prev.length < 2) {
        return [...prev, positionId];
      }
      return prev; // 이미 2개가 선택된 경우 무시
    });
  };

  // 필수 필드가 모두 채워졌는지 확인
  const isFormValid =
    selectedMainPosition !== null &&
    selectedTechStack.length > 0 &&
    selectedLocation &&
    selectedLocation.latitude !== 0 &&
    selectedLocation.longitude !== 0 &&
    selectedPersonality.length > 0 &&
    birthDate &&
    activeHours.start &&
    activeHours.end;

  const handleTechStackToggle = (techName: string) => {
    setSelectedTechStack(prev =>
      prev.includes(techName) ? prev.filter(t => t !== techName) : [...prev, techName]
    );
  };

  const handlePersonalityToggle = (personalityId: number) => {
    setSelectedPersonality(prev => {
      if (prev.includes(personalityId)) {
        return prev.filter(p => p !== personalityId);
      } else if (prev.length < 5) {
        return [...prev, personalityId];
      }
      return prev;
    });
  };

  // 주소와 상세 위치 정보를 함께 처리하는 핸들러
  const handleLocationSelect = (location: Location) => {
    setSelectedLocation(location);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!isFormValid) return;

    setIsSubmitting(true);

    try {
      // ID를 이름으로 변환하는 헬퍼 함수들
      const getPositionName = (id: number) => POSITIONS.find(p => p.id === id)?.name || '';
      const getTraitName = (id: number) => USER_TRAITS.find(t => t.id === id)?.name || '';

      // 활동 시간을 API 형식으로 변환 (HH:MM -> HH)
      const formatActiveHours = (hours: { start: string; end: string }) => ({
        start: hours.start.split(':')[0], // "09:00" -> "09"
        end: hours.end.split(':')[0], // "18:00" -> "18"
      });

      // API 요청 데이터 구성
      const personalizationData = {
        mainPosition: selectedMainPosition ? getPositionName(selectedMainPosition) : '',
        subPosition: selectedInterestPositions.map(getPositionName).filter(Boolean),
        techStacks: selectedTechStack,
        location: selectedLocation || {
          address: '위치 미설정',
          region1depthName: '',
          region2depthName: '',
          region3depthName: '',
          roadName: '',
          mainBuildingNo: '',
          subBuildingNo: '',
          zoneNo: '',
          latitude: 37.5665, // 서울 기본 좌표
          longitude: 126.978,
        },
        traits: selectedPersonality.map(getTraitName).filter(Boolean),
        birthDate,
        activeHours: formatActiveHours(activeHours),
      };

      // 실제 API 호출
      const response = await submitPersonalization(personalizationData);

      // 서버에서 받은 사용자 정보 중 로그인 응답 항목들만 업데이트
      updateUserInfo({
        // 로그인 응답에 포함된 항목들만 업데이트
        id: response.id,
        username: response.username,
        email: response.email,
        nickname: response.nickname,
        profileImageUrl: response.profileImageUrl,
        mainPosition: response.mainPosition,
        location: response.preferences?.location || null, // preferences에서 location 객체 추출
        isPreference: true, // 개인화 설정 완료로 표시
        // preferences 데이터는 저장하지 않음
      });

      // 상태 업데이트 후 약간의 딜레이를 주고 navigate
      setTimeout(() => {
        navigate('/map', { replace: true });
      }, 100);
    } catch (error) {
      console.error('개인화 설정 실패:', error);
      // 에러 메시지 처리
      const errorMessage = getErrorMessage(error);
      alert(`개인화 설정에 실패했습니다: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.content}>
        <div className={styles.contentInner}>
          <PositionSelector
            selectedMainPosition={selectedMainPosition}
            selectedInterestPositions={selectedInterestPositions}
            onMainPositionSelect={handleMainPositionSelect}
            onInterestPositionToggle={handleInterestPositionToggle}
          />
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.contentInner}>
          <TechStackSelector
            selectedTechStack={selectedTechStack}
            onTechStackToggle={handleTechStackToggle}
          />
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.contentInner}>
          <LocationSelector
            locationSearch={locationSearch}
            onLocationSearchChange={setLocationSearch}
            onLocationSelect={handleLocationSelect}
          />
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.contentInner}>
          <PersonalitySelector
            selectedPersonality={selectedPersonality}
            onPersonalityToggle={handlePersonalityToggle}
          />
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.contentInner}>
          <BirthDateInput birthDate={birthDate} onBirthDateChange={setBirthDate} />
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.contentInner}>
          <ActiveTimeSelector activeHours={activeHours} onActiveHoursChange={setActiveHours} />
        </div>
      </div>

      <Button
        type="submit"
        className={styles.submitBtn}
        disabled={!isFormValid || isSubmitting}
        variant={isFormValid ? 'secondary' : 'ghost'}
        radius="xsm"
        height="62px"
      >
        {isSubmitting ? '시작하는 중...' : '시작하기'}
      </Button>
    </form>
  );
};

export default PersonalizationForm;
