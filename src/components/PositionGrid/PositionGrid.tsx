import clsx from 'clsx';

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
  disabledPositions?: number[];
}

const PositionGrid = ({
  selectedPosition,
  selectedPositions = [],
  onPositionSelect,
  onPositionToggle,
  keyPrefix = '',
  multiSelect = false,
  disabledPositions = [],
}: PositionGridProps) => {
  return (
    <div className={styles.optionGrid}>
      {POSITIONS.map(position => {
        const isSelected = multiSelect
          ? selectedPositions.includes(position.id)
          : selectedPosition === position.id;

        const isDisabled = disabledPositions.includes(position.id);

        const handleClick = () => {
          if (isDisabled) return;

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
            variant="primary"
            radius="md"
            size="sm"
            fontSizePreset="xsmall"
            fontWeightPreset="regular"
            className={clsx(styles.positionButton, isSelected && styles.selected)}
            onClick={handleClick}
            disabled={isDisabled}
          >
            {position.name}
          </Button>
        );
      })}
    </div>
  );
};

export default PositionGrid;
