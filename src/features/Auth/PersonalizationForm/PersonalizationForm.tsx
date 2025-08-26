import { useState } from 'react';

import Button from '@/components/Button/Button';
import ActiveTimeSelector from '@/features/Auth/components/ActiveTimeSelector/ActiveTimeSelector';
import BirthDateInput from '@/features/Auth/components/BirthDateInput';
import LocationSelector from '@/features/Auth/components/LocationSelector/LocationSelector';
import PersonalitySelector from '@/features/Auth/components/PersonalitySelector/PersonalitySelector';
import PositionSelector from '@/features/Auth/components/PositionSelector/PositionSelector';
import TechStackSelector from '@/features/Auth/components/TechStackSelector/TechStackSelector';

import styles from './PersonalizationForm.module.scss';

const PersonalizationForm = () => {
  const [selectedMainPosition, setSelectedMainPosition] = useState<number | null>(null);
  const [selectedInterestPositions, setSelectedInterestPositions] = useState<number[]>([]);
  const [selectedTechStack, setSelectedTechStack] = useState<number[]>([]);
  const [techSearch, setTechSearch] = useState<string>('');
  const [locationSearch, setLocationSearch] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<string>('');
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
    selectedPersonality.length > 0 &&
    birthDate &&
    activeHours.start &&
    activeHours.end;

  const handleTechStackToggle = (techId: number) => {
    setSelectedTechStack(prev =>
      prev.includes(techId) ? prev.filter(t => t !== techId) : [...prev, techId]
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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!isFormValid) return;

    setIsSubmitting(true);

    try {
      console.log('개인화 설정 완료:', {
        mainPosition: selectedMainPosition,
        interestPositions: selectedInterestPositions,
        techStack: selectedTechStack,
        location: selectedLocation,
        personality: selectedPersonality,
        birthDate,
        activeHours,
      });

      // TODO: API 호출 로직 추가
      await new Promise(resolve => setTimeout(resolve, 2000)); // 임시 딜레이

      // 성공 시 다음 페이지로 이동 등의 로직
    } catch (error) {
      console.error('개인화 설정 실패:', error);
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
            techSearch={techSearch}
            onTechSearchChange={setTechSearch}
            onTechStackToggle={handleTechStackToggle}
          />
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.contentInner}>
          <LocationSelector
            locationSearch={locationSearch}
            onLocationSearchChange={setLocationSearch}
            onLocationSelect={setSelectedLocation}
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
