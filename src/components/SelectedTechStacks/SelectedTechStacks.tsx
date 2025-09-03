import Button from '@/components/Button/Button';

import styles from './SelectedTechStacks.module.scss';

interface SelectedTechStacksProps {
  selectedTechStack: string[];
  onTechStackRemove: (techName: string) => void;
}

const SelectedTechStacks = ({ selectedTechStack, onTechStackRemove }: SelectedTechStacksProps) => {
  if (selectedTechStack.length === 0) {
    return null;
  }

  return (
    <div className={styles.selectedSection}>
      <p className={styles.sectionSubtitle}>선택된 기술 스택</p>
      <div className={styles.techStackContainer}>
        {selectedTechStack.map((tech, index) => (
          <Button
            key={`selected-${tech}-${index}`}
            variant="primary"
            radius="xxsm"
            size="sm"
            onClick={() => onTechStackRemove(tech)}
            className={`${styles.techButton}`}
          >
            <span className={styles.techName}>{tech}</span>
            <span className={styles.icon}>✕</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default SelectedTechStacks;
