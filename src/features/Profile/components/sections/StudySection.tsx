// 스터디 이력
// 스터디 이력

import { forwardRef } from 'react';

import clsx from 'clsx';

import type { ProfileSectionProps } from '@/types/user';

import { useShowMore } from '../../hooks';
import { formatDateRange, getStatusText } from '../../utils';

import styles from './StudySection.module.scss';

interface StudySectionProps extends ProfileSectionProps {
  className?: string;
}

const StudySection = forwardRef<HTMLElement, StudySectionProps>(({ user, className }, ref) => {
  const { showAll, handleToggleShowAll, getDisplayItems, hasMoreItems, getShowMoreText } =
    useShowMore(3);

  if (!user.participationHistory) {
    return null;
  }

  // 스터디만 필터링
  const studies = user.participationHistory.filter(item => item.type === 'study');

  if (studies.length === 0) {
    return null;
  }

  // 처음에는 3개만 표시, "Show more study" 클릭시 전체 표시
  const displayedStudies = getDisplayItems(studies);
  const hasMore = hasMoreItems(studies);

  return (
    <section
      ref={ref}
      className={clsx(styles.studySection, className)}
      aria-labelledby="study-title"
    >
      <div className={styles.header}>
        <h2 id="study-title" className={styles.title}>
          스터디
        </h2>
      </div>

      <div>
        <div className={styles.studyList}>
          {displayedStudies.map(study => (
            <div key={study.id} className={styles.studyItem}>
              <div className={styles.studyIcon}>📚</div>

              <div className={styles.studyInfo}>
                <h3 className={styles.studyTitle}>{study.title}</h3>
                <p className={styles.studyDate}>
                  {formatDateRange(study.startDate, study.endDate)}
                </p>
              </div>

              <div className={styles.studyStatus}>
                <span className={clsx(styles.statusBadge, styles[`status-${study.status}`])}>
                  {getStatusText(study.status, 'study')}
                </span>
              </div>
            </div>
          ))}
        </div>

        {hasMore && (
          <div className={styles.showMoreContainer}>
            <button type="button" onClick={handleToggleShowAll} className={styles.showMoreButton}>
              {getShowMoreText(showAll, 'study')}
            </button>
          </div>
        )}
      </div>
    </section>
  );
});

StudySection.displayName = 'StudySection';
export default StudySection;
