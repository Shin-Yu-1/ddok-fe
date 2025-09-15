import { UserIcon } from '@phosphor-icons/react';

import type { PreferredAges } from '@/types/project';

import styles from './AgeRangeDisplay.module.scss';

interface AgeRangeDisplayProps {
  preferredAges: PreferredAges | null;
}

const AgeRangeDisplay = ({ preferredAges }: AgeRangeDisplayProps) => {
  const getAgeRangeText = (ageMin: number, ageMax: number) => {
    const minDecade = Math.floor(ageMin / 10) * 10;
    const maxDecade = Math.floor((ageMax - 1) / 10) * 10;

    if (minDecade === maxDecade) {
      return `${minDecade}대`;
    }

    const decades = [];
    for (let decade = minDecade; decade <= maxDecade; decade += 10) {
      decades.push(`${decade}대`);
    }

    return decades.join(', ');
  };

  if (!preferredAges) {
    return (
      <div className={styles.container}>
        <div className={styles.ageInfo}>
          <UserIcon size={16} color="var(--gray-1)" />
          <span className={styles.ageText}>나이 제한 없음</span>
        </div>
      </div>
    );
  }

  const { ageMin, ageMax } = preferredAges;

  return (
    <div className={styles.container}>
      <div className={styles.ageInfo}>
        <UserIcon size={16} color="var(--blue-1)" />
        <span className={styles.ageText}>{getAgeRangeText(ageMin, ageMax)}</span>
      </div>
    </div>
  );
};

export default AgeRangeDisplay;
