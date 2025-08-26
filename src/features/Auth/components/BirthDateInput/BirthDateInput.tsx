import Input from '@/components/Input/Input';

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
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onBirthDateChange(e.target.value);
  };

  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>
        {title}
        {required && <span style={{ color: 'var(--red-1)', marginLeft: '4px' }}>*</span>}
      </h2>
      <Input
        type="date"
        value={birthDate}
        onChange={handleChange}
        required={required}
        max={max}
        min={min}
        border="1px solid #e9ecef"
        focusBorder="1px solid #ffc107"
      />
    </div>
  );
};

export default BirthDateInput;
