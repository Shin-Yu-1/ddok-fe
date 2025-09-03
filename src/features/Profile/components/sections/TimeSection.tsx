// 주활동시간
// 주활동시간

import { forwardRef } from 'react';

import { PencilSimpleIcon } from '@phosphor-icons/react';
import clsx from 'clsx';

import type { ProfileSectionProps } from '@/types/user';

import { formatTime } from '../../utils';

import styles from './TimeSection.module.scss';

interface TimeSectionProps extends ProfileSectionProps {
  className?: string;
}

const TimeSection = forwardRef<HTMLElement, TimeSectionProps>(
  ({ user, isEditable = false, onEdit, className }, ref) => {
    const handleEdit = () => {
      if (isEditable && onEdit) {
        onEdit('time');
      }
    };

    const getTimeRange = () => {
      const start = formatTime(user.activeHours.start);
      const end = formatTime(user.activeHours.end);
      return `${start} - ${end}`;
    };

    return (
      <section
        ref={ref}
        className={clsx(styles.timeSection, className)}
        aria-labelledby="time-title"
      >
        <div className={styles.header}>
          <h2 id="time-title" className={styles.title}>
            주활동 시간
          </h2>

          {isEditable && (
            <button
              type="button"
              onClick={handleEdit}
              className={styles.editButton}
              aria-label="활동 시간 수정"
            >
              <PencilSimpleIcon size={21} weight="regular" />
            </button>
          )}
        </div>

        <div>
          <div className={styles.timeDisplay}>
            <span className={styles.timeLabel}>[ 주 활동 시간]</span>
            <span className={styles.timeRange}>{getTimeRange()}</span>
          </div>
        </div>
      </section>
    );
  }
);

TimeSection.displayName = 'TimeSection';
export default TimeSection;
