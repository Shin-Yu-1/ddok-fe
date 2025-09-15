import PositionGrid from '@/components/PositionGrid/PositionGrid';

import styles from './PositionSelector.module.scss';

interface PositionSelectorProps {
  selectedMainPosition: number | null;
  selectedInterestPositions: number[];
  onMainPositionSelect: (positionId: number) => void;
  onInterestPositionToggle: (positionId: number) => void;
}

const PositionSelector = ({
  selectedMainPosition,
  selectedInterestPositions,
  onMainPositionSelect,
  onInterestPositionToggle,
}: PositionSelectorProps) => {
  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>당신의 포지션을 선택해주세요</h2>
      <p className={styles.sectionSubtitle}>대표 포지션 하나를 선택해주세요</p>
      <PositionGrid
        selectedPosition={selectedMainPosition}
        onPositionSelect={onMainPositionSelect}
        multiSelect={false}
        keyPrefix="main"
      />
      <p className={styles.sectionSubtitle}>관심 포지션 두개를 선택해주세요</p>
      <PositionGrid
        selectedPositions={selectedInterestPositions}
        onPositionToggle={onInterestPositionToggle}
        multiSelect={true}
        keyPrefix="interest"
        disabledPositions={selectedMainPosition ? [selectedMainPosition] : []}
      />
    </div>
  );
};

export default PositionSelector;
