import clsx from 'clsx';

import Button from '@/components/Button/Button';
import { USER_TRAITS } from '@/constants/userTraits';

import styles from './PersonalityGrid.module.scss';

interface PersonalityGridProps {
  selectedPersonality: number[];
  onPersonalityToggle: (personalityId: number) => void;
  keyPrefix?: string;
}

const PersonalityGrid = ({
  selectedPersonality,
  onPersonalityToggle,
  keyPrefix = '',
}: PersonalityGridProps) => {
  return (
    <div className={styles.optionGrid}>
      {USER_TRAITS.map(trait => {
        const isSelected = selectedPersonality.includes(trait.id);

        const handleClick = () => {
          onPersonalityToggle(trait.id);
        };

        return (
          <Button
            key={keyPrefix ? `${keyPrefix}-${trait.id}` : trait.id}
            type="button"
            variant="primary"
            radius="md"
            size="sm"
            fontSizePreset="xsmall"
            fontWeightPreset="regular"
            className={clsx(styles.personalityButton, isSelected && styles.selected)}
            onClick={handleClick}
          >
            {trait.name}
          </Button>
        );
      })}
    </div>
  );
};

export default PersonalityGrid;
