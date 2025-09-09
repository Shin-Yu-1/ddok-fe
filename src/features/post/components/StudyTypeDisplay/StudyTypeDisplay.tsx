import { BookOpen } from '@phosphor-icons/react';

import styles from './StudyTypeDisplay.module.scss';

interface StudyTypeDisplayProps {
  studyType: string;
}

const StudyTypeDisplay = ({ studyType }: StudyTypeDisplayProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.typeInfo}>
        <div className={styles.iconSection}>
          <BookOpen size={20} color="var(--green-1)" />
        </div>

        <div className={styles.textSection}>
          <div className={styles.typeText}>{studyType}</div>
          <div className={styles.description}>스터디 유형</div>
        </div>
      </div>
    </div>
  );
};

export default StudyTypeDisplay;
