import styles from './ActiveTimeSelector.module.scss';

interface ActiveTimeSelectorProps {
  activeHours: { start: string; end: string };
  onActiveHoursChange: (hours: { start: string; end: string }) => void;
}

const ActiveTimeSelector = ({ activeHours, onActiveHoursChange }: ActiveTimeSelectorProps) => {
  const startTime = activeHours.start || '00:00';
  const endTime = activeHours.end || '00:00';

  const formatTimeWithInput = (time: string, isStart: boolean) => {
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

      if (isStart) {
        onActiveHoursChange({ ...activeHours, start: newTime });
      } else {
        onActiveHoursChange({ ...activeHours, end: newTime });
      }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      let newHour = e.target.value;

      if (newHour === '') {
        newHour = '00';
      } else {
        newHour = newHour.padStart(2, '0');
      }

      const newTime = `${newHour}:${minute}`;

      if (isStart) {
        onActiveHoursChange({ ...activeHours, start: newTime });
      } else {
        onActiveHoursChange({ ...activeHours, end: newTime });
      }
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
      <>
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
        <span>:{minute}</span>
      </>
    );
  };

  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>당신의 활동 시간을 입력해주세요</h2>
      <div className={styles.timeDisplay}>
        {formatTimeWithInput(startTime, true)} - {formatTimeWithInput(endTime, false)}
      </div>
    </div>
  );
};

export default ActiveTimeSelector;
