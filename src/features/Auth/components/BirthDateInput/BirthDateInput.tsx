import DateInput from '@/components/DateInput/DateInput';

import styles from './BirthDateInput.module.scss';

interface BirthDateInputProps {
  birthDate: string;
  onBirthDateChange: (date: string) => void;
  title?: string;
  required?: boolean;
  max?: string;
  min?: string;
}

const BirthDateInput = ({
  birthDate,
  onBirthDateChange,
  title = '당신의 생일을 입력해주세요',
  required = false,
  max,
  min,
}: BirthDateInputProps) => {
  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>
        {title}
        {required && <span style={{ color: 'var(--red-1)', marginLeft: '4px' }}>*</span>}
      </h2>
      <DateInput
        value={birthDate}
        onChange={onBirthDateChange}
        required={required}
        max={max}
        min={min}
      />
    </div>
  );
};

export default BirthDateInput;
