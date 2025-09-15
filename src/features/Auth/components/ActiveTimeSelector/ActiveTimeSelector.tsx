import TimeRangeDisplay from '@/components/TimeRangeDisplay/TimeRangeDisplay';

import styles from './ActiveTimeSelector.module.scss';

interface ActiveTimeSelectorProps {
  activeHours: { start: string; end: string };
  onActiveHoursChange: (hours: { start: string; end: string }) => void;
  title?: string;
}

const ActiveTimeSelector = ({
  activeHours,
  onActiveHoursChange,
  title = '당신의 활동 시간을 입력해주세요',
}: ActiveTimeSelectorProps) => {
  const startTime = activeHours.start || '00:00';
  const endTime = activeHours.end || '00:00';

  const handleStartTimeChange = (time: string) => {
    onActiveHoursChange({ ...activeHours, start: time });
  };

  const handleEndTimeChange = (time: string) => {
    onActiveHoursChange({ ...activeHours, end: time });
  };

  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      <TimeRangeDisplay
        startTime={startTime}
        endTime={endTime}
        onStartTimeChange={handleStartTimeChange}
        onEndTimeChange={handleEndTimeChange}
      />
    </div>
  );
};

export default ActiveTimeSelector;
