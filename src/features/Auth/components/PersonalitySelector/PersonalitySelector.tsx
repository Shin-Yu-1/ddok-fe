import PersonalityGrid from '@/components/PersonalityGrid/PersonalityGrid';

import styles from './PersonalitySelector.module.scss';

interface PersonalitySelectorProps {
  selectedPersonality: number[];
  onPersonalityToggle: (personalityId: number) => void;
}

const PersonalitySelector = ({
  selectedPersonality,
  onPersonalityToggle,
}: PersonalitySelectorProps) => {
  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>본인의 성향을 선택해주세요</h2>
      <p className={styles.sectionSubtitle}>당신은 어떤 사람인가요? (최대 5개)</p>
      <PersonalityGrid
        selectedPersonality={selectedPersonality}
        onPersonalityToggle={onPersonalityToggle}
      />
    </div>
  );
};

export default PersonalitySelector;
