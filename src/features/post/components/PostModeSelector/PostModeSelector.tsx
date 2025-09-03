import { RadioGroup } from 'radix-ui';

import styles from './PostModeSelector.module.scss';

interface PostModeSelectorProps {
  value: 'online' | 'offline';
  onChange: (mode: 'online' | 'offline') => void;
}

const PostModeSelector = ({ value, onChange }: PostModeSelectorProps) => {
  const handleValueChange = (selectedValue: string) => {
    onChange(selectedValue as 'online' | 'offline');
  };

  return (
    <div className={styles.container}>
      <RadioGroup.Root className={styles.radioRoot} value={value} onValueChange={handleValueChange}>
        <div className={styles.radioItemGroup}>
          <RadioGroup.Item className={styles.radioItem} value="online" id="mode-online">
            <RadioGroup.Indicator className={styles.radioIndicator} />
          </RadioGroup.Item>
          <label className={styles.radioLabel} htmlFor="mode-online">
            온라인
          </label>
        </div>
        <div className={styles.radioItemGroup}>
          <RadioGroup.Item className={styles.radioItem} value="offline" id="mode-offline">
            <RadioGroup.Indicator className={styles.radioIndicator} />
          </RadioGroup.Item>
          <label className={styles.radioLabel} htmlFor="mode-offline">
            오프라인
          </label>
        </div>
      </RadioGroup.Root>
    </div>
  );
};

export default PostModeSelector;
