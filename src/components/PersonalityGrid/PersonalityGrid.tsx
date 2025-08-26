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
            variant="none"
            radius="sm"
            size="sm"
            fontSizePreset="xsmall"
            backgroundColor={isSelected ? 'var(--selected-bg-color)' : 'var(--unselected-bg-color)'}
            textColor={isSelected ? 'var(--selected-text-color)' : 'var(--unselected-text-color)'}
            border={
              isSelected
                ? '2px solid var(--selected-border-color)'
                : '1px solid var(--unselected-border-color)'
            }
            fontWeight={
              isSelected ? 'var(--selected-font-weight)' : 'var(--unselected-font-weight)'
            }
            padding="0.75rem 1rem"
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
