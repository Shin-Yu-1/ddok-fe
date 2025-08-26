import Button from '@/components/Button/Button';
import { POSITIONS } from '@/constants/positions';

import styles from './PositionGrid.module.scss';

interface PositionGridProps {
  selectedPosition?: number | null;
  selectedPositions?: number[];
  onPositionSelect?: (positionId: number) => void;
  onPositionToggle?: (positionId: number) => void;
  keyPrefix?: string;
  multiSelect?: boolean;
}

const PositionGrid = ({
  selectedPosition,
  selectedPositions = [],
  onPositionSelect,
  onPositionToggle,
  keyPrefix = '',
  multiSelect = false,
}: PositionGridProps) => {
  return (
    <div className={styles.optionGrid}>
      {POSITIONS.map(position => {
        const isSelected = multiSelect
          ? selectedPositions.includes(position.id)
          : selectedPosition === position.id;

        const handleClick = () => {
          if (multiSelect && onPositionToggle) {
            onPositionToggle(position.id);
          } else if (!multiSelect && onPositionSelect) {
            onPositionSelect(position.id);
          }
        };

        return (
          <Button
            key={keyPrefix ? `${keyPrefix}-${position.id}` : position.id}
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
            {position.name}
          </Button>
        );
      })}
    </div>
  );
};

export default PositionGrid;
