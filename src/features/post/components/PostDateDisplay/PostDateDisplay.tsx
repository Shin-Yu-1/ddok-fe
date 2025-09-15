import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import relativeTime from 'dayjs/plugin/relativeTime';

import styles from './PostDateDisplay.module.scss';

dayjs.locale('ko');
dayjs.extend(relativeTime);

interface PostDateDisplayProps {
  date: string;
  label: string;
}

const PostDateDisplay = ({ date, label }: PostDateDisplayProps) => {
  const dateObj = dayjs(date);
  const now = dayjs();

  const isToday = dateObj.isSame(now, 'day');
  const isPast = dateObj.isBefore(now, 'day');

  const getStatusClass = () => {
    if (isToday) return 'today';
    if (isPast) return 'past';
    return 'future';
  };

  const getRelativeText = () => {
    if (isToday) return '오늘';
    if (isPast) return dateObj.fromNow();
    return dateObj.fromNow();
  };

  return (
    <div className={styles.container}>
      <p className={styles.label}>{label}</p>

      <div className={styles.dateInfo}>
        <div className={styles.mainDate}>{dateObj.format('YYYY년 MM월 DD일 (ddd)')}</div>

        <div className={`${styles.relativeDate} ${styles[getStatusClass()]}`}>
          {getRelativeText()}
        </div>
      </div>
    </div>
  );
};

export default PostDateDisplay;
