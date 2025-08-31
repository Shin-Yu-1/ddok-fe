import DateInput from '@/components/DateInput/DateInput';

import styles from './PostDateSelector.module.scss';

interface PostDateSelectorProps {
  value: string;
  onChange: (date: string) => void;
  label: string;
  placeholder?: string;
  min?: string;
  max?: string;
}

const PostDateSelector = ({
  value,
  onChange,
  label,
  placeholder = 'YYYY-MM-DD',
  min,
  max,
}: PostDateSelectorProps) => {
  return (
    <div className={styles.container}>
      <p className={styles.sectionSubtitle}>{label}</p>
      <DateInput
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        min={min}
        max={max}
        required
        readOnly={true}
      />

      {value && (
        <div className={styles.selectedDate}>
          <span className={styles.dateText}>
            선택된 날짜:{' '}
            {new Date(value).toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              weekday: 'short',
            })}
            요일
          </span>
        </div>
      )}
    </div>
  );
};

export default PostDateSelector;
