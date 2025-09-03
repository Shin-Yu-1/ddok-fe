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
  // 오늘 날짜를 YYYY-MM-DD 형식으로 생성
  const today = new Date().toISOString().split('T')[0];

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
        max={max || today} // max가 제공되지 않으면 오늘 날짜를 사용
        min={min}
      />
    </div>
  );
};

export default BirthDateInput;
