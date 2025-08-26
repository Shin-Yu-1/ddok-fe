import styles from './ActiveTimeSelector.module.scss';

interface ActiveTimeSelectorProps {
  activeHours: { start: string; end: string };
  onActiveHoursChange: (hours: { start: string; end: string }) => void;
}

const ActiveTimeSelector = ({ activeHours, onActiveHoursChange }: ActiveTimeSelectorProps) => {
  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>당신의 활동 시간을 입력해주세요</h2>
      <div className={styles.timeInputContainer}>
        <input
          type="time"
          value={activeHours.start}
          onChange={e => onActiveHoursChange({ ...activeHours, start: e.target.value })}
          className={styles.timeInput}
        />
        <span className={styles.timeSeparator}>-</span>
        <input
          type="time"
          value={activeHours.end}
          onChange={e => onActiveHoursChange({ ...activeHours, end: e.target.value })}
          className={styles.timeInput}
        />
      </div>
    </div>
  );
};

export default ActiveTimeSelector;
