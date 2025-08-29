import styles from './TimeInput.module.scss';

interface TimeInputProps {
  time: string;
  onTimeChange: (time: string) => void;
}

const TimeInput = ({ time, onTimeChange }: TimeInputProps) => {
  const [hour, minute] = time.split(':');

  const handleHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newHour = e.target.value;

    newHour = newHour.replace(/[^0-9]/g, '');

    if (newHour !== '') {
      const hourNum = parseInt(newHour);
      if (hourNum > 23) {
        newHour = '23';
      }
    }

    const newTime = `${newHour || '00'}:${minute}`;
    onTimeChange(newTime);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    let newHour = e.target.value;

    if (newHour === '') {
      newHour = '00';
    } else {
      newHour = newHour.padStart(2, '0');
    }

    const newTime = `${newHour}:${minute}`;
    onTimeChange(newTime);
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' || e.key === 'Delete') {
      const target = e.target as HTMLInputElement;
      target.value = '';
    }
  };

  return (
    <span className={styles.timeInput}>
      <input
        type="text"
        value={hour}
        onChange={handleHourChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={styles.hourInput}
        maxLength={2}
        pattern="[0-9]*"
      />
      <span className={styles.minute}>:{minute}</span>
    </span>
  );
};

export default TimeInput;
