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
      <input
        type="date"
        value={birthDate}
        onChange={handleChange}
        className={styles.dateInput}
        required={required}
        max={max}
        min={min}
        aria-label={title}
      />
    </div>
  );
};

export default BirthDateInput;
