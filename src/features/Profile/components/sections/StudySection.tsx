// 스터디 이력
// 스터디 이력

import { forwardRef } from 'react';

import clsx from 'clsx';

import type { ProfileSectionProps } from '@/types/user';

import { useInfiniteLoad } from '../../hooks';
import { formatDateRange, getStatusText } from '../../utils';

import styles from './StudySection.module.scss';

interface StudySectionProps extends ProfileSectionProps {
  className?: string;
}

const StudySection = forwardRef<HTMLElement, StudySectionProps>(({ user, className }, ref) => {
  const initialStudies = user.studies || [];
  const {
    items: studies,
    isLoading,
    hasMore,
    loadMore,
    getShowMoreText,
  } = useInfiniteLoad(user.userId, 'studies', initialStudies);

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
        {studies.length > 0 ? (
          <>
            <div className={styles.studyList}>
              {studies.map(study => (
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
                <button
                  type="button"
                  onClick={loadMore}
                  disabled={isLoading}
                  className={styles.showMoreButton}
                >
                  {getShowMoreText()}
                </button>
              </div>
            )}
          </>
        ) : (
          <div>
            <p>참여한 스터디가 없습니다.</p>
          </div>
        )}
      </div>
    </section>
  );
});

StudySection.displayName = 'StudySection';
export default StudySection;
