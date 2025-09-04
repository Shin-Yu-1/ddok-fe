import dayjs from 'dayjs';
import 'dayjs/locale/ko';

import styles from './PostDurationDisplay.module.scss';

dayjs.locale('ko');

interface PostDurationDisplayProps {
  months: number;
  startDate: string;
}

const PostDurationDisplay = ({ months, startDate }: PostDurationDisplayProps) => {
  const start = dayjs(startDate);
  const end = start.add(months, 'month');
  const totalDays = end.diff(start, 'day');

  const getDurationClass = () => {
    if (months <= 1) return 'short';
    if (months <= 6) return 'medium';
    return 'long';
  };

  return (
    <div className={styles.container}>
      <div className={styles.durationInfo}>
        <div className={styles.mainDuration}>
          <span className={styles.months}>{months}</span>
          <span className={styles.unit}>개월</span>
        </div>

        <div className={`${styles.durationTag} ${styles[getDurationClass()]}`}>
          {months <= 1 ? '단기' : months <= 6 ? '중기' : '장기'}
        </div>
      </div>

      <div className={styles.periodInfo}>
        <div className={styles.periodText}>
          {start.format('YYYY.M.D')} ~ {end.format('YYYY.M.D')}
        </div>
        <div className={styles.totalDays}>총 {totalDays}일 진행</div>
      </div>
    </div>
  );
};

export default PostDurationDisplay;
