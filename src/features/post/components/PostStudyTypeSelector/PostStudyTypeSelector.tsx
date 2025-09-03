import clsx from 'clsx';

import Button from '@/components/Button/Button';
import { STUDY_TRAITS } from '@/constants/studyTraits';

import styles from './PostStudyTypeSelector.module.scss';

interface PostStudyTypeSelectorProps {
  selectedStudyType: string;
  onStudyTypeSelect: (studyTypeName: string) => void;
}

const PostStudyTypeSelector = ({
  selectedStudyType,
  onStudyTypeSelect,
}: PostStudyTypeSelectorProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <p className={styles.sectionSubtitle}>어떤 스터디를 진행하실 예정인가요?</p>
        <div className={styles.optionGrid}>
          {STUDY_TRAITS.map(trait => {
            const isSelected = selectedStudyType === trait.name;

            const handleClick = () => {
              // 이미 선택된 스터디 타입 클릭 시 선택 해제
              if (isSelected) {
                onStudyTypeSelect('');
              } else {
                onStudyTypeSelect(trait.name);
              }
            };

            return (
              <Button
                key={`study-type-${trait.id}`}
                type="button"
                variant="primary"
                radius="md"
                size="sm"
                fontSizePreset="xsmall"
                fontWeightPreset="regular"
                className={clsx(styles.studyTypeButton, isSelected && styles.selected)}
                onClick={handleClick}
              >
                {trait.name}
              </Button>
            );
          })}
        </div>
      </div>

      {/* 선택된 스터디 타입 표시 */}
      {selectedStudyType && (
        <div className={styles.selectionInfo}>선택된 스터디 타입: {selectedStudyType}</div>
      )}
    </div>
  );
};

export default PostStudyTypeSelector;
