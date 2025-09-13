import { CaretDownIcon, UsersIcon } from '@phosphor-icons/react';
import { Select } from 'radix-ui';

import styles from './PostCapacitySelector.module.scss';

interface PostCapacitySelectorProps {
  value: number;
  onChange: (capacity: number) => void;
}

const PostCapacitySelector = ({ value, onChange }: PostCapacitySelectorProps) => {
  const handleValueChange = (selectedValue: string) => {
    onChange(parseInt(selectedValue, 10));
  };

  return (
    <div className={styles.container}>
      <p className={styles.sectionSubtitle}>몇 명의 인원을 모집하실 예정인가요?</p>

      <Select.Root value={value.toString()} onValueChange={handleValueChange}>
        <Select.Trigger className={styles.selectTrigger}>
          <div className={styles.triggerContent}>
            <UsersIcon size={20} color="var(--gray-1)" />
            <Select.Value placeholder="모집하실 인원 수를 선택해주세요" />
          </div>
          <Select.Icon>
            <CaretDownIcon size={16} color="var(--gray-1)" />
          </Select.Icon>
        </Select.Trigger>

        <Select.Portal>
          <Select.Content
            className={styles.selectContent}
            position="popper"
            side="bottom"
            align="end"
            sideOffset={4}
          >
            <Select.Viewport className={styles.selectViewport}>
              {Array.from({ length: 7 }, (_, i) => (
                <Select.Item key={i + 1} value={(i + 1).toString()} className={styles.selectItem}>
                  <Select.ItemText>{i + 1}명</Select.ItemText>
                </Select.Item>
              ))}
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>

      {value && (
        <div className={styles.selectedCapacity}>
          <div className={styles.capacityInfo}>
            <UsersIcon size={16} color="var(--black-3)" />
            <span className={styles.capacityText}>총 {value}명의 인원을 모집합니다</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCapacitySelector;
