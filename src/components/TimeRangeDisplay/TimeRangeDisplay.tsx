import TimeInput from '@/components/TimeInput/TimeInput';

import styles from './TimeRangeDisplay.module.scss';

interface TimeRangeDisplayProps {
  startTime: string;
  endTime: string;
  onStartTimeChange: (time: string) => void;
  onEndTimeChange: (time: string) => void;
}

const TimeRangeDisplay = ({
  startTime,
  endTime,
  onStartTimeChange,
  onEndTimeChange,
}: TimeRangeDisplayProps) => {
  return (
    <div className={styles.timeDisplay}>
      <TimeInput time={startTime} onTimeChange={onStartTimeChange} />
      <span className={styles.separator}> - </span>
      <TimeInput time={endTime} onTimeChange={onEndTimeChange} />
    </div>
  );
};

export default TimeRangeDisplay;
