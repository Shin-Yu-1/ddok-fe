import Button from '@/components/Button/Button';
import { TECH_STACKS } from '@/constants/techStacks';

import styles from './SelectedTechStacks.module.scss';

interface SelectedTechStacksProps {
  selectedTechStack: number[];
  onTechStackRemove: (techId: number) => void;
}

const SelectedTechStacks = ({ selectedTechStack, onTechStackRemove }: SelectedTechStacksProps) => {
  // 선택된 기술 스택들 가져오기
  const selectedTechStacks = TECH_STACKS.filter(tech => selectedTechStack.includes(tech.id));

  if (selectedTechStacks.length === 0) {
    return null;
  }

  return (
    <div className={styles.selectedSection}>
      <p className={styles.sectionSubtitle}>선택된 기술 스택</p>
      <div className={styles.techStackContainer}>
        {selectedTechStacks.map(tech => (
          <Button
            key={`selected-${tech.id}`}
            variant="primary"
            radius="xxsm"
            size="sm"
            onClick={() => onTechStackRemove(tech.id)}
            className={`${styles.techButton}`}
          >
            <span className={styles.techName}>{tech.name}</span>
            <span className={styles.icon}>✕</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default SelectedTechStacks;
