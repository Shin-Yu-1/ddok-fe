import PersonalityGrid from '@/components/PersonalityGrid/PersonalityGrid';
import { USER_TRAITS } from '@/constants/userTraits';

import styles from './ProjectPersonalitySelector.module.scss';

interface ProjectPersonalitySelectorProps {
  selectedPersonality: string[];
  onPersonalityToggle: (personalityName: string) => void;
  maxSelection?: number;
}

const ProjectPersonalitySelector = ({
  selectedPersonality,
  onPersonalityToggle,
  maxSelection = 5,
}: ProjectPersonalitySelectorProps) => {
  // 문자열 배열을 ID 배열로 변환
  const selectedPersonalityIds = selectedPersonality
    .map(traitName => {
      const trait = USER_TRAITS.find(t => t.name === traitName);
      return trait ? trait.id : null;
    })
    .filter((id): id is number => id !== null);

  // ID를 받아서 문자열로 변환 후 상위 컴포넌트에 전달
  const handlePersonalityToggle = (personalityId: number) => {
    const trait = USER_TRAITS.find(t => t.id === personalityId);
    if (!trait) return;

    const isSelected = selectedPersonality.includes(trait.name);

    if (isSelected) {
      // 이미 선택된 성향 제거
      onPersonalityToggle(trait.name);
    } else {
      // 최대 개수 체크
      if (selectedPersonality.length >= maxSelection) {
        alert(`최대 ${maxSelection}개까지만 선택할 수 있습니다.`);
        return;
      }
      // 새로운 성향 추가
      onPersonalityToggle(trait.name);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <p className={styles.sectionSubtitle}>
          어떤 성향의 팀원과 함께하고 싶나요? (최대 {maxSelection}개)
        </p>
        <PersonalityGrid
          selectedPersonality={selectedPersonalityIds}
          onPersonalityToggle={handlePersonalityToggle}
          keyPrefix="project"
        />
      </div>

      {/* 선택된 성향 개수 표시 */}
      <div className={styles.selectionCount}>
        선택된 성향: {selectedPersonality.length}/{maxSelection}
      </div>
    </div>
  );
};

export default ProjectPersonalitySelector;
