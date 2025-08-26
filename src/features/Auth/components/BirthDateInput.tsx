import styles from '@/pages/personalization/PersonalizationPage/PersonalizationPage.module.scss';

interface BirthDateInputProps {
  birthDate: string;
  onBirthDateChange: (date: string) => void;
}

const BirthDateInput = ({ birthDate, onBirthDateChange }: BirthDateInputProps) => {
  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>당신의 생일을 입력해주세요</h2>
      <input
        type="date"
        value={birthDate}
        onChange={e => onBirthDateChange(e.target.value)}
        className={styles.dateInput}
      />
    </div>
  );
};

export default BirthDateInput;
